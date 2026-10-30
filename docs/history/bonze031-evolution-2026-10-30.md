# Bonze AI — carnet d'évolution BONZE-031 / BONZE-030 (30 octobre 2026)

## Source, branches et livraisons
- Branche expérimentale uniquement : \`feature/bonze031-dialogue-natural-v1\`, partie du HEAD \`445408ee\` de \`feature/offline-bonsaiv1\`.
- Point de retour publié inchangé : \`bonze-ai-v0.6.0\`, commit \`14757d3\`.
- Aucun merge main, aucune publication de Release, aucun APK/AAB distribué pour ce chantier.
- Pas de changement d'ID Android \`fr.bonzeai.companion\`, pas de permission INTERNET, aucun changement de signature.

## Implémenté sur la branche de développement

**Dialogue**
- \`DialogueMemory.context()\` prépare un extrait récent borné et chronologique de messages humains **et** des réponses antérieures de Bonze, au lieu d'oublier ses propres réponses.
- \`BonzeInference.kt\` adopte une consigne de personnalité plus courte, participative, tutoiement, humoristique si pertinent, et place les **citations antérieures** côté utilisateur ; elles ne sont pas des ordres de système.
- L'AAR \`llama-android:0.1.1\` fournit un système + un utilisateur, pas un historique multimessage natif démontré. Cette limite persiste.
- \`tests/DialogueMemoryTest.java\` protège l'ordre, la taille, le nettoyage et le contexte.

**Conseil intérieur**
- \`core/council.js\` conserve les huit contributions et l'arbitre ; une nouvelle **heuristique explicite de statut épistémique** distingue imaginaire, déclaration, demande actuelle non vérifiée, question sensible. La trace porte \`knowledge.category\`, \`verified:false\` et \`epistemicOverride\`. Le conseil peut prioriser une consigne de prudence pour une question sensible ou en temps réel.
- Ce code n'est pas un réseau de vérification factuelle, pas un véritable MoE linguistique et pas une preuve de vérité. Les états de colère, fatigue, humour restent calculés.

**Mémoire à tiroirs, étape expérimentale**
- \`core/memory-drawers.mjs\` : neuf types de tiroirs, carte sans texte intime, statut/provenance, confirmation humaine préalable, recherche locale à score lexical, maximum trois extraits par défaut, budgets, révision, archivage et oubli, restauration contrôlée par schéma/identifiants.
- \`core/memory-vault.mjs\` : enveloppe par instance, PBKDF2-SHA256 310000 itérations et AES-GCM-256 avec sel/aléa, phrase secrète distincte et AAD. Pas de service Internet.
- \`docs/memory-ui.js\`, \`docs/index.html\`, \`docs/app.js\` : coffre déverrouillé manuellement depuis Options ; création/lecture/recherche/effacement uniquement avec confirmation, verrouillé par Stop, écran masqué et fermeture. Aucun souvenir privé injecté automatiquement au LLM/à une voix inconnue.
- \`core/backup.mjs\` et \`webState()\` conservent l'enveloppe **déjà chiffrée** dans le format \`.bonze\` v1 ; les sauvegardes 0.6 sans tiroir restent lisibles ; le coffre conserve sa phrase secrète propre après restauration.
- \`docs/sw.js\` cache v9 pour hors ligne. Attention : l'historique de conversation 0.6 conserve ses limites de confidentialité ; l'authentification familiale complète et le chiffrement interne de chaque ancienne donnée restent **non réalisés**.
- La mémoire est disponible en consultation manuelle mais **pas encore intégrée à l'inférence vocale**. Cela empêche actuellement un enfant/tiers d'obtenir un souvenir privé simplement en parlant au personnage. Un même coffre laissé déverrouillé dans l'interface reste un risque partagé : fermer et verrouiller.
- L'instruction \`verified:true\` au sein des fonctions pures n'est **pas** une authentification sécurisée autonome ; la frontière pratique actuellement ajoutée est l'ouverture cryptographique par phrase secrète. Ne pas réutiliser les fonctions pures sans ce contrôle.

**Étude comparative**
- \`.github/probes/bonze031.cpp\` : mêmes scénarios français, seed 42, paramètres comparables, quatre variantes R0/A1/A2/A3 et sorties JSONL (pas des réponses fabriquées).
- \`.github/workflows/bonze031-ci.yml\` : tests JS/JVM/navigateur + compilation Android de source, sans APK publié ; comparaison 230M/1.2B sous garde manuelle ou message de commit explicite \`[bonze-benchmark]\` pour ne pas télécharger 731 MB à chaque push.
- \`scripts/score-dialogue.mjs\` : rapport descriptif de latence et heuristiques textuelles, **pas un score de compréhension humaine**. Les modèles ne sont jamais chargés ensemble : un processus hôte se termine avant le chargement du suivant.
- Les GGUF officiels sont vérifiés par SHA-256 et restent sous licence LFM1.0. Le 1.2B **n'est pas encore ajouté à l'APK, ni sélectionnable à l'écran**. Une adoption exige essai technique et arbitrage de Fab.

## Vérifications et limites
- GitHub Actions \`41090306459\` (commit \`e0681a83\`) : JS et JVM OK, navigateur accessibilité/hors ligne et coffre OK, compilation Kotlin+Java Android OK. Ce sont des tests automatisés, **pas un APK signé ni une mesure Samsung**.
- Le benchmark du vrai GGUF, la qualité conversationnelle française, la prise en charge multi-rôles native, le ressenti spontané, les répétitions, la RAM/PSS Samsung, l'écoute Piper restent à mesurer.
- Le nouveau coffre exige une phrase secrète, ne prend pas de souvenir sans action explicite, ne valide pas la vérité, et n'autorise pas l'accès par un simple surnom, une voix ou un PIN partagé.
- Les résultats des mesures Linux ne doivent pas être extrapolés au téléphone.

## Travaux restants avant livraison
1. Vérifier la comparaison de deux GGUF et les fichiers JSONL/rapport produits, puis analyser les réponses du granité, du dragon Pipo, de la météo et de la santé. Tester un vrai contexte multi-rôles si cela apporte mieux.
2. En fonction des mesures, rendre le choix 230M/1.2B réellement disponible sur Android (un seul à la fois, gestion du fichier, licence, empreinte, temps de déchargement, échec RAM), sans installer deux poids lourds d'office.
3. Ajouter une authentification familiale forte et des autorisations par personne/scene; seulement ensuite étudier l'injection sélective de souvenirs privés dans l'inférence, avec recherche/stop/backup et tests de fuite.
4. Approfondir les experts entraînés, vraie ablation MoE, IA du savoir et développement de la voix Piper (prononciation, nombres, noms, naturel, écho).
5. Tests de non-régression Android instrumentés, signature persistante, APK de test direct nommé \`Bonze-AI-vVERSION-debug.apk\` et éventuellement AAB **seulement après l'autorisation explicite de Fab pour publier**.
6. Validation réelle sur Samsung, mode avion, voix/Piper/Stop/veille/TalkBack, mémoire, température, et validation humaine du dialogue avant clôture.

Statut : développement incrémental **partiellement achevé**, 0.6.0 reste le retour vérifié. Conserver la branche et les TODO ; ne pas confondre tests automatisés, compilation et validation utilisateur.

## Étape suivante : sélection Liquid 1.2B sur Android (30/10, branche uniquement)
Correctif C++ du benchmark : token de décodage désormais mutable. Un sélecteur a été codé : Liquid 230M par défaut, Liquid 1.2B-Instruct Q4_K_M seulement après import explicite du GGUF depuis ACTION_OPEN_DOCUMENT, vérification SHA-256, contrôle d'espace et copie privée sur thread de fond. Aucun accès réseau ni autre modèle embarqué. Bonze unload l'ancien avant chargement du nouveau. La préférence est stockée côté Android et Web, incluse dans l'export `.bonze` v1, avec retour sûr au 230M quand le 1.2B n'est pas présent. Les tests statiques de sélection/import et de sauvegarde sont ajoutés. La vérification Android matérielle, la compatibilité du 1.2B avec le backend natif, les pics RAM et la qualité vocale sont encore inconnus : ne pas considérer cette option comme validée sur Samsung. Pas de modification du tag 0.6.0, ni de `main`, ni de publication APK.
