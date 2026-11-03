/* BONZE-070: prospective developer-labelled fictional pairs.
 * Created after BONZE-069 and BEFORE structured scene fact parser.
 * True means directly contradictory on same event/actor; false is
 * only NO CONFLICT PROVEN. Requires independent human review in future.
 */
export const cases=[
  {
    "id": "C01",
    "prior": "Le robot possède deux clés.",
    "candidate": "Le robot n'a aucune clé.",
    "conflict": true,
    "kind": "possession-quantity"
  },
  {
    "id": "C02",
    "prior": "Le gardien n'a aucune clé.",
    "candidate": "Le gardien a trois clés.",
    "conflict": true,
    "kind": "possession-quantity"
  },
  {
    "id": "C03",
    "prior": "La tortue détient une carte.",
    "candidate": "La tortue ne possède aucune carte.",
    "conflict": true,
    "kind": "possession-synonym"
  },
  {
    "id": "C04",
    "prior": "Le pirate ne possède aucun coffre.",
    "candidate": "Le pirate possède deux coffres.",
    "conflict": true,
    "kind": "possession-quantity"
  },
  {
    "id": "C05",
    "prior": "Le robot a un livre.",
    "candidate": "Le robot n'a aucun livre.",
    "conflict": true,
    "kind": "possession-quantity"
  },
  {
    "id": "C06",
    "prior": "Le dragon a deux cartes.",
    "candidate": "Le dragon ne possède aucune carte.",
    "conflict": true,
    "kind": "possession-quantity"
  },
  {
    "id": "C07",
    "prior": "Le robot possède une clef.",
    "candidate": "Le robot n'a aucune clé.",
    "conflict": true,
    "kind": "object-alias"
  },
  {
    "id": "C08",
    "prior": "Le roi n'a jamais traversé le pont.",
    "candidate": "Le roi a traversé le pont lundi.",
    "conflict": true,
    "kind": "never-past"
  },
  {
    "id": "C09",
    "prior": "Le capitaine n'a jamais vu la mer.",
    "candidate": "Le capitaine a vu la mer hier.",
    "conflict": true,
    "kind": "never-past"
  },
  {
    "id": "C10",
    "prior": "La gardienne n'a jamais trouvé la clé.",
    "candidate": "La gardienne a trouvé la clé mardi.",
    "conflict": true,
    "kind": "never-past"
  },
  {
    "id": "C11",
    "prior": "Le robot prend le livre.",
    "candidate": "Le robot ne le prend pas.",
    "conflict": true,
    "kind": "object-pronoun"
  },
  {
    "id": "C12",
    "prior": "La tortue tient la clé.",
    "candidate": "La tortue ne la tient pas.",
    "conflict": true,
    "kind": "object-pronoun"
  },
  {
    "id": "C13",
    "prior": "Le dragon ouvre le coffre.",
    "candidate": "Le dragon ne l'ouvre pas.",
    "conflict": true,
    "kind": "object-pronoun"
  },
  {
    "id": "C14",
    "prior": "Le robot est endormi.",
    "candidate": "Le robot est réveillé.",
    "conflict": true,
    "kind": "state-opposition"
  },
  {
    "id": "C15",
    "prior": "Le coffre est vide.",
    "candidate": "Le coffre est rempli.",
    "conflict": true,
    "kind": "state-opposition"
  },
  {
    "id": "C16",
    "prior": "Le roi voit le pont.",
    "candidate": "Le roi ne voit pas le pont.",
    "conflict": true,
    "kind": "action-negation"
  },
  {
    "id": "C17",
    "prior": "Le dragon traverse la forêt.",
    "candidate": "Le dragon ne la traverse pas.",
    "conflict": true,
    "kind": "object-pronoun"
  },
  {
    "id": "N01",
    "prior": "Le robot a deux livres.",
    "candidate": "Le robot a un livre.",
    "conflict": false,
    "kind": "quantity-lower-bound"
  },
  {
    "id": "N02",
    "prior": "Le robot a une clé.",
    "candidate": "Plus tard le robot n'a aucune clé.",
    "conflict": false,
    "kind": "temporal-change"
  },
  {
    "id": "N03",
    "prior": "La tortue n'a aucune carte.",
    "candidate": "Finalement la tortue trouve une carte.",
    "conflict": false,
    "kind": "temporal-change"
  },
  {
    "id": "N04",
    "prior": "Le roi n'a jamais traversé le pont.",
    "candidate": "Le roi traversera le pont demain.",
    "conflict": false,
    "kind": "future-versus-never"
  },
  {
    "id": "N05",
    "prior": "Le robot a une clé.",
    "candidate": "Le robot n'a aucune clé rouge.",
    "conflict": false,
    "kind": "qualified-object"
  },
  {
    "id": "N06",
    "prior": "Un robot possède une clé.",
    "candidate": "Le robot n'a aucune clé.",
    "conflict": false,
    "kind": "indefinite-actor"
  },
  {
    "id": "N07",
    "prior": "Le robot a une clé.",
    "candidate": "La tortue n'a aucune clé.",
    "conflict": false,
    "kind": "different-actor"
  },
  {
    "id": "N08",
    "prior": "La reine dit qu'elle n'a aucune clé.",
    "candidate": "La reine possède une clé.",
    "conflict": false,
    "kind": "reported-speech"
  },
  {
    "id": "N09",
    "prior": "Le robot ouvre le coffre et la porte.",
    "candidate": "Le robot ne l'ouvre pas.",
    "conflict": false,
    "kind": "ambiguous-pronoun"
  },
  {
    "id": "N10",
    "prior": "Le robot tient la clé.",
    "candidate": "Le robot ne la trouve pas.",
    "conflict": false,
    "kind": "different-action"
  },
  {
    "id": "N11",
    "prior": "Le pirate ouvre le coffre.",
    "candidate": "Le pirate le ferme.",
    "conflict": false,
    "kind": "possible-next-event"
  },
  {
    "id": "N12",
    "prior": "Le robot est endormi.",
    "candidate": "Maintenant le robot est réveillé.",
    "conflict": false,
    "kind": "temporal-change"
  },
  {
    "id": "N13",
    "prior": "Le robot possède deux livres.",
    "candidate": "Le robot consulte un livre.",
    "conflict": false,
    "kind": "ownership-versus-use"
  },
  {
    "id": "N14",
    "prior": "La tortue traverse la forêt.",
    "candidate": "Le pirate ne la traverse pas.",
    "conflict": false,
    "kind": "different-actor"
  },
  {
    "id": "N15",
    "prior": "Le robot l'ouvre.",
    "candidate": "Le robot ne l'ouvre pas.",
    "conflict": false,
    "kind": "pronoun-unanchored"
  },
  {
    "id": "N16",
    "prior": "La tortue possède un coffre.",
    "candidate": "La tortue ne possède aucun livre.",
    "conflict": false,
    "kind": "different-object"
  },
  {
    "id": "N17",
    "prior": "Le gardien n'a aucune clé.",
    "candidate": "Le gardien trouve une clé ensuite.",
    "conflict": false,
    "kind": "temporal-change"
  },
  {
    "id": "N18",
    "prior": "Le coffre est vide.",
    "candidate": "Le coffre est presque vide.",
    "conflict": false,
    "kind": "qualified-state"
  },
  {
    "id": "N19",
    "prior": "Le robot détient deux cartes.",
    "candidate": "Selon le pirate, le robot n'a aucune carte.",
    "conflict": false,
    "kind": "reported-speech"
  },
  {
    "id": "N20",
    "prior": "Le robot a un livre.",
    "candidate": "Le robot n'a plus de livre.",
    "conflict": false,
    "kind": "change-event"
  }
];
