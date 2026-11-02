/* BONZE-062 — opt-in experimental topic/preference arbiter.
 * External to Android. Explicit choices/refus are stronger than word overlap.
 * Requires BonzeNonNeuralArbiter; optional BonzeSafetyPriority guard.
 * No network, local storage, or user text in output. Inconclusive => abstain.
 */
(function(root){
'use strict';
var TOPICS={
 pirate:'pirate pirates corsaire corsaires bateau bateaux navire navires vaisseau voilier',
 robot:'robot robots automate automates',
 dragon:'dragon dragons',
 tortue:'tortue tortues',
 lune:'lune lunaire',
 etoile:'etoile etoiles',
 foret:'foret forets bois lanterne lanternes',
 chateau:'chateau chateaux forteresse forteresses',
 nuage:'nuage nuages',
 livre:'livre livres bibliotheque bibliotheques',
 riviere:'riviere rivieres fleuve fleuves',
 valise:'valise valises bagage bagages',
 montre:'montre montres horloge horloges',
 blague:'blague blagues humour plaisanterie plaisanteries rire rigolo drole',
 definition:'definition definitions sens signification signifie expliquer veut dire mot designe signifie terme expression'
};
var NAMES=Object.keys(TOPICS),DICTIONARY={};
for(var i=0;i<NAMES.length;i++){
 var key=NAMES[i],aliases=TOPICS[key].split(' ');
 for(var j=0;j<aliases.length;j++)DICTIONARY[aliases[j]]=key;
}
function norm(s){
 var x=String(s||'').toLowerCase();
 if(x.normalize)x=x.normalize('NFD');
 return x.replace(/[\u0300-\u036f]/g,'').replace(/['’]/g,' ')
  .replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
}
function words(s){return norm(s).split(' ').filter(Boolean);}
function hits(s){
 var out=[],seen={};
 for(var word of words(s)){
  var key=DICTIONARY[word];
  if(key&&!seen[key]){seen[key]=true;out.push(key);}
 }
 return out;
}
function matchWords(words,phrases,start){
 for(var k=0;k<phrases.length;k++){
  var tokens=phrases[k].split(' '),yes=true;
  for(var t=0;t<tokens.length;t++)if(words[start+t]!==tokens[t]){yes=false;break;}
  if(yes)return tokens.length;
 }
 return 0;
}
var DENY=[
 'je ne veux pas de','je ne veux pas des','je ne veux pas d',
 'je veux pas de','je veux pas des','je veux pas d',
 'je refuse les','je refuse le','je refuse la',
 'pas de','pas des','pas d','sans','evite les','evite le','evite la',
 'je prefere eviter','je n ai pas envie de',
 'laisse tomber les','laisse tomber le','oublie les','oublie le',
 'je ne veux pas parler de','je veux pas parler de'
];
var AFFIRM=[
 'je prefere','je voudrais','je veux','je souhaite',
 'j aimerais','parlons de','parlons d',
 'parle moi de','raconte','imagine','invente','donne',
 'je prefere parler de','je veux parler de','je voudrais parler de',
 'on parle de'
];
function parse(text){
 var n=norm(text),seq=words(text);
 var exclusions=[],ban={};
 // Negations of *emotion states* are not reinterpreted as a refusal of
 // the whole conversation. Only explicit reject-topic phrases count.
 for(var i=0;i<seq.length;i++){
  var size=matchWords(seq,DENY,i);
  if(!size)continue;
  var tail=seq.slice(i+size,Math.min(seq.length,i+size+7)).join(' ');
  var limited=tail.split(/\b(?:mais|plutot|au lieu de|en fait|sinon|et|je prefere|je veux|je voudrais|je souhaite|donne|explique|raconte|imagine|invente)\b/)[0];
  for(var key of hits(limited))if(!ban[key]){ban[key]=true;exclusions.push(key);}
  i+=size-1;
 }
 // Priority rules: the last positive directive wins, particularly after
 // a pivot ("mais / plutôt") that supersedes the previous topic.
 var positives=[],sawAffirm=false;
 for(i=0;i<seq.length;i++){
  size=matchWords(seq,AFFIRM,i);
  if(!size)continue;
  sawAffirm=true;
  // A negative directive must not create an affirmative one:
  // "je ne veux pas de pirates" and "je veux pas de pirates".
  if(i>0&&seq[i-1]==='ne')continue;
  var next=seq.slice(i+size,Math.min(seq.length,i+size+11)).join(' ');
  next=next.split(/\b(?:mais|plutot|sinon|au lieu de)\b/)[0];
  var candidateTopics=hits(next).filter(function(x){return !ban[x];});
  if(candidateTopics.length)positives.push({at:i,topics:candidateTopics});
 }
 // A "plutôt X" replaces the preceding preference even without verb.
 // A "pas X" after the preferred term is handled by DENY.
 for(i=0;i<seq.length;i++){
  if(seq[i]!=='plutot')continue;
  var phrase=seq.slice(i+1,Math.min(seq.length,i+10)).join(' ');
  var preferred=hits(phrase.split(/\b(?:mais|sinon|et)\b/)[0]).filter(function(x){return !ban[x];});
  positives=positives.filter(function(x){return x.at>i;});
  if(preferred.length)positives.push({at:i,topics:preferred});
  else return {preferred:[],excluded:exclusions,mode:'unresolved-pivot'};
 }
 // In anaphoric commands ("le dragon, raconte son aventure"), the
 // requested subject can precede the imperative rather than follow it.
 if(!positives.length&&sawAffirm&&!exclusions.length){
  var mentioned=hits(n);
  if(mentioned.length===1)positives.push({at:seq.length,topics:mentioned});
 }
  positives.sort(function(a,b){return a.at-b.at;});
 var chosen=positives.length?positives[positives.length-1].topics:[];
 // The latest message may explicitly reject a subject without supplying
 // a replacement. Do not silently fall back to a story from the context.
 var mode=chosen.length===1?'preferred':chosen.length>1?'ambiguous':exclusions.length?'only-refused':sawAffirm?'unresolved-selection':'no-directive';
 return {preferred:chosen,excluded:exclusions,mode:mode};
}
function rank(input){
 input=input&&typeof input==='object'?input:{};
 var base=root.BonzeNonNeuralArbiter;
 if(!base||typeof base.rank!=='function')return {index:-1,reason:'missing-baseline',scores:[]};
 var options=Array.isArray(input.options)?input.options:[];
 if(!options.length||options.length>8||options.some(function(x){return typeof x!=='string'||x.length>500;}))
  return {index:-1,reason:'invalid-options',scores:[]};
 // Keep explicit danger outside any story, negative preference or ranking.
 var safety=root.BonzeSafetyPriority;
 if(safety&&typeof safety.route==='function'&&safety.route(input.text||'').priority==='immediate')
  return {index:-1,reason:'safety-priority',scores:[],safety:'immediate'};
 var directive=parse(input.text||'');
 if(directive.mode==='ambiguous'||directive.mode==='unresolved-pivot'||directive.mode==='unresolved-selection')
  return {index:-1,reason:'ambiguous-preference',scores:[],directive:directive};
 var legacy=base.rank(input);
 if(directive.mode==='no-directive')
  return {index:legacy.index,reason:'baseline',scores:legacy.scores,directive:directive};
 if(directive.mode==='only-refused')
  return {index:-1,reason:'only-refused',scores:legacy.scores,directive:directive};
 var required=directive.preferred[0],found=false;
 var scores=options.map(function(option,index){
  var topics=hits(option),blocked=directive.excluded.some(function(x){return topics.indexOf(x)>=0;});
  var match=topics.indexOf(required)>=0;
  if(match&&!blocked)found=true;
  var baseline=(legacy.scores||[])[index];
  // Separate deterministic admissibility from style-ranking.
  // No negative candidate can override an explicit user veto.
  return {index:index,eligible:!blocked&&match,
   score:baseline&&typeof baseline.score==='number'?baseline.score:0};
 });
 if(!found)return {index:-1,reason:'requested-topic-unavailable',scores:scores,directive:directive};
 var eligible=scores.filter(function(x){return x.eligible;})
  .sort(function(a,b){return b.score-a.score||a.index-b.index;});
 if(eligible.length>1&&eligible[0].score===eligible[1].score)
  return {index:-1,reason:'ambiguous-candidates',scores:scores,directive:directive};
 return {index:eligible[0].index,reason:'preferred-topic',scores:scores,directive:directive};
}
root.BonzePreferenceArbiter={parse:parse,rank:rank,version:'BONZE-062'};
})(typeof globalThis!=='undefined'?globalThis:this);
