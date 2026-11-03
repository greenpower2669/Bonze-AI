/* BONZE-059 experimental non-neural response scorer. Not installed in Android.
 * Deterministic, independent of option index; no online service or private state.
 * Scores topical overlap plus a few conservative discourse / safety rules.
 * Abstains on ties, empty topics and ambiguous cases instead of inventing facts.
 */
(function(root){
'use strict';
var STOP='a ai au aux avec ce ces cette comme dans de des du elle en est et eux il je la le les leur lui ma mais me mes moi mon ne nos notre nous on ou par pas pour que quel quelle qui sa se ses si son sont sur ta te tes toi ton tu un une vos votre vous alors encore puis ensuite apres histoire imagine invente raconte parler voudrait veux voudrai voulais faire trouver peux voudrais peux tu'.split(' ');
var COMMON={};for(var i=0;i<STOP.length;i++)COMMON[STOP[i]]=true;
var GROUPS=[
 'pirate pirates corsaire corsaires bateau bateaux navire navires vaisseau voilier mer ocean ile',
 'dragon dragons',
 'robot robots automate automates',
 'tortue tortues',
 'nuage nuages',
 'chateau chateaux forteresse forteresses',
 'foret forets bois lanterne lanternes',
 'lune lunaire',
 'livre livres bibliotheque bibliotheques',
 'riviere rivieres fleuve fleuves',
 'montre montres horloge horloges',
 'valise valises bagage bagages',
 'etoile etoiles ciel',
 'tristesse triste pleure pleurer chagrin peine malheureux',
 'colere furieux fache enerve agace injustice injuste',
 'peur inquiet angoisse angoisse stress crainte',
 'humour blague plaisanterie drole rire rigolo amusant',
 'definition signification signifie veut sens expliquer',
 'aide assistance secours urgent urgence danger',
 'pardon erreur faux corrige correction trompe',
 'merci remercie gentil gratitude',
 'robotique mecanique'
];
var ALIAS={};for(var g=0;g<GROUPS.length;g++)for(var word of GROUPS[g].split(' '))ALIAS[word]=GROUPS[g].split(' ')[0];
var KEYWORDS='pirate dragon robot tortue nuage chateau foret lune livre riviere montre valise etoile tristesse colere peur humour definition aide pardon merci'.split(' ');
var TOPICS={};for(var k=0;k<KEYWORDS.length;k++)TOPICS[KEYWORDS[k]]=true;
function norm(s){
 var x=String(s||'').toLowerCase();
 if(x.normalize)x=x.normalize('NFD');
 return x.replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
}
function tokens(s){
 var out=[],used={},ws=norm(s).split(' ');
 for(var t of ws){
  if(t.length<3||COMMON[t])continue;
  // Canonicalize *only* known equivalences; no approximate fuzzy matches.
  var normalized=ALIAS[t]||t;
  if(normalized.length>4&&!TOPICS[normalized]&&normalized.endsWith('s'))normalized=normalized.slice(0,-1);
  if(!used[normalized]){used[normalized]=true;out.push(normalized);}
 }
 return out;
}
function includesPhrase(s,pat){return new RegExp('(?:^| )('+pat+')(?: |$)').test(norm(s));}
function isNegative(text){
 return includesPhrase(text,'pas triste|pas en colere|plus peur|pas peur|ne suis plus inquiet|pas inquiet|ne suis pas triste');
}
function kind(text){
 var n=norm(text);
 if(includesPhrase(n,'danger immediat|au secours|me tuer|suicide|urgence vitale'))return 'urgence';
 if(/^que signifie|^quelle est la definition|^que veut dire|^quel est le sens/.test(n))return 'definition';
 if(isNegative(n))return 'negation';
 if(includesPhrase(n,'je pleure|je suis triste|je me sens triste'))return 'tristesse';
 if(includesPhrase(n,'je suis en colere|c est injuste|je suis furieux'))return 'colere';
 if(includesPhrase(n,'raconte une blague|rire|humour|blague'))return 'humour';
 if(/^imagine|^invente|^raconte une histoire/.test(n))return 'fiction';
 if(/^et apres|^et ensuite|^que lui arrive|^continue/.test(n))return 'suite';
 return 'discussion';
}
function score(text,context,candidate){
 var q=tokens(text),c=tokens(candidate),ctx=tokens(context||'');
 var map={};for(var w of c)map[w]=true;
 var relevance=0,shared=0;
 for(var w of q)if(map[w]){relevance+=TOPICS[w]?7:3;shared++;}
 // Context is intentionally weaker than the latest explicit instruction,
 // except when the latest message is a continuation with no named subject.
 var intent=kind(text),weight=intent==='suite'?6:1;
 for(var w of ctx)if(map[w])relevance+=(TOPICS[w]?weight:Math.max(.5,weight/2));
 var n=norm(candidate);
 if(intent==='definition'){
  if(includesPhrase(n,'signifie|definition|sens|expression|mot'))relevance+=8;
  if(includesPhrase(n,'tu es en colere|tu as peur|tu es triste'))relevance-=12;
 }
 if(intent==='urgence'){
  if(includesPhrase(n,'secours|aide|urgence|contacte|danger'))relevance+=12;
  if(includesPhrase(n,'blague|rigolo|rire'))relevance-=15;
 }
 if(intent==='negation'){
  if(includesPhrase(n,'tu es triste|tu sembles triste|tu as peur|tu es en colere'))relevance-=15;
 }
 if(intent==='tristesse'){
  if(includesPhrase(n,'peine|triste|ecoute|raconter|parler|aide'))relevance+=5;
  if(includesPhrase(n,'blague|rire'))relevance-=12;
 }
 if(intent==='colere'){
  if(includesPhrase(n,'injuste|injustice|colere|comprends|reflechir'))relevance+=5;
  if(includesPhrase(n,'blague|rire'))relevance-=12;
 }
 if(intent==='humour'&&includesPhrase(n,'blague|escargot|drole|rigolo|rire'))relevance+=4;
 if(intent==='fiction'&&includesPhrase(n,'quel personnage|quelle histoire')&&shared===0)relevance+=1;
 return {score:relevance,overlap:shared};
}
function rank(input){
 input=input&&typeof input==='object'?input:{};
 var choices=Array.isArray(input.options)?input.options:[];
 if(!choices.length||choices.length>8||choices.some(function(x){return typeof x!=='string'||x.length>500; }))
  return {index:-1,reason:'invalid-options',scores:[]};
 var details=choices.map(function(x,i){var item=score(input.text||'',input.context||'',x);return {index:i,score:item.score,overlap:item.overlap};});
 var ordered=details.slice().sort(function(a,b){return b.score-a.score||a.index-b.index;});
 var top=ordered[0],runner=ordered.length>1?ordered[1]:{score:-Infinity};
 if(top.score<=0||top.score===runner.score)
  return {index:-1,reason:top.score<=0?'no-evidence':'ambiguous',scores:details};
 return {index:top.index,reason:'ranked',scores:details,margin:top.score-runner.score};
}
root.BonzeNonNeuralArbiter={rank:rank,normalize:norm,tokenize:tokens,version:'BONZE-059'};
})(typeof globalThis!=='undefined'?globalThis:this);
