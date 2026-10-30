# Étude MoE et Piper — 29 octobre 2026

## État réel

La version 0.4 utilise un seul LFM2.5-230M dense via l'AAR llama-android 0.1.1. Les 304 paramètres de `expert-router-v1.json` apprennent des scores à partir de motifs lexicaux ; ce sont des micro-experts émotionnels expérimentaux. Ils ne modifient pas les couches internes du LFM, n'améliorent pas sa connaissance générale et ne constituent pas le MoE linguistique demandé. Les émotions, leur adaptation et leur projection graphique sont actuellement des mécanismes explicites testables ; aucun apprentissage profond de personnalité n'est revendiqué.

## Véritable MoE : piste technique proposée, pas implémentée

La littérature Mixtral décrit des réseaux feed-forward experts, un routeur dépendant de l'état caché et une combinaison de leurs sorties au cours de la génération, par token et par couche. Source primaire : https://arxiv.org/abs/2401.04088 . Copier plusieurs prompts ou classifier la phrase entière ne réalise pas cette opération.

Piste compatible avec un petit tronc partagé : conserver embeddings, tokenizer et tronc LFM ; ajouter des adaptateurs experts bas rang dans certaines projections, router top-2 depuis les activations cachées et combiner réellement les résidus des experts. Il s'agit d'une hypothèse d'architecture à éprouver, pas d'une compatibilité démontrée de cet AAR. Les huit tendances émotionnelles ne doivent pas être confondues avec huit domaines de connaissance. Spécialités candidates : dialogue français, reformulation, raisonnement élémentaire, incertitude/explication ; émotions fournies comme contexte distinct.

Prérequis : inspecter le backend exact fourni par l'AAR, implémenter/porter des opérateurs de mélange et le chargement d'adaptateurs, instrumenter les activations et établir une référence dense. Ne pas simplement multiplier huit fichiers de modèle complet. Entraîner les adaptateurs et le routeur sur données autorisées en séparant apprentissage et évaluation, équilibrer la charge des experts et documenter spécialités + jeu de validation tenu à l'écart.

Preuves exigées avant de fermer BONZE-011 : variation des logits et du texte après ablation de chaque expert, comparaison routeur appris/aléatoire/désactivé, experts réellement sélectionnés et poids actifs, qualité française et refus d'invention, coût RAM/stockage/CPU/p50-p95, conservation d'un seul tronc. Les économies mémoire ne sont pas acquises : top-2 diminue le calcul actif, pas automatiquement tous les poids résidents.

Budget d'adaptateurs, à titre de formule uniquement : pour une projection d'entrée d et de sortie m, rang r, E experts, poids FP16, stockage additionnel ≈ `2*E*r*(d+m)` octets, plus routeur et métadonnées. Ne pas publier un chiffre de RAM appareil à partir de cette seule formule. Aucun entraînement de ce MoE linguistique n'a été exécuté dans cette session.

## Piper : compatibilité et licences à résoudre avant embarquement

Sources primaires consultées :

- Moteur maintenu OHF-Voice : https://github.com/OHF-Voice/piper1-gpl — GPL-3.0 ; le package annonce GPL-3.0-or-later. Source : https://github.com/OHF-Voice/piper1-gpl/blob/main/setup.py .
- Voix SIWIS low : https://huggingface.co/rhasspy/piper-voices/blob/main/fr/fr_FR/siwis/low/MODEL_CARD — français France, 16 kHz, dataset annoncé CC-BY 4.0 ; modèle environ 28,1 Mo selon l'arbre HF. Medium : 22,05 kHz, environ 63,2 Mo, même carte de dataset, https://huggingface.co/rhasspy/piper-voices/blob/main/fr/fr_FR/siwis/medium/MODEL_CARD .
- Alternative d'exécution de modèles VITS/Piper, exemples Android : https://k2-fsa.github.io/sherpa/onnx/tts/pretrained_models/vits.html . La compatibilité d'une voix française précise, de son phonémiseur et du paquet Android doit être vérifiée ; la licence du moteur seul ne résume pas celle des dépendances.

Le dépôt Bonze est MIT. L'intégration d'un moteur GPL et de son phonémiseur ne se résout pas en ajoutant une mention MIT. Vérifier obligations de distribution de l'ensemble, notices, sources correspondantes et licences des poids/jeu SIWIS ; ne pas changer silencieusement l'identité de licence du projet. Ces observations sont un relevé de sources, pas une validation juridique de distribution.

Prochaine expérience reproductible : intégrer une voix SIWIS candidate dans un build d'étude séparé, avec moteur et poids figés par commit/hash et toutes les notices ; jouer des phrases françaises, nombres, noms, pauses ; chronométrer première synthèse et suivantes, RAM, interruption pendant synthèse/lecture, reprise micro après silence réel. Écoute humaine par Fab pour juger douceur et intelligibilité. Le caractère « mignon » ne peut pas être validé par la seule carte du modèle.

L'expressivité autorisée dépend des paramètres réellement exposés : durée/débit, silences, variations discrètes. Ne pas promettre des émotions vocales entraînées ou une modification de timbre absentes du moteur. Un même locuteur pour toute la conversation.

**Piper non embarqué dans 0.4.** TTS Android : sélection d'une voix française ne nécessitant pas le réseau, débit discrètement modulé. Sa présence dépend de l'appareil. Reconnaissance : `createOnDeviceSpeechRecognizer`, API 31+, sans fallback réseau ; documentation https://developer.android.com/reference/android/speech/SpeechRecognizer . Le mode avion et les paquets français installés restent à tester physiquement.
