# TODO Bonze AI

## État courant — 0.5.0 livrée

Prérelease et APK direct vérifiés (commit ff04ec4, CI #40868793495). Le service de conversation, le contexte, le visage et la parole sont produits pour essai sur Samsung. Restent prioritaires : veille physique, qualité du dialogue/voix, conservation des données face au changement de signature, puis Piper et MoE linguistique. Aucun merge main.

## Démonstrateur initial
- [x] Branche de développement séparée de main.
- [x] Noyau JavaScript commun, émotions, miroir de compétence, modes d'écoute.
- [x] Interface textuelle, avatar animé, profil local, manifeste PWA, tests.
- [x] Consigner commandes et limites dans les mémoires vivantes.

## À construire et vérifier
- [ ] Contrôler l'installation et le fonctionnement PWA sur vrai Android, mode avion inclus.
- [ ] Mesurer mémoire, précision et latence des moteurs STT français hors ligne et choisir un repli sûr.
- [x] Ajouter conteneur Android, pont STT local sur appareil, et workflow de construction APK debug (à vérifier en CI).
- [x] Compilation Android CI réussie ; prérelease APK direct vérifiée (workflow 40801461773, SHA-256 publié).
- [ ] Installer l'APK et tester l'écoute strictement locale sur un Android 16 réel.
- [ ] Construire et signer AAB de production seulement après validation.
- [ ] Ajouter identification propriétaire forte, coffre mémoire chiffré et autorisations de missions.
- [ ] Ajouter mémoire sociale, souvenirs consolidés, répétitions, archivage, tests de correction.
- [ ] Implémenter compréhension locale plus riche sans inventer de faits, gérer les émotions complexes.
- [ ] Vérifier conformité sécurité, accessibilité, protection données ; préparer hébergement HTTPS si validé.
- [ ] Faire accepter le premier prototype par Fab avant merge dans main.

- [x] Réparer le blocage de préparation SDK GitHub Actions (legacy 'tools').

## Livraison 0.2.0 micro-MoE / LLM
- [x] Apprentissage supervisé 8 experts et sélection parcimonieuse top2, tests unitaires.
- [x] Pont Kotlin pour un modèle de langage local partagé et réutilisé, intégration UI et désactivation manuelle.
- [x] CI Kotlin/Gradle réussie : téléchargement GGUF 153 Mo avec contrôle SHA-256 et production APK debug 0.2.0 dans run #40837391687.
- [x] Release bonze-ai-v0.2.0-moe avec APK direct vérifié (161 172 983 octets).
- [ ] Installer sur Samsung Android 16 : confirmer chargement GGUF et vraies réponses, RAM, latence, mode avion, désactivation et écoute vocale.
- [ ] Audit licences tiers AAR et LiquidAI pour diffusion au-delà de la phase de recherche ; reporter la signature production.

## Accessibilité / conversation 0.3
- [x] Visage persistant, sous-titres très contrastés + taille réglable, clavier secondaire.
- [x] Un seul appui pour démarrer : chaque transcription vocale est envoyée automatiquement, réponse lue par TTS français local puis nouvelle écoute.
- [x] Aucun démarrage automatique ni réseau, bouton stop, repli texte, anti-double tour et tests associés.
- [ ] Mesurer sur Android 16 le STT hors ligne et le TTS français réellement disponibles, interruptions, pauses, pressions mémoire.
- [ ] Tester des échanges longs avec le modèle 230M ; corriger rapidement toute fermeture ou hallucination.
- [ ] Respecter le contrat MoE complet : micro-MoE actuel n'est pas le MoE expert multiréseaux envisagé ; auditer les architectures de vrais experts avant nouvelle promesse.

## Livraison vérifiée 0.3.0
- [x] GitHub Actions #40843431509 : compilation Android réussie, APK direct signé debug publié.
- [x] Tests de la session anti-doublon, sécurité après stop, boutons et légendes : GitHub CI verte.
- [ ] Essai réel avec TalkBack / très gros caractères, moteur STT français local, moteur TTS français local, mode avion et pause/reprise sur Samsung.
- [ ] Enquêter sur une architecture véritablement MoE indépendante des petits routeurs émotionnels actuels (demande de Fab toujours ouverte).


## Reprise globale du 29 octobre — 0.4.0

- [x] Lire AGENTS et les cinq mémoires, auditer sources/poids/branches/CI/Releases ; 17 tests initiaux verts.
- [x] Créer identité innée déterministe et persistante + personnalisation séparée + acquis ; migration de l'historique conservée.
- [x] Huit forces persistantes et influences directionnelles, endurance globale, projection continue du visage.
- [x] Éditeur accessible, presets, descriptions vocalisables via voix locale disponible, contraste et mouvements réduits.
- [x] Invalidation des générations/sessions et callbacks anciens, garde de permission/premier plan et TTS unique, bouton Stop toujours accessible.
- [x] Désactivation des neurones persistante, cinq modes, métriques réelles Android à la demande, prompt court.
- [x] 27 tests JS, test JVM et 28 assertions navigateur validés en CI 40858508226.
- [x] Étude primaire Piper/MoE, critères d'ablation/qualité/ressources et limites de licences documentés.
- [x] Validation navigateur/JVM, build Android, lint, manifeste compilé et signature : run 40858508226 réussi.
- [x] Prérelease bonze-ai-v0.4.0 et APK direct vérifiés, tag au commit e60d887 ; 161191354 octets ; SHA-256 4e74415462df28060a30ef116b6a0ceccc9ffeda84da8fe7cf431391fcf8850d.
- [ ] Essai Samsung : première permission puis Stop, stop pendant génération/TTS, fond/reprise, mode avion, écho, pauses longues, TalkBack et grossissement.
- [ ] Piper français : build d'étude avec notices complètes, tests interruption/latence et écoute de la voix par Fab ; pas intégré dans 0.4.
- [ ] Véritable MoE linguistique : backend/adaptateurs experts/routeur entraînés au sein de l'inférence, corpus et évaluations tenues à l'écart ; pas réalisé dans 0.4.
- [ ] Mémoire sociale chiffrée et autorisations familiales fortes, consolidation/oubli/archives, miroir de compétences enrichi : commandes maintenues ouvertes.
- [ ] Stabiliser durablement la signature de test et préparer clé de production sauvegardée avant distribution stable. Ancienne clé debug absente ; ne pas recommander de désinstaller si données à préserver.

État lors de la livraison précédente : 0.4.0 livrée sur feature/offline-bonsaiv1, PR #1 en brouillon, main inchangée. Preuves CI et incidents intermédiaires conservés dans debughistorical.md. La revue indépendante a produit deux corrections appliquées : ordre des threads stop/génération et compatibilité String Android 12. Aucun autre défaut important confirmé par cette revue.

Prochain geste : installer et tester l'APK sur Samsung sans effacer les données de l'ancienne installation ; si Android refuse la signature de mise à jour, conserver l'installation et traiter la migration avant toute désinstallation. Après retour de Fab, poursuivre le build d'étude Piper et l'adaptation MoE linguistique selon docs/moe-piper-study.md.

Blocage signature durable : le cache de clé debug a signalé un chemin absent lors du run 40858508226 et n'a rien sauvegardé. Ne pas annoncer une clé stabilisée ; rechercher le keystore réellement utilisé et mettre en place une sauvegarde privée avant la prochaine distribution. Certificat public 0.4 : SHA-256 d30a6cc0ca0b20cae35ee82a82bf162561ae5eae6c42b24f6a20d53c58fc3c14. Aucun secret ou keystore privé n'est enregistré dans les mémoires.

## Priorité après retour d'essai Fab — audit veille / dialogue / visage

- [x] Audit ciblé 0.4 : coupures Activity + document.hidden, contexte de dialogue non explicitement transmis, visage limité à 38vw, bouche en boucle d'amplitude ~5px, TTS Android modulé seulement en débit. Rapport : audit-2026-10-29-veille-dialogue-visage.md.
- [ ] BONZE-019 : déplacer la boucle vocale/cognition dans un service Android au premier plan démarré app visible, notification Stop ; l'UI s'abonne et se détache sans casser une conversation autorisée. Tester veille/verrouillage/arrêt/réveil sur Samsung. Ne pas simplement retirer les gardes du microphone.
- [ ] BONZE-020 : transmettre contexte court, scène de rôle et historique pertinent ; évaluer les réponses françaises et la continuité du jeu, comparer les réglages sans promettre qu'un prompt suffit.
- [ ] BONZE-021 : visage plus grand avec mise en page adaptative ; canal de lecture séparé du consentement micro, ouverture de bouche visible et pauses, synchronisation disponible par moteur/repli, autres chemins TTS compris.
- [ ] BONZE-022 : identifier la voix Samsung choisie, comparer voix locales et Piper ; rythme/pauses/prosodie dans les capacités réelles du moteur.

Prochain chantier prioritaire : conversation autorisée poursuivie en veille, puis contexte de dialogue et parole incarnée. Audit uniquement dans cette intervention ; pas de nouvel APK, aucun test physique revendiqué.

## Réalisation autorisée — candidat0.5

- [x] Service natif de conversation, notification Stop, état natif et réconciliation au réveil, interruption audio/casque et aucune reprise après mort du processus.
- [x] Garde de démarrage consommable et d'époques, contexte récent/scène transmis au LFM, migration de l'historique sans réapprendre les mêmes échanges.
- [x] Visage agrandi, bouche visible, événements de plage et repli approximatif ; choix de voix locale, segmentation et pauses.
- [x] JVM/navigateur/compilation/lint/permissions/signature et prérelease0.5.0 vérifiés : run #40868793495, commit ff04ec4 ;35 tests JS,4 programmes JVM,34 assertions navigateur.
- [ ] Tester Samsung : permission/Stop tardif, veille pendant chaque phase, réveil, notification, casque/anti-écho, mémoire et qualité du français.
- [ ] Piper demeure non embarqué ; poursuivre l'étude de licences et l'intégration dédiée après cette correction de continuité/incarnation.

Candidat5edd1c8 : tests JS et JVM CI réussis ; scénario navigateur bloqué par configuration ignorée dans le pont simulé, corrigée. Trois problèmes de concurrence de la revue indépendante corrigés : bookkeeping d'inférence, choix de voix et permission avant reprise. Prochain run inclut PendingStartTest et vérification du choix de voix asynchrone.


État courant après correction :0.5.0 livrée, APK direct dans la Release bonze-ai-v0.5.0 ;161213280 octets, SHA-256 e5d12f3357e463232db7d2dea94663c53cf0ffd8cbdb99a89efff05572eacdee. Revue indépendante effectuée, ses trois problèmes importants corrigés et contrôles complets verts. Main toujours f5910311f903d8ae4378d62d100129b690fc0e85.

Prochain geste : essai humain Samsung avec conversation lancée avant verrouillage, poursuite et arrêt depuis notification, retour au même dialogue, choix de voix et jeu de rôle. Aucun essai physique n'a été effectué ici. La signature0.5 est différente de0.4 (ancienne clé non récupérable dans les éléments accessibles) : préserver l'ancienne installation et ses données si Android refuse la mise à jour. La nouvelle clé a effectivement été sauvegardée dans le cacheCI bonze-ai-debug-signing-v2, sans garantie durable de rétention.

## Avenant0.5 — exécution courante

- [ ] Comparer générations réelles contexte aplati/rôles, tracer tours et erreurs, distinguer résultat modèle et ancien affichage.
- [ ] Régression longs sous-titres/grands caractères, correction sans recouvrir les commandes.
- [ ] Endurances/contributions/arbitrage/traces des huit modules, paramètres vérifiables.
- [ ] Console avec authentification et accès accessible, geste optionnel.
- [ ] Sauvegarde/restauration chiffrée, validation stricte, retour arrière et reprise sans micro.
- [ ] Piper réel : résolution licences, intégration/audio joué/interruption, comparaison/écoute.
- [ ] Vérifications CI/APK/signature identique0.5 et essai Samsung. Aucun merge main.

État : reprise au commit c271d31 ;35 tests JS de base verts. Revue parallèle Piper indisponible (quota de l'agent) ; recherche poursuivie par l'agent principal. Ne pas déclarer ces missions réalisées.

Affichage périmé : correction locale et2tests verts ; génération répétée encore en investigation. Test navigateur de chevauchement en attente. Aucun nouvel APK publié.

Sauvegarde/admin/journal : code local et3tests crypto verts, branchement natif en cours de validation (JVM, compilation et scénarios navigateur nécessaires). Piper : lexique MIT+runtime2.0 sans eSpeak est une piste exécutable, synthèseLinux générée mais vérification finale du probe/écoute/intégrationAndroid encore ouvertes. Génération : formats alternatifs ne suffisent pas ; isoler la réutilisation du contexte.


## Suite de l'avenant 0.6
- [x] Ancienne réponse au nouveau tour et chevauchement des sous-titres : régressions et CI navigateur.
- [x] Contributions, endurances individuelles, influences, arbitrage, logs privés et console avec authentification Android.
- [x] Sauvegarde chiffrée de bout en bout Web, migrations et contrôles avant écriture ; défauts de revue corrigés.
- [x] Intégration réelle Piper/Siwis/lexique, lecture PCM/animation/arrêt, sources et licences ; Android en secours et bouton comparatif.
- [ ] Valider la correction ART de Piper et les trois tests instrumentés (lecture/Stop, conseil persistant, restauration/retour arrière).
- [ ] Publier l'APK direct 0.6.0 après tous les jobs verts, certificat identique 0.5 ; maintenir les mémoires et la PR sans merge main.
- [ ] Essai Samsung de Fab : voix Piper à l'écoute face à Android, intelligibilité, naturel, latence/RAM/CPU, TalkBack, veille/notification/casque/écho. Ne pas clore BONZE-029 avant cette écoute.
- [ ] Corriger/améliorer la qualité neuronale française et du jeu de rôle (modèle/quantification/runtime à comparer sur un corpus mesurable). Les défauts de flux prouvés sont corrigés, pas toute la qualité du dialogue.
- [ ] Étendre la phonémisation Piper (noms, nombres, élisions) pour réduire le secours Android.
- [ ] Sous-réseaux spécialisés et véritable MoE linguistique, compétences/mémoire sociale progressive, benchmark ressources sur téléphone. Les politiques actuelles ne satisfont pas ce contrat complet.

Blocages supplémentaires à résoudre avant publication : crash natif pendant le test Piper (40956583835), logcat ajouté pour le diagnostic ; la voix Siwis dérive de Lessac medium dont le corpus source a une licence de recherche non commerciale. Ne pas confondre l’étiquette MIT du dépôt de voix et cette filiation. Publication suspendue pendant vérification/remplacement.

### Correction de voix avant livraison
Le crash natif 40957409320 est prouvé : sherpa JNI attend invoke(float[]) -> Integer ; une lambda Kotlin 2.0 indy n’expose que la méthode effacée, causant NoSuchMethodError puis SIGABRT. PiperCancellation.java fournit explicitement cette signature ; assertion instrumentée ajoutée. La voix Siwis est remplacée par Piper MLS medium, locuteur 0 fixe : fiche entraînée depuis zéro, corpus MLS CC-BY 4.0 (OpenSLR94), poids SHA-256 0ed223f7…34e162. Ajout des seules métadonnées/tokens selon sherpa, sans réentraînement. Cela évite la filiation Lessac/Ryan à licences de recherche/NC. Les voix Gilles, MLS_1840, Tom et Miro ont aussi été écartées pour filiation/conditions spécifiques. Publication seulement si génération/lecture/arrêt/restauration Android et signature sont verts ; écoute humaine toujours ouverte.

Lexique : le nouveau probe MLS a révélé des nasales combinées absentes comme tokens uniques (ɔ̃, ɑ̃). Conversion vers les vrais tokens de la voix, sans perdre le signe nasal ; entrée exclue si un symbole demeure inconnu, puis secours Android. Tests Python ajoutés. Le probe utilisait aussi un constructeur Python GenerationConfig avec argument non supporté ; appel corrigé.

MLS : synthèse hôte réelle réussie 40958317324 ; 90 113 entrées compatibles après conversion. Le signal du probe avait une crête faible (0,023), d’où un gain borné (×20 maximum) sur le PCM réellement joué et le RMS de bouche. Entrée vocale mise en minuscules comme la vérification du lexique. Test JVM DSP ajouté ; transcription indépendante du WAV en cours, sans remplacer l’écoute humaine.

Cause phonétique prouvée par le code sherpa v2.0.1 : le lexique à tabulations activait le frontend générique ; seul le nouveau format « mot || phonèmes » active le chemin Piper avec BOS/pad/EOS. Signal trop court/faible donc non suffisant comme preuve d’intelligibilité. Export du lexique vers ce nouveau format, puis génération et transcription de contrôle à relancer avant écoute humaine.

Contrôle supplémentaire : la transcription indépendante du premier WAV ne retrouvait pas la phrase demandée, malgré les tests PCM verts. Publication maintenue suspendue. Comparaison de plusieurs locuteurs MLS et de phonèmes de référence eSpeak (outil de test hôte uniquement, jamais embarqué) pour isoler la cause ; pas d’assimilation de « son produit » à « parole intelligible ».

Comparaison 40959770234 : les mêmes poids MLS deviennent compréhensibles avec les phonèmes de référence, pour plusieurs locuteurs ; la source du défaut est donc le chemin phonétique, pas seulement le timbre. Adaptation explicite des conventions gruut vers celles du modèle français (ɲ→nj, ɥ→y, accent lexical final), sans embarquer ni extraire le code/données du phonémiseur GPL. Tests de transformation et nouvelle transcription nécessaires ; publication toujours suspendue.

Probe 40960582870 : avec les mêmes phonèmes de dictionnaire, l’entrée directe codepoints est bien plus intelligible que le frontend texte-lexique (ASR retrouve « je suis ton petit compagnon ... tu veux jouer ... avec moi »). PiperPhonetics prépare désormais l’IPA complet de chaque segment avant tout son ; génération via GenerationConfig.phonemeCodepoints, sans frontend texte ni phonémiseur externe. Tests : nasales combinées, frontières de mots, chiffres/inconnus refusés avant parole. Nouvelle surcharge callback à revérifier réellement sur Android ; transcription de trois phrases du chemin exact en cours.
