import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {expand,families,historical} from './fixtures/bonze059-french-cases.mjs';
const source=readFileSync(new URL('../core/non-neural-arbiter.js',import.meta.url),'utf8');
const sandbox={};
runInNewContext(source,sandbox,{timeout:3000});
const score=sandbox.BonzeNonNeuralArbiter.rank;

test('BONZE-059: fixture count and categorical references are stable',()=>{
 const cases=expand();
 assert.equal(families.length,22);
 assert.equal(historical.length,11);
 assert.equal(cases.length,99);
 assert.equal(new Set(cases.map(x=>x.id)).size,99);
 assert.equal(new Set(cases.map(x=>x.text)).size,99);
 for(const c of cases){
  assert.equal(c.options.length,4);
  assert.ok(Number.isInteger(c.expected)&&c.expected>=0&&c.expected<=3);
 }
});
test('BONZE-059: scorer is invariant to an option rotation when the topic is clear',()=>{
 const q={text:'Imagine un dragon',context:'',
  options:['Le dragon rencontre une flamme.','Un robot regarde les étoiles.','Le pirate monte à bord.','Un château change de couleur.']};
 for(let rotation=0;rotation<4;rotation++){
  const shifted=q.options.slice(rotation).concat(q.options.slice(0,rotation));
  const p=score({...q,options:shifted});
  assert.equal(p.index,(4-rotation)%4,'rotation '+rotation);
 }
});
test('BONZE-059: ties and ungrounded texts abstain instead of guessing',()=>{
 for(const q of [
  {text:'Un sujet totalement absent',options:['Lalala sans rapport','Bobo sans rapport','Pipi sans rapport','Coco sans rapport']},
  {text:'Imagine un pirate',options:['Un pirate regarde la mer.','Un pirate regarde la mer.','Un robot dessine.','La lune brille.']}
 ]){
  const p=score(q);
  assert.equal(p.index,-1);
  assert.ok(['ambiguous','no-evidence'].includes(p.reason));
 }
});
test('BONZE-059: prioritize urgent assistance over comedy',()=>{
 const p=score({text:'Au secours, je suis en danger immédiat',
  options:['Un dragon danse dans la forêt.','Une blague de tortue.','Contacte les secours et demande de l’aide maintenant.','Un robot peint la lune.']});
 assert.equal(p.index,2);
});
test('BONZE-059: no persisted personal text or network needed',()=>{
 const p=score({text:'Imagine un dragon nommé MotSecretRare',
   options:['Une histoire de dragon.','La tortue va au marché.','Le pirate monte à bord.','Un robot saute.']});
 assert.equal(p.index,0);
 assert.ok(!JSON.stringify(p).includes('MotSecretRare'));
 assert.ok(!source.includes('fetch('));
});
test('BONZE-059: benchmark creates 396 decisions, separates abstentions and runs without weights',()=>{
 const dir=mkdtempSync(join(tmpdir(),'bonze059-'));
 try{
  const script=fileURLToPath(new URL('../scripts/bench-non-neural.mjs',import.meta.url));
  const stdout=execFileSync(process.execPath,[script],{cwd:dir,encoding:'utf8'});
  assert.match(stdout,/BONZE_059_RESULT/);
  const report=JSON.parse(readFileSync(join(dir,'bonze059-diagnostics.json'),'utf8'));
  assert.equal(report.uniqueRequests,99);
  assert.equal(report.evaluatedDecisions,396);
  assert.equal(report.chanceReferencePct,25);
  assert.equal(report.rows.length,396);
  assert.equal(report.summaryByFamily.length,33);
  const four=report.rows.filter(x=>x.case==='historic_dragon');
  assert.equal(four.length,4);
  assert.equal(new Set(four.map(x=>x.expected)).size,4);
  assert.ok(report.summary[0].correct>=0&&report.summary[0].correct<=396);
  assert.ok(report.summary[0].abstentions>=0);
 }finally{rmSync(dir,{recursive:true,force:true});}
});