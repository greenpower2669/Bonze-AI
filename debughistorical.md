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

29/10/2026 — GitHub Actions #40843431509 : succès. APK Bonze-AI-v0.3.0-accessible-debug.apk publié sous la prérelease bonze-ai-v0.3.0-accessible, 161176337 octets, sha256:b7b18688cea3b9d7771f0eda02bc7954c368ccee8d894b09e2021f22b2bef938. Visage permanent, transcription automatique depuis l'écoute explicite et réponses vocalisées via TTS local ; vérification sur appareil physique NON faite, donc comportement STT/TTS dépend de l'installation Android et ne peut être garanti. Le badge de build ne prouve pas un dialogue complet sur téléphone. Attention : LFM2.5-230M est dense ; le micro-MoE de huit experts entraînés n'est pas le MoE multi-réseaux autonome du contrat.


## 29/10 — reprise 0.4 et courses de conversation

Causes vérifiées par lecture et tests : stop JS laissait le tour occupé ; résultats LLM sans token ; permission acceptée sans vérifier activation/premier plan ; écoute ancienne capable de libérer le reconnaisseur courant ; identifiant TTS constant. Correctifs : tour invalidé/libéré, tokens de génération et session JS/native, garde pure VoiceSession, comparaison d'instance avant callback, époque de permission et identifiant de chaque énoncé. Stop/background invalident avant cancel/destroy. Le retour en premier plan ne relance jamais l'écoute.

Tests JS : échec reproduit puis corrigé pour stop occupé ; nouveaux modules identité/organisme testés ; absent stimulus ne doit pas devenir -.3 (test RED puis GREEN). Forces persistantes influencent le visage continuellement, sans retirer ses classes d'activité.

Distribution auditée : la Release 0.3 a été écrasée par plusieurs runs avec --clobber ; son asset actuellement annoncé par GitHub a le digest cd6b3e639ca0754a2f8a474af402e8d45a4712a1c7f19d318ea3bb9d4282f6bc, différent de l'ancien digest de ce journal. Les futures Releases sont figées par version/commit ; pas de remplacement silencieux d'un asset existant. Les clés debug précédentes n'ont pas été conservées, donc mise à jour directe non garantie. Nouveau cache de clé debug = commodité de test seulement, aucune garantie de rétention ni clé de production.

Aucun JDK complet ni Chromium installés dans le workspace : tests JVM/navigateur et compilation/lint confiés à la CI. Les 25 tests JS locaux passent ; les tests réels STT/TTS/mode avion/écho/TalkBack sur Samsung restent NON effectués. Piper et MoE linguistique restent NON implémentés ; étude et prérequis documentés.

CI 40858005363 : JS et test JVM VoiceSession verts ; navigateur bloqué avant lancement parce que ubuntu-latest est devenu Ubuntu 26.04, non supporté par Playwright 1.56.1. Runner fixé à ubuntu-24.04. Revue indépendante : sérialiser aussi la capture d'époque de génération sur le thread UI, sinon stop natif en file pouvait invalider une nouvelle demande texte et laisser les champs occupés. Régression structurelle ajoutée ; 26 tests JS passent après correction. Les tests physiques restent ouverts.
