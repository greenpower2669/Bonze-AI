# BONZE-059 — classement de réponses sans génération neuronale

## Objectif
Évaluer un arbitre qui classe **des propositions déjà écrites**, sans charger Liquid, sans renvoyer de génération libre et sans dépendre d'Android. La fonction `BonzeNonNeuralArbiter.rank` (dans `core/non-neural-arbiter.js`) normalise les termes, applique un petit dictionnaire d'équivalences françaises et quelques règles de contexte/sûreté. Elle fournit un indice ou **-1 (abstention)** lorsqu'elle ne peut départager les candidats. Elle est uniquement **expérimentale** ; elle n'est pas intégrée à l'application utilisateur.

## Protocole
- 22 familles imaginées dans le projet, chacune avec quatre formulations françaises, et 11 situations historiques du benchmark Liquid : **99 demandes distinctes**. Aucun renseignement utilisateur réel.
- Quatre positions pour chaque jeu de quatre phrases : **396 décisions corrélées**. Une réponse 0 permanente obtient une référence théorique de 25 % si les positions sont équilibrées.
- Les références, les phrases candidates et le dictionnaire sont **créés dans le même projet** ; ce n'est pas un test aveugle, le risque de surajustement est élevé. Les 99 demandes ne couvrent pas tout le français.
- `scripts/bench-non-neural.mjs` enregistre scores, index, contexte de catégorie, abstentions et raisons dans les fichiers JSON et JSONL. `tests/bonze059.test.mjs` vérifie les tailles, les rotations, l'abstention, l'urgence et le rapport.

## Résultat réel
[GitHub Actions : exécution réussie](https://github.com/greenpower2669/Bonze-AI/actions/runs/41361579786) · [Artefact brut JSON/JSONL et rapport](https://github.com/greenpower2669/Bonze-AI/actions/runs/41361579786/artifacts/13105716755).

| Mesure | Résultat |
|---|---:|
| Demandes distinctes | 99 |
| Décisions avec permutations | 396 |
| Choix attendus | **368 / 396 (92,9 %)** |
| Abstentions | **20 / 396 (5,1 %)** |
| Mauvais indices effectivement sélectionnés | **8 / 396 (2,0 %)** |
| Décisions correctes parmi réponses émises | 368 / 376 (97,9 %) |
| Cas historiques BONZE-057 (connus du projet) | 44 / 44 |
| Temps de traitement du lot sur runner Linux | 47,1 ms — non comparable aux latences GGUF |

Les **28 décisions non correctes** se regroupent en 7 demandes : 1 cas peur (4 abstentions), 1 humour (4 abstentions), 3 négations (12 abstentions) et 2 questions de définition (8 mauvais choix). L'échec des définitions est particulièrement utile : reconnaître le mot « colère » ne signifie pas comprendre qu'on demande son **sens** plutôt qu'une réaction émotionnelle.

## Ce qu'il serait incorrect de conclure
Le 92,9 % démontre qu'un moteur local très léger peut satisfaire **le jeu de cas explicitement conçu pour lui**. Il **ne prouve pas** 92,9 % de compréhension générale ou de sécurité en dialogue. Les 396 rotations ne représentent pas 396 conversations indépendantes. Les benchmarks Liquid BONZE-058 ont mesuré 25 % (230M) et 36,4 % (1,2B) sur des prompts d'indices, mais les deux méthodes n'ont pas été jugées avec la même validation aveugle.

La latence de 47,1 ms mesure **toutes les décisions du lot** sur un runner GitHub et ne garantit aucune latence mobile. Aucune charge modèle ni voix n'est mesurée ici.

## Prochaine étape
Concevoir un **nouveau** jeu d'évaluation annoté à l'aveugle avec phrases naturelles, sujets inconnus, négation, sens des mots, suites d'histoires, émotions et refus d'hallucination. Fixer les règles de l'arbitre **avant** l'évaluation. Comparer aux modèles neuronaux sur le **même jeu**, avec analyse de la pertinence, des erreurs, des abstentions, du coût CPU/RAM et de la confidentialité. Ne toucher à l'APK ou au `main` qu'après validation de Fab.
