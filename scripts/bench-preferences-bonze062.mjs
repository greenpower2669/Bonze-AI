#!/usr/bin/env node
/* BONZE-062 comparison on frozen, already-known BONZE-060 development cases.
 * Cases influenced design => diagnostic, not new independent generalization.
 */
import {readFileSync,writeFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {stressCases} from '../tests/fixtures/bonze060-stress-cases.mjs';
import {preferenceCases} from '../tests/fixtures/bonze062-preference-cases.mjs';
const ctx={};
for(const f of ['non-neural-arbiter.js','safety-priority.js','preference-arbiter.js'])
 runInNewContext(readFileSync(new URL('../core/'+f,import.meta.url),'utf8'),ctx,{filename:f,timeout:3000});
const old=ctx.BonzeNonNeuralArbiter.rank,updated=ctx.BonzePreferenceArbiter.rank;
function measure(samples,name){
 const rows=[];
 for(const item of samples)for(let rotation=0;rotation<4;rotation++){
  const options=item.options.slice(rotation).concat(item.options.slice(0,rotation));
  const expected=item.expected<0?-1:(item.expected+4-rotation)%4;
  const base=old({...item,options}),newer=updated({...item,options});
  rows.push({case:item.id,category:item.category||'new-preferences',rotation,expected,
   baseline:base.index,modified:newer.index,reason:newer.reason,
   baselineCorrect:base.index===expected,correct:newer.index===expected,
   baselineAbstained:base.index===-1,abstained:newer.index===-1});
 }
 const correct=rows.filter(r=>r.correct).length,base=rows.filter(r=>r.baselineCorrect).length;
 const safetyHandoffs=rows.filter(r=>r.reason==='safety-priority').length;
 const group=[...new Set(rows.map(r=>r.category))].map(category=>{
  const a=rows.filter(r=>r.category===category);
  return {category,count:a.length,baseline:a.filter(r=>r.baselineCorrect).length,
   modified:a.filter(r=>r.correct).length};
 });
 return {set:name,requests:samples.length,decisions:rows.length,
  baselineCorrect:base,correct,baselinePct:+(100*base/rows.length).toFixed(1),
  modifiedPct:+(100*correct/rows.length).toFixed(1),
  safetyHandoffs:safetyHandoffs,
  abstentions:rows.filter(r=>r.abstained).length,
  wrongChoices:rows.filter(r=>!r.correct&&!r.abstained).length,
  groups:group,rows};
}
const oldSet=measure(stressCases,'BONZE-060 prior adversarial diagnostics');
const newSet=measure(preferenceCases,'BONZE-062 authored preference unit cases');
const report={status:'experimental only, not Android',existing:oldSet,authored:newSet,
 warnings:[
  'BONZE-060 was used to define what BONZE-062 should fix: reuse as regression, not as blind validation.',
  'BONZE-062 tests are developer-authored unit cases; not independent human assessments.',
  'Rotations are correlated and must not be treated as independent conversations.',
  'Safety-priority remains an exploratory recognizer and is not a certified crisis safety system.',
  'No on-device performance, audio, memory or Liquid model was tested.'
 ]};
writeFileSync('bonze062-comparison.json',JSON.stringify(report,null,2)+'\n');
let md='# BONZE-062 — refus, préférences et changement de sujet\n\n';
for(const r of [oldSet,newSet]){
 md+='## '+r.set+'\n\n';
 md+='| Décisions | Ancien arbitre | Choix stricts avec préférences | Transferts urgents | Abstentions totales | Mauvais indices |\n';
 md+='|---:|---:|---:|---:|---:|---:|\n';
 md+='| '+r.decisions+' | '+r.baselineCorrect+' ('+r.baselinePct+' %) | '+r.correct+' ('+r.modifiedPct+' %) | '+r.safetyHandoffs+' | '+r.abstentions+' | '+r.wrongChoices+' |\n\n';
 md+='| Catégorie | Ancien / total | BONZE-062 / total |\n|---|---:|---:|\n';
 for(const a of r.groups)md+='| '+a.category+' | '+a.baseline+'/'+a.count+' | '+a.modified+'/'+a.count+' |\n';
 md+='\n';
}
md+='Les transferts urgents n’aboutissent pas à la sélection d’un indice : un routeur distinct doit rendre une réponse de sécurité. Ils ne sont donc pas intégrés aux choix strictement corrects.\n\n';
md+='Ces chiffres vérifient un **prototype co-développé et des cas de régression connus** ; aucun gain de compréhension générale prouvé. Les énoncés inconnus, multi-sujets ou contradictions ambiguës doivent pouvoir déclencher une abstention. Garde-fou de danger en amont, pas de publication Android.\n\n';
for(const w of report.warnings)md+='- '+w+'\n';
writeFileSync('bonze062-comparison.md',md);
console.log('BONZE_062_RESULT '+JSON.stringify({previous:{before:oldSet.baselineCorrect,after:oldSet.correct,total:oldSet.decisions},newCases:{before:newSet.baselineCorrect,after:newSet.correct,total:newSet.decisions}}));
