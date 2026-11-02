/* BONZE-068 second-stage hard challenge, frozen without tuning model. */
import {readFileSync,writeFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {hardCases} from '../tests/fixtures/bonze068-hard-cases.mjs';
const ctx={};
runInNewContext(readFileSync(new URL('../core/story-consistency.js',import.meta.url),'utf8'),ctx,{timeout:3000});
const rows=hardCases.map(c=>{
 const got=ctx.BonzeStoryConsistency.check(c.prior,c.next);
 return {id:c.id,expected:c.expected,observed:got.conflict,
  reason:got.reason,correct:got.conflict===c.expected};
});
const counts={tp:rows.filter(x=>x.expected&&x.observed).length,
 fn:rows.filter(x=>x.expected&&!x.observed).length,
 fp:rows.filter(x=>!x.expected&&x.observed).length,
 tn:rows.filter(x=>!x.expected&&!x.observed).length};
const report={status:'new developer-authored diagnostic on unchanged BONZE-067',
 cases:rows.length,counts,rows,
 notes:[
  'The author who built these examples is not an independent human evaluator.',
  'The labels are editorial assumptions. Ambiguity about entity identity means no contradiction is proven.',
  'The source detector was NOT tuned during this measure.',
  'The scores describe only these examples, not spontaneous conversations or safety performance.',
  'These cases become development data after inspection.'
 ]};
writeFileSync('bonze068-hard-results.json',JSON.stringify(report,null,2)+'\n');
let md='# BONZE-068 — pièges narratifs difficiles\n\n';
md+='| Vraies contradictions repérées | Contradictions manquées | Faux veto | Cas sans conflit prouvé correctement laissés ouverts |\n|---:|---:|---:|---:|\n';
md+='| '+counts.tp+' | '+counts.fn+' | '+counts.fp+' | '+counts.tn+' |\n\n';
md+='## Toutes les erreurs\n\n';
for(const r of rows.filter(x=>!x.correct))md+='- '+r.id+' : attendu '+r.expected+', obtenu '+r.observed+' ('+r.reason+').\n';
md+='\nLes exemples sont rédigés par le projet, non annotés en aveugle. \`false\` signifie « non prouvé contradictoire », et jamais « phrase validée ».\n';
writeFileSync('bonze068-hard-results.md',md);
console.log('BONZE_068_HARD '+JSON.stringify({counts,errors:rows.filter(x=>!x.correct).map(x=>x.id)}));
