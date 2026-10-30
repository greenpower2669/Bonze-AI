# Avenant0.5 — plan d'implémentation

But : corriger la conversation puis construire les mécanismes observables et la sauvegarde, intégrer Piper avec licences vérifiées et validation réelle.
Architecture conservée : noyau partagé JS, service natif Android propriétaire du dialogue, un modèle dense partagé, interface accessible. Package fr.bonzeai.companion ; branche feature/offline-bonsaiv1 ; aucune permission INTERNET, aucune écoute automatique, aucun merge main.

1. Diagnostic : comparaison reproductible vraie génération GGUF/llama.cpp, contexte actuel vs rôles ; test UI sur ancien affichage et longs sous-titres. Corriger la cause prouvée seulement. Journal de tour identifie transcription, prompt, sortie brute, affichage et voix.
2. Calculs : modules émotionnels explicites produisant contributions évaluables, forces/endurance individuelles, interactions et arbitre déterministe ; versionner paramètres/poids ; tests d'ablation et influences. Toute limite neuronale reste déclarée.
3. Administration : authentification Android par code de verrouillage/biométrie système si disponible, accès accessible en options ; geste60touches seulement ouvre authentification, ne donne pas de droits ; sessions d'administration expirent au fond.
4. Sauvegarde : JSON versionné chiffré AES-GCM avec clé dérivée du mot de passe, taille bornée, validation avant mutation, restauration confirmée avec copie de retour arrière ; Android Storage Access Framework ; aucun export automatique ni données dans logsCI.
5. Piper : choisir moteur/poids vérifiés, intégrer paquet français hors ligne, audio PCM joué avec niveau pilotant bouche ; arrêt annule génération/lecture, mesures latence/RAM ; AndroidTTS secours explicite. Licences et sources correspondantes avant publication. Essai physique et écoute restent nécessaires.
6. Validation : testsJS/JVM/navigateur, compilation/lint, analyse permissions/signature, APK direct en prérelease, mémoires mises à jour et missions non clôturées sans preuve.

Points de revue : Stop pendant calcul et restauration ; callbacks anciens ; corruptions sauvegarde/versions inconnues ; grands caractères petits écrans ; aucune réactivation de module/écoute au réveil. Base locale et GitHub distinctes : transport des changements par API avec lease.
