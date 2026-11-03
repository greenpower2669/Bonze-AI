/* BONZE-068 — prospective developer-labeled narrative challenge.
 * Frozen before evaluating BONZE-067. Fictional cases only.
 * False = NOT A PROVEN contradiction, not certified coherence.
 * Not annotated by independent humans.
 */
export const scenarios=[
  {
    "id": "p01",
    "previous": "Le robot cache la clé.",
    "next": "Le robot ne cache pas la clé.",
    "conflict": true,
    "category": "polarity"
  },
  {
    "id": "p02",
    "previous": "Le pirate possède une carte.",
    "next": "Le pirate ne possède pas une carte.",
    "conflict": true,
    "category": "polarity"
  },
  {
    "id": "p03",
    "previous": "La tortue rencontre le dragon.",
    "next": "La tortue ne rencontre pas le dragon.",
    "conflict": true,
    "category": "polarity"
  },
  {
    "id": "p04",
    "previous": "Le dragon regarde la lune.",
    "next": "Le dragon ne regarde pas la lune.",
    "conflict": true,
    "category": "polarity"
  },
  {
    "id": "p05",
    "previous": "Le robot traverse la forêt.",
    "next": "Le robot ne traverse pas la forêt.",
    "conflict": true,
    "category": "polarity"
  },
  {
    "id": "p06",
    "previous": "Le livre contient une lettre.",
    "next": "Le livre ne contient pas une lettre.",
    "conflict": true,
    "category": "polarity"
  },
  {
    "id": "p07",
    "previous": "Le pirate garde le coffre.",
    "next": "Le pirate ne garde pas le coffre.",
    "conflict": true,
    "category": "polarity"
  },
  {
    "id": "p08",
    "previous": "La valise cache une carte.",
    "next": "La valise ne cache pas une carte.",
    "conflict": true,
    "category": "polarity"
  },
  {
    "id": "p09",
    "previous": "Le portail est ouvert.",
    "next": "Le portail est fermé.",
    "conflict": true,
    "category": "exclusive-state"
  },
  {
    "id": "p10",
    "previous": "Le dragon est réveillé.",
    "next": "Le dragon est endormi.",
    "conflict": true,
    "category": "exclusive-state"
  },
  {
    "id": "p11",
    "previous": "La trappe est fermée.",
    "next": "La trappe est ouverte.",
    "conflict": true,
    "category": "exclusive-state"
  },
  {
    "id": "p12",
    "previous": "Le robot est endormi.",
    "next": "Le robot est réveillé.",
    "conflict": true,
    "category": "exclusive-state"
  },
  {
    "id": "t01",
    "previous": "La porte est ouverte.",
    "next": "Plus tard, la porte est fermée.",
    "conflict": false,
    "category": "timeline"
  },
  {
    "id": "t02",
    "previous": "Le robot ne trouve pas la carte.",
    "next": "Finalement le robot trouve la carte.",
    "conflict": false,
    "category": "timeline"
  },
  {
    "id": "t03",
    "previous": "Le dragon est endormi.",
    "next": "Maintenant le dragon est réveillé.",
    "conflict": false,
    "category": "timeline"
  },
  {
    "id": "t04",
    "previous": "Le pirate ne possède pas de carte.",
    "next": "Puis le pirate possède une carte.",
    "conflict": false,
    "category": "timeline"
  },
  {
    "id": "t05",
    "previous": "Le robot ne garde pas le livre.",
    "next": "Après une heure, le robot garde le livre.",
    "conflict": false,
    "category": "timeline"
  },
  {
    "id": "t06",
    "previous": "Le portail est fermé.",
    "next": "Ensuite le portail est ouvert.",
    "conflict": false,
    "category": "timeline"
  },
  {
    "id": "q01",
    "previous": "Le robot dit qu'il a la clé.",
    "next": "Le robot ne dit pas qu'il a la clé.",
    "conflict": false,
    "category": "reported"
  },
  {
    "id": "q02",
    "previous": "Dans son récit, le pirate cache un coffre.",
    "next": "Le pirate ne cache pas le coffre.",
    "conflict": false,
    "category": "reported"
  },
  {
    "id": "q03",
    "previous": "Si la porte est ouverte, le robot entre.",
    "next": "La porte est fermée.",
    "conflict": false,
    "category": "reported"
  },
  {
    "id": "q04",
    "previous": "Le dragon imagine qu'il est endormi.",
    "next": "Le dragon est réveillé.",
    "conflict": false,
    "category": "reported"
  },
  {
    "id": "q05",
    "previous": "Le robot cite : je possède la carte.",
    "next": "Le robot ne possède pas la carte.",
    "conflict": false,
    "category": "reported"
  },
  {
    "id": "r01",
    "previous": "Le robot a trouvé la clé.",
    "next": "Le pirate n'a pas trouvé la clé.",
    "conflict": false,
    "category": "different-referent"
  },
  {
    "id": "r02",
    "previous": "Le robot ouvre la porte.",
    "next": "Le robot ne ferme pas la porte.",
    "conflict": false,
    "category": "different-predicate"
  },
  {
    "id": "r03",
    "previous": "La tortue découvre une rivière.",
    "next": "La tortue ne découvre pas un livre.",
    "conflict": false,
    "category": "different-predicate"
  },
  {
    "id": "r04",
    "previous": "Le château est ouvert.",
    "next": "Le coffre est fermé.",
    "conflict": false,
    "category": "different-referent"
  },
  {
    "id": "r05",
    "previous": "Le dragon est endormi.",
    "next": "Le robot est réveillé.",
    "conflict": false,
    "category": "different-referent"
  },
  {
    "id": "r06",
    "previous": "La porte est ouverte.",
    "next": "La fenêtre est fermée.",
    "conflict": false,
    "category": "different-referent"
  },
  {
    "id": "c01",
    "previous": "Le robot avait perdu la clé.",
    "next": "Le robot retrouve sa clé.",
    "conflict": false,
    "category": "causal"
  },
  {
    "id": "c02",
    "previous": "Le dragon sort de sa grotte.",
    "next": "Le dragon entre dans sa grotte.",
    "conflict": false,
    "category": "causal"
  },
  {
    "id": "c03",
    "previous": "Le pirate ouvre le coffre.",
    "next": "Le pirate referme le coffre.",
    "conflict": false,
    "category": "causal"
  },
  {
    "id": "c04",
    "previous": "La tortue tient la carte.",
    "next": "La tortue laisse tomber la carte.",
    "conflict": false,
    "category": "causal"
  },
  {
    "id": "c05",
    "previous": "Le robot possède une clé.",
    "next": "Le robot n'a plus sa clé.",
    "conflict": false,
    "category": "causal"
  },
  {
    "id": "c06",
    "previous": "Le portail est fermé.",
    "next": "La gardienne ouvre le portail.",
    "conflict": false,
    "category": "causal"
  }
];
