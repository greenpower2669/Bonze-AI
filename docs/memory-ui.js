/* Explicit private memory editor. No background access from a voice transcript.
 * The caller only keeps an encrypted vault envelope in its saved web state. */
import {createDrawers,drawerMap,remember,forget,recall} from '../core/memory-drawers.mjs';
import {encryptDrawers,decryptDrawers} from '../core/memory-vault.mjs';
export function setupMemoryUI({scope,getVault,saveVault,stop}){
 const el=id=>document.getElementById(id);
 let state=null,secret='',access=null,found=[];
 const status=s=>{el('memory-status').textContent=s};
 function lock(){
  state=null;secret='';access=null;found=[];
  el('memory-password').value='';el('memory-editor').hidden=true;
  el('memory-results').replaceChildren();
  el('memory-confirm').checked=false;status('Coffre verrouillé. Aucun souvenir privé n’est injecté dans les réponses vocales.');
 }
 async function persist(next){
  const encrypted=await encryptDrawers(next,access,secret);
  saveVault(encrypted);
  state=next;
 }
 function newId(){return 'm-'+Array.from(crypto.getRandomValues(new Uint8Array(12)),b=>b.toString(16).padStart(2,'0')).join('');}
 el('memory-unlock').addEventListener('click',async()=>{
  stop();lock();
  const pass=el('memory-password').value;
  // stop() intentionally locks first; retrieve secret from a fresh explicit input below.
  if(!pass){status('Entre ta phrase secrète.');return;}
  try{
   if(pass.length<12)throw Error('Phrase secrète de 12 caractères minimum');
   const envelope=getVault();
   const opened=envelope?await decryptDrawers(envelope,scope,pass):createDrawers(scope);
   const auth={verified:true,scope};
   if(!envelope){const created=await encryptDrawers(opened,auth,pass);saveVault(created);}
   state=opened;secret=pass;access=auth;el('memory-editor').hidden=false;
   status('Coffre ouvert : '+state.items.length+' souvenir(s). Consultation manuelle uniquement.');
  }catch(e){lock();status(e.message);}
  finally{el('memory-password').value='';}
 });
 el('memory-lock').addEventListener('click',lock);
 el('memory-add').addEventListener('click',async()=>{
  if(!state||!access){status('Ouvre d’abord le coffre.');return;}
  if(!el('memory-confirm').checked){status('Coche la confirmation pour enregistrer ce souvenir.');return;}
  try{
   const next=remember(state,access,{id:newId(),kind:el('memory-kind').value,
    text:el('memory-text').value,status:el('memory-trust').value,
    provenance:'human',confirmed:true,source:'saisie explicite'});
   await persist(next);el('memory-text').value='';el('memory-confirm').checked=false;
   status('Souvenir chiffré et enregistré. '+drawerMap(state,access).drawers[el('memory-kind').value].count+' dans ce tiroir.');
  }catch(e){status(e.message);}
 });
 el('memory-find').addEventListener('click',()=>{
  if(!state||!access){status('Coffre verrouillé.');return;}
  const result=recall(state,access,el('memory-query').value,{limit:3,budget:950});
  found=result.snippets;
  const root=el('memory-results');root.replaceChildren();
  for(const item of found){
   const p=document.createElement('p');p.textContent=item.kind+' · '+item.status+' · '+item.text;
   const remove=document.createElement('button');remove.type='button';remove.className='secondary-button';
   remove.textContent='Oublier ce souvenir';remove.setAttribute('aria-label','Oublier : '+item.text.slice(0,65));
   remove.addEventListener('click',async()=>{
    if(!state||!access||!el('memory-confirm').checked){status('Coche la confirmation avant de supprimer.');return;}
    try{await persist(forget(state,access,item.id));el('memory-confirm').checked=false;p.remove();status('Souvenir effacé du coffre local.');}
    catch(e){status(e.message);}
   });
   root.append(p,remove);
  }
  status(found.length+' résultat(s) pertinents affichés, sur '+result.considered+' candidats. Aucun rappel automatique.');
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)lock();});
 window.addEventListener('pagehide',lock);
 return {lock};
}
