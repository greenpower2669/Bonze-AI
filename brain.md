# Bonze AI — mémoire vivante

Un humain de référence par instance, enfant ou adulte, lié par découverte progressive. Les autres peuvent converser ; seules les actions authentifiées du propriétaire modifient les missions.
Invariants : curiosité, respect de tous, apprentissage, progrès, sincérité sur les limites. Les émotions sont simulées et ne rendent pas les connaissances vraies.
Miroir : compétences jamais testées, testées, à revérifier ; preuves d'échecs et réussites, apprentissage validé. Mémoire sociale des personnes connues sans présomption de compétence d'après leur âge.
Souvenirs consolidés selon importance, émotion simulée et répétition, mais statut de vérité indépendant. Mémoire courte, durable et archives à concevoir.
Modes : transcription française locale, précise, économique, secours texte, désactivée ; bascule selon ressources, microphone coupé par humain toujours prioritaire.
Avatar très léger et mignon : grands yeux pixelisés, sourcils, sourire, rougeurs ; expressions et skins. Un seul noyau Web/PWA et Android APK/AAB.

Android 0.1.0 : WebViewAssetLoader, sans permission INTERNET, même noyau empaqueté au build ; voix à la demande avec SpeechRecognizer on-device seulement, jamais de fallback réseau ; saisie clavier prioritaire. App debug, non destinée à Play Store.

**0.2.0** : implémentation réelle micro-MoE entraînée (8 petits experts top-2, 304 poids sur 64 phrases) associée à un seul LLM dense préentraîné LiquidAI LFM2.5-230M, Q4_K_M GGUF ~153 Mo. Ce dernier n'est pas MoE en lui-même. Kotlin/llama.cpp hors ligne, poids téléchargés et vérifiés à la construction, modèle désactivable ; avertissements honnêtes en cas de saturation mémoire. Pas de fallback cloud. Les hallucinations restent possibles.

**0.3.0 expérience accessible (demande Fab)** : visage principal toujours visible, grandes expressions et sous-titres fort contraste dimensionnables, conversation au toucher puis aucun bouton pour chaque phrase. Tour de parole STT local -> génération locale -> synthèse vocale locale -> STT ; jamais d'écoute automatique au démarrage, stop explicite, arrêt dès arrière-plan ou mémoire critique. Après 3 absences de parole consécutives, stop et invitation à relancer, pas de boucle permanente. Appareil sans moteurs locaux : clavier facile d'accès. État des 8 mini-experts maintenu ; ne PAS prétendre qu'ils constituent déjà le MoE indépendant complet imaginé.


## Contrat étendu Fab — 29/10/2026

Reprise globale : véritable MoE avec tronc partagé et sous-réseaux experts entraînés impliqués dans l'inférence ; huit tendances émotionnelles persistantes et directionnelles ; individualité innée locale, personnalisée et acquise séparées ; visage toujours visible et continuellement piloté par les états ; voix Piper française locale cohérente ; conversation mains libres avec arrêt prioritaire ; endurance globale ; mémoire personnelle/sociale, consolidation/oubli/archives et miroir des compétences avec preuves. Découverte progressive de l'humain, enfant compris, sans présumer de ses compétences ; reconnaissance et autorisation de modifier les missions distinctes. Les faits et le respect ne dépendent jamais des émotions. Pas de faux souvenirs, fausse conscience ou faux progrès neuronal.

L'apparence innée varie par seed durable : yeux (forme/taille/espacement), sourcils, sourire, couleur, joues, corps, pousse/décoration, mouvement. Le tempérament varie légèrement et peut évoluer ; curiosité, respect, gentillesse et protections essentielles restent invariants. Éditeur accessible facultatif, presets, skins, contraste renforcé et descriptions vocalisables. Personnaliser ou revenir à l'apparence de naissance préserve les acquis et souvenirs. Le retour aux dispositions de repos tient compte des adaptations individuelles.

### 0.4.0 — prérelease construite et vérifiée en CI

Identité versionnée avec graine 128 bits générée une fois, morphologie et tempérament déterministes ; trois couches distinctes et historique borné des changements. Migration de la clé 0.3 sans effacer surnom/historique. Forces et endurance persistées, évolution continue durant l'activité de premier plan ; adaptations bornées par échanges, sans preuve de vérité. Projection graphique continue indépendante de l'étiquette de la dernière phrase. Presets/éditeur avancé, retour à la naissance, contraste et mouvements réduits.

Sessions vocales et générations identifiées, callbacks périmés rejetés, bouton d'arrêt global permanent, annulation du tour JS et arrêt TTS/micro au fond. Un calcul llama.cpp déjà lancé n'est pas préempté : son résultat est invalidé. Modes précis/éco/léger/texte/pause et désactivation neuronale persistante. Métriques Android demandées explicitement : mémoire système, PSS du processus, durée et CPU du thread appelant de la dernière génération ; aucune valeur prédite n'est présentée comme mesure.

Prompt court avec nom et valeurs essentielles. LFM dense inchangé, Piper absent. Étude primaire et critères de preuve dans docs/moe-piper-study.md. Voix Android locale et STT dépendent des paquets installés ; aucune validation physique n'est acquise. Authentification familiale et mémoire sociale chiffrée restent absentes.


Validation du commit e60d8876d1e997c031c788fdbd82663124a614aa : workflow 40858508226 réussi, 27 tests JS, garde Java, 28 assertions navigateur, assembleDebug + lintDebug, inspection du package fr.bonzeai.companion / code4 / version0.4.0, permission RECORD_AUDIO seule dans le manifeste compilé. Signature APK vérifiée par apksigner. Asset Release de 161191354 octets, SHA-256 4e74415462df28060a30ef116b6a0ceccc9ffeda84da8fe7cf431391fcf8850d. Tests Samsung physiques et réalisation du reste du contrat toujours ouverts. Main reste f5910311f903d8ae4378d62d100129b690fc0e85.

## Avenant Fab après essai 0.4 — 29 octobre

Fab demande maintenant la continuité d'une conversation déjà activée lorsque le téléphone passe en veille. L'ancien arrêt systématique à tout arrière-plan devient une limite à corriger ; l'arrêt humain reste absolu et aucune nouvelle écoute ne doit naître d'une simple extinction/réouverture. Architecture cible : service Android au premier plan avec arrêt accessible, état et cognition indépendants de la WebView. Ce comportement n'est pas encore implémenté.

Retour d'expérience : langage trop auto-descriptif et participation insuffisante au jeu de rôle, tête trop petite et bouche peu visible pendant la parole, voix robotique. Priorités : contexte de scène/historique, incarnation faciale et taille, voix locale plus naturelle. Les rappels identitaires répétés ne sont pas un objectif de sincérité. Rapport d'audit ciblé à la racine ; aucune nouvelle réalisation revendiquée avant tests.

## Correction autorisée par Fab — 0.5.0 livrée en prérelease

Boucle STT/inférence/TTS/historique portée par ConversationService (service Android au premier plan), indépendante de la visibilité de l'Activity. Démarrage app visible après action/permissions, notification Arrêter ; aucun redémarrage système automatique. L'arrêt invalide les autorisations en file, reconnaissances et générations. Dix minutes de silence mettent la conversation en pause. Wake lock CPU de 120s renouvelé seulement durant la session autorisée et libéré à l'arrêt. Autorisations FGS micro/lecture, notifications et wake lock ajoutées ; aucune permission Internet.

Historique natif limité à30 entrées, migration unique depuis0.4 et réconciliation sans recompter les échanges existants. Le modèle reçoit les échanges récents et un contexte de jeu bornés ; prompt plus incarné et température0.45, contexte2048. Ce réglage ne prouve pas encore une meilleure qualité réelle du langage français, à évaluer sur appareil.

Visage élargi en portrait ; bouche remplie et visible pilotée par événements de lecture et plages de mots quand le moteur en fournit, repli animé approximatif sinon. Les descriptions vocales et la voix navigateur utilisent le même moteur graphique. Choix d'une voix française locale déterministe et conservé ; segmentation des phrases, pauses et modulation douce du débit/hauteur. Piper n'est pas embarqué dans cette correction.


Preuves de livraison 0.5 : commit ff04ec4203bb7cfe9ca412d8814a09b16643bb8c, workflow #40868793495 réussi ;35 tests JS,4 programmes de tests JVM et34 assertions navigateur, compilation+lint. APK code5/version0.5.0,161213280 octets, SHA-256 e5d12f3357e463232db7d2dea94663c53cf0ffd8cbdb99a89efff05572eacdee. Certificat public 128b1bb0d488f33dd9075888ee15d6ff943136d657018026d1e0b22d9c35991d, différent de0.4 ; continuité de mise à jour depuis0.4 impossible sans migration/retrait préalable de l'ancienne app. Ne pas faire perdre les données sans consentement. Clé de test désormais sauvée en cacheCI v2 (rétention limitée), aucune clé de production.

## Avenant 0.5.0 du 29 octobre — travaux ouverts

Les huit experts doivent chacun contribuer au calcul de comportement/arbitrage, avoir force et endurance propre ; fatigue, récupération et influences restent expérimentales, jamais preuves de vérité. Journal privé des opérations réelles, console authentifiée avec alternative accessible au geste60touches, sauvegarde chiffrée/versionnée incluant identité, acquis, poids et traces. Priorité aux répétitions de dialogue signalées et aux sous-titres qui se chevauchent. Piper doit être intégré réellement puis validé hors ligne et à l'écoute ; une étude ou compilation seule ne suffit pas. Les missions BONZE-023..029 sont ouvertes.

Candidat avenant : correction d'affichage en cours ; sauvegarde AES-GCM/phrase secrète et accès administrateur via code de verrouillage Android implémentés localement, validationCI encore attendue. L'authentification de l'appareil ne constitue pas une gestion familiale multi-rôles. Journaux techniques locaux bornés, jamais exposés en conversation ; les journaux ne sont pas des pensées neuronales inventées.


## État 0.6.0 candidat — 29 octobre 2026
Code de la voix Piper française réellement intégré (sherpa 2.0.1 + Siwis int8 + lexique MIT, pas d'eSpeak), AudioTrack et bouche sur amplitude jouée ; Android de secours pour mots inconnus. Essai comparatif accessible par phrase fixe dans Options. Conseil partagé JS/Rhino : huit activations entraînées + votes contextualisés, endurances individuelles, influences et arbitre transmis au générateur. Les politiques restent écrites à la main ; pas de MoE linguistique complet.
Sous-titres périmés et chevauchement corrigés. Le dernier message est séparé du contexte humain ; répétitions et sorties journalisées. Le 230M demeure faible en français/jeu, même en contexte neuf, à température 0,1 et avec début de séquence vérifié. Ne pas déclarer cette limite résolue.
Sauvegarde chiffrée, restauration/retour arrière, console Android authentifiée et curseurs intégrés. Migration des acquis et poids corrigée après revue. Historique et traces sont bornés. Tests/compilation 0.6 passent, mais premier essai Android a révélé un VerifyError dans Piper : moniteurs de méthodes séparés, nouveaux essais requis. Publication seulement après tous les jobs verts ; écoute humaine/Samsung restent nécessaires. Aucun merge main.

Blocages supplémentaires à résoudre avant publication : crash natif pendant le test Piper (40956583835), logcat ajouté pour le diagnostic ; la voix Siwis dérive de Lessac medium dont le corpus source a une licence de recherche non commerciale. Ne pas confondre l’étiquette MIT du dépôt de voix et cette filiation. Publication suspendue pendant vérification/remplacement.

### Correction de voix avant livraison
Le crash natif 40957409320 est prouvé : sherpa JNI attend invoke(float[]) -> Integer ; une lambda Kotlin 2.0 indy n’expose que la méthode effacée, causant NoSuchMethodError puis SIGABRT. PiperCancellation.java fournit explicitement cette signature ; assertion instrumentée ajoutée. La voix Siwis est remplacée par Piper MLS medium, locuteur 0 fixe : fiche entraînée depuis zéro, corpus MLS CC-BY 4.0 (OpenSLR94), poids SHA-256 0ed223f7…34e162. Ajout des seules métadonnées/tokens selon sherpa, sans réentraînement. Cela évite la filiation Lessac/Ryan à licences de recherche/NC. Les voix Gilles, MLS_1840, Tom et Miro ont aussi été écartées pour filiation/conditions spécifiques. Publication seulement si génération/lecture/arrêt/restauration Android et signature sont verts ; écoute humaine toujours ouverte.

Lexique : le nouveau probe MLS a révélé des nasales combinées absentes comme tokens uniques (ɔ̃, ɑ̃). Conversion vers les vrais tokens de la voix, sans perdre le signe nasal ; entrée exclue si un symbole demeure inconnu, puis secours Android. Tests Python ajoutés. Le probe utilisait aussi un constructeur Python GenerationConfig avec argument non supporté ; appel corrigé.

MLS : synthèse hôte réelle réussie 40958317324 ; 90 113 entrées compatibles après conversion. Le signal du probe avait une crête faible (0,023), d’où un gain borné (×20 maximum) sur le PCM réellement joué et le RMS de bouche. Entrée vocale mise en minuscules comme la vérification du lexique. Test JVM DSP ajouté ; transcription indépendante du WAV en cours, sans remplacer l’écoute humaine.

Cause phonétique prouvée par le code sherpa v2.0.1 : le lexique à tabulations activait le frontend générique ; seul le nouveau format « mot || phonèmes » active le chemin Piper avec BOS/pad/EOS. Signal trop court/faible donc non suffisant comme preuve d’intelligibilité. Export du lexique vers ce nouveau format, puis génération et transcription de contrôle à relancer avant écoute humaine.

Contrôle supplémentaire : la transcription indépendante du premier WAV ne retrouvait pas la phrase demandée, malgré les tests PCM verts. Publication maintenue suspendue. Comparaison de plusieurs locuteurs MLS et de phonèmes de référence eSpeak (outil de test hôte uniquement, jamais embarqué) pour isoler la cause ; pas d’assimilation de « son produit » à « parole intelligible ».

Comparaison 40959770234 : les mêmes poids MLS deviennent compréhensibles avec les phonèmes de référence, pour plusieurs locuteurs ; la source du défaut est donc le chemin phonétique, pas seulement le timbre. Adaptation explicite des conventions gruut vers celles du modèle français (ɲ→nj, ɥ→y, accent lexical final), sans embarquer ni extraire le code/données du phonémiseur GPL. Tests de transformation et nouvelle transcription nécessaires ; publication toujours suspendue.
