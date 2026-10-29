# Bonze AI — mémoire vivante

Un humain de référence par instance, enfant ou adulte, lié par découverte progressive. Les autres peuvent converser ; seules les actions authentifiées du propriétaire modifient les missions.
Invariants : curiosité, respect de tous, apprentissage, progrès, sincérité sur les limites. Les émotions sont simulées et ne rendent pas les connaissances vraies.
Miroir : compétences jamais testées, testées, à revérifier ; preuves d'échecs et réussites, apprentissage validé. Mémoire sociale des personnes connues sans présomption de compétence d'après leur âge.
Souvenirs consolidés selon importance, émotion simulée et répétition, mais statut de vérité indépendant. Mémoire courte, durable et archives à concevoir.
Modes : transcription française locale, précise, économique, secours texte, désactivée ; bascule selon ressources, microphone coupé par humain toujours prioritaire.
Avatar très léger et mignon : grands yeux pixelisés, sourcils, sourire, rougeurs ; expressions et skins. Un seul noyau Web/PWA et Android APK/AAB.

Android 0.1.0 : WebViewAssetLoader, sans permission INTERNET, même noyau empaqueté au build ; voix à la demande avec SpeechRecognizer on-device seulement, jamais de fallback réseau ; saisie clavier prioritaire. App debug, non destinée à Play Store.

**0.2.0** : implémentation réelle micro-MoE entraînée (8 petits experts top-2, 304 poids sur 64 phrases) associée à un seul LLM dense préentraîné LiquidAI LFM2.5-230M, Q4_K_M GGUF ~153 Mo. Ce dernier n'est pas MoE en lui-même. Kotlin/llama.cpp hors ligne, poids téléchargés et vérifiés à la construction, modèle désactivable ; avertissements honnêtes en cas de saturation mémoire. Pas de fallback cloud. Les hallucinations restent possibles.
