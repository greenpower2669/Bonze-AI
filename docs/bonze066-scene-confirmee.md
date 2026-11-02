# BONZE-066 — mémoire de sujet et scène confirmée

## Architecture implémentée

Le module expérimental `core/scene-anchor.js` compose deux états de session indépendants :

1. **Sujet confirmé** : un identifiant canonique conservé par BONZE-064, qui reflète les instructions thématiques de l'utilisateur et ne dépend pas des réponses de Bonze.
2. **Dernière phrase de fiction délivrée** : texte court (240 caractères maximum), conservé *temporairement en RAM* seulement après un appel `acknowledge(receipt)` correspondant à la proposition présentée. Sa provenance est une **phrase produite puis affichée**, pas un fait du monde ni un souvenir personnel vérifié.

L'API `createSession()` expose `step({text,options,context})`, `acknowledge(receipt)`, `snapshot()` et `reset()`. Un nouveau tour invalide toute proposition pendante non acquittée ; l'interruption de sécurité et le changement de sujet effacent le texte de scène. Le reçu progresse de façon monotone, y compris après réinitialisation. `snapshot()` ne divulgue pas le message de l'utilisateur ni le texte narratif. Le code est indépendant d'Android, du GGUF, d'Internet et du stockage persistant.

## Tests reproductibles

[Workflow BONZE-066 réussi](https://github.com/greenpower2669/Bonze-AI/actions/runs/41501094199) · [fichiers de diagnostic JSON, JSONL et rapport](https://github.com/greenpower2669/Bonze-AI/actions/runs/41501094199/artifacts/13167379693).

Les **trois histoires BONZE-065 déjà analysées** ont été rejouées dans quatre ordres d'options (240 choix par variante). La source était connue lors de la conception : cette expérience mesure des régressions, **pas** une généralisation indépendante.

| Mesure | Sujet seul (BONZE-064) | Sujet + scène acquittée (BONZE-066) |
|---|---:|---:|
| Choix attendus | 112/240 (46,7 %) | **132/240 (55,0 %)** |
| Abstentions | 120 | **96** |
| Mauvais indices sélectionnés | **8** | 12 |
| Histoires entièrement correctes (20/20) | 0/12 | 0/12 |

**Lecture :** +20 bons choix mais +4 mauvais choix. Le contexte narratif immédiatement précédent permet de sortir de certaines abstentions, mais si une phrase délivrée est inadaptée, elle peut favoriser une dérive. Il faut donc apprendre à différencier une information de scène cohérente et une réponse contradictoire. Ni le prototype ni le banc ne démontrent une compréhension réelle des histoires.

## Réserves avant toute intégration

Le banc simule l'accusé de réception immédiatement après un choix. Il **ne mesure pas** les confirmations réelles d'affichage, de lecture Piper, d'accessibilité TalkBack, ou l'interruption Stop sur Samsung. La conservation d'un texte court en RAM ne signifie pas qu'il doit devenir une mémoire personnelle persistante. Une évaluation humaine indépendante et des tests complets en conditions réelles sont indispensables.

Le routeur de sécurité BONZE-061 reste un module non certifié présentant des erreurs ; BONZE-066 ne le remplace pas. Aucune modification Android, APK publiée, Release ou fusion `main` n'a été effectuée.
