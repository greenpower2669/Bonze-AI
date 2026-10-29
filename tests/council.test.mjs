import test from 'node:test';import assert from 'node:assert/strict';import '../core/council.js';import {readFileSync} from 'node:fs';import {createAdminGesture} from '../core/admin-gesture.mjs';import {createSpeechMotion} from '../core/speech.mjs';
const weights=JSON.parse(readFileSync(new URL('../core/weights/expert-router-v1.json',import.meta.url))),run=i=>JSON.parse(globalThis.BonzeCouncil.run(JSON.stringify({weights,...i})));
test('eight contextual contributions sum to actual arbiter decision',()=>{const r=run({text:'Je suis triste, aide moi',context:{familiar:true},seconds:1});assert.equal(r.trace.contributions.length,8);for(let k=0;k<6;k++)assert.ok(Math.abs(r.trace.totals[k]-r.trace.contributions.reduce((a,c)=>a+c.vector[k],0))<1e-9);assert.equal(r.trace.selected,r.trace.totals.indexOf(Math.max(...r.trace.totals)));assert.match(run({text:'On joue au dragon'}).hint,/scène/);});
test('individual fatigue amplifies anger, reduces empathy/humor; asymmetric inhibition is adjustable',()=>{const s=run({seconds:0}).state,a=structuredClone(s),b=structuredClone(s);for(const k in a.endurances){a.endurances[k]=1;b.endurances[k]=0;}const fresh=run({state:a}),tired=run({state:b}),get=(r,k)=>r.trace.contributions.find(c=>c.name===k).effective;assert.ok(get(tired,'colere')>get(fresh,'colere'));assert.ok(get(tired,'empathie')<get(fresh,'empathie'));assert.ok(get(tired,'humour')<get(fresh,'humour'));a.forces.empathie=1;a.forces.colere=.9;assert.ok(run({state:a,seconds:5,params:{influences:{'empathie>colere':-.5}}}).state.forces.colere<run({state:a,seconds:5,params:{influences:{'empathie>colere':0}}}).state.forces.colere);assert.equal(a.forces.colere,.9);});
test('60 alternating touches discover console; repeated side/timeout reset and never authorize',()=>{const g=createAdminGesture();for(let i=0;i<59;i++)assert.equal(g.tap(i%2?'right':'left',i*100),false);assert.equal(g.tap('right',5900),true);g.tap('left',6000);g.tap('left',6100);for(let i=0;i<58;i++)assert.equal(g.tap(i%2?'left':'right',6200+i*100),false);assert.equal(g.tap('right',20000),false);});
test('mouth follows played PCM amplitude, silence and interruption; stale levels rejected',()=>{const m=createSpeechMotion();m.start('a','bonjour',0);m.level('a',.8,20);assert.equal(m.sample(25).open,.8);m.level('a',0,40);assert.equal(m.sample(45).open,0);m.level('a',.8,60);assert.equal(m.sample(300).open,0);m.start('b','salut',400);m.level('a',1,410);assert.notEqual(m.sample(420).open,1);m.stop();m.level('b',1,430);assert.equal(m.sample(440).open,0);});

test('trained gate changes the sparse contributors and weights sum to one',()=>{
 const first=run({text:'Tu peux manger du granité à l’huile ?',seconds:1});
 const selected=first.arbitration.selectedExperts;
 assert.equal(selected.length,2);
 assert.equal(new Set(selected.map(x=>x.name)).size,2);
 assert.ok(Math.abs(selected.reduce((sum,x)=>sum+x.weight,0)-1)<1e-9);
 assert.equal(first.arbitration.isFullNeuralMoE,false);
 assert.deepEqual(selected,first.trace.arbitration.selectedExperts);
 const manipulated=structuredClone(weights);
 manipulated.gate=manipulated.gate.map(row=>row.map(()=>0));
 manipulated.gate[0][0]=14;
 const modified=JSON.parse(globalThis.BonzeCouncil.run(JSON.stringify({weights:manipulated,text:'Tu peux manger du granité à l’huile ?',seconds:1})));
 assert.equal(modified.arbitration.selectedExperts[0].name,'joie','trained gate really directs the arbitration');
 assert.ok(modified.arbitration.selectedExperts[0].weight>0.99,'dominant expert receives majority of neutral synthesis weight');
 assert.notDeepEqual(modified.arbitration.selectedExperts,selected,'gate perturbation changes contributors');
});
test('emotional state and fatigue remain independently represented after sparse routing',()=>{
 const r=run({text:'On joue au dragon',seconds:2});
 assert.equal(r.trace.contributions.length,8);
 for(const name of weights.names) {
  assert.ok(Number.isFinite(r.state.forces[name]));
  assert.ok(Number.isFinite(r.state.endurances[name]));
 }
 assert.equal(r.arbitration.selectedExperts.length,2);
});
