import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {contradictionCases} from './fixtures/bonze067-contradictions.mjs';
test('BONZE-067: frozen cases',()=>{
 assert.equal(contradictionCases.length,32);
 assert.equal(contradictionCases.filter(x=>x.conflict).length,14);
});
const ctx={};
for(const name of ['non-neural-arbiter.js','safety-priority.js','preference-arbiter.js','topic-anchor.js','story-consistency.js','scene-anchor.js'])
 runInNewContext(readFileSync(new URL('../core/'+name,import.meta.url),'utf8'),ctx);
test('BONZE-067: comparison against frozen cases',()=>{
 const check=ctx.BonzeStoryConsistency.check;
 for(const c of contradictionCases){
  assert.equal(check(c.prior,c.candidate).conflict,c.conflict,c.id);
  assert.equal(check(c.candidate,c.prior).conflict,c.conflict,c.id);
 }
});

test('BONZE-067: scene must abstain on mutually exclusive state',()=>{
 const session=ctx.BonzeSceneAnchor.createSession();
 const first=session.step({text:'Imagine un robot.',options:['Le robot est endormi.']});
 assert.equal(first.index,0);
 assert.equal(session.acknowledge(first.receipt),true);
 const next=session.step({text:'Et ensuite ?',options:['Le robot est réveillé.']});
 assert.equal(next.index,-1);
 assert.equal(next.reason,'story-contradiction');
});
