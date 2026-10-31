# BONZE-040 — Diagnostic conversation et audio

## Symptômes
Sur la prérelease 0.7.0-dev : Bonze a répété presque exactement « ah oui non mais là tu es vraiment naze » ; l'utilisateur rapporte également des sauts ou coupures de voix sur Android.

## Corrections livrées en branche (non publiées)
- `ReplyQuality.java` détecte les duplications de l'énoncé utilisateur, les réponses vides et les répétitions successives ; réplique de rattrapage déterministe, journal de correction, exception pour demandes explicites de répétition. Cela ne rend pas le LFM2.5-230M meilleur dans l'absolu.
- `PiperVoice.kt` prépare un bloc PCM et charge environ 1/3 seconde avant `AudioTrack.play()`, écrit ensuite en mode bloquant sur le thread de travail, mesure le nombre d'underruns et les durées synthèse/lecture.
- Le panneau Options > Journal de diagnostic offre un export Android JSON via le sélecteur de documents. Aucune autorisation de stockage externe requise et pas de réseau. La vue exportée inclut les types d'opérations et métriques autorisées, mais pas les propos, textes générés, prompts, souvenirs, identités ou messages d'erreur arbitraires. Les logs internes chiffrés des sauvegardes sont un autre mécanisme.

## Ce qu'il reste à valider
La vraie cause d'une coupure audio (underrun, pause de synthèse entre blocs, interruption système, sortie Bluetooth, interruption du service) ne se déduit pas de la capture ; les métriques aideront sur le Samsung. La capture concerne une ancienne prérelease, non le code de cette branche. Compiler, écouter et comparer des journaux avant/après ; vérifier que la signature est compatible avant mise à jour APK. Pas de merge main ni Release sur cette mission.
