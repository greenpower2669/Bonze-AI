// BONZE-031: transparent diagnostic only, NOT a linguistic or human-quality score.
import {readFileSync,writeFileSync} from 'node:fs';
const inputs=process.argv.slice(2);
if(!inputs.length)throw Error('Supply JSONL probe files');
const rows=[];
for(const name of inputs){
 for(const line of readFileSync(name,'utf8').trim().split('\n')){
  if(!line.trim())continue;
  const x=JSON.parse(line);
  if(!['R0','A1','A2','A3','C1'].includes(x.variant)||!Number.isFinite(x.latencyMs))throw Error('Invalid probe row');
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

const choiceRows=rows.filter(x=>x.variant==='C1');
const selection=[];
for(const model of [...new Set(choiceRows.map(x=>x.model))]){
 const entries=choiceRows.filter(x=>x.model===model);
 if(!entries.length)continue;
 const valid=entries.filter(x=>x.valid===true&&/^[0-3]$/.test(x.response));
 const correct=valid.filter(x=>Number(x.response)===x.expected);
 const mean=entries.reduce((sum,x)=>sum+x.endToEndMs,0)/entries.length;
 const invalidCases=entries.filter(x=>!valid.includes(x)).map(x=>x.case);
 const errors=valid.filter(x=>Number(x.response)!==x.expected).map(x=>x.case);
 selection.push({model,count:entries.length,valid:valid.length,
  correct:correct.length,accuracyPct:Number((100*correct.length/entries.length).toFixed(1)),
  meanEndToEndMs:Math.round(mean),invalidCases,errors});
}
let md='# Bonze 031 — diagnostics CPU exploratoires\n\n';
md+='Les mesures correspondent aux générations hôte Linux, **pas au Samsung**. Les indicateurs lexicaux ne constituent pas un score de qualité ou un jugement de sécurité. Comparer les réponses brutes et faire valider par Fab.\n\n';
md+='| Modèle | Variante | Scénarios | Latence moyenne (ms) | Salutations/auto-présentation | Sorties vides | Rappel du lac |\n|---|---|---:|---:|---:|---:|---|\n';
for(const r of table)md+='| '+r.model+' | '+r.variant+' | '+r.tests+' | '+r.meanMs+' | '+r.greetings+' | '+r.empty+' | '+r.pipoMemory+' |\n';
md+='\n## Variantes\nR0 = référence historique aplatie ; A1 = citations chronologiques ; A2 = sans contexte ; A3 = rôles natifs de llama.cpp (pas disponibles dans l’AAR actuel).\n';
md+='\n## BONZE-057 — sélection bornée dans un corpus contrôlé (Linux CPU)\n\n';
md+='Cette nouvelle épreuve évalue 11 questions fictives avec **une seule option évidente par cas** parmi quatre. Le modèle doit renvoyer uniquement 0, 1, 2 ou 3. Les candidats des scènes libres contiennent des distracteurs : **contrairement à la production BONZE-056**, qui garde les quatre formulations sur le même sujet. La mesure ne démontre ni intelligence générale ni qualité conversationnelle.\n\n';
md+='| Modèle | Cas | Indices valides | Choix attendus | Taux de choix attendus | Temps moyen aller-retour Linux (ms) |\n|---|---:|---:|---:|---:|---:|\n';
for(const s of selection)
 md+='| '+s.model+' | '+s.count+' | '+s.valid+' | '+s.correct+' | '+s.accuracyPct+' % | '+s.meanEndToEndMs+' |\n';
for(const s of selection)
 md+='\n'+s.model+' — sorties non conformes : '+(s.invalidCases.join(', ')||'aucune')+
 '; indices erronés : '+(s.errors.join(', ')||'aucun')+'.\n';
md+='\n**Important :** scores calculés par clés de correction prédéfinies, sans jugement humain ; latences CPU Linux et mémoire/CPU Android non comparables directement. Voir les JSONL pour toutes les réponses brutes.\n';
writeFileSync('bonze031-diagnostics.md',md);
console.log(md);
