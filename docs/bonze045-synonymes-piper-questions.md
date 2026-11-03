# BONZE-045 — variations lexicales élargies, nombres Piper et pertinence des questions

31 octobre 2026. Branche unique : `feature/bonze042-field-fixes`. Suite de BONZE-044 ; 0.8.0-dev déjà installée **non modifiée**.

## Invariants de Fab

Le catalogue compositionnel reste l'auteur des réponses : **2 000 formes par rôle, neuf rôles, soit 18 000 formulations virtuelles**. Liquid peut classifier une intention et choisir **un indice numérique** parmi des reformulations écrites/contrôlées. Il n'est jamais libre de produire le texte prononcé. La réponse initiale est conservée si la transformation est invalide. Réutilisation du seul GGUF actif. Les sauvegardes SVC/personnalisation et les états émotionnels sont conservés.

## Changements BONZE-045

- **21 paires lexicales réversibles relues** au lieu de quatre dans `SynonymChoice.java`. Chaque variante remplace un terme ou une locution à la fois, dans les limites du contexte grammatical ; le modèle renvoie un chiffre entre zéro et quatre, et l'application vérifie l'existence réelle du candidat. La série reste expérimentale, et les variantes nuancées doivent être testées en français courant.
- **Piper : entiers isolés de 0 à 9 999** développés en mots français avant phonétisation et synthèse (`PiperFrenchNumbers.java`). Les zéros initiaux sont énoncés chiffre par chiffre. Les nombres décimaux, nombres trop longs et chiffres Unicode non pris en charge sont refusés explicitement pour éviter une prononciation fallacieuse ; ceci ne remplace pas un moteur de prononciation universel.
- Le texte affiché reste celui de la réponse du répertoire ; seule la chaîne envoyée à la phonétisation/synthèse de Piper est adaptée à l'oral. Les échecs de lexique/nombres/courtes phrases remontent désormais avec **un code distinct** dans le journal, sans bascule automatique vers la voix Android.
- Le détecteur lexical traite les **questions portant sur un mot cité** (« Que signifie bonjour ? », « Pourquoi utiliser le mot nul ? ») comme des questions, même si Liquid suggère une émotion ou une salutation. Les expressions de danger demeurent prioritaires.
- Tests ajoutés pour les nombres français, le vocabulaire Piper, les 21 paires et les questions métalinguistiques. Le workflow vérifie la présence de tous les termes numériques dans le lexique de la voix embarquée.

## Vérifications et limites

Sources CI : [workflow expérimental Bonze](https://github.com/greenpower2669/Bonze-AI/actions/workflows/bonze031-ci.yml). Une compilation réussie n'est **pas** une preuve de pertinence et de qualité acoustique réelle : il reste les essais Samsung en voix Piper, le casque Bluetooth, les interruptions, les phrases courtes, les noms propres et les échanges de vingt tours. Les questions factuelles spécialisées restent limitées par l'architecture de vingt intentions et les phrases préécrites ; ne pas annoncer une compétence nouvelle grâce au nombre de formulations.

Les données des versions 0.7/0.8 restent protégées ; **aucune Release, aucun merge vers main**, ni substitution d'un artefact ZIP à un lien APK direct. Le problème 403 de GitHub Releases se traite séparément de ces changements de code.
