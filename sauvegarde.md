# ARCHIVE / EXPIRÉ — NE PAS LIRE PAR DÉFAUT


## ordres-de-mission.md — 29/10/2026, préparation 0.6

Provenance : notes intermédiaires après le diagnostic JNI ; archivées car remplacées par les résultats Android et le chemin phonétique validé. Historique conservé sans perte.

Blocages supplémentaires à résoudre avant publication : crash natif pendant le test Piper (40956583835), logcat ajouté pour le diagnostic ; la voix Siwis dérive de Lessac medium dont le corpus source a une licence de recherche non commerciale. Ne pas confondre l’étiquette MIT du dépôt de voix et cette filiation. Publication suspendue pendant vérification/remplacement.

### Correction de voix avant livraison
Le crash natif 40957409320 est prouvé : sherpa JNI attend invoke(float[]) -> Integer ; une lambda Kotlin 2.0 indy n’expose que la méthode effacée, causant NoSuchMethodError puis SIGABRT. PiperCancellation.java fournit explicitement cette signature ; assertion instrumentée ajoutée. La voix Siwis est remplacée par Piper MLS medium, locuteur 0 fixe : fiche entraînée depuis zéro, corpus MLS CC-BY 4.0 (OpenSLR94), poids SHA-256 0ed223f7…34e162. Ajout des seules métadonnées/tokens selon sherpa, sans réentraînement. Cela évite la filiation Lessac/Ryan à licences de recherche/NC. Les voix Gilles, MLS_1840, Tom et Miro ont aussi été écartées pour filiation/conditions spécifiques. Publication seulement si génération/lecture/arrêt/restauration Android et signature sont verts ; écoute humaine toujours ouverte.

Lexique : le nouveau probe MLS a révélé des nasales combinées absentes comme tokens uniques (ɔ̃, ɑ̃). Conversion vers les vrais tokens de la voix, sans perdre le signe nasal ; entrée exclue si un symbole demeure inconnu, puis secours Android. Tests Python ajoutés. Le probe utilisait aussi un constructeur Python GenerationConfig avec argument non supporté ; appel corrigé.

MLS : synthèse hôte réelle réussie 40958317324 ; 90 113 entrées compatibles après conversion. Le signal du probe avait une crête faible (0,023), d’où un gain borné (×20 maximum) sur le PCM réellement joué et le RMS de bouche. Entrée vocale mise en minuscules comme la vérification du lexique. Test JVM DSP ajouté ; transcription indépendante du WAV en cours, sans remplacer l’écoute humaine.

Cause phonétique prouvée par le code sherpa v2.0.1 : le lexique à tabulations activait le frontend générique ; seul le nouveau format « mot || phonèmes » active le chemin Piper avec BOS/pad/EOS. Signal trop court/faible donc non suffisant comme preuve d’intelligibilité. Export du lexique vers ce nouveau format, puis génération et transcription de contrôle à relancer avant écoute humaine.

Contrôle supplémentaire : la transcription indépendante du premier WAV ne retrouvait pas la phrase demandée, malgré les tests PCM verts. Publication maintenue suspendue. Comparaison de plusieurs locuteurs MLS et de phonèmes de référence eSpeak (outil de test hôte uniquement, jamais embarqué) pour isoler la cause ; pas d’assimilation de « son produit » à « parole intelligible ».

Comparaison 40959770234 : les mêmes poids MLS deviennent compréhensibles avec les phonèmes de référence, pour plusieurs locuteurs ; la source du défaut est donc le chemin phonétique, pas seulement le timbre. Adaptation explicite des conventions gruut vers celles du modèle français (ɲ→nj, ɥ→y, accent lexical final), sans embarquer ni extraire le code/données du phonémiseur GPL. Tests de transformation et nouvelle transcription nécessaires ; publication toujours suspendue.

Probe 40960582870 : avec les mêmes phonèmes de dictionnaire, l’entrée directe codepoints est bien plus intelligible que le frontend texte-lexique (ASR retrouve « je suis ton petit compagnon ... tu veux jouer ... avec moi »). PiperPhonetics prépare désormais l’IPA complet de chaque segment avant tout son ; génération via GenerationConfig.phonemeCodepoints, sans frontend texte ni phonémiseur externe. Tests : nasales combinées, frontières de mots, chiffres/inconnus refusés avant parole. Nouvelle surcharge callback à revérifier réellement sur Android ; transcription de trois phrases du chemin exact en cours.


## todo.md — 29/10/2026, préparation 0.6

Provenance : notes intermédiaires après le diagnostic JNI ; archivées car remplacées par les résultats Android et le chemin phonétique validé. Historique conservé sans perte.

Blocages supplémentaires à résoudre avant publication : crash natif pendant le test Piper (40956583835), logcat ajouté pour le diagnostic ; la voix Siwis dérive de Lessac medium dont le corpus source a une licence de recherche non commerciale. Ne pas confondre l’étiquette MIT du dépôt de voix et cette filiation. Publication suspendue pendant vérification/remplacement.

### Correction de voix avant livraison
Le crash natif 40957409320 est prouvé : sherpa JNI attend invoke(float[]) -> Integer ; une lambda Kotlin 2.0 indy n’expose que la méthode effacée, causant NoSuchMethodError puis SIGABRT. PiperCancellation.java fournit explicitement cette signature ; assertion instrumentée ajoutée. La voix Siwis est remplacée par Piper MLS medium, locuteur 0 fixe : fiche entraînée depuis zéro, corpus MLS CC-BY 4.0 (OpenSLR94), poids SHA-256 0ed223f7…34e162. Ajout des seules métadonnées/tokens selon sherpa, sans réentraînement. Cela évite la filiation Lessac/Ryan à licences de recherche/NC. Les voix Gilles, MLS_1840, Tom et Miro ont aussi été écartées pour filiation/conditions spécifiques. Publication seulement si génération/lecture/arrêt/restauration Android et signature sont verts ; écoute humaine toujours ouverte.

Lexique : le nouveau probe MLS a révélé des nasales combinées absentes comme tokens uniques (ɔ̃, ɑ̃). Conversion vers les vrais tokens de la voix, sans perdre le signe nasal ; entrée exclue si un symbole demeure inconnu, puis secours Android. Tests Python ajoutés. Le probe utilisait aussi un constructeur Python GenerationConfig avec argument non supporté ; appel corrigé.

MLS : synthèse hôte réelle réussie 40958317324 ; 90 113 entrées compatibles après conversion. Le signal du probe avait une crête faible (0,023), d’où un gain borné (×20 maximum) sur le PCM réellement joué et le RMS de bouche. Entrée vocale mise en minuscules comme la vérification du lexique. Test JVM DSP ajouté ; transcription indépendante du WAV en cours, sans remplacer l’écoute humaine.

Cause phonétique prouvée par le code sherpa v2.0.1 : le lexique à tabulations activait le frontend générique ; seul le nouveau format « mot || phonèmes » active le chemin Piper avec BOS/pad/EOS. Signal trop court/faible donc non suffisant comme preuve d’intelligibilité. Export du lexique vers ce nouveau format, puis génération et transcription de contrôle à relancer avant écoute humaine.

Contrôle supplémentaire : la transcription indépendante du premier WAV ne retrouvait pas la phrase demandée, malgré les tests PCM verts. Publication maintenue suspendue. Comparaison de plusieurs locuteurs MLS et de phonèmes de référence eSpeak (outil de test hôte uniquement, jamais embarqué) pour isoler la cause ; pas d’assimilation de « son produit » à « parole intelligible ».

Comparaison 40959770234 : les mêmes poids MLS deviennent compréhensibles avec les phonèmes de référence, pour plusieurs locuteurs ; la source du défaut est donc le chemin phonétique, pas seulement le timbre. Adaptation explicite des conventions gruut vers celles du modèle français (ɲ→nj, ɥ→y, accent lexical final), sans embarquer ni extraire le code/données du phonémiseur GPL. Tests de transformation et nouvelle transcription nécessaires ; publication toujours suspendue.

Probe 40960582870 : avec les mêmes phonèmes de dictionnaire, l’entrée directe codepoints est bien plus intelligible que le frontend texte-lexique (ASR retrouve « je suis ton petit compagnon ... tu veux jouer ... avec moi »). PiperPhonetics prépare désormais l’IPA complet de chaque segment avant tout son ; génération via GenerationConfig.phonemeCodepoints, sans frontend texte ni phonémiseur externe. Tests : nasales combinées, frontières de mots, chiffres/inconnus refusés avant parole. Nouvelle surcharge callback à revérifier réellement sur Android ; transcription de trois phrases du chemin exact en cours.


## todo.md — exécution intermédiaire avant validation 0.6

## Avenant0.5 — exécution courante

- [ ] Comparer générations réelles contexte aplati/rôles, tracer tours et erreurs, distinguer résultat modèle et ancien affichage.
- [ ] Régression longs sous-titres/grands caractères, correction sans recouvrir les commandes.
- [ ] Endurances/contributions/arbitrage/traces des huit modules, paramètres vérifiables.
- [ ] Console avec authentification et accès accessible, geste optionnel.
- [ ] Sauvegarde/restauration chiffrée, validation stricte, retour arrière et reprise sans micro.
- [ ] Piper réel : résolution licences, intégration/audio joué/interruption, comparaison/écoute.
- [ ] Vérifications CI/APK/signature identique0.5 et essai Samsung. Aucun merge main.

État : reprise au commit c271d31 ;35 tests JS de base verts. Revue parallèle Piper indisponible (quota de l'agent) ; recherche poursuivie par l'agent principal. Ne pas déclarer ces missions réalisées.

Affichage périmé : correction locale et2tests verts ; génération répétée encore en investigation. Test navigateur de chevauchement en attente. Aucun nouvel APK publié.

Sauvegarde/admin/journal : code local et3tests crypto verts, branchement natif en cours de validation (JVM, compilation et scénarios navigateur nécessaires). Piper : lexique MIT+runtime2.0 sans eSpeak est une piste exécutable, synthèseLinux générée mais vérification finale du probe/écoute/intégrationAndroid encore ouvertes. Génération : formats alternatifs ne suffisent pas ; isoler la réutilisation du contexte.


## Suite de l'avenant 0.6
- [x] Ancienne réponse au nouveau tour et chevauchement des sous-titres : régressions et CI navigateur.
- [x] Contributions, endurances individuelles, influences, arbitrage, logs privés et console avec authentification Android.
- [x] Sauvegarde chiffrée de bout en bout Web, migrations et contrôles avant écriture ; défauts de revue corrigés.
- [x] Intégration réelle Piper/Siwis/lexique, lecture PCM/animation/arrêt, sources et licences ; Android en secours et bouton comparatif.
- [ ] Valider la correction ART de Piper et les trois tests instrumentés (lecture/Stop, conseil persistant, restauration/retour arrière).
- [ ] Publier l'APK direct 0.6.0 après tous les jobs verts, certificat identique 0.5 ; maintenir les mémoires et la PR sans merge main.
- [ ] Essai Samsung de Fab : voix Piper à l'écoute face à Android, intelligibilité, naturel, latence/RAM/CPU, TalkBack, veille/notification/casque/écho. Ne pas clore BONZE-029 avant cette écoute.
- [ ] Corriger/améliorer la qualité neuronale française et du jeu de rôle (modèle/quantification/runtime à comparer sur un corpus mesurable). Les défauts de flux prouvés sont corrigés, pas toute la qualité du dialogue.
- [ ] Étendre la phonémisation Piper (noms, nombres, élisions) pour réduire le secours Android.
- [ ] Sous-réseaux spécialisés et véritable MoE linguistique, compétences/mémoire sociale progressive, benchmark ressources sur téléphone. Les politiques actuelles ne satisfont pas ce contrat complet.

## brain.md — 29/10/2026, préparation 0.6

Provenance : notes intermédiaires après le diagnostic JNI ; archivées car remplacées par les résultats Android et le chemin phonétique validé. Historique conservé sans perte.

Blocages supplémentaires à résoudre avant publication : crash natif pendant le test Piper (40956583835), logcat ajouté pour le diagnostic ; la voix Siwis dérive de Lessac medium dont le corpus source a une licence de recherche non commerciale. Ne pas confondre l’étiquette MIT du dépôt de voix et cette filiation. Publication suspendue pendant vérification/remplacement.

### Correction de voix avant livraison
Le crash natif 40957409320 est prouvé : sherpa JNI attend invoke(float[]) -> Integer ; une lambda Kotlin 2.0 indy n’expose que la méthode effacée, causant NoSuchMethodError puis SIGABRT. PiperCancellation.java fournit explicitement cette signature ; assertion instrumentée ajoutée. La voix Siwis est remplacée par Piper MLS medium, locuteur 0 fixe : fiche entraînée depuis zéro, corpus MLS CC-BY 4.0 (OpenSLR94), poids SHA-256 0ed223f7…34e162. Ajout des seules métadonnées/tokens selon sherpa, sans réentraînement. Cela évite la filiation Lessac/Ryan à licences de recherche/NC. Les voix Gilles, MLS_1840, Tom et Miro ont aussi été écartées pour filiation/conditions spécifiques. Publication seulement si génération/lecture/arrêt/restauration Android et signature sont verts ; écoute humaine toujours ouverte.

Lexique : le nouveau probe MLS a révélé des nasales combinées absentes comme tokens uniques (ɔ̃, ɑ̃). Conversion vers les vrais tokens de la voix, sans perdre le signe nasal ; entrée exclue si un symbole demeure inconnu, puis secours Android. Tests Python ajoutés. Le probe utilisait aussi un constructeur Python GenerationConfig avec argument non supporté ; appel corrigé.

MLS : synthèse hôte réelle réussie 40958317324 ; 90 113 entrées compatibles après conversion. Le signal du probe avait une crête faible (0,023), d’où un gain borné (×20 maximum) sur le PCM réellement joué et le RMS de bouche. Entrée vocale mise en minuscules comme la vérification du lexique. Test JVM DSP ajouté ; transcription indépendante du WAV en cours, sans remplacer l’écoute humaine.

Cause phonétique prouvée par le code sherpa v2.0.1 : le lexique à tabulations activait le frontend générique ; seul le nouveau format « mot || phonèmes » active le chemin Piper avec BOS/pad/EOS. Signal trop court/faible donc non suffisant comme preuve d’intelligibilité. Export du lexique vers ce nouveau format, puis génération et transcription de contrôle à relancer avant écoute humaine.

Contrôle supplémentaire : la transcription indépendante du premier WAV ne retrouvait pas la phrase demandée, malgré les tests PCM verts. Publication maintenue suspendue. Comparaison de plusieurs locuteurs MLS et de phonèmes de référence eSpeak (outil de test hôte uniquement, jamais embarqué) pour isoler la cause ; pas d’assimilation de « son produit » à « parole intelligible ».

Comparaison 40959770234 : les mêmes poids MLS deviennent compréhensibles avec les phonèmes de référence, pour plusieurs locuteurs ; la source du défaut est donc le chemin phonétique, pas seulement le timbre. Adaptation explicite des conventions gruut vers celles du modèle français (ɲ→nj, ɥ→y, accent lexical final), sans embarquer ni extraire le code/données du phonémiseur GPL. Tests de transformation et nouvelle transcription nécessaires ; publication toujours suspendue.

Probe 40960582870 : avec les mêmes phonèmes de dictionnaire, l’entrée directe codepoints est bien plus intelligible que le frontend texte-lexique (ASR retrouve « je suis ton petit compagnon ... tu veux jouer ... avec moi »). PiperPhonetics prépare désormais l’IPA complet de chaque segment avant tout son ; génération via GenerationConfig.phonemeCodepoints, sans frontend texte ni phonémiseur externe. Tests : nasales combinées, frontières de mots, chiffres/inconnus refusés avant parole. Nouvelle surcharge callback à revérifier réellement sur Android ; transcription de trois phrases du chemin exact en cours.


## brainmap.md — 29/10/2026, préparation 0.6

Provenance : notes intermédiaires après le diagnostic JNI ; archivées car remplacées par les résultats Android et le chemin phonétique validé. Historique conservé sans perte.

Blocages supplémentaires à résoudre avant publication : crash natif pendant le test Piper (40956583835), logcat ajouté pour le diagnostic ; la voix Siwis dérive de Lessac medium dont le corpus source a une licence de recherche non commerciale. Ne pas confondre l’étiquette MIT du dépôt de voix et cette filiation. Publication suspendue pendant vérification/remplacement.

### Correction de voix avant livraison
Le crash natif 40957409320 est prouvé : sherpa JNI attend invoke(float[]) -> Integer ; une lambda Kotlin 2.0 indy n’expose que la méthode effacée, causant NoSuchMethodError puis SIGABRT. PiperCancellation.java fournit explicitement cette signature ; assertion instrumentée ajoutée. La voix Siwis est remplacée par Piper MLS medium, locuteur 0 fixe : fiche entraînée depuis zéro, corpus MLS CC-BY 4.0 (OpenSLR94), poids SHA-256 0ed223f7…34e162. Ajout des seules métadonnées/tokens selon sherpa, sans réentraînement. Cela évite la filiation Lessac/Ryan à licences de recherche/NC. Les voix Gilles, MLS_1840, Tom et Miro ont aussi été écartées pour filiation/conditions spécifiques. Publication seulement si génération/lecture/arrêt/restauration Android et signature sont verts ; écoute humaine toujours ouverte.

Lexique : le nouveau probe MLS a révélé des nasales combinées absentes comme tokens uniques (ɔ̃, ɑ̃). Conversion vers les vrais tokens de la voix, sans perdre le signe nasal ; entrée exclue si un symbole demeure inconnu, puis secours Android. Tests Python ajoutés. Le probe utilisait aussi un constructeur Python GenerationConfig avec argument non supporté ; appel corrigé.

MLS : synthèse hôte réelle réussie 40958317324 ; 90 113 entrées compatibles après conversion. Le signal du probe avait une crête faible (0,023), d’où un gain borné (×20 maximum) sur le PCM réellement joué et le RMS de bouche. Entrée vocale mise en minuscules comme la vérification du lexique. Test JVM DSP ajouté ; transcription indépendante du WAV en cours, sans remplacer l’écoute humaine.

Cause phonétique prouvée par le code sherpa v2.0.1 : le lexique à tabulations activait le frontend générique ; seul le nouveau format « mot || phonèmes » active le chemin Piper avec BOS/pad/EOS. Signal trop court/faible donc non suffisant comme preuve d’intelligibilité. Export du lexique vers ce nouveau format, puis génération et transcription de contrôle à relancer avant écoute humaine.

Contrôle supplémentaire : la transcription indépendante du premier WAV ne retrouvait pas la phrase demandée, malgré les tests PCM verts. Publication maintenue suspendue. Comparaison de plusieurs locuteurs MLS et de phonèmes de référence eSpeak (outil de test hôte uniquement, jamais embarqué) pour isoler la cause ; pas d’assimilation de « son produit » à « parole intelligible ».

Comparaison 40959770234 : les mêmes poids MLS deviennent compréhensibles avec les phonèmes de référence, pour plusieurs locuteurs ; la source du défaut est donc le chemin phonétique, pas seulement le timbre. Adaptation explicite des conventions gruut vers celles du modèle français (ɲ→nj, ɥ→y, accent lexical final), sans embarquer ni extraire le code/données du phonémiseur GPL. Tests de transformation et nouvelle transcription nécessaires ; publication toujours suspendue.

Probe 40960582870 : avec les mêmes phonèmes de dictionnaire, l’entrée directe codepoints est bien plus intelligible que le frontend texte-lexique (ASR retrouve « je suis ton petit compagnon ... tu veux jouer ... avec moi »). PiperPhonetics prépare désormais l’IPA complet de chaque segment avant tout son ; génération via GenerationConfig.phonemeCodepoints, sans frontend texte ni phonémiseur externe. Tests : nasales combinées, frontières de mots, chiffres/inconnus refusés avant parole. Nouvelle surcharge callback à revérifier réellement sur Android ; transcription de trois phrases du chemin exact en cours.


## debughistorical.md — 29/10/2026, préparation 0.6

Provenance : notes intermédiaires après le diagnostic JNI ; archivées car remplacées par les résultats Android et le chemin phonétique validé. Historique conservé sans perte.

Blocages supplémentaires à résoudre avant publication : crash natif pendant le test Piper (40956583835), logcat ajouté pour le diagnostic ; la voix Siwis dérive de Lessac medium dont le corpus source a une licence de recherche non commerciale. Ne pas confondre l’étiquette MIT du dépôt de voix et cette filiation. Publication suspendue pendant vérification/remplacement.

### Correction de voix avant livraison
Le crash natif 40957409320 est prouvé : sherpa JNI attend invoke(float[]) -> Integer ; une lambda Kotlin 2.0 indy n’expose que la méthode effacée, causant NoSuchMethodError puis SIGABRT. PiperCancellation.java fournit explicitement cette signature ; assertion instrumentée ajoutée. La voix Siwis est remplacée par Piper MLS medium, locuteur 0 fixe : fiche entraînée depuis zéro, corpus MLS CC-BY 4.0 (OpenSLR94), poids SHA-256 0ed223f7…34e162. Ajout des seules métadonnées/tokens selon sherpa, sans réentraînement. Cela évite la filiation Lessac/Ryan à licences de recherche/NC. Les voix Gilles, MLS_1840, Tom et Miro ont aussi été écartées pour filiation/conditions spécifiques. Publication seulement si génération/lecture/arrêt/restauration Android et signature sont verts ; écoute humaine toujours ouverte.

Lexique : le nouveau probe MLS a révélé des nasales combinées absentes comme tokens uniques (ɔ̃, ɑ̃). Conversion vers les vrais tokens de la voix, sans perdre le signe nasal ; entrée exclue si un symbole demeure inconnu, puis secours Android. Tests Python ajoutés. Le probe utilisait aussi un constructeur Python GenerationConfig avec argument non supporté ; appel corrigé.

MLS : synthèse hôte réelle réussie 40958317324 ; 90 113 entrées compatibles après conversion. Le signal du probe avait une crête faible (0,023), d’où un gain borné (×20 maximum) sur le PCM réellement joué et le RMS de bouche. Entrée vocale mise en minuscules comme la vérification du lexique. Test JVM DSP ajouté ; transcription indépendante du WAV en cours, sans remplacer l’écoute humaine.

Cause phonétique prouvée par le code sherpa v2.0.1 : le lexique à tabulations activait le frontend générique ; seul le nouveau format « mot || phonèmes » active le chemin Piper avec BOS/pad/EOS. Signal trop court/faible donc non suffisant comme preuve d’intelligibilité. Export du lexique vers ce nouveau format, puis génération et transcription de contrôle à relancer avant écoute humaine.

Contrôle supplémentaire : la transcription indépendante du premier WAV ne retrouvait pas la phrase demandée, malgré les tests PCM verts. Publication maintenue suspendue. Comparaison de plusieurs locuteurs MLS et de phonèmes de référence eSpeak (outil de test hôte uniquement, jamais embarqué) pour isoler la cause ; pas d’assimilation de « son produit » à « parole intelligible ».

Comparaison 40959770234 : les mêmes poids MLS deviennent compréhensibles avec les phonèmes de référence, pour plusieurs locuteurs ; la source du défaut est donc le chemin phonétique, pas seulement le timbre. Adaptation explicite des conventions gruut vers celles du modèle français (ɲ→nj, ɥ→y, accent lexical final), sans embarquer ni extraire le code/données du phonémiseur GPL. Tests de transformation et nouvelle transcription nécessaires ; publication toujours suspendue.

Probe 40960582870 : avec les mêmes phonèmes de dictionnaire, l’entrée directe codepoints est bien plus intelligible que le frontend texte-lexique (ASR retrouve « je suis ton petit compagnon ... tu veux jouer ... avec moi »). PiperPhonetics prépare désormais l’IPA complet de chaque segment avant tout son ; génération via GenerationConfig.phonemeCodepoints, sans frontend texte ni phonémiseur externe. Tests : nasales combinées, frontières de mots, chiffres/inconnus refusés avant parole. Nouvelle surcharge callback à revérifier réellement sur Android ; transcription de trois phrases du chemin exact en cours.

