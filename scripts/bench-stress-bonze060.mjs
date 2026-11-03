#!/usr/bin/env node
/* BONZE-060: post-development adversarial stress test.
 * Labels are author-proposed rather than independently/blindly adjudicated.
 * Do not revise scoring rules in response to this frozen set and then call it held-out.
 */
import {readFileSync,writeFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {stressCases} from '../tests/fixtures/bonze060-stress-cases.mjs';

const context={};
runInNewContext(readFileSync(new URL('../core/non-neural-arbiter.js',import.meta.url),'utf8'),context,{timeout:3000});
const score=context.BonzeNonNeuralArbiter.rank;
if(stressCases.length!==50||new Set(stressCases.map(x=>x.id)).size!==50)
 throw Error('50 unique cases required');
const categories=['fiction','context','contrast','affect','meta'];
for(const category of categories)
 if(stressCases.filter(x=>x.category===category).length!==10)
  throw Error('Missing 10 cases for '+category);
const rows=[];
const begin=process.hrtime.bigint();
for(const c of stressCases){
 if(c.options.length!==4||!Number.isInteger(c.expected)||c.expected< -1||c.expected>3)
  throw Error('Invalid reference for '+c.id);
 for(let rotation=0;rotation<4;rotation++){
  const opts=c.options.slice(rotation).concat(c.options.slice(0,rotation));
  const expected=c.expected===-1?-1:(c.expected+4-rotation)%4;
  const outcome=score({text:c.text,context:c.context,options:opts});
  rows.push({case:c.id,category:c.category,rotation,answerable:expected!==-1,
   expected,predicted:outcome.index,correct:outcome.index===expected,
   abstained:outcome.index===-1,reason:outcome.reason,
   margin:outcome.margin??null});
 }
}
const elapsedMs=Number(process.hrtime.bigint()-begin)/1e6;
const stats=(set,tag)=>{
 const answerable=set.filter(x=>x.answerable),unknown=set.filter(x=>!x.answerable);
 return {set:tag,trials:set.length,correct:set.filter(x=>x.correct).length,
  accuracyPct:+(100*set.filter(x=>x.correct).length/set.length).toFixed(1),
  answerable:answerable.length,answerableCorrect:answerable.filter(x=>x.correct).length,
  answerableAbstentions:answerable.filter(x=>x.abstained).length,
  answerableAccuracyPct:answerable.length?+(100*answerable.filter(x=>x.correct).length/answerable.length).toFixed(1):null,
  unanswerable:unknown.length,correctAbstentions:unknown.filter(x=>x.abstained).length,
  unanswerableAbstainPct:unknown.length?+(100*unknown.filter(x=>x.abstained).length/unknown.length).toFixed(1):null,
  unsupportedConfidentAnswers:unknown.filter(x=>!x.abstained).length};
};
const sections=[stats(rows,'all'),...categories.map(c=>stats(rows.filter(x=>x.category===c),c))];
const cases=stressCases.map(c=>{
 const all=rows.filter(x=>x.case===c.id);
 return {id:c.id,category:c.category,answerable:c.expected!==-1,
  correct:all.filter(x=>x.correct).length,total:all.length,
  errors:all.filter(x=>!x.correct).map(x=>({rotation:x.rotation,
   expected:x.expected,predicted:x.predicted,reason:x.reason}))};
});
const result={
 method:'BONZE-060 frozen author-written stress challenge; lexical engine unchanged',
 labeledRequests:50,rotations:4,decisions:200,
 warnings:[
  'Author-created stress data; not independent human annotation or a blinded scientific assessment.',
  'Rotations are correlated; report accuracy over 50 distinct cases as well as over 200 decisions.',
  '13 unanswerable prompts intentionally require abstention; random 25% accuracy is not an overall reference.',
  'Scorer is not an emergency response system; safety-critical failures must be checked by human evaluation.',
  'No modifications of Android production code, no voice, no neural model.'
 ],
 durationMs:+elapsedMs.toFixed(3),sections,cases,rows
};
writeFileSync('bonze060-stress.json',JSON.stringify(result,null,2)+'\n');
writeFileSync('bonze060-decisions.jsonl',rows.map(x=>JSON.stringify(x)).join('\n')+'\n');
let report='# BONZE-060 — stress français hors lexique et anti-surajustement\n\n';
report+='Les étiquettes sont des **propositions rédigées par le projet**, et non une annotation humaine indépendante. Code BONZE-059 **gelé** avant ce test. 50 requêtes (5 catégories de 10), 4 rotations par requête : 200 décisions corrélées.\n\n';
report+='| Groupe | Décisions | Correctes | Exactitude | Correctes si réponse possible | Abstentions attendues respectées | Mauvaises réponses sans preuve |\n|---|---:|---:|---:|---:|---:|---:|\n';
for(const s of sections)
 report+='| '+s.set+' | '+s.trials+' | '+s.correct+' | '+s.accuracyPct+' % | '+s.answerableCorrect+'/'+s.answerable+' | '+s.correctAbstentions+'/'+s.unanswerable+' | '+s.unsupportedConfidentAnswers+' |\n';
report+='\n**Note :** la référence aléatoire de 25 % s’applique seulement aux cas où quatre propositions contiennent une seule bonne réponse, pas à l’abstention. Le score global mélange classement et détection d’incertitude.\n';
report+='\n## Demandes manquées (une ligne par requête, jusqu’à 4 rotations)\n';
for(const c of cases.filter(x=>x.correct<4))
 report+='- '+c.id+': '+c.correct+'/4 ; '+c.errors.map(x=>x.rotation+':'+x.predicted+' (attendu '+x.expected+')').join(', ')+'\n';
report+='\n## Limites\n';
for(const w of result.warnings)report+='- '+w+'\n';
report+='\nAucune adaptation sur ces échecs ne doit être présentée comme une nouvelle validation indépendante. Recueillir des énoncés et jugements humains inconnus avant le déploiement de l’arbitre.\n';
writeFileSync('bonze060-report.md',report);
console.log('BONZE_060_RESULT '+JSON.stringify({
 total:sections[0],categories:sections.slice(1),failedCases:cases.filter(x=>x.correct<4).length,
 elapsedMs:result.durationMs
}));
