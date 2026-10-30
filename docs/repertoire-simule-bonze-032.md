# BONZE-032 — Répertoire incarné et classification Liquid (30 octobre 2026)

## Décision de Fab

Conserver le petit Bonze, les huit tendances, le sage, l'identité, la voix et les mémoires déjà présentes, mais **remplacer la génération de prose libre par des fiches de phrases revues**. Liquid LFM2.5-230M ne rédige plus la réplique : il tente de proposer une étiquette sémantique courte, et un classeur déterministe vérifiable choisit ensuite une phrase préécrite. Si Liquid échoue, le classifieur lexical prend le relais, sans Internet.

Architecture : STT local / saisie → conseil émotionnel existant → Liquid optionnel (catégorie) → sélection de cartes + anti-répétition → texte validé → Piper/Android TTS local. Les états affectifs sont **simulés**, les cartes n'ont pas de conscience, le modèle n'est pas un MoE neuronal et la classification ne constitue pas une compréhension démontrée.

### Fiches de phrases

- Code partagé \`core/repertoire.js\` exécuté dans la WebApp et dans le service Android par Rhino via \`ScriptedDialogue.java\`.
- 183 cartes de départ, 9 voix politiques (joie, peur, colère, calme, réflexion, empathie, curiosité, humour et sage), 20 intentions indexées dont salut, confusion, erreur, question, peur, inquiétude, jeu imaginaire, fatigue, danger et identité. Les cartes sont des propositions textuelles, pas des neurones individuels.
- Un score combine force et endurance du rôle, priorité sage dans les contextes critiques, pénalités de répétition de carte/famille et tirage pseudo-aléatoire avec graine stable.
- États persistés : graine, nombre de tours, 16 identifiants de cartes récents et 8 familles récentes. Aucun transcript supplémentaire sauvegardé par le répertoire.
- Quelques emplacements de synonymes sont autorisés **uniquement depuis des listes fermées relues**, et remplacés même quand le tirage de variation est désactivé. Il ne s'agit pas d'une génération libre de paraphrases par Liquid.
- Les catégories proposées par Liquid sont considérées non fiables. Un détecteur lexical garde la priorité pour urgence, émotion négative et correction et empêche la négation explicite de se faire remplacer par une humeur erronée. Les questions de fait sans preuve reçoivent des réponses d'incertitude.

### Chemins d'exécution

1. Web : \`docs/app.js\` appelle \`BonzeRepertoire.run\`, conserve \`scriptedState\` dans la même sauvegarde locale et anime l'avatar existant.
2. Android : \`ConversationService.java\` et \`BonzeInference.classify()\` transmettent **uniquement une étiquette** au moteur de cartes, puis réutilisent la chaîne de voix existante. En modes léger/texte ou neurones désactivés, les fiches fonctionnent sans GGUF chargé.
3. Sauvegarde : \`core/backup.mjs\` valide \`scriptedState\` et \`repertoire\` ; les chemins natifs export/import et rollback portent l'état borné de sélection. Une ancienne sauvegarde sans cet état reste admise.
4. Compatibilité : pas de fusion de \`main\`, pas de publication de Release, identité Android \`fr.bonzeai.companion\` préservée, permissions Internet absentes.

### Limites à ne pas masquer

- 183 cartes constituent un **premier lot de test**, non une couverture de toutes les situations. Les familles doivent être élargies à partir d'évaluations de dialogue réelles.
- Liquid reste un modèle dense de 230 M paramètres dont les poids doivent être chargés pour classer. Son temps de première réponse, la stabilité des labels et l'impact RAM **ne sont pas prouvés sur Samsung** ; le repli lexical reste utilisable.
- La mémoire « à tiroirs » de faits personnels, cartes S–V–C, liens de synonymes, provenance, renforcement / déclin, oubli, révision, consentement et import/export de corpus ne sont **pas implémentés**. Ne pas assimiler l'historique anti-répétition à une mémoire autobiographique.
- Les limites de Piper existantes persistent : \`piper-short-unstable\` (moins de 32 codepoints IPA), \`lexicon-oov\`, \`lexicon-number\` provoquent un secours TTS Android si aucun son Piper n'a démarré. Si l'audio a commencé, le service préfère arrêter que rejouer une phrase. Les journaux \`speech-fallback\` et \`speech\` permettent d'identifier la cause. **Aucune réparation acoustique n'est revendiquée sans écoute Samsung**.
- Vocabulaire limité, paraphrases protégées, aucune promesse de vraie conscience ni de raisonnement autonome.

### Validation progressive

- Tests \`tests/repertoire.test.mjs\` : couverture, catégories, identité, variétés, absence de répétitions excessives, négations, sécurité, injection, bornes, synonymes et export d'état.
- \`tests/native-bridge.test.mjs\` : contrat classement→répertoire ; \`tests/browser.mjs\` contrôle l'UI existante, cache SW version 9 et sauvegarde.
- Workflow Android temporairement activé sur la branche BONZE-032 mais \`publish-test-release\` reste réservé à \`feature/offline-bonsaiv1\` ; aucun APK de cette mission n'est annoncé avant compilation, essais et validation.

### Suite BONZE-033 (non réalisée)

Construire des cartes versionnées \`sujet / verbe / compléments / intention / provenance / accès / synonymes validés\`, index léger des tiroirs, renforcements avec vieillissement borné, éviction contrôlée et mémoire sociale séparée ; écrire des scripts de création/révision/export de fiches avec accord explicite et tests de confidentialité. Enrichir le répertoire en ciblant les trous de contexte, plutôt qu'en générant des milliers de copies triviales. Ajouter ensuite des comparaisons objectives Liquid vs classifieur lexical (exactitude, faux positifs, temps p50/p95, PSS/CPU, cas de négation), et un diagnostic Piper sur appareil.

## Repères scientifiques

- Modèle Liquid dense et limitations de génération : https://huggingface.co/LiquidAI/LFM2.5-230M
- Mixtral MoE, sélection d'experts vs poids résidents : https://arxiv.org/abs/2401.04088
- Android TextToSpeech / gestion des voix locales : https://developer.android.com/reference/android/speech/tts/TextToSpeech
- Conditions/diagnostics propres au projet : \`docs/moe-piper-study.md\`, \`docs/piper-integration.md\`.
