/* BONZE-069 — frozen developer-authored stories for prospective diagnosis.
 * Editor labels: true=explicit clash under SAME-TIME / SAME-ENTITY assumption.
 * false=no clash PROVEN; a candidate may still be inaccurate.
 * Never independent human evaluation; do not silently revise after results.
 */
export const challenge=[
  {
    "id": "Q01",
    "prior": "Le robot possède une clé.",
    "candidate": "Le robot n'a aucune clé.",
    "conflict": true,
    "kind": "quantifier"
  },
  {
    "id": "Q02",
    "prior": "La tortue possède un livre.",
    "candidate": "La tortue ne possède aucun livre.",
    "conflict": true,
    "kind": "quantifier"
  },
  {
    "id": "Q03",
    "prior": "Le pirate n'a aucun coffre.",
    "candidate": "Le pirate possède un coffre.",
    "conflict": true,
    "kind": "quantifier"
  },
  {
    "id": "Q04",
    "prior": "Le dragon a une carte.",
    "candidate": "Le dragon n'a aucune carte.",
    "conflict": true,
    "kind": "quantifier"
  },
  {
    "id": "Q05",
    "prior": "Le robot ne possède aucun livre.",
    "candidate": "Le robot possède un livre.",
    "conflict": true,
    "kind": "quantifier"
  },
  {
    "id": "Q06",
    "prior": "Le pirate a un trésor.",
    "candidate": "Le pirate n'a pas de trésor.",
    "conflict": true,
    "kind": "quantifier"
  },
  {
    "id": "Q07",
    "prior": "La gardienne possède une clé.",
    "candidate": "La gardienne n'a aucune clé.",
    "conflict": true,
    "kind": "quantifier"
  },
  {
    "id": "Q08",
    "prior": "Le robot possède le livre.",
    "candidate": "Le robot n'a aucun livre.",
    "conflict": true,
    "kind": "quantifier"
  },
  {
    "id": "N01",
    "prior": "Le capitaine n'a jamais ouvert la porte.",
    "candidate": "Le capitaine a ouvert la porte hier.",
    "conflict": true,
    "kind": "never-past"
  },
  {
    "id": "N02",
    "prior": "La gardienne a fermé le coffre lundi.",
    "candidate": "La gardienne n'a jamais fermé le coffre.",
    "conflict": true,
    "kind": "never-past"
  },
  {
    "id": "N03",
    "prior": "Le robot n'a jamais trouvé la carte.",
    "candidate": "Le robot a trouvé la carte hier.",
    "conflict": true,
    "kind": "never-past"
  },
  {
    "id": "N04",
    "prior": "Le pirate a caché le livre samedi.",
    "candidate": "Le pirate n'a jamais caché le livre.",
    "conflict": true,
    "kind": "never-past"
  },
  {
    "id": "A01",
    "prior": "Le robot ouvre le coffre.",
    "candidate": "Le robot ne l'ouvre pas.",
    "conflict": true,
    "kind": "object-pronoun"
  },
  {
    "id": "A02",
    "prior": "La tortue ferme la porte.",
    "candidate": "La tortue ne la ferme pas.",
    "conflict": true,
    "kind": "object-pronoun"
  },
  {
    "id": "A03",
    "prior": "Le dragon n'ouvre pas le coffre.",
    "candidate": "Le dragon l'ouvre.",
    "conflict": true,
    "kind": "object-pronoun"
  },
  {
    "id": "A04",
    "prior": "Le pirate garde le livre.",
    "candidate": "Le pirate ne le garde pas.",
    "conflict": true,
    "kind": "object-pronoun"
  },
  {
    "id": "A05",
    "prior": "La gardienne cache la clé.",
    "candidate": "La gardienne ne la cache pas.",
    "conflict": true,
    "kind": "object-pronoun"
  },
  {
    "id": "F01",
    "prior": "Un robot possède une clé.",
    "candidate": "Le robot n'a aucune clé.",
    "conflict": false,
    "kind": "actor-ambiguous"
  },
  {
    "id": "F02",
    "prior": "La tortue possède un livre.",
    "candidate": "Une tortue ne possède aucun livre.",
    "conflict": false,
    "kind": "actor-ambiguous"
  },
  {
    "id": "F03",
    "prior": "Le pirate possède un coffre.",
    "candidate": "La pirate n'a aucun coffre.",
    "conflict": false,
    "kind": "actor-ambiguous"
  },
  {
    "id": "F04",
    "prior": "Le robot ouvre la porte.",
    "candidate": "Un robot ne l'ouvre pas.",
    "conflict": false,
    "kind": "actor-ambiguous"
  },
  {
    "id": "F05",
    "prior": "Le robot possède une clé.",
    "candidate": "Le pirate n'a aucune clé.",
    "conflict": false,
    "kind": "actor-ambiguous"
  },
  {
    "id": "F06",
    "prior": "Le robot possède un livre.",
    "candidate": "Le robot n'a aucune clé.",
    "conflict": false,
    "kind": "object-different"
  },
  {
    "id": "F07",
    "prior": "La tortue possède une carte.",
    "candidate": "La tortue ne possède aucun livre.",
    "conflict": false,
    "kind": "object-different"
  },
  {
    "id": "F08",
    "prior": "Le pirate ouvre la porte.",
    "candidate": "Le pirate ne ferme pas la porte.",
    "conflict": false,
    "kind": "predicate-different"
  },
  {
    "id": "F09",
    "prior": "Le robot ouvre la porte.",
    "candidate": "Le robot ne la ferme pas.",
    "conflict": false,
    "kind": "predicate-different"
  },
  {
    "id": "F10",
    "prior": "Le robot ouvre le coffre et la porte.",
    "candidate": "Le robot ne l'ouvre pas.",
    "conflict": false,
    "kind": "ambiguous-reference"
  },
  {
    "id": "F11",
    "prior": "La tortue cache le livre et la carte.",
    "candidate": "La tortue ne la cache pas.",
    "conflict": false,
    "kind": "ambiguous-reference"
  },
  {
    "id": "F12",
    "prior": "Le robot a une clé.",
    "candidate": "Plus tard, le robot n'a aucune clé.",
    "conflict": false,
    "kind": "temporal"
  },
  {
    "id": "F13",
    "prior": "La gardienne ne possède aucun livre.",
    "candidate": "Finalement la gardienne possède un livre.",
    "conflict": false,
    "kind": "temporal"
  },
  {
    "id": "F14",
    "prior": "Le capitaine n'a jamais ouvert la porte.",
    "candidate": "Le capitaine ouvrira la porte demain.",
    "conflict": false,
    "kind": "temporal"
  },
  {
    "id": "F15",
    "prior": "Le pirate n'a jamais ouvert le coffre.",
    "candidate": "Le pirate pourrait ouvrir le coffre demain.",
    "conflict": false,
    "kind": "modal"
  },
  {
    "id": "F16",
    "prior": "Le pirate n'a jamais ouvert le coffre.",
    "candidate": "Le pirate a ouvert le coffre dans un rêve.",
    "conflict": false,
    "kind": "fiction-within-fiction"
  },
  {
    "id": "F17",
    "prior": "Le robot dit qu'il ne possède aucun livre.",
    "candidate": "Le robot possède un livre.",
    "conflict": false,
    "kind": "reported"
  },
  {
    "id": "F18",
    "prior": "Selon la gardienne, le coffre est vide.",
    "candidate": "Le coffre est plein.",
    "conflict": false,
    "kind": "reported"
  },
  {
    "id": "F19",
    "prior": "Le pirate possède une clé.",
    "candidate": "Dans ce roman, le pirate n'a aucune clé.",
    "conflict": false,
    "kind": "reported"
  },
  {
    "id": "F20",
    "prior": "Le robot ouvre la porte.",
    "candidate": "Le robot ne l'ouvre pas ensuite.",
    "conflict": false,
    "kind": "temporal"
  },
  {
    "id": "F21",
    "prior": "La tortue cache la carte.",
    "candidate": "Elle ne la cache pas.",
    "conflict": false,
    "kind": "pronoun-actor-ambiguous"
  },
  {
    "id": "F22",
    "prior": "Le robot possède une carte.",
    "candidate": "Le robot ne possède aucune carte rouge.",
    "conflict": false,
    "kind": "qualified-object"
  },
  {
    "id": "F23",
    "prior": "Le dragon a une clé.",
    "candidate": "Le dragon n'a aucune clé en or.",
    "conflict": false,
    "kind": "qualified-object"
  },
  {
    "id": "F24",
    "prior": "Le pirate possède un coffre.",
    "candidate": "Le pirate possède deux coffres.",
    "conflict": false,
    "kind": "quantity-possible"
  },
  {
    "id": "F25",
    "prior": "La gardienne n'a aucun livre.",
    "candidate": "La gardienne possède une carte.",
    "conflict": false,
    "kind": "object-different"
  },
  {
    "id": "F26",
    "prior": "Le robot n'a aucun livre.",
    "candidate": "Le robot regarde un livre.",
    "conflict": false,
    "kind": "ownership-vs-contact"
  },
  {
    "id": "F27",
    "prior": "La tortue n'a aucun coffre.",
    "candidate": "La tortue ouvre un coffre.",
    "conflict": false,
    "kind": "ownership-vs-access"
  },
  {
    "id": "F28",
    "prior": "La gardienne n'a jamais fermé la porte.",
    "candidate": "La gardienne ferme la porte maintenant.",
    "conflict": false,
    "kind": "temporal"
  },
  {
    "id": "F29",
    "prior": "Le pirate a un coffre.",
    "candidate": "Le pirate n'a plus de coffre.",
    "conflict": false,
    "kind": "change-event"
  },
  {
    "id": "F30",
    "prior": "Le robot ouvre la porte.",
    "candidate": "Le robot ne la regarde pas.",
    "conflict": false,
    "kind": "predicate-different"
  },
  {
    "id": "F31",
    "prior": "Le robot a un livre.",
    "candidate": "Le robot demande si le livre existe.",
    "conflict": false,
    "kind": "question"
  },
  {
    "id": "F32",
    "prior": "Le pirate n'a jamais ouvert la porte.",
    "candidate": "Le pirate affirme avoir ouvert la porte hier.",
    "conflict": false,
    "kind": "reported"
  }
];
