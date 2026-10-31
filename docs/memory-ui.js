/* Explicit private memory editor. No background access from a voice transcript.
 * The caller only keeps an encrypted vault envelope in its saved web state. */
import {createDrawers,drawerMap,remember,revise,forget,recall} from '../core/memory-drawers.mjs';
import {createFactMemory,addFact,toConfirmedDrawerItem} from '../core/memory-svc.mjs';
import {encryptDrawers,decryptDrawers} from '../core/memory-vault.mjs';
export function setupMemoryUI({scope,getVault,saveVault,stop}){
 const el=id=>document.getElementById(id);
 let state=null,secret='',access=null,found=[],epoch=0,editing=null,busy=false;
 const status=s=>{el('memory-status').textContent=s};
 function lock(){
  epoch++;state=null;secret='';access=null;found=[];editing=null;busy=false;
  for(const id of ['memory-subject','memory-verb','memory-complement'])el(id).value='';
  el('memory-svc-save').textContent='Enregistrer la fiche SVC';
  el('memory-password').value='';el('memory-editor').hidden=true;
  el('memory-results').replaceChildren();
  el('memory-confirm').checked=false;status('Coffre verrouillé. Aucun souvenir privé n’est injecté dans les réponses vocales.');
 }
 async function persist(next){
  if(busy)throw Error('Une opération de coffre est déjà en cours');
  busy=true;const issued=epoch;
  try{
   const encrypted=await encryptDrawers(next,access,secret);
   if(issued!==epoch)throw Error('Coffre verrouillé pendant cette opération');
   saveVault(encrypted);state=next;
  }finally{busy=false;}
 }
 function newId(){return 'm-'+Array.from(crypto.getRandomValues(new Uint8Array(12)),b=>b.toString(16).padStart(2,'0')).join('');}
 el('memory-unlock').addEventListener('click',async()=>{
  const pass=el('memory-password').value;
  stop();lock();
  const issued=epoch;
  // An older asynchronous unlock must never overwrite a later attempt.
  if(!pass){status('Entre ta phrase secrète.');return;}
  try{
   if(pass.length<12)throw Error('Phrase secrète de 12 caractères minimum');
   const envelope=getVault();
   const opened=envelope?await decryptDrawers(envelope,scope,pass):createDrawers(scope);
   const auth={verified:true,scope};
   if(!envelope){const created=await encryptDrawers(opened,auth,pass);if(issued!==epoch)return;saveVault(created);}
   if(issued!==epoch)return;
   state=opened;secret=pass;access=auth;el('memory-editor').hidden=false;
   status('Coffre ouvert : '+state.items.length+' souvenir(s). Consultation manuelle uniquement.');
  }catch(e){if(issued===epoch){lock();status(e.message);}}
  finally{if(issued===epoch)el('memory-password').value='';}
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
 function clearSVC(){
  editing=null;el('memory-svc-save').textContent='Enregistrer la fiche SVC';
  for(const id of ['memory-subject','memory-verb','memory-complement'])el(id).value='';
 }
 el('memory-svc-cancel').addEventListener('click',()=>{clearSVC();status('Modification annulée.');});
 el('memory-svc-save').addEventListener('click',async()=>{
  if(!state||!access){status('Ouvre le coffre avant de mémoriser.');return;}
  if(!el('memory-confirm').checked){status('Coche la confirmation explicite avant de mémoriser.');return;}
  const subject=el('memory-subject').value.trim(),verb=el('memory-verb').value.trim(),
   complement=el('memory-complement').value.trim(),kind=el('memory-kind').value,
   trust=el('memory-trust').value;
  const text=[subject,verb,complement].join(' '),svc={subject,verb,complement};
  try{
   let next;
   if(editing){
    next=revise(state,access,editing,{confirmed:true,text,svc,status:trust,kind});
   }else{
    const id=newId(),fresh=createFactMemory(scope);
    // The SVC validator proves field lengths/consent; remember() owns conflicts and encryption.
    const data=addFact(fresh,access,{id,subject,verb,complement,
     confirmed:true,status:trust==='observe'?'declare':trust,source:'human'});
    const card=toConfirmedDrawerItem(data,access,id,{kind,confirmed:true});
    next=remember(state,access,{...card,status:trust});
   }
   const wasEditing=Boolean(editing);
   await persist(next);clearSVC();el('memory-confirm').checked=false;
   status(wasEditing?'Fiche SVC corrigée et chiffrée.':'Fiche SVC enregistrée et chiffrée. Aucun rappel automatique.');
  }catch(error){status(error.message);}
 });
 el('memory-find').addEventListener('click',()=>{
  if(!state||!access){status('Coffre verrouillé.');return;}
  const result=recall(state,access,el('memory-query').value,{limit:3,budget:950});
  found=result.snippets;
  const root=el('memory-results');root.replaceChildren();
  for(const item of found){
   const p=document.createElement('p');p.textContent=item.kind+' · '+item.status+' · '+item.text;
   const existing=state.items.find(x=>x.id===item.id);
   if(existing?.svc){
    const edit=document.createElement('button');edit.type='button';edit.className='secondary-button';
    edit.textContent='Modifier cette fiche SVC';
    edit.addEventListener('click',()=>{
     editing=existing.id;el('memory-subject').value=existing.svc.subject;
     el('memory-verb').value=existing.svc.verb;el('memory-complement').value=existing.svc.complement;
     el('memory-kind').value=existing.kind;el('memory-trust').value=existing.status;
     el('memory-confirm').checked=false;el('memory-svc-save').textContent='Confirmer la modification SVC';
     el('memory-subject').focus();status('Fiche prête à corriger. Valide explicitement le changement.');
    });root.append(edit);
   }
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
