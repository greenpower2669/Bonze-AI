import test from 'node:test';
import assert from 'node:assert/strict';
import {createFactMemory,validateFactMemory,addFact,reviseFact,forgetFact,
 strengthenFact,advanceFactTurn,recallFacts,FACT_LIMIT} from '../core/memory-svc.mjs';
const scope='bonze-single-owner-01',access={verified:true,scope};
const other={verified:true,scope:'another-owner-002'};
const fact=(id,s,v,c,more={})=>({id,subject:s,verb:v,complement:c,
 status:'declare',source:'human',confirmed:true,...more});
test('BONZE-038: explicit memory consent and scoped access required',()=>{
 const m=createFactMemory(scope);
 assert.throws(()=>addFact(m,other,fact('memory001','Mon dragon','habite','dans une forêt')),/authentifié/);
 assert.throws(()=>addFact(m,access,fact('memory001','Mon dragon','habite','dans une forêt',{confirmed:false})),/Confirmation/);
 assert.equal(recallFacts(m,other,'dragon').denied,true);
 assert.deepEqual(m.cards,[]);
});
test('BONZE-038: subject-verb-complement selective recall with tight budget',()=>{
 let m=createFactMemory(scope);
 m=addFact(m,access,fact('memory001','Pipo','habite','dans une forêt verte',{tags:['dragon','forêt']}));
 m=addFact(m,access,fact('memory002','Bonze','aime','les fraises'));
 assert.equal(recallFacts(m,access,'Où habite Pipo le dragon ?').cards[0].id,'memory001');
 assert.equal(recallFacts(m,access,'Pipo',{budget:10}).cards.length,0);
 assert.equal(recallFacts(m,access,'mystère').cards.length,0);
 assert.equal(JSON.stringify(m).includes('phrase secrète'),false);
 assert.equal(recallFacts(m,other,'Pipo').cards.length,0);
});
test('BONZE-038: conflicts cannot silently overwrite prior knowledge',()=>{
 let m=createFactMemory(scope);
 m=addFact(m,access,fact('memory001','Pipo','habite','dans la forêt'));
 assert.throws(()=>addFact(m,access,fact('memory002','Pipo','habite','sur la lune')),/Contradiction/);
 assert.throws(()=>addFact(m,access,fact('memory002','Pipo','habite','sur la lune',{confirmConflict:true})),/contesté/);
 m=addFact(m,access,fact('memory002','Pipo','habite','sur la lune',{confirmConflict:true,status:'conteste'}));
 assert.equal(recallFacts(m,access,'Pipo').cards.length,1,'contested information is excluded');
 assert.throws(()=>addFact(m,access,fact('memory003','Pipo','habite','dans la forêt')),/déjà présent/);
});
test('BONZE-038: revision, reinforcement, forgetting and turn decay are explicit',()=>{
 let m=createFactMemory(scope);
 m=addFact(m,access,fact('memory001','Dragon','mange','des noisettes'));
 const start=m.cards[0].strength;
 m=advanceFactTurn(m);m=strengthenFact(m,access,'memory001',true);
 assert.ok(m.cards[0].strength>start);
 assert.throws(()=>strengthenFact(m,access,'memory001',false),/confirmé/);
 m=reviseFact(m,access,'memory001',{complement:'des pommes',confirmed:true});
 assert.equal(recallFacts(m,access,'pommes').cards[0].complement,'des pommes');
 m=forgetFact(m,access,'memory001');assert.deepEqual(m.cards,[]);
});
test('BONZE-038: rejects hostile backups, duplicates and oversized memories',()=>{
 let m=createFactMemory(scope);
 m=addFact(m,access,fact('memory001','Pipo','habite','dans le jardin'));
 assert.deepEqual(validateFactMemory(m),m);
 assert.throws(()=>validateFactMemory({...m,cards:[m.cards[0],m.cards[0]]}),/corrompue/);
 assert.throws(()=>validateFactMemory({...m,turn:NaN}),/invalide/);
 assert.throws(()=>validateFactMemory({...m,cards:Array(FACT_LIMIT+1).fill(m.cards[0])}),/invalide/);
 assert.throws(()=>addFact(m,access,fact('xx','Pipo','habite','une maison')),/Identifiant/);
});
