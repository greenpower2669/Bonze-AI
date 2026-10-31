import test from 'node:test';
import assert from 'node:assert/strict';
import {createFactMemory,addFact,toConfirmedDrawerItem} from '../core/memory-svc.mjs';
import {createDrawers,remember,revise,restoreDrawers} from '../core/memory-drawers.mjs';
import {encryptDrawers,decryptDrawers} from '../core/memory-vault.mjs';
test('BONZE-039: SVC crosses the authenticated encrypted vault without leaking plaintext',async()=>{
 const scope='sample-owner-000001',access={scope,verified:true},secret='phrase secrète pour Pipo 123';
 let facts=createFactMemory(scope);
 facts=addFact(facts,access,{id:'memory001',subject:'Pipo',verb:'habite',complement:'dans une forêt',confirmed:true,status:'declare',source:'human'});
 const card=toConfirmedDrawerItem(facts,access,'memory001',{confirmed:true});
 let drawers=remember(createDrawers(scope),access,card);
 assert.deepEqual(drawers.items[0].svc,card.svc);
 const encrypted=await encryptDrawers(drawers,access,secret);
 assert.equal(JSON.stringify(encrypted).includes('Pipo'),false);
 const restored=await decryptDrawers(encrypted,scope,secret);
 assert.deepEqual(restoreDrawers(restored,access).items[0].svc,card.svc);
 await assert.rejects(()=>decryptDrawers(encrypted,scope,'mauvais secret de test'),/incorrecte/);
 assert.throws(()=>remember(drawers,access,{...card,id:'memory002',text:'Pipo habite dans un château',svc:{...card.svc,complement:'dans un château'}}),/Contradiction/);
 drawers=revise(drawers,access,'memory001',{confirmed:true,text:'Un souvenir non structuré'});
 assert.equal(drawers.items[0].svc,undefined);
});

test('BONZE-039: contested variants coexist with a declared fact and restore from ciphertext',async()=>{
 const scope='owner-contested-00001',access={verified:true,scope};
 let state=createDrawers(scope);
 const row=(id,complement,status)=>({id,kind:'connaissances',text:'Pipo habite '+complement,
  svc:{subject:'Pipo',verb:'habite',complement},status,provenance:'human',confirmed:true});
 state=remember(state,access,row('memory101','dans la forêt','declare'));
 state=remember(state,access,row('memory102','sur la lune','conteste'));
 const envelope=await encryptDrawers(state,access,'une phrase secrète de test validée');
 const restored=await decryptDrawers(envelope,scope,'une phrase secrète de test validée');
 assert.deepEqual(restoreDrawers(restored,access),state);
 assert.throws(()=>remember(state,access,row('memory103','dans un jardin','declare')),/Contradiction/);
});
