/* BONZE-067/068 — conservative offline story contradiction probe.
 * Only identifies a few explicit, same-event assertions or simultaneous
 * exclusive states. False => conflict is unproven, NOT verified consistency.
 * Never stores, returns, or logs user text. Not used for clinical safety.
 */
(function(root){
'use strict';
function norm(x){
 var s=String(x||'').toLowerCase();
 if(s.normalize)s=s.normalize('NFD');
 return s.replace(/[\u0300-\u036f]/g,'').replace(/['’]/g,' ')
  .replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
}
var TIMELINE=/\b(?:maintenant|finalement|ensuite|puis|apres|auparavant|hier|demain|bientot|soudain|entre temps|plus tard|de nouveau|a nouveau)\b/;
var REPORTED=/\b(?:dit|racontait|recit|cite|citation|citationne|hypothese|suppose|si|aurait|imagine|pretend)\b/;
var STOP={le:1,la:1,les:1,l:1,un:1,une:1,des:1,du:1,de:1,d:1,
  a:1,ne:1,n:1,pas:1,est:1,ce:1,cette:1,ces:1};
function stripped(s){
 return s.split(' ').filter(function(w){return w&&!STOP[w];}).join(' ');
}
function negated(s){
 return /\b(?:ne|n)\b(?: [a-z0-9]+){0,6} \bpas\b/.test(s);
}
var STATES={ouvert:'open',ouverte:'open',ferme:'closed',fermee:'closed',
 endormi:'asleep',endormie:'asleep',reveille:'awake',reveillee:'awake',
 vivant:'alive',vivante:'alive',mort:'dead',morte:'dead',
 present:'present',presente:'present',absent:'absent',absente:'absent',
 vide:'empty',plein:'full',pleine:'full'};
var OPPOSITE={open:'closed',closed:'open',asleep:'awake',awake:'asleep',
 alive:'dead',dead:'alive',present:'absent',absent:'present',empty:'full',full:'empty'};
function parseState(s){
 var m=/^((?:le|la|l|un|une) [a-z0-9]+) est (?:(?:toujours|encore|bien|reste|restee) )?(ouvert|ouverte|ferme|fermee|endormi|endormie|reveille|reveillee|vivant|vivante|mort|morte|present|presente|absent|absente|vide|plein|pleine)$/.exec(s);
 return m?{actor:m[1],state:STATES[m[2]]}:null;
}
function sameDefiniteSubject(a,b){
 var pa=/^(le|la|les|l) ([a-z0-9]+)/.exec(a),pb=/^(le|la|les|l) ([a-z0-9]+)/.exec(b);
 if(pa||pb)return Boolean(pa&&pb&&pa[1]===pb[1]&&pa[2]===pb[2]);
 // Repeated personal pronouns remain a limited reference assumption.
 var qa=/^(il|elle|ils|elles) /.exec(a),qb=/^(il|elle|ils|elles) /.exec(b);
 return Boolean(qa&&qb&&qa[1]===qb[1]);
}
function check(prior,candidate){
 var a=norm(prior),b=norm(candidate);
 if(!a||!b||a.length>500||b.length>500)return {conflict:false,reason:'insufficient-evidence'};
 if(TIMELINE.test(a)||TIMELINE.test(b))return {conflict:false,reason:'time-may-have-passed'};
 if(REPORTED.test(a)||REPORTED.test(b))return {conflict:false,reason:'reported-or-conditional'};
 var sa=parseState(a),sb=parseState(b);
 if(sa&&sb&&sa.actor===sb.actor&&OPPOSITE[sa.state]===sb.state)
  return {conflict:true,reason:'exclusive-simultaneous-state'};
 var aa=stripped(a),bb=stripped(b);
 if(aa&&aa===bb&&aa.split(' ').length>=2&&sameDefiniteSubject(a,b)&&negated(a)!==negated(b))
  return {conflict:true,reason:'opposite-explicit-assertion'};
 return {conflict:false,reason:'no-provable-contradiction'};
}
root.BonzeStoryConsistency={check:check,version:'BONZE-067'};
})(typeof globalThis!=='undefined'?globalThis:this);
