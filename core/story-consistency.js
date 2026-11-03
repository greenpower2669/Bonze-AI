/* BONZE-067/068/069 — conservative offline story contradiction probe.
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
/* BONZE-069: narrow logic on canonical, definite subjects only.
 * These are assertions within one fictional scene, not logical entailment
 * across arbitrary discourse. Incomplete => leave the choice unresolved.
 */
function definiteClause(s){
 var m=/^((?:le|la|l) [a-z0-9]+) (.+)$/.exec(s);
 return m?{subject:m[1],rest:m[2]}:null;
}
function possession(s){
 var c=definiteClause(s),m;
 if(!c)return null;
 m=/^(?:possede|a) (?:un|une|le|la|l) ([a-z0-9]+)$/.exec(c.rest);
 if(m)return {subject:c.subject,object:m[1],polarity:true};
 m=/^(?:n a|ne possede) (?:aucun|aucune) ([a-z0-9]+)$/.exec(c.rest);
 if(m)return {subject:c.subject,object:m[1],polarity:false};
 m=/^(?:n a pas de|ne possede pas de) ([a-z0-9]+)$/.exec(c.rest);
 if(m)return {subject:c.subject,object:m[1],polarity:false};
 return null;
}
function everStatement(s){
 var c=definiteClause(s),m;
 if(!c)return null;
 m=/^n a jamais (ouvert|ferme|trouve|cache) (?:le|la|l) ([a-z0-9]+)$/.exec(c.rest);
 if(m)return {subject:c.subject,verb:m[1],object:m[2],ever:false};
 m=/^a (ouvert|ferme|trouve|cache) (?:le|la|l) ([a-z0-9]+) (?:hier|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)$/.exec(c.rest);
 if(m)return {subject:c.subject,verb:m[1],object:m[2],ever:true};
 return null;
}
function referencedAction(s){
 var c=definiteClause(s),m;
 if(!c)return null;
 // Exactly one object in the complete utterance: never resolve multiple
 // referents, named actors, object modifiers or newly introduced characters.
 m=/^(ouvre|ferme|garde|cache) (le|la|l) ([a-z0-9]+)$/.exec(c.rest);
 if(m)return {subject:c.subject,verb:m[1],article:m[2],polarity:true,explicit:true};
 m=/^n (ouvre|ferme|garde|cache) pas (le|la|l) ([a-z0-9]+)$/.exec(c.rest);
 if(m)return {subject:c.subject,verb:m[1],article:m[2],polarity:false,explicit:true};
 m=/^ne (le|la|l) (ouvre|ferme|garde|cache) pas$/.exec(c.rest);
 if(m)return {subject:c.subject,verb:m[2],article:m[1],polarity:false,explicit:false};
 m=/^(le|la|l) (ouvre|ferme|garde|cache)$/.exec(c.rest);
 if(m)return {subject:c.subject,verb:m[2],article:m[1],polarity:true,explicit:false};
 return null;
}
function sameArticle(pronoun,article){
 return pronoun==='l'||pronoun===article;
}
function strictExtension(a,b){
 var x=possession(a),y=possession(b);
 if(x&&y&&x.subject===y.subject&&x.object===y.object&&x.polarity!==y.polarity)
  return 'exclusive-possession-quantifier';
 x=everStatement(a);y=everStatement(b);
 if(x&&y&&x.subject===y.subject&&x.object===y.object&&x.verb===y.verb&&x.ever!==y.ever)
  return 'never-versus-dated-past';
 x=referencedAction(a);y=referencedAction(b);
 if(x&&y&&x.subject===y.subject&&x.verb===y.verb&&x.polarity!==y.polarity&&x.explicit!==y.explicit){
  var pronoun=x.explicit?y.article:x.article,object=x.explicit?x.article:y.article;
  if(sameArticle(pronoun,object))return 'single-object-pronoun-negation';
 }
 return null;
}
function check(prior,candidate){
 var a=norm(prior),b=norm(candidate);
 if(!a||!b||a.length>500||b.length>500)return {conflict:false,reason:'insufficient-evidence'};
 if(REPORTED.test(a)||REPORTED.test(b))return {conflict:false,reason:'reported-or-conditional'};
 var strict=strictExtension(a,b);
 if(strict)return {conflict:true,reason:strict};
 if(TIMELINE.test(a)||TIMELINE.test(b))return {conflict:false,reason:'time-may-have-passed'};
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
