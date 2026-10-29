# TODO Bonze AI

## État courant — 0.6.0 publiée pour essai

Prérelease 0.6.0 et APK direct vérifiés, commit 14757d3, run 40964127638. Suite : écoute et veille Samsung, amélioration du français neuronal et du phonémiseur, puis vrai MoE et mémoires/permissions familiales. Aucun merge main.

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

## Prochaines étapes 0.6

- [x] Ancienne réponse au nouveau tour, disposition, conseil partagé/endurance/arbitrage, console authentifiée et sauvegarde chiffrée implémentés avec régressions et revue indépendante.
- [x] Piper MLS medium locuteur 0 intégré ; trois tests Android hors connexion passent dans 40961214052 (PCM/Stop, conseil persistant, restauration/retour arrière). Certificat de livraison identique 0.5 contrôlé par CI.
- [x] Chemin IPA direct et dictionnaire compatible ; conserver les réponses courtes ensemble pour éviter la dégradation des segments trop courts. Régression SpeechPlan ajoutée.
- [x] Valider le commit final14757d3 / run 40964127638 : 45 JS, 3 Python, 8 programmes JVM, 51 assertions navigateur, APK/lint/signature, trois tests Android et transcription indépendante de trois phrases.
- [x] Publier et vérifier la prérelease 0.6.0 avec APK direct, SHA et certificat ; mettre à jour PR/mémoires sans merge main.
- [ ] Essai Samsung de Fab : écoute Piper face à Android, intelligibilité/naturel, latence/RAM/CPU, TalkBack, veille/notification/casque/écho. BONZE-029 reste ouvert jusqu’à cette écoute.
- [ ] Améliorer la qualité française/jeu de rôle du 230M par comparaison mesurable de modèles/runtime/quantification. Défauts de flux prouvés corrigés ; qualité du modèle toujours limitée.
- [ ] Étendre la phonémisation (noms/nombres/élisions), réduire le secours Android.
- [ ] Vrai MoE linguistique/sous-réseaux spécialisés, mémoire sociale et autorisations familiales, consolidation/oubli, miroir des compétences : contrats toujours ouverts.
- [ ] Sauvegarde privée durable de la clé de test/production ; le cache CI v2 n’est pas une garantie de rétention.

Publication conditionnée aux tests Android et au probe vocal vert au même SHA. Pas de prétention à une écoute humaine ni à des mesures Samsung. Notes intermédiaires archivées dans sauvegarde.md et docs/history/avenant-0.6-worklog.md.

Prochain geste humain : installer en mise à jour de0.5, Options → « MLS · ma voix Piper locale » → phrase d’essai, comparer Android ; conversation activée avant verrouillage, Stop notification puis confirmer absence de reprise. Ne pas désinstaller pour contourner une signature. Mesures Samsung/TalkBack/écho et écoute nécessaires ; aucune promesse de poursuite en arrière-plan par l’agent.

### Preuves de livraison 0.6.0 — 29 octobre 2026
- Tag bonze-ai-v0.6.0 au commit 14757d3ba01c13d6774b82459f04b3b0a499c6a7 ; prérelease publiée, APK direct : 271 170 701 octets.
- SHA-256 APK : 657689ccf72068343c6c6d6f086e75e24c17516c5db86a8752ea0378e95bb8a0. Certificat 128b1bb0d488f33dd9075888ee15d6ff943136d657018026d1e0b22d9c35991d, identique à 0.5 ; clé toujours en cache de test, sauvegarde privée durable ouverte.
- Workflow 40964127638 entièrement réussi : 45 JS, 3 Python, 8 programmes JVM, 51 assertions navigateur, compilation/lint/manifeste/signature, 3 tests Android API 35 hors connexion et publication. Probe vocal 40964127723 vert au même SHA. Capture finale inspectée, visage/légendes/Stop visibles.
- APK : https://github.com/greenpower2669/Bonze-AI/releases/download/bonze-ai-v0.6.0/Bonze-AI-v0.6.0-debug.apk ; Release : https://github.com/greenpower2669/Bonze-AI/releases/tag/bonze-ai-v0.6.0 ; CI : https://github.com/greenpower2669/Bonze-AI/actions/runs/40964127638 .
- Revue indépendante des changements effectuée. PR #1 en brouillon ; main vérifiée inchangée f5910311f903d8ae4378d62d100129b690fc0e85. Aucun essai physique Samsung ni écoute humaine revendiqués. Archives : sauvegarde.md et docs/history/avenant-0.6-worklog.md.

## Demande Fab — 30 octobre 2026 : mémoire à tiroirs (à développer)

- [ ] BONZE-030 : donner à Bonze AI une mémoire locale à tiroirs : carte centrale légère, catégories privées/isolées, chargement à la demande et recherche bornée par contexte ; ne jamais ingérer toute la mémoire à chaque réponse.
- [ ] Définir schéma versionné, niveaux de fiabilité/provenance, consolidation, correction, oubli et archivage ; budgéter tokens, RAM, temps et stockage en mode avion.
- [ ] Préserver/migrer non destructivement les souvenirs déjà stockés et l'export chiffré `.bonze` ; spécifier droits propriétaires/famille avant rappel de souvenirs sensibles ; vérifier les limites de chiffrement interne existant.
- [ ] Prototyper, tester et instrumenter le rappel local sans accès GitHub ni Internet, puis évaluer pertinence/latence/consommation et non-régression sur Samsung avec Fab. Aucune modification de moteur ni APK supplémentaire dans cette seule étape de cadrage.

Spécification : `docs/architecture-memoire-a-tiroirs.md`. Cette tâche étend BONZE-007/BONZE-018 et ne les clôt pas. L'APK 0.6.0 ne contient pas cette nouvelle mémoire à tiroirs.

## Retour d'essai Samsung 0.6.0 — 30 octobre 2026 : Bonze trop protocolaire

- [ ] **BONZE-031 — dialogue naturel et spontané (priorité UX)** : Fab observe sur Samsung une réponse artificielle à « tu peux manger du granité à l'huile » : « Bonjour Bonze AI. Voici une suggestion… Je suis là pour vous aider… », plutôt qu'une réplique joueuse adaptée à la situation.
- [ ] Réviser et tester la consigne de personnalité de `BonzeInference.kt` (répondre au sens, tutoiement cohérent, échange bref, humour/curiosité opportun, continuité de jeu, sans introduction de service client ni changement d'identité). Ne pas compter sur le prompt seul pour compenser les limites du modèle.
- [ ] Diagnostiquer `DialogueMemory.context()` : il n'envoie actuellement que les précédentes entrées `human`, pas les réponses `bot`. Étudier un contexte chronologique à rôles explicites, borné et filtré, compatible avec le template chat du modèle, en préservant mémoire/migrations et droits.
- [ ] Comparer des paramètres de génération mesurés sur mêmes tests (actuel : température 0,45, topK 50, topP 0,9 ; carte LFM2.5-230M : température 0,1, topK 50, repetition_penalty 1,05), sans prétendre qu'une température plus élevée crée une personnalité. Évaluer également un modèle local plus adapté à la conversation, seulement après mesures qualité/français/RAM/latence/licence et compatibilité.
- [ ] Construire un banc de tests français avec phrases absurdes, plaisanteries, jeu de rôle, suites de dialogue, questions sérieuses, demandes incertaines, répétitions, stop et veille ; évaluer naturel, cohérence, redondances, factualité, sécurité et latence sur appareil. Maintenir les tests 0.6 et aucune permission INTERNET.
- [ ] Déplacer/compacter l'avertissement technique statique de `docs/index.html` (LFM dense, droits, voix, etc.) dans les informations techniques ou Options, sans supprimer ses avertissements de sécurité ; il est **indépendant** du contenu généré.
- [ ] Garder le texte et la TTS distincts dans le diagnostic : Piper lit la réponse mais ne crée pas ses formulations. Demander validation Fab avant déclarer l'UX naturelle.

Constats fondés sur la capture d'essai et la lecture de `BonzeInference.kt`, `DialogueMemory.java`, `docs/index.html` sur `feature/offline-bonsaiv1`. Liquid AI classe explicitement le 230M comme non recommandé pour l'écriture créative : https://huggingface.co/LiquidAI/LFM2.5-230M/blob/main/README.md . **Documenté seulement ; aucun code ni APK modifié, aucun merge main.**

## Priorité réaffirmée par Fab — 30 octobre 2026 : vrai MoE linguistique

- [ ] **BONZE-032 — couche MoE linguistique réellement neuronale**, distincte de BONZE-024 (huit experts émotionnels à décisions partiellement programmées). Prévoir des sous-réseaux/expertises linguistiques entraînés, un routeur mesurable, une seule voix/personnalité de synthèse, des tests d'ablation et un budget RAM/CPU pour Android hors connexion. Il ne suffit pas de renommer huit prompts ou huit heuristiques « MoE ».
- [ ] Avant intégration : fixer critères et jeux de tests français reproductibles (conversation spontanée, absurdités, cohérence de rôle, factualité, demandes délicates, reprise de contexte) et comparer à une base dense réellement conçue pour dialoguer. Aucune affirmation de meilleure qualité tant que les tests ne le montrent pas.
- [ ] Évaluer séparément un modèle de conversation local plus adapté (p. ex. LFM2.5-1.2B-Instruct GGUF) comme **baseline de dialogue, pas comme MoE**. Vérifier licence, empreinte APK, mémoire de chargement, quantification, temps de réponse, stabilité/voix simultanée sur Samsung. Ne pas remplacer silencieusement les poids 230M.
- [ ] Conserver les huit forces émotionnelles et leur arbitre ; concevoir une interface mesurée entre conseil émotionnel, routage des spécialistes linguistiques et mémoire à tiroirs BONZE-030, en isolant les autorisations.
- [ ] Publier seulement après tests Android vérifiés et retour Fab ; ne jamais déclarer le MoE livré tant que le code d'inférence spécialisée et les évaluations ne le prouvent.

Référence : Liquid AI recommande le LFM2.5-230M pour extraction / agents légers et déconseille l'écriture créative : https://huggingface.co/LiquidAI/LFM2.5-230M . Le 1.2B est un candidat dense de comparaison : https://huggingface.co/LiquidAI/LFM2.5-1.2B-Instruct-GGUF . Aucune intégration MoE linguistique dans l'APK 0.6.

## Demande urgente Fab — export direct et consultation des traces (30 octobre 2026)

- [ ] **BONZE-033 — exporter facilement les conversations et les traces réelles** : remplacer le parcours caché par des commandes accessibles avec grand texte. La version 0.6 sauvegarde actuellement au maximum 30 entrées de dialogue et 120 événements du journal ; elle ne peut pas reconstituer les événements supprimés ou les « pensées internes » non enregistrées.
- [x] Sur branche de travail `feature/diagnostic-export-v1` : raccourcis visibles en haut des Options vers l'export chiffré `.bonze` et la console authentifiée ; refuser une phrase secrète trop courte **avant** d'arrêter la conversation ; tests UI statiques ajoutés.
- [x] API native `ConversationService.diagnosticExport()` préparée : snapshot lecture seule des données encore conservées ; ne prétend pas enregistrer des raisonnements internes. **Non reliée à un bouton Android dans ce candidat.**
- [ ] Terminer une voie d'export JSON lisible depuis Android en conservant la confirmation du verrouillage du téléphone et le choix explicite du fichier, avertir que le JSON n'est pas chiffré ; ou privilégier l'export `.bonze` chiffré si la confidentialité familiale ne peut pas être garantie.
- [ ] Diagnostiquer le blocage concret rencontré par Fab sur Samsung (authentification, phrase secrète, ouverture du sélecteur de fichier, écriture Android SAF) et couvrir erreurs/cancel/retour depuis arrière-plan.
- [ ] Tests JS/JVM et CI Android complets, essais sur Samsung, vérification Release/signature puis APK direct avant d'annoncer un export corrigé. **La 0.6.0 en ligne reste inchangée ; aucun APK nouveau, aucune fusion dans main.**