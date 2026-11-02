# BONZE-067 — veto narratif de contradiction explicite

## Objectif
Réduire la propagation des réponses contradictoires dans les histoires de Bonze, tout en conservant séparément le thème choisi par la personne et la phrase de fiction réellement délivrée. Il s'agit d'un mécanisme de recherche **local et opt-in**, pas d'une preuve de compréhension ni d'une fonction Android déployée.

## Architecture
- `core/story-consistency.js` expose `BonzeStoryConsistency.check(prior,candidate)` : résultat `{conflict,reason}`, sans renvoyer le texte comparé.
- Analyse volontairement restreinte : négation explicite d'une même proposition (`a trouvé / n'a pas trouvé`) ou états exclusifs simultanés du même sujet (`porte ouverte / fermée`).
- Les adverbes chronologiques (« ensuite », « maintenant », « finalement ») et le discours rapporté sont écartés de cette reconnaissance, parce qu'une transformation narrative n'est pas une contradiction démontrée.
- `core/scene-anchor.js` appelle ce détecteur **uniquement s'il est chargé**. Lorsqu'une proposition choisie contredit la dernière phrase acquittée, il rend `index=-1` et `reason=story-contradiction`, sans créer de reçu ni mémoriser la proposition rejetée. Sinon, la logique BONZE-066 reste inchangée.
- La priorité de sécurité BONZE-061 continue d'agir avant le filtre de contradictions ; aucune modification de ses règles.

## Mesures et provenance
[CI BONZE-067 réussie](https://github.com/greenpower2669/Bonze-AI/actions/runs/41502857039) · [résultats bruts JSON et rapport](https://github.com/greenpower2669/Bonze-AI/actions/runs/41502857039/artifacts/13169386552).

Le jeu de **32 paires** a été créé par le projet et gelé dans `tests/fixtures/bonze067-contradictions.mjs` **avant l'écriture** du détecteur. Il n'a pas été annoté indépendamment ni à l'aveugle : 14 oppositions claires reconnues sur 14 ; 18 paires sans opposition prouvable laissées de côté sur 18. Les tests passent dans les deux sens. Ces étiquettes servent à vérifier des règles ciblées, pas un modèle de cohérence du langage naturel.

Sur les **trois histoires BONZE-065 déjà inspectées**, quatre rotations chacune :

| Méthode | Choix attendus | Abstentions | Mauvais indices | Veto explicites |
|---|---:|---:|---:|---:|
| BONZE-066 sans filtre | 132/240 | 96 | 12 | 0 |
| BONZE-067 avec filtre | **132/240** | **96** | **12** | **0** |

Le nouveau détecteur ne se déclenche dans **aucune** de ces 240 décisions. Il ne corrige donc **aucune** des erreurs observées précédemment. Ces histoires n'incluaient pas, dans les options finalement sélectionnées, les inversions exactes reconnues par ses règles.

## Limites et prochaines missions
- Une sortie `conflict:false` signifie seulement « contradiction non démontrée par ce petit détecteur », **pas** « phrase cohérente ».
- Le temps, les pronoms, les déclarations incertaines, les changements d'état subtils, les références à plusieurs personnages, les souvenirs faux et l'ironie restent largement hors champ.
- Le blocage n'effectue pas de nouvelle sélection : il **s'abstient**, pour ne pas remplacer une erreur par un choix hasardeux.
- Prochaine expérience : développer des récits et des candidats adversariaux **jamais utilisés pendant le réglage**, puis soumettre le corpus à une annotation humaine indépendante ; mesurer séparément faux veto, vrais veto et pertes de réponses légitimes.
- Tester l'acquittement réel des phrases affichées, prononcées ou interrompues sur Samsung et contrôler le stockage de scène, l'accessibilité et la confidentialité avant toute intégration.

**Statut :** branche expérimentale `feature/bonze042-field-fixes`. Pas de modification Android, de nouvelle APK, de Release ni de fusion vers `main`.
