#!/usr/bin/env node
/* BONZE-070: evaluate frozen 37 pairs with existing BONZE-069 and the
 * new structured-fiction parser. No Android nor actual user data.
 */
import {readFileSync,writeFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {cases} from '../tests/fixtures/bonze070-structured-facts.mjs';
const v={};
for(const file of ['story-consistency.js','scene-facts.js','scene-ledger.js']){
 runInNewContext(readFileSync(new URL('../core/'+file,import.meta.url),'utf8'),v,{filename:file,timeout:3000});
}
if(cases.length!==37||new Set(cases.map(c=>c.id)).size!==37)throw Error('Frozen 37-case protocol drift');
const rows=[];
for(const [name,engine] of [
 ['bonze069-reference',v.BonzeStoryConsistency],
 ['bonze070-structured',v.BonzeSceneFacts]
]){
 for(const c of cases){
  const r=engine.check(c.prior,c.candidate);
  rows.push({engine:name,id:c.id,kind:c.kind,expected:c.conflict,predicted:r.conflict,
   correct:r.conflict===c.conflict,reason:r.reason});
 }
}
const summary=[];
for(const engine of ['bonze069-reference','bonze070-structured']){
 const r=rows.filter(x=>x.engine===engine);
 const m={tp:r.filter(x=>x.expected&&x.predicted).length,
  fn:r.filter(x=>x.expected&&!x.predicted).length,
  fp:r.filter(x=>!x.expected&&x.predicted).length,
  tn:r.filter(x=>!x.expected&&!x.predicted).length};
 summary.push({engine,counts:m,errors:r.filter(x=>!x.correct).map(x=>x.id)});
}
const report={status:'developer-authored frozen facts, no independent annotation',
 pairs:cases.length,summary,rows,
 caveats:[
  '37 prompts and labels were authored by this assistant before BONZE-070 implementation.',
  'The facts parser is a narrow allow-listed grammar, not a general French NLU engine.',
  'False means no conflict proven; it does not verify truth or coherence.',
  'These examples become development data after inspection. No new blind accuracy claims.',
  'The ledger is separately tested for delivery provenance; this comparison has no simulated host delivery.',
  'No Android, Piper, user data, personal memory or clinical-safety tests.'
 ]};
writeFileSync('bonze070-results.json',JSON.stringify(report,null,2)+'\n');
let md='# BONZE-070 — faits de fiction structurés, comparaison contrôlée\n\n';
md+='Jeu de 37 paires **rédigées par le projet, gelées avant code**. Aucune annotation humaine indépendante. Même jeu pour le moteur BONZE-069 et le prototype BONZE-070.\n\n';
md+='| Méthode | Conflits reconnus | Conflits manqués | Faux veto | Cas sans conflit démontré bien laissés ouverts |\n|---|---:|---:|---:|---:|\n';
for(const s of summary)md+='| '+s.engine+' | '+s.counts.tp+'/17 | '+s.counts.fn+' | '+s.counts.fp+' | '+s.counts.tn+'/20 |\n';
md+='\n## Cas manqués\n';
for(const s of summary)md+='\n'+s.engine+': '+(s.errors.join(', ')||'aucun')+'.\n';
md+='\n## Limites et précautions\n';
for(const c of report.caveats)md+='- '+c+'\n';
writeFileSync('bonze070-report.md',md);
console.log('BONZE_070_RESULT '+JSON.stringify({pairs:report.pairs,summary}));
