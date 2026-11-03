/* BONZE-068: first untouched evaluation of frozen 35 new story pairs.
 * The scorer is the existing BONZE-067, with no code tuning.
 */
import {readFileSync,writeFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {scenarios} from '../tests/fixtures/bonze068-new-scenes.mjs';
const vm={};
runInNewContext(readFileSync(new URL('../core/story-consistency.js',import.meta.url),'utf8'),vm,{timeout:3000});
if(scenarios.length!==35)throw Error('Fixture changed');
const rows=scenarios.map(c=>{
 const r=vm.BonzeStoryConsistency.check(c.previous,c.next);
 return {id:c.id,category:c.category,expected:c.conflict,observed:r.conflict,reason:r.reason,correct:r.conflict===c.conflict};
});
const matrix={
 tp:rows.filter(x=>x.expected&&x.observed).length,
 fn:rows.filter(x=>x.expected&&!x.observed).length,
 fp:rows.filter(x=>!x.expected&&x.observed).length,
 tn:rows.filter(x=>!x.expected&&!x.observed).length
};
const categories=[...new Set(rows.map(x=>x.category))].map(category=>{
 const local=rows.filter(x=>x.category===category);
 return {category,correct:local.filter(x=>x.correct).length,total:local.length,failures:local.filter(x=>!x.correct).map(x=>x.id)};
});
const report={model:'BONZE-067 unmodified',status:'prospective assistant-labeled challenge',
 size:scenarios.length,matrix,categories,rows,
 notes:[
  'The questions and labels are authored by the same assistant, not independently reviewed by a human.',
  'False means no contradiction is established, NOT a guarantee of narrative coherence.',
  'This baseline was frozen before looking at the outcomes; after inspecting it, this fixture becomes development data.',
  'No Android app, voice, memory store, or real dialogue evaluated.'
 ]};
writeFileSync('bonze068-baseline.json',JSON.stringify(report,null,2)+'\n');
let md='# BONZE-068 — diagnostic initial sur nouveaux pièges narratifs\n\n';
md+='Code BONZE-067 **inchangé**. Jeu de 35 paires fictives, 12 oppositions attendues et 23 cas sans contradiction démontrée. Étiquettes internes au projet, non validées par des évaluateurs indépendants.\n\n';
md+='| Vrais conflits reconnus | Conflits manqués | Faux veto | Absences de conflit reconnues |\n|---:|---:|---:|---:|\n';
md+='| '+matrix.tp+' | '+matrix.fn+' | '+matrix.fp+' | '+matrix.tn+' |\n\n';
md+='| Type de piège | Réussites | Total | Erreurs |\n|---|---:|---:|---|\n';
for(const x of categories)md+='| '+x.category+' | '+x.correct+' | '+x.total+' | '+(x.failures.join(', ')||'aucune')+' |\n';
md+='\n**Attention :** un test réussi ne montre pas qu’un agent comprend librement une histoire. La prudence doit primer : les transformations dans le temps ou les paroles rapportées peuvent être valides.\n';
for(const x of report.notes)md+='- '+x+'\n';
writeFileSync('bonze068-baseline.md',md);
console.log('BONZE_068_BASELINE '+JSON.stringify({matrix,categories}));
