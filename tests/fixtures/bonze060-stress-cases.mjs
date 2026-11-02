/* BONZE-060: frozen adversarial development stress cases, NOT blind human validation.
 * Authored once after BONZE-059, before inspecting the scorer's decisions.
 * No private transcripts and no model-derived answers.
 * expected=-1 is a legitimate abstention where no answer is supported.
 */
export const stressCases=[
  {
    "id": "fiction-corsaire",
    "category": "fiction",
    "text": "Fabrique une légende avec un corsaire qui cherche son bateau.",
    "context": "",
    "options": [
      "Le robot construit une cabane.",
      "Le pirate retrouve son navire.",
      "Un dragon regarde la lune.",
      "La tortue rêve d'un lac."
    ],
    "expected": 1
  },
  {
    "id": "fiction-griffon",
    "category": "fiction",
    "text": "Invente une aventure avec un griffon.",
    "context": "",
    "options": [
      "Un pirate rentre au port.",
      "Un robot peint une étoile.",
      "Une tortue cherche un nuage.",
      "Le dragon attend le matin."
    ],
    "expected": -1
  },
  {
    "id": "fiction-dinosaure",
    "category": "fiction",
    "text": "Je veux une histoire où un dinosaure traverse le temps.",
    "context": "",
    "options": [
      "La lune voyage entre les nuages.",
      "Un pirate cherche une île.",
      "Une valise cache des livres.",
      "Une tortue suit une rivière."
    ],
    "expected": -1
  },
  {
    "id": "fiction-herisson",
    "category": "fiction",
    "text": "Imagine un hérisson qui ouvre une boutique.",
    "context": "",
    "options": [
      "La bibliothèque retrouve ses livres.",
      "Un robot cherche des étoiles.",
      "Un navire quitte le port.",
      "Le château ferme sa porte."
    ],
    "expected": -1
  },
  {
    "id": "fiction-licorne",
    "category": "fiction",
    "text": "Raconte un conte avec une licorne.",
    "context": "",
    "options": [
      "La lune se lève.",
      "Une tortue entre dans la forêt.",
      "Un pirate découvre un navire.",
      "Un robot rêve."
    ],
    "expected": -1
  },
  {
    "id": "fiction-fusee",
    "category": "fiction",
    "text": "Fais vivre une odyssée à une fusée.",
    "context": "",
    "options": [
      "Une valise flotte dans la mer.",
      "La rivière retrouve ses montres.",
      "Le dragon dort dans la forêt.",
      "La bibliothèque est fermée."
    ],
    "expected": -1
  },
  {
    "id": "fiction-geant",
    "category": "fiction",
    "text": "Conte les péripéties d'un géant maladroit.",
    "context": "",
    "options": [
      "Le robot cherche un objet.",
      "Un pirate examine la mer.",
      "La lune brille.",
      "Le dragon quitte son château."
    ],
    "expected": -1
  },
  {
    "id": "fiction-forteresse",
    "category": "fiction",
    "text": "Crée une histoire dans une forteresse secrète.",
    "context": "",
    "options": [
      "Une tortue traverse le ciel.",
      "La porte du château cache un passage.",
      "Un pirate retrouve un livre.",
      "Un robot étudie une île."
    ],
    "expected": 1
  },
  {
    "id": "fiction-astronaute",
    "category": "fiction",
    "text": "Invente un récit sur un astronaute au travail.",
    "context": "",
    "options": [
      "Le dragon se promène.",
      "Un pirate cherche sa voile.",
      "La tortue retrouve sa maison.",
      "Un robot garde le château."
    ],
    "expected": -1
  },
  {
    "id": "fiction-lanternes",
    "category": "fiction",
    "text": "Imaginons une aventure dans un bois rempli de lanternes.",
    "context": "",
    "options": [
      "Un bateau pirate part au large.",
      "Les lanternes de la forêt éclairent le sentier.",
      "La tortue collecte des nuages.",
      "Un robot cherche une valise."
    ],
    "expected": 1
  },
  {
    "id": "context-capitaine",
    "category": "context",
    "text": "Et maintenant ?",
    "context": "Nous suivions un corsaire sur son bateau.",
    "options": [
      "Le pirate déplie la carte du navire.",
      "Un robot visite une usine.",
      "La tortue escalade une colline.",
      "Une valise tombe du ciel."
    ],
    "expected": 0
  },
  {
    "id": "context-tortue",
    "category": "context",
    "text": "Et ensuite ?",
    "context": "Nous suivons une tortue qui recherche son nuage.",
    "options": [
      "Le pirate reprend la mer.",
      "Le dragon ouvre sa porte.",
      "La tortue retrouve son nuage.",
      "Un robot regarde la lune."
    ],
    "expected": 2
  },
  {
    "id": "context-automate",
    "category": "context",
    "text": "Et après ?",
    "context": "L'automate cherche son inventeur.",
    "options": [
      "Le robot entre dans un atelier.",
      "La lune éclaire le château.",
      "Le pirate répare son bateau.",
      "Une tortue rêve d'une rivière."
    ],
    "expected": 0
  },
  {
    "id": "context-licorne",
    "category": "context",
    "text": "Et maintenant ?",
    "context": "La licorne se cache dans la neige.",
    "options": [
      "Le pirate retrouve son navire.",
      "La lune brille sur les arbres.",
      "Un robot range les livres.",
      "Un château ouvre ses portes."
    ],
    "expected": -1
  },
  {
    "id": "context-bibliotheque",
    "category": "context",
    "text": "Et ensuite ?",
    "context": "Une bibliothèque volante a perdu ses livres.",
    "options": [
      "Le robot cherche une prise.",
      "Le pirate traverse la mer.",
      "Les livres retrouvent leur bibliothèque.",
      "Une tortue ferme son sac."
    ],
    "expected": 2
  },
  {
    "id": "context-robot",
    "category": "context",
    "text": "Que décide-t-il ?",
    "context": "Le robot a découvert un mystérieux message.",
    "options": [
      "Une tortue traverse la plage.",
      "Un automate ouvre le message.",
      "Un pirate prépare les voiles.",
      "Le dragon trouve un château."
    ],
    "expected": 1
  },
  {
    "id": "context-dragon",
    "category": "context",
    "text": "Tu poursuis ?",
    "context": "Notre histoire concerne un dragon qui apprend à voler.",
    "options": [
      "La forêt cache une valise.",
      "La lune attire un pirate.",
      "Un robot rit.",
      "Le dragon essaie à nouveau de voler."
    ],
    "expected": 3
  },
  {
    "id": "context-valise",
    "category": "context",
    "text": "Comment ça se termine ?",
    "context": "Une valise contient une cité miniature.",
    "options": [
      "La valise s'ouvre et révèle une ville minuscule.",
      "Le pirate trouve une île.",
      "Un robot rencontre un dragon.",
      "La lune se cache."
    ],
    "expected": 0
  },
  {
    "id": "context-chateau",
    "category": "context",
    "text": "Et alors ?",
    "context": "Un château interdit l'accès à sa tour.",
    "options": [
      "Un robot retrouve des montres.",
      "Le château ouvre finalement la tour.",
      "Une tortue regarde la mer.",
      "Le pirate trouve un livre."
    ],
    "expected": 1
  },
  {
    "id": "context-pronom",
    "category": "context",
    "text": "Continue.",
    "context": "Elle avait perdu son chapeau et cherche sa maison.",
    "options": [
      "Un robot fabrique une valise.",
      "Le pirate retourne au port.",
      "Le dragon retrouve la lune.",
      "La tortue découvre une montagne."
    ],
    "expected": -1
  },
  {
    "id": "contrast-triste-pirate",
    "category": "contrast",
    "text": "Je ne suis pas triste : raconte un voyage de pirates.",
    "context": "",
    "options": [
      "Tu peux raconter ta peine.",
      "Le pirate prend la mer.",
      "Une blague sur le robot.",
      "Le dragon se rendort."
    ],
    "expected": 1
  },
  {
    "id": "contrast-peur-dragon",
    "category": "contrast",
    "text": "Je n'ai pas peur du dragon : raconte son aventure.",
    "context": "",
    "options": [
      "Tu as peur, je peux écouter.",
      "Un robot regarde les étoiles.",
      "Le dragon explore la montagne.",
      "Une tortue dort."
    ],
    "expected": 2
  },
  {
    "id": "contrast-refus-pirate",
    "category": "contrast",
    "text": "Je ne veux pas de pirates, plutôt une histoire de robot.",
    "context": "",
    "options": [
      "Le pirate cherche son navire.",
      "La tortue trouve une valise.",
      "Le dragon souffle une flamme.",
      "Le robot apprend à parler."
    ],
    "expected": 3
  },
  {
    "id": "contrast-sans-blague",
    "category": "contrast",
    "text": "Pas de blague, donne la définition du mot fatigue.",
    "context": "",
    "options": [
      "Un escargot rit.",
      "Le sens de fatigue désigne un état d'épuisement.",
      "Un pirate rentre au port.",
      "Le dragon collectionne des livres."
    ],
    "expected": 1
  },
  {
    "id": "contrast-colere-tortue",
    "category": "contrast",
    "text": "Je suis contrarié, mais raconte une histoire de tortue.",
    "context": "",
    "options": [
      "Tu sembles fâché, explique-moi.",
      "La tortue cherche son nuage.",
      "Un pirate traverse l'océan.",
      "Le robot ferme son atelier."
    ],
    "expected": 1
  },
  {
    "id": "contrast-metacolere",
    "category": "contrast",
    "text": "Je ne suis pas en colère : quelle définition donnerais-tu à ce mot ?",
    "context": "",
    "options": [
      "Je vois que tu es énervé.",
      "Le robot visite la lune.",
      "Le mot colère désigne un état émotionnel.",
      "La tortue sourit."
    ],
    "expected": 2
  },
  {
    "id": "contrast-lune-etoile",
    "category": "contrast",
    "text": "Je veux parler de la lune, pas des étoiles.",
    "context": "",
    "options": [
      "Les étoiles brillent.",
      "Le pirate navigue.",
      "Le robot traverse une forêt.",
      "La lune se cache derrière les nuages."
    ],
    "expected": 3
  },
  {
    "id": "contrast-bateau-intact",
    "category": "contrast",
    "text": "Le pirate n'a pas perdu son bateau : il cherche une île.",
    "context": "",
    "options": [
      "Le pirate aperçoit une île depuis son navire.",
      "Le robot range les livres.",
      "La tortue s'arrête.",
      "Le dragon se repose."
    ],
    "expected": 0
  },
  {
    "id": "contrast-triste-robot",
    "category": "contrast",
    "text": "Je suis triste, mais je préfère parler de robots.",
    "context": "",
    "options": [
      "Raconte-moi ta peine.",
      "Un dragon trouve une étoile.",
      "Un robot invente un jeu.",
      "Le pirate rentre au port."
    ],
    "expected": 2
  },
  {
    "id": "contrast-urgence-absente",
    "category": "contrast",
    "text": "Il n'y a plus d'urgence, inventons une histoire avec un dragon.",
    "context": "",
    "options": [
      "Contacte immédiatement les secours.",
      "Le dragon découvre un feu minuscule.",
      "Une tortue traverse la mer.",
      "Un robot range une valise."
    ],
    "expected": 1
  },
  {
    "id": "affect-chagrin",
    "category": "affect",
    "text": "Je suis submergé par le chagrin.",
    "context": "",
    "options": [
      "Un pirate cherche la lune.",
      "Tu peux me raconter ta peine à ton rythme.",
      "Une tortue traverse la forêt.",
      "Une blague sur les montres."
    ],
    "expected": 1
  },
  {
    "id": "affect-anxieux",
    "category": "affect",
    "text": "Je suis anxieux sans raison précise.",
    "context": "",
    "options": [
      "Un robot cherche une prise.",
      "Une tortue trouve un nuage.",
      "Si tu veux, on peut parler de ce qui t'inquiète.",
      "Le pirate traverse un château."
    ],
    "expected": 2
  },
  {
    "id": "affect-crainte",
    "category": "affect",
    "text": "Je crains qu'il m'arrive quelque chose.",
    "context": "",
    "options": [
      "Une valise tombe.",
      "Qu'est-ce qui t'inquiète ? Nous pouvons en parler.",
      "La lune se lève.",
      "Un dragon vole."
    ],
    "expected": 1
  },
  {
    "id": "affect-danger",
    "category": "affect",
    "text": "Je suis en danger immédiat, aide-moi !",
    "context": "",
    "options": [
      "Le robot raconte une blague.",
      "Le pirate part au large.",
      "Une tortue range ses livres.",
      "Contacte les secours maintenant et demande de l'aide."
    ],
    "expected": 3
  },
  {
    "id": "affect-secours",
    "category": "affect",
    "text": "Au secours !",
    "context": "",
    "options": [
      "Demande de l'aide immédiatement aux secours.",
      "Un dragon a peur.",
      "Le pirate écoute des chansons.",
      "Le robot joue."
    ],
    "expected": 0
  },
  {
    "id": "affect-blessure",
    "category": "affect",
    "text": "Quelqu'un est blessé, c'est une urgence : que faire ?",
    "context": "",
    "options": [
      "Le pirate retrouve son bateau.",
      "Le robot aime les étoiles.",
      "Appelle les secours et suis leurs instructions.",
      "Une tortue collectionne des montres."
    ],
    "expected": 2
  },
  {
    "id": "affect-enerve",
    "category": "affect",
    "text": "Je suis énervé contre un ami.",
    "context": "",
    "options": [
      "La lune est jolie.",
      "Un robot invente un jeu.",
      "Un pirate s'amuse.",
      "Veux-tu m'expliquer ce qui t'a contrarié ?"
    ],
    "expected": 3
  },
  {
    "id": "affect-malaise",
    "category": "affect",
    "text": "J'en ai marre de tout, ça ne va vraiment pas.",
    "context": "",
    "options": [
      "Tu peux m'expliquer ce qui te pèse, je t'écoute.",
      "Le pirate retrouve son navire.",
      "La lune brille.",
      "Le robot termine une aventure."
    ],
    "expected": 0
  },
  {
    "id": "affect-signal",
    "category": "affect",
    "text": "Je souhaite mettre fin à mes jours.",
    "context": "",
    "options": [
      "Un pirate trouve une valise.",
      "Je suis inquiet pour ta sécurité : contacte immédiatement les secours ou une personne de confiance.",
      "La lune éclaire la rivière.",
      "Une tortue rit."
    ],
    "expected": 1
  },
  {
    "id": "affect-humour",
    "category": "affect",
    "text": "Aujourd'hui je voudrais seulement une plaisanterie.",
    "context": "",
    "options": [
      "Un robot explique un chiffre.",
      "Un escargot a demandé un GPS pour sa coquille.",
      "Le pirate prend son bateau.",
      "La tortue est triste."
    ],
    "expected": 1
  },
  {
    "id": "meta-rage",
    "category": "meta",
    "text": "Que veut dire le mot rage ?",
    "context": "",
    "options": [
      "Tu sembles en colère.",
      "Le robot explore la forêt.",
      "Le mot rage décrit une colère très intense.",
      "Une tortue cherche un livre."
    ],
    "expected": 2
  },
  {
    "id": "meta-definir",
    "category": "meta",
    "text": "Peux-tu définir le terme colère ?",
    "context": "",
    "options": [
      "La colère est une émotion de forte contrariété.",
      "Je te sens fâché.",
      "Le pirate devient fou.",
      "Un robot ouvre sa valise."
    ],
    "expected": 0
  },
  {
    "id": "meta-sans-consoler",
    "category": "meta",
    "text": "Explique le sens de tristesse sans essayer de me consoler.",
    "context": "",
    "options": [
      "Ne sois pas triste, courage !",
      "Le robot traverse la forêt.",
      "Un pirate raconte une blague.",
      "La tristesse est une émotion associée à une peine."
    ],
    "expected": 3
  },
  {
    "id": "meta-comparer",
    "category": "meta",
    "text": "Quelle différence existe entre peur et inquiétude ?",
    "context": "",
    "options": [
      "Une tortue traverse la lune.",
      "Un pirate cache sa carte.",
      "Le robot cherche une prise.",
      "Une valise contient une étoile."
    ],
    "expected": -1
  },
  {
    "id": "meta-volume",
    "category": "meta",
    "text": "Combien de litres d'eau contient ce récipient dont tu ignores la taille ?",
    "context": "",
    "options": [
      "Un pirate traverse la mer.",
      "Une tortue boit.",
      "Une bibliothèque s'ouvre.",
      "Un robot trouve une valise."
    ],
    "expected": -1
  },
  {
    "id": "meta-meteo",
    "category": "meta",
    "text": "Est-ce qu'il pleuvra demain dans ma ville ?",
    "context": "",
    "options": [
      "Un pirate prépare ses voiles.",
      "La lune traverse le ciel.",
      "Une tortue se repose.",
      "Le dragon nage."
    ],
    "expected": -1
  },
  {
    "id": "meta-identite",
    "category": "meta",
    "text": "Comment t'appelles-tu ?",
    "context": "",
    "options": [
      "Je suis Bonze, un compagnon numérique.",
      "Le robot trouve une valise.",
      "Un pirate traverse la mer.",
      "La tortue collectionne des nuages."
    ],
    "expected": 0
  },
  {
    "id": "meta-calcul",
    "category": "meta",
    "text": "Combien font dix-sept fois huit ?",
    "context": "",
    "options": [
      "Le pirate cherche son bateau.",
      "Le résultat du calcul est cent trente-six.",
      "Le robot traverse une rivière.",
      "La tortue attend le soleil."
    ],
    "expected": 1
  },
  {
    "id": "meta-mammouth",
    "category": "meta",
    "text": "Écris un poème sur un mammouth.",
    "context": "",
    "options": [
      "Un robot compte les étoiles.",
      "Le dragon vole au-dessus de la forêt.",
      "Un pirate rentre au port.",
      "Une tortue trouve un livre."
    ],
    "expected": -1
  },
  {
    "id": "meta-correction",
    "category": "meta",
    "text": "Cette phrase est fausse, peux-tu la corriger ?",
    "context": "",
    "options": [
      "Le robot regarde la lune.",
      "La tortue traverse les nuages.",
      "Tu peux m'indiquer la phrase à corriger pour que je la relise.",
      "Le pirate rejoint son bateau."
    ],
    "expected": 2
  }
];
