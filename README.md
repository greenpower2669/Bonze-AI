# 🌱 Bonze AI

Petit bonze qui évolue avec son humain. Prototype 0.2, hors ligne, conçu pour une WebApp/PWA et une future application Android partageant un seul noyau.

## Réalisé
- Noyau JavaScript indépendant de la plateforme : émotions simulées, miroir de compétences fondé sur les essais, politique de modes d'écoute selon ressources.
- WebApp : visage avec yeux et sourcils animés, dialogue textuel volontairement limité, surnom facultatif, PWA, voix française seulement si le navigateur confirme une voix locale.
- Tests unitaires ; mémoires de projet selon FAB-Copilot.

## Modèles maintenant intégrés
- Micro-MoE émotionnel : 8 experts, 304 poids entraînés, top-2 routing. Un prototype de décision spécialisée, PAS un grand MoE neuronal de langage.
- Modèle de langage dense LFM2.5-230M de Liquid AI Q4_K_M (153 Mo). L'APK Android embarque les poids vérifiés à la compilation, et llama.cpp exécute le calcul hors ligne. Licence distincte LFM Open License v1.0 incluse.

## Non réalisé
L'APK Android expérimental inclut une écoute locale facultative seulement si le téléphone propose SpeechRecognizer on-device (Android 12+). Aucune authentification forte du propriétaire et aucun AAB. La pression mémoire affichée est une simulation, non une mesure. Le profil et les 30 derniers messages sont en clair dans le navigateur : ne saisir aucun secret.

## Tester
Depuis la racine : python3 -m http.server 8080
Puis ouvrir http://localhost:8080/docs/
Node 20+ : node --test tests/*.test.mjs
Le Service Worker demande HTTPS ou localhost, et une première visite avant fonctionnement hors ligne.

## Architecture
core/ : logique portable. docs/ : WebApp/PWA. android/ : plan de packaging natif. tests/ : vérifications automatisées.
Branche de développement uniquement ; pas de merge dans main sans validation.
