# Bonze AI — TODO actif après audit du 01/11/2026
_État de référence : `feature/bonze042-field-fixes`, mission BONZE-049 (01/11/2026)._ Éléments historiques cochés et toutes les preuves conservés dans `docs/memory-archives/2026-11-01-pre-audit/todo.md`._

## P0 — Bloquants d'acceptation
- [ ] **Dialogue pertinent :** préparer un banc reproductible de 50–100 phrases françaises, incluant question spécifique, absurde, négation, correction, métalangage, prénom, chiffres, suite « et après », jeu de rôle et séquences de 20 tours. Mesurer adéquation, hors-sujet, répétition, sécurité et continuité ; comparer aux sorties du corpus et à l'intention classée.
- [ ] **Mémoire/contextualisation :** vérifier le plafond réel du contexte (300 caractères de dialogue précédent présentés au classificateur) et tester multi-tours ; définir un rappel sélectif autorisé des tiroirs SVC dans la conversation. Ne jamais ouvrir le coffre en arrière-plan ni traiter une déclaration comme un fait vérifié.
- [ ] **Piper sur Samsung :** tester un vrai APK, casque Bluetooth, silence, nombres 0–9 999, `15h30`/horaires, OOV, nom propre, cinq phrases consécutives, Stop en synthèse/lecture et réveil après mise en veille. Relever codes d'erreur et latence avant première syllabe.
- [ ] **Performance :** mesurer PSS/CPU/mémoire de pic et latences Liquid 230M, seconde sélection de synonyme, génération complète PCM Piper et basculement optionnel 1.2B ; un seul GGUF lourd en RAM.
- [x] **APK 0.8 :** [Release directe](https://github.com/greenpower2669/Bonze-AI/releases/tag/bonze-ai-v0.8.0-dev-parallel) vérifiée, run 41313340656. Évolution 90k non publiée.

## P1 — Fiabilité / sécurité / ergonomie
- [ ] Vérifier que l'anti-répétition évite les échos et réponses génériques sans rejeter des formulations appropriées. Tester le rejet de candidat puis nouveau tirage (état du répertoire persisté).
- [ ] Tester les interruptions entre classification, seconde inférence Liquid, synthèse/lecture et Stop ; vérifier absence de publication d'une réponse périmée.
- [ ] Tester le comportement Android 16/17 : micro local disponible ou absent, permission refusée, notifications, batterie/écran verrouillé, `stopWithTask`, casque débranché, absence de réseau, TalkBack.
- [ ] Auditer la différence entre historique de 30 entrées, contexte de 8 citations et coffre à tiroirs chiffré. Vérifier consentement, session propriétaire, restauration, conflits SVC, corruption et effacement.
- [ ] Examiner la signature temporaire de l'APK parallèle et la non-compatibilité de mise à jour avec l'APK utilisateur ; protéger les données 0.6/0.7.
- [ ] Vérifier licences de distribution Liquid, sherpa, Piper et des corpus vocaux avant publication stable.

## P2 — Évolutions après preuves
- [ ] Affiner les influences émotionnelles et valider les expressions du visage contre l'état réel du conseil, sans assimiler les experts de routage à des neurones LLM indépendants.
- [ ] Développer une mémoire progressive, contrôlée, avec fiabilité, oubli/consolidation explicite, portabilité et apprentissage mesuré.
- [ ] Élargir la couverture du répertoire *par intentions et fonctions conversationnelles réelles*, non par simple multiplication grammaticale.
- [ ] Choisir si l'import manuel Liquid 1.2B reste utile ; documenter la charge mémoire et la différence de performance réelles.
- [ ] Valider PWA offline, Android, accessibilité, packaging Play Store/AAB seulement sur demande.

## Résultats déjà prouvés — ne pas refaire sans changement pertinent
- [x] BONZE-044 : répertoire écrit le texte, Liquid classe et sélectionne des indices, 20 intentions, 21 paires de synonymes, règles horaires ; extension 90k en chantier.
- [x] Tests `Bonze AI tests` du HEAD `5fde323c` : [41244426748](https://github.com/greenpower2669/Bonze-AI/actions/runs/41244426748) et [41244422050](https://github.com/greenpower2669/Bonze-AI/actions/runs/41244422050) réussis.
- [x] Packaging complet/lint/signature du SHA antérieur `a0cc30ad` : [41243984444](https://github.com/greenpower2669/Bonze-AI/actions/runs/41243984444) réussi ; ne démontre pas l'écoute sur appareil.
- [x] GitHub Release 0.8.0-dev-parallel possède un asset APK direct, signature expérimentale.

**Règle de clôture :** cocher uniquement après test/proof et indiquer commit, appareil, logs, résultats, limites dans `debughistorical.md`. Aucun merge `main` ni Release sans autorisation explicite.

## BONZE-049 — extension 10k × 9 et reformulation Liquid
- [x] Porter 200 noyaux à 50 formes chacun : 10 000 variantes virtuelles × 9 rôles sans 90k chaînes simultanément en RAM (622705be, CI 41321401979 réussie).
- [x] Enrichir la sélection de variantes Liquid avec intention/contexte/rôle émotionnel ou juge, tout en refusant une sortie libre (95b0778f). Mesurer encore le gain réel de naturel et la non-répétition sur appareil.
- [x] Contrôler comptage, unicité, 220 caractères, intentions, lexique Piper, JS/JVM et Android CI au commit 622705be (run 41321401979 success).
- [ ] Finaliser les mêmes contrôles sur le **dernier commit 95b0778f**, empaqueter expérimentalement sans Release, puis tester sur Samsung (pertinence, RAM, Piper et latence).
- [ ] Nouvelle APK uniquement après accord explicite de Fab, tests adaptés, signature cohérente et Release directe.


## BONZE-050 — objectif prioritaire : reconstruire les phrases selon le sujet
- [x] Préparer jusqu'à quatre répliques complètes de même rôle et intention, à partir des 90 000 compositions virtuelles, avec classement lexical des noyaux pertinents.
- [x] Liquid classe l'intention et choisit une réponse complète par numéro contrôlé, sans génération libre ; réponses sensibles sous garde.
- [x] Antirépétition avant et après arbitrage ; seule la réponse approuvée est persistée. Maintenir les préférences de personnalité et un seul GGUF chargé.
- [x] Tests Node sur proposition sans écriture, cohérence émotionnelle, sujet dragon, sécurité et vingt tours ; tests unitaires initialement verts sur c2bcf149.
- [x] BONZE-050 : CI Android et empaquetage expérimental réussis au commit `080e53dd` (run 41325082320), sans artefact APK distribué ni Release.
- [ ] Revalider le paquet sur le commit BONZE-051 (correctifs d'intention), signature et manifest ; ne publier qu'après accord distinct.
- [x] Banc **déterministe** BONZE-051 : 82/82 énoncés, 20 intentions, négations, priorités, 20 tours, couverture de thèmes 9/10 sur test ciblé (run 41342420616).
- [ ] P0 : mesurer **sur Samsung**, avec vrai Liquid, qualité des réponses complètes sur 50–100 situations, hors-sujet, continuité, répétition, latence et RAM. Les 82 tests ne mesurent pas encore la pertinence neuronale.
- [ ] P0 : tests Samsung pour Piper, casque Bluetooth, Stop/interruption, écran verrouillé et préservation des données ; étendre ensuite les noyaux sémantiques réellement utiles plutôt que les seules formes.

## BONZE-052/053 — continuité et mémoire des formulations (01/11/2026)
- [x] Ne plus avancer l'historique de phrases pour des alternatives rejetées par `ReplyQuality` ou Piper, **y compris le chemin de secours hors mode précis** (23bef946, tests JS/Java corrigés 02b5fb5a).
- [x] Conserver le thème narratif et l'étape avec des nombres bornés, sans conserver le texte privé, et compléter les 11 scènes avec trois suites écrites (897402c8).
- [x] Tests Node des nouveaux scénarios, suites et mémoire anti-répétition verts sur [41343213525](https://github.com/greenpower2669/Bonze-AI/actions/runs/41343213525).
- [ ] Vérifier l'audit lexical Piper, la compilation/lint Android et l'APK expérimental sur le dernier commit avec `bonze-build`, sans Release.
- [ ] Tester la conversation réelle sur Samsung : 20 tours, pertinence des suites, phrases répétées, 33 suites vocales Piper, stop/veille, débit, latence Liquid et consommation mémoire.
- [ ] Affiner la suite après le troisième événement : une histoire très longue demande de nouveaux événements utiles, pas de répétition du même noyau.
