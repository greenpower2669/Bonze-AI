# Bonze AI — debughistorical (synthèse active)
_Nettoyage documentaire au 01/11/2026. Le journal intégral antérieur, inchangé, est archivé à `docs/memory-archives/2026-11-01-pre-audit/debughistorical.md`. Ne pas remplacer une preuve ancienne par une supposition nouvelle._

## Incidents historiques avec preuve datée
- **29/10, v0.1–0.3 :** premières erreurs Android SDK/Gradle/chemin APK corrigées dans workflows ; premières Releases ont des APK debug mais ne prouvent pas un fonctionnement vocal sur Samsung.
- **29/10, v0.4 :** retour de Fab : veille coupe l'échange, persona protocolaire, rôle perdu, visage petit, sous-titres/Stop gênants. Reprise du cycle natif `ConversationService` en 0.5 et corrections UI 0.6 ; qualité des réponses reste ouverte.
- **29/10, 0.6 :** crash JNI callback `invoke(float[]) -> Integer` de Piper et erreur de vérificateur ART corrigés ; trois essais instrumentés alors réussis. La Release [0.6.0](https://github.com/greenpower2669/Bonze-AI/releases/tag/bonze-ai-v0.6.0) a un APK direct. Cette preuve est propre à ce commit.
- **30/10, BONZE-031/032 :** contexte chronologique humain+Bonze ajouté ; mesures Linux 230M vs 1.2B : le plus grand modèle n'est pas universellement plus fiable et peut fabriquer des informations. Résultats `docs/bench-dialogue-fr-bonze031-results.md`. Pas de benchmark Android comparable.
- **30/10, 0.7.0-dev :** APK direct publié [Release](https://github.com/greenpower2669/Bonze-AI/releases/tag/bonze-ai-v0.7.0-dev) sur package parallèle `fr.bonzeai.companion.dev`. Retours de Fab : réponses hors sujet, échos et coupures Piper.
- **31/10, BONZE-040/041 :** anti-perroquet et pré-buffer Piper ajoutés, corpus 18k issu des branches intégrées ; cependant l'APK 0.8 déjà généré (`cd17a6b`) utilisait encore prioritairement la génération libre Liquid. Ne pas lui attribuer les corrections BONZE-044.
- **31/10, BONZE-043/044 :** architecture basculée vers intention Liquid et répertoire auteur des réponses ; deuxième inférence Liquid bornée au choix de variantes prévalidées. Réalité du bon dialogue encore à établir.
- **31/10, BONZE-045/046 :** 21 paires lexicales, conversion Piper des nombres et horaires, CI/lint/packaging complet [run 41243984444](https://github.com/greenpower2669/Bonze-AI/actions/runs/41243984444) au SHA `a0cc30ad` réussis ; APK parallèle contrôlé en artefact interne, non publié.
- **31/10, BONZE-047 :** publication GitHub Releases 0.8 échoue en HTTP 403 ; la création de Release sur un commit qui modifie des workflows peut exiger `Workflows: write`. Vérifier permissions réelles avant action. Aucun contournement par merge.
- **31/10, HEAD `5fde323c` :** tests GitHub [41244426748](https://github.com/greenpower2669/Bonze-AI/actions/runs/41244426748) et [41244422050](https://github.com/greenpower2669/Bonze-AI/actions/runs/41244422050) verts ; ce n'est pas un essai Android acoustique.

## Constats techniques de l'audit statique du 01/11
- **DIALOGUE / risque majeur :** `ReplyQuality.review()` détecte échos et déflexions génériques mais pas le sens de la réponse ; `ScriptedDialogue` classe 20 intentions pour 200 noyaux, sans base de connaissances à réponse ciblée. **Ce n'est pas une preuve d'anomalie observée sur la dernière version**, mais un défaut de couverture vérifiable par tests.
- **CONTEXTE :** `DialogueMemory` garde 30 lignes et cite jusqu'à huit échanges, alors que `BonzeInference.classify()` ne reçoit que `contextData.take(300)` ; risque de perte des antécédents et de « et après » hors contexte.
- **MÉMOIRE PRIVÉE :** `docs/memory-ui.js` et `core/memory-vault.mjs` chiffrent le coffre ; aucun raccord de `recall()`/SVC à `ConversationService` dans le flux auditée. Lecture manuelle et limites d'autorisation à conserver.
- **PIPER :** `PiperVoice.speak()` génère tous les segments en `FloatArray`, puis un `ShortArray` PCM avant le premier son. Risque de latence et de pic de RAM, pas de mesure Samsung sur cette branche ; toute coupure observée devra être reliée aux traces.
- **RÉPERTOIRE :** `ScriptedDialogue.choose()` persiste l'état lors de chaque tirage, y compris lors des candidats ensuite refusés par `ReplyQuality` ; vérifier les effets sur les associations et anti-répétition. 18 000 formes compositionnelles ≠ 18 000 réponses informées.
- **ANDROID :** `AndroidManifest.xml` ne demande pas INTERNET, service `stopWithTask=true`, `ConversationService.onTaskRemoved()` appelle Stop ; cohérent avec fermeture volontaire, à distinguer de la veille écran.
- **LIVRAISON :** GitHub Release 0.7 disponible, nouvelle APK 0.8 non publiée. Dernier HEAD n'a pas de preuve de packaging complet postérieure à `a0cc30ad`.

## Protocole de conservation des preuves
Tout incident futur : version APK *installée* + applicationId, heure UTC, appareil et OS, scénario reproductible, attendu/observé, trace sans données personnelles, cause certaine/probable/inconnue, commit/CI correctif, test de non-régression. Les détails déjà clos ou les sorties sensibles restent dans l'archive originale, jamais recopiés en boucle.

Consulter `docs/audits/2026-11-01-bonze-audit-sans-code.md` pour risques priorisés et recommandations. La prochaine mission active est suivie dans `todo.md`.
