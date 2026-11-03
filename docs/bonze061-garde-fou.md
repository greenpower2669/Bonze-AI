# BONZE-061 — séparer l'urgence de l'arbitrage des phrases

## Pourquoi
Le stress BONZE-060 a montré que le classement lexical peut s'abstenir sur une demande de secours parce qu'aucune expression du message ne correspond à celle des réponses proposées. C'est acceptable de s'abstenir sur une fiction inconnue, **mais pas comme unique réponse à une possible crise**.

## Modification expérimentale
Le nouveau module `core/safety-priority.js` teste un petit ensemble de formulations françaises **avant la sélection des phrases**, sans modèle neuronal, sans réseau et sans mémoriser le texte de la demande.

- `immediate` : signaux explicites de danger ou d'automutilation ; réponse fixe conseillant de contacter les services d'urgence **locaux** et une personne de confiance, sans inventer de numéro lié au pays.
- `supportive` : quelques formulations de détresse et de tristesse ; proposition d'écoute.
- `none` : aucun motif reconnu, **ce qui ne signifie jamais que le message est sans risque**.

Les règles tentent de ne pas traiter une citation de définition comme une confession et de ne pas faire disparaître un danger exprimé plus tard dans une phrase comportant une négation. Ces heuristiques doivent encore être confrontées aux formulations réelles, notamment celles de la transcription vocale.

## Validation
Tests : `tests/bonze061-safety.test.mjs`. [GitHub Actions 41403737605, réussite](https://github.com/greenpower2669/Bonze-AI/actions/runs/41403737605). Une première version avait échoué à cause d'un saut de ligne échappé incorrectement; [version corrigée 3d4a9f3b](https://github.com/greenpower2669/Bonze-AI/commit/3d4a9f3b1548a5f545cc82c434a0f44152de07f7).

**Statut d'intégration :** **aucune**. Ce composant expérimental n'est ni une fonction de sécurité active de l'APK, ni un substitut à l'assistance médicale ou à une vérification humaine. Il faudra auditer le routage d'urgence Android existant, les scénarios inconnus et les réponses fixes avant tout déploiement.

## Références utiles à la méthode
- [Zheng et al., ICLR 2024, *Large Language Models Are Not Robust Multiple Choice Selectors*](https://proceedings.iclr.cc/paper_files/paper/2024/hash/54dd9e0cff6d9214e20d97eb2a3bae49-Abstract-Conference.html) — biais de position et de jeton quand un modèle génère un identifiant d'option.
- [Pezeshkpour & Hruschka, NAACL 2024, *Sensitivity to the Order of Options*](https://aclanthology.org/2024.findings-naacl.130/) — les permutations de réponses constituent un test de robustesse pertinent.
- [Geifman & El-Yaniv, NeurIPS 2017, *Selective Classification for Deep Neural Networks*](https://papers.neurips.cc/paper_files/paper/2017/hash/4a8423d5e91fda00bb7e46540e2b0cf1-Abstract.html) — ne pas juger une sélection seulement par son taux de réussite : prendre aussi en compte le compromis entre abstention (couverture) et erreurs.
Ces publications **ne valident pas** le code Bonze ; elles étayent uniquement la méthode expérimentale et les réserves sur la mesure.

## Pistes suivantes
Faire examiner les réponses fixes par un humain, collecter un banc **nouveau et indépendant**, puis comparer la précision des alertes, les fausses alertes et les non-détections, y compris sur messages ambigus et transcript vocal imparfait. Mesurer les coûts et l'expérience sur Samsung et PC avant tout changement de plateforme ou Release.
