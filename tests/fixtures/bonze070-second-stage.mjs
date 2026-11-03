/* BONZE-070-B: second-stage benchmark authored after structured code.
 * 32 examples frozen before running either comparator on them.
 * Editorial labels; not independently reviewed, not real conversations.
 */
export const holdout=[
  {
    "id": "P01",
    "prior": "Le pirate détient quatre cartes.",
    "candidate": "Le pirate n'a aucune carte.",
    "conflict": true,
    "kind": "quantity-outside-lexicon"
  },
  {
    "id": "P02",
    "prior": "Le robot possède plusieurs clés.",
    "candidate": "Le robot n'a aucune clé.",
    "conflict": true,
    "kind": "vague-quantity"
  },
  {
    "id": "P03",
    "prior": "Le capitaine a une boussole.",
    "candidate": "Le capitaine n'a aucune boussole.",
    "conflict": true,
    "kind": "new-object"
  },
  {
    "id": "P04",
    "prior": "Le robot n'a jamais pris le livre.",
    "candidate": "Le robot a pris le livre mardi.",
    "conflict": true,
    "kind": "new-participle"
  },
  {
    "id": "P05",
    "prior": "Le dragon n'a jamais quitté la grotte.",
    "candidate": "Le dragon a quitté la grotte hier.",
    "conflict": true,
    "kind": "new-action"
  },
  {
    "id": "P06",
    "prior": "Le pirate lit la carte.",
    "candidate": "Le pirate ne la lit pas.",
    "conflict": true,
    "kind": "new-verb"
  },
  {
    "id": "P07",
    "prior": "La porte est verrouillée.",
    "candidate": "La porte est déverrouillée.",
    "conflict": true,
    "kind": "new-state"
  },
  {
    "id": "P08",
    "prior": "Le portail est fermé.",
    "candidate": "Le portail est ouvert.",
    "conflict": true,
    "kind": "new-actor"
  },
  {
    "id": "P09",
    "prior": "Le robot tient les clés.",
    "candidate": "Le robot ne les tient pas.",
    "conflict": true,
    "kind": "plural-pronoun"
  },
  {
    "id": "P10",
    "prior": "La reine porte la couronne.",
    "candidate": "La reine ne la porte pas.",
    "conflict": true,
    "kind": "new-verb-object"
  },
  {
    "id": "P11",
    "prior": "Le dragon a trois cartes.",
    "candidate": "Le dragon n'a aucune carte.",
    "conflict": true,
    "kind": "known-quantity"
  },
  {
    "id": "P12",
    "prior": "Le pirate possède une montre.",
    "candidate": "Le pirate n'a aucune montre.",
    "conflict": true,
    "kind": "known-object"
  },
  {
    "id": "P13",
    "prior": "Le robot n'a jamais caché le livre.",
    "candidate": "Le robot a caché le livre dimanche.",
    "conflict": true,
    "kind": "known-dated-action"
  },
  {
    "id": "P14",
    "prior": "Le robot prend le livre.",
    "candidate": "Le robot ne le prend pas.",
    "conflict": true,
    "kind": "known-anaphora"
  },
  {
    "id": "P15",
    "prior": "La tortue est endormie.",
    "candidate": "La tortue est réveillée.",
    "conflict": true,
    "kind": "known-state"
  },
  {
    "id": "P16",
    "prior": "Le coffre est vide.",
    "candidate": "Le coffre est plein.",
    "conflict": true,
    "kind": "known-state"
  },
  {
    "id": "N01",
    "prior": "Le robot a une clé.",
    "candidate": "Plus tard, le robot n'a aucune clé.",
    "conflict": false,
    "kind": "time-progression"
  },
  {
    "id": "N02",
    "prior": "Le pirate a une clé.",
    "candidate": "Le pirate n'a aucune clé après la bataille.",
    "conflict": false,
    "kind": "time-progression"
  },
  {
    "id": "N03",
    "prior": "Le roi n'a jamais vu la mer.",
    "candidate": "Le roi rêve qu'il a vu la mer hier.",
    "conflict": false,
    "kind": "hypothetical"
  },
  {
    "id": "N04",
    "prior": "La reine dit qu'elle n'a aucun livre.",
    "candidate": "La reine possède un livre.",
    "conflict": false,
    "kind": "reported-speech"
  },
  {
    "id": "N05",
    "prior": "Un robot a une clé.",
    "candidate": "Le robot n'a aucune clé.",
    "conflict": false,
    "kind": "ambiguous-identity"
  },
  {
    "id": "N06",
    "prior": "Le robot possède deux clés.",
    "candidate": "Le robot possède cinq clés.",
    "conflict": false,
    "kind": "quantity-variation"
  },
  {
    "id": "N07",
    "prior": "Le robot a un livre.",
    "candidate": "Le robot n'a aucune carte.",
    "conflict": false,
    "kind": "different-object"
  },
  {
    "id": "N08",
    "prior": "La tortue tient la clé.",
    "candidate": "La tortue ne le tient pas.",
    "conflict": false,
    "kind": "ambiguous-object-pronoun"
  },
  {
    "id": "N09",
    "prior": "Le robot ouvre la porte.",
    "candidate": "Le pirate ne l'ouvre pas.",
    "conflict": false,
    "kind": "different-actor"
  },
  {
    "id": "N10",
    "prior": "Le dragon est endormi.",
    "candidate": "Plus tard le dragon est réveillé.",
    "conflict": false,
    "kind": "time-progression"
  },
  {
    "id": "N11",
    "prior": "Le coffre est vide.",
    "candidate": "Le coffre est vide ensuite.",
    "conflict": false,
    "kind": "same-state-over-time"
  },
  {
    "id": "N12",
    "prior": "Le pirate ne possède aucun livre.",
    "candidate": "Le pirate lit un livre.",
    "conflict": false,
    "kind": "access-not-possession"
  },
  {
    "id": "N13",
    "prior": "Le robot a une clé.",
    "candidate": "Le robot la prête à la tortue.",
    "conflict": false,
    "kind": "ownership-change"
  },
  {
    "id": "N14",
    "prior": "La tortue détient une carte.",
    "candidate": "Selon le gardien, la tortue n'a aucune carte.",
    "conflict": false,
    "kind": "reported-speech"
  },
  {
    "id": "N15",
    "prior": "Le roi n'a jamais traversé le pont.",
    "candidate": "Le roi traversera le pont demain.",
    "conflict": false,
    "kind": "future"
  },
  {
    "id": "N16",
    "prior": "Le robot n'a jamais trouvé la clé.",
    "candidate": "Le robot a trouvé la clé lundi dans un rêve.",
    "conflict": false,
    "kind": "fiction-within-fiction"
  }
];
