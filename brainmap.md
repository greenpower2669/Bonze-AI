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
