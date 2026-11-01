# Bonze AI — invariants et architecture de référence
_Mémoire vivante condensée le 01/11/2026 ; sources historiques intégrales conservées dans `docs/memory-archives/2026-11-01-pre-audit/`._

## Vision de Fab (invariants)
- Bonze est un compagnon local, expressif, continu dans la conversation, capable de jeu de rôle, de curiosité et d'apprentissage explicite. L'authenticité de l'échange compte davantage que des formules nombreuses ou protocolaires.
- Huit tendances : curiosité, joie, calme, réflexion, empathie, peur, colère, humour ; conseil et arbitre, avec forces, endurances et influences asymétriques, sans prétendre qu'il s'agit de huit LLM autonomes ou de sentiments conscients.
- Identité innée/personnalisée/acquise distinctes, apprentissages vérifiables, confiance/provenance et distinction faits, déclarations, hypothèses et fiction.
- Mémoire privée à tiroirs, isolée par utilisateur et protégée ; les souvenirs ne doivent jamais devenir des ordres cachés, une preuve d'identité, ou une vérité du seul fait qu'ils ont été déclarés.
- Accessibilité : visage lisible, sous-titres contrastés, interruption immédiate, fonctionnement en veille après activation humaine, aucune reprise automatique du micro. Android hors connexion sans permission INTERNET.

## Décision centrale BONZE-044 (31/10/2026)
Le répertoire **écrit** exclusivement les répliques prononcées. Liquid classe une intention parmi 20 catégories et peut désigner un **indice** parmi les variantes françaises autorisées ; Liquid **ne génère plus librement** de texte vocal. Variante douteuse → phrase originale. Un seul modèle GGUF lourd actif à la fois. Le 230M embarqué reste le défaut ; Liquid 1.2B Q4 est optionnel et actuellement importé manuellement via Android SAF, vérifié par SHA-256, non livré dans l'APK. La seconde inférence pour synonymes s'applique en mode précis uniquement.

Le corpus vise désormais 200 noyaux × 50 formes = 10 000 formulations virtuelles par rôle, soit 90 000 pour 8 émotions et le juge/sage. Ce sont des variantes combinatoires, non des connaissances ou 90 000 réponses distinctes validées. Liquid classe et choisit des indices parmi des variantes fermées ; pas de texte libre.

## Ce qui est réellement implémenté (branche BONZE-042, évolutive)
- Android Java/Kotlin et WebView locale ; session vocale native dans `ConversationService` ; STT Android `createOnDeviceSpeechRecognizer` quand disponible, service au premier plan, notification Stop, micro arrêté au départ/à la mort du processus.
- `DialogueMemory` : 30 entrées max, scène, contexte borné ; le passage transmis à Liquid est réduit à 300 caractères de passé dans `BonzeInference`. Il s'agit de mémoire immédiate, pas du coffre de souvenirs.
- `EmotionalCouncil`/Rhino et corpus partagé ; filtres anti-écho (`ReplyQuality`) et huit tentatives de répertoire, mais aucun jugement général de véracité ou de pertinence.
- Piper MLS / sherpa-onnx avec lexique français, conversion des entiers 0–9 999 et horaires `HhMM` ; synthèse PCM complète avant lecture ; pas de bascule silencieuse vers TTS Android si Piper échoue.
- Mémoire SVC/tiroirs chiffrés en WebView via PBKDF2 + AES-GCM et consentement explicite ; actuellement **consultation manuelle** et **aucune injection dans la conversation native**. Cette limitation est volontaire dans le code présent et incomplète au regard de l'objectif d'une mémoire évolutive contextuelle.
- Sauvegarde `.bonze` chiffrée et mécanismes de restauration/rollback ; contrôles code présents, scénarios réels à vérifier.

## États et portée des validations
- `main` n'est pas la branche de développement. PR #1–#7 restent ouvertes en chaîne et plusieurs branches historiques divergent ; **ne pas fusionner sans accord de Fab**.
- APK directement publiée : [Bonze 0.8.0-dev parallèle](https://github.com/greenpower2669/Bonze-AI/releases/tag/bonze-ai-v0.8.0-dev-parallel), construite sur a0cc30ad ; ne contient pas l'évolution 90k. Une nouvelle distribution exige une validation distincte.
- Tests de HEAD verts : `Bonze AI tests` [41244426748](https://github.com/greenpower2669/Bonze-AI/actions/runs/41244426748). Packaging/lint/signature complet antérieur au HEAD : [41243984444](https://github.com/greenpower2669/Bonze-AI/actions/runs/41243984444), SHA `a0cc30ad`. Ils ne remplacent ni écoute réelle ni tests de qualité conversationnelle.
- Limitations prioritaires : compréhension et continuité sur questions concrètes, latence et robustesse Piper, sécurité et fluidité de la mémoire, acceptation Samsung 20 tours, Play Protect/signature et publication.
- Consulter `ordres-de-mission.md` et `todo.md` avant toute tâche ; reporter les preuves datées dans `debughistorical.md` et études dans `docs/`.

## Repères de documentation
`docs/bonze043-dialogue-voix-integration.md`, `docs/bonze044-liquid-synonymes.md`, `docs/bonze045-synonymes-piper-questions.md`, `docs/bonze046-heures-piper.md`, `docs/architecture-memoire-a-tiroirs.md`, `docs/bench-dialogue-fr-bonze031-results.md`, `docs/audits/2026-11-01-bonze-audit-sans-code.md`.

Les décisions dépassées (par exemple génération libre Liquid prioritaire, ou voix Android substituée automatiquement à Piper) restent uniquement dans **les archives datées** ; ne pas les restaurer comme invariants actifs.

## BONZE-049 — corpus 90 000 et rôle pour Liquid (01/11/2026)
- 200 noyaux documentés, 10 ouvertures × 5 conclusions par noyau : **10 000 variantes virtuelles par rôle**, huit émotions + rôle juge/sage = **90 000**. Index calculés au tirage ; pas de liste de 90k chaînes chargée en RAM. Ces variantes ne sont pas des faits ou des connaissances.
- Liquid reçoit la dernière partie du contexte (jusqu'à 450 caractères), le message courant, l'intention finale et le **rôle choisi par le répertoire** ; il sélectionne l'indice d'une variante lexicale prévalidée, 0 = original. Les limites de 21 paires, un seul remplacement et au plus 4 choix restent volontairement conservatrices. Aucun moteur neural supplémentaire chargé.
- Commits 622705be (extension/comptage/choix contextuel) et 95b0778f (rôle émotionnel/juge transmis à Liquid). [CI 41321401979](https://github.com/greenpower2669/Bonze-AI/actions/runs/41321401979) réussie sur 622705be, incluant tests et compilation ; validation et empaquetage complets du dernier commit à contrôler avant livraison.


## BONZE-050 — objectif prioritaire : construction contextuelle guidée par Liquid (01/11/2026)
- Le sujet et l'intention de l'utilisateur déterminent la sélection. Liquid classe l'intention, puis compare 1 à 4 phrases complètes déjà construites à partir des noyaux sémantiques, ouvertures et conclusions du répertoire. Il ne rédige jamais librement une réponse.
- Le rôle émotionnel ou juge reste constant au sein du lot de variantes ; une heuristique lexicale de sujet trie les propositions avant l'arbitrage Liquid. Les modèles restent locaux, un seul GGUF lourd chargé.
- Les filtres anti-écho, anti-répétition, qualité et Piper fonctionnent avant et après le choix ; seule la phrase effectivement prononcée est inscrite dans l'historique. Les previews refusées ne sont pas mémorisées.
- Urgence, identité, questions factuelles et corrections restent conservatrices, sans arbitrage libre par Liquid. KnowledgeGuard conserve sa priorité.
- Limites : 90 000 assemblages ne représentent que 200 noyaux sémantiques ; cela ne suffit pas à résoudre toute question ou à prouver la pertinence réelle. Tests Samsung et mesure de latence indispensables.

### BONZE-051 — validation fonctionnelle du répertoire (01/11/2026)
Banc automatique reproductible de 82 énoncés français couvrant 20 intentions : 82/82 reconnus par `BonzeRepertoire.detect` après correction. Priorité des alertes explicites, expressions de pleurs, négations émotionnelles et apostrophes françaises corrigées. Scénario simulé de 20 tours et 9/10 sujets de jeu détectés lexicalement dans les formulations proposées. **Ce score concerne le routeur déterministe et les thèmes, pas les prédictions réelles Liquid ni une compréhension sémantique mesurée sur appareil.** Voir `docs/bonze051-banc-dialogue.md` ; tests Android physiques et latence toujours ouverts.
