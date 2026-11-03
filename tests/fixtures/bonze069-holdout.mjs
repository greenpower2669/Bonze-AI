/* BONZE-069-B: second-stage untuned challenge created after the 49-case
 * correction. Editorial judgments, NOT independent human validation.
 * A false label means no contradiction demonstrable by the stated clauses.
 * Freeze this fixture and do not tune narrative logic to its failures.
 */
export const challenges=[
  {
    "id": "Z01",
    "prior": "Le gardien n'a aucune clé.",
    "candidate": "Le gardien a deux clés.",
    "conflict": true,
    "kind": "plural-quantity"
  },
  {
    "id": "Z02",
    "prior": "Le robot n'a aucun livre.",
    "candidate": "Le robot possède trois livres.",
    "conflict": true,
    "kind": "plural-quantity"
  },
  {
    "id": "Z03",
    "prior": "La tortue n'a aucune carte.",
    "candidate": "La tortue détient une carte.",
    "conflict": true,
    "kind": "possession-synonym"
  },
  {
    "id": "Z04",
    "prior": "Le capitaine n'a jamais vu la mer.",
    "candidate": "Le capitaine a vu la mer hier.",
    "conflict": true,
    "kind": "never-new-verb"
  },
  {
    "id": "Z05",
    "prior": "Le roi n'a jamais traversé le pont.",
    "candidate": "Le roi a traversé le pont lundi.",
    "conflict": true,
    "kind": "never-new-verb"
  },
  {
    "id": "Z06",
    "prior": "Le robot possède une clef.",
    "candidate": "Le robot n'a aucune clef.",
    "conflict": true,
    "kind": "quantifier-known-shape"
  },
  {
    "id": "Z07",
    "prior": "Le pirate est absent.",
    "candidate": "Le pirate est présent.",
    "conflict": true,
    "kind": "state-known-shape"
  },
  {
    "id": "Z08",
    "prior": "Le coffre est vide.",
    "candidate": "Le coffre est rempli.",
    "conflict": true,
    "kind": "state-synonym"
  },
  {
    "id": "Z09",
    "prior": "Le robot tient la clé.",
    "candidate": "Le robot ne la tient pas.",
    "conflict": true,
    "kind": "anaphora-new-verb"
  },
  {
    "id": "Z10",
    "prior": "La tortue prend le livre.",
    "candidate": "La tortue ne le prend pas.",
    "conflict": true,
    "kind": "anaphora-new-verb"
  },
  {
    "id": "Z11",
    "prior": "Le pilote ouvre le coffre.",
    "candidate": "Le pilote ne l'ouvre pas.",
    "conflict": true,
    "kind": "anaphora-known-shape"
  },
  {
    "id": "Z12",
    "prior": "La gardienne possède une montre.",
    "candidate": "La gardienne n'a aucune montre.",
    "conflict": true,
    "kind": "quantifier-known-shape"
  },
  {
    "id": "Z13",
    "prior": "Le robot n'a jamais trouvé la valise.",
    "candidate": "Le robot a trouvé la valise dimanche.",
    "conflict": true,
    "kind": "never-known-shape"
  },
  {
    "id": "Z14",
    "prior": "Le dragon est endormi.",
    "candidate": "Le dragon est réveillé.",
    "conflict": true,
    "kind": "state-known-shape"
  },
  {
    "id": "Z15",
    "prior": "Le coffret est fermé.",
    "candidate": "Le coffret est ouvert.",
    "conflict": true,
    "kind": "state-known-shape"
  },
  {
    "id": "Z16",
    "prior": "Le robot ne possède aucune clé.",
    "candidate": "Le robot a une clé.",
    "conflict": true,
    "kind": "quantifier-known-shape"
  },
  {
    "id": "N01",
    "prior": "Un robot possède une clé.",
    "candidate": "Le robot n'a aucune clé.",
    "conflict": false,
    "kind": "unresolved-actor"
  },
  {
    "id": "N02",
    "prior": "Le robot ne possède aucun livre.",
    "candidate": "Le robot consulte un livre.",
    "conflict": false,
    "kind": "use-not-ownership"
  },
  {
    "id": "N03",
    "prior": "Le robot possède une clé.",
    "candidate": "Le robot n'a aucune clé rouge.",
    "conflict": false,
    "kind": "qualified-object"
  },
  {
    "id": "N04",
    "prior": "Le capitaine n'a jamais ouvert la porte.",
    "candidate": "Le capitaine ouvrira la porte demain.",
    "conflict": false,
    "kind": "future"
  },
  {
    "id": "N05",
    "prior": "Le pirate n'a jamais ouvert le coffre.",
    "candidate": "Le pirate dit qu'il l'a ouvert hier.",
    "conflict": false,
    "kind": "reported-speech"
  },
  {
    "id": "N06",
    "prior": "Le dragon est mort.",
    "candidate": "Maintenant le dragon est vivant.",
    "conflict": false,
    "kind": "time-progression"
  },
  {
    "id": "N07",
    "prior": "La porte est ouverte.",
    "candidate": "La porte est fermée ensuite.",
    "conflict": false,
    "kind": "time-progression"
  },
  {
    "id": "N08",
    "prior": "Le coffre était vide.",
    "candidate": "Le coffre est plein.",
    "conflict": false,
    "kind": "time-progression"
  },
  {
    "id": "N09",
    "prior": "Le robot ouvre le coffre.",
    "candidate": "Le robot ne le ferme pas.",
    "conflict": false,
    "kind": "different-action"
  },
  {
    "id": "N10",
    "prior": "Le robot ouvre la porte.",
    "candidate": "Elle ne l'ouvre pas.",
    "conflict": false,
    "kind": "unresolved-actor"
  },
  {
    "id": "N11",
    "prior": "Le pirate cache la carte et la clé.",
    "candidate": "Le pirate ne la cache pas.",
    "conflict": false,
    "kind": "multiple-objects"
  },
  {
    "id": "N12",
    "prior": "Le roi possède une carte.",
    "candidate": "Le roi ne possède aucun livre.",
    "conflict": false,
    "kind": "different-objects"
  },
  {
    "id": "N13",
    "prior": "Le pirate possède deux cartes.",
    "candidate": "Le pirate possède une carte.",
    "conflict": false,
    "kind": "subset-quantity"
  },
  {
    "id": "N14",
    "prior": "Le robot a un livre.",
    "candidate": "Le robot ne possède plus de livre.",
    "conflict": false,
    "kind": "time-change"
  },
  {
    "id": "N15",
    "prior": "Le robot ferme la porte.",
    "candidate": "Le robot l'ouvre.",
    "conflict": false,
    "kind": "opposing-actions-not-simultaneous"
  },
  {
    "id": "N16",
    "prior": "La reine affirme n'avoir aucune clé.",
    "candidate": "La reine possède une clé.",
    "conflict": false,
    "kind": "reported-speech"
  }
];
