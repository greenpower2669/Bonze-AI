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


## Diagnostic 0.6 — preuves et corrections
- La projection UI prenait indépendamment le dernier humain et le dernier bot : une vieille réponse restait visible au tour suivant. core/captions.mjs + régressions ; contenu et boutons contrôlés sur quatre formats avec grands caractères.
- GGUF exact/llama exact : aplatissement parfois en écho ; rôles seuls insuffisants ; contexte neuf/réutilisé ne change pas la défaillance ; ADD_BOS=1 (probe 40955614597), l'ajout explicite ne la corrige pas. Hypothèse d'un simple cache collé non confirmée. Message direct et contexte séparé limitent la contamination, qualité du petit modèle encore ouverte.
- Revue indépendante : migrations émotionnelles conservées, traces PWA persistées, poids par défaut immédiatement appliqués, export SAF vide/périmé refusé avant ouverture/troncature.
- CI instrumentée 40954882209 : clé debug absente dans le runner de tests ; création dédiée éphémère pour l'émulateur, clé de livraison inchangée.
- CI 40955614739 : 45 JS, 6 JVM, navigateur et APK/lint/signature réussis ; conseil Rhino réellement exécuté sur Android ; Piper rejeté par ART VerifyError (retour depuis synchronized inline dans finally). Correction : méthodes synchronisées distinctes, pas de retour non local sous moniteur ; relance de trois essais Android avant publication.
- Les scénarios navigateurs utilisent le vrai bouton Importer et son sélecteur, plutôt qu'une injection contournant la capture du mot de passe.

## Résolution avant prérelease 0.6 — 29/10
- ART VerifyError résolu par méthodes synchronisées distinctes ; crash JNI NoSuchMethodError/SIGABRT résolu par callback Java typé invoke(float[]) -> Integer. Trois essais instrumentés réellement verts dans 40961214052, pas seulement compilation.
- Siwis medium écarté avant diffusion : filiation Lessac à licence de corpus non commerciale. MLS medium entraîné depuis zéro retenu, notices complètes ; aucun eSpeak embarqué.
- PCM non nul ne garantissait pas l’intelligibilité : ASR indépendant révélait une mauvaise entrée phonétique. Comparaison 40960582870 : mêmes phonèmes, entrée directe plus intelligible que frontend texte. 40961535644 : dictionnaire sur segment complet retrouve les mots/phrases essentielles (calme/content/histoire notamment), alors que segmentation phrase par phrase 40961151726 dégrade la diction. Correction bornée : regrouper jusqu’à 220 caractères, conserver tous les mots, tests SpeechPlan.
- Publication finale exige probe de trois phrases et contrôles Android au même commit. L’ASR n’est pas une écoute humaine ni une mesure de naturel ; aucune conclusion Samsung. Archives détaillées : sauvegarde.md.

Le changement de locuteur (six SID), la ponctuation et l’accent final ne rendent pas les courtes séquences MLS fiables. Protection actuelle : seuil32codepoints, secours avant lecture. Le seuil48 initial refusait aussi une phrase intelligible43codepoints ; CI l’a détecté, fixture réelle ajoutée pour empêcher cette régression. Probe final40964127723 vert : les mots essentiels des trois phrases sont retrouvés, avec encore des erreurs de diction (bonjour/dragons notamment). Succès automatisé ≠ voix validée à l’écoute ; défauts courts et phonémisation restent ouverts.

### Preuves de livraison 0.6.0 — 29 octobre 2026
- Tag bonze-ai-v0.6.0 au commit 14757d3ba01c13d6774b82459f04b3b0a499c6a7 ; prérelease publiée, APK direct : 271 170 701 octets.
- SHA-256 APK : 657689ccf72068343c6c6d6f086e75e24c17516c5db86a8752ea0378e95bb8a0. Certificat 128b1bb0d488f33dd9075888ee15d6ff943136d657018026d1e0b22d9c35991d, identique à 0.5 ; clé toujours en cache de test, sauvegarde privée durable ouverte.
- Workflow 40964127638 entièrement réussi : 45 JS, 3 Python, 8 programmes JVM, 51 assertions navigateur, compilation/lint/manifeste/signature, 3 tests Android API 35 hors connexion et publication. Probe vocal 40964127723 vert au même SHA. Capture finale inspectée, visage/légendes/Stop visibles.
- APK : https://github.com/greenpower2669/Bonze-AI/releases/download/bonze-ai-v0.6.0/Bonze-AI-v0.6.0-debug.apk ; Release : https://github.com/greenpower2669/Bonze-AI/releases/tag/bonze-ai-v0.6.0 ; CI : https://github.com/greenpower2669/Bonze-AI/actions/runs/40964127638 .
- Revue indépendante des changements effectuée. PR #1 en brouillon ; main vérifiée inchangée f5910311f903d8ae4378d62d100129b690fc0e85. Aucun essai physique Samsung ni écoute humaine revendiqués. Archives : sauvegarde.md et docs/history/avenant-0.6-worklog.md.


## 30/10/2026 — BONZE-032, nouvelle architecture, sans écrasement
Base de travail `feature/offline-bonsaiv1` HEAD `01b1387f55826b2387582d4013d440036b0dfaca` (postérieur à la prérelease 0.6). Nouvelle branche `feature/bonze-032-repertoire-simule`. Remplacement de la génération libre native par un label Liquid + répertoire de texte revu. Compatibilité Rhino et repli lexical, protection de la négation, petite mémoire de tirages persistante/exportée ; cache PWA incrémenté. Test natif statique `tests/native-bridge.test.mjs` attendait encore `BonzeInference.reply` ; il a été ajusté pour le nouveau contrat. La CI JS a été observée verte au commit `44185bdd` ; construction Android en cours. Ne pas confondre absence de génération libre avec IA devenue plus intelligente. Piper peut basculer vers Android TTS si son dictionnaire ne couvre pas une phrase ou si un segment est trop court ; cette panne n'a pas encore été reproduite ni corrigée sur le téléphone. Aucune publication APK ni merge main dans cette mission.


### BONZE-034 — extension sans inflation mémoire
L'objectif 2 000 par rôle a conduit à utiliser une grammaire compressée (200 situations/variantes de sens, 10 constructions chacune, neuf personnages, 162 positions contextualisées) plutôt qu'à allouer 18 000 chaînes. Génération pure paresseuse, aucun texte neuronal. Tests programmés pour compter **18 000 textes littéralement distincts**, 2 000 par rôle et longueur au plus 220 caractères. Les risques principaux restent l'acceptabilité sémantique, le classement faible de Liquid, et les bascules/sauts de voix Piper si le lexique ne reconnaît pas des mots : ces problèmes exigent essais Samsung et ne sont pas déclarés résolus.


### BONZE-035/036 — CI, restauration et Piper (30/10)
CI 41130653145 : compilation Android réussie mais contrôle certificat échoué (certificat produit 19268264…, attendu 128b1bb0…) ; émulateur : échec rollback `IllegalArgumentException: repertoire` causé par ancien état vide sans tableaux. Éviter de présenter cette APK comme mise à jour sûre. Correction par `ScriptedDialogue.canonical` + tests de sauvegarde, état associatif borné (24 liens), continuité des scénarios, pénalité des 8 structures précédentes. Après échec pré-audio de Piper, secours Android local maintenu pour la session et motif journalisé/affiché ; si PCM déjà commencé, stop sans rediffusion. Audit de couverture du lexique sur les 18 000 répliques ajouté à la CI. Rien ne prouve encore que toutes les phrases soient prononçables par Piper ni que la voix soit stable sur le Samsung. Aucun merge ni Release.


### 31/10/2026 — BONZE-037, dérive lexicale et provenance des APK
Audit CI initial `41133559517` : 89,39 % des 18 000 combinaisons lexicalement couvertes (20 mots inconnus). Reformulation de 22 expressions de 200 bases sémantiques/162 postures, sans détruire l'unicité (18 000) ni la limite 220 caractères. Audit CI `41167872445` : **100 % de couverture sur ces 18 000 expressions**, mais 12 mots OOV dans les 183 cartes initiales / substitutions lexicales. Les corrections successives ont réduit à 7 OOV (`41167966841`) : `hihi`, `contentons`, `manquants`, `astronaute`, `pixels`, `blessants`, `cultivons`. Tous les sept reformulés au commit `71bee685b` : audit lexical de la CI `41168090932` **réussi, 0 OOV nouveau et ancien**, y compris synonymes. **Validation lexicale distincte d'une écoute de Piper.** Signature de notre APK debug éphémère toujours incompatible avec la série prérelease. Une 0.7.0-dev existe par ailleurs (`feature/bonze031-dialogue-natural-v1`, commit `fdd4ba9`), non intégrée ici : ne surtout pas réintroduire versionCode 6 ni remplacer ses données par mégarde.
