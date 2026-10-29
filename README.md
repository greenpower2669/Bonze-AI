# 🌱 Bonze AI

Petit bonze qui évolue avec son humain. Prototype 0.1, hors ligne, conçu pour une WebApp/PWA et une future application Android partageant un seul noyau.

## Réalisé
- Noyau JavaScript indépendant de la plateforme : émotions simulées, miroir de compétences fondé sur les essais, politique de modes d'écoute selon ressources.
- WebApp : visage avec yeux et sourcils animés, dialogue textuel volontairement limité, surnom facultatif, PWA, voix française seulement si le navigateur confirme une voix locale.
- Tests unitaires ; mémoires de projet selon FAB-Copilot.

## Non réalisé
Aucune vraie reconnaissance vocale, aucun LLM, aucune authentification forte du propriétaire et aucun APK/AAB. La pression mémoire affichée est une simulation, non une mesure. Le profil et les 30 derniers messages sont en clair dans le navigateur : ne saisir aucun secret.

## Tester
Depuis la racine : python3 -m http.server 8080
Puis ouvrir http://localhost:8080/docs/
Node 20+ : node --test tests/*.test.mjs
Le Service Worker demande HTTPS ou localhost, et une première visite avant fonctionnement hors ligne.

## Architecture
core/ : logique portable. docs/ : WebApp/PWA. android/ : plan de packaging natif. tests/ : vérifications automatisées.
Branche de développement uniquement ; pas de merge dans main sans validation.
