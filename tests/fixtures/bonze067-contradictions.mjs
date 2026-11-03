/* BONZE-067 prospective developer-authored contradiction probe, frozen BEFORE
 * code/threshold implementation. No clinical relevance or human-blind labels.
 * true=clear contradiction under identical event/time assumptions.
 * false=no contradiction PROVEN; not a claim of logical consistency.
 */
export const contradictionCases=[
  {
    "id": "direct-key",
    "prior": "Le robot a trouvé la clé.",
    "candidate": "Le robot n'a pas trouvé la clé.",
    "conflict": true
  },
  {
    "id": "direct-pirate",
    "prior": "Le pirate ouvre le coffre.",
    "candidate": "Le pirate n'ouvre pas le coffre.",
    "conflict": true
  },
  {
    "id": "direct-dragon",
    "prior": "Le dragon voit la lune.",
    "candidate": "Le dragon ne voit pas la lune.",
    "conflict": true
  },
  {
    "id": "direct-turtle",
    "prior": "La tortue suit la rivière.",
    "candidate": "La tortue ne suit pas la rivière.",
    "conflict": true
  },
  {
    "id": "direct-book",
    "prior": "Le livre contient une carte.",
    "candidate": "Le livre ne contient pas une carte.",
    "conflict": true
  },
  {
    "id": "direct-castle",
    "prior": "Le château cache une porte.",
    "candidate": "Le château ne cache pas une porte.",
    "conflict": true
  },
  {
    "id": "state-door",
    "prior": "La porte est ouverte.",
    "candidate": "La porte est fermée.",
    "conflict": true
  },
  {
    "id": "state-robot",
    "prior": "Le robot est endormi.",
    "candidate": "Le robot est réveillé.",
    "conflict": true
  },
  {
    "id": "state-gate",
    "prior": "Le portail est fermé.",
    "candidate": "Le portail est ouvert.",
    "conflict": true
  },
  {
    "id": "state-atelier",
    "prior": "L'atelier est ouvert.",
    "candidate": "L'atelier est fermé.",
    "conflict": true
  },
  {
    "id": "direct-robot-fear",
    "prior": "Le robot a peur.",
    "candidate": "Le robot n'a pas peur.",
    "conflict": true
  },
  {
    "id": "direct-dragon-sleep",
    "prior": "Le dragon dort.",
    "candidate": "Le dragon ne dort pas.",
    "conflict": true
  },
  {
    "id": "direct-pronoun",
    "prior": "Il trouve le livre.",
    "candidate": "Il ne trouve pas le livre.",
    "conflict": true
  },
  {
    "id": "direct-inverted",
    "prior": "La tortue n'a pas trouvé la clé.",
    "candidate": "La tortue a trouvé la clé.",
    "conflict": true
  },
  {
    "id": "temporal-then",
    "prior": "La porte était fermée.",
    "candidate": "Maintenant la porte est ouverte.",
    "conflict": false
  },
  {
    "id": "temporal-key",
    "prior": "Le robot n'a pas trouvé la clé.",
    "candidate": "Finalement, le robot a trouvé la clé.",
    "conflict": false
  },
  {
    "id": "temporal-two",
    "prior": "Le portail est fermé.",
    "candidate": "Puis le portail est ouvert.",
    "conflict": false
  },
  {
    "id": "temporal-still",
    "prior": "La porte est fermée.",
    "candidate": "Après quelques secondes, la porte est ouverte.",
    "conflict": false
  },
  {
    "id": "temporal-lose",
    "prior": "Le robot a perdu la clé.",
    "candidate": "Le robot a retrouvé la clé.",
    "conflict": false
  },
  {
    "id": "temporal-closer",
    "prior": "Le pirate ouvre le coffre.",
    "candidate": "Ensuite le pirate referme le coffre.",
    "conflict": false
  },
  {
    "id": "different-subject",
    "prior": "Le pirate trouve le coffre.",
    "candidate": "Le robot ne trouve pas le coffre.",
    "conflict": false
  },
  {
    "id": "different-object",
    "prior": "Le robot a trouvé la clé.",
    "candidate": "Le robot n'a pas trouvé le livre.",
    "conflict": false
  },
  {
    "id": "different-scene",
    "prior": "La tortue suit la rivière.",
    "candidate": "Le dragon ne suit pas la rivière.",
    "conflict": false
  },
  {
    "id": "different-state",
    "prior": "La porte est ouverte.",
    "candidate": "Le coffre est fermé.",
    "conflict": false
  },
  {
    "id": "coherent",
    "prior": "Le robot trouve la clé.",
    "candidate": "Le robot contemple sa clé.",
    "conflict": false
  },
  {
    "id": "identical",
    "prior": "La tortue traverse la forêt.",
    "candidate": "La tortue traverse la forêt.",
    "conflict": false
  },
  {
    "id": "quote",
    "prior": "Le robot dit : je trouve la clé.",
    "candidate": "Dans son récit, le robot ne trouve pas la clé.",
    "conflict": false
  },
  {
    "id": "conditional",
    "prior": "Si le robot trouve la clé, la porte s'ouvre.",
    "candidate": "Le robot ne trouve pas la clé.",
    "conflict": false
  },
  {
    "id": "colors",
    "prior": "La clé est rouge.",
    "candidate": "La clé est bleue.",
    "conflict": false
  },
  {
    "id": "light",
    "prior": "La nuit est claire.",
    "candidate": "La nuit est sombre.",
    "conflict": false
  },
  {
    "id": "narrative",
    "prior": "Le robot découvre une carte sous la table.",
    "candidate": "Le robot observe ensuite la carte.",
    "conflict": false
  },
  {
    "id": "no-actor",
    "prior": "La porte est ouverte.",
    "candidate": "La porte semble fermée.",
    "conflict": false
  }
];
