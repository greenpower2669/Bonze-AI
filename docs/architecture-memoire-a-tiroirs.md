# Bonze AI — mémoire à tiroirs locale (cible, non encore implémentée)

**Demande de Fab : 30 octobre 2026.** S'inspirer de la consultation sélective de Djipie pour doter Bonze AI d'une mémoire à tiroirs. Cette note est un **contrat de conception / ordre de mission futur** ; elle ne prouve pas que l'APK 0.6.0 dispose déjà de cette capacité. Conserver toutes les fonctionnalités 0.6, sans merge dans `main` sans l'accord de Fab.

## Intention et séparation des projets

Une carte centrale minuscule fournit les noms des tiroirs, leur périmètre et leur méthode d'accès. À chaque tour, Bonze AI n'ouvre que les tiroirs pertinents et ne transmet au modèle que les passages utiles, dans un budget de tokens mesuré. Il peut refermer les tiroirs, enregistrer des souvenirs validés, consolider, corriger ou oublier suivant des règles explicites.

- Bonze doit avoir **sa propre mémoire hors ligne** dans son stockage Android/PWA, **pas** une lecture automatique du dépôt Djipie ni des fichiers FAB-Copilot.
- Les cinq mémoires du **projet logiciel** Bonze AI (brain/brainmap/debughistorical/todo/ordres-de-mission) servent au développement ; **ne pas les confondre** avec les mémoires privées des personnages/utilisateurs dans l'application.
- Le but est de réduire les contextes inutilement longs et d'éviter les contaminations entre personnes, scènes et sessions, non de simuler une connaissance garantie.
- Respecter « aucune permission INTERNET » sur Android et le contrat de disponibilité hors réseau.

## Couches proposées

1. **Contexte immédiat** : derniers tours, scène/objectif actuel, interruptions et commandes ; source : `DialogueMemory.java`, instantané natif, interfaces actuelles. Borné, non traité comme des souvenirs permanents.
2. **Index léger** : manifest local versionné contenant identifiant de tiroir, titre, catégorie, taille, dernière mise à jour, niveau de confidentialité, statut de fiabilité et références vers les contenus. Aucune donnée intime dans les titres destinés à l'UI ou aux journaux.
3. **Tiroirs séparés** (périmètres possibles, à affiner avec Fab) : identité innée et préférences acquises, personnes/relations avec droits, conversations/scènes, faits appris sourcés, compétences évaluées, tâches autorisées, souvenirs autobiographiques et archives.
4. **Rappel sélectif** : classification locale du tour, filtrage par propriétaire et droits, recherche textuelle locale d'abord (pas de serveur ni d'embeddings imposés), sélection de quelques passages pertinents, limites de caractères/tokens, provenance et date transmises distinctement du prompt système. Jamais tout charger d'office.
5. **Écriture contrôlée** : propositions de souvenir depuis un événement explicite ou une consolidation prudente, distinction observation / déclaration humaine / inférence / fait vérifié ; correction, contradiction, suppression, révision et rétention. L'arbitre émotionnel n'est pas une preuve de vérité.
6. **Archives** : contenus moins consultés séparés de l'index et de la mémoire courte ; accès seulement à la demande/recherche pertinente, pas de suppression irréversible lors d'une simple perte de pertinence.

## Sécurité, persistance et compatibilité

- **Confidentialité par personne et par scène** : l'identité du propriétaire et l'autorisation d'une mission ne se déduisent pas d'un surnom, de la voix, d'un rôle ou d'un souvenir. Refuser le rappel de contenu privé d'un autre utilisateur sans authentification réellement adaptée ; la connaissance du PIN partagé du téléphone ne fournit pas une séparation familiale suffisante.
- L'**export existant `.bonze` chiffré** ne chiffre pas automatiquement toute la mémoire interne. Choisir une protection locale adaptée, clé Android Keystore si possible, cycle de vie, verrous, sauvegarde et récupération ; ne pas affirmer le chiffrement interne avant test.
- Migration **non destructive** depuis `bonze-proto-01`, `DialogueMemory`, les acquis, les identités et la sauvegarde 0.6 ; schéma versionné, transactions atomiques, restauration/rollback, doublons évités. Jamais d'effacement implicite.
- API commune de mémoire ciblée pour `core/` et le pont natif Android ; stockage propre à chaque plateforme, aucune lecture GitHub dans l'APK.
- Limites RAM, I/O et latence sur Samsung Android 16 : index chargé à coût borné, tiroirs chargés à la demande, mesures froid/chaud, rejet d'éléments périmés et aucun rappel après Stop.
- Un tiroir absent, corrompu ou verrouillé doit laisser l'IA fonctionner avec le contexte immédiat sans inventer ce qu'elle n'a pas pu lire.

## Plan de réalisation et tests requis

**Phase A — conception et prototypes isolés** : définir manifest/schema, règles de permission, budget contextuel, indexation/recherche, métriques et tests sur données fictives. Comparer à la mémoire de dialogue 0.6 sans perdre les acquis.

**Phase B — noyau et migrations** : implémenter liste/ouvrir/fermer/chercher/écrire/confirmer/rectifier/archiver/effacer des tiroirs avec isolation stricte, persistance, chiffrement adapté et export/restauration. Tests JS/JVM/navigateur et instrumentation Android.

**Phase C — rappel en conversation** : brancher uniquement les extraits choisis au contexte de génération locale et au conseil émotionnel, puis tester les cas : rappel pertinent, faux souvenir, contradiction, personne différente, changement de scène, mode avion, Stop, veille, RAM faible, restauration, doublons et ancien état.

**Phase D — validation humaine** : montrer à Fab quels souvenirs ont été rappelés et pourquoi, offrir la correction/suppression accessible, mesurer la qualité réelle des dialogues et la consommation sur le Samsung. Ne fermer la mission qu'avec validation explicite.

### Critères de non-régression

- Aucune régression des sauvegardes `.bonze`, des huit forces, du service de conversation, du visage, de Piper et de l'accessibilité.
- Aucune fuite interpersonnelle, aucun chargement intégral systématique, aucun accès réseau, aucun rappel d'une génération périmée.
- Des tests mesurables démontrent que la sélection contextuelle apporte un gain (ou au moins aucun recul significatif) en pertinence et en ressources, sans attribuer une réussite du LLM dense 230M à la mémoire.
- APK/AAB et Release uniquement après CI, signature et accord de Fab sur le périmètre de publication.

**État : proposition enregistrée ; code, tests et APK correspondants non encore réalisés.**

## Mise en œuvre expérimentale du 30 octobre 2026 — sur branche BONZE-031
Un premier noyau fonctionne en branche isolée : \`core/memory-drawers.mjs\` (index léger + rappel borné), \`core/memory-vault.mjs\` (chiffrement local par phrase secrète), \`docs/memory-ui.js\` (écriture volontaire, recherche, oubli et verrouillage) ; inclusion de l'enveloppe chiffrée dans \`.bonze\` schema 1. Tests JS, navigateur hors ligne et compilation Android de source validés par \`41090306459\`.
**Attention :** les tiroirs ne sont **pas encore connectés à la génération vocale automatique** ; l'identification familiale solide n'est pas implémentée, et la mémoire instantanée existante n'est pas chiffrée par ce prototype. Le module pur attend du caller une autorisation authentifiée, ce booléen ne l'authentifie pas. La seule barrière disponible pour le nouveau coffre est sa phrase secrète. La version 0.6.0 publiée ne possède pas cette fonction et reste le point de retour. Prochaines étapes : authentification, migrations et tests interpersonnels, intégration conditionnelle des extraits, preuve de pertinence/latence et décision humaine de Fab avant Release.
