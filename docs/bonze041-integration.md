# BONZE-041 — Dialogue, voix continue et version de test isolée

31 octobre 2026 • Branche `feature/bonze041-conversation-audio-integration`

## Pourquoi ce lot
La 0.7.0-dev répétait parfois l'intégralité des phrases utilisateur et présentait des sauts vocaux. BONZE-040 ajoutait le diagnostic et un filtre anti-répétition, mais le secours était encore une phrase figée. Le répertoire BONZE-037 contenant 18 000 variantes compositionnelles n'était pas intégré à la base 0.7.

## Comportement
La génération Liquid (230M ou 1.2B si poids installés) demeure la première option. La sortie est contrôlée par `ReplyQuality`. En cas d'écho, réponse vide ou erreur modèle, `ScriptedDialogue` exploite le catalogue local sans télécharger ni inventer de faits. Une critique telle que « tu es vraiment naze » est classée en correction. Le mode léger dans l'interface Web utilise également ce même répertoire avec sauvegarde de son état. Les 18 000 formulations sont des recombinaisons de noyaux et tournures : elles n'équivalent pas à 18 000 compétences ou idées neuves.

Piper prépare les segments sur un thread de fond, applique un volume commun et utilise un unique `AudioTrack` pour lire tout le PCM d'une réponse. Cela supprime les ouvertures successives d'AudioTrack et les pauses introduites par les générations *entre* segments, mais **augmente potentiellement le temps d'attente avant le début de la voix**. Les mesures exportables comprennent latence, durée de synthèse/lecture, sous-alimentations et causes de bascule. Une coupure due au téléphone, aux écouteurs ou au système n'est pas encore exclue.

## Sauvegardes et livraison
Sauvegarde `.bonze` chiffrée : états Web et natif du répertoire, préférences, historique et coffre existant restent compatibles ; les anciennes sauvegardes sans champs de répertoire sont acceptées. Le code reste en PR de brouillon ; aucune fusion dans `main`. La version cible `0.8.0-dev` code 8 est destinée à un identifiant parallèle `fr.bonzeai.companion.dev`, qui ne remplace pas l'application 0.7 du téléphone. Le certificat est temporaire pour les essais : **les builds parallèles suivants ne sont pas garantis compatibles entre eux**. Ne pas désinstaller l'application principale ni supprimer les données avant export sécurisé.

Validation visée : node/JVM, Playwright, compilation Android, lexique Piper réel et construction/inspection d'un APK parallèle. Les essais de perception audio et le retour utilisateur restent indispensables.

## Construction de la candidate
Déclenchement CI du package expérimental parallèle ; vérifier aapt, apksigner, SHA-256 et absence INTERNET avant tout essai. Ceci n'est pas une publication et n'altère aucune Release existante.
