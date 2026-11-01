# Audit statique approfondi Bonze AI — 01/11/2026
**Périmètre :** branche `feature/bonze042-field-fixes` au commit `5fde323c23655fa2def5e29e735800ed821db11c`. Aucune édition du code, aucun test exécuté localement, aucun essai Samsung, aucune Release ni fusion. Audit de lecture via sources GitHub, PR, releases et workflows.

## Résumé exécutif
Architecture fonctionnelle mais **qualité conversationnelle non démontrée**. Le nouveau parcours répertoire prioritaire honore BONZE-044 ; son multiplicateur combinatoire produit 18k formulations mais pas une compréhension riche. La mémoire personnelle chiffrée reste un éditeur séparé, pas une mémoire automatiquement utilisable dans la discussion. Piper reste vulnérable à latence mémoire et cas lexicaux tant qu'un essai physique n'est pas réalisé. La livraison GitHub Release 0.8 est bloquée.

### Matrice de risques (P0 à P2 ; certitude = lecture code, non mesure appareil)
| Sévérité | Domaine | Constat / preuve | Action sans changer la décision de Fab |
| --- | --- | --- | --- |
| P0 | Pertinence | `ReplyQuality.java` calcule équivalence lexicale/échos et déflections ; ne vérifie ni réponse à la question ni exactitude des faits. `repertoire.js` choisit parmi 20 intentions. | Banc de 50–100 scénarios et critères subjectifs+objectifs. |
| P0 | Continuité | `DialogueMemory.context()` cite jusqu'à 8 entrées / 450 caractères, puis `BonzeInference.kt` coupe le contexte précédent à 300. | Tests multitours, collecte des cas de rupture, récapitulatif explicite borné. |
| P0 | Livraison | 0.7.0-dev est la dernière Release avec APK direct ; v0.8 intégrée/CI mais non livrée. Cause plausible 403 : droits Workflows. | Réparer permissions avec validation propriétaire, ne pas livrer ZIP. |
| P0 | Voix réellement audible | `PiperVoice.kt` pré-génère tous fragments flottants puis PCM entier ; première syllabe attend tout. Aucun test physique validant BONZE-046. | Mesurer temps synthèse/premier son, pics PSS, interruptions, Bluetooth, OOV. |
| P1 | Souvenirs privés | `memory-ui.js` + `memory-vault.mjs` stockent un coffre chiffré, lecture manuelle uniquement ; aucune route visible `recall()` → `ConversationService.reply()`. | Décider sous quelle autorisation explicite les souvenirs peuvent enrichir la conversation. |
| P1 | Anti-répétition | `ScriptedDialogue.choose()` sauvegarde l'état lors de chaque essai, même si le filtre rejette la proposition. Les 8 tirages ne garantissent pas la pertinence. | Tests sur épuisement, biais, redites avec scénarios longs. |
| P1 | Classification | `IntentClassify.java` n'accepte que 20 étiquettes, et `BonzeInference.classify` limite la sortie à 20 tokens. Un classement valide peut toutefois être faux. | Comparer matrice de confusion de l'intention, validation humaine. |
| P1 | Sémantique synonymes | `SynonymChoice.java` autorise 21 paires un remplacement à la fois, sans analyse syntaxique robuste ; invalidité numérique rejetée. | Revue linguistique, négations, grammaire, responsabilité de la phrase initiale. |
| P1 | Mémoire/autorisation | Le coffre Web est chiffré via PBKDF2-310k et AES-GCM ; `access.verified` est une assertion de l'UI, non un authentificateur en soi. | Audit des frontières UI/coffre, restauration, appareil partagé et permissions. |
| P1 | Écoute | `AndroidManifest.xml` sans INTERNET, STT `createOnDeviceSpeechRecognizer`, mais disponibilité et qualité FR doivent être confirmées par appareil. | Scénarios permission refusée / voix locale absente / écran verrouillé. |
| P1 | Historique | 30 entrées persistées en `SharedPreferences`, coffre privé Web chiffré distinct ; une même étiquette « mémoire » cache deux niveaux de confidentialité. | Tests de migration/backup/rollback et explication claire à l'utilisateur. |
| P2 | Émotions | `EmotionalCouncil.java` exécute `core/council.js` via Rhino : simulation/routage observable, pas plusieurs LLM neuronaux. | Tester influences et expression avatar synchronisée sur événements réels. |
| P2 | Contrôle qualité | Les tests GitHub de HEAD sont verts mais le packaging complet est attesté sur un SHA précédent. | CI complète du HEAD après approbation, puis essai appareil. |

## Inventaire et niveaux de preuve
- Branches : `main` et neuf branches de fonctionnalités visibles. PR #1–7 ouvertes ; #7 tête `feature/bonze042-field-fixes`, base BONZE-041.
- Sources : `ConversationService.java`, `BonzeInference.kt`, `ScriptedDialogue.java`, `ReplyQuality.java`, `PiperVoice.kt`, `core/repertoire.js`, `core/repertoire-corpus.js`, `core/memory-drawers.mjs`, `docs/memory-ui.js`, `core/memory-vault.mjs`, `AndroidManifest.xml`, `android/app/build.gradle`.
- APK parallèle en CI [run 41243984444](https://github.com/greenpower2669/Bonze-AI/actions/runs/41243984444), SHA `a0cc30ad` ; empreinte dans `todo.md` archivé. Tests au [HEAD 5fde323c](https://github.com/greenpower2669/Bonze-AI/actions/runs/41244426748) réussis, pas preuve de même niveau que compilation/lint/signature.
- [Releases publiées](https://github.com/greenpower2669/Bonze-AI/releases) : dernière `bonze-ai-v0.7.0-dev` ; aucune Release 0.8 confirmée lors de l'audit.

## Analyse du parcours réel
1. Message depuis micro local ou texte → `ConversationService.reply()` → `memory.context()` et conseil émotionnel.
2. `KnowledgeGuard` traite une poignée de cas hors connexion ; `BonzeInference.classify` renvoie une étiquette ou secours lexical.
3. `ScriptedDialogue.choose` tire des phrases par intention/état à partir d'un répertoire ; `ReplyQuality.review` filtre échos et certaines réponses génériques, pas la pertinence factuelle.
4. En mode précis, si synonymes possibles, un second passage Liquid choisit 0–4, validé par `SynonymChoice.pick`. Coût mémoire et latence à mesurer.
5. La réponse est mémorisée puis Piper la synthétise, prébufferise et lit le PCM ; en cas d'échec, message/journal sans bascule automatique Android.
6. Coffre SVC/personnes/scènes chiffré : interface distincte, accessible seulement après ouverture manuelle ; pas d'injection dans la réponse native.

## Nettoyage conservateur des mémoires du dépôt
Les cinq mémoires actives totalisaient environ **152 000 caractères**, et `sauvegarde.md` archive expirée ajoute ~37 000 caractères. `brainmap.md` était ~21,7k, `todo.md` ~42,7k et commençait encore par une 0.6.0 comme état courant. Les mêmes preuves 0.6, décisions Piper et consignes de livraison étaient dupliquées.

**Méthode :** sauvegarder les cinq textes complets et non modifiés dans `docs/memory-archives/2026-11-01-pre-audit/`, puis limiter les fichiers actifs à (1) carte, (2) invariants, (3) preuves/causes, (4) actions ouvertes, (5) ordres. Ne pas modifier `sauvegarde.md`, les sources, `main`, ni Djipie. Mettre les détails chronologiques, SHA de chaque APK et événements anciens dans l'archive, pas dans la carte. Ne pas requalifier des « demandes en attente » en « faits implémentés ».

## Plan de validation par étapes
**A.** Tester le parcours 20 tours en texte, un scénario attendu par intention puis « suite », « pourquoi ? », critique, négation et question factuelle. Enregistrer modèle, intention classée, identifiant de carte, sortie, temps et évaluation humaine.

**B.** Tester un APK parallèle effectivement téléchargeable et signé, 20 tours audio sur Samsung avec Shokz/Bluetooth, écran verrouillé, Stop pendant STT/LLM/Piper, micro et mode avion, 0–9999, horaires, noms propres. Distinguer « audio absent », « synthèse lente », « erreur lexique » et « réponse inadéquate ».

**C.** Tester données existantes sans écrasement : 0.7 installée, restauration chiffrée `.bonze`, UID/package parallèle, historiques, coffre, déverrouillage, révisions/oubli, corruption et retour arrière.

**D.** Valider l'autorisation utilisateur pour toute publication ; résoudre 403 GitHub sans secret en clair, nouvelle compilation au commit ciblé, empreinte/package/signature, asset `.apk` direct GitHub Release. Ne jamais confondre ZIP d'Actions et livraison.

## Conclusion
La prochaine optimisation utile n'est pas de multiplier encore les 18 000 phrases : c'est **améliorer l'adéquation à la question, la mémoire contextuelle sous consentement, le coût réel de l'inférence et la fiabilité audible sur téléphone**. L'audit a été effectué *sans coder* ; les seuls changements documentaires proposés dans cette branche sont les mémoires vivantes, leurs archives et ce rapport.
