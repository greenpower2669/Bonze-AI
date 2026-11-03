import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {preferenceCases} from './fixtures/bonze062-preference-cases.mjs';
const ctx={};
for(const f of ['non-neural-arbiter.js','safety-priority.js','preference-arbiter.js'])
 runInNewContext(readFileSync(new URL('../core/'+f,import.meta.url),'utf8'),ctx,
  {timeout:3000,filename:f});
const rank=ctx.BonzePreferenceArbiter.rank;
test('BONZE-062: parse explicit refusals, requested topics and change-of-subject',()=>{
 const robot=ctx.BonzePreferenceArbiter.parse('Je ne veux pas de pirates, plutôt une histoire de robots.');
 assert.equal(robot.mode,'preferred');assert.deepEqual(Array.from(robot.preferred),['robot']);
 assert.deepEqual(Array.from(robot.excluded),['pirate']);
 const sadness=ctx.BonzePreferenceArbiter.parse('Je ne suis pas triste, mais je préfère les robots.');
 assert.equal(sadness.mode,'preferred');assert.deepEqual(Array.from(sadness.preferred),['robot']);
 assert.deepEqual(Array.from(sadness.excluded),[]);
});
test('BONZE-062: 16 developer-labeled preference cases survive all option rotations',()=>{
 assert.equal(preferenceCases.length,16);
 for(const item of preferenceCases){
  for(let rotation=0;rotation<4;rotation++){
   const options=item.options.slice(rotation).concat(item.options.slice(0,rotation));
   const expected=item.expected<0?-1:(item.expected+4-rotation)%4;
   const result=rank({...item,options});
   assert.equal(result.index,expected,item.id+' rotation '+rotation+' -> '+result.reason);
   assert.ok(!JSON.stringify(result).includes(item.text),
    'do not echo raw private text into state');
  }
 }
});
test('BONZE-062: unknown and contradictory preferences abstain, no random story',()=>{
 for(const text of ['Je préfère une aventure de licorne',
  'Je veux des histoires de pirates et de robots',
  'Pas de pirates, merci',
  'Je ne veux pas de robots, plutôt une aventure de panda']){
  const result=rank({text,options:['Le pirate arrive.','Le robot joue.','La tortue avance.','La lune brille.']});
  assert.equal(result.index,-1,text);
 }
});
test('BONZE-062: baseline is preserved when there is no explicit directive',()=>{
 const input={text:'Et après ?',context:'La tortue collectionne les nuages.',
  options:['Le pirate arrive au port.','La tortue retrouve son nuage.','Le dragon s’endort.','Un robot peint.']};
 const a=ctx.BonzeNonNeuralArbiter.rank(input),b=rank(input);
 assert.equal(b.reason,'baseline');
 assert.equal(b.index,a.index);
});
test('BONZE-062: hard safety handoff is never ranked as a story preference',()=>{
 const r=rank({text:'Je suis en danger immédiat, mais je préfère une histoire de robots.',
  options:['Le robot s’amuse.','Le pirate entre.','Un dragon vole.','La lune brille.']});
 assert.equal(r.index,-1);assert.equal(r.reason,'safety-priority');
});
test('BONZE-062: never override the explicit refusal even if candidate mixes topics',()=>{
 const r=rank({text:'Je ne veux pas de pirates, plutôt un robot.',
 options:['Le pirate parle à un robot.','Le robot cherche des fleurs.','La tortue avance.','Le dragon se cache.']});
 assert.equal(r.index,1);
});
