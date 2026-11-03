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

## Premier résultat réel, BONZE-057 (run 41356604833)
Les deux poids Q4 ont été chargés **successivement** sur Linux CPU et évalués jusqu'au bout. **230M :** 4/11 indices valides, 1/11 réponses attendues, 270 ms en moyenne (temps complet). **1,2B :** 11/11 indices valides, 3/11 réponses attendues, 1 593 ms. Les réponses brutes montrent que le 230M reprend souvent le dernier élément de la liste ou la chaîne « Numéro : » ; le 1,2B donne « 0 » dans 10/11 cas. Une telle préférence d'index rend les résultats proches du hasard et ne soutient pas une sélection confiante de formulations.

[Voir les résultats bruts sur GitHub Actions](https://github.com/greenpower2669/Bonze-AI/actions/runs/41356604833/artifacts/13103497751). **Ces constats concernent C1 et son instruction qui mentionnait « répondre 0 » en secours** : on doit tester l'effet de la position et du prompt avant une décision de modèle.

## Contre-expérience BONZE-058
Protocole détaillé dans [docs/bonze058-positions.md](bonze058-positions.md) : consigne plus courte, suppression du biais explicite vers 0, rotation des quatre réponses pour obtenir 44 décisions par modèle avec cibles réparties 11/11/11/11. Toutes les autres hypothèses sont conservées. Pas de mesure Android ni de publication APK.

## Résultats équilibrés BONZE-058 — conclusion
[Workflow terminé 41357231288](https://github.com/greenpower2669/Bonze-AI/actions/runs/41357231288), [JSONL complets 13103676754](https://github.com/greenpower2669/Bonze-AI/actions/runs/41357231288/artifacts/13103676754). **230M :** 11/44 bons choix (25 %), 39/44 indices valides, 197 ms. **1.2B :** 16/44 (36,4 %), 44/44 indices valides, 1 212 ms. Les cibles étaient équitablement réparties, mais les réponses du 1.2B se limitaient aux index 2 et 3. **Aucune preuve fiable que l'IA choisit selon le sens plutôt que selon la position.** Voir le détail dans `docs/bonze058-positions.md`.
