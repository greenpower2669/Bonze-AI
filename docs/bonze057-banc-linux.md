# BONZE-057 — l'expérience de Bonze hors Android

**Question testée :** un petit Liquid est-il réellement capable de choisir la bonne formulation parmi plusieurs phrases déjà écrites, en tenant compte du sujet et du rôle émotionnel ? Ce test sert à décider si la contrainte de calcul Android mérite d'être conservée, ou si un prototype PC/Linux est plus judicieux.

## Architecture évaluée
1. L'IA n'est pas chargée de produire une phrase libre : le corpus la construit. Liquid reçoit le contexte, la dernière question, l'intention, le rôle et **quatre formulations contrôlées**.
2. Sur onze situations françaises synthétiques, une des quatre options a un rapport évident avec le sujet. Chaque cas a une réponse attendue fixée **avant** l'essai, jamais ajustée après la sortie.
3. Les indices attendus varient entre 0, 1, 2 et 3. La sortie n'est valide que si elle est **un seul caractère entre 0 et 3** ; aucun texte généré n'est accepté comme réponse.
4. Décodage glouton déterministe, quatre jetons maximum, llama.cpp Linux CPU épinglé au commit `2da668617612d2df773f966e3b0ee22dc2beef7b`.
5. Comparaison successive de Liquid LFM2.5 230M Q4 et LFM2.5 1.2B Q4. Les modèles sont chargés **un par un**, contrôlés par SHA-256, puis libérés. Les tests historiques de génération libre (R0/A1/A2/A3) restent au rapport à titre de référence.

## Traces et critères
Les fichiers `bonze-230m.jsonl` et `bonze-12b.jsonl` contiennent les cas, attentes, réponses, indices valides et temps. Le script `scripts/score-dialogue.mjs` génère `bonze031-diagnostics.md` : taux de validité, sélection de l'index attendu, erreurs par cas et temps total Linux. Le test `tests/bonze057-scoring.test.mjs` vérifie les calculs sur jeu synthétique.

**Attention à l'interprétation :** onze cas à choix manifestement inégaux ne prouvent ni la compréhension naturelle du français, ni la qualité de conversation sur vingt tours, ni les performances d'Android ou de Piper. En production BONZE-056, les quatre choix d'une demande explicite d'histoire sont volontairement du même sujet ; ici certains distracteurs servent seulement à mesurer le discernement du sélecteur.

## Politique de livraison
Le benchmark reste sur `feature/bonze042-field-fixes`, ne touche pas à `main`, ne déploie aucun APK et ne crée pas de GitHub Release. Un rapport et les données brutes sont les seules livraisons automatiques de ce test. Les prochaines décisions seront fondées sur résultats observés et vérification humaine, pas sur le seul nombre de paramètres.
