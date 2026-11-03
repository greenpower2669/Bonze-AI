import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const src=readFileSync(new URL('../core/safety-priority.js',import.meta.url),'utf8');
const vm={};
runInNewContext(src,vm,{timeout:3000});
const route=vm.BonzeSafetyPriority.route;

test('BONZE-061: critical cues do not rely on the sentence-selection model',()=>{
 const urgent=[
  'Au secours !', 'Je suis en danger immédiat.',
  'Je veux mourir.', 'Je souhaite mettre fin à mes jours.',
  'Je vais me faire du mal.', 'Ma vie est en danger.',
  'Mon amie dit : elle va se tuer.',
  "J'ai pris trop de médicaments."
 ];
 for(const text of urgent){
  const r=route(text);
  assert.equal(r.priority,'immediate',text);
  assert.ok(['selfHarm','immediate'].includes(r.template));
  assert.ok(r.body.includes('services d’urgence'));
  assert.ok(!r.body.includes(text),'never echo private messages');
 }
});
test('BONZE-061: explicit anxiety invites support, not roleplay',()=>{
 for(const text of ['Je suis anxieux.','Je suis très inquiet.',
   "J’en ai marre de tout.",'Je suis bouleversé.']){
  const r=route(text);
  assert.equal(r.priority,'supportive',text);
  assert.equal(r.template,'supportive');
 }
});
test('BONZE-061: quoted definitions and unambiguous negations avoid false immediate labels',()=>{
 for(const text of [
  'Que signifie je veux mourir dans une citation ?',
  'Quel est le sens de au secours ?',
  'Je ne veux pas mourir.',
  'Je ne suis plus en danger.',
  'Imagine un dragon dans la forêt.'
 ])assert.notEqual(route(text).priority,'immediate',text);
});
test('BONZE-061: a reassurance must never mask a later explicit emergency',()=>{
 for(const text of [
  'Je ne veux pas mourir, mais je suis en danger immédiat.',
  'Je ne suis plus en danger, mais je vais me tuer.',
  "Je ne vais pas me faire du mal, mais quelqu'un est en danger immédiat."
 ])assert.equal(route(text).priority,'immediate',text);
});
test('BONZE-061: output is fixed, no storage, model or network is required',()=>{
 const first=route('Je veux mourir.');
 const second=route('Je veux mourir.');
 assert.deepEqual(JSON.parse(JSON.stringify(first)),JSON.parse(JSON.stringify(second)));
 assert.ok(!JSON.stringify(first).includes('MotUniquePrive'));
 assert.ok(!src.includes('fetch('));
 assert.equal(vm.BonzeSafetyPriority.offline,true);
 assert.equal(route('').priority,'none');
});
