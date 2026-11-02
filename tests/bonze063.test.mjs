import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {standalone,dialogues,makeOptions} from './fixtures/bonze063-prospective.mjs';

test('BONZE-063 frozen prospective fixture retains 72 distinct IDs and two 20-turn sessions',()=>{
 assert.equal(standalone.length,32);
 assert.equal(dialogues.length,2);
 assert.deepEqual(dialogues.map(x=>x.length),[20,20]);
 const ids=[...standalone,...dialogues.flat()];
 assert.equal(new Set(ids.map(x=>x.id)).size,72);
 for(const c of standalone){
  assert.equal(c.options.length,4);
  assert.ok([-2,-1,0,1,2,3].includes(c.expected));
 }
 for(let s=0;s<2;s++)for(let i=0;i<20;i++){
  const item=makeOptions(s,i);
  assert.equal(item.options.length,4);
  assert.equal(item.options[item.expected],dialogues[s][i].answer);
  assert.equal(new Set(item.options).size,4);
 }
});

test('BONZE-063 comparison reports correlated rotations and self-replay separately',()=>{
 const dir=mkdtempSync(join(tmpdir(),'bonze063-'));
 try{
  const script=fileURLToPath(new URL('../scripts/bench-bonze063.mjs',import.meta.url));
  const output=execFileSync(process.execPath,[script],{cwd:dir,encoding:'utf8'});
  assert.match(output,/BONZE_063_SUMMARY/);
  const r=JSON.parse(readFileSync(join(dir,'bonze063-results.json'),'utf8'));
  assert.equal(r.prompts,72);
  assert.equal(r.results.length,896);
  assert.equal(r.summaries.length,6);
  assert.equal(r.firstErrors.length,32);
  assert.equal(r.errorCount,r.errors.length);
  const sessionRows=r.results.filter(x=>x.engine==='preference'&&x.mode==='self'&&x.session===1&&x.rotation===0);
  assert.equal(sessionRows.length,20);
  for(const summary of r.summaries){
   assert.equal(summary.trials,summary.set==='standalone'?128:160);
   assert.equal(summary.trials,summary.correct+
    r.results.filter(x=>x.engine===summary.engine&&x.set===summary.set&&x.mode===summary.mode&&!x.correct).length);
  }
  assert.ok(r.caveats.some(x=>x.includes('NOT tests of native Android')));
 }finally{rmSync(dir,{recursive:true,force:true});}
});
