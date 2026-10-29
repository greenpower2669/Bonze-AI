# Piper français — intégration vérifiable

Bonze utilise les poids Piper VITS **MLS medium (locuteur 0 fixe)**, interprétés par **sherpa-onnx 2.0.1**, et un lexique français local de 90 114 entrées (voicegarden 0.3.1 / gruut). Les téléchargements ont lieu à la construction et sont vérifiés par SHA-256 dans `scripts/fetch-piper.sh`. L'application ne demande pas INTERNET.

Le moteur est chargé seulement à la première lecture Piper. La voix du locuteur 0 conserve son timbre ; seuls le débit (0,94 à 1,02) et les pauses entre segments changent modestement. Aucun contrôle d'émotion appris, de hauteur Piper ou de synchronisation phonémique n'est revendiqué.

`PiperVoice` produit du PCM 22 050 Hz, le joue avec AudioTrack et relève sa tête de lecture. La bouche suit le RMS des 441 derniers échantillons effectivement consommés. C'est une animation par amplitude, pas des visèmes. L'arrêt invalide la génération, coupe/vidange AudioTrack et interdit la reprise d'écoute par un ancien callback.

Avant toute lecture, les mots de toute la réponse sont vérifiés dans le lexique. Les mots inconnus, nombres et erreurs avant lecture passent au moteur Android local ; la raison et le moteur réellement utilisé figurent dans le journal administrateur. Une erreur après le début du son arrête la lecture, sans rejouer la réponse. Les noms inventés et les élisions réduisent la couverture : un phonémiseur français plus complet reste à développer. Le sélecteur de voix permet aussi de choisir explicitement Android pour comparer.

## Licences et attribution

- Runtime sherpa-onnx 2.0.1 : Apache-2.0, copyright Xiaomi/k2-fsa ; [source exacte](https://github.com/k2-fsa/sherpa-onnx/tree/v2.0.1). La version 2.0 a retiré eSpeak et piper-phonemize : [changement upstream](https://github.com/k2-fsa/sherpa-onnx/issues/3731). Bonze ne copie jamais le dossier `espeak-ng-data` encore présent dans l'archive de voix.
- Voix MLS medium, Piper / Michael Hansen : [fiche](https://huggingface.co/rhasspy/piper-voices/blob/main/fr/fr_FR/mls/medium/MODEL_CARD), entraînée depuis zéro. Modèle upstream déclaré MIT, corpus Multilingual LibriSpeech CC-BY 4.0, [OpenSLR94](https://www.openslr.org/94/). Attribution : Vineel Pratap, Qiantong Xu, Anuroop Sriram, Gabriel Synnaeve, Ronan Collobert, « MLS: A Large-Scale Multilingual Dataset for Speech Research », 2020. [Licence CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/). Bonze ajoute les métadonnées sherpa et un token map issus du JSON upstream, sans réentraîner/quantifier les poids. Un seul des 125 locuteurs est utilisé, toujours le numéro 0.
- Siwis medium a été essayé en recherche puis écarté avant publication : sa fiche signale un affinage de Lessac medium, dont le [corpus source est sous licence de recherche non commerciale](https://www.cstr.ed.ac.uk/projects/blizzard/2013/lessac_blizzard2013/license.html). Gilles/MLS_1840 dérivent de Ryan (CC-BY-NC-SA), Tom indique AGPL ; aucune de ces voix n'est distribuée par ce candidat. L'étiquette MIT générale d'un dépôt ne résout pas toutes les conditions spécifiques.
- Lexique : AACTools/voicegarden-lexicons 0.3.1, source gruut-lang-fr, MIT (Michael Hansen). NOTICE original conservé ; Bonze ajoute explicitement les prononciations `bonze` et `ai`.
- ONNX Runtime 1.28.2 : MIT (Microsoft), notices tierces incluses ; OpenFst : Apache-2.0 ; kaldi-decoder / kaldi-native-fbank : Apache-2.0 ; simple-sentencepiece : Apache-2.0 ; utf8proc : MIT + notice Unicode. Textes dans `docs/licenses`, embarqués dans l'APK.
- Conseil partagé : Rhino 1.7.15.1, MPL-2.0 ; aucun fichier Rhino modifié, [sources disponibles ici](https://github.com/mozilla/rhino/tree/Rhino1_7_15_1_Release). MPL reste applicable à Rhino ; les fichiers Bonze conservent leur licence.

Les binaires LLVM/libc++ et les dépendances Android gardent leurs notices propres. Cette analyse distingue licence du runtime et licence des données ; elle ne prétend pas que tous les poids héritent automatiquement d'Apache-2.0.

## Validation et limites

La CI hôte 40906407731 avait produit un WAV Siwis français non nul, hors réseau pendant la synthèse ; elle est conservée comme preuve expérimentale historique, pas comme voix livrée. Le nouveau probe utilise MLS. Ce résultat ne vaut pas une validation sur téléphone. Des tests instrumentés Android vérifient la lecture PCM, les niveaux, l'arrêt et l'exécution du conseil partagé, avec Wi-Fi/données coupés. Leur résultat doit être lu dans Actions avant publication.

L'écoute humaine sur le Samsung de Fab (intelligibilité, douceur, diction, naturel, bruit et préférence face à Android), le micro écran éteint, l'écho réel et la consommation RAM/CPU réelle du téléphone restent des validations à effectuer. Ne pas déclarer Piper « terminé » avant cette écoute. Les métriques de l'émulateur ne sont pas celles du Samsung.
