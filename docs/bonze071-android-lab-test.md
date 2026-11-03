# BONZE-071 — APK Android de démonstration narrative

## Objectif de la livraison

Créer une application de test installable **à côté de Bonze AI**, sans écraser les données de l'application existante et sans fusionner la branche de recherche dans `main`.

- Nom visible : **Bonze Lab 070** 🌱
- Nom d'APK prévu : `Bonze-AI-v0.8.1-lab070.apk`
- Identifiant Android : `fr.bonzeai.companion.lab070`
- Version : `0.8.1-lab070`, code 9, signée **debug** pour test, pas pour Google Play.
- Empaquetage de l'application Bonze avec ses composants hors ligne et son icône existante ; le modèle Liquid 230M, Piper et leurs licences sont récupérés au build par la CI avec contrôles d'intégrité.
- Permission `INTERNET` **absente**.

## Fonctionnalités réellement visibles

Le volet **🧪 BONZE-070 · Voir la nouvelle mémoire narrative**, sous les boutons de dialogue, montre :

1. « 🔴 Exemple contradiction » : phrase 1 « Le robot possède une clé » puis suite « Le robot n'a aucune clé ».
2. « 📖 Raconter et mémoriser cette phrase » : inscrit la phrase dans le journal fictif **après** l'avoir affichée.
3. « 🔍 Vérifier la suite » : affiche si les deux phrases contiennent une contradiction explicitement reconnue.
4. « 🟢 Exemple évolution » : « Plus tard, le robot n'a aucune clé » permet de visualiser qu'un changement de temps n'est pas automatiquement contradictoire.
5. « 📖 Raconter cette suite » et « 🧹 Effacer cette scène » : tester soi-même des phrases courtes et remettre la scène à zéro.

Le laboratoire utilise **réellement** `core/scene-facts.js` et `core/scene-ledger.js`, pas une simple maquette. Les faits de fiction peuvent y être consultés sous forme structurée et sont conservés **uniquement en RAM pour cette session**.

**Limites essentielles :** le nouveau parseur est volontairement restreint et ne comprend pas toutes les phrases. Il ne remplace pas le moteur de conversation principal. Le dialogue vocal ordinaire et les souvenirs privés ne sont **pas branchés** sur ce journal expérimental. L'affichage de la phrase dans le laboratoire est seulement un accusé de livraison visuelle, pas la preuve de sa lecture par Piper. Un résultat « contradiction non démontrée » ne garantit jamais qu'une phrase est correcte.

## Livraison et contrôles

La CI ciblée `.github/workflows/bonze071-android-lab.yml` teste le code, installe les dépendances épinglées, compile l'application en parallèle, inspecte le package, la version, les permissions, les fichiers de laboratoire, la signature et le SHA-256, puis tente de publier le `.apk` **directement** dans une prérelease distincte.

Le téléchargement ne doit être annoncé comme disponible qu'après confirmation de l'asset réel :
`bonze-ai-v0.8.1-lab070 / Bonze-AI-v0.8.1-lab070.apk`.

Si le build ou la publication échoue (droits GitHub, SDK, signature, téléchargement de poids, quotas), ne pas inventer de lien direct ; garder les logs et ouvrir un point de reprise dans `todo.md`.

Aucune fusion `main`, aucun remplacement de la Release Bonze 0.8.0-dev-parallel, aucune mise à jour du dépôt Djipie sans validation.
