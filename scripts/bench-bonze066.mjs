#!/usr/bin/env node
/* BONZE-066: diagnostic replay using the already inspected BONZE-065 scripts.
 * Must never present these scores as independent, unseen generalization.
 */
import {readFileSync,writeFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {stories,choicesFor} from '../tests/fixtures/bonze065-unseen-protocol.mjs';
const ctx={};
for(const f of ['non-neural-arbiter.js','safety-priority.js','preference-arbiter.js','topic-anchor.js','scene-anchor.js'])
 runInNewContext(readFileSync(new URL('../core/'+f,import.meta.url),'utf8'),ctx,{timeout:3000,filename:f});
const rows=[],started=process.hrtime.bigint();
for(const mode of ['topic-only','topic-and-acknowledged-scene'])for(let story=0;story<3;story++)
 for(let rotation=0;rotation<4;rotation++){
  const session=mode==='topic-only'
   ?ctx.BonzeTopicAnchor.createSession():ctx.BonzeSceneAnchor.createSession();
  let priorText='';
  for(let turn=0;turn<20;turn++){
   const item=choicesFor(story,turn),options=item.options.slice(rotation).concat(item.options.slice(0,rotation));
   const expected=(item.expectedIndex+4-rotation)%4;
   const result=session.step({text:item.text,context:priorText,options});
   const correct=result.index===expected;
   rows.push({mode,story:story+1,rotation,turn:turn+1,id:item.id,
    expected,selected:result.index,correct,reason:result.reason,topic:result.topic});
   if(result.index>=0&&result.index<options.length){
    priorText=options[result.index];
    if(mode==='topic-and-acknowledged-scene'&&!session.acknowledge(result.receipt))
     throw Error('Could not acknowledge delivered candidate: '+item.id);
   }
  }
 }
const summary=['topic-only','topic-and-acknowledged-scene'].map(mode=>{
 const r=rows.filter(x=>x.mode===mode),correct=r.filter(x=>x.correct).length;
 const sessions=[];
 for(let story=1;story<=3;story++)for(let rotation=0;rotation<4;rotation++){
  const local=r.filter(x=>x.story===story&&x.rotation===rotation);
  sessions.push({story,rotation,correct:local.filter(x=>x.correct).length});
 }
 return {mode,trials:r.length,correct,accuracyPct:+(100*correct/r.length).toFixed(1),
  abstentions:r.filter(x=>x.selected===-1).length,
  wrongIndices:r.filter(x=>x.selected>=0&&!x.correct).length,
  perfectSessions:sessions.filter(x=>x.correct===20).length,
  sessions};
});
const report={experiment:'BONZE-066 session-scoped topic and scene memory',
 sourceCommit:'BONZE-065 scripts already analyzed',uniqueStories:3,
 repeatedTurns:60,rotations:4,trials:rows.length,summary,rows,
 elapsedMs:+(Number(process.hrtime.bigint()-started)/1e6).toFixed(3),
 caveats:[
  'Development regression only: the BONZE-065 stories are known to the experiment designer.',
  'Four rotations per turn are correlated, not independent conversations.',
  'A scene event is a prior assistant utterance, not a verified fact about the real user.',
  'The receipt is acknowledged immediately in this simulated host. Actual Android delivery callbacks are not measured.',
  'Safety recognition is an unrelated incomplete prototype; no deployment changes.',
  'No Liquid inference, voice, or device performance measured.'
 ]};
writeFileSync('bonze066-results.json',JSON.stringify(report,null,2)+'\n');
writeFileSync('bonze066-decisions.jsonl',rows.map(x=>JSON.stringify(x)).join('\n')+'\n');
let md='# BONZE-066 — mémoire de sujet + scène reconnue\n\n';
md+='Deux modes sur les **mêmes récits BONZE-065 déjà inspectés** (3 histoires de 20 tours, 4 rotations). Le nouvel état conserve la dernière phrase de fiction **uniquement après accusé de livraison**. Une réponse simplement envisagée ne devient jamais un événement de scène.\n\n';
md+='| Mode | Choix attendus | Décisions | Abstentions | Choix erronés | Sessions 20/20 |\n|---|---:|---:|---:|---:|---:|\n';
for(const x of summary)md+='| '+x.mode+' | '+x.correct+' | '+x.trials+' | '+x.abstentions+' | '+x.wrongIndices+' | '+x.perfectSessions+'/12 |\n';
md+='\n**Interprétation :** régression de développement, et non validation hors échantillon. L’ancre de thème seule peut être plus robuste si la phrase précédente était incorrecte ; la scène peut créer de nouvelles erreurs. Le module ne gère pas encore la narration structurée ni les personnes.\n';
for(const w of report.caveats)md+='- '+w+'\n';
writeFileSync('bonze066-report.md',md);
console.log('BONZE_066_RESULT '+JSON.stringify({summary,elapsedMs:report.elapsedMs}));