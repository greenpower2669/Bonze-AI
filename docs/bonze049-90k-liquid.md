# BONZE-049 — 90 000 variantes émotionnelles et reformulation Liquid contrôlée
_État au 01/11/2026 — branche feature/bonze042-field-fixes ; ce document distingue implémentation, CI, test réel et Release._

## Objectif demandé
Huit tendances émotionnelles (joie, peur, colère, calme, réflexion, empathie, curiosité et humour) et un rôle arbitre/juge « sage », soit **neuf rôles**. **10 000 formulations combinatoires par rôle**, sans ajouter neuf LLM, sans stocker 90 000 textes en RAM et sans donner au modèle l'autorité de produire librement la réplique.

## Implémentation
- `core/repertoire-corpus.js` : 200 noyaux sémantiques validés, six familles de situations, dix ouvertures et cinq conclusions par noyau, soit **200 × 10 × 5 = 10 000** formes par rôle, **90 000** formes pour les neuf rôles. Les formes sont rendues uniquement au tirage. Les noyaux restent les mêmes : ce ne sont pas 90 000 connaissances nouvelles.
- `core/repertoire.js` : pénalise les combinaisons récentes d'ouverture et de conclusion ; le rôle choisi est explicitement renvoyé au pont natif. Intentions sensibles `urgence`, `identite`, `correction` conservées sous règles.
- `BonzeInference.kt` : classifie l'intention dans la liste fermée de 20 intentions ; tient compte de la fin des 450 derniers caractères du contexte précédent plutôt que du début, pour conserver davantage la suite récente. La seconde inférence Liquid voit le message, l'intention et le rôle réellement tiré et renvoie uniquement un indice de 0 à 4 parmi les substitutions prévalidées, 0 pour garder l'original. Même modèle lourd chargé une seule fois ; aucune génération libre de phrase.
- `ConversationService.java` : passe l'intention et le rôle effectivement sélectionnés au choix de substitution, et conserve l'arrêt prioritaire et la validation anti-écho. Pas de modification du coffre privé ou de la politique hors connexion.

## Protections et limites
- L'intention garde priorité à la sécurité, aux corrections et aux questions explicites sur des mots cités.
- Les 90 000 possibilités sont des assemblages de 200 idées sémantiques, et non des jugements factuels ni un entraînement de modèle supplémentaire.
- Le deuxième passage Liquid reste facultatif (mode précis, uniquement quand des candidats existent). Aucun mot inventé n'est vocalisé ; la sortie du modèle est validée comme indice et le choix est contrôlé par `SynonymChoice`.
- La diversité grammaticale ne démontre pas l'adéquation des réponses à la question réelle. Les conversations de 20 tours, la compréhension des questions concrètes, la latence, la diction Piper et le comportement Samsung restent à mesurer.

## Preuves / validations
- Commit `622705be` : tests de comptage, unicité du catalogue, budget vocal de 220 caractères, échantillonnage avec historique borné, validation anti-répétition et audit Piper. [CI complète réussie au commit](https://github.com/greenpower2669/Bonze-AI/actions/runs/41321401979).
- Commit `95b0778f` : rôle transmis à Liquid, tests de non-génération libre et de cohérence du rôle ; vérifications JVM/Android en cours lors de la rédaction.
- **À faire** : test de packaging complet de la dernière branche, puis tests Samsung/Bluetooth/Piper/Stop ; seule une autorisation distincte de Fab permet une nouvelle GitHub Release avec APK non zippé.
