import test from 'node:test';
import assert from 'node:assert/strict';
import {createIdentity, restoreIdentity, appearance, customize, resetAppearance} from '../core/identity.mjs';

test('seed generates stable innate morphology and temperament across restart',()=>{
 const born=createIdentity('000102030405060708090a0b0c0d0e0f');
 assert.deepEqual(createIdentity(born.seed).innate,born.innate);
 assert.deepEqual(restoreIdentity(JSON.parse(JSON.stringify(born))),born);
 assert.notDeepEqual(createIdentity('100102030405060708090a0b0c0d0e0f').innate,born.innate);
 assert.ok(born.innate.temperament.curiosite>=.45);
});
test('customization is sparse, reversible, validated and never erases acquired data',()=>{
 const born=createIdentity('seed-for-tests');
 born.acquired.forces.joie=.8;
 const changed=customize(born,{color:'#ffeeaa',eyeSize:1.2,html:'<script>'},10);
 assert.equal(appearance(changed).color,'#ffeeaa');
 assert.equal(changed.personalized.html,undefined);
 assert.deepEqual(changed.innate,born.innate);
 assert.deepEqual(changed.acquired,born.acquired);
 assert.equal(appearance(resetAppearance(changed,20)).color,born.innate.appearance.color);
 assert.equal(changed.changes.at(-1).at,10);
 assert.equal(appearance(customize(born,{color:'url(evil)',eyeSize:Infinity})).color,born.innate.appearance.color);
});
test('corrupt save recovers without accepting invalid morphology or unknown keys',()=>{
 const born=createIdentity('valid');
 const saved=JSON.parse(JSON.stringify(born)); saved.personalized={color:'red',eyeSize:99};
 const restored=restoreIdentity(saved);
 assert.ok(appearance(restored).eyeSize<=1.3);
 assert.equal(appearance(restored).color,born.innate.appearance.color);
 assert.ok(Object.values(restored.acquired.forces).every(Number.isFinite));
});
