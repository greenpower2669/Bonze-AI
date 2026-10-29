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
