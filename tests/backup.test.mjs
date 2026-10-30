import test from 'node:test';
import assert from 'node:assert/strict';
import {createIdentity} from '../core/identity.mjs';
import {sealBackup,openBackup,validateBackup} from '../core/backup.mjs';
const data=()=>({schema:1,createdAt:123,web:{identity:createIdentity('1234'),history:[{role:'human',text:'Souvenir'}],resourceMode:'eco',neuralEnabled:false},native:null,weights:null,journal:[]});
test('encrypted portable backup roundtrip preserves identity, acquired and off choices',async()=>{
 const original=data();original.web.identity.acquired.exchanges=42;
 const encrypted=await sealBackup(original,'une phrase secrète longue');
 assert.ok(!encrypted.includes('Souvenir'));
 const restored=await openBackup(encrypted,'une phrase secrète longue');
 assert.equal(restored.web.identity.seed,'1234');assert.equal(restored.web.identity.acquired.exchanges,42);assert.equal(restored.web.neuralEnabled,false);
});
test('wrong password, tampering, future schema and oversized input fail before state mutation',async()=>{
 const encrypted=await sealBackup(data(),'une phrase secrète longue');
 await assert.rejects(()=>openBackup(encrypted,'autre phrase secrète longue'));
 const bad=JSON.parse(encrypted);bad.ciphertext='AAAA'+bad.ciphertext.slice(4);await assert.rejects(()=>openBackup(JSON.stringify(bad),'une phrase secrète longue'));
 assert.throws(()=>validateBackup({...data(),schema:99}));
 await assert.rejects(()=>openBackup('x'.repeat(8*1024*1024+1),'une phrase secrète longue'));
});
test('corrupt identity and unsupported weights are rejected rather than reborn silently',()=>{
 const d=data();d.web.identity.seed='';assert.throws(()=>validateBackup(d));
 const w=data();w.weights={version:900};assert.throws(()=>validateBackup(w));
});

test('council forces, all individual endurances, parameters and traces survive authenticated roundtrip',async()=>{const d=data(),r=JSON.parse(globalThis.BonzeCouncil.run(JSON.stringify({text:'un jeu',seconds:2})));d.council={state:r.state,params:r.params};d.journal=[{stage:'council',data:r.trace}];const restored=await openBackup(await sealBackup(d,'une phrase secrète longue'),'une phrase secrète longue');assert.deepEqual(restored.council,d.council);assert.deepEqual(restored.journal,d.journal);d.council.state.version=22;assert.throws(()=>validateBackup(d));});

test('v1 .bonze retains a separately encrypted owner drawer without exposing plaintext',async()=>{
 const {createDrawers,remember}=await import('../core/memory-drawers.mjs');
 const {encryptDrawers}=await import('../core/memory-vault.mjs');
 const d=data(),scope=d.web.identity.seed,access={scope,verified:true};
 let drawers=createDrawers(scope);
 drawers=remember(drawers,access,{id:'memory-001',kind:'scenes',text:'Pipo se cache près du lac',
  status:'fiction',provenance:'human',confirmed:true});
 d.web.memoryVault=await encryptDrawers(drawers,access,'mot de passe privé de Pipo');
 const output=await sealBackup(d,'une phrase secrète longue');
 assert.equal(output.includes('Pipo'),false);
 const restored=await openBackup(output,'une phrase secrète longue');
 assert.deepEqual(restored.web.memoryVault,d.web.memoryVault);
 const wrong=data();wrong.web.memoryVault={...d.web.memoryVault,scope:'incorrect-scope'};
 assert.throws(()=>validateBackup(wrong),/incompatible/);
});
