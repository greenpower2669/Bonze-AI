import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {NAMES,features,inferExperts,evolveForces} from "../core/experts.mjs";
const W=JSON.parse(readFileSync(new URL("../core/weights/expert-router-v1.json",import.meta.url),"utf8"));
test("weights are genuinely trained tensors",()=>{
  assert.equal(W.version,1);assert.equal(W.examples,64);
  assert.equal(W.gate.length,8);assert.equal(W.experts.length,8);
  assert.ok(W.gate.flat().some(x=>Math.abs(x)>.05));
  assert.equal(W.features,features("bonjour").length);
});
test("router top-2 sparse and probabilities",()=>{
  const r=inferExperts("Je suis curieux et veux apprendre",W);
  assert.equal(r.top2.length,2);
  assert.ok(Math.abs(r.all.reduce((a,v)=>a+v.weight,0)-1)<1e-9);
  assert.ok(r.top2[0].weight>=r.top2[1].weight);
});
test("seed training intents are distinguishable",()=>{
  const cases={"Je suis furieux":"colere","J'ai peur":"peur","Raconte une blague":"humour",
  "Ça me rend heureux":"joie","Je veux rester calme":"calme",
  "Je veux aider cette personne":"empathie","Je suis curieux":"curiosite",
  "Je réfléchis à cette question":"reflexion"};
  for(const [input,expected] of Object.entries(cases))
    assert.equal(inferExperts(input,W).top2[0].name,expected,input);
});
test("force interaction asymmetric, bounded",()=>{
  const r=inferExperts("Je suis en colère",W);
  const output=evolveForces({colere:.8,empathie:.7,calme:.5},r,1);
  assert.ok(NAMES.every(k=>output[k]>=0&&output[k]<=1));
  const unopposed=evolveForces({colere:.8,empathie:0,calme:.5},r,1);
  assert.ok(output.colere<unopposed.colere, "empathy should inhibit anger");
});
test("fail closed on absent or corrupt weights",()=>{
  assert.throws(()=>inferExperts("salut",null),/Poids MoE/);
  assert.throws(()=>inferExperts("salut",{...W,gate:[1]}),/Dimensions/);
});
