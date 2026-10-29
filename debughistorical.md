# Bonze AI — debughistorical

29/10/2026 : état initial dépôt README + LICENSE, création branche de prototype sans effacer de code.
Points non prouvés : installation Android, service worker hors ligne réel, compatibilité vocale et mesures RAM.
Limites connues : pas de STT, LLM, authentification ni binaire Android. Le mode RAM est simulé explicitement.
Stockage local non chiffré : aucune donnée sensible ni autorisation de missions. Voix locale facultative désactivée au lancement.

29/10/2026 : création du projet Android Java (SDK35 min26), WebViewAssetLoader sans permission INTERNET, JS Bridge vers SpeechRecognizer strictement sur appareil (API31+) et workflow APK. Tests d'installation sur appareil et compilation CI encore à confirmer. Signature debug uniquement.

Premier run APK : échec dans android-actions/setup-android@v3 (package legacy « tools » absent) avant compilation ; action retirée, cmdline-tools préinstallés utilisés.
Deuxième run : cmdline-tools présents, mais sdkmanager absent du PATH ; utiliser chemin absolu détecté sous ANDROID_HOME/cmdline-tools.
Troisième run : BUILD SUCCESSFUL, compile Java réussie, mais chemin de renommage « app-debug.apk » erroné (module nommé androidApp). Workflow corrigé pour trouver l'APK réellement généré.

Build Android CI confirmé 29/10 : GitHub Actions run 40801461773 = success. Release bonze-ai-v0.1.0-poc ; APK Bonze-AI-v0.1.0-debug.apk = 1 169 364 octets ; SHA-256 08f5780c42003579b2c6b46f711a66936d8d2c1a44748db6b9082e50650734dd. Installation sur vrai téléphone et disponibilité STT local non encore vérifiées.

29/10/2026 0.2.0 : poids micro-MoE réellement entraînés (304 paramètres), bascule de la réponse vers LFM2.5-230M dense (153 Mo) via AAR llama.cpp. Risques à vérifier : vitesse inférence Samsung, compatibilité des noyaux native b9878 avec architecture LFM2.5, téléchargement Hugging Face CI, empreinte mémoire réelle et licence LFM 1.0. Aucun essai appareil encore.

CI first 0.2 attempt: curl URL rejected due doubled shell escapes in workflow; fixed with single-line curl. Unit test changed to compare actual inhibition vs unopposed baseline rather than arbitrary threshold .9.
