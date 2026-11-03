/* BONZE-069 — original unchanged detector on frozen editorial examples.
 * Output records only scenario IDs, statuses and reason codes.
 */
import {readFileSync,writeFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {challenge} from '../tests/fixtures/bonze069-quantifiers-anaphora.mjs';
const root={};
runInNewContext(readFileSync(new URL('../core/story-consistency.js',import.meta.url),'utf8'),root,{filename:'story-consistency.js',timeout:3000});
if(challenge.length!==49||new Set(challenge.map(x=>x.id)).size!==49)
 throw Error('Challenge count or identity drift');
const cases=challenge.map(x=>{
 const r=root.BonzeStoryConsistency.check(x.prior,x.candidate);
 return {id:x.id,kind:x.kind,expected:x.conflict,observed:r.conflict,
   correct:r.conflict===x.conflict,reason:r.reason};
});
const stats={
 tp:cases.filter(x=>x.expected&&x.observed).length,
 fn:cases.filter(x=>x.expected&&!x.observed).length,
 fp:cases.filter(x=>!x.expected&&x.observed).length,
 tn:cases.filter(x=>!x.expected&&!x.observed).length
};
const byKind=[...new Set(cases.map(x=>x.kind))].map(kind=>{
 const sub=cases.filter(x=>x.kind===kind);
 return {kind,count:sub.length,correct:sub.filter(x=>x.correct).length,
  misses:sub.filter(x=>!x.correct).map(x=>x.id)};
});
const report={protocol:'BONZE-069 editorial frozen 49 cases',module:'BONZE-067/068 unchanged',
 stats,byKind,cases,caveats:[
  'Labels drafted by the same assistant, not validated or annotated by an independent human.',
  'A false label means no contradiction established, NOT a guarantee of coherent fiction.',
  'This corpus is frozen before modifying core/story-consistency.js, and becomes development data once inspected.',
  'No real conversation, Android use, memory, speech or safety response measured.'
 ]};
writeFileSync('bonze069-baseline.json',JSON.stringify(report,null,2)+'\n');
let md='# BONZE-069 — baseline avant correction\n\n';
md+='| Conflits reconnus | Conflits manqués | Faux blocages | Cas laissés ouverts |\n';
md+='|---:|---:|---:|---:|\n| '+stats.tp+' | '+stats.fn+' | '+stats.fp+' | '+stats.tn+' |\n\n';
md+='| Catégorie | Réussis | Total | Échecs |\n|---|---:|---:|---|\n';
for(const item of byKind)
 md+='| '+item.kind+' | '+item.correct+' | '+item.count+' | '+(item.misses.join(', ')||'aucun')+' |\n';
md+='\nLes étiquettes sont **éditoriales**, et ce banc devient un test de développement après inspection. Une absence de contradiction prouvée n’est pas une validation de cohérence.\n';
writeFileSync('bonze069-baseline.md',md);
console.log('BONZE_069_BASELINE '+JSON.stringify({stats,byKind}));
