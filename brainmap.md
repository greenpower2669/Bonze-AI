# Bonze AI — carte de travail

- core/bonze.mjs : invariants, émotions, miroir de compétences, stratégie d'écoute et réponses déterministes.
- docs/ : PWA, avatar, historique textuel court, profil local de démonstration, simulations de pression mémoire.
- android/ : plan de pont Kotlin/Capacitor pour STT strictement hors ligne, biométrie et métriques réelles.
- tests/ : vérifications de limites, preuve, microphone, état mémoire.
- brain.md : fonctionnement souhaité ; ordres-de-mission.md : commandes non perdues ; todo.md : chantier ; debughistorical.md : risques.
Ne jamais confondre simulateur RAM, conversation scriptée et moteur cognitif achevé.

- android/app/ : coquille Java WebViewAssetLoader, pont SpeechRecognizer strictement local, écoute désactivable, signaux onTrimMemory et icône native.
- .github/workflows/android-apk.yml : compile et publie un APK debug en prérelease si le workflow réussit.

- core/experts.mjs + core/weights/expert-router-v1.json : routeur sparse top2 et 8 experts à poids supervisés, distincts du langage.
- scripts/train-experts.mjs : entraînement reproductible, 64 exemples, 304 paramètres au total.
- android/app/src/main/java/fr/bonzeai/companion/BonzeInference.kt : modèle GGUF dense et partagé via llama.cpp Kotlin, poids de 153 Mo embarqués par CI depuis HF et SHA-256 vérifié.

- core/conversation.mjs : anti-doublons et refus d'un transcript vocal après arrêt.
- docs/ : visage central permanent, sous-titres adaptables, réglages en tiroir bas, mode clavier secondaire, historique et profils hors de l'écran principal ; bouton de discussion tactile sur visage.
- android MainActivity.java : session conversation à activation explicite ; STT on-device Android, TTS français non réseau quand disponible, alternance de tours, arrêt sur pause et pression mémoire. Interface WebView partagée.
- tests/conversation.test.mjs : garde-fous du tour de parole et vérification de présence des contrôles accessibles.


## Architecture 0.4

- `core/identity.mjs` : seed cryptographique, PRNG déterministe, schéma v1, morphologie/tempérament innés ; validation et fusion parcimonieuse de personnalisation, acquis séparés, journal borné. Ne contient ni permissions ni preuves de compétence.
- `core/organism.mjs` : intégration temporelle par pas bornés, influences asymétriques, endurance globale, contexte d'échange et adaptation ; `expression()` projette les huit forces vers les paramètres du visage. Aucun accès micro ni réseau.
- `docs/avatar.js` : paramètres graphiques CSS, variantes de morphologie/skin, descriptions, formulaires labellisés/presets/reset. Aucun reset de mémoire.
- `docs/app.js` : migration du stockage `bonze-proto-01`, persistance immédiate à la naissance + après événement + toutes les 10 s + arrêt ; tick 200 ms au premier plan, pas de rattrapage non borné après suspension ; état vocal et numéro de session/génération séparés. Les états d'affichage ne doivent jamais activer le microphone.
- `core/conversation.mjs` : stop invalide le tour et libère busy ; `isCurrent` et `finish(token)` rejettent les résultats anciens.
- `VoiceSession.java` : garde pure de premier plan/activation/tour/parole et époque ; `MainActivity.java` : propriétaire de chaque reconnaisseur, permissions liées à la session, identifiants TTS uniques, invalidation des générations et métriques Android. Une seule file de génération native et un seul LFM chargé.
- `BonzeInference.kt` : prompt raccourci, budget de 48 tokens en économie / 96 précis ; arrêt du calcul natif en cours non implémenté, résultat rejeté par l'appelant.
- `docs/sw.js` : cache v4 incluant noyau identité/organisme et éditeur. Servir la racine du dépôt, pas uniquement docs/, pour que les imports ../core soient accessibles. Pas d'hébergement PWA nouveau dans cette mission.
- `tests/identity.test.mjs`, `organism.test.mjs`, `stop-race.test.mjs` : persistence, invariants, expressions, absence de stimulus, endurance et interruption. `VoiceSessionTest.java` : garde native sur JVM. `tests/browser.mjs` : intégration réelle de l'UI avec pont Android simulé, rechargement, arrêt/tours anciens, cache SW hors ligne et petits écrans ; ne prouve pas les services Android réels.
- Workflow Android : validation JS/JVM/navigateur requise avant assemble + lint ; inspection permissions/version/signature compilées, prérelease versionnée et empreinte SHA-256. Cache de clé debug à rétention limitée, jamais traité comme sauvegarde de production.
- `docs/development-2026-10-29.md` : audit et plan de la reprise ; `docs/moe-piper-study.md` : étude sourcée et preuves manquantes ; `docs/release-v0.4.0.md` : notes livrables et limites.

La capture d'époque et la réservation de génération sont sérialisées sur le thread UI (`generateReplyOnMain`), avec les arrêts et callbacks de permission ; le calcul lourd reste sur la file d'inférence. `tests/native-bridge.test.mjs` protège cette frontière de threads, en complément des tests JVM.


Canal de preuve 0.4.0 : tag bonze-ai-v0.4.0 → e60d887 ; workflow 40858508226, jobs validate puis android-debug ; 27 tests JS, test JVM, 28 assertions navigateur, lint et APK. Capture de contrôle navigateur inspectée visuellement (mode fort contraste) ; aucune capture d'appareil réel. Le cache de keystore debug n'a pas été alimenté (chemin absent) : tâche signature durable ouverte.

## Carte de causes — audit veille / incarnation 29/10

- `MainActivity.onPause` + `VoiceSession.pause/active` + `docs/app.js visibilitychange` : trois points qui interdisent actuellement de poursuivre en veille. Aucune déclaration de service dans le manifeste. Le service de conversation est une évolution à réaliser, pas une capacité actuelle.
- `BonzeInference.reply` : prompt bref et humeur dominante, sans historique/scène explicitement transmis ; le stockage JS ne prouve pas une mémoire de dialogue active dans le modèle.
- CSS final `.stage/.face-touch/.face` : scène 27dvh, largeur38vw puis89 %, donc petit personnage ; tests de visibilité ne prouvent pas la lisibilité.
- `expression().mouth` + `speaktalk` : 8px puis13px, boucle sans chronologie audio. `UtteranceProgressListener` actuel début/fin/erreur uniquement. Voix navigateur et description hors session ont une liaison avatar incomplète.
- TTS Android : voix locale choisie par disponibilité, modulation du débit seulement ; Piper absent. Diagnostic détaillé et sources : `audit-2026-10-29-veille-dialogue-visage.md`.
