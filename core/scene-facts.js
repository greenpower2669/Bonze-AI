/* BONZE-070 — experimental symbolic fiction facts; opt-in and independent.
 * Small, allow-listed grammar: no claim to general NLU. No user memory,
 * network, persistence, personal names or raw-text result fields.
 * "No conflict" means insufficient proof, not confirmed consistency.
 */
(function(root){
'use strict';
var ACTORS={robot:1,gardien:1,gardienne:1,tortue:1,pirate:1,dragon:1,
 roi:1,reine:1,capitaine:1,pilote:1,coffre:1,porte:1,pont:1,trappe:1,
 coffret:1};
var OBJECTS={
 cle:'cle',cles:'cle',clef:'cle',clefs:'cle',
 carte:'carte',cartes:'carte',livre:'livre',livres:'livre',
 coffre:'coffre',coffres:'coffre',porte:'porte',portes:'porte',
 pont:'pont',ponts:'pont',mer:'mer',foret:'foret',forets:'foret',
 valise:'valise',valises:'valise',lettre:'lettre',lettres:'lettre',
 montre:'montre',montres:'montre'
};
var ACTIONS={ouvre:'open',ouvert:'open',ferme:'close',fermee:'close',
 garde:'keep',cache:'hide',prend:'take',tient:'hold',traverse:'cross',
 voit:'see',vu:'see',trouve:'find',possede:'possess',detient:'possess'};
var PARTICIPLES={ouvert:'open',ferme:'close',trouve:'find',cache:'hide',
 traverse:'cross',vu:'see'};
var STATES={ouvert:'open',ouverte:'open',ferme:'closed',fermee:'closed',
 vide:'empty',plein:'full',pleine:'full',rempli:'full',remplie:'full',
 endormi:'asleep',endormie:'asleep',reveille:'awake',reveillee:'awake',
 vivant:'alive',vivante:'alive',mort:'dead',morte:'dead'};
var EXCLUSIVE={open:'closed',closed:'open',empty:'full',full:'empty',
 asleep:'awake',awake:'asleep',alive:'dead',dead:'alive'};
var DAYS='hier|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche';
var DATED=new RegExp('^a (vu|traverse|trouve|ouvert|ferme|cache) (le|la|l) ([a-z]+) ('+DAYS+')$');
var TIME=/\b(?:maintenant|ensuite|finalement|puis|apres|demain|plus tard|le lendemain|de nouveau|a nouveau|n a plus|ne possede plus|avant|bientot)\b/;
var REPORTED=/\b(?:selon|dit|raconte|affirme|cite|citation|imagine|pretend|suppose|si|aurait|pourrait|reve|roman)\b/;
function norm(value){
 var x=String(value||'').toLowerCase();
 if(x.normalize)x=x.normalize('NFD');
 return x.replace(/[\u0300-\u036f]/g,'').replace(/['’]/g,' ')
  .replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
}
function fact(subject,predicate,object,quantity,polarity,time,article){
 return {subject:subject,predicate:predicate,object:object||null,
  quantity:quantity||null,polarity:polarity,time:time,
  article:article||null,scope:'fiction'};
}
function objectKey(token){return OBJECTS[token]||null;}
function parse(input){
 var raw=String(input||'');
 if(raw.length===0||raw.length>300)return null;
 var s=norm(raw);
 if(REPORTED.test(s))return null;
 var m=/^(le|la) ([a-z]+) (.+)$/.exec(s);
 if(!m||!ACTORS[m[2]])return null;
 var actor=m[1]+':'+m[2],tail=m[3],p,o,article;
 // Past denial can be compared with a specifically dated past fact.
 m=/^n a jamais (vu|traverse|trouve|ouvert|ferme|cache) (le|la|l) ([a-z]+)$/.exec(tail);
 if(m&&objectKey(m[3]))return fact(actor,PARTICIPLES[m[1]],objectKey(m[3]),null,false,'never',m[2]);
 m=DATED.exec(tail);
 if(m&&objectKey(m[3]))return fact(actor,PARTICIPLES[m[1]],objectKey(m[3]),null,true,'dated',m[2]);
 // A changed event may supersede the previous one; do not block it.
 if(TIME.test(s))return null;
 m=/^(?:possede|detient|a) (un|une|deux|trois|le|la) ([a-z]+)$/.exec(tail);
 if(m&&objectKey(m[2]))return fact(actor,'possess',objectKey(m[2]),'some',true,'scene',m[1]);
 m=/^(?:n a|ne possede|ne detient) (aucun|aucune) ([a-z]+)$/.exec(tail);
 if(m&&objectKey(m[2]))return fact(actor,'possess',objectKey(m[2]),'zero',false,'scene',m[1]);
 m=/^(?:n a pas de|ne possede pas de) ([a-z]+)$/.exec(tail);
 if(m&&objectKey(m[1]))return fact(actor,'possess',objectKey(m[1]),'zero',false,'scene',null);
 m=/^est (?:(?:toujours|encore|bien|reste|restee) )?(ouvert|ouverte|ferme|fermee|vide|plein|pleine|rempli|remplie|endormi|endormie|reveille|reveillee|vivant|vivante|mort|morte)$/.exec(tail);
 if(m)return fact(actor,'state',STATES[m[1]],null,true,'scene',null);
 m=/^(ouvre|ferme|garde|cache|prend|tient|traverse|voit|trouve) (le|la|l) ([a-z]+)$/.exec(tail);
 if(m&&objectKey(m[3]))return fact(actor,ACTIONS[m[1]],objectKey(m[3]),null,true,'scene',m[2]);
 m=/^ne (ouvre|ferme|garde|cache|prend|tient|traverse|voit|trouve) pas (le|la|l) ([a-z]+)$/.exec(tail);
 if(m&&objectKey(m[3]))return fact(actor,ACTIONS[m[1]],objectKey(m[3]),null,false,'scene',m[2]);
 m=/^ne (le|la|l) (ouvre|ferme|garde|cache|prend|tient|traverse|voit|trouve) pas$/.exec(tail);
 if(m)return fact(actor,ACTIONS[m[2]],null,null,false,'scene','pronoun:'+m[1]);
 m=/^(le|la|l) (ouvre|ferme|garde|cache|prend|tient|traverse|voit|trouve)$/.exec(tail);
 if(m)return fact(actor,ACTIONS[m[2]],null,null,true,'scene','pronoun:'+m[1]);
 return null;
}
function compatibleObject(a,b){
 if(a.object&&b.object)return a.object===b.object;
 if(!a.object&&!b.object)return false;
 var direct=a.object?a:b,pronoun=a.object?b:a;
 if(!pronoun.article||pronoun.article.indexOf('pronoun:')!==0)return false;
 var form=pronoun.article.slice(8);
 return form==='l'||form===direct.article;
}
function compare(a,b){
 if(!a||!b)return {conflict:false,reason:'unparsed'};
 if(a.subject!==b.subject)return {conflict:false,reason:'different-actor'};
 if(a.predicate==='state'&&b.predicate==='state'&&a.time==='scene'&&b.time==='scene'&&EXCLUSIVE[a.object]===b.object)
  return {conflict:true,reason:'exclusive-state'};
 if(a.predicate!==b.predicate||!compatibleObject(a,b))
  return {conflict:false,reason:'different-fact-or-ambiguous-reference'};
 if(a.time==='never'&&b.time==='dated'&&a.polarity===false&&b.polarity===true||
    b.time==='never'&&a.time==='dated'&&b.polarity===false&&a.polarity===true)
  return {conflict:true,reason:'never-versus-dated-past'};
 if(a.time!=='scene'||b.time!=='scene')
  return {conflict:false,reason:'time-not-comparable'};
 if(a.polarity!==b.polarity)
  return {conflict:true,reason:a.predicate==='possess'?'zero-versus-positive-quantity':'same-action-opposite-polarity'};
 return {conflict:false,reason:'no-provable-conflict'};
}
function check(prior,candidate){return compare(parse(prior),parse(candidate));}
root.BonzeSceneFacts={parse:parse,compare:compare,check:check,version:'BONZE-070'};
})(typeof globalThis!=='undefined'?globalThis:this);
