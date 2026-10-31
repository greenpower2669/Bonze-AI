# Ordres de mission Bonze AI — ouverts jusqu'à validation utilisateur

## IMMUTABLE / À PRÉSERVER

- **BONZE-044 — architecture de dialogue explicitement choisie par Fab (31/10/2026) :** au moins **2 000 formes compositionnelles par rôle** (neuf rôles actuels, 18 000 formes virtuelles) constituent le fonds de phrases. **Le modèle Liquid n'écrit plus les répliques prononcées** : il aide à reconnaître une intention et choisit uniquement des **indices de synonymes/variantes prévalidés** à partir de la phrase rédigée dans notre répertoire. La phrase originale gagne toujours si l'analyse est incertaine, si la transformation modifie le sens, ou si le modèle échoue. Le contrôle anti-répétition et la cohérence du contexte précèdent Piper. Garder ce principe lors des reprises : ne jamais réintroduire la génération libre Liquid comme chemin prioritaire. Une adaptation réelle à toute question factuelle et la qualité des synonymes exigent des essais sur appareil.

- Android application ID et namespace existants : `fr.bonzeai.companion` ; ne pas renommer.
- Branche de travail : `feature/offline-bonsaiv1`, PR #1 ; aucun merge main sans accord explicite de Fab.
- Android sans permission INTERNET ; modèle embarqué et aucun fallback cloud vocal.
- Clé de stockage existante `bonze-proto-01` : migrer sans effacer l'historique.
- **RÈGLE IMMUABLE DE LIVRAISON — exigence permanente de Fab :** pour chaque version Android destinée à Fab, livrer **un fichier `.apk` autonome, directement téléchargeable sur GitHub** comme asset natif d'une **Release ou prérelease du dépôt** (`https://github.com/greenpower2669/Bonze-AI/releases/download/<tag>/<nom>.apk`). Donner systématiquement le **lien direct vers le fichier `.apk`**, vérifié après publication ; nom lisible `Bonze-AI-vVERSION[-dev|-debug].apk` (ou `Bonze-AI-vVERSION-parallel.apk` pour un essai isolé), version et signature contrôlées.
- **INTERDICTION DE ZIP EN LIVRAISON UTILISATEUR :** ne jamais imposer ni recommander à Fab un ZIP à ouvrir, un artefact GitHub Actions compressé, une archive de sources, un AAB, un simple lien de branche/PR, ni un lien de téléchargement hors GitHub à la place du `.apk` direct demandé. Les archives éventuellement produites **en interne par GitHub Actions** restent des intermédiaires techniques : extraire le fichier puis le joindre **seul en `.apk`** à la Release GitHub (un `.sha256` facultatif peut accompagner l'APK, mais jamais le remplacer).
- **CONTRÔLE OBLIGATOIRE AVANT D'ANNONCER « APK LIVRÉ » :** confirmer présence effective de l'asset `.apk` dans la Release, URL directe accessible, identifiant Android et `versionCode`, SHA-256 et signature ; protéger les données et la compatibilité de mise à jour. Si GitHub refuse l'upload (403, autorisations, signature, etc.), consigner le blocage dans `todo.md`, expliquer ce qui manque et **ne jamais prétendre qu'un ZIP Actions ou un lien théorique est une livraison**. Cette préférence de format n'autorise ni publication non validée ni merge `main`.
- APKs historiques nommés `Bonze-AI-vVERSION-debug.apk` ; signature debug de test, aucune clé Play/de production conservée dans le dépôt audité.

## Missions

- [ ] BONZE-001 : curiosité, respect et apprentissage invariants ; émotions et attitude évolutives.
- [ ] BONZE-002 : rencontre réciproque et propriétaire unique par instance, enfant compris ; autres utilisateurs autorisés à converser sans modifier ses missions.
- [ ] BONZE-003 : petit bonze expressif, yeux, sourcils, sourires, rougeurs, skins.
- [ ] BONZE-004 : STT français entièrement local et désactivable ; voix légère et émotionnelle.
- [ ] BONZE-005 : conscience des ressources : modes précis/éco/texte/arrêt, transparence sur ses limites d'écoute.
- [ ] BONZE-006 : miroir de compétences, réussite/échec, aveu d'ignorance, demande d'aide ou d'apprentissage.
- [ ] BONZE-007 : mémoires avec renforcement/oubli, mémoire sociale, archivage type FAB-Copilot.
- [ ] BONZE-008 : architecture commune PWA et APK/AAB.
- [ ] BONZE-009 : aucun accès Internet ou API imposé, consentement pour aide externe.

Des briques existent en prototype, mais aucun ordre global n'est clôturé avant vérification.

- [ ] BONZE-010 : fabriquer un APK Android installable à partir du noyau commun, tester sa signature debug, la transcription locale et l'absence de cloud ; livrer un lien direct via Release après compilation.

- [ ] BONZE-011 : remplacer les seuls scripts par de vrais poids neuronaux locaux, une couche d'experts entraînés et un moteur de langage partagé ; tests et APK distribuable, sans merge main.

BONZE-011 progression : micro-MoE 8 experts/304 poids, LFM2.5-230M GGUF 153 Mo, inférence Kotlin llama.cpp, APK CI et Release produits ; reste tests Android réel et validation par Fab.

- [ ] BONZE-012 : écran fondé sur visage toujours visible, effets corporels des émotions, grandes légendes pour enfant/malvoyant, conversation mains libres à activation unique, envoi automatique des phrases et clavier facultatif. Prototype 0.3 construit ; validation sur appareil et par Fab encore requise.



## Avenant global Fab — 29 octobre 2026

- [ ] BONZE-013 : graine locale unique durable et diversité innée d'apparence/tempérament ; trois couches innée/personnalisée/acquise séparées, historique des origines. Implémentation 0.4 livrée en prérelease, mission ouverte jusqu'à essai Fab.
- [ ] BONZE-014 : éditeur accessible et facultatif, presets/skins, description vocalisable, fort contraste ; personnaliser sans effacer souvenirs ni personnalité. Implémentation 0.4 livrée en prérelease ; validation humaine ouverte.
- [ ] BONZE-015 : huit tendances persistantes et interconnectées, visage continuellement proportionnel à leurs mélanges, traits innés et corps expressif. Implémentation explicite 0.4 ; neurones émotionnels contextuels plus riches restent à développer.
- [ ] BONZE-016 : Piper français léger, moteur/poids/licences vérifiés, identité vocale stable, variation limitée aux paramètres réels. Intégration réelle dans le candidat 0.6 ; essai humain toujours requis avant clôture.
- [ ] BONZE-017 : endurance globale, modes précis/éco/léger/texte/désactivé, décharge de modules et mesures réelles Android. Première implémentation 0.4 ; profils de performance appareil encore ouverts.
- [ ] BONZE-018 : personnalité spontanée et sincère avec nom Bonze AI ; rencontre progressive, mémoire sociale et personnelle, miroir de compétences avec preuves, consolidation/oubli/archives et protections familiales. Prompt allégé ; les autres sous-missions demeurent ouvertes.

Le contrat global de Fab est décrit dans brain.md et le plan de reprise dans docs/development-2026-10-29.md. Les études ne valent ni intégration Piper ni réalisation du MoE linguistique. Aucun ordre global précédent n'est clos automatiquement.


Livraison de reprise : prérelease 0.4.0, commit e60d887, run 40858508226, tests automatisés et APK vérifiés. Les missions globales restent ouvertes pour validation humaine et éléments manquants ; aucun merge main effectué. Piper, MoE linguistique et mémoire sociale sécurisée restent expressément à réaliser.

## Retour d'essai Fab — 29/10/2026 : veille et incarnation

- [ ] BONZE-019 : permettre à la conversation explicitement activée de continuer téléphone en veille/écran éteint. Cet ordre modifie l'ancien arrêt systématique au fond ; arrêt volontaire toujours prioritaire, aucun redémarrage autonome après Stop. Prévoir service Android de conversation et notification Arrêter.
- [ ] BONZE-020 : langage naturel et participation au jeu de rôle, sans rappels identitaires/autopromotion hors sujet ; garder sincérité et respect. Diagnostiquer le contexte réellement envoyé au modèle et évaluer les scènes françaises.
- [ ] BONZE-021 : agrandir le visage et renforcer son expressivité pendant la parole ; bouche lisible reliée à la lecture réelle, regard/sourcils/tête expressifs. Priorité au visage, mains remises à plus tard.
- [ ] BONZE-022 : voix locale plus naturelle et cohérente avec le personnage, au-delà du seul débit ; poursuivre Piper avec écoute et validation réelles.

Audit ciblé demandé et réalisé : audit-2026-10-29-veille-dialogue-visage.md. Causes de code, hypothèses et corrections à produire séparées. Aucune correction applicative livrée à l'occasion de cet audit.

29/10 — Fab autorise les corrections de l'audit (« Ok, corrige ça »). Réalisation 0.5 en cours pour BONZE-019/020/021/022 : service écran éteint, contexte de dialogue, visage et animation de parole, voix Android locale mieux réglée. Piper reste ouvert comme intégration distincte ; aucune clôture avant les vérifications et l'essai humain.


Livraison de correction29/10 : prérelease0.5.0, commit ff04ec4, run #40868793495 vert. BONZE-019/020/021 et la partie voix Android de BONZE-022 sont produits pour essai humain : service écran éteint, contexte de jeu/dialogue, visage agrandi, parole animée et voix locale choisie. La qualité réelle sur Samsung et l'intégration Piper restent ouvertes. Aucun merge main. La clé de signature de test0.5 diffère de0.4 ; ne pas supprimer les données existantes sans décision de Fab.

## Avenant Fab 0.5.0 — 29 octobre 2026, après vidéo d'essai

- [ ] BONZE-023 PRIORITÉ : auditer toute la chaîne de conversation, réponses répétées/bloquées, préfixes Humain/Bonze, affichage périmé ; corriger seulement les causes prouvées avec régressions. Sous-titres non masqués par Arrêter, vérifier les états vers le visage.
- [ ] BONZE-024 : huit modules émotionnels avec contributions contextualisées, expertise, interactions et arbitrage central ; progresser vers sous-réseaux neuronaux. Une seule personnalité, pas de scores présentés comme une délibération complète.
- [ ] BONZE-025 : forces ET endurances individuelles ; fatigue modifiant différemment colère/humour/empathie, influences réciproques, apaisement et réglages expérimentaux. Modifie l'ancien contrat d'endurance uniquement globale.
- [ ] BONZE-026 : journaux privés des calculs réellement exécutés, états, paramètres, contributions, arbitrage, réponse finale et erreurs ; aucune explication fabriquée après coup.
- [ ] BONZE-027 : console administrateur avec curseurs forces/endurance/influences/arbitrage ; étudier 60 touches alternées (30 gauche/30 droite) dans zones libres supérieures ; authentification code ou biométrie supplémentaire et alternative accessible.
- [ ] BONZE-028 : export/réimport protégés, versionnés et vérifiables de mémoire/identité/acquis/paramètres/poids/journaux ; migration et restauration contrôlée avant toute réinstallation à signature différente.
- [ ] BONZE-029 PRIORITÉ VOCALE : réellement embarquer une voix Piper française via moteur compatible, licences moteur/phonémiseur/dépendances/poids résolues avant publication ; génération hors ligne, débit/pauses/timbre stable, expression réelle limitée, ressources mesurées, interruption, bouche sur signal joué, comparaison Android en secours. Ne pas clore sans fonctionnement APK, essai hors ligne et écoute humaine.

Ordre demandé : anomalies bloquantes, puis mécanismes émotionnels, administration, Piper ; conserver les acquis0.5 et publier APK direct testé. Aucun merge main.


## Livrable d'avenant en validation — 0.6.0
BONZE-023 : affichage et disposition corrigés avec preuves ; répétitions propres au modèle restent ouvertes. BONZE-024 : contributions contextualisées/arbitre réels, politiques encore manuelles ; spécialisation neuronale inachevée. BONZE-025/026/027 : mécanismes et console implémentés, essai famille/TalkBack encore nécessaire. BONZE-028 : crypto/Web validés, test de restauration native ajouté ; ne pas autoriser de désinstallation comme raccourci de signature. BONZE-029 : moteur/poids Piper intégrés, tests Android obligatoires puis écoute humaine ; aucune clôture anticipée.
Fab a autorisé le développement, les tests et une prérelease directement téléchargeable ; aucune autorisation de merge main. La clé de livraison est contrôlée contre 0.5.0. Le geste de 60 touches ne remplace pas l'authentification ; le code de verrouillage partagé ne distingue pas les membres de la famille.

### État vérifiable avant publication 0.6
BONZE-023 : affichage/disposition corrigés ; qualité répétitive du 230M reste ouverte. BONZE-024..028 : mécanismes, traces, console et sauvegardes implémentés/testés, sans prétendre au MoE linguistique ni à une autorisation familiale complète. BONZE-029 : Piper MLS réellement produit/joué/arrêté hors connexion sur émulateur (40961214052), filiation de licences résolue ; chemin phonétique et regroupement des segments contrôlés. Publication de test après CI finale, écoute physique Samsung indispensable : mission non close. Détails expérimentaux archivés dans sauvegarde.md ; aucune mission retirée ni fusion main autorisée.

Livré pour validation, pas clôturé : BONZE-023 corrections d’affichage/disposition et traces ; BONZE-024..027 calculs/endurance/journaux/console ; BONZE-028 sauvegardes contrôlées ; BONZE-029 moteur Piper embarqué et testé hors connexion, encore expérimental avec secours explicite pour court/inconnu. La qualité neuronale française, le vrai MoE et l’écoute Samsung restent ouverts ; aucun ordre de Fab supprimé.

### Preuves de livraison 0.6.0 — 29 octobre 2026
- Tag bonze-ai-v0.6.0 au commit 14757d3ba01c13d6774b82459f04b3b0a499c6a7 ; prérelease publiée, APK direct : 271 170 701 octets.
- SHA-256 APK : 657689ccf72068343c6c6d6f086e75e24c17516c5db86a8752ea0378e95bb8a0. Certificat 128b1bb0d488f33dd9075888ee15d6ff943136d657018026d1e0b22d9c35991d, identique à 0.5 ; clé toujours en cache de test, sauvegarde privée durable ouverte.
- Workflow 40964127638 entièrement réussi : 45 JS, 3 Python, 8 programmes JVM, 51 assertions navigateur, compilation/lint/manifeste/signature, 3 tests Android API 35 hors connexion et publication. Probe vocal 40964127723 vert au même SHA. Capture finale inspectée, visage/légendes/Stop visibles.
- APK : https://github.com/greenpower2669/Bonze-AI/releases/download/bonze-ai-v0.6.0/Bonze-AI-v0.6.0-debug.apk ; Release : https://github.com/greenpower2669/Bonze-AI/releases/tag/bonze-ai-v0.6.0 ; CI : https://github.com/greenpower2669/Bonze-AI/actions/runs/40964127638 .
- Revue indépendante des changements effectuée. PR #1 en brouillon ; main vérifiée inchangée f5910311f903d8ae4378d62d100129b690fc0e85. Aucun essai physique Samsung ni écoute humaine revendiqués. Archives : sauvegarde.md et docs/history/avenant-0.6-worklog.md.

## Demande validée Fab — 30 octobre 2026

- [ ] **BONZE-030 — Mémoire à tiroirs autonome, locale et sélective** : s'inspirer de Djipie pour une carte d'index compacte, ouvrir uniquement les tiroirs nécessaires au dialogue et gérer séparément mémoire immédiate, personnelle/sociale, apprentissages, scènes, missions et archives. Chaque souvenir doit porter ses droits, origine, fiabilité et règles de correction/oubli. Aucun chargement intégral systématique, aucune dépendance à GitHub ni au cloud. Préserver l'historique, la personnalité, les identités et l'export `.bonze`, effectuer une migration réversible et mesurer l'impact sur Samsung Android 16. Développer par étapes avec tests de confidentialité et validation Fab avant publication.

Voir `docs/architecture-memoire-a-tiroirs.md`. Il s'agit d'une **mission ouverte**, pas d'une capacité déjà livrée par la version 0.6.0. Aucun merge main.

## Nouvelle passation globale Fab — 30 octobre 2026 (ouverte)
- [ ] **Phase A / BONZE-031** : dialogue naturel en français, vrai contexte de tours, vérifier le template et éviter l'effet service client ; banc de tests, échantillonnage et validation Samsung. Correctif initial sur branche dédiée, non validé en modèle réel.
- [ ] **Phase B** : comparer le LFM2.5-230M à LFM2.5-1.2B-Instruct Q4, licence/compatibilité/qualité/charges mémoire, un seul modèle actif. Pas de remplacement implicite.
- [ ] **Phase C / BONZE-030** : mémoire autonome à tiroirs à accès sélectif, provenance/droits, migrations et sauvegardes ; isoler les personnes, chiffrement local adapté. Indépendante de Djipie.
- [ ] **Phase D** : huit tendances/endurances, contributions contrôlables, arbitre, études de sous-réseaux entraînés et IA du savoir ; preuves d'ablation et refus de fausses pensées.
- [ ] **Phase E** : approfondir Piper MLS, diction française, bouche/voix réellement lues et accessibilité avec évaluation humaine.
- [ ] **Phase F** : validation Android Samsung hors ligne/veille/Stop/TalkBack/ressources et sauvegarde/rollback ; accord Fab avant conclusion.
Contrats : préserver `fr.bonzeai.companion`, signature et données ; ne jamais imposer désinstallation, ne pas ajouter INTERNET, ne pas merger `main` ni publier de Release sans validation. La prérelease 0.6.0 `14757d3` demeure le point de retour. Branche expérimentale `feature/bonze031-dialogue-natural-v1` issue de `445408e`. Résultats détaillés et limites dans `docs/bench-dialogue-fr-bonze031.md`.

## Ordres actifs confirmés — 30/10, progression codée
- [x] Première correction BONZE-031 : dialogue court avec citations humaines/Bonze et consigne incarnée. **Pas validé qualitativement avec le modèle** ; BONZE-031 demeure ouvert.
- [x] Première couche BONZE-030 : tiroirs privés avec empreinte d'instance, sélection lexicale bornée, consentement d'apprentissage, retrait/oubli et chiffrement local du nouveau coffre ; interface manuelle et extension de sauvegarde \`.bonze\`. **Pas de rappel neuronal sécurisé en conversation ni de permissions familiales fortes** ; BONZE-030 demeure ouvert.
- [x] Préservation des huit tendances et ajout d'un garde-fou de connaissance explicite/traçable ; **pas un vrai expert de faits ni un MoE linguistique**.
- [x] CI expérimentale sans diffusion : tests JS/JVM, Playwright hors ligne/coffre, compilation de source Android réussis sur \`41090306459\`.
- [ ] Exécuter et analyser le benchmark réel LFM2.5-230M / LFM2.5-1.2B Q4, choisir seulement après preuves ; backend actuel Android reste 230M.
- [ ] Continuer l'authentification des personnes, le rappel sélectif sûr et les migrations, puis apprentissage experts/arbitre/voix Piper et tests Samsung.
- [ ] Conserver l'interdiction de merge \`main\` et de Release sans accord explicite ; la 0.6.0 reste publiée, aucun nouvel APK signé ou AAB.
Rapport de passation exact : \`docs/history/bonze031-evolution-2026-10-30.md\` et tâches \`todo.md\`.

## BONZE-032 — expérimentation de moteur, à ne pas clôturer
- [x] Coder sélection accessible Liquid 230M ou 1.2B, fichier Q4_K_M importable **hors ligne** depuis Android SAF et SHA-256 strict, pas de chargement simultané. Défaut inchangé : 230M.
- [x] Ajouter garde d'espace, copie temporaire et vérification complète ; sauvegarder le choix, refuser un gros modèle absent au lieu d'un plantage.
- [x] Corriger l'erreur de compilation C++ du banc de comparaison ; régressions JavaScript et compilation Android de source sur CI intermédiaire vertes.
- [ ] Vérifier le benchmark réel 230M/1.2B et les résultats français (humour, suite du dialogue, répétition, hallucinations), RAM/PSS et latence sur Samsung avant adoption recommandée.
- [ ] Vérifier APK complet, signature identique 0.6, tests Android instrumentés/Piper/Stop/veille, compatibilité de sauvegarde, stockage et ressources puis validation Fab.
- [ ] Aucune Release ni merge `main` sans autorisation. Aucun APK de cette branche publié.

## Avenant technique 30/10 — constats vérifiés
- [x] Exécuter comparaison réelle CPU/Linux sur LFM 230M et 1.2B Q4 et consigner sorties : `41096101109`, `docs/bench-dialogue-fr-bonze031-results.md`. Le 1.2B n'est pas supérieur de manière suffisamment constante pour remplacer le 230M.
- [x] Ajouter `KnowledgeGuard.java` (règles bornées, non neuronales) pour limiter des informations sensibles ou temporelles inventées hors ligne et tracer l'origine de la réponse.
- [x] Corriger concurrence de déverrouillage du coffre privé à tiroirs ; toute opération périmée est ignorée après Stop ou nouvelle tentative.
- [x] Passer l'interface expérimentale au code Android7/version `0.7.0-dev`, conserver la 0.6.0 comme référence publiée.
- [ ] Compiler APK complet/tester lint, vérifications de sécurité et signature de CI ; aucune distribution tant que certificat de mise à jour n'est pas préservé.
- [ ] Améliorer dialogue multi-rôles, jugement vrai/fiction, prononciation Piper, expertises spécialisées apprises et tests Samsung, sans présentation trompeuse de réussite.

### 30/10/2026 — livraison directe 0.7.0-dev pour économiser l’espace sur Android
APK GitHub Release préversion : https://github.com/greenpower2669/Bonze-AI/releases/download/bonze-ai-v0.7.0-dev/Bonze-AI-v0.7.0-dev.apk
Run de compilation et publication : https://github.com/greenpower2669/Bonze-AI/actions/runs/41116988575 (succès).
Source exacte publiée : `fdd4ba9477fbb87f72b7f69a2a0ec225bd471fbb`, code version 7 / 0.7.0-dev ; signature identique à 0.6.0 vérifiée par SHA-256 de certificat `128b1bb0d488f33dd9075888ee15d6ff943136d657018026d1e0b22d9c35991d`. Identifiant Android `fr.bonzeai.companion` identique : mise à jour en place, et non APK parallèle. Taille publiée : 271 211 531 octets, SHA-256 du fichier `a3f9903f3ff132a393e04a7740746fdebeffed106df8817e46d757191d2ccd90`. Pas de ZIP, pas de fusion `main`. Signature d'origine récupérée **uniquement dans le cache du workflow GitHub** sur `feature/offline-bonsaiv1`; ajout d'un workflow ponctuel `.github/workflows/bonze070-direct-apk.yml` à cette branche, sans modification des sources de la 0.6.0. L'APK de test parallèle antérieur reste un artefact Actions distinct et ne doit plus être recommandé pour un téléphone à faible stockage. Recommandation : sauvegarde privée `.bonze` avant installation, espace temporaire suffisant ; tests physiques Samsung toujours attendus.

### BONZE-039 — personnalisation et mémoire SVC
Implémenter sur une branche d'intégration basée sur la 0.7 existante : fiches structurées dans le coffre chiffré avec consentement, écran édition/recherche/oubli ; style conversation configurable (5 modes, forme d'adresse, longueur, humour, curiosité, douceur, débit de voix) réellement transmis au moteur Android ; contrôles automatisés et mémoire vivante. Conserver la PR #3 et la 0.7, aucun merge `main` et aucune Release prématurée. Tests matériels et réconciliation des deux lignes restent ouverts.

### BONZE-040 — correction des répétitions et débogage voix (31/10/2026)
À partir de BONZE-039, corriger le cas utilisateur prouvé d'une réponse qui répète une insulte reçue, surveiller les autres réponses circulaires, préremplir la sortie Piper pour éviter les sous-alimentations à l'initialisation, relever timings et `underrunCount`, exposer un journal technique anonymisé dans Options (stockage volontaire par SAF, pas d'Internet). Valider JS/JVM/UI/compilation puis vérifier au casque sur téléphone ; ne pas fusionner main ni publier d'APK avant validation et signature sûre.


### BONZE-041 — Correction cohérente et APK de test isolé
Mission : répondre aux tests négatifs de la 0.7 (« perroquet » + coupures), intégrer le répertoire BONZE-037 dans la ligne 0.7/039/040 sans perdre mémoires SVC, personnalisation et journal exportable. Les réponses LLM valides restent prioritaires, un secours local préécrit varie selon le contenu ; lecture Piper continue et normalisée, audit du lexique embarqué, sauvegardes validées. Préparer `0.8.0-dev` en **identifiant Android Dev distinct**, CI et inspection du package pour pouvoir mesurer sur téléphone. Ne pas fusionner main, publier une Release ni modifier la 0.7 installée sans ordre explicite. Conserver les limitations acoustiques dans le todo.


### BONZE-043 — ordre actif de réconciliation simultanée (31/10/2026)
Fab demande de traiter **ensemble** le classement Liquid, les 2 000 formulations composables par rôle (huit tendances et sage), la pertinence/anti-répétition, Piper et l'organisation des branches. Base de travail unique : `feature/bonze042-field-fixes`, issue de BONZE-041 et incluant le corpus issu de BONZE-032 ; préserver les autres branches, mémoires et APK 0.7/0.8 existants.
Implémentation expérimentale : Liquid suggère une intention parmi vingt catégories ; répertoire choisi par émotion/personnalisation avec rejets des réponses récentes ; Piper reste la voix sélectionnée et un échec vocal est affiché, sans passer tacitement à Android. Tests JS/JVM/Kotlin/UI et acoustiques Samsung à confirmer avant annonce de correction définitive. La commande n'autorise ni fusion dans `main` ni nouvelle Release sans validation ; APK livrable exclusivement en fichier direct GitHub Releases, jamais archive ZIP. Voir `docs/bonze043-dialogue-voix-integration.md` et `todo.md`.
