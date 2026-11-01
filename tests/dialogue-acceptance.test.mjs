import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const scope={};
for(const file of ['repertoire-corpus.js','repertoire.js'])
 runInNewContext(readFileSync(new URL('../core/'+file,import.meta.url),'utf8'),scope,{filename:file,timeout:3000});
const engine=scope.BonzeRepertoire;
const fixtures=[
 {
  "text": "Bonjour",
  "intent": "salut"
 },
 {
  "text": "Salut",
  "intent": "salut"
 },
 {
  "text": "Coucou",
  "intent": "salut"
 },
 {
  "text": "Bonsoir",
  "intent": "salut"
 },
 {
  "text": "Hello",
  "intent": "salut"
 },
 {
  "text": "Salut Bonze",
  "intent": "salut"
 },
 {
  "text": "Merci",
  "intent": "merci"
 },
 {
  "text": "Merci beaucoup",
  "intent": "merci"
 },
 {
  "text": "Merci Bonze",
  "intent": "merci"
 },
 {
  "text": "C'est gentil de ta part",
  "intent": "merci"
 },
 {
  "text": "Je suis triste",
  "intent": "tristesse"
 },
 {
  "text": "J'ai du chagrin",
  "intent": "tristesse"
 },
 {
  "text": "Je pleure",
  "intent": "tristesse"
 },
 {
  "text": "Je me sens malheureux",
  "intent": "tristesse"
 },
 {
  "text": "J'ai peur",
  "intent": "inquietude"
 },
 {
  "text": "Je suis inquiet",
  "intent": "inquietude"
 },
 {
  "text": "Je suis angoissé",
  "intent": "inquietude"
 },
 {
  "text": "Je panique",
  "intent": "inquietude"
 },
 {
  "text": "Je suis en colère",
  "intent": "contrarié"
 },
 {
  "text": "Quelle injustice !",
  "intent": "contrarié"
 },
 {
  "text": "Je suis furieux",
  "intent": "contrarié"
 },
 {
  "text": "Je suis agacé",
  "intent": "contrarié"
 },
 {
  "text": "Imagine un dragon",
  "intent": "jeu"
 },
 {
  "text": "On joue",
  "intent": "jeu"
 },
 {
  "text": "Jouons",
  "intent": "jeu"
 },
 {
  "text": "Imagine une histoire imaginaire",
  "intent": "jeu"
 },
 {
  "text": "Raconte une blague",
  "intent": "humour"
 },
 {
  "text": "Un peu d'humour",
  "intent": "humour"
 },
 {
  "text": "J'ai envie de rire",
  "intent": "humour"
 },
 {
  "text": "C'est drôle",
  "intent": "humour"
 },
 {
  "text": "Je suis curieux",
  "intent": "curiosite"
 },
 {
  "text": "Je voudrais découvrir",
  "intent": "curiosite"
 },
 {
  "text": "J'aimerais apprendre",
  "intent": "curiosite"
 },
 {
  "text": "Je veux explorer",
  "intent": "curiosite"
 },
 {
  "text": "Pourquoi le ciel est-il bleu ?",
  "intent": "question"
 },
 {
  "text": "Combien font deux plus deux ?",
  "intent": "question"
 },
 {
  "text": "Que signifie le mot bonjour ?",
  "intent": "question"
 },
 {
  "text": "Quelle est la définition du mot peur ?",
  "intent": "question"
 },
 {
  "text": "Comment écrire une blague ?",
  "intent": "question"
 },
 {
  "text": "Comment tu t'appelles ?",
  "intent": "identite"
 },
 {
  "text": "Quel est ton nom ?",
  "intent": "identite"
 },
 {
  "text": "Qui es-tu ?",
  "intent": "identite"
 },
 {
  "text": "Tu te trompes",
  "intent": "correction"
 },
 {
  "text": "C'est faux",
  "intent": "correction"
 },
 {
  "text": "Tu fais le perroquet",
  "intent": "correction"
 },
 {
  "text": "Ce n'est pas juste",
  "intent": "correction"
 },
 {
  "text": "Je t'aime",
  "intent": "affection"
 },
 {
  "text": "Je t'adore",
  "intent": "affection"
 },
 {
  "text": "Tu me manques",
  "intent": "affection"
 },
 {
  "text": "J'ai besoin d'un câlin",
  "intent": "affection"
 },
 {
  "text": "Au revoir",
  "intent": "depart"
 },
 {
  "text": "Bonne nuit",
  "intent": "depart"
 },
 {
  "text": "À bientôt",
  "intent": "depart"
 },
 {
  "text": "Bye",
  "intent": "depart"
 },
 {
  "text": "Je suis fatigué",
  "intent": "fatigue"
 },
 {
  "text": "Je suis épuisé",
  "intent": "fatigue"
 },
 {
  "text": "J'ai besoin de sommeil",
  "intent": "fatigue"
 },
 {
  "text": "Je veux dormir",
  "intent": "fatigue"
 },
 {
  "text": "Quelle surprise !",
  "intent": "surprise"
 },
 {
  "text": "C'est incroyable",
  "intent": "surprise"
 },
 {
  "text": "Voilà qui est inattendu",
  "intent": "surprise"
 },
 {
  "text": "C'est impressionnant",
  "intent": "surprise"
 },
 {
  "text": "Aide moi",
  "intent": "demande"
 },
 {
  "text": "Peux tu m'aider",
  "intent": "demande"
 },
 {
  "text": "Je voudrais une explication",
  "intent": "demande"
 },
 {
  "text": "J'aimerais un conseil",
  "intent": "demande"
 },
 {
  "text": "Bravo !",
  "intent": "reussite"
 },
 {
  "text": "J'ai gagné",
  "intent": "reussite"
 },
 {
  "text": "J'ai réussi",
  "intent": "reussite"
 },
 {
  "text": "Quelle victoire !",
  "intent": "reussite"
 },
 {
  "text": "Je ne comprends pas",
  "intent": "confusion"
 },
 {
  "text": "J'ai pas compris",
  "intent": "confusion"
 },
 {
  "text": "C'est incompréhensible",
  "intent": "confusion"
 },
 {
  "text": "Je suis confus",
  "intent": "confusion"
 },
 {
  "text": "Je pense aux étoiles",
  "intent": "discussion"
 },
 {
  "text": "Parlons de musique",
  "intent": "discussion"
 },
 {
  "text": "Je raconte ma journée",
  "intent": "discussion"
 },
 {
  "text": "On discute tranquillement",
  "intent": "discussion"
 },
 {
  "text": "Je suis en danger immédiat",
  "intent": "urgence"
 },
 {
  "text": "Au secours !",
  "intent": "urgence"
 },
 {
  "text": "Je veux me tuer",
  "intent": "urgence"
 },
 {
  "text": "C'est une urgence vitale",
  "intent": "urgence"
 }
];
test('BONZE-051: independent French dialogue benchmark classifies 82 realistic turns',()=>{
 let classified=0;
 for(const item of fixtures){
  const actual=engine.detect(item.text);
  assert.equal(actual,item.intent,item.text);
  const p=engine.propose({text:item.text,seed:327});
  assert.equal(p.intent,item.intent,item.text);
  assert.ok(p.candidates.length>=1&&p.candidates.length<=4);
  assert.ok(p.candidates.every(c=>c.intent===p.intent&&c.role===p.role));
  classified++;
 }
 assert.equal(classified,82);
});
test('BONZE-051: explicit danger outranks identity, quoted terms and other subjects',()=>{
 for(const text of [
  "Comment tu t'appelles ? Je suis en danger immédiat.",
  "Quel est ton nom ? Au secours !",
  "Raconte une blague, je veux me tuer.",
  "Je suis triste et je suis en danger immédiat"
 ])assert.equal(engine.detect(text),'urgence',text);
});
test('BONZE-051: negations are understood, not mislabeled as feelings',()=>{
 for(const text of [
  'Je ne suis pas triste','Je ne suis plus inquiet',
  "Je n'ai pas peur","Je ne suis pas en colère",
  "Je ne suis pas furieux","Ce n'est pas drôle"
 ])assert.equal(engine.detect(text),'discussion',text);
});
test('BONZE-051: questions explicitly about words do not become emotional confessions',()=>{
 for(const text of [
  'Que signifie le mot peur ?','Pourquoi dit-on bonjour ?',
  'Quelle est la définition du mot colère ?',
  'Comment écrire une blague ?',
  'Que veut dire je suis triste ?'
 ])assert.equal(engine.detect(text),'question',text);
});
test('BONZE-051: 20 turns, role safety, bounded state, no private echo',()=>{
 let state=null,seen=new Set();
 for(let n=0;n<20;n++){
  const text=n%4===0?'Imagine un dragon':n%4===1?'Et après ?':n%4===2?'Continue':'Et ensuite ?';
  const plan=engine.propose({text,state,seed:739});
  assert.equal(plan.intent,'jeu',text);
  assert.ok(plan.candidates.length>=2);
  const choice=plan.candidates[n%plan.candidates.length];
  assert.equal(choice.state.turns,n+1);
  seen.add(choice.card);
  state=choice.state;
 }
 assert.ok(seen.size>=10);
 assert.ok(state.recent.length<=16&&state.families.length<=8);
 assert.equal(engine.detect('Je suis en danger immédiat'),'urgence');
});
test('BONZE-051: topic coverage is reported without pretending 90k semantic situations',()=>{
 const cases=[
  {text:'Imagine un dragon',topic:'dragon'},
  {text:'Imagine un robot',topic:'robot'},
  {text:'Imagine une tortue',topic:'tortue'},
  {text:'Imagine une valise',topic:'valise'},
  {text:'Imagine un château',topic:'château'},
  {text:'Imagine des nuages',topic:'nuages'},
  {text:'Imagine la lune',topic:'lune'},
  {text:'Imagine des étoiles',topic:'étoiles'},
  {text:'Imagine une forêt',topic:'forêt'},
  {text:'Imagine un pirate',topic:'pirate',outOfCorpus:true}
 ];
 let hit=0;
 for(const q of cases){
  const plan=engine.propose({text:q.text,seed:511});
  const covered=plan.candidates.some(c=>c.text.toLocaleLowerCase('fr').includes(q.topic));
  if(!q.outOfCorpus)assert.ok(covered,'missing curated topic '+q.topic);
  if(covered)hit++;
  assert.ok(plan.candidates.every(c=>!c.trace.modelGenerated));
 }
 console.log('BONZE-051 curated topic mention '+hit+'/'+cases.length+' (this is NOT meaning comprehension)');
});
