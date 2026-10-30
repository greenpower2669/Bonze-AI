import test from 'node:test';import assert from 'node:assert/strict';import '../core/council.js';import {readFileSync} from 'node:fs';import {createAdminGesture} from '../core/admin-gesture.mjs';import {createSpeechMotion} from '../core/speech.mjs';
const weights=JSON.parse(readFileSync(new URL('../core/weights/expert-router-v1.json',import.meta.url))),run=i=>JSON.parse(globalThis.BonzeCouncil.run(JSON.stringify({weights,...i})));
test('eight contextual contributions sum to actual arbiter decision',()=>{const r=run({text:'Je suis triste, aide moi',context:{familiar:true},seconds:1});assert.equal(r.trace.contributions.length,8);for(let k=0;k<6;k++)assert.ok(Math.abs(r.trace.totals[k]-r.trace.contributions.reduce((a,c)=>a+c.vector[k],0))<1e-9);assert.equal(r.trace.selected,r.trace.totals.indexOf(Math.max(...r.trace.totals)));assert.match(run({text:'On joue au dragon'}).hint,/scène/);});
test('individual fatigue amplifies anger, reduces empathy/humor; asymmetric inhibition is adjustable',()=>{const s=run({seconds:0}).state,a=structuredClone(s),b=structuredClone(s);for(const k in a.endurances){a.endurances[k]=1;b.endurances[k]=0;}const fresh=run({state:a}),tired=run({state:b}),get=(r,k)=>r.trace.contributions.find(c=>c.name===k).effective;assert.ok(get(tired,'colere')>get(fresh,'colere'));assert.ok(get(tired,'empathie')<get(fresh,'empathie'));assert.ok(get(tired,'humour')<get(fresh,'humour'));a.forces.empathie=1;a.forces.colere=.9;assert.ok(run({state:a,seconds:5,params:{influences:{'empathie>colere':-.5}}}).state.forces.colere<run({state:a,seconds:5,params:{influences:{'empathie>colere':0}}}).state.forces.colere);assert.equal(a.forces.colere,.9);});
test('60 alternating touches discover console; repeated side/timeout reset and never authorize',()=>{const g=createAdminGesture();for(let i=0;i<59;i++)assert.equal(g.tap(i%2?'right':'left',i*100),false);assert.equal(g.tap('right',5900),true);g.tap('left',6000);g.tap('left',6100);for(let i=0;i<58;i++)assert.equal(g.tap(i%2?'left':'right',6200+i*100),false);assert.equal(g.tap('right',20000),false);});
test('mouth follows played PCM amplitude, silence and interruption; stale levels rejected',()=>{const m=createSpeechMotion();m.start('a','bonjour',0);m.level('a',.8,20);assert.equal(m.sample(25).open,.8);m.level('a',0,40);assert.equal(m.sample(45).open,0);m.level('a',.8,60);assert.equal(m.sample(300).open,0);m.start('b','salut',400);m.level('a',1,410);assert.notEqual(m.sample(420).open,1);m.stop();m.level('b',1,430);assert.equal(m.sample(440).open,0);});

test('epistemic guard distinguishes play, unknown real-time facts and sensitive questions',()=>{
 const fantasy=run({text:'Le dragon mange du granité à l’huile'});
 assert.equal(fantasy.trace.knowledge.category,'imaginaire');
 assert.equal(fantasy.trace.knowledge.verified,false);
 const weather=run({text:'Quelle météo pour Lyon demain ?'});
 assert.equal(weather.trace.knowledge.category,'information-non-verifiee');
 assert.equal(weather.trace.epistemicOverride,true);
 assert.match(weather.hint,/hors ligne/);
 const medical=run({text:'Ce médicament est-il sans risque ?'});
 assert.equal(medical.trace.knowledge.category,'question-sensible');
 assert.equal(medical.trace.epistemicOverride,true);
 assert.match(medical.hint,/limites/);
 const regular=run({text:'Pipo, viens jouer avec moi'});
 assert.equal(regular.trace.knowledge.verified,false);
 assert.equal(regular.trace.epistemicOverride,false);
});
