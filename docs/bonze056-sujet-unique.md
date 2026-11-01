# BONZE-056 — assurer la pertinence du sujet dans la reconstruction contrôlée

**Objectif :** le répertoire doit offrir à Liquid quatre façons différentes de parler du **même sujet précis**, jamais quatre scènes différentes entre lesquelles un mauvais indice pourrait dévier.

## Défaut mesuré et correction
Avant BONZE-056, le classement lexical pouvait mettre « dragon » en premier et laisser trois propositions d'autres scènes. Le mini-banc 10/10 contrôlait la présence d'un sujet dans **au moins une** option, pas l'identité sémantique de toutes.

La correction `core/repertoire.js` détecte une demande explicite de fiction, cherche ses mots dans onze groupes d'alias français **fermés** et retient le noyau correspondant :
- Sujet unique connu : quatre cartes distinctes (ouvertures et conclusions) du **même noyau**, même émotion, même intention, chacune conservant un état de commit indépendant ; l'anti-répétition favorise les formes moins récentes.
- Sujet absent ou plusieurs thèmes distincts : question de clarification prévalidée ; le texte non reconnu n'est pas copié dans le stockage de l'état.
- Suite « Et après ? » : toujours la progression à étapes BONZE-053/054, séparée des nouveaux départs de fiction.
- Questions factuelles et urgences : restent priorisées par les règles de sûreté existantes. Aucune sortie neuronale libre n'est acceptée.

## Preuves
Commits de code `0170172c`, `6324abbf`. La CI initiale a signalé que « nuages » devait être relié explicitement au thème de la tortue ; corrigé au second commit.
Tests [41355014355](https://github.com/greenpower2669/Bonze-AI/actions/runs/41355014355) verts. Les scénarios couvrent récit de pirate, dragons, robots, forteresse, bibliothèque, rivière, 20 tours du même sujet et thèmes absents/mélangés. Pas de nouveaux poids, pas d'augmentation des 90 000 formes ni des données privées.

**Limite :** il s'agit d'une contrainte stricte sur un répertoire de fiction ; elle ne prouve pas que Liquid 230M comprenne des demandes ouvertes en français. La signature, l'APK complet, Piper et les tests humains Samsung sont à vérifier séparément avant toute Release.
