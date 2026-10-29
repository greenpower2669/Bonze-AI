# Android (cible APK/AAB, non construit)

Réutiliser core/bonze.mjs et docs/ dans un conteneur Capacitor/WebView, sans dupliquer les règles.
Intégrer un pont Kotlin pour un moteur STT français entièrement local. Vérifier SpeechRecognizer.isOnDeviceRecognitionAvailable sur Android 12+ avant de proposer createOnDeviceSpeechRecognizer, sinon évaluer sherpa-onnx embarqué. Ne jamais basculer silencieusement vers une transcription distante.
Observer la pression mémoire avec onTrimMemory et les erreurs réelles ; priorité absolue à la désactivation volontaire du micro.
Authentifier le propriétaire via AndroidX Biometric et Android Keystore avant l'édition des missions ; chiffrer la mémoire sensible.
Binaires attendus : Bonze-AI-vX.Y.Z.apk et Bonze-AI-vX.Y.Z.aab, avec icône et tests réels. Aucun binaire n'existe encore.
