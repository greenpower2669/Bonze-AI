import test from "node:test";
import assert from "node:assert/strict";
import {INVARIANTS,INITIAL,evolve,competence,trial,listening,answer} from "../core/bonze.mjs";
test("invariants",()=>assert.ok(INVARIANTS.includes("respect")&&INVARIANTS.includes("micro_coupe_prioritaire")));
test("émotions bornées et apaisement",()=>{
  const a=evolve({...INITIAL,colere:.9},{empathie:.7}),b=evolve({...INITIAL,colere:.9},{});
  assert.ok(a.colere<b.colere);assert.ok(Object.values(a).every(v=>v>=0&&v<=1));
});
test("inconnu reste non testé",()=>assert.deepEqual(competence(),{status:"non_teste",confidence:null,tests:0}));
test("preuves contrôlées",()=>{
  let t=trial([],{id:"1",passed:true});t=trial(t,{id:"1",passed:false});t=trial(t,{id:"2",passed:false});
  assert.equal(t.length,2);assert.equal(competence(t).status,"a_reverifier");
  assert.throws(()=>trial(t,{id:"3",passed:"oui"}));
});
test("micro désactivé gagne toujours",()=>assert.equal(listening({disabled:true,precise:true}).mode,"off"));
test("adaptation",()=>{
  assert.equal(listening({disabled:false,pressure:"critical",precise:true}).mode,"text");
  assert.equal(listening({disabled:false,pressure:"high",eco:true}).mode,"eco");
  assert.equal(listening({disabled:false,precise:true}).mode,"precise");
  assert.equal(listening({disabled:false}).mode,"text");
});
test("inconnue avouée",()=>assert.match(answer("Combien de lunes Jupiter a-t-il ?").text,/Je ne sais pas/));
test("correction acceptée",()=>assert.match(answer("Tu ne comprends pas").text,/reformuler/));
