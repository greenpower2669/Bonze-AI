#!/usr/bin/env node
/* BONZE-064 development replay only. BONZE-063 scripts are already known.
 * This is a causal diagnostic for subject drift, not unseen generalization.
 */
import {readFileSync,writeFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {dialogues,makeOptions} from '../tests/fixtures/bonze063-prospective.mjs';
const vm={};
for(const mod of ['non-neural-arbiter.js','safety-priority.js','preference-arbiter.js','topic-anchor.js'])
 runInNewContext(readFileSync(new URL('../core/'+mod,import.meta.url),'utf8'),vm,{timeout:3000,filename:mod});
const variants=['baseline-self','preference-self','preference-teacher','symbolic-anchor'];
const rows=[],sessions=[];
const started=process.hrtime.bigint();
for(const variant of variants)for(let session=0;session<2;session++)
 for(let rotation=0;rotation<4;rotation++){
  let reply='',correct=0,longest=0,current=0,firstError=null;
  const anchor=vm.BonzeTopicAnchor.createSession();
  for(let step=0;step<20;step++){
   const item=makeOptions(session,step);
   const options=item.options.slice(rotation).concat(item.options.slice(0,rotation));
   const expected=(item.expected+4-rotation)%4;
   const context=variant==='preference-teacher'?(step?dialogues[session][step-1].answer:''):reply;
   let result;
   if(variant==='symbolic-anchor')
    result=anchor.step({text:item.text,options,context});
   else{
    const scorer=variant==='baseline-self'?vm.BonzeNonNeuralArbiter.rank:vm.BonzePreferenceArbiter.rank;
    result=scorer({text:item.text,options,context});
   }
   const valid=result.index>=0&&result.index<4;
   const accurate=result.index===expected&&result.reason!=='safety-priority';
   rows.push({variant,session:session+1,rotation,turn:step+1,id:item.id,
    expected,selected:result.index,reason:result.reason,accurate,
    anchorTopic:variant==='symbolic-anchor'?result.topic:null});
   if(accurate){correct++;current++;longest=Math.max(longest,current);}
   else{current=0;if(firstError===null)firstError=step+1;}
   if(variant!=='preference-teacher'&&valid)reply=options[result.index];
  }
  sessions.push({variant,session:session+1,rotation,correct,
   firstError,longestConsecutive:longest,perfect:correct===20});
 }
const summaries=variants.map(variant=>{
 const r=rows.filter(x=>x.variant===variant);
 return {variant,trials:r.length,correct:r.filter(x=>x.accurate).length,
  accuracyPct:+(100*r.filter(x=>x.accurate).length/r.length).toFixed(1),
  abstentions:r.filter(x=>x.selected===-1).length,
  wrongIndices:r.filter(x=>x.selected>=0&&!x.accurate).length,
  perfectSessions:sessions.filter(x=>x.variant===variant&&x.perfect).length};
});
const report={
 status:'Experimental only, already-inspected 20-turn scripts. No Android integration.',
 scriptedTurns:40,rotations:4,decisions:rows.length,
 caveats:[
  'These are two prewritten story scripts repeatedly permuted, not independent conversations.',
  'The topic-anchor design was motivated by errors seen in BONZE-063: this is a development/regression measurement, NOT an unbiased holdout.',
  'Self mode reuses the prior chosen response; anchor mode stores only the last explicitly selected topic.',
  'The anchor intentionally sacrifices fine-grained story content, events, or characters. It does not implement Android memory, continuity of facts, or spoken interaction.',
  'The independent safety gate is incomplete and its responses require human validation before deployment.',
  'No measured performance or behavior on a Samsung device.'
 ],elapsedMs:+(Number(process.hrtime.bigint()-started)/1e6).toFixed(3),
 summaries,sessions,rows
};
writeFileSync('bonze064-results.json',JSON.stringify(report,null,2)+'\n');
writeFileSync('bonze064-decisions.jsonl',rows.map(x=>JSON.stringify(x)).join('\n')+'\n');
let md='# BONZE-064 — ancre symbolique du sujet et propagation des erreurs\n\n';
md+='La réponse précédente ne doit pas devenir automatiquement la vérité de l’histoire. Le nouveau prototype mémorise uniquement une **étiquette de sujet confirmée**. Les deux scripts BONZE-063 ont déjà été inspectés, donc ce test est une régression de développement, pas un test aveugle.\n\n';
md+='| Méthode | Tours corrects / 160 | % | Sessions 20/20 | Abstentions | Mauvais choix |\n|---|---:|---:|---:|---:|---:|\n';
for(const s of summaries)md+='| '+s.variant+' | '+s.correct+'/160 | '+s.accuracyPct+' % | '+s.perfectSessions+'/8 | '+s.abstentions+' | '+s.wrongIndices+' |\n';
md+='\n## Première erreur par histoire et rotation\n\n| Méthode | Histoire | Rotation | Premier tour fautif | Bonnes réponses |\n|---|---:|---:|---|---:|\n';
for(const s of sessions)md+='| '+s.variant+' | '+s.session+' | '+s.rotation+' | '+(s.firstError??'aucune')+' | '+s.correct+'/20 |\n';
md+='\n## Ce que ces mesures ne prouvent pas\n';
for(const caveat of report.caveats)md+='- '+caveat+'\n';
writeFileSync('bonze064-report.md',md);
console.log('BONZE_064_RESULTS '+JSON.stringify({summaries:report.summaries,elapsedMs:report.elapsedMs}));
