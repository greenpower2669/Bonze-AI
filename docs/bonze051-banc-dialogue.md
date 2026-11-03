# BONZE-051 — banc reproductible de dialogue français
_1er novembre 2026 — branche de développement, aucun changement de Release._

## Objectif
Qualifier la pertinence du routage des intentions avant d'attribuer des progrès au modèle Liquid. Le banc `tests/dialogue-acceptance.test.mjs` contient **82 messages français sur 20 catégories**, ainsi que des cas supplémentaires de sécurité, négation, question métalinguistique, suivi de 20 tours et correspondance lexicale entre sujet et réplique proposée.

## Résultat et corrections
- **Premier passage : échec instructif** — « Je pleure » non reconnu, urgence masquée par « Quel est ton nom ? », négation « Je ne suis plus inquiet » mal interprétée.
- Après corrections, « Un peu d'humour » a encore révélé un problème : la normalisation conservait les apostrophes, ce qui coupait mal `d'humour`, `je t'aime` et d'autres expressions.
- Les correctifs **a7c58b17** et **ab8e5272** remettent les priorités de crise, ajoutent les pleurs et négations, et transforment les apostrophes en séparateurs de mots.
- [**CI verte — 41342420616**](https://github.com/greenpower2669/Bonze-AI/actions/runs/41342420616) : **82/82 intents** testés, 20 tours simulés sans perte des bornes d'état, garde-fous d'intentions critiques et options composées de même rôle/intention.
- Mini-échantillon de **10 sujets de fiction** : 10/10 sont mentionnés dans au moins une option générée depuis BONZE-055 ; `pirate` a été ajouté à la scène déjà rédigée du navire. Mesure de couverture lexicale, **pas de qualité sémantique prouvée**.

## Ce que nous ne mesurons pas encore
Le score 82/82 concerne **le détecteur déterministe** et la cohérence des options précomposées. Les appels neuronaux Liquid, leur qualité de sélection, la vitesse réelle du GGUF, la prononciation Piper, le Bluetooth/Stop et le contexte physique Samsung ne sont **pas testés** par ce banc. Les 90 000 combinaisons sont tirées de 200 noyaux sémantiques, non de 90 000 connaissances.

## Suite
Emballer le dernier code en APK **expérimental non distribué**, vérifier signature/package/offline, puis mesurer sur Samsung et en conversation de 20 tours : intention, thème, option choisie, verdict du juge, taux de hors-sujet, répétitions, latence, RAM, Piper, interruption et maintien des données. Les logs doivent éviter la diffusion de textes personnels. Une nouvelle Release ne suit que l'accord explicite de Fab.

## Extension BONZE-055 — sujets connus, inconnus et répétition
Une demande « Imagine un pirate » retrouve maintenant la scène du navire ; 10/10 sujets fictionnels du mini-échantillon sont couverts sans augmenter les 200 noyaux. Une demande explicite visant un sujet **absent** reçoit une question de clarification rédigée, au lieu d'une réponse aléatoire hors sujet. Le filtrage distingue le manque réel du sujet d'une simple pénalité anti-répétition. La même demande connue répétée 20 fois doit conserver son thème, avec plusieurs tournures différentes. [Tests GitHub 41344518211](https://github.com/greenpower2669/Bonze-AI/actions/runs/41344518211) réussis. Évaluation de l'inférence Liquid et test physique encore à effectuer.
