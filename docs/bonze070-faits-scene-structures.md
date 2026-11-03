# BONZE-070 — mémoire de fiction structurée, ordre et provenance

## Objectif et résultats réels

Les versions BONZE-067 à BONZE-069 comparent principalement des mots et des formes grammaticales. BONZE-070 expérimente un modèle plus explicite : représenter, avec un vocabulaire strictement limité, **qui fait quoi, sur quel objet, avec quelle quantité et dans quelle situation temporelle**. Les contenus proviennent de phrases de fiction, pas de faits vérifiés sur l'utilisateur ou le monde.

La démarche rejoint des principes classiques de raisonnement sur les événements et le temps, comme la représentation d'intervalles d'Allen ([IJCAI 1981](https://ijcai.org/proceedings/1981/46)), l'annotation des événements et expressions temporelles ([Pustejovsky et Mani, ACL 2003](https://aclanthology.org/N03-5006/)) et la provenance d'événements ([AWS Event Sourcing](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/event-sourcing-pattern.html)). **Ce prototype n'implémente ni l'algèbre temporelle d'Allen, ni TimeML, ni un véritable système d'event sourcing persistant.** Il en adopte seulement les précautions élémentaires.

## Nouveaux modules expérimentaux

- `core/scene-facts.js` : analyse un ensemble autorisé de noms, objets et verbes français. Une phrase reconnue devient un petit enregistrement symbolique comportant `subject`, `predicate`, `object`, `quantity`, `polarity`, `time` et `scope:'fiction'`. Les mots personnels ou noms inconnus ne deviennent pas des identifiants persistants ; une phrase non reconnue donne `null`.
- `core/scene-ledger.js` : journal de session borné de **1 à 12 événements**, 8 par défaut, en RAM seulement. `propose(text)` produit une décision prudente et un identifiant de livraison ; `acknowledge(receipt)` est obligatoire pour inscrire l'événement. Les reçus abandonnés, périmés ou antérieurs à un reset sont invalidés.
- Une phrase **non reconnue mais réellement livrée** devient un marqueur sans fait : elle coupe la comparaison directe avec une ancienne scène afin d'éviter d'utiliser un événement qui aurait pu changer entre-temps.
- `records()` n'expose que des catégories prévues par le code, le numéro de tour, `source:'assistant-delivered'` et `scope:'fiction'`. Il ne donne jamais le texte brut de la conversation. Les copies renvoyées ne peuvent modifier le journal interne.
- Aucun appel réseau, GGUF, synthèse vocale ou écriture durable ; le système de sécurité BONZE-061 reste entièrement séparé. **Ces modules ne sont pas branchés à l'application Android.** L'acquittement est simulé dans les tests : son raccordement réel à l'affichage, Piper, TalkBack et Stop n'est pas validé.

La distinction entre `propose` et `acknowledge` est **centrale** : une phrase seulement envisagée n'est pas un événement de la conversation. Par ailleurs, un fait de fiction délivré n'est pas automatiquement vrai dans l'histoire ; c'est une affirmation attribuée à Bonze, dont la validité peut encore être incertaine.

## Première épreuve, corpus construit avant le nouveau code

37 paires fictives dont **17 conflits attendus** et **20 cas sans conflit démontré**, figées dans `tests/fixtures/bonze070-structured-facts.mjs` avant la création du parseur.

| Détecteur | Conflits reconnus | Conflits manqués | Faux blocages | Cas laissés ouverts |
|---|---:|---:|---:|---:|
| BONZE-069 de référence | 5/17 | 12 | 1 | 19/20 |
| **BONZE-070 structuré** | **17/17** | **0** | **0** | **20/20** |

[Workflow CI réussi](https://github.com/greenpower2669/Bonze-AI/actions/runs/41600295915) · [résultats bruts](https://github.com/greenpower2669/Bonze-AI/actions/runs/41600295915/artifacts/13213868791). Le test comporte une grammaire limitée, et ses données ont été préparées par le concepteur ; ce résultat ne prouve aucune généralisation.

## Deuxième épreuve, préparée après le code et sans nouveau réglage

32 autres paires, **16 conflits attendus** et **16 cas sans conflit démontré**, figées dans `tests/fixtures/bonze070-second-stage.mjs` après l'implémentation mais avant cette mesure. Aucune règle n'a été modifiée entre le gel du jeu et les résultats.

| Détecteur | Conflits reconnus | Conflits manqués | Faux blocages | Cas laissés ouverts |
|---|---:|---:|---:|---:|
| BONZE-069 de référence | 6/16 | 10 | 0 | 16/16 |
| **BONZE-070 structuré** | **6/16** | **10** | **0** | **16/16** |

[Workflow CI réussi](https://github.com/greenpower2669/Bonze-AI/actions/runs/41600566717) · [résultats bruts et tableaux](https://github.com/greenpower2669/Bonze-AI/actions/runs/41600566717/artifacts/13213219326).

Le score moins flatteur révèle que le nouveau parseur ne couvre pas encore les quantités vagues ou supérieures à trois, certains pluriels pronominaux, les nouveaux objets (« boussole »), verbes (« lire », « quitter »), participes et états (« verrouillée »). Aucun faux veto n'a été observé sur les seize contre-exemples, mais le jeu est petit et **non annoté par des évaluateurs indépendants**. Une absence de conflit reconnu ne valide pas la réponse.

## Limites et décisions

La comparaison entre deux événements consécutifs ne distingue pas toujours deux instants successifs dans une histoire. Une porte qui s'ouvre puis se ferme peut constituer une évolution normale, même sans mot « ensuite ». Il faudra représenter **la chronologie et les identités avec une provenance explicite**, puis mesurer des dialogues de 20 tours plutôt que de simples paires de phrases.

Le journal ne contient que des faits **fictionnels déclarés par l'assistant**. Il ne doit pas être copié dans les tiroirs chiffrés de mémoire personnelle, ni confondu avec une affirmation humaine ou un fait vérifié. Il nécessite une gestion du changement de sujet par l'hôte, une confirmation effective de livraison (visuelle ou vocale), l'effacement Stop, et une revue de confidentialité avant toute intégration.

Le code et les tests restent sur `feature/bonze042-field-fixes`. **Aucune modification du binaire Android, de l'APK publiée, de la Release ou de `main`**. Aucun résultat de conversation libre, de performance Samsung ou de sécurité clinique ne peut être déduit de ces tests.
