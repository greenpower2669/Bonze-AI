import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
const vm={};
for(const f of ['non-neural-arbiter.js','safety-priority.js','preference-arbiter.js','topic-anchor.js','scene-anchor.js']){
 runInNewContext(readFileSync(new URL('../core/'+f,import.meta.url),'utf8'),vm,{timeout:3000,filename:f});
}
const create=vm.BonzeSceneAnchor.createSession;
const choices=['Le robot cherche sa clé.','Le pirate traverse la mer.','La tortue s’endort.','Le dragon s’envole.'];
test('BONZE-066: acknowledge the exact delivered option before recording scene',()=>{
 const session=create();
 const first=session.step({text:'Raconte une histoire de robot.',options:choices});
 assert.equal(first.index,0);
 assert.equal(first.topic,'robot');
 assert.equal(first.hasScene,false);
 assert.equal(session.snapshot().hasScene,false);
 assert.equal(session.acknowledge('wrong-receipt'),false);
 assert.equal(session.snapshot().hasScene,false);
 assert.equal(session.acknowledge(first.receipt),true);
 assert.equal(session.snapshot().hasScene,true);
 assert.equal(session.acknowledge(first.receipt),false);
});
test('BONZE-066: unacknowledged proposal expires after next input, cannot be backfilled',()=>{
 const session=create();
 const a=session.step({text:'Raconte une histoire de robot.',options:choices});
 const b=session.step({text:'Et ensuite ?',options:choices});
 assert.equal(session.acknowledge(a.receipt),false);
 assert.equal(session.snapshot().hasScene,false);
 if(b.receipt){
  assert.equal(session.acknowledge(b.receipt),true);
  assert.equal(session.snapshot().hasScene,true);
 }
});
test('BONZE-066: scene resets when explicit topic changes',()=>{
 const session=create();
 const a=session.step({text:'Imagine un robot.',options:choices});
 session.acknowledge(a.receipt);
 assert.equal(session.snapshot().topic,'robot');
 assert.equal(session.snapshot().hasScene,true);
 const b=session.step({text:'Je préfère une histoire de pirate.',options:choices});
 assert.equal(b.topic,'pirate');
 assert.equal(b.hasScene,false);
 assert.equal(session.snapshot().hasScene,false);
});
test('BONZE-066: emergency interrupts scene without acknowledging previous text',()=>{
 const session=create();
 const a=session.step({text:'Imagine un robot.',options:choices});
 session.acknowledge(a.receipt);
 const b=session.step({text:'Je suis en danger immédiat.',options:choices});
 assert.equal(b.reason,'safety-priority');
 assert.equal(b.receipt,null);
 assert.equal(session.snapshot().hasScene,false);
 assert.equal(session.snapshot().topic,null);
});
test('BONZE-066: memory snapshot cannot leak delivered text or raw user message',()=>{
 const session=create();
 const text='Un robot appelé CODEPERSONNELINVENTE cherche sa clé';
 const response=session.step({text:'Imagine un robot.',options:[text,...choices.slice(1)]});
 session.acknowledge(response.receipt);
 const value=JSON.stringify(session.snapshot());
 assert.ok(!value.includes('CODEPERSONNELINVENTE'));
 assert.ok(!value.includes('Un robot'));
 assert.deepEqual(JSON.parse(value),{topic:'robot',turn:1,hasScene:true,hasPending:false});
 session.reset();
 assert.deepEqual(JSON.parse(JSON.stringify(session.snapshot())),
  {topic:null,turn:0,hasScene:false,hasPending:false});
});
test('BONZE-066: scripted three-story diagnostic is reproducible without weights',()=>{
 const dir=mkdtempSync(join(tmpdir(),'bonze066-'));
 try {
  const entry=fileURLToPath(new URL('../scripts/bench-bonze066.mjs',import.meta.url));
  assert.match(execFileSync(process.execPath,[entry],{cwd:dir,encoding:'utf8'}),/BONZE_066_RESULT/);
  const report=JSON.parse(readFileSync(join(dir,'bonze066-results.json'),'utf8'));
  assert.equal(report.trials.length,480);
  assert.equal(report.summary.length,2);
  assert.equal(report.summary[0].trials,240);
  assert.equal(report.summary[1].trials,240);
  assert.ok(report.caveats.some(x=>x.includes('known')));
 }finally{rmSync(dir,{recursive:true,force:true});}
});