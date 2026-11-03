# BONZE-050 — Reconstruction contextuelle de phrases par sélection Liquid
**Objectif de Fab :** Bonze suit le sujet réel de la conversation ; Liquid aide à choisir une réponse composée plutôt que de produire des phrases indépendantes hors sujet.

## Chaîne de décision implémentée
1. Priorité à KnowledgeGuard et aux intentions sensibles ; classification Liquid sur 20 intentions fermées.
2. BonzeRepertoire.propose prépare au maximum quatre phrases entières à partir des noyaux sémantiques, introductions et fins du répertoire virtuel de 90 000 formes (huit émotions + juge). Tous les candidats gardent le même rôle et la même intention ; priorité au recoupement lexical avec le sujet.
3. ScriptedDialogue.preview effectue cette préparation sans écrire dans la mémoire. Les préférences de personnalité demeurent actives.
4. ReplyQuality contrôle échos, répétitions, réponses génériques et longues/minimales adaptées au choix Piper.
5. En mode précis, Liquid reçoit message, contexte récent, rôle et intention avec les choix rédigés ; sa seule sortie permise est un indice 0–3. Un indice non valide revient au candidat zéro, classé prioritaire selon le sujet.
6. Le dernier garde-fou choisit une alternative valide si nécessaire. ScriptedDialogue.commit n'enregistre que le candidat retenu ; les candidats rejetés ne consomment ni historique ni familles émotionnelles.
7. Questions factuelles, urgence, identité et correction contournent l'arbitrage neural. Aucun téléchargement réseau, aucun nouveau LLM requis.

## Limites et validation
Il s'agit d'une reconstruction déterministe guidée par un choix neuronal, pas d'une production libre de phrases par Liquid. Les 90 000 formes demeurent des combinaisons de 200 noyaux, pas 90 000 informations nouvelles. Le lexique sujet reste incomplet et la pertinence réelle doit être évaluée sur un banc de dialogues. Tests Node/JVM, compilation Android, APK expérimental, puis sessions Samsung/Piper/Bluetooth/Stop et mesures RAM/latence nécessaires avant nouvelle livraison.
**Statut :** travail sur feature/bonze042-field-fixes, sans merge dans main et sans nouvelle Release.
