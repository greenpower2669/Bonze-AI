#!/usr/bin/env node
/* BONZE-059: reproducible, non-neural offline relevance comparison.
 * "Ground truth" is hand-authored by the project's developer and needs
 * blind human annotation before it can support generalization claims.
 */
import {readFileSync,writeFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {expand,families,historical} from '../tests/fixtures/bonze059-french-cases.mjs';
const ctx={};
runInNewContext(readFileSync(new URL('../core/non-neural-arbiter.js',import.meta.url),'utf8'),ctx,{timeout:3000});
const arbiter=ctx.BonzeNonNeuralArbiter;
const examples=expand();
if(families.length!==22||historical.length!==11||examples.length!==99)
 throw Error('BONZE-059 corpus count mismatch');
const ids=new Set(examples.map(x=>x.id));
if(ids.size!==examples.length)throw Error('Duplicate case IDs');
const rows=[];
const start=process.hrtime.bigint();
for(const c of examples){
 if(c.options.length!==4||c.expected<0||c.expected>3)
  throw Error('Missing four-option reference for '+c.id);
 for(let shift=0;shift<4;shift++){
  const options=c.options.slice(shift).concat(c.options.slice(0,shift));
  const expected=(c.expected+4-shift)%4;
  const result=arbiter.rank({text:c.text,context:c.context,options});
  const selected=result.index;
  rows.push({case:c.id,family:c.family,source:c.source,intent:c.intent,
   shift,expected,selected,correct:selected===expected,
   abstained:selected===-1,margin:result.margin??null,reason:result.reason});
 }
}
const durationMs=Number(process.hrtime.bigint()-start)/1e6;
const sections=[
 {name:'all',rows},
 {name:'new-authored',rows:rows.filter(x=>x.source==='authored-paraphrase')},
 {name:'historic-11',rows:rows.filter(x=>x.source==='BONZE-057-reference')},
 ...[...new Set(examples.map(x=>x.intent))].map(x=>({name:'intent-'+x,rows:rows.filter(y=>y.intent===x)}))
];
const summary=sections.map(x=>{
 const total=x.rows.length,correct=x.rows.filter(y=>y.correct).length;
 const abstentions=x.rows.filter(y=>y.abstained).length;
 return {section:x.name,decisions:total,correct,accuracyPct:+(100*correct/total).toFixed(1),
  abstentions,coveragePct:+(100*(total-abstentions)/total).toFixed(1)};
});
const summaryByFamily=[...new Set(rows.map(x=>x.family))].map(f=>{
 const group=rows.filter(x=>x.family===f);
 return {family:f,correct:group.filter(x=>x.correct).length,total:group.length,
  abstentions:group.filter(x=>x.abstained).length};
});
const report={
 protocol:'BONZE-059 local lexical baseline; deterministic; no model weights or network',
 uniqueRequests:examples.length,authoredFamilies:families.length,historicalCases:historical.length,
 rotationsPerRequest:4,evaluatedDecisions:rows.length,
 chanceReferencePct:25,wallClockMs:+durationMs.toFixed(3),
 warnings:[
  'All reference answers are author-labeled; examples are partly paraphrases and rotations, not independent observations.',
  'The alias and heuristic vocabulary were crafted in the same project as the authored evaluation set; no blinded evaluation.',
  'Benchmark CPU timing is a single process run, not a comparable latency measurement against the Linux GGUF.',
  'Abstention counts as incorrect in accuracy; it is separately reported as a safety/uncertainty behavior.',
  'No Android code, voice or GGUF is evaluated by this benchmark.'
 ],summary,summaryByFamily,rows
};
writeFileSync('bonze059-diagnostics.json',JSON.stringify(report,null,2)+'\n');
writeFileSync('bonze059-decisions.jsonl',rows.map(x=>JSON.stringify(x)).join('\n')+'\n');
let md='# BONZE-059 — arbitre lexical non génératif, CPU sans GGUF\n\n';
md+='Épreuve **exploratoire d’ingénierie**, sur 99 demandes françaises rédigées par le projet (22 familles × 4 paraphrases + 11 références BONZE-057). Les options sont tournées dans les quatre positions : 396 choix **corrélés** et non 396 conversations indépendantes.\n\n';
md+='| Sous-ensemble | Décisions | Choix attendus | Exactitude | Abstentions | Couverture de réponse |\n|---|---:|---:|---:|---:|---:|\n';
for(const s of summary)md+='| '+s.section+' | '+s.decisions+' | '+s.correct+' | '+s.accuracyPct+' % | '+s.abstentions+' | '+s.coveragePct+' % |\n';
md+='\n## Détail par famille\n\n| Famille | Choix attendus | Décisions | Abstentions |\n|---|---:|---:|---:|\n';
for(const s of summaryByFamily)md+='| '+s.family+' | '+s.correct+' | '+s.total+' | '+s.abstentions+' |\n';
md+='\n## Réserves impératives\n';
for(const caveat of report.warnings)md+='- '+caveat+'\n';
md+='\n**Référence aléatoire équilibrée : 25 %.** Les scores ne sont pas comparables statistiquement à C2 sans un protocole commun et des annotations externes. Le lexique et les exemples ont été conçus ensemble : le surajustement est probable. Ne pas installer cet arbitre dans l’APK tant que des tests indépendants ne confirment pas un réel gain.\n';
writeFileSync('bonze059-report.md',md);
console.log('BONZE_059_RESULT '+JSON.stringify({requests:examples.length,decisions:rows.length,
 accuracyPct:summary[0].accuracyPct,abstentions:summary[0].abstentions,
 historicalPct:summary[2].accuracyPct,wallClockMs:report.wallClockMs}));
