import {readFileSync,writeFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {choicesFor} from '../tests/fixtures/bonze065-unseen-protocol.mjs';
import {contradictionCases} from '../tests/fixtures/bonze067-contradictions.mjs';
function load(guard){
 const env={};
 const names=['non-neural-arbiter.js','safety-priority.js','preference-arbiter.js','topic-anchor.js'];
 if(guard)names.push('story-consistency.js');
 names.push('scene-anchor.js');
 for(const f of names)runInNewContext(readFileSync(new URL('../core/'+f,import.meta.url),'utf8'),env,{timeout:3000});
 return env;
}
const cases=load(true).BonzeStoryConsistency.check;
const probe=contradictionCases.map(x=>({id:x.id,expected:x.conflict,
 detected:cases(x.prior,x.candidate).conflict}));
const rows=[];
for(const guard of [false,true]){
 const env=load(guard),mode=guard?'guard':'original';
 for(let story=0;story<3;story++)for(let rotation=0;rotation<4;rotation++){
  const session=env.BonzeSceneAnchor.createSession();
  let last='';
  for(let turn=0;turn<20;turn++){
   const c=choicesFor(story,turn);
   const options=c.options.slice(rotation).concat(c.options.slice(0,rotation));
   const expected=(c.expectedIndex+4-rotation)%4;
   const r=session.step({text:c.text,options,context:last});
   rows.push({mode,story:story+1,rotation,turn:turn+1,
    expected,predicted:r.index,reason:r.reason,correct:r.index===expected});
   if(r.index>=0){
    last=options[r.index];
    if(!session.acknowledge(r.receipt))throw Error('receipt missing');
   }
  }
 }
}
const summary=['original','guard'].map(mode=>{
 const group=rows.filter(x=>x.mode===mode);
 return {mode,total:group.length,correct:group.filter(x=>x.correct).length,
  abstained:group.filter(x=>x.predicted===-1).length,
  wrong:group.filter(x=>x.predicted>=0&&!x.correct).length,
  vetoes:group.filter(x=>x.reason==='story-contradiction').length};
});
const confusion={tp:probe.filter(x=>x.expected&&x.detected).length,
 fn:probe.filter(x=>x.expected&&!x.detected).length,
 fp:probe.filter(x=>!x.expected&&x.detected).length,
 tn:probe.filter(x=>!x.expected&&!x.detected).length};
const data={summary,confusion,probe,rows,warnings:[
 'Frozen probe cases were written by the project, not human-blind labeled.',
 'The replay uses the already inspected BONZE-065 scripts.',
 'Four rotations of one story are correlated, not four independent dialogues.',
 'No conflict found does not mean the candidate is logically safe or correct.',
 'The gate abstains; it never creates new phrases or changes the Android application.'
]};
writeFileSync('bonze067-results.json',JSON.stringify(data,null,2)+'\n');
let md='# BONZE-067 — contradiction and regression\n\n';
md+='| Probe true positives | Missed conflicts | False alarms | No detected conflict |\n';
md+='|---:|---:|---:|---:|\n| '+confusion.tp+' | '+confusion.fn+' | '+confusion.fp+' | '+confusion.tn+' |\n\n';
md+='| Replay mode | Correct/240 | Abstentions | Wrong choices | Conflict vetoes |\n';
md+='|---|---:|---:|---:|---:|\n';
for(const x of summary)md+='| '+x.mode+' | '+x.correct+'/240 | '+x.abstained+' | '+x.wrong+' | '+x.vetoes+' |\n';
for(const w of data.warnings)md+='- '+w+'\n';
writeFileSync('bonze067-report.md',md);
console.log('BONZE_067_RESULT '+JSON.stringify({confusion,summary}));
