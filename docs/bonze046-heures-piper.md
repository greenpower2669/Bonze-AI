# BONZE-046 — Horaires français Piper

31 octobre 2026 — branche expérimentale `feature/bonze042-field-fixes`.

## Correctif

La transcription vocale prépare la notation `15h30` en « quinze heures trente », `1h00` en « une heure » et `21 h 01` en « vingt et une heures une ». La plage est bornée à 00h00–23h59. Un horaire impossible ou incomplet produit une erreur explicite, plutôt qu'une lecture inventée.

La transformation se limite aux mots transmis au phonémiseur Piper. Elle préserve le texte du dialogue affiché et sauvegardé, la sélection du moteur vocal, le répertoire émotionnel et les modèles locaux. Les notations avec deux-points, décimaux, dates et milliers restent hors de ce correctif.

## Preuves et limites

Prétest local Java JDK 21 : huit cas positifs et six entrées invalides réussis. `tests/PiperPhoneticsTest.java` protège désormais aussi les phonèmes. Le workflow audite `heure` et `heures` dans le véritable lexique français livré.

Contrôles à compléter : résultats GitHub Actions sur ce commit, lecture acoustique Samsung/Bluetooth/veille/Stop, pertinence des conversations, mémoire et ressources.

L'APK nouveau n'est **pas** publié : API GitHub Releases 403 documentée indépendamment, aucune substitution ZIP. `main` et la version 0.7 installée restent intacts.

## Vérification de paquet complet

Un contrôle de compilation d'APK expérimental parallèle, lint, manifeste, absence de permission INTERNET et signature est demandé dans GitHub Actions via le marqueur `[bonze-build]`. Il s'agit d'une validation interne, sans livraison publique ni remplacement de Bonze 0.7. L'APK final demeure non publié tant que les tests Samsung et le canal GitHub Releases ne sont pas validés.
