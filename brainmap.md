# Bonze AI — carte de travail

- core/bonze.mjs : invariants, émotions, miroir de compétences, stratégie d'écoute et réponses déterministes.
- docs/ : PWA, avatar, historique textuel court, profil local de démonstration, simulations de pression mémoire.
- android/ : plan de pont Kotlin/Capacitor pour STT strictement hors ligne, biométrie et métriques réelles.
- tests/ : vérifications de limites, preuve, microphone, état mémoire.
- brain.md : fonctionnement souhaité ; ordres-de-mission.md : commandes non perdues ; todo.md : chantier ; debughistorical.md : risques.
Ne jamais confondre simulateur RAM, conversation scriptée et moteur cognitif achevé.

- android/app/ : coquille Java WebViewAssetLoader, pont SpeechRecognizer strictement local, écoute désactivable, signaux onTrimMemory et icône native.
- .github/workflows/android-apk.yml : compile et publie un APK debug en prérelease si le workflow réussit.
