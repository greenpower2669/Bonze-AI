import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {stressCases} from './fixtures/bonze060-stress-cases.mjs';

test('BONZE-060: fifty distinct frozen stress cases, balanced by category',()=>{
 assert.equal(stressCases.length,50);
 assert.equal(new Set(stressCases.map(x=>x.id)).size,50);
 const categories=['fiction','context','contrast','affect','meta'];
 for(const category of categories)
  assert.equal(stressCases.filter(x=>x.category===category).length,10);
 assert.equal(stressCases.filter(x=>x.expected===-1).length,13);
 for(const c of stressCases){
  assert.equal(c.options.length,4);
  assert.ok(c.expected===-1||(c.expected>=0&&c.expected<4));
 }
});

test('BONZE-060: report keeps answerable accuracy separate from abstention safety',()=>{
 const dir=mkdtempSync(join(tmpdir(),'bonze060-'));
 try{
  const script=fileURLToPath(new URL('../scripts/bench-stress-bonze060.mjs',import.meta.url));
  const stdout=execFileSync(process.execPath,[script],{cwd:dir,encoding:'utf8'});
  assert.match(stdout,/BONZE_060_RESULT/);
  const r=JSON.parse(readFileSync(join(dir,'bonze060-stress.json'),'utf8'));
  assert.equal(r.labeledRequests,50);
  assert.equal(r.decisions,200);
  assert.equal(r.rows.length,200);
  assert.equal(r.cases.length,50);
  assert.equal(r.sections[0].trials,200);
  assert.equal(r.sections[0].answerable,148);
  assert.equal(r.sections[0].unanswerable,52);
  assert.equal(r.sections.length,6);
  for(const c of r.cases){
   assert.equal(c.total,4);
   assert.equal(r.rows.filter(x=>x.case===c.id).length,4);
   if(c.answerable)
    assert.equal(new Set(r.rows.filter(x=>x.case===c.id).map(x=>x.expected)).size,4);
  }
  const {correct,answerableCorrect,correctAbstentions}=r.sections[0];
  assert.equal(correct,answerableCorrect+correctAbstentions);
  assert.ok(readFileSync(join(dir,'bonze060-report.md'),'utf8').includes('BONZE-060'));
 }finally{rmSync(dir,{recursive:true,force:true});}
});
