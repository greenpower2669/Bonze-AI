#!/usr/bin/env node
/* BONZE-070 second-stage, frozen after implementation and without tuning. */
import {readFileSync,writeFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {holdout} from '../tests/fixtures/bonze070-second-stage.mjs';
if(holdout.length!==32||new Set(holdout.map(x=>x.id)).size!==32)
 throw Error('Frozen second-stage case drift');
const root={};
for(const file of ['story-consistency.js','scene-facts.js'])
 runInNewContext(readFileSync(new URL('../core/'+file,import.meta.url),'utf8'),root,{filename:file,timeout:3000});
const rows=[];
for(const [engine,runner] of [['bonze069-reference',root.BonzeStoryConsistency],
                                ['bonze070-structured',root.BonzeSceneFacts]])
 for(const item of holdout){
  const out=runner.check(item.prior,item.candidate);
  rows.push({engine,id:item.id,kind:item.kind,
   expected:item.conflict,observed:out.conflict,
   correct:item.conflict===out.conflict,reason:out.reason});
 }
const summary=['bonze069-reference','bonze070-structured'].map(engine=>{
 const r=rows.filter(x=>x.engine===engine);
 return {engine,tp:r.filter(x=>x.expected&&x.observed).length,
  fn:r.filter(x=>x.expected&&!x.observed).length,
  fp:r.filter(x=>!x.expected&&x.observed).length,
  tn:r.filter(x=>!x.expected&&!x.observed).length,
  missed:r.filter(x=>!x.correct).map(x=>x.id)};
});
const result={dataset:'BONZE-070 second-stage, 32 developer-authored pairs',
 heldAfterCode:true,independentHumanReview:false,summary,rows,
 caveats:[
  'Examples and labels were authored by the same assistant: this is not independent blind testing.',
  'No changes to the structured detector were made after freezing this challenge and before measuring.',
  'A negative label means no contradiction established, never a certificate of coherence.',
  'New cases use different verbs, plural pronouns, new objects, discourse and time shifts.',
  'The result is not applicable to open conversations or Android, TTS, memory vault or clinical safety.',
  'Once inspected, this corpus becomes development data.'
 ]};
writeFileSync('bonze070-second-stage.json',JSON.stringify(result,null,2)+'\n');
let md='# BONZE-070 — seconde épreuve, sans adaptation\n\n';
md+='| Détecteur | Contradictions reconnues | Manquées | Faux veto | Cas laissés ouverts |\n|---|---:|---:|---:|---:|\n';
for(const m of summary)md+='| '+m.engine+' | '+m.tp+'/16 | '+m.fn+' | '+m.fp+' | '+m.tn+'/16 |\n';
md+='\nLes 32 paires ont été figées après le développement mais avant la mesure. Elles ne disposent d’aucune annotation humaine indépendante. Le programme n’a pas été adapté à leurs résultats.\n';
for(const m of summary)md+='\n**'+m.engine+' — erreurs :** '+(m.missed.join(', ')||'aucune')+'.\n';
for(const c of result.caveats)md+='- '+c+'\n';
writeFileSync('bonze070-second-stage.md',md);
console.log('BONZE_070_SECOND_STAGE '+JSON.stringify({summary}));
