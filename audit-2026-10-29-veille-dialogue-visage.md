# Audit ciblé — veille, dialogue naturel et visage

29 octobre 2026 — demande de Fab après essai de Bonze AI. Source auditée : prérelease 0.4.0 (`e60d887`) et branche `feature/offline-bonsaiv1` (`205c70f`, documentation seule ajoutée depuis). Audit du code et sources Android ; aucune modification fonctionnelle ni nouvelle compilation dans ce tour. Les 27 tests existants passent, mais ne couvrent pas ces critères de qualité.

## 1. Conversation interrompue à la veille — cause confirmée, priorité bloquante

`MainActivity.java:259` appelle `voice.pause()` et `stopConversation()` à chaque `onPause()`. Cela invalide la génération, détruit la reconnaissance et interrompt la synthèse. La garde `VoiceSession` impose elle aussi une Activity au premier plan. `docs/app.js:196` ajoute un arrêt à `document.hidden`. Le manifeste ne déclare aucun service de conversation. La disparition de l'Activity entraîne donc volontairement une fin de session ; ce constat ne permet pas d'attribuer la coupure à RAM Plus, Samsung ou Doze.

Le contrat initial exigeait un arrêt au fond ; Fab demande maintenant explicitement que la conversation déjà activée continue écran éteint. Cet avenant remplace cet ancien comportement cible pour la session autorisée, et préserve l'arrêt humain prioritaire.

Correction à réaliser : transférer session, STT, inférence, TTS et contexte de dialogue dans un service Android au premier plan, indépendant de la WebView. Le démarrer pendant que l'app est visible, après activation et permission micro ; déclarer les types et permissions requis, notification permanente avec action Arrêter. L'Activity s'abonne à l'état et s'en détache sans tuer la session. L'UI retrouve conversation et état au réveil. Pas de nouveau départ après Stop, reboot ou arrêt système. Ne pas se contenter de retirer onPause, de garder l'écran allumé ou d'espérer que les timers JS continuent.

Android documente le type `microphone` pour continuer la capture en arrière-plan. Les restrictions Android 14 imposent notamment de démarrer le service avec les permissions d'utilisation en cours pendant que l'app est visible, hors exemptions précises. Il faudra mesurer le fonctionnement du STT on-device fourni par Samsung et l'autonomie. Un wake lock CPU partiel ne se justifie qu'après mesure, avec durée et libération bornées ; il ne constitue ni une permission micro ni une garantie de survie du processus.

Sources primaires :
- https://developer.android.com/develop/background-work/services/fgs/service-types#microphone
- https://developer.android.com/develop/background-work/services/fgs/restrictions-bg-start
- https://developer.android.com/develop/background-work/background-tasks/awake/wakelock
- https://developer.android.com/reference/android/speech/SpeechRecognizer

## 2. Dialogue qui casse le jeu de rôle — limites confirmées, origine des phrases non reproduite

`BonzeInference.kt:33–37` utilise déjà un prompt court et ne commande plus « tu es un programme, pas une personne ». Les formulations rapportées (« je suis une IA », « conçu pour… », autopromotion) ne peuvent donc pas être attribuées honnêtement à une interdiction explicite présente dans ce prompt. Aucune trace audio ou sortie de modèle complète fournie ici ne permet de reproduire leur déclencheur exact.

Le modèle ne reçoit explicitement que la dernière phrase et un nom d'humeur. L'historique stocké côté JS n'est pas envoyé dans cet appel. Le tronc réutilisé ne prouve pas une mémoire conversationnelle. Le contexte de rôle, le surnom, les dispositions et l'histoire de la scène ne sont pas explicitement transmis. La température 0,1 peut contribuer à des formulations répétitives ; c'est une hypothèse de réglage, pas une cause suffisante démontrée. La petite capacité du modèle peut aussi limiter la qualité française et la tenue du rôle, à mesurer plutôt qu'à supposer.

Correction à réaliser : contexte de dialogue court avec rôles humain/Bonze, scène en cours, nom/préférences autorisées et quelques états pertinents ; prompt affirmatif « Bonze, petit compagnon curieux, participe naturellement aux histoires et jeux de son humain » ; sincérité quand la nature du système est réellement demandée, sans répétition hors sujet. Évaluer des exemples français de jeu de rôle et de questions ordinaires avant/après. Vérifier le template de chat réel de l'AAR avant de conclure sur sa mémoire interne. Si nécessaire, comparer une adaptation ou un modèle conversationnel local avec mesures RAM/latence et qualité ; ne pas multiplier les grands modèles ni ajouter une banque de réponses cachant les ratés.

Critères : « Tu es le gardien de la forêt », puis « Qui arrives-tu à apercevoir ? », puis « Comment s'appelle notre forêt ? » ; continuité du rôle, réponse naturelle et souvenir d'un nom réellement donné. Questions sur son identité : réponse sincère, sans prétendre à une conscience réelle. Vérifier aussi absence d'autopromotion répétitive et maintien du respect.

## 3. Visage trop petit — cause de mise en page confirmée

`docs/style.css:80–82` borne la scène à 27dvh et le bouton visage à 38vw (maximum 260px), puis applique encore 89 % de largeur au visage. Sur un écran de 393px de large, la largeur nominale du personnage est d'environ 133px, hors autres contraintes. L'ancienne règle plus grande en début de feuille est remplacée par ces règles ultérieures. Le test navigateur actuel vérifie la présence à l'écran, pas une taille de lecture suffisante.

Correction proposée : augmenter la présence visuelle d'environ 40 à 50 % en portrait comme point de départ de maquettage, conserver proportions lisibles, Stop et sous-titres. Adapter les petits écrans, le paysage, le clavier et le panneau de réglages ; ne pas employer un simple transform agrandissant dans des éléments qui le coupent. Priorité au visage, conformément au retour de Fab ; mains pas demandées à cette étape.

## 4. Bouche et parole peu reliées — cause confirmée

`core/organism.mjs:53` ajoute 8px fixes lorsque l'activité est speaking. `docs/style.css:72,77,92` fait ensuite osciller la hauteur entre sourire +8 et sourire +13 : amplitude d'environ 5px. La bouche est surtout un bord courbe et ne forme pas une ouverture clairement remplie. Son oscillation est une boucle temporelle, indépendante des mots, pauses et sons. Le mode mouvements réduits supprime aussi cette boucle.

`MainActivity.java:226–235` n'envoie que début/fin/erreur ; pas d'informations de plage de texte ou de phonème. La lecture optionnelle navigateur n'envoie pas de début/fin à l'avatar. La description vocale Android hors session est aussi filtrée par la garde JS session.enabled. Ces chemins ne bénéficient donc pas d'une animation de parole homogène.

Correction à réaliser : canal de parole distinct de l'autorisation d'écoute, début/fin/interruption fiables, bouche avec ouverture visible et formes arrondie/étirée/fermée, pauses perceptibles ; petits mouvements de sourcils, regard et tête proportionnels au contexte émotionnel. Utiliser `onRangeStart` si le moteur fournit ces informations, avec repli explicite et testable. Pour une synchronisation audio plus directe, analyser l'enveloppe du PCM réellement joué lors d'une chaîne de synthèse/lecture contrôlée ; ne pas confondre son moment de génération avec le moment entendu. Aucun suivi phonémique précis n'est acquis actuellement.

Source : https://developer.android.com/reference/android/speech/tts/UtteranceProgressListener#onRangeStart(java.lang.String,int,int,int) . Android indique que ce callback dépend des informations fournies par le moteur.

## 5. Voix trop robotique — chaîne actuelle confirmée, qualité sonore non mesurée ici

Le code sélectionne une voix Android française ne nécessitant pas le réseau, puis modifie uniquement le débit entre environ 0,92 et 1,01 selon l'humeur. Aucun Piper embarqué et aucun véritable pilotage de prosodie émotionnelle dans la version 0.4. Le timbre exact effectivement installé sur le téléphone n'est pas identifié par les données de cette session.

Correction à réaliser : identifier et écouter la voix réellement sélectionnée, tester une voix locale cohérente et claire ; intégrer l'étude Piper déjà ouverte, ses licences et des essais comparatifs. Gérer rythme, segmentation, pauses et débit avec modération ; un changement de moteur ne garantit pas à lui seul l'expressivité. Garder une seule identité vocale et coupler l'animation au signal de lecture réel.

## Ordre et validation proposés

1. Architecture de conversation écran éteint + notification Stop et tests de cycle de vie.
2. Contexte conversationnel/rôle et évaluation qualitative du langage, sans effacer les valeurs essentielles.
3. Agrandissement du visage et animation de parole liée à la lecture réelle.
4. Voix locale/Piper, écoute comparative et mesures de ressources.

Tests physiques nécessaires : extinction pendant écoute, génération et parole ; échanges poursuivis plusieurs minutes écran verrouillé, réveil retrouvant le même tour, arrêt depuis notification, casque et haut-parleur (anti-écho), appels/perte audio, absence de redémarrage après arrêt. Conserver le fonctionnement hors ligne, l'identité et les souvenirs. Aucun résultat de ces tests n'est revendiqué par cet audit.
