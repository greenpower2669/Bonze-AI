// BONZE-031: transparent diagnostic only, NOT a linguistic or human-quality score.
import {readFileSync,writeFileSync} from 'node:fs';
const inputs=process.argv.slice(2);
if(!inputs.length)throw Error('Supply JSONL probe files');
const rows=[];
for(const name of inputs){
 for(const line of readFileSync(name,'utf8').trim().split('\n')){
  if(!line.trim())continue;
  const x=JSON.parse(line);
  if(!['R0','A1','A2','A3'].includes(x.variant)||!Number.isFinite(x.latencyMs))throw Error('Invalid probe row');
  rows.push(x);
 }
}
const table=[];
for(const model of [...new Set(rows.map(x=>x.model))])for(const variant of ['R0','A1','A2','A3']){
 const found=rows.filter(x=>x.model===model&&x.variant===variant);
 if(!found.length)continue;
 const mean=Math.round(found.reduce((n,x)=>n+x.latencyMs,0)/found.length);
 const greetings=found.filter(x=>/\b(bonjour|je suis bonze ai|je suis (un|une) assistant|je suis l'ia)\b/i.test(x.response)).length;
 const empty=found.filter(x=>!x.response.trim()).length;
 const pipo=found.find(x=>x.case==='pipo_memoire');
 const recalled=!!pipo&&/\blac\b/i.test(pipo.response);
 table.push({model,variant,tests:found.length,meanMs:mean,greetings,empty,pipoMemory:recalled?'lac mentionné':'non confirmé'});
}
let md='# Bonze 031 — diagnostics CPU exploratoires\n\n';
md+='Les mesures correspondent aux générations hôte Linux, **pas au Samsung**. Les indicateurs lexicaux ne constituent pas un score de qualité ou un jugement de sécurité. Comparer les réponses brutes et faire valider par Fab.\n\n';
md+='| Modèle | Variante | Scénarios | Latence moyenne (ms) | Salutations/auto-présentation | Sorties vides | Rappel du lac |\n|---|---|---:|---:|---:|---:|---|\n';
for(const r of table)md+='| '+r.model+' | '+r.variant+' | '+r.tests+' | '+r.meanMs+' | '+r.greetings+' | '+r.empty+' | '+r.pipoMemory+' |\n';
md+='\n## Variantes\nR0 = référence historique aplatie ; A1 = citations chronologiques ; A2 = sans contexte ; A3 = rôles natifs de llama.cpp (pas disponibles dans l’AAR actuel).\n';
writeFileSync('bonze031-diagnostics.md',md);
console.log(md);
