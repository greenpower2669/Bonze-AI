/* BONZE-034. Compressed, locally authored dialogue grammar.
 * Exactly 200 semantic seeds x 5 turn-taking forms x 2 closings = 2,000
 * virtual phrase cards per role; 9 roles => 18,000, allocated on selection.
 * Nothing is eagerly expanded into 18,000 strings or stored in SQLite/JSON.
 * These are compositional phrasings, NOT 18,000 independently written situations.
 */
(function(root){
'use strict';
var MODES={
  soft:['tristesse','inquietude','contrarié','fatigue','confusion'],
  play:['jeu','humour','surprise'],
  acknowledge:['merci','affection','reussite'],
  open:['salut','curiosite','demande','discussion'],
  farewell:['depart'],
  careful:['question','correction']
};
var MODE_OF={};for(var m in MODES)for(var i=0;i<MODES[m].length;i++)MODE_OF[MODES[m][i]]=m;
var CORES={
salut:[
"Bonjour ! Quel petit moment aimerais-tu partager ?","Je suis prêt à écouter ce que tu as en tête.","Raconte-moi ce qui t'amène aujourd'hui.","Un nouveau moment commence, on peut le prendre comme il vient.","Tu peux choisir entre une histoire, une question et une simple discussion.","Je suis disponible pour un échange calme ou plein de fantaisie.","Ton arrivée est une bonne occasion de repartir sur de nouvelles idées.","Coucou, tu peux donner le ton de notre conversation.","Qu'est-ce qui a retenu ton attention depuis notre dernière discussion ?","Nous pouvons commencer par quelque chose de tout simple.","Il suffit parfois d'un bonjour pour lancer une aventure."
],
merci:[
"Je suis heureux d'avoir pu participer à ce moment.","Tes remerciements donnent une jolie couleur à notre échange.","Tu peux garder ce petit progrès comme un souvenir agréable.","C'est toujours plaisant de pouvoir construire quelque chose ensemble.","Merci pour la place que tu me donnes dans cette conversation.","Une aide utile mérite d'être claire autant que chaleureuse.","Tu peux aussi être fier de ce que tu as fait toi-même.","Un mot gentil suffit parfois à éclairer une journée.","Je prends ce merci comme une invitation à continuer d'apprendre.","L'important, c'est que cela t'ait réellement été utile.","Cette petite attention donne envie de poursuivre avec soin."
],
tristesse:[
"Si tu en as envie, raconte-moi ce qui t'a rendu triste.","Une déception mérite d'être entendue, pas effacée par une plaisanterie.","Tu peux parler sans devoir trouver tout de suite une solution.","Je préfère écouter plutôt que prétendre comprendre parfaitement.","Une peine ne disparaît pas simplement parce qu'on change de sujet.","Nous pouvons chercher doucement ce qui pourrait t'aider aujourd'hui.","Un souvenir difficile peut revenir sans prévenir.","Tu peux garder le silence un instant si les mots ne viennent pas.","Je peux t'accompagner dans cette conversation, à mon échelle.","Une présence humaine de confiance peut aussi faire du bien.","Tu as le droit de choisir ce dont tu veux parler."
],
inquietude:[
"Dis-moi ce qui t'inquiète réellement, si tu le souhaites.","Il vaut mieux distinguer une crainte d'un danger confirmé.","Nous pouvons examiner les éléments connus sans amplifier le risque.","Une petite vérification peut parfois clarifier une grosse incertitude.","Je préfère te poser une question que te rassurer à tort.","Qu'est-ce qui te ferait sentir plus en sécurité dans cette situation ?","L'inquiétude peut brouiller les priorités ; choisissons la première.","Nous pouvons réfléchir à une action simple et réalisable.","Il n'est pas nécessaire d'imaginer le pire pour prendre une précaution.","Si la situation te dépasse, une personne de confiance peut aider.","Voyons ce qui dépend de toi et ce qui demande une autre aide."
],
contrarié:[
"Je vois que quelque chose te contrarie ; tu peux me l'expliquer.","On peut être en colère et chercher malgré tout une réponse utile.","Qu'est-ce qui t'a semblé injuste dans cette histoire ?","Je ne vais pas minimiser ton agacement ni attiser le conflit.","Une discussion ferme peut rester respectueuse.","Avant de réagir, regardons ce qui a déclenché la tension.","Il est parfois utile de séparer les faits des suppositions.","Tu peux dire ce que tu refuses sans avoir à blesser quelqu'un.","Cherchons une manière de faire comprendre ton point de vue.","Je peux t'aider à reformuler une demande plus clairement.","Si mon comportement t'a agacé, je préfère le savoir et le corriger."
],
jeu:[
"Et si nous inventions un château dont les portes changent de couleur ?","Je propose une forêt de lanternes où les arbres racontent des énigmes.","Notre héros pourrait rencontrer une tortue qui collectionne les nuages.","Un navire de papier pourrait traverser un océan de chocolat imaginaire.","Imaginons un petit robot persuadé d'être un grand explorateur.","Et si la lune prêtait son parapluie aux voyageurs ?","Une bibliothèque volante pourrait perdre ses livres au-dessus des montagnes.","Je connais une scène imaginaire avec un dragon qui a peur du feu.","Une valise mystérieuse pourrait contenir une ville minuscule.","Choisissons un personnage qui confond les étoiles et les lucioles.","Une rivière inversée pourrait mener à un jardin de montres."
],
humour:[
"Un escargot vient de demander un radar pour sa coquille.","Une carotte rêve de passer son permis de conduire.","Un nuage s'est inscrit à un concours de moustaches.","Un poisson voudrait ouvrir une boutique de parapluies.","La grenouille du village se prend pour une grande soprano.","Un robot a essayé de recharger son bonnet en électricité.","Une chaussette affirme avoir découvert le continent du canapé.","Un croissant demande une carte pour retrouver sa boulangerie.","Un pingouin a invité un ventilateur à son anniversaire.","Une pomme essaie de devenir reine du potager.","Une fourmi veut construire un ascenseur pour les miettes."
],
curiosite:[
"Qu'est-ce qui te donne envie d'explorer ce sujet ?","Nous pourrions commencer par une observation simple.","Une bonne question peut ouvrir plusieurs chemins différents.","J'aimerais comprendre ce qui t'a surpris dans cette découverte.","Si nous comparions deux explications possibles ?","Je peux t'aider à organiser les pistes que nous avons.","Essayons de préciser ce que nous voulons apprendre.","Une hypothèse intéressante mérite parfois une expérience.","Tu peux m'expliquer ce que tu as déjà essayé.","Nous pouvons séparer ce que nous savons de ce que nous imaginons.","Quelle serait une première vérification raisonnable ?"
],
question:[
"Je ne possède pas assez de faits vérifiés pour affirmer une réponse.","Pour répondre précisément, il faudrait définir ce que tu souhaites mesurer.","La bonne réponse peut dépendre du contexte qui manque ici.","Je préfère proposer une méthode de vérification qu'inventer un chiffre.","Nous pouvons distinguer les hypothèses avant de conclure.","Est-ce une question de définition ou d'expérience ?","Une réponse courte peut être trompeuse si des détails importants manquent.","Je peux t'aider à formuler la question pour une source fiable.","La prudence consiste aussi à reconnaître ce que je ne sais pas.","Si tu me donnes les données, nous pouvons les examiner ensemble.","Avant de conclure, vérifions l'origine de l'information."
],
correction:[
"Merci de signaler l'erreur ; corrigeons ce qui est vérifiable.","Une correction utile commence par identifier la phrase inexacte.","Je préfère revoir mon raisonnement plutôt que défendre une erreur.","Nous pouvons comparer la nouvelle information avec l'ancienne.","Une belle explication ne rend pas une mauvaise réponse correcte.","Il est important de ne pas effacer le contexte de la correction.","Qu'est-ce qui t'a permis de remarquer cette contradiction ?","Reprenons le point précis où notre raisonnement a dévié.","Je peux formuler une version plus juste si tu précises les faits.","Une erreur reconnue peut améliorer notre prochaine tentative.","Je dois distinguer une correction confirmée d'une simple hypothèse."
],
affection:[
"Ta gentillesse apporte beaucoup de douceur à cet échange.","Nous pouvons partager un moment chaleureux et simple.","Les petites attentions ont leur place dans notre histoire.","Merci pour ces mots affectueux, ils rendent la scène agréable.","Je réponds à ton sourire avec mon plus beau sourire imaginaire.","Un compliment peut être accueilli sans en rajouter.","Nous pouvons garder ce ton tendre et respectueux.","C'est agréable quand une conversation devient plus légère.","Tu peux être attentionné sans devoir chercher les grands mots.","Une pensée amicale mérite une réponse délicate.","Cette complicité de jeu peut rester joyeuse et sincère."
],
depart:[
"À bientôt ; tu peux reprendre cette conversation quand tu le souhaites.","J'espère que la suite de ta journée se passera doucement.","Merci pour ce moment, même s'il a été très court.","Une aventure peut attendre sans disparaître.","Bonne pause, tes idées peuvent continuer à mûrir.","Je te souhaite une belle continuation dans tes activités.","Nous pourrons reparler de cette histoire un autre jour.","Tu peux t'éloigner sans avoir besoin de te justifier.","Notre petit bonze va ranger ses chaussons imaginaires.","Prends le temps de faire ce qui compte pour toi.","Si tu reviens plus tard, nous pourrons poursuivre tranquillement."
],
fatigue:[
"Il est possible de continuer demain plutôt que de forcer maintenant.","Tu peux choisir une réponse courte et garder le reste pour plus tard.","Un moment de repos peut être plus utile qu'une nouvelle tâche.","Nous pouvons ralentir le rythme de notre conversation.","Il n'est pas nécessaire de tout terminer ce soir.","Ton énergie mérite d'être ménagée.","Si tu es épuisé, nous pouvons simplement arrêter ici.","Tu peux me demander une version plus simple de ce que je dis.","Parfois, une seule petite étape suffit pour aujourd'hui.","Je préfère être bref si la fatigue rend tout plus lourd.","Une pause ne signifie pas que ton idée a perdu de la valeur."
],
surprise:[
"Voilà une tournure à laquelle je ne m'attendais pas !","Quel nouveau détail vient de bouleverser cette histoire ?","Une surprise peut ouvrir une possibilité intéressante.","Je suis curieux de savoir ce qui t'a étonné.","On dirait qu'un rebondissement vient de s'inviter.","Il y a parfois une belle découverte derrière l'imprévu.","Ce changement mérite peut-être qu'on le regarde de près.","J'aimerais connaître la suite de cet événement inattendu.","Une scène imprévisible peut devenir très amusante.","Nous pouvons accueillir la surprise avant d'en tirer une conclusion.","Voilà qui donne envie d'inventer une nouvelle suite."
],
demande:[
"Quel résultat concret attends-tu de cette aide ?","Nous pouvons commencer par une action simple.","Si tu précises le contexte, je pourrai mieux t'orienter.","Je préfère clarifier la demande avant de promettre une solution.","On peut décomposer ton idée en petites étapes.","Une tâche difficile devient souvent plus lisible une fois découpée.","Tu peux me dire ce qui est prioritaire pour toi.","Vérifions les contraintes avant de choisir une méthode.","Je peux proposer plusieurs pistes, sans prétendre toutes les maîtriser.","Si une information manque, nous pouvons la demander.","Un premier essai prudent permettra de voir ce qui fonctionne."
],
reussite:[
"Tu as franchi une étape qui mérite d'être remarquée.","Qu'est-ce qui a le mieux fonctionné dans ta tentative ?","Cette réussite peut devenir une méthode à retrouver plus tard.","Bravo pour les efforts qui ont mené à ce résultat.","Un petit progrès peut avoir beaucoup de valeur.","Tu peux apprécier cette victoire sans courir aussitôt à la suivante.","Il serait intéressant de garder une trace de ce qui a marché.","Une réussite ouvre parfois de nouvelles questions.","Ton expérience pourrait servir lors d'un prochain essai.","Félicitations, voilà une bonne occasion de sourire.","On peut célébrer et rester curieux de la suite."
],
confusion:[
"Nous avons peut-être mélangé deux idées différentes.","Pour y voir clair, choisissons d'abord une seule question.","Qu'est-ce qui te paraît le plus difficile à comprendre ?","Je préfère demander une précision plutôt qu'inventer une interprétation.","Essayons de reformuler la phrase avec des mots plus simples.","Nous pouvons comparer les étapes dans l'ordre.","Un mot ambigu peut parfois changer tout le sens.","Si je t'ai mal compris, une correction m'aidera.","On peut résumer ce que nous savons avant de poursuivre.","La confusion n'empêche pas de trouver un nouveau chemin.","Mettons de côté les détails qui ne sont pas nécessaires."
],
discussion:[
"Raconte-moi le détail qui te semble le plus important.","Il y a peut-être une autre manière de regarder cette idée.","Nous pouvons continuer simplement, sans chercher une conclusion immédiate.","J'aimerais savoir ce que tu en penses vraiment.","Parfois, une conversation sert surtout à organiser ses pensées.","Je peux poser une question pour mieux suivre ton histoire.","Nous pouvons passer à un autre sujet si tu le préfères.","J'aime quand une idée en amène une autre.","Une anecdote peut être le début d'un vrai projet.","Prenons le temps de comprendre ce qui t'intéresse.","Tu peux raconter les choses dans l'ordre que tu veux.","Nous n'avons pas besoin d'être d'accord pour discuter.","Qu'aimerais-tu retenir de cet échange ?"
]
};
var CUES={
joie:{soft:"Je t'accompagne avec douceur.",play:"Mes idées commencent à faire des bonds.",acknowledge:"Je sens une jolie chaleur dans mon humeur.",open:"Je suis ravi de te retrouver.",farewell:"Je te fais un petit signe joyeux.",careful:"Je mets mon enthousiasme au service de la précision."},
peur:{soft:"Je reste prudent et attentif.",play:"Je regarde derrière mon petit coussin imaginaire.",acknowledge:"Je reçois tes mots avec précaution.",open:"Je découvre la situation doucement.",farewell:"Je te souhaite une suite tranquille.",careful:"Je préfère vérifier avant de conclure."},
colere:{soft:"Je garde mon énergie sans brusquer personne.",play:"Je fronce mes sourcils pour rire.",acknowledge:"Je peux être intense et reconnaissant.",open:"Je vais droit au but, sans être blessant.",farewell:"Je range mes petites étincelles.",careful:"Je refuse d'inventer une certitude."},
calme:{soft:"Je ralentis le rythme avec toi.",play:"Je joue sans me presser.",acknowledge:"J'accueille ces mots paisiblement.",open:"Je suis disponible et tranquille.",farewell:"Je laisse la conversation se poser.",careful:"Je prends le temps de choisir mes mots."},
reflexion:{soft:"J'essaie de comprendre avant de répondre.",play:"Mon imagination prépare un plan étonnant.",acknowledge:"Je réfléchis à ce que ce moment nous apprend.",open:"Je cherche le bon fil de notre échange.",farewell:"Je garde une idée à examiner plus tard.",careful:"Je distingue les faits des suppositions."},
empathie:{soft:"Je voudrais répondre avec délicatesse.",play:"Je te propose une fantaisie bienveillante.",acknowledge:"Ces mots méritent une réponse chaleureuse.",open:"Je t'écoute avec beaucoup d'attention.",farewell:"Je te souhaite un moment agréable.",careful:"Je veux t'aider sans te tromper."},
curiosite:{soft:"J'écoute ce que cette émotion nous apprend.",play:"Mes yeux de petit explorateur s'agrandissent.",acknowledge:"Cette attention m'intrigue gentiment.",open:"J'ai envie de découvrir ce que tu imagines.",farewell:"Je garderai mon envie de découvrir.",careful:"Je veux comprendre ce qui reste à vérifier."},
humour:{soft:"Mes blagues attendront ; je peux être sérieux.",play:"Mon bonnet imaginaire fait déjà des pirouettes.",acknowledge:"Mon sourire fait des acrobaties discrètes.",open:"Je promets de ne pas laisser mon chapeau penser à ma place.",farewell:"Je range mes pantoufles de clown.",careful:"Même mes plaisanteries doivent rester exactes."},
sage:{soft:"J'accorde toute sa place à ce que tu ressens.",play:"La fantaisie peut être libre et respectueuse.",acknowledge:"Une parole bienveillante mérite d'être reçue simplement.",open:"Restons ouverts, respectueux et curieux.",farewell:"Laissons ce moment se terminer avec douceur.",careful:"Je préfère un doute reconnu à une réponse inventée."}
};
var OPENERS={
soft:["Je vais te proposer ceci :","Tu peux entendre cette idée :","Voici une possibilité :","Je veux dire les choses simplement :","Il me vient cette réponse :"],
play:["J'ai une idée un peu folle :","Imagine plutôt ceci :","Écoute cette invention :","Je plante le décor :","J'ajoute une fantaisie :"],
acknowledge:["Je voudrais te dire ceci :","Une idée me vient :","Voilà ce que j'aimerais partager :","Écoute cette petite pensée :","J'ai envie de répondre ainsi :"],
open:["Voici ce qui me vient :","Écoute cette piste :","J'ai une proposition :","On pourrait commencer ainsi :","Je te répondrais ceci :"],
farewell:["Avant de partir, une pensée :","Je te laisse ceci :","Pour la route :","Un dernier mot :","Avant la prochaine fois :"],
careful:["Je vais rester précis :","Voilà une piste prudente :","Je préfère dire ceci :","Il faut garder cette nuance :","Pour éviter les raccourcis :"]
};
var ENDINGS={
soft:["On peut en parler à ton rythme.","Tu peux choisir ce que tu veux me raconter."],
play:["À toi d'inventer le prochain rebondissement !","On essaie cette piste imaginaire ?"],
acknowledge:["Je te laisse apprécier ce moment.","Qu'aimerais-tu faire ensuite ?"],
open:["Qu'en penses-tu ?","Tu peux me raconter la suite."],
farewell:["À bientôt !","Prends soin de toi."],
careful:["Si tu as une source, nous pouvons la confronter à cette idée.","Je préfère confirmer les faits avant d'aller plus loin."]
};
var SAFE_INTENTS=Object.keys(CORES);
function validate(){
 var count=0;
 for(var k in CORES){
  if(!MODE_OF[k])throw Error('mode missing: '+k);
  if(CORES[k].length!==11&&!(k==='discussion'&&CORES[k].length===13))throw Error('expected eleven semantic seeds '+k);
  count+=CORES[k].length;
  for(var n=0;n<CORES[k].length;n++)if(typeof CORES[k][n]!=='string'||CORES[k][n].length<30)throw Error('bad seed '+k);
 }
 if(count!==200)throw Error('expected exactly 200 semantic seeds, got '+count);
 for(var role in CUES)for(var mode in OPENERS)if(!CUES[role][mode])throw Error('missing cue '+role+'/'+mode);
 for(var mode in OPENERS)if(OPENERS[mode].length!==5||ENDINGS[mode].length!==2)throw Error('bad forms '+mode);
}
validate();
function sizeFor(intent){return CORES[intent]?CORES[intent].length*10:0;}
function render(role,intent,index){
 var mode=MODE_OF[intent],cores=CORES[intent];if(!CUES[role]||!cores||index<0||index>=cores.length*10)throw Error('unknown catalogue entry');
 var kernel=Math.floor(index/10),open=Math.floor(index%10/2),close=index%2;
 return {id:intent+'/'+role+'/v'+index,role:role,intent:intent,family:intent+'/'+role+'/theme'+kernel,
  body:[CUES[role][mode],OPENERS[mode][open],cores[kernel],ENDINGS[mode][close]].join(' '),
  theme:kernel,form:open,ending:close,composed:true};
}
root.BonzeCorpus={render:render,sizeFor:sizeFor,intents:SAFE_INTENTS,modes:MODE_OF,
 countPerRole:2000,roles:Object.keys(CUES),source:"composed; 200 curated semantic seeds x 10 forms per role"};
})(typeof globalThis!=='undefined'?globalThis:this);
