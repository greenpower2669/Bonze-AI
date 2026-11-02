/* BONZE-064 — experimental symbolic subject anchor for offline dialogue.
 * A user's explicit topic is kept separately from generated/selected replies.
 * Last reply MUST NOT silently overwrite this state. No Android wiring,
 * persistent memory, user text, model calls or network.
 */
(function(root){
'use strict';
var ALIASES={
 pirate:'pirate pirates corsaire corsaires bateau bateaux navire navires',
 robot:'robot robots automate automates',
 dragon:'dragon dragons',
 tortue:'tortue tortues',
 lune:'lune lunaire',
 valise:'valise valises bagage bagages',
 chateau:'chateau chateaux forteresse forteresses',
 foret:'foret forets bois',
 nuage:'nuage nuages',
 livre:'livre livres bibliotheque bibliotheques',
 riviere:'riviere rivieres fleuve fleuves'
};
var LOOKUP={};
for(var key of Object.keys(ALIASES))for(var word of ALIASES[key].split(' '))LOOKUP[word]=key;
function norm(s){
 var x=String(s||'').toLowerCase();
 if(x.normalize)x=x.normalize('NFD');
 return x.replace(/[\u0300-\u036f]/g,'').replace(/['’]/g,' ')
  .replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
}
function topics(s){
 var found=[],used={};
 for(var word of norm(s).split(' ')){
  var key=LOOKUP[word];
  if(key&&!used[key]){used[key]=true;found.push(key);}
 }
 return found;
}
function explicitPivot(text){
 var n=norm(text);
 var match=n.match(/^(?:revenons|retournons|reprenons|repartons|passons|allons|retour) (?:a|aux|au|sur|vers|pour|dans|du|des) (.+)$/);
 if(!match)return {seen:false,topic:null};
 var part=match[1].split(/\b(?:mais|pas|sans|plutot|sinon|et|ou)\b/)[0];
 var list=topics(part);
 return {seen:true,topic:list.length===1?list[0]:null};
}
function continuation(text){
 return /^(?:et ensuite|et apres|ensuite|apres|et alors|continue|poursuis|que fait il|que fait elle|que devient|et maintenant|comment ca finit|pour finir|comment ca se termine)/.test(norm(text));
}
function session(){
 var active=null,turn=0;
 function step(input){
  input=input&&typeof input==='object'?input:{};
  var message=String(input.text||''),options=input.options;
  var preference=root.BonzePreferenceArbiter,safety=root.BonzeSafetyPriority;
  if(!preference||!safety||typeof preference.rank!=='function')
   return {index:-1,reason:'missing-dependency',topic:active,turn:turn};
  var urgent=safety.route(message);
  if(urgent.priority==='immediate'){
   active=null;turn++;
   return {index:-1,reason:'safety-priority',topic:null,turn:turn};
  }
  var user=preference.parse(message),pivot=explicitPivot(message);
  var reason='unchanged';
  if(user.mode==='preferred'){
   // Never change to an out-of-vocabulary or multiple-topic directive.
   active=user.preferred.length===1?user.preferred[0]:null;
   reason='explicit-preference';
  }else if(pivot.seen){
   active=pivot.topic;reason=pivot.topic?'explicit-pivot':'unknown-pivot';
  }else if(user.mode==='ambiguous'||user.mode==='unresolved-pivot'||user.mode==='unresolved-selection'){
   active=null;reason='needs-clarification';
  }else if(user.mode==='only-refused'){
   if(user.excluded.indexOf(active)>=0){active=null;reason='topic-refused';}
  }else if(!active&&!continuation(message)){
   // New topic introduced in a story command, but no formal preference
   // was recognized. Require exactly one known canonical subject.
   var q=norm(message),instruction=/^(?:raconte|imagine|invente|une histoire|un conte|creons|cree)/.test(q);
   var candidates=topics(q);
   if(instruction&&candidates.length===1){active=candidates[0];reason='story-start';}
  }
  var context=active?'Notre histoire parle de '+active+'.':'';
  // Explicit topic anchoring is orthogonal to the answer content: a
  // hallucinated/irrelevant answer does NOT update the symbolic state.
  var ranked=preference.rank({...input,context:context||input.context||''});
  turn++;
  return {index:ranked.index,reason:ranked.reason,topic:active,
   stateReason:reason,turn:turn};
 }
 return {step:step,reset:function(){active=null;turn=0;},
  snapshot:function(){return {topic:active,turn:turn};}};
}
root.BonzeTopicAnchor={createSession:session,version:'BONZE-064'};
})(typeof globalThis!=='undefined'?globalThis:this);
