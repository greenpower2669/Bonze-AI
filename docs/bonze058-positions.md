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
