/* BONZE-062: developer-labeled preference/negation diagnostics.
 * No claims of blind human evaluation. -1 means abstain/safety hand-off.
 */
export const preferenceCases=[
  {
    "id": "robot-after-sadness",
    "text": "Je suis triste, mais je préfère parler de robots.",
    "options": [
      "Tu sembles triste, veux-tu m'en parler ?",
      "Un pirate traverse la mer.",
      "Un robot invente un jeu.",
      "La lune éclaire un bateau."
    ],
    "expected": 2
  },
  {
    "id": "robot-after-refusal",
    "text": "Je ne veux pas de pirates, plutôt une histoire de robots.",
    "options": [
      "Le pirate recherche son navire.",
      "La tortue retrouve ses nuages.",
      "Un robot ouvre une porte.",
      "Le dragon découvre la lune."
    ],
    "expected": 2
  },
  {
    "id": "moon-not-stars",
    "text": "Je veux parler de la lune, pas des étoiles.",
    "options": [
      "Les étoiles brillent dans le ciel.",
      "La lune apparaît au-dessus de la ville.",
      "Un robot découvre une valise.",
      "Le pirate cherche un bateau."
    ],
    "expected": 1
  },
  {
    "id": "dragon-not-fear",
    "text": "Je n'ai pas peur du dragon, raconte son aventure.",
    "options": [
      "Tu sembles inquiet, veux-tu en parler ?",
      "Le pirate prend la mer.",
      "Un dragon explore une montagne.",
      "Une tortue se cache."
    ],
    "expected": 2
  },
  {
    "id": "robot-new-direction",
    "text": "Je ne veux pas de pirates mais je préfère les robots.",
    "options": [
      "Le pirate trouve une île.",
      "Le robot invente une machine.",
      "La tortue trouve un nuage.",
      "Un livre vole."
    ],
    "expected": 1
  },
  {
    "id": "turtle-after-anger",
    "text": "Je suis en colère mais je préfère une histoire de tortue.",
    "options": [
      "Qu'est-ce qui t'a mis en colère ?",
      "Le dragon se réveille.",
      "La tortue suit un sentier.",
      "Le pirate quitte le port."
    ],
    "expected": 2
  },
  {
    "id": "robot-explicit-pivot",
    "text": "Parlons de pirates, enfin non, plutôt d'un robot.",
    "options": [
      "Le robot ouvre une valise.",
      "Le pirate trouve son bateau.",
      "La lune revient.",
      "Une tortue regarde le ciel."
    ],
    "expected": 0
  },
  {
    "id": "panda-unknown",
    "text": "Je préfère une histoire de panda.",
    "options": [
      "Le pirate découvre la mer.",
      "Le robot ouvre une valise.",
      "Un dragon regarde la lune.",
      "Une tortue avance."
    ],
    "expected": -1
  },
  {
    "id": "unicorn-unknown",
    "text": "Je ne veux pas d'histoire de pirate, plutôt une licorne.",
    "options": [
      "Le pirate repart.",
      "Le robot découvre une étoile.",
      "Une tortue traverse la forêt.",
      "Un dragon se cache."
    ],
    "expected": -1
  },
  {
    "id": "multiple-new-topics",
    "text": "Je veux parler de pirates et de robots.",
    "options": [
      "Le robot cherche une machine.",
      "Un pirate découvre une île.",
      "La lune apparaît.",
      "La tortue se promène."
    ],
    "expected": -1
  },
  {
    "id": "only-veto",
    "text": "Pas de pirates, merci.",
    "options": [
      "Un pirate traverse la mer.",
      "Le robot est heureux.",
      "Un dragon attend.",
      "La tortue réfléchit."
    ],
    "expected": -1
  },
  {
    "id": "no-blague-definition",
    "text": "Pas de blague, je préfère une définition.",
    "options": [
      "Un escargot fait rire.",
      "Le mot tristesse désigne une émotion.",
      "Un pirate découvre un bateau.",
      "Un robot joue."
    ],
    "expected": 1
  },
  {
    "id": "no-robot",
    "text": "Je préfère le dragon, sans robots.",
    "options": [
      "Le robot saute.",
      "La tortue cherche un nuage.",
      "Le dragon traverse les montagnes.",
      "Le pirate se cache."
    ],
    "expected": 2
  },
  {
    "id": "no-pirate-even-mixed",
    "text": "Je ne veux pas de pirates, plutôt un robot.",
    "options": [
      "Un pirate et un robot regardent la mer.",
      "Un robot déchiffre un message.",
      "Le dragon souffle le feu.",
      "Une tortue mange."
    ],
    "expected": 1
  },
  {
    "id": "danger-later",
    "text": "Je ne veux pas de pirates, mais je suis en danger immédiat.",
    "options": [
      "Un pirate navigue.",
      "Un robot découvre des étoiles.",
      "La tortue retrouve son nuage.",
      "Le dragon dort."
    ],
    "expected": -1
  },
  {
    "id": "robot-before-star-veto",
    "text": "Je veux parler d'un robot, pas des étoiles.",
    "options": [
      "Un robot voyage sur une étoile.",
      "Un robot dessine une maison.",
      "Le pirate prépare son navire.",
      "La tortue cherche son nuage."
    ],
    "expected": 1
  }
];
