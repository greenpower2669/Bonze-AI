# BONZE-068 — nouveaux pièges de contradiction : mesure et correction prudente

## Protocole

Deux jeux fictifs **auto-étiquetés par le projet** ont été figés avant évaluation, sans annotation indépendante.

- Premier banc : 35 paires, dont 12 oppositions explicites et 23 cas où une contradiction n'est pas prouvée (chronologie, discours rapporté, référents distincts, causalité). `tests/fixtures/bonze068-new-scenes.mjs`.
- Second banc plus difficile : 20 paires, dont 10 contradictions attendues et 10 cas sans conflit démontré. `tests/fixtures/bonze068-hard-cases.mjs`. Pronoms, quantificateurs, identités des personnages, changements d'état, énoncés portant sur le passé.

Aucune de ces paires n'est issue d'un dialogue libre ou d'une validation à l'aveugle. L'expression « pas de contradiction prouvée » ne signifie **jamais** que la phrase a été vérifiée comme cohérente.

## Mesures archivées

[GitHub Actions — première mesure sur code BONZE-067 inchangé](https://github.com/greenpower2669/Bonze-AI/actions/runs/41505078997) · [fichiers bruts initiaux](https://github.com/greenpower2669/Bonze-AI/actions/runs/41505078997/artifacts/13170018647).

[GitHub Actions — après adaptation BONZE-068](https://github.com/greenpower2669/Bonze-AI/actions/runs/41505429484) · [fichiers bruts après correctif](https://github.com/greenpower2669/Bonze-AI/actions/runs/41505429484/artifacts/13169733888).

| Épreuve | Version initiale | Après adaptation |
|---|---:|---:|
| Premier jeu : contradictions détectées | 12/12 | 12/12 |
| Premier jeu : absence de faux veto | 23/23 | 23/23 |
| Second jeu : contradictions détectées | 1/10 | **6/10** |
| Second jeu : cas sans fausse alerte | 7/10 | **10/10** |
| Faux veto du second jeu | 3 | **0** |

La deuxième mesure est une **régression de développement**, car les échecs de ce jeu ont servi à concevoir la modification. Les nouveaux résultats ne mesurent **pas** une généralisation hors échantillon.

## Changements réalisés

`core/story-consistency.js` reste un filtre **facultatif**, chargé séparément de `core/scene-anchor.js`. Son fonctionnement est conservateur.

- L'égalité lexicale de deux propositions ne suffit plus à prouver un conflit si elles ne renvoient pas à un **même sujet défini**. « Un robot » et « le robot » peuvent désigner deux personnages distincts ; « le pirate » et « la pirate » ne sont pas automatiquement fusionnés.
- Certaines oppositions d'états simples sont ajoutées : *vivant/mort*, *présent/absent*, *vide/plein*, ainsi que des variantes « est resté(e) ouvert(e) » ou « est bien réveillé(e) ».
- L'écriture en mémoire de la scène demeure bloquée seulement lorsque la contradiction est **affirmativement reconnue**. Le filtre s'abstient ; il ne crée pas une réponse de substitution.
- Les protections de sécurité BONZE-061 et les restrictions de livraison de BONZE-066 restent inchangées.

## Quatre limites concrètes ouvertes

- `h02` : possession affirmée versus absence de **toute** clé — quantificateur.
- `h04` : affirmation « jamais » versus événement daté « hier » — raisonnement sur une période.
- `h05` : absence de **tout** livre versus possession d'un livre — quantificateur.
- `h10` : « le robot ouvre le coffre » versus « il ne **l'ouvre** pas » — référence pronominale.

Ne pas élargir les règles au hasard : chacun de ces problèmes demande une analyse plus précise de l'identité, du temps et de la portée de la négation. Le prochain banc devra être inédit, séparé de ces cas désormais vus.

## Statut et frontières

Le développement reste sur `feature/bonze042-field-fixes`. Le filtre de narration n'est **pas** une protection clinique. Ni l'application Android, ni le moteur Liquid/Piper, ni une APK, ni `main`, ni les Releases n'ont été modifiés. Aucune mesure sur le téléphone, aucune preuve de compréhension générale ni validation indépendante n'est revendiquée.
