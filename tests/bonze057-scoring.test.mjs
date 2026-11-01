import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const scorer=fileURLToPath(new URL('../scripts/score-dialogue.mjs',import.meta.url));

test('BONZE-057: index benchmark scorer separates correct, incorrect and invalid responses',()=>{
 const dir=mkdtempSync(join(tmpdir(),'bonze057-'));
 try {
  const records=[
   {model:'liquid-tiny',variant:'C1',case:'pirate',expected:2,response:'2',valid:true,latencyMs:5,endToEndMs:12,tokens:1},
   {model:'liquid-tiny',variant:'C1',case:'dragon',expected:1,response:'0',valid:true,latencyMs:8,endToEndMs:18,tokens:1},
   {model:'liquid-tiny',variant:'C1',case:'unknown',expected:0,response:'la réponse',valid:false,latencyMs:7,endToEndMs:15,tokens:3},
   {model:'liquid-small',variant:'C1',case:'pirate',expected:2,response:'2',valid:true,latencyMs:5,endToEndMs:11,tokens:1},
   {model:'liquid-tiny',variant:'R0',case:'pipo_memoire',response:'Pipo se cache près du lac.',latencyMs:45,tokens:15}
  ];
  const path=join(dir,'fixture.jsonl');
  writeFileSync(path,records.map(x=>JSON.stringify(x)).join('\n')+'\n');
  execFileSync(process.execPath,[scorer,path],{cwd:dir,stdio:'pipe'});
  const report=readFileSync(join(dir,'bonze031-diagnostics.md'),'utf8');
  assert.match(report,/liquid-tiny \| 3 \| 2 \| 1 \| 33\.3 % \| 15/);
  assert.match(report,/liquid-small \| 1 \| 1 \| 1 \| 100 % \| 11/);
  assert.match(report,/sorties non conformes : unknown/);
  assert.match(report,/indices erronés : dragon/);
  assert.match(report,/R0 \| 1 \| 45/);
 } finally {rmSync(dir,{recursive:true,force:true});}
});