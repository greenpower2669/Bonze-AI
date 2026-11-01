# Bonze AI — carte centrale légère (audit du 01/11/2026)

**Objet :** pointer vers la bonne source, pas recopier l'historique. Ne charger que les tiroirs utiles. Le dépôt Bonze garde ses propres mémoires ; Djipie et FAB-Copilot sont distincts.

## État de référence
- Branche de développement auditée : `feature/bonze042-field-fixes`, HEAD `5fde323c` (31/10/2026), PR [#7](https://github.com/greenpower2669/Bonze-AI/pull/7) ouverte vers BONZE-041. L'audit ne porte pas sur une version Android installée.
- Code Android sur cette branche : `0.8.0-dev` (`versionCode 8`). Dernier APK **directement publié** : [0.7.0-dev](https://github.com/greenpower2669/Bonze-AI/releases/tag/bonze-ai-v0.7.0-dev). Le nouvel APK 0.8 corrigé n'est pas publié.
- Derniers contrôles : [tests HEAD verts](https://github.com/greenpower2669/Bonze-AI/actions/runs/41244426748) ; [packaging complet au SHA a0cc30ad](https://github.com/greenpower2669/Bonze-AI/actions/runs/41243984444). **Aucune preuve d'essai complet sur Samsung.**
- Limites principales : pertinence conversationnelle, audio Piper réel, mémoire privée non intégrée au dialogue, validation d'appareil, publication GitHub 403.

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
