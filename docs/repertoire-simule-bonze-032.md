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


## Avenant BONZE-034 — 2 000 répliques par émotion (30 octobre 2026)

Demande Fab : **2 000 formulations réellement sélectionnables pour chacun des huit rôles émotionnels et 2 000 pour le sage**, sans charger les 18 000 textes en RAM ni rédiger artificiellement des variantes proches à la main.

Implémentation : `core/repertoire-corpus.js` contient **200 noyaux sémantiques français rédigés** répartis sur 18 intentions, avec **10 constructions composables par noyau** (5 amorces × 2 conclusions), plus **162 points de vue émotionnels situés** (9 rôles × 18 intentions). Chaque rôle peut construire 2 000 phrases distinctes, donc **18 000 formulations composables vérifiées**, plus les **183 cartes initiales**. Elles ne sont **pas** 18 000 scènes originales rédigées individuellement. Les catégories `urgence` et `identite` restent volontairement sur le petit catalogue fixe existant ; pas de paraphrase en urgence. L'arbitre échantillonne paresseusement les fiches en évitant les derniers identifiants et leurs familles ; aucune matérialisation d'un tableau de 18 000 chaînes à l'initialisation. Les mêmes mécanismes Web et Rhino Android sont utilisés. Tous les messages générés respectent le budget de 220 caractères pour limiter les découpages vocaux ; cela ne prouve pas la diction Piper (lexique et PCM à éprouver sur le téléphone).

Tests `tests/repertoire.test.mjs` : décompte par rôle, unicité littérale globale, rôles sémantiquement différenciés, limites de longueur, protections urgence/identité, tirage sur 250 tours et état anti-répétition borné. L'assertion d'unicité porte sur **les textes construits**, pas sur une mesure de richesse lexicale, de compréhension ou sur une écoute réelle. Aucune Release ni fusion main demandée ; code en PR brouillon BONZE-032, validation APK Android toujours ouverte.
