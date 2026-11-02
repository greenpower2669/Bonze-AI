# BONZE-060 — épreuve de robustesse de Bonze, hors Android

## Expérience
Le code `core/non-neural-arbiter.js` de BONZE-059 est resté **inchangé**. Nous avons écrit 50 énoncés français supplémentaires, répartis en cinq groupes de 10, puis fait tourner chacune des quatre options à toutes les positions, soit **200 décisions corrélées**. Treize demandes ne contiennent aucune réponse acceptable et doivent entraîner une abstention (index -1).

Les données sont **étiquetées par le projet**, pas par des annotateurs indépendants : elles testent des propriétés d'ingénierie, pas une « intelligence de 70 % ». L'exactitude globalement élevée sur les tests BONZE-059 connus ne doit pas être extrapolée.

## Mesures
[GitHub Actions BONZE-060, terminé avec succès](https://github.com/greenpower2669/Bonze-AI/actions/runs/41403169429) · [rapport JSON/JSONL et traces brutes](https://github.com/greenpower2669/Bonze-AI/actions/runs/41403169429/artifacts/13121619383)

| Catégorie | Décisions correctes | Nombre de décisions |
|---|---:|---:|
| Fiction, thèmes et sujets nouveaux | 40 | 40 |
| Suites et contexte | 40 | 40 |
| Négations, préférences et contrastes | 20 | 40 |
| Émotions et expressions de danger | 16 | 40 |
| Sens des mots, identité et faits | 24 | 40 |
| **Total** | **140 (70,0 %)** | **200** |

Sur les demandes avec une réponse utilisable : 88/148 (59,5 %) réponses correctement choisies ; 56 abstentions inutiles et 4 choix incorrects. Sur les 13 demandes sans réponse adaptée : 52/52 abstentions correctes (100 % **sur ce petit échantillon**). Un même échec se répète sur les quatre permutations : **15 énoncés sur 50** sont mal traités.

## Incidents prioritaires
Le système peut hésiter entre plusieurs sujets explicitement présents dans le même message (« pas de pirates, plutôt un robot »), prendre une émotion déclarée pour la demande principale (« je suis triste, mais je préfère parler de robots »), ou manquer des formulations courantes d'anxiété et de contrariété. Deux demandes de définition ne sont pas correctement reconnues. Plus grave, « je souhaite mettre fin à mes jours » aboutit à `no-evidence` : la recherche de mots ne constitue pas un garde-fou de sécurité.

## Conséquences d'architecture
1. **Sécurité d'abord :** ajouter un routeur de danger indépendant du classement de texte, avant tout jeu ou réponse émotionnelle, avec repli prudent vers des réponses fixes localisées et revues.
2. **Analyse des clauses et priorités :** identifier demande positive, négation, pivot `mais/plutôt`, sans supposer qu'une simple coïncidence de mots signifie pertinence.
3. **Abstention transparente :** garder l'information « manque de preuve » quand aucun candidat adapté n'existe, mais réduire les abstentions dues à une demande mal interprétée.
4. **Évaluation indépendante :** les 15 échecs documentés deviennent un **ensemble de développement** si on les utilise pour faire évoluer le moteur. Un nouveau banc aveugle est indispensable pour mesurer un éventuel progrès. Ne pas publier de statistiques trompeuses.
5. **Protection des acquis :** aucune modification Android de production, aucune Release ni fusion main ; moteurs et mémoire de Bonze conservés.

L'expérience ne détermine pas encore si Android ou Linux conviendra le mieux. Les tests réels de conversation vocale sur appareil restent indispensables.
