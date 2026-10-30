import test from 'node:test';
import assert from 'node:assert/strict';
import {createDrawers,remember,recall} from '../core/memory-drawers.mjs';
import {encryptDrawers,decryptDrawers,validateVaultEnvelope} from '../core/memory-vault.mjs';
const scope='owner-instance-00001',access={scope,verified:true};
test('private vault encrypts memory, survives backup representation and only opens with secret',async()=>{
 let state=createDrawers(scope);
 state=remember(state,access,{id:'memory-001',text:'Pipo aime le granité au citron',kind:'scenes',
  status:'fiction',provenance:'human',confirmed:true});
 const envelope=await encryptDrawers(state,access,'ma phrase secrète personnelle');
 assert.equal(envelope.scope,scope);
 assert.equal(JSON.stringify(envelope).includes('Pipo'),false);
 assert.deepEqual(await decryptDrawers(envelope,scope,'ma phrase secrète personnelle'),state);
 assert.equal(recall(await decryptDrawers(envelope,scope,'ma phrase secrète personnelle'),access,'Pipo').snippets.length,1);
 await assert.rejects(()=>decryptDrawers(envelope,scope,'une phrase incorrecte'),/incorrecte/);
 await assert.rejects(()=>decryptDrawers(envelope,'autre-instance-00002','ma phrase secrète personnelle'));
 const corrupted={...envelope,ciphertext:'AAAA'+envelope.ciphertext.slice(4)};
 await assert.rejects(()=>decryptDrawers(corrupted,scope,'ma phrase secrète personnelle'));
 assert.equal(validateVaultEnvelope(null,scope),null);
});
