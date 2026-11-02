/* BONZE-066: experimental, session-scoped narrative continuity.
 * Two channels: confirmed subject and latest acknowledged assistant sentence.
 * Not connected to Android, storage, neural inference or network.
 */
(function(root){
'use strict';
function createSession(){
 var topicEngine=root.BonzeTopicAnchor;
 var selector=root.BonzePreferenceArbiter;
 if(!topicEngine||!selector)return null;
 var anchor=topicEngine.createSession();
 var lastSentence='',pending=null,serial=0;
 function clear(){lastSentence='';pending=null;}
 function step(input){
  input=input&&typeof input==='object'?input:{};
  pending=null; // an undelivered suggestion must never become history
  var previous=anchor.snapshot().topic;
  var first=anchor.step(input);
  if(first.reason==='safety-priority'){
   clear();
   return {index:-1,reason:first.reason,topic:null,turn:first.turn,receipt:null};
  }
  if(first.topic!==previous||!first.topic)clear();
  var response=first;
  if(first.topic&&lastSentence){
   var context='Histoire : '+first.topic+'. Derniere phrase : '+lastSentence;
   response=selector.rank({text:input.text||'',options:input.options,context:context});
  }
  var receipt=null;
  if(Array.isArray(input.options)&&response.index>=0&&response.index<input.options.length){
   receipt='turn-'+(++serial);
   pending={receipt:receipt,content:String(input.options[response.index]).slice(0,240)};
  }
  return {index:response.index,reason:response.reason,topic:first.topic,
   turn:first.turn,hasScene:Boolean(lastSentence),receipt:receipt};
 }
 function acknowledge(receipt){
  if(!pending||receipt!==pending.receipt)return false;
  lastSentence=pending.content;
  pending=null;
  return true;
 }
 return {step:step,acknowledge:acknowledge,
  snapshot:function(){var x=anchor.snapshot();return {topic:x.topic,turn:x.turn,hasScene:Boolean(lastSentence),hasPending:Boolean(pending)};},
  reset:function(){anchor.reset();clear();} // preserve monotonic receipts across reset};
}
root.BonzeSceneAnchor={createSession:createSession,version:'BONZE-066'};
})(typeof globalThis!=='undefined'?globalThis:this);
