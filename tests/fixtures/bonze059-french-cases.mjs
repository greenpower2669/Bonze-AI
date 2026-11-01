/* BONZE-059: authored exploratory examples, not independent human judgments.
 * 22 families x 4 paraphrases = 88 requests, plus 11 historical BONZE-057
 * examples = 99 unique prompts. Rotating options yields 396 correlated trials.
 * One clear prewritten reference per case; not training data or quality proof.
 */
export const families=[
  {
    "id": "pirate",
    "intent": "jeu",
    "prompts": [
      "Imagine un pirate sur un navire.",
      "Invente l'aventure d'un corsaire.",
      "Raconte une histoire de bateau pirate.",
      "J'aimerais jouer au capitaine d'un navire."
    ],
    "options": [
      "Un pirate découvre une île au bout du voyage.",
      "La tortue trouve un nuage dans la forêt.",
      "Le dragon cherche sa petite flamme.",
      "Un robot dessine des étoiles."
    ],
    "expected": 0,
    "context": ""
  },
  {
    "id": "dragon",
    "intent": "jeu",
    "prompts": [
      "Imagine un dragon qui découvre le feu.",
      "Raconte une aventure avec des dragons.",
      "Invente un récit de dragon effrayé.",
      "Je voudrais jouer avec un petit dragon."
    ],
    "options": [
      "Le pirate traverse une mer agitée.",
      "Le dragon apprend à approcher une petite flamme.",
      "Le robot découvre une fusée.",
      "La tortue se cache dans sa maison."
    ],
    "expected": 1,
    "context": ""
  },
  {
    "id": "robot",
    "intent": "jeu",
    "prompts": [
      "Imagine un robot qui explore.",
      "Raconte une histoire d'automate.",
      "Invente une aventure de robots.",
      "Je veux jouer avec un robot explorateur."
    ],
    "options": [
      "Le château cache un trésor.",
      "La lune éclaire une rivière.",
      "Un robot suit des traces dans le sable.",
      "Une tortue attrape son nuage."
    ],
    "expected": 2,
    "context": ""
  },
  {
    "id": "tortue",
    "intent": "jeu",
    "prompts": [
      "Imagine une tortue voyageuse.",
      "Raconte l'aventure de la tortue.",
      "Invente une histoire avec des tortues.",
      "Je voudrais suivre une tortue."
    ],
    "options": [
      "Le pirate range ses voiles.",
      "Le dragon regarde un feu.",
      "Le robot construit son ami.",
      "La tortue avance lentement vers la montagne."
    ],
    "expected": 3,
    "context": ""
  },
  {
    "id": "nuages",
    "intent": "jeu",
    "prompts": [
      "Imagine des nuages qui parlent.",
      "Raconte une histoire avec des nuages.",
      "Invente l'aventure d'un nuage.",
      "Je veux découvrir un nuage magique."
    ],
    "options": [
      "Un nuage flotte au-dessus de la montagne.",
      "Le robot suit son plan.",
      "Le pirate retrouve le port.",
      "Un livre tombe de la bibliothèque."
    ],
    "expected": 0,
    "context": ""
  },
  {
    "id": "chateau",
    "intent": "jeu",
    "prompts": [
      "Imagine un château secret.",
      "Raconte l'histoire d'une forteresse.",
      "Invente l'aventure d'un château.",
      "Je veux entrer dans des châteaux fantastiques."
    ],
    "options": [
      "La tortue monte sur un arbre.",
      "Une porte du château change de couleur.",
      "Le navire navigue près de l'île.",
      "Le robot trouve un crayon."
    ],
    "expected": 1,
    "context": ""
  },
  {
    "id": "foret",
    "intent": "jeu",
    "prompts": [
      "Imagine une forêt magique.",
      "Raconte une histoire dans les bois.",
      "Invente l'aventure des lanternes en forêt.",
      "Je voudrais explorer les forêts."
    ],
    "options": [
      "Une tortue traverse la plage.",
      "Le pirate retrouve sa carte.",
      "Les lanternes de la forêt guident les voyageurs.",
      "La valise se referme."
    ],
    "expected": 2,
    "context": ""
  },
  {
    "id": "lune",
    "intent": "jeu",
    "prompts": [
      "Imagine une aventure sur la lune.",
      "Raconte l'histoire de la lune.",
      "Invente un voyage lunaire.",
      "Je voudrais parler avec la lune."
    ],
    "options": [
      "Un robot découvre un jardin.",
      "Un navire rejoint le port.",
      "Un livre tombe du ciel.",
      "La lune prête son parapluie au voyageur."
    ],
    "expected": 3,
    "context": ""
  },
  {
    "id": "livre",
    "intent": "jeu",
    "prompts": [
      "Imagine une bibliothèque volante.",
      "Raconte une histoire de livres perdus.",
      "Invente une aventure avec un livre.",
      "Je voudrais visiter une bibliothèque."
    ],
    "options": [
      "La bibliothèque retrouve les livres perdus.",
      "Le dragon apprend à souffler.",
      "Le pirate découvre des poissons.",
      "La tortue retrouve son chemin."
    ],
    "expected": 0,
    "context": ""
  },
  {
    "id": "riviere",
    "intent": "jeu",
    "prompts": [
      "Imagine une rivière à l'envers.",
      "Raconte une aventure près du fleuve.",
      "Invente une rivière mystérieuse.",
      "Je voudrais suivre une rivière."
    ],
    "options": [
      "Le pirate rencontre son équipage.",
      "La rivière mène au jardin des montres.",
      "Une tortue regarde un nuage.",
      "Un dragon se cache."
    ],
    "expected": 1,
    "context": ""
  },
  {
    "id": "montres",
    "intent": "jeu",
    "prompts": [
      "Imagine une montre qui parle.",
      "Raconte une histoire de montres.",
      "Invente une aventure avec une horloge.",
      "Je voudrais découvrir le jardin des montres."
    ],
    "options": [
      "La forêt cache une lanterne.",
      "La lune traverse une nuée.",
      "Les montres du jardin montrent un chemin.",
      "Le dragon apprend à voler."
    ],
    "expected": 2,
    "context": ""
  },
  {
    "id": "valise",
    "intent": "jeu",
    "prompts": [
      "Imagine une valise magique.",
      "Raconte une histoire de bagage secret.",
      "Invente l'aventure d'une valise.",
      "Je voudrais ouvrir une valise mystérieuse."
    ],
    "options": [
      "Le pirate répare son navire.",
      "La tortue attend le soleil.",
      "Un robot joue avec le dragon.",
      "La valise contient une ville minuscule."
    ],
    "expected": 3,
    "context": ""
  },
  {
    "id": "etoiles",
    "intent": "jeu",
    "prompts": [
      "Imagine un ciel plein d'étoiles.",
      "Raconte une histoire d'étoiles.",
      "Invente un voyage vers les étoiles.",
      "Je voudrais observer les étoiles avec toi."
    ],
    "options": [
      "Les étoiles scintillent dans le ciel.",
      "Le pirate explore une île.",
      "Un robot nettoie son atelier.",
      "Le château ferme ses portes."
    ],
    "expected": 0,
    "context": ""
  },
  {
    "id": "tristesse",
    "intent": "tristesse",
    "prompts": [
      "Je suis triste aujourd'hui.",
      "Je pleure, j'ai du chagrin.",
      "J'ai beaucoup de peine.",
      "Je me sens malheureux et triste."
    ],
    "options": [
      "Une blague de pirate arrive.",
      "Tu peux raconter ta peine si tu en as envie.",
      "Le dragon saute très haut.",
      "Un robot ouvre la porte."
    ],
    "expected": 1,
    "context": ""
  },
  {
    "id": "colere",
    "intent": "contrarié",
    "prompts": [
      "Je suis en colère.",
      "Je suis furieux de cette injustice.",
      "C'est injuste et ça m'agace.",
      "Je suis énervé par cette injustice."
    ],
    "options": [
      "Imaginons une tortue.",
      "La lune éclaire la mer.",
      "Qu'est-ce qui te paraît injuste dans cette situation ?",
      "Veux-tu connaître une recette ?"
    ],
    "expected": 2,
    "context": ""
  },
  {
    "id": "peur",
    "intent": "inquietude",
    "prompts": [
      "J'ai peur de cette situation.",
      "Je suis inquiet et angoissé.",
      "Je ressens une grande crainte.",
      "Je suis stressé par ce danger."
    ],
    "options": [
      "Une valise parle au pirate.",
      "Le robot aime son atelier.",
      "Une blague pourrait te faire rire.",
      "Qu'est-ce qui te fait peur ? Nous pouvons examiner le risque."
    ],
    "expected": 3,
    "context": ""
  },
  {
    "id": "humour",
    "intent": "humour",
    "prompts": [
      "Raconte une blague.",
      "J'ai envie de rire.",
      "Un peu d'humour, s'il te plaît.",
      "Tu as une plaisanterie drôle ?"
    ],
    "options": [
      "Un escargot demande un plan pour sa coquille.",
      "Je préfère vérifier un chiffre.",
      "La tortue collectionne des nuages.",
      "Il faudrait une définition exacte."
    ],
    "expected": 0,
    "context": ""
  },
  {
    "id": "definition",
    "intent": "question",
    "prompts": [
      "Que signifie le mot colère ?",
      "Quelle est la définition de la colère ?",
      "Quel est le sens de cette expression ?",
      "Peux-tu expliquer le mot colère ?"
    ],
    "options": [
      "Tu es en colère, je le sens.",
      "Le sens d'un mot dépend de son emploi, précisons la définition.",
      "Un pirate traverse une mer.",
      "Ce n'est pas une question importante."
    ],
    "expected": 1,
    "context": ""
  },
  {
    "id": "urgence",
    "intent": "urgence",
    "prompts": [
      "Au secours, je suis en danger immédiat !",
      "Je suis en danger et j'ai besoin d'aide.",
      "C'est une urgence vitale.",
      "Quelqu'un est en danger, appelle les secours."
    ],
    "options": [
      "Le robot fait une blague.",
      "Je n'ai aucune idée.",
      "En cas de danger immédiat, contacte les secours et demande de l'aide.",
      "Le dragon découvre une île."
    ],
    "expected": 2,
    "context": ""
  },
  {
    "id": "negation",
    "intent": "jeu",
    "prompts": [
      "Je ne suis pas triste, je veux jouer avec un robot.",
      "Je n'ai pas de chagrin, imaginons un robot.",
      "Pas de tristesse : inventons l'aventure d'un automate.",
      "Je ne suis plus triste, raconte une histoire de robot."
    ],
    "options": [
      "Tu sembles triste, raconte-moi ta peine.",
      "Le pirate se perd en mer.",
      "Une tortue marche dans la forêt.",
      "Le robot invente un jeu de piste."
    ],
    "expected": 3,
    "context": ""
  },
  {
    "id": "suite_pirate",
    "intent": "jeu",
    "prompts": [
      "Et après, que fait le pirate ?",
      "Que lui arrive-t-il ensuite ?",
      "Et puis, le bateau fait quoi ?",
      "Continue notre histoire du navire."
    ],
    "options": [
      "Le pirate arrive enfin au port après sa traversée.",
      "Le robot cherche un livre.",
      "Une tortue suit une rivière.",
      "Le dragon découvre la lune."
    ],
    "expected": 0,
    "context": "Notre histoire parle d'un pirate sur un bateau qui voyage vers une île."
  },
  {
    "id": "suite_tortue",
    "intent": "jeu",
    "prompts": [
      "Et ensuite, où va la tortue ?",
      "Continue l'histoire de la tortue.",
      "Que lui arrive-t-il après ?",
      "Et après cette rencontre, que fait-elle ?"
    ],
    "options": [
      "Un pirate traverse la mer.",
      "La tortue retrouve son nuage près des montagnes.",
      "Le robot ferme la porte.",
      "Le dragon découvre son feu."
    ],
    "expected": 1,
    "context": "Notre héroïne est une tortue qui collectionne les nuages dans la forêt."
  }
];
export const historical=[
  {
    "id": "historic_pirate",
    "text": "Raconte une histoire de pirate.",
    "context": "",
    "intent": "jeu",
    "options": [
      "Le dragon se cache près d'un volcan.",
      "Une tortue regarde les étoiles.",
      "Le pirate découvre une île derrière son navire.",
      "Un robot cherche une prise électrique."
    ],
    "expected": 2
  },
  {
    "id": "historic_dragon",
    "text": "Imagine un dragon qui a peur du feu.",
    "context": "",
    "intent": "jeu",
    "options": [
      "Le robot veut visiter la lune.",
      "Un château découvre des lanternes.",
      "Le pirate range son bateau.",
      "Le dragon apprend doucement à approcher une petite flamme."
    ],
    "expected": 3
  },
  {
    "id": "historic_robot",
    "text": "Je voudrais une aventure avec un robot.",
    "context": "",
    "intent": "jeu",
    "options": [
      "La tortue reprend son voyage.",
      "Le robot cherche une trace dans le sable.",
      "Le dragon se cache dans le château.",
      "Le pirate prend la mer."
    ],
    "expected": 1
  },
  {
    "id": "historic_suite",
    "text": "Et après ?",
    "context": "Nous racontions le voyage d'un pirate sur une île.",
    "intent": "jeu",
    "options": [
      "Un robot découvre un jardin.",
      "Une tortue collectionne les nuages.",
      "Une rivière apporte des montres.",
      "Le pirate arrive au port après sa traversée."
    ],
    "expected": 3
  },
  {
    "id": "historic_tristesse",
    "text": "Je pleure, je suis triste.",
    "context": "",
    "intent": "tristesse",
    "options": [
      "Une blague sur les chaussettes !",
      "Tu peux me raconter ce qui te peine, si tu le souhaites.",
      "Un dragon vole très haut.",
      "Je suis certain que tout ira bien demain."
    ],
    "expected": 1
  },
  {
    "id": "historic_colere",
    "text": "Je suis en colère parce que c'est injuste.",
    "context": "",
    "intent": "contrarié",
    "options": [
      "Qu'est-ce qui t'a semblé injuste ? Nous pouvons y réfléchir.",
      "Quel personnage de conte préfères-tu ?",
      "Bonne nuit et à demain.",
      "Une grenouille chante très fort."
    ],
    "expected": 0
  },
  {
    "id": "historic_humour",
    "text": "Raconte une blague amusante.",
    "context": "",
    "intent": "humour",
    "options": [
      "Tu peux me préciser les chiffres ?",
      "Parlons de la définition de la tristesse.",
      "Un pirate traverse une mer calme.",
      "Un escargot demande un plan pour sa coquille."
    ],
    "expected": 3
  },
  {
    "id": "historic_negation",
    "text": "Je ne suis pas triste : je voudrais jouer avec un robot.",
    "context": "",
    "intent": "jeu",
    "options": [
      "Tu sembles triste, veux-tu parler de ta peine ?",
      "Un dragon craint une petite flamme.",
      "Un robot invente un jeu de piste.",
      "Cette question demande une source fiable."
    ],
    "expected": 2
  },
  {
    "id": "historic_unknown",
    "text": "Imagine une licorne.",
    "context": "",
    "intent": "jeu",
    "options": [
      "Je peux inventer une histoire avec toi. Quel personnage aimerais-tu imaginer pour commencer ?",
      "La tortue rassemble ses nuages.",
      "Un pirate se cache sur son bateau.",
      "Le dragon saute au-dessus des montagnes."
    ],
    "expected": 0
  },
  {
    "id": "historic_definition",
    "text": "Que signifie le mot colère ?",
    "context": "",
    "intent": "question",
    "options": [
      "Je vois que tu es en colère.",
      "Si tu demandes une définition, nous pouvons examiner le sens précis du mot.",
      "Le dragon se fâche contre la lune.",
      "Tu devrais rire de cette histoire."
    ],
    "expected": 1
  },
  {
    "id": "historic_continuite",
    "text": "Que lui arrive-t-il ensuite ?",
    "context": "Nous racontions l'histoire d'une tortue qui collectionne les nuages.",
    "intent": "jeu",
    "options": [
      "Le robot traverse le désert.",
      "Un pirate prépare son navire.",
      "La tortue retrouve son nuage près des montagnes.",
      "Un croissant cherche sa boulangerie."
    ],
    "expected": 2
  }
];
export function expand(){
 const cases=[];
 for(const family of families)for(let n=0;n<family.prompts.length;n++)
  cases.push({id:family.id+'-'+(n+1),family:family.id,intent:family.intent,
   text:family.prompts[n],options:family.options,expected:family.expected,
   context:family.context,source:'authored-paraphrase'});
 for(const h of historical)cases.push({...h,family:h.id,source:'BONZE-057-reference'});
 return cases;
}
