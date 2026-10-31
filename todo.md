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

## Reprise BONZE-031 — 30 octobre 2026, branche de travail isolée
- [x] Vérifier Djipie et les mémoires Bonze ; relever HEAD `445408e` (+6 commits de documentation depuis `14757d3`).
- [x] Créer `feature/bonze031-dialogue-natural-v1` sans toucher `main` ou au tag 0.6.0.
- [x] Ajouter les réponses `bot` et messages `human` dans le contexte chronologique borné de `DialogueMemory` ; ne plus promouvoir les citations passées au système de `BonzeInference`.
- [x] Réécrire le court prompt de personnalité : spontanéité, humour pertinent, tutoiement, sincérité ; ne pas prétendre que le 230M s'en trouve réparé.
- [x] Ajouter tests ciblés `tests/DialogueMemoryTest.java` ; compilation/test JVM local passé (JDK21, copie locale de travail).
- [x] Rédiger `docs/bench-dialogue-fr-bonze031.md` avec variantes R0/A1/A2/B1 et scénarios reproductibles.
- [ ] Faire exécuter la CI complète sur la branche dédiée, contrôler Kotlin, les tests Java, l'APK, lint, signature, permissions et non-régressions. Les workflows de build/publish actuels ciblent la branche historique ; **pas de déclenchement automatique de la CI sur la branche d'essai**.
- [ ] Exécuter les vraies générations LFM 230M à paramètres égaux, comparer R0/A1/A2 en français, journaliser erreurs/répétitions/métriques, puis étudier la séparation multi-rôles réelle dans l'AAR.
- [ ] Essayer sur Samsung, incluant granité à l'huile, rôle Pipo, interruptions/Stop/veille, sous-titres et Piper. Décision et validation Fab nécessaires.
- [ ] Benchmark du Liquid 1.2B Q4 avec licence, template, poids hachés, mémoire totale et déchargement ; aucun moteur supplémentaire intégré pour l'instant.
- [ ] Poursuivre BONZE-030 mémoire à tiroirs puis experts/arbitre/IA du savoir/voix selon les phases de l'ordre de mission ; conserver la 0.6.0.
État : **code source de Phase A partiellement modifié et test ciblé passé ; modèle, CI, APK et appareil non validés**. Aucune fusion `main`, Release ni APK 0.6.1 autorisés. Prochaine action : déclencher tests complets et comparer les générations réelles sur les fixtures, puis corriger uniquement les défauts observés.

## Bilan de travail du 30 octobre — branche \`feature/bonze031-dialogue-natural-v1\`
- [x] Reprendre le dernier HEAD + les cinq mémoires et Djipie ; préserver le 0.6.0 / \`14757d3\`.
- [x] Code de dialogue corrigé, huit tendances/arbitre conservés, heuristique d'incertitude et tests de régression.
- [x] Prototype de mémoire à tiroirs : index/scope, confirmation humaine, état/provenance, rappel sélectif borné, archive/oubli, coffre chiffré, UI avec phrase secrète, sauvegarde \`.bonze\` compatible et PWA hors ligne.
- [x] Teste la conservation du coffre et refus de mots de passe erronés ; CI \`41090306459\` : JS/JVM, navigateur/Playwright, sources Kotlin/Java verts.
- [x] Préparer vraie comparaison CPU Liquid 230M/1.2B, quatre variantes avec JSONL et rapport descriptif non noté.
- [ ] Collecter le rapport réel et vérifier les réponses françaises de chaque modèle, paramètres/tokenizer/template et coût Linux, puis comparer sur Samsung.
- [ ] **Ne pas injecter les souvenirs privés dans la génération vocale** avant authentification utilisateur/famille, consentement par tour, tests de fuite et chiffrement adapté.
- [ ] Travailler sur sélection de modèle 1.2B réellement disponible dans Android avec déchargement et pression RAM ; aucun poids 1.2B intégré pour le moment.
- [ ] Affiner Liquid, vrai MoE de sous-réseaux, mémoire/relations/compétences, contrôles de connaissance, voix Piper (noms/nombres/élisions/naturel) et incarnation.
- [ ] Refaire tests instrumentés, mode avion/veille/Stop/TalkBack/sauvegardes + tests humains Samsung, signature durable.
- [ ] Obtenir décision de Fab avant merge main ou une Release/APK de prétest.
Rapport complet : \`docs/history/bonze031-evolution-2026-10-30.md\`. Aucun APK nouveau n'est publié. Statut réel = **prototype codé et testé automatiquement ; modèle et téléphone non validés**.

## Suite du chantier Bonze du 30 octobre — après demande « continue à coder »
- [x] Analyser échec CI 41090962616 : jeton C++ `const` ; corrigé dans le probe compilé.
- [x] Ajouter `LocalModelStore.java` : GGUF 1.2B Q4_K_M importé manuellement par Android SAF, contrôle SHA-256 et espace libre, aucun accès Internet, aucun écrasement inutile du poids vérifié.
- [x] Raccorder `BonzeInference.kt` et `ConversationService.java` : moteur par défaut 230M, 1.2B optionnel, décharger ancien modèle au changement, erreur locale gérée et moteur annoncé au diagnostic.
- [x] Ajouter menu Options de moteur, import contrôlé côté MainActivity, persistance Web/Android et compatibilité sauvegardes v0.6 avec repli au 230M.
- [x] Ajouter tests statiques sur import/mémoire hors réseau et test aller-retour sauvegarde du choix ; CI antérieure `41095563691` verte (JS/JVM, Playwright, compilation de sources) ; les nouveaux commits demandent une nouvelle validation.
- [ ] Achever et analyser toutes les CI du HEAD, corriger les régressions exactes, effectuer build APK complet et contrôle certificat avant installation.
- [ ] Relancer comparaison R0/A1/A2/A3 sur les GGUF réels et mesurer français/latence/empreinte ; vérifier la disponibilité et l'impact RAM Samsung.
- [ ] Renforcer isolation familiale, rappels de mémoire contrôlés et migrations ; le coffre à tiroirs ne doit pas être branché automatiquement à l'écoute sans authentification sûre.
- [ ] Évaluer amélioration Piper et vrai MoE neuronal après mesures, sans promettre de voix émotionnelle entraînée.
- [ ] Ne publier aucune nouvelle Release ni merger dans main sans validation explicite ; `bonze-ai-v0.6.0` demeure le point de retour installable.

## 30/10 — point d'arrêt précis du chantier 0.7.0-dev
- [x] Corriger `const llama_token` ; comparer réellement Liquid 230M et 1.2B sur GitHub Actions `41096101109`. Rapport `docs/bench-dialogue-fr-bonze031-results.md`, JSONL et lignes source conservés en artefact GitHub. Résultat : 1.2B parfois plus naturel, mais hallucination météo et faux ton rassurant sur santé ; pas de victoire vérifiée.
- [x] Implémenter `KnowledgeGuard.java`, journalisation réelle et tests Java séparés ; les règles ne sont pas un MoE neuronal.
- [x] Mettre à jour les scènes explicites dans `DialogueMemory` et tester forêt → Lune → Mars.
- [x] Corriger concurrence d'ouverture du coffre après mauvais mot de passe ; epoch, rejet d'opération périmée, écriture interdite après verrouillage, test navigateur. SW v10.
- [x] Ajouter job CI `android-package-check` sans publication pour construire APK réel, vérifier aapt/permissions/lint/apksigner/empreinte, signer **avec une clé éphémère non livrable en mise à jour**. Ce job ne remet pas de nouveau paquet à Fab.
- [ ] Terminer exécution et consulter résultats du job de paquet, puis corriger toute erreur démontrée.
- [ ] Bench supplémentaire : faire correspondre les consignes sécurité de Bonze, ajouter de nombreuses scènes/plusieurs seeds, puis évaluer vrai template multi-rôles sur Android ; tester physiquement Samsung.
- [ ] Revoir sauvegarde durable de signature ; tester ancienne install 0.6 en mise à jour et retour arrière avant d'autoriser un APK de test direct. Ne pas réclamer de désinstallation.
- [ ] Compléter mémoire familiale autorisée, IA du savoir au-delà de heuristiques, apprentissage des experts/ablation, et Piper/voix française.
- [ ] Aucune fusion main, aucun tag, aucune Release ni AAB publiés sans validation Fab. Dernier APK publiquement vérifié : `Bonze-AI-v0.6.0-debug.apk`.

## Livraison demandée : APK 0.7.0-dev, distinct de la 0.6.0
- [x] Construire une variante de diagnostic `-PbonzeParallelInstall=true` avec ID `fr.bonzeai.companion.dev` et libellé **Bonze AI Dev**, pour garder `fr.bonzeai.companion` et ses données 0.6.0 intactes.
- [x] Ajouter au job Actions conditionnel `[bonze-build]` une véritable compilation du paquet, vérification du manifeste, absence d'INTERNET, certificat APK et empreinte SHA-256.
- [x] Activer un **artefact GitHub Actions** incluant un APK entier, sans tag ni GitHub Release ; durée de conservation 30 jours.
- [ ] Vérifier le run final et le paquet, récupérer l'artefact et livrer le fichier `.apk` direct décompressé à Fab.
- [ ] Essai réel sur son Samsung, reconnaissance vocale, Piper, contrôle du chargement GGUF 1.2B, écran éteint, RAM. L'APK Dev ne partage pas l'historique de la 0.6.0 : importer volontairement une sauvegarde `.bonze` si souhaité.
- [ ] Ne jamais confondre ce test parallèle signé par une clé CI éphémère avec une mise à jour officielle de la 0.6.0. La signature et les données originales doivent rester préservées.

### 30/10/2026 — livraison directe 0.7.0-dev pour économiser l’espace sur Android
APK GitHub Release préversion : https://github.com/greenpower2669/Bonze-AI/releases/download/bonze-ai-v0.7.0-dev/Bonze-AI-v0.7.0-dev.apk
Run de compilation et publication : https://github.com/greenpower2669/Bonze-AI/actions/runs/41116988575 (succès).
Source exacte publiée : `fdd4ba9477fbb87f72b7f69a2a0ec225bd471fbb`, code version 7 / 0.7.0-dev ; signature identique à 0.6.0 vérifiée par SHA-256 de certificat `128b1bb0d488f33dd9075888ee15d6ff943136d657018026d1e0b22d9c35991d`. Identifiant Android `fr.bonzeai.companion` identique : mise à jour en place, et non APK parallèle. Taille publiée : 271 211 531 octets, SHA-256 du fichier `a3f9903f3ff132a393e04a7740746fdebeffed106df8817e46d757191d2ccd90`. Pas de ZIP, pas de fusion `main`. Signature d'origine récupérée **uniquement dans le cache du workflow GitHub** sur `feature/offline-bonsaiv1`; ajout d'un workflow ponctuel `.github/workflows/bonze070-direct-apk.yml` à cette branche, sans modification des sources de la 0.6.0. L'APK de test parallèle antérieur reste un artefact Actions distinct et ne doit plus être recommandé pour un téléphone à faible stockage. Recommandation : sauvegarde privée `.bonze` avant installation, espace temporaire suffisant ; tests physiques Samsung toujours attendus.

### BONZE-039 — à valider
- [x] Créer branche sur 0.7 et importer SVC sans recopier le coffre de BONZE-031.
- [x] Ajouter formulaire SVC sous coffre déverrouillé, correction et oubli, validation chiffrée, refus des contradictions.
- [x] Ajouter cinq personnalités, tutoiement/vouvoiement, longueur, humour, curiosité, douceur et débit ; choix sauvés et inclus dans sauvegarde `.bonze`.
- [x] Relier les paramètres aux consignes bornées du modèle Android et à Piper/Android TTS ; validations JS + tests navigateur.
- [ ] Examiner les résultats de CI JS/Playwright/compilation Android et corriger toute régression.
- [ ] Effectuer essai Samsung avec veille, casque, voix et mémoire SVC ; assurer une authentification par personne réelle avant tout rappel privé automatique.
- [ ] Réconcilier le répertoire 18 000 formulations de la PR #3 avec la branche 0.7 / 039 sans perte des acquis ; ne pas fusionner sans validation.
- [ ] Signature et chaîne de mise à jour APK versionCode >7, publication seulement sur ordre explicite.

### BONZE-040 — débogage de la 0.7.0-dev, 31/10
- [x] Anti-écho entrée utilisateur et anti-répétition dernier Bonze, avec respect des demandes de répétition explicite et tests Java.
- [x] Prébuffer audio Piper et `WRITE_BLOCKING` sur le thread de lecture, journaliser `generationMs`, `playbackMs`, `underruns`, échec Piper et éventuelle bascule Android.
- [x] Ajouter Options > Journal de diagnostic : export JSON par `ACTION_CREATE_DOCUMENT`, sécurisé sans phrases utilisateur, sortie modèle, surnoms ni contenus mémoire ; contrôle navigateur.
- [x] CI `41200356136` sur le correctif `8d3c224a` : régressions JVM/JS, interface Playwright hors ligne, compilation Kotlin/Java Android **toutes réussies**. N'inclut ni APK signé ni essai audio matériel.
- [ ] Essai réel Samsung : voix continue, écran éteint, débit Piper, écoute/lecture, casque et mesure des sous-alimentations et bascules vocales.
- [ ] Si pauses entre blocs, prototyper une préparation audio en avance ou une file tamponnée ; éviter de prétendre corriger le gap sans mesure.
- [ ] Réconcilier les PR #3 (répertoire 18k) et #4 (mémoire/personnalisation) ; résorber signature incompatible avant livraison sûre de mise à jour, sans écraser 0.7.0-dev.


### BONZE-041 — chantier de correction générale 31/10
- [x] Réunir BONZE-039/040 et les 18 000 répliques de BONZE-037 sur une branche non destructive, sans prétendre à 18 000 sujets distincts ; ajout test de critique « naze/perroquet ».
- [x] Remplacer la réponse de secours unique par une sélection locale d'intention/émotion avec journalisation explicite, dès écho Liquid, erreur du modèle et en mode léger ; intégration Web et native.
- [x] Piper : produire et lire le flux PCM complet dans un AudioTrack, appliquer un gain commun, préremplir avant jeu, tracer les durées/underruns et le passage éventuel à Android TTS.
- [x] Sauvegarde chiffrée : préserver répertoire natif et Web, validation stricte, migration ancienne version, test JS.
- [x] Renommer la candidate installable séparément en 0.8.0-dev/code 8, package `fr.bonzeai.companion.dev`, conserver 0.7 en place.
- [x] CI `41201859372` : tests JVM/JS, interface Playwright, compilation Kotlin/Java, lexique Piper complet et construction/inspection Android **réussis**.
- [x] APK expérimental 0.8.0-dev code 8 construit en parallèle (`fr.bonzeai.companion.dev`, 271 244 969 octets), contrôlé par `aapt` et `apksigner`, zéro permission INTERNET, somme SHA-256 GitHub vérifiée ; artefact Actions `13043251678`. Aucune Release publiée.
- [ ] Vérifier sur Samsung réel : double installation sans suppression, mémoire chiffrée, critique « naze », dialogue continu, coupures, latence première syllabe, Bluetooth/casque, niveau sonore, arrêt immédiat, journal anonymisé.
- [ ] Après tests appareils, décider du mécanisme de signature de mise à jour et du passage de BONZE-037/039/040/041 dans la branche de référence ; aucun merge main sans autorisation.
- [ ] Optimiser latence voix : envisager moteur et buffers anticipés, sans réintroduire de blancs ou de traitements simultanés non sûrs.

### BONZE-041 — publication directe GitHub sans ZIP (31/10/2026)
- [x] APK parallèle 0.8.0-dev vérifié, SHA-256 `dac8a4401e7a223d0982a7209d99a905dd6145fabbbf65da16db027394d20954`, artefact 13043251678.
- [x] Pipeline de prérelease directe ajouté à `.github/workflows/bonze031-ci.yml` : téléchargement de l'artefact déjà validé, checksum, package et signature, `gh release create` en préversion avec `.apk` et `.sha256` uniquement.
- [ ] **BLOCAGE GitHub 403** sur la création Release par `GITHUB_TOKEN` (run `41229649266`, job `124621558159`) : `HTTP 403 Resource not accessible by integration` malgré `permissions: contents: write`. Les tests JS/JVM, Playwright et compilation sont verts ; le contrôle des bytes et manifest de l'APK est vert ; seule l'API GitHub Releases refuse l'écriture.
- [ ] Faire autoriser à GitHub Actions l'écriture des contenus/releases pour ce dépôt (Settings → Actions → General → Workflow permissions → Read and write permissions, ou règle d'organisation si verrouillé). Rejouer ensuite le job de publication et vérifier la présence réelle de l'asset `.apk` dans `bonze-ai-v0.8.0-dev-parallel`. **Ne pas inventer de lien direct ni publier via ZIP par défaut.**

- [ ] **Nouvelle tentative après demande Fab** : relance du job `124621558159` de la CI `41229649266` réussie techniquement (attempt 2, job `124624995495`), vérifications du même APK `.apk` OK, mais `gh release create` refuse toujours : **HTTP 403 Resource not accessible by integration**. Confirmer dans Settings → Actions → General → Workflow permissions que `Read and write permissions` est **coché et enregistré après rechargement** ; vérifier les restrictions d'organisation si besoin ; relancer la publication uniquement après déblocage. Aucun lien `.apk` GitHub Release 0.8 créé.
