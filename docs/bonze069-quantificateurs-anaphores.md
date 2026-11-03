# BONZE-069 — négations, quantificateurs et pronoms dans une histoire

## Objectif et périmètre

La mémoire narrative expérimentale BONZE-066 retient séparément le thème choisi par l'utilisateur et la dernière phrase de fiction effectivement délivrée. BONZE-067/068 ne détectait que quelques inversions littérales, au risque de manquer « aucune clé », « n'a jamais ouvert » ou « ne l'ouvre pas ».

BONZE-069 étend **le petit détecteur facultatif** `core/story-consistency.js` aux formes strictement reconnues ci-dessous. Il n'est connecté ni à Android, ni aux dossiers de mémoire personnelle, ni à une procédure de prise en charge clinique. Une valeur `conflict:false` signifie **absence de contradiction prouvée par ce système**, jamais une preuve de cohérence.

## Modifications de code

1. **Quantificateurs et possession :** distinguer « le robot possède une clé », « le robot n'a aucune clé », « le robot ne possède aucun livre » et « le robot possède un livre ». Acteur défini et nom d'objet doivent être identiques ; une référence « un robot » puis « le robot » n'impose pas qu'il s'agisse du même personnage.
2. **Portée de « jamais » :** détecter certains conflits entre « n'a jamais ouvert/trouvé/fermé/caché » et une affirmation explicite au passé assortie de « hier » ou d'un jour de la semaine, à acteur, action et objet identiques. Une action **future**, une hypothèse ou une citation n'est pas traitée comme une contradiction.
3. **Pronoms d'objet :** pour un seul objet exprimé sans ambiguïté, distinguer « le robot ouvre le coffre » de « le robot ne l'ouvre pas ». Deux objets dans la même phrase ou un personnage représenté seulement par un pronom restent à clarifier.

Ces trois extensions ne rajoutent **aucune génération**, réseau ou modèle GGUF. Si un conflit est explicitement détecté, l'ancre de scène retourne une abstention, sans créer de reçu de livraison ni mémoriser le candidat proposé.

## Expériences traçables

Les deux jeux ont été rédigés par le projet, non évalués à l'aveugle par des personnes indépendantes.

**Banc 1 : 49 paires d'exemples préparées avant BONZE-069 (17 contradictions attendues, 32 cas sans conflit démontré).**

| Mesure | Ancien code | Nouveau code |
|---|---:|---:|
| Contradictions reconnues | 1/17 | **17/17** |
| Contradictions manquées | 16 | 0 |
| Faux veto | **0** | **0** |
| Cas correctement laissés ouverts | 32/32 | 32/32 |

[CI du code original, avant changement](https://github.com/greenpower2669/Bonze-AI/actions/runs/41557266466) ([données](https://github.com/greenpower2669/Bonze-AI/actions/runs/41557266466/artifacts/13193979360)). [CI du code corrigé](https://github.com/greenpower2669/Bonze-AI/actions/runs/41557469675) ([données](https://github.com/greenpower2669/Bonze-AI/actions/runs/41557469675/artifacts/13193969683)). **Ce gain est une régression de développement : les exemples ont servi à définir les trois extensions et les tests.**

**Banc 2 : 32 autres paires préparées après la correction mais avant leur première exécution (16 conflits attendus, 16 cas sans conflit prouvé).**

| Mesure | Résultat du code corrigé, sans autre réglage |
|---|---:|
| Contradictions reconnues | **8/16** |
| Contradictions manquées | 8 |
| Faux veto | **0/16** |
| Cas correctement laissés ouverts | **16/16** |

[Seconde épreuve GitHub](https://github.com/greenpower2669/Bonze-AI/actions/runs/41557837168) et [diagnostics bruts](https://github.com/greenpower2669/Bonze-AI/actions/runs/41557837168/artifacts/13194689286). Ce résultat, moins flatteur, révèle les limites réelles de nos règles sur les **pluriels (« deux clés »), verbes synonymes (« détenir »), nouveaux verbes (« voir », « traverser », « tenir », « prendre ») et états synonymes (« rempli »)**. Les 32 cas ont été créés par la même assistante ; ce n'est toujours **pas une validation indépendante**.

Les anciens jeux BONZE-067/068 et les tests Android hors expérimentation n'ont pas montré de régression lors des contrôles GitHub, mais aucune mesure sur Samsung n'a été réalisée.

## Décisions et limites

- Conserver le fonctionnement **prudent et opt-in**. Ne pas traiter une absence de contradiction reconnue comme preuve qu'une phrase est correcte.
- Ne pas étendre les verbes à l'aveugle à partir du second jeu désormais inspecté. Définir un modèle explicite de référence des personnages, de quantité, d'événements datés et de provenance de la parole.
- Un éventuel futur test doit contenir des dialogues consentis et des scénarios annotés indépendamment **avant** l'évaluation, et mesurer séparément mauvaises sélections, fausses abstentions et véritables contradictions.
- Ne pas brancher ces règles dans une application Android ou dans une voie de sécurité avant validation réelle des événements livrés, de l'interruption Piper/TalkBack et de la confidentialité.

**Statut :** branche `feature/bonze042-field-fixes`, prototype de recherche. `main`, APK publiée, moteur de synthèse vocale et mémoire personnelle inchangés.
