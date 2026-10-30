import test from 'node:test';
import assert from 'node:assert/strict';
import {createIdentity} from '../core/identity.mjs';
import {advance, expression, experience} from '../core/organism.mjs';

test('internal states continuously affect face and blends are proportional',()=>{
 const i=createIdentity('expression'); const a=i.acquired;
 const low=expression(i,{...a,forces:{...a.forces,curiosite:0}},'off');
 const mid=expression(i,{...a,forces:{...a.forces,curiosite:.5}},'off');
 const high=expression(i,{...a,forces:{...a.forces,curiosite:1}},'off');
 assert.ok(low.eyeOpen<mid.eyeOpen && mid.eyeOpen<high.eyeOpen);
 assert.ok(expression(i,{...a,forces:{...a.forces,joie:1}},'off').smile>low.smile);
});
test('endurance is global, effort consumes and rest recovers; no keyword input required',()=>{
 const i=createIdentity('endurance'); const original=i.acquired.endurance;
 const tired=advance(i,30,'thinking'); assert.ok(tired.endurance<original);
 const rest=advance({...i,acquired:tired},30,'off'); assert.ok(rest.endurance>tired.endurance);
 assert.ok(Object.values(rest.forces).every(x=>Number.isFinite(x)&&x>=0&&x<=1));
});
test('empathy inhibits anger directionally, acquired temperament survives rest',()=>{
 const i=createIdentity('interactions');
 const a={...i.acquired,forces:{...i.acquired.forces,colere:.8,empathie:0}};
 const no=advance({...i,acquired:a},1,'off');
 const yes=advance({...i,acquired:{...a,forces:{...a.forces,empathie:1}}},1,'off');
 assert.ok(yes.forces.colere<no.forces.colere);
 const learned=experience(i,{curiosite:.7},'successful_exchange');
 assert.ok(learned.adaptation.curiosite>0);
 assert.equal(advance({...i,acquired:learned},60,'off').adaptation.curiosite,learned.adaptation.curiosite);
});
test('an absent stimulus does not silently subtract emotional forces',()=>{
 const i=createIdentity('neutral');const next=experience(i,{},'neutral');
 assert.deepEqual(next.forces,i.acquired.forces);
 assert.ok(Object.values(next.adaptation).every(x=>x===0));
});
