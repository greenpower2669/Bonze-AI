# BONZE-065 — verdict sur la mémoire de sujet et l'analyse de sécurité

## Un nouveau défi pour l'architecture

Le [workflow BONZE-065](https://github.com/greenpower2669/Bonze-AI/actions/runs/41494784678) a été exécuté avec succès ; les [résultats bruts](https://github.com/greenpower2669/Bonze-AI/actions/runs/41494784678/artifacts/13166236398) sont conservés en JSON et JSONL. Le code des moteurs BONZE-061, BONZE-062 et BONZE-064 n'a **pas** été modifié pendant le test.

Le banc contient trois nouvelles histoires scénarisées de 20 tours, chacune répétée dans quatre ordres d'options. Trois types de contexte sont évalués : réponse attendue au tour précédent, dernière réponse choisie et ancre symbolique du sujet. **720 décisions dépendantes**, pas 720 conversations différentes. Les étiquettes ont été préparées par le projet lui-même, sans annotation indépendante.

| Mode d'essai | Choix exacts | Pourcentage | Abstentions | Choix d'indices incorrects |
|---|---:|---:|---:|---:|
| Préférence avec contexte idéal | **124/240** | 51,7 % | 108 | 8 |
| Préférence avec réponse effectivement choisie | **140/240** | 58,3 % | 92 | 8 |
| Sujet symbolique BONZE-064 seul | **112/240** | 46,7 % | 120 | 8 |

**Résultat remarquable :** BONZE-064 suit correctement **220/240 étiquettes de sujet**, alors qu'il ne choisit la suite exacte que dans **112/240** cas. Notre ancre ne sait pas à elle seule quelle clé a été découverte, quelle porte est fermée, ni ce qu'a dit un personnage. Les distracteurs de même thème mettent ce manque à nu.

Vingt erreurs de sujet proviennent d'un unique pivot : « Reprenons l'histoire de notre dragon » n'est pas reconnu par le parseur. Il ne faut pas lui attribuer les 108 autres écarts : ceux-ci sont pour l'essentiel des insuffisances de contexte d'événements ou d'évaluation de candidats. Aucun scénario complet 20/20 n'est réussi dans ce banc.

Le résultat contre-intuitif « contexte réel supérieur au contexte idéal » tient aux phrases et aux scores de ce banc ; il ne démontre pas qu'un contexte erroné aide la compréhension en général.

## Un diagnostic de sécurité distinct

Sur 30 formulations françaises, sept sont marquées « **needs-review** » plutôt que vérité binaire, car leur sens ou la conduite à tenir exige une appréciation humaine. Parmi les 23 autres labels **provisoires** :

| Classe déclarée | Correspondances |
|---|---:|
| Danger immédiat explicite | 5/5 |
| Soutien émotionnel | 7/8 |
| Texte non urgent ou citation | 8/10 |
| **Ensemble** | **20/23** |

Le filtre manque une expression familière de tristesse. Il déclenche deux faux transferts urgents sur du **discours cité dans une histoire**. Six des sept formulations ambiguës ont reçu `none`, une `supportive` : `none` signifie **aucun motif lexical reconnu**, pas « sans danger ».

Ce module n'est pas fiable comme dispositif de détection de risque clinique ou d'urgence ; il n'est pas intégré à Android. Revue humaine des cas risqués et tests indépendants obligatoires avant toute éventuelle mise en service.

## Suite architecturale

L'hypothèse BONZE-066 serait de gérer deux canaux indépendants :

1. Un **sujet explicite**, modifiable seulement par une directive utilisateur claire, non écrasé par une réponse hors sujet.
2. Un **événement de scène provisoire**, enregistré uniquement après qu'une phrase de Bonze a réellement été prononcée/affichée, pour aider à répondre au tour suivant ; ne jamais le traiter comme un souvenir sur la personne ou un fait du monde.

Le code de ce second canal **n'est pas encore disponible** : la tentative de création de module a été bloquée par les contrôles de l'outil. Aucune mesure BONZE-066, aucune nouvelle APK ou Release. Objectifs conservés dans `todo.md`.

Les tests futurs devront être conçus par des évaluateurs indépendants ou obtenus de dialogues consentis, avant toute adaptation et publication de statistiques de généralisation.
