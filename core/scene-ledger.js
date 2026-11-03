/* BONZE-070 — opt-in, in-memory fiction provenance ledger.
 * A proposed sentence is NOT an event. Only a matching delivery receipt
 * commits its structured, allow-listed facts; unknown delivery is a
 * boundary marker, never a claim about the user or the real world.
 */
(function(root){
'use strict';
function createLedger(options){
 var engine=root.BonzeSceneFacts;
 if(!engine||typeof engine.parse!=='function')return null;
 var n=options&&Number.isInteger(options.maxEvents)?options.maxEvents:8;
 var limit=Math.max(1,Math.min(12,n)),history=[],pending=null,serial=0,ordinal=0;
 function last(){return history.length?history[history.length-1].fact:null;}
 function evaluate(text){
  var next=engine.parse(text),decision=engine.compare(last(),next);
  return {conflict:decision.conflict,reason:decision.reason,recognized:Boolean(next)};
 }
 function propose(text){
  pending=null; // an unacknowledged proposal has no durable provenance
  var next=engine.parse(text),test=engine.compare(last(),next);
  if(test.conflict)return {decision:'abstain',reason:test.reason,receipt:null,recognized:Boolean(next)};
  var receipt='delivery-'+(++serial);
  pending={receipt:receipt,fact:next};
  return {decision:'allow',reason:next?'structured':'unparsed',receipt:receipt,recognized:Boolean(next)};
 }
 function acknowledge(receipt){
  if(!pending||pending.receipt!==receipt)return false;
  // The caller must invoke this after actual delivery to screen or voice.
  var entry={turn:++ordinal,source:'assistant-delivered',scope:'fiction',fact:pending.fact};
  pending=null;
  history.push(entry);
  if(history.length>limit)history.shift();
  return true;
 }
 function snapshot(){
  return {eventCount:history.length,knownCount:history.filter(function(e){return Boolean(e.fact);}).length,
   pending:Boolean(pending),nextTurn:ordinal+1,hasComparableFact:Boolean(last())};
 }
 function records(){
  return history.map(function(e){
   return {turn:e.turn,source:e.source,scope:e.scope,
    fact:e.fact?Object.assign({},e.fact):null};
  });
 }
 function reset(){history=[];pending=null;ordinal=0;}
 return {evaluate:evaluate,propose:propose,acknowledge:acknowledge,
  snapshot:snapshot,records:records,reset:reset};
}
root.BonzeSceneLedger={createLedger:createLedger,version:'BONZE-070'};
})(typeof globalThis!=='undefined'?globalThis:this);
