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

CI 40858286078 : installation Chromium réussie ; test navigateur attendait la visibilité des contrôles avancés, pourtant repliés volontairement. Attendre leur présence DOM puis ouvrir l'éditeur dans les scénarios. Capture d'écran conservée aussi en cas d'échec. Correction compatibilité Android 12 : trim().isEmpty() remplace String.isBlank(), API 33 ; garde SDK31 annotée pour lint. 27 tests JS passent.


## 0.4.0 — livraison vérifiée

Run 40858508226 au commit e60d8876d1e997c031c788fdbd82663124a614aa : validate et android-debug = success. 27 tests JS et garde VoiceSession JVM verts, 28 assertions navigateur (persistance, personnalisation, reset conservant acquis, ancien tour/ancienne voix, désactivation persistante, hors ligne SW, visage/Stop sur 4 tailles). Capture UI 57489 octets inspectée, pas d'erreur JavaScript.

Gradle assembleDebug + lintDebug : BUILD SUCCESSFUL. aapt : fr.bonzeai.companion, versionCode4, versionName0.4.0 ; seule permission compilée RECORD_AUDIO, pas INTERNET. apksigner : signature vérifiée, certificat public SHA-256 d30a6cc0ca0b20cae35ee82a82bf162561ae5eae6c42b24f6a20d53c58fc3c14. Release bonze-ai-v0.4.0, asset Bonze-AI-v0.4.0-debug.apk : 161191354 octets, SHA-256 4e74415462df28060a30ef116b6a0ceccc9ffeda84da8fe7cf431391fcf8850d ; digest GitHub identique au sha256sum CI, tag pointant au même commit. Main vérifiée inchangée f5910311f903d8ae4378d62d100129b690fc0e85.

Limite de distribution constatée : le post-job de cache debug.keystore signale Path Validation Error (chemin absent), aucune clé sauvegardée. Le cache n'établit donc aucune continuité de signature ; garder cette tâche ouverte. Ne pas faire perdre l'identité locale par une consigne de désinstallation. Aucun test d'installation Samsung, mode avion/STT/TTS/écho/TalkBack ou performance physique ; Piper et MoE linguistique absents, études seulement.

## Retour Fab — veille, rôle, taille et parole (29/10 après essai)

Fab rapporte coupure en veille, formulations « je suis une IA / conçu pour… » et jeu de rôle rompu, visage trop petit, bouche peu perceptible et voix robotique. Audit code de 0.4 confirmé : onPause détruit/invalide la session, garde VoiceSession premier plan et JS document.hidden arrêtent aussi ; absence de service Android. Ce comportement résultait du contrat initial d'arrêt au fond ; nouvel ordre BONZE-019 demande la continuité écran éteint après activation volontaire.

Autres causes confirmées : pas d'historique/scène explicitement envoyé dans l'appel LFM ; prompt actuel ne contient plus l'ancienne obligation « programme pas personne », donc origine exacte des phrases du modèle non reproduite. Visage final38vw (avant réduction89 %), scène27dvh ; animation bouche fondée sur différence5px sans temps audio. TTS = voix Android hors réseau, débit0.92–1.01, Piper absent. Les tests existants27/27 restent verts et ne prouvent pas ces critères qualitatifs ni le fonctionnement physique écran verrouillé. Aucune modification applicative dans cet audit ; plan et validation physique décrits dans le rapport ciblé à la racine.

## Correction 0.5 — tests en préparation

Causes de l'audit corrigées dans le candidat : Activity ne possède plus la boucle vocale, JS caché ne termine plus une session Android ; garde de démarrage consommable pour empêcher un ancien Intent START d'arriver après Stop ; numéros de commande/processus pour rejeter anciens événements UI. Migration historique0.4 bornée sans double application sur les acquis. AnimationTTS liée au début/plages/fin effectifs, avec repli approximatif si aucune plage fournie, au lieu de l'ancien oscillateur5px. Voix française locale choisie/identifiable, rythme segmenté et pauses.

Tests JS de parole et de barrière d'événements observés en échec avant ajout des modules, puis verts ; tests JVM de session détachée, autorisation périmée, contexte et segmentation à exécuter en CI. L'architecture n'est pas encore validée sur Samsung verrouillé ; pas de succès physique revendiqué.

Revue indépendante du candidat0.5 : (1) annuler tous les messages Handler pouvait supprimer le callback qui libère l'état d'inférence et laisser le moteur occupé ; suppression de cette annulation globale, AtomicBoolean libéré dans le finally du worker, résultat toujours protégé par époque. (2) ancien snapshot de Stop pouvait rétablir la voix précédente ; voix UI en attente d'accusé de configuration, snapshot natif après configuration et ordre des séquences. (3) permission accordée avant onResume pouvait perdre l'activation initiale ; PendingStart conserve uniquement cette demande explicite jusqu'à reprise, consommation unique, annulable par Stop. Focus audio protégé contre anciens callbacks. Tests ajoutés ; la CI initiale validait noyau/JVM et échouait sur le faux pont navigateur qui ne consignait pas la configuration initiale (corrigé).


## Correction0.5.0 — livraison vérifiée

CI #40868793495 au commit ff04ec4203bb7cfe9ca412d8814a09b16643bb8c : validate et android-debug réussis.35 tests JS,4 programmes JVM (garde de service, contexte/budget, segmentation, permission suspendue) et34 assertions navigateur réussis. Le pont simulé teste absence d'arrêt à visibilitychange, resynchronisation du dialogue au retour, bouche réellement ouverte (>10px dans le scénario), description animée sansmicro, voix choisie malgré snapshot ancien puis conservée au rechargement, refus des anciens événements aprèsStop, désactivation et cache horsligne. Pas de preuve d'audio/micro réel.

Gradle assembleDebug + lintDebug + signingReport : BUILD SUCCESSFUL. APK fr.bonzeai.companion/code5/version0.5.0, signé et vérifié par apksigner ; permissions micro, FGS, FGS_MICROPHONE, FGS_MEDIA_PLAYBACK, notifications etWAKE_LOCK déclarées, aucune permission INTERNET. Release bonze-ai-v0.5.0 : Bonze-AI-v0.5.0-debug.apk : 161213280 octets, SHA-256 e5d12f3357e463232db7d2dea94663c53cf0ffd8cbdb99a89efff05572eacdee, identique au digestGitHub. Certificat public 128b1bb0d488f33dd9075888ee15d6ff943136d657018026d1e0b22d9c35991d. Cache de clé effectivement enregistré avec bonze-ai-debug-signing-v2 ; ancienne clé 0.4 perdue dans les éléments accessibles, mise à jour directe incompatible. Conserver les données avant décision de désinstallation/migration. Aucune matière privée dans Git ou le chat.

Capture UI de 72717 octets inspectée : visage plus grand et sous-titres/Stop présents. Les vérifications automatisées ne couvrent pas la veille profonde sur Samsung, qualité STT/TTS, écho/casque, autonomie ou qualité du jeu de rôle : essai utilisateur toujours requis. Piper et MoE linguistique restent non intégrés. Main vérifiée inchangée.

## Avenant0.5 — répétitions et sous-titres (diagnostic ouvert)

Fab signale de nouvelles transcriptions suivies d'une même réponse. Compte rendu d'une autre conversation : « Bonze : Bonjour, je suis ravi de pouvoir vous… », visage souvent tranquille, Arrêter masque les sous-titres. Vidéo brute non accessible ici ; ne pas prétendre l'avoir revue. Lecture AARv0.1.1 : mémoire native réinitialisée par llama_memory_clear ; hypothèse KV persistant écartée par source. Interface conserve prouvablement la dernière réponse lors du nouveau tour, ce qui peut produire une impression de blocage mais ne prouve pas la cause de la génération répétée. Test réel comparatif de contexte en préparation.

Régression d'affichage reproduite : test captionPair échoue avec « Bonjour Fab » encore présent après « Compte jusqu'à trois ». Correction sélectionne uniquement une réponse postérieure à la dernière entrée humaine ; affiche une attente distincte, historique conservé.2tests ciblés verts. Régression de géométrie ajoutée sur4tailles avec longs textes/très grands caractères ; exécutionCI attendue. Publication du candidat désactivée jusqu'aux contrôles.

CI #40904270408 reproduit réellement le débordement des sous-titres en320x568 : la carte Bonze dépasse la grille rétrécie par flex-shrink. Correction : les enfants de la conversation gardent leur hauteur intrinsèque, le panneau défile ; le bouton ne partage plus une zone occupée par le texte. Le test reste identique pour vérifier le résultat.

Probe modèle réel #40904270395 : contexte aplati entraîne la copie des4phrases utilisateur ; rôles structurés retrouvent Pipo mais répètent un motif. Probe #40905257570 : consigne courte seule ne suffit pas ; réponses stéréotypées et erreur d'identité restent présentes. Prochaine isolation : mêmes messages sans système/historique, contexte natif réutilisé vs recréé. Ne pas annoncer le bug de génération réglé.

Probe Piper #40905257759 : chargement sherpa2.0.1 + Siwis mediumINT8 + lexique français90114mots, synthèse et WAV produits ; l'étape échoue ensuite seulement sur le calcul Python du pic (abs appliqué à une liste), correction de ce calcul. Aucune écoute encore effectuée. Les données espeak de l'archive ne doivent PAS être empaquetées avec le moteur2.0 sans GPL ; copier seulement ONNX/tokens/carte et lexique MIT avec ses notices.


### Avenant 0.5 — candidat en validation, 29 octobre 2026
- Correction prouvée : ancien sous-titre associé au nouveau tour et flex des sous-titres ; CI 40906407823 réussie (avant nouveaux experts/Piper).
- Probes exact GGUF : le contexte aplati provoque un écho ; contexte recréé et réutilisé donnent les mêmes réponses faibles. Suppression des préfixes du message utilisateur, contexte humain séparé, répétitions journalisées. Qualité 230M encore insuffisante, non déclarée résolue.
- Conseil partagé JS/Rhino : huit activations entraînées + votes de politiques contextualisées écrites à la main, endurances individuelles, influences directionnelles, arbitrage réellement transmis au générateur. Pas un MoE linguistique achevé.
- Console Android authentifiée par le code du téléphone, curseurs et geste de découverte 60 touches alternées ; ce geste ne donne aucun droit.
- Sauvegardes AES-GCM/PBKDF2 versionnées : identité, acquis, historiques, poids, paramètres, états et traces ; vérification avant restauration, retour arrière. Validation sur téléphone encore à effectuer.
- Piper Siwis int8 via sherpa-onnx 2.0.1 réellement branché à AudioTrack ; lexique français MIT, secours Android explicite pour les mots absents. PCM/arrêt/latence à vérifier sur Android. Synthèse hôte française réussie CI 40906407731, écoute humaine encore requise.
- Nettoyage automatique de l’environnement : reprise depuis edb86e5 ; aucune perte de commit distant ; ajouts non commis reconstruits puis testés.
- 45 tests JS passent localement ; compilation/lint et nouveaux essais Android en attente. Publication candidate désactivée, aucun merge main.

Candidat complément : tests instrumentés Android Piper/conseil ajoutés ; migration des acquis sans ancien conseil corrigée, journaux PWA persistés. Licences détaillées dans docs/piper-integration.md et docs/licenses. Validation Android toujours en cours.
