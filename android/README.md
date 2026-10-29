# 🌱 Bonze AI — Android 0.1.0
L'APK embarque la WebApp et charge le même moteur core/bonze.mjs (copie Gradle au build, pas de deuxième cerveau).
Il utilise WebViewAssetLoader sur appassets.androidplatform.net et ne réclame aucune permission INTERNET.
Sur Android 12+ seulement, un bouton facultatif demande l'autorisation micro et tente le SpeechRecognizer.createOnDeviceSpeechRecognizer. Jamais de fallback cloud.
Si le moteur on-device français manque ou si la mémoire est sous pression, le clavier reste accessible. Le texte reconnu doit être confirmé avec « Envoyer ».
La pression mémoire est surveillée via les signaux onTrimMemory Android et l'écoute n'est jamais réactivée automatiquement.
L'application est un POC : pas de LLM, pas d'authentification forte, pas de mémoire sensible chiffrée ; ne pas saisir d'informations sensibles.
Build : Gradle 8.9, JDK 17, SDK 35 : gradle :androidApp:assembleDebug
Sortie : android/app/build/outputs/apk/debug/app-debug.apk
Release : Bonze-AI-v0.1.0-debug.apk, signée debug pour test local, PAS pour Play Store. L'AAB et la signature production restent à faire.

### Livraison vérifiée
APK compilé dans GitHub Actions #40801461773, publication directe : https://github.com/greenpower2669/Bonze-AI/releases/download/bonze-ai-v0.1.0-poc/Bonze-AI-v0.1.0-debug.apk
Taille 1 169 364 octets. SHA-256 : 08f5780c42003579b2c6b46f711a66936d8d2c1a44748db6b9082e50650734dd. Essai sur appareil physique encore requis.
