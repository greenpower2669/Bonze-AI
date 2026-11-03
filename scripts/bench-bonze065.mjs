#!/usr/bin/env node
/* BONZE-065 frozen-source diagnostic. Cases are NEW but assistant-authored:
 * no independent/blinded scientific evidence. Never call it a safety test.
 */
import {readFileSync,writeFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {stories,choicesFor,safetyCases} from '../tests/fixtures/bonze065-unseen-protocol.mjs';
const vm={};
for(const name of ['non-neural-arbiter.js','safety-priority.js','preference-arbiter.js','topic-anchor.js'])
 runInNewContext(readFileSync(new URL('../core/'+name,import.meta.url),'utf8'),vm,{timeout:3000,filename:name});
if(stories.length!==3||stories.some(s=>s.length!==20)||safetyCases.length!==30)
 throw Error('BONZE-065 corpus count mismatch');
const ids=[...stories.flat().map(x=>x.id),...safetyCases.map(x=>x.id)];
if(new Set(ids).size!==90)throw Error('Duplicate IDs');
const trialRows=[],storySummaries=[],start=process.hrtime.bigint();
for(const mode of ['preference-teacher','preference-self','symbolic-anchor'])
 for(let story=0;story<3;story++)
  for(let rotation=0;rotation<4;rotation++){
   let last='',firstFailure=null,longest=0,streak=0;
   const anchor=vm.BonzeTopicAnchor.createSession();
   for(let step=0;step<20;step++){
    const sample=choicesFor(story,step);
    if(sample.options.length!==4||new Set(sample.options).size!==4)throw Error('Invalid choices '+sample.id);
    const options=sample.options.slice(rotation).concat(sample.options.slice(0,rotation));
    const expected=(sample.expectedIndex+4-rotation)%4;
    const context=mode==='preference-teacher'?(step?stories[story][step-1].expected:''):last;
    const r=mode==='symbolic-anchor'
     ?anchor.step({text:sample.text,context,options})
     :vm.BonzePreferenceArbiter.rank({text:sample.text,context,options});
    const correct=r.index===expected&&r.reason!=='safety-priority';
    const subjectCorrect=mode==='symbolic-anchor'?r.topic===sample.topic:null;
    trialRows.push({id:sample.id,mode,story:story+1,turn:step+1,rotation,
      expected,selected:r.index,correct,reason:r.reason,expectedTopic:sample.topic,
      symbolicTopic:mode==='symbolic-anchor'?r.topic:null,subjectCorrect});
    if(correct){streak++;longest=Math.max(longest,streak);}
    else {streak=0;if(firstFailure===null)firstFailure=step+1;}
    if(mode!=='preference-teacher'&&r.index>=0)last=options[r.index];
   }
   const session=trialRows.filter(x=>x.story===story+1&&x.rotation===rotation&&x.mode===mode);
   storySummaries.push({mode,story:story+1,rotation,
    correct:session.filter(x=>x.correct).length,
    firstFailure,longestCorrectStreak:longest,
    subjectCorrect:mode==='symbolic-anchor'?session.filter(x=>x.subjectCorrect).length:null});
  }
const stats=['preference-teacher','preference-self','symbolic-anchor'].map(mode=>{
 const a=trialRows.filter(x=>x.mode===mode),good=a.filter(x=>x.correct);
 return {mode,trials:a.length,correct:good.length,
  pct:+(100*good.length/a.length).toFixed(1),
  abstentions:a.filter(x=>x.selected===-1).length,
  wrongIndices:a.filter(x=>x.selected>=0&&!x.correct).length,
  perfectSessions:storySummaries.filter(x=>x.mode===mode&&x.correct===20).length,
  subjectCorrect:mode==='symbolic-anchor'?a.filter(x=>x.subjectCorrect).length:null};
});
const safetyRows=safetyCases.map(x=>{
 const r=vm.BonzeSafetyPriority.route(x.text);
 return {id:x.id,expected:x.expected,observed:r.priority,reason:r.reason,
  shouldReview:x.expected==='needs-review',
  match:x.expected==='needs-review'?null:x.expected===r.priority};
});
const strong=safetyRows.filter(x=>!x.shouldReview),ambiguous=safetyRows.filter(x=>x.shouldReview);
const safetySummary={
 referenceLabeled:strong.length,reviewRequired:ambiguous.length,
 matched:strong.filter(x=>x.match).length,missed:strong.filter(x=>!x.match).length,
 byReference:[...new Set(strong.map(x=>x.expected))].map(label=>{
  const r=strong.filter(x=>x.expected===label);
  return {label,total:r.length,correct:r.filter(x=>x.match).length,
   observed:r.map(x=>x.observed)};
 }),
 reviewObserved:ambiguous.map(x=>({id:x.id,observed:x.observed}))
};
const report={protocol:'BONZE-065 frozen code/new assistant-authored 3-story+30-review diagnostic',
 scripts:3,turnsPerScript:20,rotations:4,totalDialogueDecisions:trialRows.length,
 safetyExamples:safetyCases.length,
 caveats:[
  'The author created labels and candidates; not external human evaluation. The 3 scripts are 3 correlated story narratives, not 720 independent prompts.',
  'The source code of BONZE-064 and safety-priority BONZE-061 was not edited during this measurement.',
  'Topic accuracy and exact next-utterance accuracy measure separate things; topic memory cannot prove recall of event facts.',
  'Teacher mode receives the ideal prior reply; self and anchor modes use the model-selected prior reply (anchor also maintains topic symbolically).',
  'Safety labels are exploratory and NOT clinical. Ambiguous self-harm phrasing is marked needs-review rather than assigned an automatic correct answer.',
  'Do not use this experimental safety router for emergency response in the production Android app.',
  'Piper, phone RAM and real speech recognition were not measured.'
 ],elapsedMs:+(Number(process.hrtime.bigint()-start)/1e6).toFixed(3),
 dialogueSummary:stats,sessions:storySummaries,safetySummary,safetyRows,trialRows
};
writeFileSync('bonze065-results.json',JSON.stringify(report,null,2)+'\n');
writeFileSync('bonze065-dialogue.jsonl',trialRows.map(x=>JSON.stringify(x)).join('\n')+'\n');
writeFileSync('bonze065-safety.jsonl',safetyRows.map(x=>JSON.stringify(x)).join('\n')+'\n');
let md='# BONZE-065 — dialogue, mémoire de sujet et audit de risque (hors Android)\n\n';
md+='Nouveau corpus **créé par le projet**, pas annoté en aveugle par des humains : 3 histoires de 20 tours / quatre permutations / 3 variantes d’essai = 720 décisions dépendantes, et 30 formulations à examiner pour le filtre de sécurité. Aucun code d’arbitrage ou de sécurité modifié pendant l’exécution.\n\n';
md+='| Méthode | Exactes | Total | % | Abstentions | Faux indices | Sessions parfaites |\n|---|---:|---:|---:|---:|---:|---:|\n';
for(const s of stats)md+='| '+s.mode+' | '+s.correct+' | '+s.trials+' | '+s.pct+' % | '+s.abstentions+' | '+s.wrongIndices+' | '+s.perfectSessions+'/12 |\n';
const a=stats.find(x=>x.mode==='symbolic-anchor');
md+='\nLe **sujet symbolique** est conforme à la référence sur '+a.subjectCorrect+'/'+a.trials+' décisions. Cela ne démontre pas la conservation d’événements, de personnages ou de relations.\n\n';
md+='## Erreurs des histoires\n\n| Méthode | Histoire | Rotation | Prem. erreur | Bons choix | Sujet correct |\n|---|---:|---:|---|---:|---:|\n';
for(const s of storySummaries)md+='| '+s.mode+' | '+s.story+' | '+s.rotation+' | '+(s.firstFailure??'aucune')+' | '+s.correct+'/20 | '+(s.subjectCorrect??'s.o.')+' |\n';
md+='\n## Audit de sécurité **non clinique**\n\n';
md+='Pour '+safetySummary.referenceLabeled+' textes à étiquette provisoire forte : '+safetySummary.matched+' correspondances, '+safetySummary.missed+' discordances. Pour '+safetySummary.reviewRequired+' énoncés ambigus, une revue humaine est obligatoire ; leur classement est affiché mais non noté comme vrai/faux.\n\n';
md+='| Catégorie attendue | Réussites | Nombre |\n|---|---:|---:|\n';
for(const x of safetySummary.byReference)md+='| '+x.label+' | '+x.correct+' | '+x.total+' |\n';
md+='\n**Discordances explicites :**\n';
for(const x of safetyRows.filter(x=>x.match===false))md+='- '+x.id+' : '+x.expected+' attendu, '+x.observed+' observé.\n';
md+='\n**Formulations nécessitant un examen humain :**\n';
for(const x of safetySummary.reviewObserved)md+='- '+x.id+' : '+x.observed+'.\n';
md+='\n## Limites et actions\n';
for(const v of report.caveats)md+='- '+v+'\n';
md+='\nNe pas intégrer un nouveau garde-fou en Android à partir de cette expérience. Après lecture des erreurs, ce corpus rejoint les régressions, pas un nouvel ensemble vierge.\n';
writeFileSync('bonze065-report.md',md);
console.log('BONZE_065_RESULT '+JSON.stringify({
 dialogue:stats,safety:safetySummary,elapsedMs:report.elapsedMs
}));
