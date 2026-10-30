# Bonze AI — reprise du contrat du 29 octobre 2026

Source auditée : `9d7c9d589c34bd72cb7ba4a41a57e628620cb882`, branche `feature/offline-bonsaiv1`, PR #1. La demande complète de Fab du 29/10 est l'autorité ; aucun merge main autorisé.

## Conception et plan d'exécution

Conserver la coquille Android et le noyau JS. Séparer les données en identité innée (seed locale cryptographique + morphologie + tempérament), personnalisation explicite et acquis (forces, adaptations, endurance). Migrer l'historique 0.3 sans changer de clé. L'avatar consomme un vecteur continu d'expression ; le classement de la dernière phrase reste un stimulus parmi d'autres. Les caractéristiques innées ne sont jamais retirées du stockage lors d'une personnalisation.

Approches examinées : faces prédéfinies (trop abruptes), plusieurs LLM par émotion (coût mémoire et confusion émotion/expertise), état persistant commun + paramètres graphiques continus (retenu). Ces choix d'implémentation sont ceux de l'agent dans le cadre du contrat, pas de nouvelles demandes attribuées à Fab.

1. [ ] Reproduire puis réparer les résultats tardifs : stop/résultat, stop/permission, ancien TTS/nouvelle conversation, texte pendant écoute. Corréler chaque génération, invalider les anciennes sessions et les reconnaissances.
2. [ ] Ajouter `core/identity.mjs` : création déterministe depuis seed, validation des données, trois couches et historique borné des personnalisations. Tester redémarrage, migration, identité et souvenirs préservés.
3. [ ] Ajouter `core/organism.mjs` : huit forces continues, influences directionnelles, contexte et acquis, endurance globale ; projection graphique pure et testable. Persister au repos et après chaque tour, sans retour à une personnalité universelle.
4. [ ] Intégrer avatar, descriptions accessibles, presets et éditeur avancé, contraste et réduction des mouvements, réglages durables. Tester à différentes tailles et sur navigateur automatisé si disponible.
5. [ ] Alléger le prompt de personnalité ; persister la désactivation des neurones et les modes. Exposer uniquement des métriques Android mesurées.
6. [ ] Étudier Piper et une adaptation MoE interne au tronc du modèle ; documenter dépendances, licences, méthode d'entraînement, validation et éléments encore absents. Ne pas remplacer ces tâches par un faux module.
7. [ ] Exécuter tests existants + régressions, build/lint Android CI, inspection du manifeste et signature compilés, publication d'une nouvelle prérelease et synchronisation des mémoires.

## Points de revue

- Arrêt lors d'une permission, d'une génération ou d'un callback TTS : aucune reprise d'écoute.
- Données anciennes, valeurs non finies, sauvegarde indisponible : migration et repli explicites.
- Grandes polices, faible hauteur, options ouvertes : visage et arrêt restent accessibles.
- Désactivation volontaire puis redémarrage : aucun module facultatif réactivé.
- Prérelease : distinguer compilation, tests automatisés, installation et qualité vocale réellement observées.

## Audit initial

17 tests JS existants passent. Le LFM2.5-230M est dense ; le routeur à motifs et les 304 paramètres ne réalisent pas un MoE linguistique. Les forces n'étaient ni persistées ni utilisées pour dessiner le visage (seule l'émotion dominante changeait les classes). Identité, seed et éditeur absents. Le prompt forçait « programme, pas une personne ». La désactivation des neurones n'était pas persistée.

Courses observées dans le code : permission acceptée après arrêt -> `startRecognizer()` sans garde de session ; callback d'une ancienne reconnaissance capable de détruire la nouvelle ; génération sans identifiant ; arrêt JS laissant `busy=true` ; TTS avec identifiant constant. Tests de régression à ajouter avant correctifs.

Le workflow republiait et remplaçait le même asset 0.3.0 à chaque push : le digest de Release `cd6b3e…` diffère de la mémoire `b7b186…`. Ne pas réécrire les anciennes notes : documenter la cause et figer les futures Releases par version/commit. Signature debug générée sur chaque runner : continuité de mise à jour non garantie, à stabiliser sans publier de matière privée.

## Validation manuelle encore indispensable

Samsung Android 16 : voix française on-device, mode avion, écho acoustique, longues conversations, mémoire/latence/CPU, TalkBack et grossissement. Aucun appareil physique n'est connecté à cette session.
