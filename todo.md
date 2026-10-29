# TODO Bonze AI

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
- [x] 25 tests JS locaux verts ; tests JVM et navigateur écrits (encore à exécuter en CI).
- [x] Étude primaire Piper/MoE, critères d'ablation/qualité/ressources et limites de licences documentés.
- [ ] Exécuter validation navigateur/JVM, build Android, lint, manifeste compilé et signature via CI.
- [ ] Publier et vérifier la prérelease 0.4.0 et son APK direct après réussite de tous les contrôles.
- [ ] Essai Samsung : première permission puis Stop, stop pendant génération/TTS, fond/reprise, mode avion, écho, pauses longues, TalkBack et grossissement.
- [ ] Piper français : build d'étude avec notices complètes, tests interruption/latence et écoute de la voix par Fab ; pas intégré dans 0.4.
- [ ] Véritable MoE linguistique : backend/adaptateurs experts/routeur entraînés au sein de l'inférence, corpus et évaluations tenues à l'écart ; pas réalisé dans 0.4.
- [ ] Mémoire sociale chiffrée et autorisations familiales fortes, consolidation/oubli/archives, miroir de compétences enrichi : commandes maintenues ouvertes.
- [ ] Stabiliser durablement la signature de test et préparer clé de production sauvegardée avant distribution stable. Ancienne clé debug absente ; ne pas recommander de désinstaller si données à préserver.

État de reprise : source distante vérifiée 9d7c9d5 ; modifications préparées sur la même branche via commit atomique, aucun merge main. Prochain geste : contrôler la CI du commit de reprise et corriger toute régression avant de donner un lien installable.
