import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {cases} from './fixtures/bonze070-structured-facts.mjs';
const root={};
for(const f of ['story-consistency.js','scene-facts.js','scene-ledger.js'])
 runInNewContext(readFileSync(new URL('../core/'+f,import.meta.url),'utf8'),root,{timeout:3000,filename:f});
const facts=root.BonzeSceneFacts,ledger=root.BonzeSceneLedger;

test('BONZE-070: 37 editorial pair labels frozen and unique',()=>{
 assert.equal(cases.length,37);
 assert.equal(new Set(cases.map(x=>x.id)).size,37);
 assert.equal(cases.filter(x=>x.conflict).length,17);
 assert.equal(cases.filter(x=>!x.conflict).length,20);
});
test('BONZE-070: facts are canonical and cannot contain arbitrary name or text',()=>{
 const record=facts.parse('Le robot possède deux clés.');
 assert.equal(record.subject,'le:robot');
 assert.equal(record.predicate,'possess');
 assert.equal(record.object,'cle');
 assert.equal(record.quantity,'some');
 assert.equal(record.scope,'fiction');
 assert.equal(facts.parse('Le Maxime possède une clé.'),null);
 assert.equal(facts.parse('Le robot possède une clé personnelle.'),null);
 assert.equal(JSON.stringify(facts.check('Le robot a une clé.','Le robot ne possède aucune clé.')).includes('robot'),false);
});
test('BONZE-070: proposed fact is never recorded before valid delivery receipt',()=>{
 const l=ledger.createLedger({maxEvents:3});
 const a=l.propose('Le robot possède une clé.');
 assert.equal(a.decision,'allow');
 assert.equal(a.recognized,true);
 assert.equal(l.snapshot().eventCount,0);
 assert.equal(l.acknowledge('wrong'),false);
 assert.equal(l.snapshot().eventCount,0);
 assert.equal(l.acknowledge(a.receipt),true);
 assert.equal(l.acknowledge(a.receipt),false);
 assert.equal(l.records().length,1);
 assert.equal(l.records()[0].source,'assistant-delivered');
 assert.equal(l.records()[0].scope,'fiction');
 const b=l.propose("Le robot n'a aucune clé.");
 assert.equal(b.decision,'abstain');
 assert.equal(b.receipt,null);
 assert.equal(l.snapshot().eventCount,1);
 assert.equal(l.snapshot().pending,false);
});
test('BONZE-070: unparsed delivered sentence breaks direct comparability',()=>{
 const l=ledger.createLedger({maxEvents:2});
 l.acknowledge(l.propose('Le robot possède une clé.').receipt);
 const gap=l.propose('Une histoire incroyable commence.');
 assert.equal(gap.recognized,false);
 assert.equal(l.acknowledge(gap.receipt),true);
 assert.equal(l.snapshot().hasComparableFact,false);
 assert.equal(l.propose("Le robot n'a aucune clé.").decision,'allow');
 assert.equal(l.records().length,2);
});
test('BONZE-070: stale proposals expire on new turn and after reset',()=>{
 const l=ledger.createLedger({maxEvents:1});
 const first=l.propose('Le robot possède une clé.');
 const second=l.propose('La tortue détient une carte.');
 assert.equal(l.acknowledge(first.receipt),false);
 assert.equal(l.acknowledge(second.receipt),true);
 assert.equal(l.records().length,1);
 const third=l.propose('Le robot possède une clé.');
 l.reset();
 const fourth=l.propose('Le robot possède une clé.');
 assert.notEqual(third.receipt,fourth.receipt);
 assert.equal(l.acknowledge(third.receipt),false);
 assert.equal(l.acknowledge(fourth.receipt),true);
 assert.equal(l.snapshot().eventCount,1);
});
test('BONZE-070: exported records cannot mutate internal ledger',()=>{
 const l=ledger.createLedger();
 l.acknowledge(l.propose('Le dragon est endormi.').receipt);
 const one=l.records();
 one[0].fact.subject='le:intrus';
 assert.equal(l.records()[0].fact.subject,'le:dragon');
 assert.ok(!JSON.stringify(l.snapshot()).includes('dragon'));
});
test('BONZE-070: separate benchmark produces both matrices, no raw text',()=>{
 const dir=mkdtempSync(join(tmpdir(),'bonze070-'));
 try{
  const path=fileURLToPath(new URL('../scripts/bench-bonze070.mjs',import.meta.url));
  const out=execFileSync(process.execPath,[path],{cwd:dir,encoding:'utf8'});
  assert.match(out,/BONZE_070_RESULT/);
  const result=JSON.parse(readFileSync(join(dir,'bonze070-results.json'),'utf8'));
  assert.equal(result.pairs,37);
  assert.equal(result.rows.length,74);
  for(const s of result.summary)
   assert.equal(s.counts.tp+s.counts.fn+s.counts.fp+s.counts.tn,37);
  assert.ok(result.caveats.some(x=>x.includes('not general')));
 }finally{rmSync(dir,{recursive:true,force:true});}
});
