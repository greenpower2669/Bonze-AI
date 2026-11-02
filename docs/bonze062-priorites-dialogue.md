# BONZE-062 — suivre le choix de l'utilisateur sans générer de phrases

## Pourquoi
Une conversation peut contenir plusieurs sujets mais une seule intention **prioritaire** : « Je suis triste, mais je préfère parler de robots ». Le système doit suivre le thème choisi (robot), sans déplacer la réponse sur la tristesse. Inversement, « je ne veux pas de pirates » doit interdire les candidats contenant des pirates même si leur vocabulaire est proche du message.

## Expérience livrée sur la branche
- `core/preference-arbiter.js` : **module autonome expérimental**, qui complète mais ne remplace pas `core/non-neural-arbiter.js` (BONZE-059). Normalise les phrases françaises, reconnaît un petit dictionnaire borné de sujets et des directives explicites, sépare choix positif / rejet / dernier changement de sujet.
- Quand un seul sujet admissible est reconnu, les quatre propositions sont filtrées **avant** la pondération lexicale BONZE-059. Les phrases avec un thème explicitement exclu ne sont plus éligibles.
- Sujet inconnu, préférence ambiguë, absence de candidat pertinent ou refus sans remplacement : **index -1**. Ne jamais combler silencieusement l'absence d'un thème par une histoire choisie au hasard.
- Si le module BONZE-061 indique une urgence immédiate, le moteur renvoie **`safety-priority`**, sans sélectionner de carte d'histoire. Ce renvoi appelle une voie de réponse de sûreté distincte ; il n'est pas un succès de classification d'indice.
- Le résultat ne contient **aucun texte personnel** : seulement indices, clés thématiques, scores et codes de raison. Tout s'exécute sans réseau ni modèle GGUF.

## Tests et résultats
[Workflow expérimental réussi](https://github.com/greenpower2669/Bonze-AI/actions/runs/41469956836) · [mesures JSON et rapport](https://github.com/greenpower2669/Bonze-AI/actions/runs/41469956836/artifacts/13153214986).

| Ensemble | Arbitre BONZE-059 | BONZE-062 (choix stricts) | Autre résultat |
|---|---:|---:|---|
| BONZE-060 connu, 200 décisions (50 énoncés × 4 rotations) | 140/200 (70 %) | **148/200 (74 %)** | 12 transferts de sécurité comptés séparément |
| Catégorie « refus / préférences » BONZE-060 (40 rotations) | 20/40 | **36/40** | 4 situations toujours complexes |
| 16 scénarios BONZE-062 rédigés pour ce code (64 rotations) | 8/64 | **64/64** | Inclut des abstentions et un transfert d'urgence attendus |

Les 12 transferts d'urgence ne sont pas des « mauvaises réponses d'histoire » : la voie spéciale doit fournir un message d'assistance au lieu de faire choisir un indice parmi les quatre propositions. **Nous ne les additionnons pas aux 148 choix stricts**. Les deux jeux sont des scénarios **co-développés**, sans annotation humaine aveugle ; les quatre rotations d'un exemple restent fortement corrélées.

## Limites
Le petit lexique ne comprend pas toutes les expressions françaises. La méthode ne démontre pas l'interprétation de négations complexes, de métaphores, de messages vocaux imparfaits ou de conversations longues. Le routeur de sécurité BONZE-061 est un **prototype**, non une protection clinique éprouvée. Une sortie -1 doit mener à une clarification et non à une affirmation inventée.

**Statut :** BONZE-062 n'est pas câblé au moteur de dialogue utilisateur Android ; aucun APK ni Release de mise à jour n'a été publié, aucune modification de `main`. Les mémoires de projet sont actualisées pour la suite.

## Prochain contrôle
Étiquetage humain indépendant de nouveaux exemples, puis comparaison du classement et de l'abstention sur un ensemble inédit avant intégration. Évaluer également le vrai Piper, les 20 tours et les interruptions. Les observations ne suffisent pas à dire que Bonze « comprend » librement le langage.
