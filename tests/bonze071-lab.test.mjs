import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const ui=readFileSync(new URL('../docs/index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../docs/app.js',import.meta.url),'utf8');
const lab=readFileSync(new URL('../docs/scene-lab.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../docs/style.css',import.meta.url),'utf8');
const gradle=readFileSync(new URL('../android/app/build.gradle',import.meta.url),'utf8');
const elements=[
 'scene-lab','scene-lab-prior','scene-lab-candidate','scene-lab-first',
 'scene-lab-check','scene-lab-deliver-next','scene-lab-example-conflict',
 'scene-lab-example-time','scene-lab-delivered','scene-lab-result',
 'scene-lab-count','scene-lab-records','scene-lab-reset'
];
test('BONZE-071: every lab interaction target exists exactly once',()=>{
 for(const id of elements){
  const matches=[...ui.matchAll(new RegExp('id="'+id+'"','g'))];
  assert.equal(matches.length,1,'missing/duplicate '+id);
  assert.ok(lab.includes("'"+id+"'"),'controller does not reference '+id);
 }
 assert.match(ui,/<details id="scene-lab"/);
 assert.match(ui,/BONZE-070/);
 assert.match(css,/\.scene-lab/);
});
test('BONZE-071: app includes lab but native session code stays independent',()=>{
 assert.match(app,/import \{setupSceneLab\} from '\.\/scene-lab\.js';/);
 assert.match(app,/setupSceneLab\(\)/);
 assert.match(lab,/import '\.\.\/core\/scene-facts\.js';/);
 assert.match(lab,/import '\.\.\/core\/scene-ledger\.js';/);
 assert.doesNotMatch(lab,/localStorage|sessionStorage|fetch\(|XMLHttpRequest|BonzeAndroid\.command/);
});
test('BONZE-071: lab installs separately and preserves existing version',()=>{
 assert.match(gradle,/bonzeLab070/);
 assert.match(gradle,/applicationIdSuffix '\.lab070'/);
 assert.match(gradle,/0\.8\.1-lab070/);
 assert.match(gradle,/0\.8\.0-dev/);
 assert.match(gradle,/project\.hasProperty\('bonzeLab070'\) \? 9 : 8/);
});
test('BONZE-071: first phrase is acknowledged, contradiction is blocked',()=>{
 const root={};
 for(const f of ['scene-facts.js','scene-ledger.js'])
  runInNewContext(readFileSync(new URL('../core/'+f,import.meta.url),'utf8'),root);
 const x=root.BonzeSceneLedger.createLedger();
 const first=x.propose('Le robot possède une clé.');
 assert.equal(first.decision,'allow');
 assert.equal(x.snapshot().eventCount,0);
 assert.equal(x.acknowledge(first.receipt),true);
 assert.equal(x.snapshot().eventCount,1);
 const check=x.evaluate("Le robot n'a aucune clé.");
 assert.equal(check.conflict,true);
 const blocked=x.propose("Le robot n'a aucune clé.");
 assert.equal(blocked.decision,'abstain');
 assert.equal(blocked.receipt,null);
 assert.equal(x.snapshot().eventCount,1);
});
test('BONZE-071: a later change of fictional state is not falsely blocked',()=>{
 const root={};
 for(const f of ['scene-facts.js','scene-ledger.js'])
  runInNewContext(readFileSync(new URL('../core/'+f,import.meta.url),'utf8'),root);
 const x=root.BonzeSceneLedger.createLedger();
 x.acknowledge(x.propose('Le robot possède une clé.').receipt);
 assert.equal(x.evaluate("Plus tard, le robot n'a aucune clé.").conflict,false);
 x.reset();
 assert.equal(x.snapshot().eventCount,0);
});
