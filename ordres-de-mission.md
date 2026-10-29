# Ordres de mission Bonze AI — ouverts jusqu'à validation utilisateur

## IMMUTABLE / À PRÉSERVER

- Android application ID et namespace existants : `fr.bonzeai.companion` ; ne pas renommer.
- Branche de travail : `feature/offline-bonsaiv1`, PR #1 ; aucun merge main sans accord explicite de Fab.
- Android sans permission INTERNET ; modèle embarqué et aucun fallback cloud vocal.
- Clé de stockage existante `bonze-proto-01` : migrer sans effacer l'historique.
- APKs nommés Bonze-AI-vVERSION-debug.apk et directement accessibles en Release. Signature debug de test ; aucune identité Play/clé de production enregistrée dans le dépôt audité.

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
- [ ] BONZE-016 : Piper français léger, moteur/poids/licences vérifiés, identité vocale stable, variation limitée aux paramètres réels. Étude faite, moteur non embarqué.
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

Blocages supplémentaires à résoudre avant publication : crash natif pendant le test Piper (40956583835), logcat ajouté pour le diagnostic ; la voix Siwis dérive de Lessac medium dont le corpus source a une licence de recherche non commerciale. Ne pas confondre l’étiquette MIT du dépôt de voix et cette filiation. Publication suspendue pendant vérification/remplacement.

### Correction de voix avant livraison
Le crash natif 40957409320 est prouvé : sherpa JNI attend invoke(float[]) -> Integer ; une lambda Kotlin 2.0 indy n’expose que la méthode effacée, causant NoSuchMethodError puis SIGABRT. PiperCancellation.java fournit explicitement cette signature ; assertion instrumentée ajoutée. La voix Siwis est remplacée par Piper MLS medium, locuteur 0 fixe : fiche entraînée depuis zéro, corpus MLS CC-BY 4.0 (OpenSLR94), poids SHA-256 0ed223f7…34e162. Ajout des seules métadonnées/tokens selon sherpa, sans réentraînement. Cela évite la filiation Lessac/Ryan à licences de recherche/NC. Les voix Gilles, MLS_1840, Tom et Miro ont aussi été écartées pour filiation/conditions spécifiques. Publication seulement si génération/lecture/arrêt/restauration Android et signature sont verts ; écoute humaine toujours ouverte.

Lexique : le nouveau probe MLS a révélé des nasales combinées absentes comme tokens uniques (ɔ̃, ɑ̃). Conversion vers les vrais tokens de la voix, sans perdre le signe nasal ; entrée exclue si un symbole demeure inconnu, puis secours Android. Tests Python ajoutés. Le probe utilisait aussi un constructeur Python GenerationConfig avec argument non supporté ; appel corrigé.

MLS : synthèse hôte réelle réussie 40958317324 ; 90 113 entrées compatibles après conversion. Le signal du probe avait une crête faible (0,023), d’où un gain borné (×20 maximum) sur le PCM réellement joué et le RMS de bouche. Entrée vocale mise en minuscules comme la vérification du lexique. Test JVM DSP ajouté ; transcription indépendante du WAV en cours, sans remplacer l’écoute humaine.

Cause phonétique prouvée par le code sherpa v2.0.1 : le lexique à tabulations activait le frontend générique ; seul le nouveau format « mot || phonèmes » active le chemin Piper avec BOS/pad/EOS. Signal trop court/faible donc non suffisant comme preuve d’intelligibilité. Export du lexique vers ce nouveau format, puis génération et transcription de contrôle à relancer avant écoute humaine.
