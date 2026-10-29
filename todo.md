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
