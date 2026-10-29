# 🌱 Bonze AI 0.6.0 — version de test

APK arm64 directement téléchargeable. Même application `fr.bonzeai.companion`, versionCode 6. Aucune fusion dans main.

- Sous-titres du nouveau tour : l'ancienne réponse n'est plus présentée comme réponse à une nouvelle phrase. Disposition contrôlée avec textes longs et grands caractères sur quatre formats d'écran.
- Dernière phrase envoyée directement au modèle ; contexte humain séparé, prompt plus court. Journaux privés des entrées, sorties, répétitions, erreurs et lectures.
- Huit contributions émotionnelles calculées, endurances individuelles, influences asymétriques, arbitrage communiqué au générateur. Le visage suit les forces persistantes.
- Console protégée par le verrouillage Android : forces, endurances, influences, récupération et arbitrage réglables. Le geste de 60 touches alternées dans les bords libres du bandeau découvre la console ; le code reste obligatoire. Bouton accessible dans Options.
- Export chiffré `.bonze` (phrase secrète de 12 caractères minimum), vérification, remplacement explicite et retour arrière ; identité, acquis, historique borné, poids, paramètres et traces. Un résultat SAF périmé ne peut plus créer un faux export réussi.
- Piper MLS français local via sherpa-onnx 2.0.1, sans eSpeak. Lecture PCM avec AudioTrack, bouche liée au niveau effectivement joué, arrêt immédiat. Voix Android locale disponible en secours et pour comparer. Licences, sources et notices incluses dans les fichiers `docs/licenses` de l'APK et du dépôt.
- Conversation native écran éteint conservée, uniquement après démarrage volontaire. Arrêt toujours disponible dans la notification. Pas de reprise automatique du micro après arrêt ou mort du processus. Aucune permission INTERNET.

## Limites encore ouvertes

La qualité conversationnelle du LFM2.5-230M reste insuffisante dans nos probes français : modifier le contexte ou recréer le moteur ne règle pas tout. Cette version corrige des causes prouvées dans l'application ; elle ne garantit pas un jeu de rôle convaincant. Le modèle reste dense. Les experts émotionnels associent des poids linéaires entraînés à des politiques écrites à la main ; ce n'est pas un MoE linguistique complet.

Le lexique Piper ne couvre pas tous les mots/noms/nombres/élisions. Les séquences très courtes restent aussi instables avec cette voix MLS ; elles sont refusées avant lecture (seuil expérimental : moins de48codepoints phonétiques non blancs). Dans ces cas, Android prend le relais avant le début de lecture et la raison est journalisée. Seuls débit et pauses sont modulés, pas une prosodie émotionnelle apprise. La bouche suit l'amplitude, pas les phonèmes.

Les tests instrumentés vérifient réellement le PCM, l'arrêt, le conseil et la restauration sur émulateur Android hors connexion. L'écoute et les mesures du Samsung de Fab restent nécessaires : **Piper n'est pas déclaré terminé avant cette évaluation**. Vérifier aussi veille, casque, absence d'écho et TalkBack sur ce téléphone. Les historiques et journaux ont des limites de taille ; l'export contient les données actuellement conservées.

La console s'appuie sur le code de verrouillage du téléphone ; elle ne distingue pas les membres de la famille connaissant ce code. Les fichiers de sauvegarde sont chiffrés ; les données internes utilisent le stockage privé Android.

## Installation et essai

La CI refuse la publication si le certificat n'est pas identique à celui de 0.5.0 (`128b1bb0…c35991d`). Installe en mise à jour. Si Android refuse, conserve l'installation et ses données ; ne désinstalle pas pour forcer le passage.

Dans Options, active la lecture des réponses écrites et choisis « MLS · ma voix Piper locale ». Appuie sur « Écouter une phrase avec cette voix ». La même phrase permet une comparaison reproductible. Compare ensuite avec une voix Android locale. La console indique le moteur réellement utilisé, la latence jusqu'au premier son et les paramètres calculés.

Pour continuer écran éteint : démarre volontairement la conversation pendant que Bonze est visible, puis verrouille. Arrête depuis la notification. Vérifie qu'il ne se remet pas à écouter après cet arrêt.
