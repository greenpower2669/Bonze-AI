import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {scenarios} from './fixtures/bonze068-new-scenes.mjs';

test('BONZE-068: freeze 35 uniquely named, developer-labeled cases',()=>{
 assert.equal(scenarios.length,35);
 assert.equal(new Set(scenarios.map(x=>x.id)).size,35);
 assert.equal(scenarios.filter(x=>x.conflict).length,12);
 assert.equal(scenarios.filter(x=>!x.conflict).length,23);
});
test('BONZE-068: baseline evaluation produces complete report',()=>{
 const dir=mkdtempSync(join(tmpdir(),'bonze068-'));
 try{
  const script=fileURLToPath(new URL('../scripts/bench-bonze068-baseline.mjs',import.meta.url));
  const out=execFileSync(process.execPath,[script],{cwd:dir,encoding:'utf8'});
  assert.match(out,/BONZE_068_BASELINE/);
  const report=JSON.parse(readFileSync(join(dir,'bonze068-baseline.json'),'utf8'));
  assert.equal(report.size,35);
  assert.equal(report.rows.length,35);
  assert.equal(Object.values(report.matrix).reduce((a,b)=>a+b,0),35);
  assert.ok(report.notes.some(x=>x.includes('not independently')));
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('BONZE-068: the safety guard cannot decide a narrative contradiction',()=>{
 const env={};
 runInNewContext(readFileSync(new URL('../core/story-consistency.js',import.meta.url),'utf8'),env);
 const a=env.BonzeStoryConsistency.check('La porte est ouverte.','Maintenant la porte est fermée.');
 assert.equal(a.conflict,false);
 assert.equal(a.reason,'time-may-have-passed');
});
