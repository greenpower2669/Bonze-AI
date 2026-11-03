/* BONZE-069 second-stage evaluation. The first-stage 49 cases influenced
 * development; these 32 cases were frozen after the correction and no
 * detector change may be made during their assessment.
 */
import {readFileSync,writeFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {challenges} from '../tests/fixtures/bonze069-holdout.mjs';
const env={};
runInNewContext(readFileSync(new URL('../core/story-consistency.js',import.meta.url),'utf8'),env,{timeout:3000});
if(challenges.length!==32||new Set(challenges.map(x=>x.id)).size!==32)
 throw Error('Second-stage challenge shape changed');
const cases=challenges.map(x=>{
 const r=env.BonzeStoryConsistency.check(x.prior,x.candidate);
 return {id:x.id,kind:x.kind,expected:x.conflict,observed:r.conflict,
  correct:r.conflict===x.conflict,reason:r.reason};
});
const confusion={
 tp:cases.filter(x=>x.expected&&x.observed).length,
 fn:cases.filter(x=>x.expected&&!x.observed).length,
 fp:cases.filter(x=>!x.expected&&x.observed).length,
 tn:cases.filter(x=>!x.expected&&!x.observed).length
};
const groups=[...new Set(cases.map(x=>x.kind))].map(kind=>{
 const rows=cases.filter(x=>x.kind===kind);
 return {kind,total:rows.length,correct:rows.filter(x=>x.correct).length,
  failures:rows.filter(x=>!x.correct).map(x=>x.id)};
});
const r={status:'second-stage, no source tuning, editor-labeled not blind',
 confusion,groups,cases,notes:[
  'All examples were created by the same assistant. They are not independently rated human conversations.',
  'Only 32 different pairs: no rotational pseudoreplication.',
  'The rule source was frozen before these results were inspected.',
  'False = no contradiction established, not a guarantee that the fiction is coherent.',
  'Preserve this result before any future detector changes; a future fix would reclassify it as development data.',
  'Neither Android memory nor speech nor clinical safety was assessed.'
 ]};
writeFileSync('bonze069-second-stage.json',JSON.stringify(r,null,2)+'\n');
let md='# BONZE-069 — seconde épreuve, sans réglage\n\n';
md+='| Contradictions reconnues | Manquées | Faux veto | Cas laissés ouverts |\n|---:|---:|---:|---:|\n';
md+='| '+confusion.tp+' | '+confusion.fn+' | '+confusion.fp+' | '+confusion.tn+' |\n\n';
md+='| Catégorie | Corrects | Total | Échecs |\n|---|---:|---:|---|\n';
for(const g of groups)md+='| '+g.kind+' | '+g.correct+' | '+g.total+' | '+(g.failures.join(', ')||'aucun')+' |\n';
for(const n of r.notes)md+='- '+n+'\n';
writeFileSync('bonze069-second-stage.md',md);
console.log('BONZE_069_SECOND_STAGE '+JSON.stringify({confusion,groups}));
