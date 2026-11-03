/* BONZE-071 Android lab: visible, opt-in demonstration of BONZE-070.
 * Fiction only. No shared personal memory, no TTS, no network,
 * no storage. The UI confirms a delivered phrase synchronously.
 */
import '../core/scene-facts.js';
import '../core/scene-ledger.js';

export function setupSceneLab(){
 const byId=id=>document.getElementById(id);
 const pane=byId('scene-lab');
 if(!pane)return null;
 const engine=globalThis.BonzeSceneLedger;
 const lab=engine?.createLedger({maxEvents:8});
 const status=byId('scene-lab-result');
 const facts=byId('scene-lab-records');
 const reason={
  'exclusive-state':'Deux états incompatibles à cet instant.',
  'same-action-opposite-polarity':'Une action est à la fois affirmée et niée.',
  'never-versus-dated-past':'Une action datée contredit « jamais ».',
  'zero-versus-positive-quantity':'Une possession contredit « aucun ».',
  'different-fact-or-ambiguous-reference':'Personnage, objet ou référence à éclaircir.',
  'time-not-comparable':'Les moments ne sont pas comparables.',
  'different-actor':'Les personnages sont différents.',
  'unparsed':'Cette formulation dépasse encore notre petit vocabulaire.',
  'no-provable-conflict':'Aucune contradiction explicite démontrée.'
 };
 const seen=new Map();
 function show(message){
  status.textContent=message;
  facts.replaceChildren();
  const records=lab?.records()||[];
  const count=byId('scene-lab-count');
  count.textContent=records.length+' événement'+(records.length===1?'':'s')+' livré'+(records.length===1?'':'s')+' (mémoire volatile)';
  for(const item of records){
   const li=document.createElement('li');
   const f=item.fact;
   const summary=f
    ?[f.subject.replace(':',' '),f.predicate,f.object||'',f.quantity||'',f.time].filter(Boolean).join(' · ')
    :'phrase livrée, contenu non analysé';
   li.textContent='Tour '+item.turn+' · '+summary;
   facts.append(li);
  }
 }
 function add(text){
  if(!lab){show('Module de narration indisponible.');return;}
  const phrase=String(text||'').trim().slice(0,240);
  if(!phrase){show('Écris une phrase de fiction.');return;}
  const proposal=lab.propose(phrase);
  if(proposal.decision==='abstain'){
   show('⛔ Phrase non racontée : '+(reason[proposal.reason]||'contradiction explicite')+' La mémoire reste inchangée.');
   return;
  }
  // Visible UI delivery occurs before recording; this is NOT evidence
  // of audio delivery, only of this isolated laboratory display.
  byId('scene-lab-delivered').textContent='Bonze raconte : « '+phrase+' »';
  if(!lab.acknowledge(proposal.receipt)){
   show('Impossible de confirmer cette phrase.');return;
  }
  show((proposal.recognized?'✅ Fait fictif reconnu. ':'🟡 Phrase racontée, fait non reconnu. ')
   +'Le journal est en RAM et se réinitialise en quittant cette page.');
 }
 byId('scene-lab-first').addEventListener('click',()=>add(byId('scene-lab-prior').value));
 byId('scene-lab-check').addEventListener('click',()=>{
  if(!lab){show('Module indisponible.');return;}
  const phrase=byId('scene-lab-candidate').value.trim().slice(0,240);
  if(!phrase){show('Écris la phrase à tester.');return;}
  const result=lab.evaluate(phrase);
  show((result.conflict?'⛔ Contradiction détectée : ':'🔎 Contradiction non démontrée : ')
    +(reason[result.reason]||result.reason)+
    ' Cette analyse limitée ne garantit pas la cohérence.');
 });
 byId('scene-lab-deliver-next').addEventListener('click',()=>add(byId('scene-lab-candidate').value));
 byId('scene-lab-example-conflict').addEventListener('click',()=>{
  lab?.reset();
  byId('scene-lab-prior').value='Le robot possède une clé.';
  byId('scene-lab-candidate').value="Le robot n'a aucune clé.";
  byId('scene-lab-delivered').textContent='Aucune phrase racontée pour le moment.';
  show('Exemple prêt : raconte la première phrase, puis teste la suite contradictoire.');
 });
 byId('scene-lab-example-time').addEventListener('click',()=>{
  lab?.reset();
  byId('scene-lab-prior').value='Le robot possède une clé.';
  byId('scene-lab-candidate').value="Plus tard, le robot n'a aucune clé.";
  byId('scene-lab-delivered').textContent='Aucune phrase racontée pour le moment.';
  show('Exemple prêt : une évolution dans le temps peut être cohérente.');
 });
 byId('scene-lab-reset').addEventListener('click',()=>{
  lab?.reset();
  byId('scene-lab-delivered').textContent='Aucune phrase racontée pour le moment.';
  show('Mémoire de scène réinitialisée.');
 });
 show('Raconte la première phrase pour commencer. Cette démo est séparée de la voix et des souvenirs privés.');
 return lab;
}
