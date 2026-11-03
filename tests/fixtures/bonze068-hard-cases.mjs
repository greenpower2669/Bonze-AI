/* BONZE-068 advanced adversarial diagnostics, assistant-authored.
 * Frozen BEFORE running the existing BONZE-067 detector on these cases.
 * Labels reflect a single-event reading where applicable; ambiguous entity
 * references receive false (no proven contradiction), not certified truth.
 */
export const hardCases=[
  {
    "id": "h01",
    "prior": "La porte est restée ouverte.",
    "next": "La porte est restée fermée.",
    "expected": true
  },
  {
    "id": "h02",
    "prior": "Le robot possède la clé.",
    "next": "Le robot n'a aucune clé.",
    "expected": true
  },
  {
    "id": "h03",
    "prior": "Le dragon est vivant.",
    "next": "Le dragon est mort.",
    "expected": true
  },
  {
    "id": "h04",
    "prior": "Le pirate n'a jamais ouvert le coffre.",
    "next": "Le pirate a ouvert le coffre hier.",
    "expected": true
  },
  {
    "id": "h05",
    "prior": "Le robot ne possède aucun livre.",
    "next": "Le robot possède un livre.",
    "expected": true
  },
  {
    "id": "h06",
    "prior": "La porte est verrouillée.",
    "next": "La porte n'est pas verrouillée.",
    "expected": true
  },
  {
    "id": "h07",
    "prior": "Le robot est présent.",
    "next": "Le robot est absent.",
    "expected": true
  },
  {
    "id": "h08",
    "prior": "Le robot est endormi.",
    "next": "Le robot est bien réveillé.",
    "expected": true
  },
  {
    "id": "h09",
    "prior": "Le coffre est vide.",
    "next": "Le coffre est plein.",
    "expected": true
  },
  {
    "id": "h10",
    "prior": "Le robot ouvre le coffre.",
    "next": "Le robot ne l'ouvre pas.",
    "expected": true
  },
  {
    "id": "h11",
    "prior": "Le pirate ouvre la porte.",
    "next": "La pirate n'ouvre pas la porte.",
    "expected": false
  },
  {
    "id": "h12",
    "prior": "Un robot garde une clé.",
    "next": "Le robot ne garde pas une clé.",
    "expected": false
  },
  {
    "id": "h13",
    "prior": "La tortue rencontre le dragon.",
    "next": "Une tortue ne rencontre pas le dragon.",
    "expected": false
  },
  {
    "id": "h14",
    "prior": "La porte était fermée.",
    "next": "La porte est ouverte.",
    "expected": false
  },
  {
    "id": "h15",
    "prior": "Le robot regarde la lune.",
    "next": "Le robot ne voit pas la lune.",
    "expected": false
  },
  {
    "id": "h16",
    "prior": "La porte est ouverte.",
    "next": "Selon la gardienne, la porte est fermée.",
    "expected": false
  },
  {
    "id": "h17",
    "prior": "Le robot tient la clé.",
    "next": "Le robot la laisse tomber.",
    "expected": false
  },
  {
    "id": "h18",
    "prior": "Le pirate possède un coffre.",
    "next": "Le pirate le donne à son ami.",
    "expected": false
  },
  {
    "id": "h19",
    "prior": "Le coffre est vide.",
    "next": "Le coffre est presque vide.",
    "expected": false
  },
  {
    "id": "h20",
    "prior": "La porte est ouverte.",
    "next": "Le lendemain, la porte est fermée.",
    "expected": false
  }
];
