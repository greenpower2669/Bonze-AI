# BONZE-058 — tester un biais de position plutôt qu'inférer une compréhension
_Contre-expérience du 1er novembre 2026, GitHub Actions Linux CPU_

## Résultats du premier essai C1
[Workflow avec données brutes](https://github.com/greenpower2669/Bonze-AI/actions/runs/41356604833/artifacts/13103497751) · [Rapport de la méthode](bonze057-banc-linux.md)

| Modèle Q4 | Indices valides | Bon choix attendu | Temps complet moyen (CPU Linux) |
|---|---:|---:|---:|
| Liquid LFM2.5-230M | 4 / 11 | 1 / 11 | 270 ms |
| Liquid LFM2.5-1.2B-Instruct | 11 / 11 | 3 / 11 | 1 593 ms |

**Audit brut :** le 230M a souvent renvoyé un fragment de la quatrième proposition ou « Numéro : », plutôt qu'un chiffre. Le 1,2B a renvoyé 0 dans 10 cas sur 11, y compris quand une autre réponse convenait. Notre ancienne consigne prescrivait 0 en cas d'hésitation, ce qui peut créer ou amplifier ce biais. Le résultat est trop faible et trop dépendant du prompt pour conclure à l'intelligence réelle de l'un ou l'autre modèle.

## Nouvelle contre-expérience C2
1. Même architecture, mêmes modèles et onze situations fictives synthétiques.
2. Pour chaque situation, faire une **rotation cyclique** des quatre propositions (positions 0,1,2,3). L'indice attendu se déplace avec la proposition correcte : sur 44 essais, on attend chaque index **exactement 11 fois**.
3. Consigne de classification simplifiée, sans favoriser l'indice 0 ni inclure une phrase de secours « 0 » ; sortie exigée à un seul chiffre.
4. Décodage glouton (déterministe), 4 tokens maximum, un seul GGUF chargé à la fois. Résultats C1/C2 écrits en JSONL pour vérification indépendamment du tableau.
5. Les métriques distinguent sorties conformes, choix attendus, histogramme des indices réellement produits, succès par situation sur les quatre permutations, et temps total CPU.

**Point de référence :** un modèle retournant toujours 0 ou toujours 3 gagne **11/44 = 25 %**. Ce seul hasard rendrait une « bonne réponse » plausible sans réelle sélection. La cohérence du sujet doit se vérifier malgré les permutations.

## Limites et suite
C2 teste surtout le **respect d'une consigne d'arbitrage** et la sélection lexicale simple. Les quatre options sont parfois volontairement de sujets différents pour mettre en évidence le biais, contrairement au Bonze de production qui ne doit jamais les mélanger. Les chiffres CPU Linux ne mesurent pas la RAM, la voix ou la latence Android. Si le biais persiste, comparer un filtre déterministe ou un modèle spécialement adapté à la classification plutôt que tenter de produire davantage de phrases libres.

**Protection :** aucune modification du code utilisateur Android, aucune Release, aucun changement `main`. Aucune écriture dans la mémoire générale Djipie.

## Résultat réel C2 : indices équilibrés mais modèles toujours biaisés
[Workflow Linux CPU terminé avec succès](https://github.com/greenpower2669/Bonze-AI/actions/runs/41357231288) — [données JSONL téléchargeables](https://github.com/greenpower2669/Bonze-AI/actions/runs/41357231288/artifacts/13103676754).

| Modèle | Sorties valides | Index attendus corrects | Exactitude | Temps complet moyen CPU Linux | Répartition des index prédits (0 / 1 / 2 / 3) |
|---|---:|---:|---:|---:|---|
| Liquid 230M Q4 | 39/44 | 11/44 | 25 % | 197 ms | 30 / 2 / 0 / 7 (+ 5 invalides) |
| Liquid 1,2B Q4 | 44/44 | 16/44 | 36,4 % | 1 212 ms | 0 / 0 / 27 / 17 |

Les **cibles** sont uniformément réparties : 11 attendent « 0 », 11 « 1 », 11 « 2 » et 11 « 3 ». Le modèle 1,2B n'a **jamais prédit 0 ou 1**, et le 230M n'a jamais prédit « 2 ». Le biais de position persiste même après suppression du secours « 0 » dans le prompt, quoique sa direction ait changé. Les 16/44 du 1,2B restent une indication faible : onze situations seulement, chacune répétée sous quatre permutations fortement liées entre elles. Une interprétation comme intelligence générale serait inappropriée.

**Décision technique à l'état d'expérience :** la contrainte prioritaire n'est pas démontrée comme venant d'Android. L'arbitrage **génératif par numéro** lui-même est fragile ; un arbitre non génératif, lexical ou spécialisé, constitue une hypothèse à comparer. Ne pas modifier l'APK ni jeter le code Android. Conserver la création des phrases validées et les filtres de sujet/rôle/anti-répétition. Ne pas fusionner dans main sans accord.

### Références des modèles
- [Liquid AI LFM2.5-230M GGUF](https://huggingface.co/LiquidAI/LFM2.5-230M-GGUF)
- [Liquid AI LFM2.5-1.2B Instruct GGUF](https://huggingface.co/LiquidAI/LFM2.5-1.2B-Instruct-GGUF)
- [Artefact exact des sorties du test](https://github.com/greenpower2669/Bonze-AI/actions/runs/41357231288/artifacts/13103676754)
