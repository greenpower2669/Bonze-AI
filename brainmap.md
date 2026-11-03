# Bonze AI — carte centrale légère (audit du 01/11/2026)

**Objet :** pointer vers la bonne source, pas recopier l'historique. Ne charger que les tiroirs utiles. Le dépôt Bonze garde ses propres mémoires ; Djipie et FAB-Copilot sont distincts.

## État de référence
- Branche active : feature/bonze042-field-fixes ; mémoires condensées, sources archivées ; main préservée.
- APK directement publiée : [Bonze 0.8.0-dev parallèle](https://github.com/greenpower2669/Bonze-AI/releases/tag/bonze-ai-v0.8.0-dev-parallel) ; elle précède la mission BONZE-049 de 90 000 variantes.
- Contrôles récents : [APK expérimentale BONZE-055 inspectée, succès](https://github.com/greenpower2669/Bonze-AI/actions/runs/41344627317) ; [tests BONZE-056 (sujet unique)](https://github.com/greenpower2669/Bonze-AI/actions/runs/41355014355) verts. Pas d'essai physique Samsung ni de mesure de compréhension réelle du GGUF.
- **BONZE-072 — vrai dialogue génératif 1,2B livré en APK parallèle** : `fr.bonzeai.companion.lab12b` `0.8.2-lab12b`, code 10, poids Liquid Q4 intégrés (sans import), 1,2B **rédige des réponses françaises** dans cette seule variante ; retour possible au 230M de répliques préparées. [APK directe GitHub](https://github.com/greenpower2669/Bonze-AI/releases/download/bonze-ai-v0.8.2-lab12b/Bonze-AI-v0.8.2-lab12b.apk), [compilation](https://github.com/greenpower2669/Bonze-AI/actions/runs/41607888706), [publication](https://github.com/greenpower2669/Bonze-AI/actions/runs/41609120245). **Attention : tag Release lié techniquement à main, APK compilée du SHA de branche `94d8f6a0` ; aucune fusion main.** Taille ~1 Go, test physique non fait. Voir `docs/bonze072-liquid-12b-comparaison.md`, `todo.md`, `debughistorical.md`.
- Mission BONZE-050 : sélection de 1–4 phrases complètes selon sujet, émotion et intention, puis filtre anti-répétition ; voir docs/bonze050-composition-contextuelle.md, todo.md et debughistorical.md. L'APK 0.8 publiée précède ce travail.

## Les cinq mémoires actives
| Besoin | Fichier canonique |
| --- | --- |
| Invariants, décisions et architecture | [brain.md](brain.md) |
| Index de navigation minimal | **brainmap.md** (ce fichier) |
| Incidents, preuves, causes et inconnues | [debughistorical.md](debughistorical.md) |
| Actions ouvertes, critères de validation | [todo.md](todo.md) |
| Ordres explicites de Fab, restrictions de livraison | [ordres-de-mission.md](ordres-de-mission.md) |

## Code et études à ouvrir **selon le sujet**
- Dialogue : `ConversationService.java`, `BonzeInference.kt`, `ScriptedDialogue.java`, `core/repertoire.js`, `core/repertoire-corpus.js`, `ReplyQuality.java`.
- Émotions : `core/council.js`, `EmotionalCouncil.java`, `core/experts.mjs`.
- Mémoire utilisateur : `DialogueMemory.java`, `core/memory-drawers.mjs`, `core/memory-svc.mjs`, `core/memory-vault.mjs`, `docs/memory-ui.js`.
- Voix : `PiperVoice.kt`, `PiperPhonetics.java`, `PiperFrenchNumbers.java`, `SpeechPlan.java`.
- Intégration Android et UI : `MainActivity.java`, `docs/app.js`, `AndroidManifest.xml`, `.github/workflows/`.
- Rapport complet de cet audit : [docs/audits/2026-11-01-bonze-audit-sans-code.md](docs/audits/2026-11-01-bonze-audit-sans-code.md).
- Historique original intégral antérieur au nettoyage : [docs/memory-archives/2026-11-01-pre-audit/](docs/memory-archives/2026-11-01-pre-audit/). Ancienne archive `sauvegarde.md` **expirée** : ne pas charger automatiquement.

**Priorité de lecture :** carte → mission active → `todo`/incidents concernés → code ciblé. Ne pas charger les cinq archives à chaque reprise.
