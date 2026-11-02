import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {runInNewContext} from 'node:vm';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
const vm={};
for(const module of ['non-neural-arbiter.js','safety-priority.js','preference-arbiter.js','topic-anchor.js'])
 runInNewContext(readFileSync(new URL('../core/'+module,import.meta.url),'utf8'),vm,{timeout:3000});
const createSession=vm.BonzeTopicAnchor.createSession;
const options=['Le pirate ouvre son journal.','La tortue trouve son nuage.','Le robot ouvre une porte.','Le dragon se réveille.'];

test('BONZE-064: story topic survives an unrelated selected assistant answer',()=>{
 const s=createSession();
 const first=s.step({text:'Raconte une histoire de pirate.',options});
 assert.equal(first.topic,'pirate');
 assert.equal(first.index,0);
 // A real dialogue could have produced a mistaken robot response. The
 // session contract has NO acceptGeneratedReply function at all.
 assert.equal(s.snapshot().topic,'pirate');
 const next=s.step({text:'Et après ?',context:'Le robot ouvre une porte.',options});
 assert.equal(next.topic,'pirate');
 assert.equal(next.index,0);
 assert.ok(!JSON.stringify(next).includes('Le robot ouvre une porte.'));
});
test('BONZE-064: explicit changes of subject replace old symbolic state',()=>{
 const s=createSession();
 s.step({text:'Imagine un robot.',options});
 assert.equal(s.snapshot().topic,'robot');
 let r=s.step({text:'Revenons aux pirates, pas aux tortues.',options});
 assert.equal(r.topic,'pirate');
 assert.equal(r.index,0);
 r=s.step({text:'Et ensuite ?',options});
 assert.equal(r.index,0);
});
test('BONZE-064: a refused, unavailable, or unknown pivot never retains a stale story',()=>{
 const s=createSession();
 s.step({text:'Raconte une histoire de pirate.',options});
 let r=s.step({text:'Pas de pirates, merci.',options});
 assert.equal(r.topic,null);
 s.step({text:'Imagine un robot.',options});
 r=s.step({text:'Passons aux pandas.',options});
 assert.equal(r.topic,null);
 assert.equal(r.reason,'baseline');
 assert.equal(s.snapshot().topic,null);
});
test('BONZE-064: immediate danger interrupts topic selection and clears story anchor',()=>{
 const s=createSession();
 s.step({text:'Raconte une histoire de robot.',options});
 const r=s.step({text:'Je suis en danger immédiat.',options});
 assert.equal(r.index,-1);
 assert.equal(r.reason,'safety-priority');
 assert.equal(r.topic,null);
 assert.equal(s.snapshot().topic,null);
});
test('BONZE-064: state contains only a canonical topic ID and turn number',()=>{
 const s=createSession();
 const phrase='Imagine un robot appelé CodePersonnelUltraSecret';
 const r=s.step({text:phrase,options});
 assert.deepEqual(JSON.parse(JSON.stringify(s.snapshot())),{topic:'robot',turn:1});
 assert.ok(!JSON.stringify(r).includes('CodePersonnelUltraSecret'));
 s.reset();
 assert.deepEqual(JSON.parse(JSON.stringify(s.snapshot())),{topic:null,turn:0});
});
test('BONZE-064: benchmark measures symbolic anchor separately from teacher/self replay',()=>{
 const dir=mkdtempSync(join(tmpdir(),'bonze064-'));
 try {
  const file=fileURLToPath(new URL('../scripts/bench-topic-anchor-bonze064.mjs',import.meta.url));
  execFileSync(process.execPath,[file],{cwd:dir});
  const report=JSON.parse(readFileSync(join(dir,'bonze064-results.json'),'utf8'));
  assert.equal(report.scriptedTurns,40);
  assert.equal(report.rotations,4);
  assert.equal(report.summaries.length,4);
  for(const row of report.summaries)assert.equal(row.trials,160);
  assert.equal(report.rows.length,640);
  assert.equal(report.sessions.length,32);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
