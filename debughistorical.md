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

0.2 build attempt: modèle GGUF et SHA OK, erreur Gradle DSL `android.ndk()` mal positionnée ; déplacer abiFilters dans defaultConfig.ndk.

CI #40837391687 du commit fb0eda03b4637a107f8c8bbe6e701e488b9e0c89 : SUCCESS. APK direct bonze-ai-v0.2.0-moe / Bonze-AI-v0.2.0-MoE-debug.apk, 161 172 983 octets, SHA-256 b5c285f14da2dc5a5e3d35612e341bb198cf0db2587ada39df423cde2370b550. Contient le GGUF externe vérifié SHA-256 7bbd90384d3deffe4c646ec9643b212802d32d4ce417c90a1ec9282100650062 à la construction. Validation sur téléphone physique non effectuée. Vérification stricte des autorisations dans le manifeste APK compilé encore nécessaire. La couche MoE est micro et expérimentale, le LFM dense n'est PAS un modèle MoE natif.

29/10/2026, accessibilité 0.3 : correction course d'arrêt : résultats STT toujours traités comme source 'voice' (ignorés par la session après Stop). Libération naturelle du SpeechRecognizer via destroy() sans cancel() pouvant déclencher un onError tardif ; cancel réservé à l'arrêt utilisateur. Options désormais en tiroir bas (visage reste visible).
