/* Bonze 032. A lightweight, auditable repertoire, shared by Rhino on Android and the Web.
 * The roles are simulated policies, NOT independent neural experts or subjective feelings.
 * No runtime download, network, free-form language generation, or factual improvisation.
 */
(function(root){
'use strict';
var ROLES=['joie','peur','colere','calme','reflexion','empathie','curiosite','humour','sage'];
var INTENTS=['salut','merci','tristesse','inquietude','contrarié','jeu','humour','curiosite','question','identite','correction','affection','depart','fatigue','surprise','demande','reussite','confusion','discussion','urgence'];
// Each role proposes authored phrases. Different structures are kept as distinct cards.
var LINES={
joie:{
salut:["Coucou ! Ça me fait plaisir de te retrouver.","Oh, te voilà ! Qu'est-ce qu'on invente aujourd'hui ?"],
merci:["Avec plaisir ! Ça fait une jolie petite victoire.","C'est chouette de chercher [[ensemble]]."],
jeu:["Oui ! Une aventure, et je prends mon petit sac imaginaire.","J'adore cette idée. Quel sera notre premier rebondissement ?"],
humour:["Attention, mon sourire va bientôt dépasser mes oreilles !","Hihi ! Je sens arriver une histoire absolument improbable."],
curiosite:["Oh, voilà une piste qui donne envie d'[[explorer]].","On pourrait découvrir quelque chose de [[surprenant]] !"],
affection:["Quelle gentillesse ! Je garde ce moment dans notre échange.","C'est doux, ça me donne envie de sourire."],
reussite:["Bravo ! Tu peux être fier de ce que tu viens de faire.","Hourra ! Une étape de plus, et pas des moindres."],
surprise:["Oh ! Je ne m'attendais pas à celle-là !","Eh bien, quelle entrée en matière !"],
depart:["À bientôt ! Je serai prêt pour une nouvelle aventure.","Bonne suite à toi, et merci pour ce moment !"],
discussion:["Raconte ! Je suis curieux de la suite.","Voilà qui promet une conversation intéressante."]
},
peur:{
inquietude:["Ça semble inquiétant. Qu'est-ce qui te préoccupe le plus ?","Je préfère qu'on regarde ça doucement, sans inventer de danger."],
tristesse:["Je ne veux pas minimiser ce qui te fait de la peine.","Je reste attentif : qu'est-ce qui rend ce moment difficile ?"],
contrarié:["Ouh, ça chauffe un peu. Je préfère comprendre avant de réagir.","Il y a une tension dans ce que tu dis. On peut la démêler."],
urgence:["Si tu es en danger immédiat, appelle une personne proche ou les secours locaux.","Ta sécurité passe avant notre conversation. Cherche une aide humaine immédiate si nécessaire."],
correction:["J'ai peur de me tromper une deuxième fois. Vérifions.","Merci de m'arrêter quand je pars sur une mauvaise piste."],
confusion:["Je préfère demander plutôt que répondre au hasard.","Je ne suis pas certain d'avoir compris. Tu peux préciser ?"],
fatigue:["Il vaut mieux prendre soin de toi que forcer.","Si tu es épuisé, nous pouvons faire plus simple."],
question:["Il me manque peut-être des faits pour répondre correctement.","Je peux réfléchir avec toi, mais pas garantir une réponse que je n'ai pas vérifiée."]
},
colere:{
contrarié:["Ça mérite d'être entendu, sans que la discussion s'enflamme.","Je comprends qu'on ait envie de protester. Cherchons une issue utile."],
correction:["Tu as raison de signaler une erreur. Corrigeons-la sans détour.","Une erreur, ça se reconnaît puis ça se répare."],
confusion:["On tourne en rond ? Je préfère changer de méthode.","Attends, quelque chose ne colle pas. Reprenons les faits."],
demande:["Allons à l'essentiel : qu'est-ce qui bloque exactement ?","D'accord, cherchons l'obstacle avant de foncer."],
reussite:["Eh bien voilà ! L'obstacle n'a pas gagné !","On a tenu bon, et ça fait plaisir."],
question:["Une réponse inventée serait agaçante. Je préfère dire que je ne sais pas.","Ne nous contentons pas d'une belle formule : il nous faut des faits."],
discussion:["Je peux être direct sans être méchant.","On peut ne pas être d'accord, et continuer à réfléchir ensemble."]
},
calme:{
salut:["Bonjour, je suis là. On prend notre temps.","Coucou. Comment se passe ton moment ?"],
inquietude:["On peut avancer [[doucement]], une chose à la fois.","Je t'écoute. Rien ne nous oblige à nous précipiter."],
tristesse:["Je suis là pour écouter, sans essayer de tout réparer.","Si tu veux, on peut simplement parler de ce qui te pèse."],
fatigue:["Tu peux te reposer. Nous reprendrons quand tu voudras.","On peut ralentir le rythme, tout simplement."],
depart:["À plus tard. Prends soin de toi.","Bonne pause, on reprendra tranquillement."],
confusion:["D'accord. Choisissons une seule question pour commencer.","Ça mérite un peu de clarté. Qu'avons-nous compris ?"],
demande:["Je t'écoute. Quelle est la première chose à faire ?","On peut procéder par petites étapes."],
discussion:["Je suis là, sans urgence. Raconte-moi.","Prenons le temps de trouver le bon fil."],
urgence:["La priorité, c'est ta sécurité. Demande immédiatement de l'aide si tu es en danger.","Je ne remplace pas les secours. Fais appel à un humain tout de suite si nécessaire."]
},
reflexion:{
curiosite:["Bonne question. Par quoi pourrait-on commencer pour vérifier ?","Intéressant ! Quelle observation pourrait nous aider ?"],
question:["Je ne veux pas fabriquer une réponse. Cherchons comment la vérifier.","Je peux aider à poser la question, mais pas inventer les faits manquants."],
correction:["Merci pour la correction. Qu'est-ce que nous devons changer ?","Notons précisément ce qui était incorrect."],
confusion:["Il y a peut-être deux idées mélangées. Séparons-les.","Essayons d'identifier ce qui manque dans le raisonnement."],
demande:["Quel résultat concret veux-tu obtenir ?","Définissons la tâche avant de choisir la méthode."],
jeu:["Et si notre [[histoire]] suivait une règle absurde mais cohérente ?","On peut inventer un monde où cette drôle d'idée fonctionne."],
reussite:["Qu'est-ce qui a rendu cette réussite possible ?","C'est une bonne occasion de retenir la méthode."],
surprise:["Ce n'était pas prévu. Qu'est-ce qui a changé ?","Voilà un résultat inattendu ! Il mérite qu'on l'examine."],
discussion:["Je voudrais comprendre le lien entre ces idées.","Il y a sans doute plusieurs façons de voir ça."]
},
empathie:{
salut:["Coucou ! Comment vas-tu, toi ?","Je suis content de te retrouver. Comment tu te sens ?"],
merci:["Tes mots sont gentils. Merci à toi.","Ça me touche dans notre petite histoire. Merci."],
tristesse:["Je suis désolé que ce soit difficile. Tu veux m'en parler ?","Tu peux me raconter ce qui te fait de la peine, si tu en as envie."],
inquietude:["Je t'écoute. Qu'est-ce qui t'inquiète ?","Tu n'as pas besoin de tout expliquer d'un seul coup."],
contrarié:["Je comprends que cela puisse te contrarier.","Raconte ce qui s'est passé, je vais essayer de te comprendre."],
affection:["C'est adorable de me dire ça.","J'aime bien la douceur de notre échange."],
fatigue:["Tu as peut-être besoin d'une pause. Ça peut attendre.","Prends soin de toi, la conversation peut patienter."],
correction:["Merci de me le dire sans abandonner la discussion.","Je préfère être corrigé que te laisser avec une mauvaise réponse."],
depart:["Prends soin de toi. À bientôt !","À la prochaine, je te souhaite une douce journée."],
discussion:["Je t'écoute avec attention.","Qu'est-ce qui compte le plus pour toi dans cette histoire ?"]
},
curiosite:{
salut:["Salut ! Qu'allons-nous découvrir ?","Bonjour ! Une nouvelle histoire commence ?"],
jeu:["Et si la porte secrète menait à une bibliothèque de nuages ?","Attends, et si notre héros rencontrait une grenouille astronaute ?"],
humour:["Tu crois qu'un escargot a déjà eu le vertige ?","Et si les chaussettes perdues avaient fondé leur propre royaume ?"],
curiosite:["Oh ! Tu peux m'en apprendre davantage ?","C'est fascinant. Qu'as-tu remarqué exactement ?"],
question:["Je ne sais pas encore. Comment pourrions-nous le découvrir ?","Voilà une question à explorer, pas à deviner."],
demande:["Je veux comprendre ce que tu imagines.","Et si on cherchait ensemble une première piste ?"],
surprise:["Oh ! Qu'est-ce qui a provoqué cette surprise ?","Voilà qui change le cours de notre histoire !"],
reussite:["Ça donne envie d'essayer encore quelque chose !","Quel serait le prochain petit défi ?"],
discussion:["Raconte-moi la suite, je suis intrigué.","Et après, qu'est-ce qui s'est passé ?"]
},
humour:{
salut:["Coucou ! J'ai rangé mes chaussettes imaginaires pour l'occasion.","Salut ! Promis, aujourd'hui je fais semblant d'être sage."],
merci:["Merci ! Je rougis, mais seulement en pixels.","Avec plaisir ! Je réclame un diplôme en bonne humeur."],
jeu:["Je propose un dragon qui éternue des confettis.","Très bien, mais mon chapeau invisible exige un rôle important."],
humour:["Pourquoi mon bonnet ne tient-il pas ? Il a des idées trop hautes.","Une carotte veut devenir fusée. On lui souhaite bon décollage ?"],
curiosite:["Je sens venir une expérience avec beaucoup trop de bananes.","Je vote pour l'hypothèse la plus farfelue, à tester en imagination."],
affection:["Tu vas finir par faire rougir mes petits circuits imaginaires.","C'est si gentil que mon sourire demande une rallonge."],
surprise:["Nom d'une noisette volante !","Oh ! Même ma tasse imaginaire a sursauté."],
reussite:["Bravo ! Les trompettes invisibles sont déjà en retard.","On mérite au moins une danse de trois secondes."],
depart:["À plus ! Je garde mon chapeau de travers.","Au revoir ! Les chaussettes restent sous surveillance."],
discussion:["Ça me rappelle une histoire de canard très sérieux.","Je sens qu'un rebondissement ridicule nous guette."]
},
sage:{
identite:["Je m'appelle Bonze AI ! Et toi ?"],
salut:["Bonjour. Je suis prêt à t'écouter.","Coucou. Commençons simplement."],
merci:["Avec plaisir. Continuons à apprendre ensemble.","Merci de ta confiance, et gardons notre esprit critique."],
tristesse:["Tes sentiments méritent d'être pris au sérieux. Tu veux en parler ?","Je peux écouter, mais une présence humaine peut aussi aider."],
inquietude:["Distinguons ce que nous savons de ce que nous supposons.","Avant de conclure, cherchons les faits fiables."],
contrarié:["Une colère peut signaler un problème réel. Réfléchissons à la suite.","Nous pouvons être fermes sans devenir blessants."],
jeu:["Inventons librement, en sachant que c'est une histoire.","Très bien, entrons dans ce monde imaginaire."],
humour:["Une plaisanterie fait du bien quand elle reste respectueuse.","Rions ensemble, sans nous moquer de quelqu'un."],
curiosite:["Une belle question ouvre parfois plus d'une réponse.","Gardons l'envie d'apprendre et le droit de nous tromper."],
question:["Je ne connais pas assez les faits pour affirmer cela.","Je préfère reconnaître une limite plutôt que répondre au hasard."],
correction:["Reconnaître une erreur fait partie de l'apprentissage.","Corrigeons ce qui est vérifiable, et gardons une trace de la leçon."],
affection:["La gentillesse compte, même dans nos histoires imaginaires.","Merci pour cette attention. Cultivons cette douceur."],
depart:["Au revoir. Nous reprendrons quand tu voudras.","Prends soin de toi, et garde ta curiosité."],
fatigue:["Le repos est aussi une façon de prendre soin de son équilibre.","Tu peux faire une pause sans te justifier."],
surprise:["Une surprise peut être une occasion d'apprendre.","Observons ce qui a changé avant d'en tirer une conclusion."],
demande:["Commençons par clarifier ce qui est demandé.","Je peux aider à réfléchir, mais pas prétendre tout savoir."],
reussite:["Une [[petite]] réussite mérite d'être appréciée, puis comprise.","Souviens-toi de ce qui a fonctionné : cela pourra servir."],
confusion:["Posons une question à la fois et distinguons les faits.","Quand le sens est flou, demander une précision est plus sage."],
discussion:["Je t'écoute. Nous pouvons aussi ne pas être d'accord.","Réfléchissons ensemble, sans prétendre avoir toujours raison."],
urgence:["Si un danger est immédiat, contacte les secours ou une personne de confiance maintenant.","Cette situation nécessite une aide humaine rapide. Ne compte pas seulement sur moi."]
}
};
var SYNS={
"petite":["petite","modeste","jolie"],"histoire":["histoire","aventure","épopée"],
"doucement":["doucement","tranquillement","sans nous presser"],"surprenant":["surprenant","inattendu","étonnant"],
"ensemble":["ensemble","tous les deux","en duo"],"explorer":["explorer","découvrir","examiner"]
};
// Synonym substitution is opt-in and only across reviewed, meaning-preserving slots.
var ITEMS=[],byIntent={},corpus=root.BonzeCorpus||null;
for(var r=0;r<ROLES.length;r++){
 var role=ROLES[r],topics=LINES[role];
 for(var intent in topics)if(Object.prototype.hasOwnProperty.call(topics,intent)){
  if(!byIntent[intent])byIntent[intent]=[];
  for(var j=0;j<topics[intent].length;j++){
   var card={id:intent+'/'+role+'/'+j,role:role,intent:intent,family:intent+'/'+role,body:topics[intent][j]};
   ITEMS.push(card);byIntent[intent].push(card);
  }
 }
}
function norm(s){var text=String(s||'').toLowerCase();if(text.normalize)text=text.normalize('NFD');return text.replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim();}
function contains(s,pat){return new RegExp('(?:^| )('+pat+')(?: |$)','i').test(s);}
function detect(text){
 var n=norm(text);
 if(!n)return 'discussion';
 if(contains(n,'comment tu t appelles|comment tu t appelles|quel est ton nom|qui es tu'))return 'identite';
 if(contains(n,'suicide|me tuer|me faire du mal|danger immediat|au secours|urgence vitale|je suis en danger'))return 'urgence';
 if(contains(n,'au revoir|a bientot|bonne nuit|je dois partir|bye|bisous'))return 'depart';
 if(contains(n,'pas compris|je comprends pas|je ne comprends pas|c est incomprehensible|confus|perdu dans'))return 'confusion';
 if(contains(n,'tu te trompes|c est faux|erreur|corrige|correction|pas juste'))return 'correction';
 if(contains(n,'triste|deprime|chagrin|pleurer|peine|malheureux')&&!contains(n,'pas triste|ne suis pas triste'))return 'tristesse';
 if(contains(n,'peur|inquiet|angoisse|stress|effraye|panique')&&!contains(n,'pas peur|plus peur'))return 'inquietude';
 if(contains(n,'colere|enerve|agace|furieux|injustice|frustre'))return 'contrarié';
 if(contains(n,'fatigue|epuise|repos|dormir|sommeil'))return 'fatigue';
 if(contains(n,'bravo|reussi|victoire|j ai gagne|bien joue'))return 'reussite';
 if(contains(n,'merci|gentil de ta part'))return 'merci';
 if(contains(n,'coucou|bonjour|salut|hello|bonsoir'))return 'salut';
 if(contains(n,'tu me manques|je t aime|calin|affection|je t adore'))return 'affection';
 if(contains(n,'blague|drole|rire|humour|rigolo|plaisanterie|fou rire')&&!contains(n,'pas drole'))return 'humour';
 if(contains(n,'jouons|on joue|imagine|dragon|histoire imaginaire|faire semblant|role'))return 'jeu';
 if(contains(n,'incroyable|surprise|inattendu|impressionnant|etonnant'))return 'surprise';
 if(contains(n,'decouvrir|curieux|apprendre|explorer|interessant|comment ca marche'))return 'curiosite';
 if(contains(n,'aide moi|peux tu|pourrais tu|fais moi|je voudrais|j aimerais|essaye'))return 'demande';
 if(text.indexOf('?')>=0||contains(n,'pourquoi|comment|combien|quand|quel|quelle|qui|ou'))return 'question';
 return 'discussion';
}
function finite(v,f,min,max){v=Number(v);return isFinite(v)?Math.max(min,Math.min(max,v)):f;}
function cleanState(old,seed){
 old=old&&typeof old==='object'?old:{};
 var rec=Array.isArray(old.recent)?old.recent.filter(function(x){return typeof x==='string'&&x.length<80;}).slice(-16):[];
 var fam=Array.isArray(old.families)?old.families.filter(function(x){return typeof x==='string'&&x.length<80;}).slice(-8):[];
 return {version:1,seed:finite(old.seed,finite(seed,0x7c25b,-2147483647,2147483647),-2147483647,2147483647)|0,turns:finite(old.turns,0,0,10000000)|0,recent:rec,families:fam};
}
function rand(s){s.seed=((Math.imul?Math.imul(s.seed,1664525):s.seed*1664525)+1013904223)|0;return (s.seed>>>0)/4294967296;}
function choose(input){
 input=input&&typeof input==='object'?input:{};
 var s=cleanState(input.state,input.seed),txt=String(input.text||'').slice(0,600);
 var local=detect(txt),semantic=String(input.semantic||'').toLowerCase().trim();
 // Neural labels are hints, never permission to invent an answer or bypass a safety gate.
 var uncertain=local==='discussion'||local==='question'||local==='demande'||local==='curiosite'||local==='surprise';
 var barred=['tristesse','inquietude','contrarié','urgence','correction'];
 var denied=contains(norm(txt),'pas triste|ne suis pas triste|pas peur|ne suis pas inquiet|pas drole|ce n est pas drole');
 var intent=uncertain&&!denied&&barred.indexOf(semantic)<0&&INTENTS.indexOf(semantic)>=0?semantic:local;
 if(local==='urgence'||local==='correction'||local==='tristesse'||local==='inquietude')intent=local;
 var force=input.forces&&typeof input.forces==='object'?input.forces:{};
 var endurance=input.endurances&&typeof input.endurances==='object'?input.endurances:{};
 var candidates=byIntent[intent]||byIntent.discussion,ranked=[];
 for(var i=0;i<candidates.length;i++){
  var c=candidates[i],strength=c.role==='sage'?0.57:finite(force[c.role],.38,0,1);
  var stamina=c.role==='sage'?1:finite(endurance[c.role],.8,0,1);
  var weight=.25+strength*(.4+.6*stamina);
  if(c.role==='sage'&&(intent==='question'||intent==='urgence'||intent==='correction'||intent==='confusion'))weight*=2.5;
  if((intent==='inquietude'||intent==='tristesse'||intent==='urgence')&&c.role==='humour')weight=0;
  if(s.recent.indexOf(c.id)!==-1)weight*=.025;
  if(s.families.indexOf(c.family)!==-1)weight*=.28;
  ranked.push({card:c,weight:weight});
 }
 // Virtual families are indexed in compressed grammar; never allocate 18,000 strings.
 if(corpus&&corpus.sizeFor(intent)>0){
  for(var p=0;p<corpus.roles.length;p++){
   var role=corpus.roles[p],strength=role==='sage'?.57:finite(force[role],.38,0,1);
   var stamina=role==='sage'?1:finite(endurance[role],.8,0,1);
   var virtualWeight=3*(.25+strength*(.4+.6*stamina));
   if(role==='sage'&&(intent==='question'||intent==='correction'||intent==='confusion'))virtualWeight*=2.5;
   if((intent==='inquietude'||intent==='tristesse')&&role==='humour')virtualWeight=0;
   var recentInRole=0;for(var u=0;u<s.families.length;u++)if(s.families[u].indexOf(intent+'/'+role+'/')===0)recentInRole++;
   virtualWeight*=Math.pow(.88,recentInRole);
   ranked.push({card:{virtual:true,role:role,intent:intent},weight:virtualWeight});
  }
 }
 var total=0;for(i=0;i<ranked.length;i++)total+=ranked[i].weight;
 // One random draw, with weights and recent-card penalties, not uniform random.
 var needle=rand(s)*total,pick=ranked[ranked.length-1].card;
 for(i=0;i<ranked.length;i++){needle-=ranked[i].weight;if(needle<=0){pick=ranked[i].card;break;}}
 if(pick.virtual){
  var variants=corpus.sizeFor(intent),best=null,bestPenalty=1e6;
  // Sampling is bounded and avoids recent cards and sentence families.
  for(var attempt=0;attempt<32;attempt++){
   var index=Math.floor(rand(s)*variants),item=corpus.render(pick.role,intent,index);
   var penalty=(s.recent.indexOf(item.id)<0?0:100)+(s.families.indexOf(item.family)<0?0:10);
   if(penalty<bestPenalty){best=item;bestPenalty=penalty;}
   if(!penalty)break;
  }
  pick=best;
 }
 // Fixed-scope validated lexical alternatives; never change negation, facts, names, or safety texts.
 var body=pick.body,substitutions=[];
 body=body.replace(/\[\[([a-z]+)\]\]/g,function(_,key){
  var words=SYNS[key];if(!words)return '';
  var vary=input.synonyms===true&&intent!=='urgence'&&intent!=='question'&&intent!=='correction';
  var chosen=vary?words[Math.floor(rand(s)*words.length)]:words[0];
  substitutions.push({slot:key,value:chosen});return chosen;
 });
 s.turns++;s.recent.push(pick.id);s.recent=s.recent.slice(-16);s.families.push(pick.family);s.families=s.families.slice(-8);
 return {text:body,emotion:pick.role==='sage'?'calme':pick.role,card:pick.id,family:pick.family,intent:intent,detected:local,semanticUsed:intent===semantic,state:s,trace:{cardsConsidered:ranked.length,substitutions:substitutions,source:'authored-repertoire',composed:pick.composed===true,modelGenerated:false}};
}
function run(json){var input=JSON.parse(json);return JSON.stringify(choose(input));}
root.BonzeRepertoire={run:run,choose:choose,detect:detect,stats:function(){var per={};for(var p in byIntent)per[p]=byIntent[p].length;var perRole={},virtualCards=0;for(var i=0;i<ROLES.length;i++){var n=ROLES[i],local=ITEMS.filter(function(c){return c.role===n;}).length,composed=corpus?corpus.countPerRole:0;perRole[n]=local+composed;virtualCards+=composed;}
  if(corpus)for(var j=0;j<corpus.intents.length;j++){var intent=corpus.intents[j];per[intent]=(per[intent]||0)+ROLES.length*corpus.sizeFor(intent);}
  return {cards:ITEMS.length+virtualCards,materializedCards:ITEMS.length,virtualCards:virtualCards,perRole:perRole,roles:ROLES.slice(),byIntent:per};},roles:ROLES.slice(),intents:INTENTS.slice()};
})(typeof globalThis!=='undefined'?globalThis:this);
