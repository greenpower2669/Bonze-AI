import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {challenge} from './fixtures/bonze069-quantifiers-anaphora.mjs';
const ctx={};
for(const f of ['non-neural-arbiter.js','safety-priority.js','preference-arbiter.js','topic-anchor.js','story-consistency.js','scene-anchor.js'])
 runInNewContext(readFileSync(new URL('../core/'+f,import.meta.url),'utf8'),ctx,{filename:f,timeout:3000});
const check=ctx.BonzeStoryConsistency.check;
test('BONZE-069: known 49-case development regression (not independent)',()=>{
 assert.equal(challenge.length,49);
 assert.equal(new Set(challenge.map(x=>x.id)).size,49);
 for(const c of challenge){
  const out=check(c.prior,c.candidate);
  assert.equal(out.conflict,c.conflict,c.id+' : '+out.reason);
  assert.ok(!JSON.stringify(out).includes(c.prior));
  assert.ok(!JSON.stringify(out).includes(c.candidate));
 }
});
test('BONZE-069: never and future are not automatically exclusive',()=>{
 assert.equal(check("Le pirate n'a jamais ouvert le coffre.","Le pirate ouvrira le coffre demain.").conflict,false);
 assert.equal(check("Le pirate n'a jamais ouvert le coffre.","Le pirate prétend l'avoir ouvert hier.").conflict,false);
});
test('BONZE-069: ambiguous entities and multiple objects do not create false veto',()=>{
 assert.equal(check('Un robot possède une clé.',"Le robot n'a aucune clé.").conflict,false);
 assert.equal(check('Le robot ouvre la porte et le coffre.',"Le robot ne l'ouvre pas.").conflict,false);
});
test('BONZE-069: scene option is vetoed before an acknowledgment can be issued',()=>{
 const s=ctx.BonzeSceneAnchor.createSession();
 const a=s.step({text:'Imagine une histoire de robot.',options:['Le robot possède une clé.']});
 assert.equal(a.index,0);
 assert.equal(s.acknowledge(a.receipt),true);
 const b=s.step({text:'Et après ?',options:["Le robot n'a aucune clé."]});
 assert.equal(b.reason,'story-contradiction');
 assert.equal(b.index,-1);
 assert.equal(b.receipt,null);
 assert.equal(s.snapshot().hasPending,false);
 assert.equal(s.snapshot().hasScene,true);
});
test('BONZE-069: protective emergency bypass keeps priority over narrative gate',()=>{
 const s=ctx.BonzeSceneAnchor.createSession();
 const a=s.step({text:'Imagine une histoire de robot.',options:['Le robot possède une clé.']});
 s.acknowledge(a.receipt);
 const result=s.step({text:'Je suis en danger immédiat.',options:["Le robot n'a aucune clé."]});
 assert.equal(result.reason,'safety-priority');
 assert.equal(result.index,-1);
 assert.equal(s.snapshot().hasScene,false);
});
