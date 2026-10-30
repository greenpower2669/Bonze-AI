import test from 'node:test';
import assert from 'node:assert/strict';
import {createDrawers,drawerMap,remember,revise,forget,recall,restoreDrawers,snapshotDrawers} from '../core/memory-drawers.mjs';
const scope='instance-owner-01',ok={verified:true,scope},bad={verified:true,scope:'someone-else'};
const fact=(id,text,extra={})=>({id,kind:'connaissances',text,status:'declare',provenance:'human',confirmed:true,at:1761840000000,...extra});
test('private drawers fail closed and have a tiny content-free map',()=>{
 let m=createDrawers(scope);
 assert.equal(recall(m,null,'bonjour').denied,true);
 assert.throws(()=>drawerMap(m,bad),/authentifié/);
 assert.throws(()=>remember(m,bad,fact('memory-001','Mon dragon est vert')),/authentifié/);
 m=remember(m,ok,fact('memory-001','Mon dragon est vert'));
 assert.equal(drawerMap(m,ok).drawers.connaissances.count,1);
 assert.equal(JSON.stringify(drawerMap(m,ok)).includes('dragon'),false);
 assert.equal(recall(m,bad,'dragon').snippets.length,0);
});
test('learning requires confirmation, provenance, trust and unique identifiers',()=>{
 let m=createDrawers(scope);
 assert.throws(()=>remember(m,ok,{...fact('memory-001','Le dragon est vert'),confirmed:false}),/Confirmation/);
 assert.throws(()=>remember(m,ok,{...fact('memory-001','Le dragon est vert'),status:'certain'}),/Fiabilité/);
 m=remember(m,ok,fact('memory-001','Le dragon est vert'));
 assert.throws(()=>remember(m,ok,fact('memory-001','Nouvelle mémoire')),/déjà/);
 assert.equal(m.items[0].status,'declare');
});
test('selective search, correction, archive and erasure work in bounded budgets',()=>{
 let m=createDrawers(scope);
 m=remember(m,ok,fact('memory-001','Pipo le dragon se cache près du lac', {kind:'scenes',status:'fiction',tags:['dragon','pipo']}));
 m=remember(m,ok,fact('memory-002','Je préfère les histoires de dragons', {kind:'personnalite'}));
 m=remember(m,ok,fact('memory-003','La ville s\'appelle Lyon'));
 const r=recall(m,ok,'Où se cache Pipo le dragon ?', {limit:2,budget:750});
 assert.ok(r.snippets.length>=1);assert.equal(r.snippets[0].id,'memory-001');
 assert.ok(r.spent<=750);assert.ok(r.snippets.length<=2);
 assert.equal(recall(m,ok,'Pipo', {kinds:['personnalite']}).snippets.length,0);
 m=revise(m,ok,'memory-001',{text:'Pipo est désormais sur la lune',status:'fiction',confirmed:true});
 assert.equal(recall(m,ok,'lune').snippets[0].text,'Pipo est désormais sur la lune');
 m=revise(m,ok,'memory-001',{archived:true,confirmed:true});
 assert.equal(recall(m,ok,'lune').snippets.length,0);
 assert.equal(recall(m,ok,'lune',{includeArchives:true}).snippets.length,1);
 m=forget(m,ok,'memory-001');assert.equal(recall(m,ok,'lune',{includeArchives:true}).snippets.length,0);
});
test('restoration validates scope, schema, duplicates and malformed memory',()=>{
 let m=createDrawers(scope);m=remember(m,ok,fact('memory-001','Une idée amusante'));
 const data=snapshotDrawers(m,ok);
 assert.deepEqual(restoreDrawers(data,ok),m);
 assert.throws(()=>restoreDrawers(data,bad),/authentifié/);
 assert.throws(()=>restoreDrawers({...data,schema:2},ok),/Schéma/);
 assert.throws(()=>restoreDrawers({...data,items:[data.items[0],data.items[0]]},ok),/corrompu/);
});
test('long records and query budget cannot overflow prompt',()=>{
 let m=createDrawers(scope);
 m=remember(m,ok,fact('memory-001','x'.repeat(900)+' dragon'));
 assert.ok(m.items[0].text.length<=360);
 assert.equal(recall(m,ok,'dragon',{budget:10}).snippets.length,0);
 assert.equal(recall(m,ok,'une inconnue').snippets.length,0);
});
