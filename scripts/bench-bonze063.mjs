#!/usr/bin/env node
/* BONZE-063: prospective, developer-authored challenge created after freezing
 * BONZE-062. Both replay modes are harness simulations, not Android sessions.
 * Source is never tuned while running this challenge.
 */
import {readFileSync,writeFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {standalone,dialogues,makeOptions} from '../tests/fixtures/bonze063-prospective.mjs';
const vm={};
for(const name of ['non-neural-arbiter.js','safety-priority.js','preference-arbiter.js'])
 runInNewContext(readFileSync(new URL('../core/'+name,import.meta.url),'utf8'),vm,{timeout:3000,filename:name});
const engines={baseline:vm.BonzeNonNeuralArbiter.rank,preference:vm.BonzePreferenceArbiter.rank};
if(standalone.length!==32||dialogues.length!==2||dialogues.some(d=>d.length!==20))
 throw Error('BONZE-063 case count drift');
const idSet=new Set([...standalone.map(x=>x.id),...dialogues.flat().map(x=>x.id)]);
if(idSet.size!==72)throw Error('Duplicate input IDs');
for(const item of standalone){
 if(item.options.length!==4||![-2,-1,0,1,2,3].includes(item.expected))throw Error('Invalid standalone: '+item.id);
}
const results=[],started=process.hrtime.bigint();
function add(row,index,reason,expected){
 const handoff=reason==='safety-priority';
 const correct=expected===-2?handoff&&index===-1:
  expected===-1?index===-1&&!handoff:index===expected&&!handoff;
 results.push({...row,predicted:index,reason,expected,
  handoff,correct,abstained:index===-1&&!handoff,
  falseHandoff:handoff&&expected!==-2,
  safetyMiss:expected===-2&&!handoff});
}
for(const engine of Object.keys(engines)){
 const rank=engines[engine];
 for(const item of standalone)for(let rotation=0;rotation<4;rotation++){
  const options=item.options.slice(rotation).concat(item.options.slice(0,rotation));
  const expected=item.expected>=0?(item.expected+4-rotation)%4:item.expected;
  const r=rank({...item,options});
  add({set:'standalone',mode:'single',engine,id:item.id,category:item.category,rotation},r.index,r.reason,expected);
 }
 for(const mode of ['teacher','self'])for(let session=0;session<2;session++){
  for(let rotation=0;rotation<4;rotation++){
   let lastAnswer='';
   for(let step=0;step<20;step++){
    const item=makeOptions(session,step),previous=step?dialogues[session][step-1].answer:'';
    const context=mode==='teacher'?previous:lastAnswer;
    const options=item.options.slice(rotation).concat(item.options.slice(0,rotation));
    const expected=(item.expected+4-rotation)%4;
    const r=rank({text:item.text,context,options});
    add({set:'dialogue',mode,engine,session:session+1,turn:step+1,id:item.id,
      category:'story-'+(session+1),rotation,contextSource:mode},r.index,r.reason,expected);
    // Simulate the resulting short-term dialogue state. On abstention
    // there was no assistant answer; reuse last known response, not gold.
    if(mode==='self'&&r.index>=0)lastAnswer=options[r.index];
   }
  }
 }
}
function summarize(rows,engine,set,mode){
 const subset=rows.filter(x=>x.engine===engine&&x.set===set&&x.mode===mode);
 if(!subset.length)throw Error('No rows for '+engine+'/'+set+'/'+mode);
 const total=subset.length,correct=subset.filter(x=>x.correct).length;
 const answerable=subset.filter(x=>x.expected>=0),unknown=subset.filter(x=>x.expected===-1),
   danger=subset.filter(x=>x.expected===-2);
 return {engine,set,mode,trials:total,correct,accuracyPct:+(100*correct/total).toFixed(1),
  answerable:answerable.length,answerableCorrect:answerable.filter(x=>x.correct).length,
  ambiguous:unknown.length,properAbstention:unknown.filter(x=>x.correct).length,
  dangers:danger.length,properHandoff:danger.filter(x=>x.correct).length,
  missedDanger:danger.filter(x=>x.safetyMiss).length,
  falseHandoffs:subset.filter(x=>x.falseHandoff).length,
  unnecessaryAbstentions:answerable.filter(x=>x.abstained).length,
  wrongIndices:answerable.filter(x=>!x.correct&&!x.abstained&&!x.handoff).length};
}
const summaries=[];
for(const engine of Object.keys(engines)){
 summaries.push(summarize(results,engine,'standalone','single'));
 for(const mode of ['teacher','self'])summaries.push(summarize(results,engine,'dialogue',mode));
}
const firstErrors=[];
for(const engine of Object.keys(engines))for(const mode of ['teacher','self'])
 for(let session=1;session<=2;session++)for(let rotation=0;rotation<4;rotation++){
  const rows=results.filter(x=>x.engine===engine&&x.set==='dialogue'&&x.mode===mode&&x.session===session&&x.rotation===rotation);
  const first=rows.find(x=>!x.correct);
  const maxStreak=(()=>{
   let longest=0,current=0;
   for(const row of rows){current=row.correct?current+1:0;longest=Math.max(longest,current);}
   return longest;
  })();
  firstErrors.push({engine,mode,session,rotation,firstErrorTurn:first?.turn??null,
   correctTurns:rows.filter(x=>x.correct).length,maxConsecutiveCorrect:maxStreak});
 }
const errors=results.filter(r=>!r.correct);
const report={
 protocol:'BONZE-063 prospective developer-authored, frozen source; offline Linux Node',
 createdAfter:'BONZE-062 commit 5faa2047; code unchanged during evaluation',
 prompts:72,standalonePrompts:32,scriptedTurns:40,rotationsPerPrompt:4,
 caveats:[
  'The 72 prompts and answer keys are created by this assistant, not independently human-adjudicated.',
  'Four option rotations are correlated; success rate is not an independent sample accuracy.',
  'Teacher mode is given the preceding gold response; self mode uses preceding predicted response (or previous response if no selection).',
  'These are scripted 20-turn simulations, NOT tests of native Android conversation memory, audio, latency or user experience.',
  'Emergency detection is a simple, known-incomplete keyword rule; tests do not certify safety.',
  'The exact C2 model benchmarks use different data; percentages cannot establish a direct head-to-head superiority.',
  'Once inspected, these cases become regression/dev tests and must not be reused as unseen generalization evidence.'
 ],wallClockMs:+(Number(process.hrtime.bigint()-started)/1e6).toFixed(2),
 summaries,firstErrors,errorCount:errors.length,errors,results
};
writeFileSync('bonze063-results.json',JSON.stringify(report,null,2)+'\n');
writeFileSync('bonze063-decisions.jsonl',results.map(r=>JSON.stringify(r)).join('\n')+'\n');
let md='# BONZE-063 — dialogue et refus sur formulations prospectives\n\n';
md+='**Code BONZE-062 inchangé durant le test**. Corpus de 32 demandes isolées et 2 scripts de 20 tours, quatre rotations, comparés avec BONZE-059. Étiquettes créées par le projet, **pas** validation humaine indépendante.\n\n';
md+='| Moteur | Ensemble | Mode | Bons résultats | % | Abstentions inutiles | Mauvais choix | Urgences reconnues/présentes |\n';
md+='|---|---|---|---:|---:|---:|---:|---:|\n';
for(const s of summaries)md+='| '+s.engine+' | '+s.set+' | '+s.mode+' | '+s.correct+'/'+s.trials+' | '+s.accuracyPct+' % | '+s.unnecessaryAbstentions+' | '+s.wrongIndices+' | '+s.properHandoff+'/'+s.dangers+' |\n';
md+='\n## Premières erreurs et longueur de continuité (sur 20 tours)\n';
md+='| Moteur | Mode | Histoire | Rotation | Premier échec | Tours corrects | Meilleure séquence correcte |\n|---|---|---:|---:|---|---:|---:|\n';
for(const x of firstErrors)md+='| '+x.engine+' | '+x.mode+' | '+x.session+' | '+x.rotation+' | '+(x.firstErrorTurn??'aucun')+' | '+x.correctTurns+'/20 | '+x.maxConsecutiveCorrect+' |\n';
md+='\n## Réserves et erreurs\n';
for(const warning of report.caveats)md+='- '+warning+'\n';
for(const s of summaries){
 const failed=errors.filter(x=>x.engine===s.engine&&x.set===s.set&&x.mode===s.mode);
 md+='\n'+s.engine+'/'+s.set+'/'+s.mode+' : '+[...new Set(failed.map(x=>x.id))].join(', ')+'.\n';
}
writeFileSync('bonze063-report.md',md);
console.log('BONZE_063_SUMMARY '+JSON.stringify({
 prompts:report.prompts,decisions:results.length,wallClockMs:report.wallClockMs,
 summary:summaries.map(({engine,set,mode,correct,trials,missedDanger,unnecessaryAbstentions})=>({engine,set,mode,correct,trials,missedDanger,unnecessaryAbstentions}))
}));
