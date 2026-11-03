# BONZE-064 — garder le sujet confirmé sans propager les erreurs

## Concept
Un mauvais choix de phrase ne doit pas devenir une source fiable sur le sujet de la conversation. Le module expérimental `core/topic-anchor.js` conserve un état local minimal : **sujet canonique** parmi un vocabulaire connu et **nombre de tours**. Il met à jour ce sujet sur commande explicite, retour à un thème précédent, début de nouvelle histoire ou clarification nécessaire. Il ne se réécrit **pas** à partir d'une phrase produite par Bonze.

Les entrées « Et après ? », « Continue » et semblables utilisent l'ancre courante, indépendamment de la dernière sortie de l'arbitre. Une demande à risque déclenche la branche de sécurité séparée, qui reste un composant de recherche non certifié. L'état ne conserve aucun message utilisateur, prénom, événement ou relation.

## Protocole et mesures
[CI BONZE-064 réussie](https://github.com/greenpower2669/Bonze-AI/actions/runs/41490598696), où `tests/bonze064.test.mjs` valide les invariants et `scripts/bench-topic-anchor-bonze064.mjs` rejoue les deux histoires de vingt tours déjà utilisées dans BONZE-063.

| Rejeu de 2 × 20 tours, 4 rotations | Bonnes sélections | Séquences 20/20 |
|---|---:|---:|
| BONZE-059, dernier texte choisi comme contexte | 140/160 | 4/8 |
| BONZE-062, dernier texte choisi comme contexte | 140/160 | 4/8 |
| BONZE-062, contexte idéal fourni | 156/160 | 4/8 |
| **Ancre symbolique BONZE-064** | **160/160** | **8/8** |

**Interprétation stricte :** ces mêmes scénarios ont été examinés avant la conception de l'ancre. Le résultat 160/160 prouve uniquement que le mécanisme corrige les dérives observées **sur ce banc de développement**. Il n'y a aucune annotation aveugle ni preuve de généralisation, de réelle compréhension ou de mémoire narrative.

## Ce qui manque
L'ancre n'enregistre ni le dernier événement, ni les relations entre personnages, ni les corrections de faits, ni les intentions composites. Il faudra un contexte structuré et autorisé (contrôlé par l'utilisateur) et une évaluation humaine externe avant de considérer une intégration.

Android, mémoire chiffrée, Piper et tous les éléments installés restent inchangés. Aucun APK nouveau, aucune fusion `main`, aucune Release.
