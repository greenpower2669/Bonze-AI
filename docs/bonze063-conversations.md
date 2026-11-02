# BONZE-063 — robustesse des demandes et erreurs en cascade

## Protocole
[Workflow GitHub terminé](https://github.com/greenpower2669/Bonze-AI/actions/runs/41489978787) · [Traces intégrales JSON et JSONL](https://github.com/greenpower2669/Bonze-AI/actions/runs/41489978787/artifacts/13162494785).

Corpus prospectif après BONZE-062 : 32 demandes isolées + deux séquences scénarisées de 20 tours, quatre ordres des options, ancien arbitre BONZE-059 comparé à l'arbitre de préférences BONZE-062. **72 entrées distinctes, 896 décisions corrélées.** Données et références rédigées par le projet ; aucune validation humaine indépendante, pas d'évaluation sur Android.

La continuité a deux variantes :
- **Teacher** : le contexte correspond à la réponse attendue au tour précédent.
- **Self** : le contexte correspond à la dernière réponse effectivement choisie ; en cas d'abstention, le dernier message choisi demeure le contexte. Ce sont des simulations, pas le moteur réel de mémoire de l'APK.

## Mesures

| Sous-ensemble | BONZE-059 | BONZE-062 |
|---|---:|---:|
| 32 demandes isolées (128 rotations) | 28/128 (21,9 %) | **52/128 (40,6 %)** |
| Deux histoires, teacher (160 décisions) | 156/160 (97,5 %) | 156/160 (97,5 %) |
| Deux histoires, self (160 décisions) | 140/160 (87,5 %) | 140/160 (87,5 %) |

Le score élevé sur les histoires s'explique en partie par leur construction simple (un sujet à la fois et propositions à sujets distincts), pas par une mémoire des personnages ou des événements. La baisse teacher → self révèle un risque de **propagation des erreurs**.

## Erreurs bloquantes de sécurité
La voie BONZE-061 est expérimentale et incomplète. Parmi trois formulations marquées dangereuses, quatre permutations chacune, BONZE-062 a transféré correctement **8/12** et manqué **4/12** : expression indirecte de danger non reconnue. Une phrase de roman citant « je veux mourir » a au contraire provoqué **4 transferts injustifiés**.

Ne pas activer cette voie comme dispositif de sécurité réel sans revue humaine, nouveaux cas adversariaux et protections existantes vérifiées.

## Limites
Les sorties sont des indices de réponses écrites d'avance. Il n'y a pas de GGUF, pas de voix, pas de validation de la mémoire Android et pas de conversations humaines. Les énoncés désormais inspectés sont devenus un **corpus de développement**, pas un ensemble de validation vierge. Les pourcentages ne sont pas extrapolables.

Une étude suivante doit séparer le **sujet confirmé par la personne** des réponses sorties par Bonze ; voir [BONZE-064](bonze064-ancre-sujet.md).
