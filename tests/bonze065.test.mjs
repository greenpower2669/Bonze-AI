import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {fileURLToPath} from 'node:url';
import {stories,safetyCases,choicesFor} from './fixtures/bonze065-unseen-protocol.mjs';

test('BONZE-065: frozen 3x20 dialogues and 30 distinct safety inputs',()=>{
 assert.equal(stories.length,3);
 assert.deepEqual(stories.map(x=>x.length),[20,20,20]);
 assert.equal(safetyCases.length,30);
 const ids=[...stories.flat().map(x=>x.id),...safetyCases.map(x=>x.id)];
 assert.equal(new Set(ids).size,90);
 for(let s=0;s<3;s++)for(let t=0;t<20;t++){
  const c=choicesFor(s,t);
  assert.equal(c.options.length,4);
  assert.equal(new Set(c.options).size,4);
  assert.equal(c.options[c.expectedIndex],stories[s][t].expected);
 }
 assert.equal(safetyCases.filter(x=>x.expected==='needs-review').length,7);
});
test('BONZE-065: isolate abstention, topic memory and safety-review statuses',()=>{
 const dir=mkdtempSync(join(tmpdir(),'bonze065-'));
 try{
  const script=fileURLToPath(new URL('../scripts/bench-bonze065.mjs',import.meta.url));
  assert.match(execFileSync(process.execPath,[script],{cwd:dir,encoding:'utf8'}),/BONZE_065_RESULT/);
  const r=JSON.parse(readFileSync(join(dir,'bonze065-results.json'),'utf8'));
  assert.equal(r.scripts,3);
  assert.equal(r.totalDialogueDecisions,720);
  assert.equal(r.dialogueSummary.length,3);
  assert.equal(r.trialRows.length,720);
  assert.equal(r.sessions.length,36);
  assert.equal(r.safetyRows.length,30);
  assert.equal(r.safetySummary.reviewRequired,7);
  for(const s of r.dialogueSummary)assert.equal(s.trials,240);
  assert.equal(r.safetyRows.filter(x=>x.shouldReview&&x.match===null).length,7);
  assert.equal(r.safetySummary.referenceLabeled+r.safetySummary.reviewRequired,30);
  assert.ok(r.caveats.some(x=>x.includes('not external human evaluation')));
 }finally{rmSync(dir,{recursive:true,force:true});}
});
