# Bonze 0.5 — veille et parole incarnée

Autorisation : Fab « Ok, corrige ça » après audit-2026-10-29-veille-dialogue-visage.md. Même branche, pas de merge main. Implémentation directe de l'audit approuvé.

1. Service Android propriétaire de STT/inférence/TTS et historique : démarrage explicite app visible avec permissions, notification Arrêter, START_NOT_STICKY, autonomie vis-à-vis Activity/WebView, état restauré au réveil, callbacks par époque. Test JVM de pause UI sans arrêt, arrêt définitif et vieux résultats. Activation micro interdite par simple bind/resume.
2. Historique natif borné, migration une fois de l'historique JS, contexte récent et scène de jeu présents dans chaque appel LFM. DialogueMemory pur testé : rôles, budget, dernière demande et contexte conservés. Prompt court affirmatif, aucune correction identitaire systématique ; qualité du modèle à tester humainement.
3. Canal d'événements natif avec snapshot, ordre de commande et numéros de révision. Le navigateur garde son noyau et ses protections ; UI Android ne coupe pas le service à visibilitychange. Test navigateur avec pont simulé, état en veille et réveil, arrêts et résultats anciens.
4. Bouche visible pilotée par début/range/fin/arrêt des vraies lectures, repli temporel déclaré si le moteur ne fournit pas les plages. Noyau JS de parole testé ; visage agrandi en portrait avec tests de dimensions, sous-titres et Stop accessibles. Choix de voix française locale déterministe et conservé, segmentation/pauses/rate modérés, identité vocale stable. Piper demeure chantier distinct de licences/intégration, pas annoncé intégré.
5. Version0.5/code5, JS/JVM/navigateur, compilation/lint/inspection permissions/signature en CI, APK direct et mémoires synchronisées. Le service/wake lock sont limités à la conversation autorisée ; aucune prétention de validation physique Samsung.

Risques à couvrir : permission tardive après Stop, fond pendant génération ou parole, commande texte après stop, Activity recréée, interruption audio/casque, silence, voix absente, stockage incomplet, événements TTS anciens, mode texte/off et neurones désactivés.
