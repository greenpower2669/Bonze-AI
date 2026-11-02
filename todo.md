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
- [x] BONZE-054 : trois événements puis clôture écrite unique, sans répétition automatique ; le juge Liquid voit quatre variations de la même étape, pas des histoires concurrentes. Tests Node [41343614295](https://github.com/greenpower2669/Bonze-AI/actions/runs/41343614295) verts.
- [ ] Pour des histoires plus longues : enrichir les scènes en fonction des choix explicites de l'utilisateur, sans invention factuelle ni boucle automatique.

### BONZE-054 — suivi du correctif Piper
- [x] Réduire la longueur de la clôture après l'échec `Oversized story closure peur` sur 2854d3f5 ; ajouter un test pour chaque rôle (ecf253ce).
- [ ] Vérifier la réussite de l'audit Piper, de la compilation, du lint et de l'APK expérimental sur le dernier code ; signature temporaire, pas de Release.

## BONZE-055 — priorité au sujet plutôt qu'à la variété
- [x] Ajouter « pirate » à une histoire existante sans gonfler les modèles ni le catalogue 90k ; test ciblé de thèmes lexicaux 10/10.
- [x] Sujet inventé absent du corpus : clarification écrite, sans hallucination ou réutilisation d'un autre scénario ; ne pas confondre avec « Et après ? ».
- [x] Pour 20 demandes successives du même sujet connu, le thème reste prioritaire malgré l'anti-répétition et les formes varient (CI [41344518211](https://github.com/greenpower2669/Bonze-AI/actions/runs/41344518211)).
- [ ] Vérifier le paquet expérimental, l'audit Piper et son empreinte après BONZE-055 ; conserver les données et la branche `main`, sans nouvelle Release.
- [ ] Tester sur Samsung 50–100 sujets français avec vrai Liquid, mesure qualité/pertinence, répétition, latence, RAM, Piper et Stop. Le mini-banc 10/10 ne démontre pas une compréhension sémantique.

## BONZE-056 — pertinence du sujet prioritaire dans le choix Liquid (01/11/2026)
- [x] Éviter de présenter à Liquid des histoires différentes pour une demande explicite sur un sujet précis ; garantir quatre variantes du même noyau et du même rôle.
- [x] Ajouter un petit dictionnaire d'alias français conservateurs (11 thèmes, pluriels/synonymes choisis), sans modèle supplémentaire ni nouvelles connaissances.
- [x] Tester les formulations « Raconte-moi une histoire de pirate », « Invente une aventure de robots », « Imagine une forteresse », les ambiguïtés et les répétitions sur vingt tours. CI [41355014355](https://github.com/greenpower2669/Bonze-AI/actions/runs/41355014355) réussie.
- [ ] Tester la compilation, l'audit Piper et le paquet expérimental complet sur le dernier SHA BONZE-056 ; ne pas publier une nouvelle Release sans accord.
- [ ] Sur Samsung, contrôler le **choix réel de Liquid** (indice retenu, pertinence, latence, échec/repli) et la voix Piper sur 20 tours. Tester les questions factuelles, négations, contre-exemples, choix de deux scènes, et la mémoire préservée.

## BONZE-057 — expérience non-Android pour mesurer Liquid
- [x] Ajouter au comparateur Linux llama.cpp le mode `C1`, 11 cas français de sélection parmi quatre propositions avec réponse attendue et résultat brut.
- [x] Calculer la validité stricte des indices, choix attendus, échecs individuels et temps total Linux ; test du calcul avec faux échantillons réussi ([41356507988](https://github.com/greenpower2669/Bonze-AI/actions/runs/41356507988)).
- [ ] **P0** Exécuter sur GitHub Actions les deux modèles Liquid Q4 un à un ; conserver les JSONL bruts, rapport, temps et erreurs ; ne conclure qu'après avoir vérifié l'exécution et les artefacts.
- [ ] **P0** Revoir les 11 cas avec un humain, étendre à 50–100 demandes dont compositions ambiguës, négations, séquences de 20 tours, émotions et états réels, comparer pertinence avec et sans Liquid. Échantillon de 11 cas = exploratoire uniquement.
- [ ] **P1** Étudier la suite optimale PC/Linux, PWA ou Android seulement après mesures réelles de qualité, latence, RAM, consommation et voix. Ne pas abandonner le code Android et ne pas modifier main sans autorisation.

## BONZE-058 — diagnostic du biais de position et permutation équilibrée (01/11/2026)
- [x] Réaliser le premier test **réel** Linux CPU des Liquid 230M et 1.2B ; conserver les JSONL et le rapport exact (run 41356604833). Résultats bruts : 230M 1/11, 1.2B 3/11 choix attendus, forte dépendance au numéro 3 ou 0.
- [x] Implémenter C2 : 11 cas × quatre permutations, consigne neutre sans réponse de secours « 0 », décodage glouton ; scorer indices valides, bonnes décisions, histogramme de positions, latences. Tests Node du rapport verts (41357123296).
- [x] Exécuter les 44 rotations C2 sur chaque Liquid et inspecter les JSONL ([41357231288](https://github.com/greenpower2669/Bonze-AI/actions/runs/41357231288)) : 230M 11/44, 1.2B 16/44, **indices fortement biaisés par leur position**. Pas de performance démontrée au-delà d'une référence aléatoire de 25 % dans ces onze contextes.
- [ ] Ne modifier la politique d'inférence Android que si l'expérience établit un gain vérifiable. Si Liquid reste biaisé, conserver les filtres sémantiques déterministes et tester un autre arbitre léger ou un score local qui évite la génération de numéros.

### Après BONZE-058 — priorité qualité avant plateforme
- [ ] Tester une méthode **non générative** d'arbitrage : règles lexicales et sémantiques déterministes comme référence, puis classifieur compact ou représentations vectorielles si un vrai gain mesuré se manifeste. Ne pas remplacer la mémoire ou ouvrir le coffre automatiquement.
- [ ] Construire 50–100 situations françaises annotées avec familles sémantiques, variations de sujets, contextes multi-tours et refus du hors-sujet ; évaluer précision, répétitions et latence hors Android.
- [ ] Préserver Android en état de fonctionnement, ne promouvoir aucun modèle 1.2B dans l'APK sans démonstration de pertinence et coût RAM/temps compatibles ; aucun merge main ni Release sans accord.

## BONZE-059 — arbitre lexical sans génération, démonstrateur Linux (02/11/2026)
- [x] Écrire un arbitre expérimental déterministe sans GGUF, qui classe quatre réponses selon sujet, contexte et quelques règles de sûreté, avec abstention sur égalité ou manque de preuve. Aucun changement du code Android.
- [x] Construire 99 demandes françaises distinctes, annotées par le projet, les faire passer dans les 4 positions (396 décisions corrélées), tests Node et CI [41361579786](https://github.com/greenpower2669/Bonze-AI/actions/runs/41361579786) réussis.
- [x] Mesures : 368 choix corrects, 20 abstentions, 8 erreurs ; vérifier les cas qui échouent plutôt que masquer les erreurs dans un score global. Résultats [GitHub Actions 13105716755](https://github.com/greenpower2669/Bonze-AI/actions/runs/41361579786/artifacts/13105716755).
- [ ] **P0** Faire annoter par un évaluateur humain **indépendant et à l'aveugle** un jeu de demandes inédites, y compris formulations hors lexique, ironie, contradictions, histoire à suivre et questions factuelles. Séparer réglage et évaluation pour éviter le surajustement.
- [ ] **P0** Auditer les 8 erreurs de définition et les 20 abstentions (peur, humour, négations) sur un **jeu de développement distinct**, puis revérifier sur des exemples jamais vus. Ne jamais simplement ajuster des règles aux cas du test final.
- [ ] **P1** Ajouter comparaison de coût RAM/CPU et de robustesse conversationnelle à 20 tours, éventuel arbitre à embeddings/classes spécialisé ; décider Linux/PWA/Android après résultats réels, sans toucher à la Release ni à main.

## BONZE-060 — stress figé des formulations françaises (02/11/2026)
- [x] Préparer un **banc stress distinct** de 50 énoncés français avec références explicites, dont 13 demandent l'abstention ; quatre permutations chacun. Ne pas modifier le moteur pendant la mesure initiale.
- [x] Exécuter le nouveau banc en CI et garder les erreurs, abstentions, catégories et fichiers bruts : 140/200 (70 %), 56 abstentions évitables, 4 erreurs; [run 41403169429](https://github.com/greenpower2669/Bonze-AI/actions/runs/41403169429), [artefact](https://github.com/greenpower2669/Bonze-AI/actions/runs/41403169429/artifacts/13121619383).
- [ ] **P0 Sécurité** : ajouter un détecteur **indépendant du classement des phrases** pour les messages de danger immédiat ou d'automutilation, avec réponses prévalidées locales et priorité sur jeux, émotions et anti-répétition. Ne pas prétendre couvrir toutes les formulations ni installer sur Android avant audit.
- [ ] **P0 Compréhension des priorités** : distinguer les clauses refusées (« pas de pirate »), la préférence explicite (« plutôt robot »), la négation émotionnelle et le souhait de changer de sujet. Tester sur un *nouveau* ensemble de développement, puis validation humaine aveugle.
- [ ] **P0** Disjoindre les questions de définition des confessions d'émotion ; tester questions identitaires et calculs sans halluciner. Journaliser fausses abstentions, erreurs et indices; les 15 cas BONZE-060 sont maintenant diagnostiques, non un test vierge après modification.
- [ ] **P1** Evaluer avec un intervenant externe, sur conversations réelles de 20 tours et langage libre, la généralisation, la sûreté, la latence CPU/RAM et Piper. Conserver Android, ne fusionner ni publier sans accord.

## BONZE-061 — routeur de priorité de sécurité expérimental (02/11/2026)
- [x] Créer un détecteur d'urgence **séparé de l'arbitre lexical** avec réponses prudentes rédigées et priorité sur négations implicites ; aucun modèle supplémentaire, stockage ni connexion réseau.
- [x] Tests Node du module d'expérience (danger direct, détresse, citation de définition, négations, danger dans une clause tardive) réussis : [41403737605](https://github.com/greenpower2669/Bonze-AI/actions/runs/41403737605), commit `3d4a9f3b`.
- [ ] **P0** Auditer les protections déjà existantes dans la conversation Android avant d'y incorporer un nouveau routeur, afin d'éviter les régressions sur urgence, Stop, écran verrouillé et accessibilité.
- [ ] **P0** Étendre avec des énoncés indépendants annotés en aveugle (surtout danger, négations imbriquées, citations, erreurs de transcription vocale, français oral, anglais) et obtenir revue humaine des réponses fixes. Aucune garantie clinique par quelques tests unitaires.
- [ ] **P0** Séparer complètement le garde-fou sécurité du classement des phrases et des interruptions, avec trace de priorité et zéro conservation de texte sensible ; aucune Release sans vérification concrète sur téléphone.

## BONZE-062 — priorités, refus et changements de sujet (02/11/2026)
- [x] Implémenter un **prototype optionnel**, hors Android, reconnaissant le sujet explicitement demandé, les refus et les changements de priorité (« mais », « plutôt »). Ne pas sélectionner une phrase sur un sujet interdit ; s'abstenir quand plusieurs sujets incompatibles ou inconnus sont demandés.
- [x] Vérifier 16 scénarios propres à BONZE-062 avec 4 rotations (64/64 sorties attendues, y compris abstentions et handoffs), et vérifier que les demandes sans directive restent confiées au classement historique.
- [x] Rejouer le banc BONZE-060 de 50 demandes : **140→148/200** indices stricts attendus, contrastes **20→36/40**, 12 transferts d'urgence séparés ; [CI 41469956836](https://github.com/greenpower2669/Bonze-AI/actions/runs/41469956836), [mesures brutes](https://github.com/greenpower2669/Bonze-AI/actions/runs/41469956836/artifacts/13153214986).
- [ ] **P0** Vérifier par **évaluateurs indépendants** sur nouveaux énoncés l'extraction réelle des sujets préférés/refusés, les phrases portant plusieurs sujets, les négations complexes et la différence entre changement de thème et affirmation d'émotion. Les jeux 060/062 sont maintenant des tests de développement.
- [ ] **P0** Tester les phrases de danger implicite et affirmations rapportées séparément du classifieur, sans affirmer que le prototype est suffisamment sûr. Ne pas connecter aux réponses de crise Android sans revue des gardes-fous existants et de l'expérience utilisateur.
- [ ] **P1** Mesurer la conversation réelle sur 20 tours, mémoire de contexte, voix Piper, interruption immédiate et coûts CPU/RAM. Conserver le code et l'APK publiée ; aucun merge main ni nouvelle Release sans validation.

## BONZE-063 — prospective auto-étiqueté et propagation des erreurs (02/11/2026)
- [x] Préparer 32 formulations nouvelles + 2 histoires de 20 tours, 4 permutations, comparer arbitres et deux modes de contexte : [run 41489978787](https://github.com/greenpower2669/Bonze-AI/actions/runs/41489978787). 52/128 sur demandes isolées avec préférences ; passage de 156/160 contexte parfait à 140/160 en contexte auto-alimenté.
- [ ] **P0 Sécurité** : analyser les 4 faux négatifs d'une expression indirecte d'automutilation et les 4 faux positifs sur une citation de roman ; faire revoir les règles et réponses fixes par un humain. Ne brancher aucun mécanisme expérimental aux alertes Android.
- [ ] **P0** Obtenir un ensemble véritablement inédit, non rédigé ni annoté par le concepteur du code, incluant ambiguïtés et erreurs de transcription, et mettre en place des critères indépendants de précision/abstention.

## BONZE-064 — ancre symbolique de sujet hors Android (02/11/2026)
- [x] Tester une **ancre symbolique du thème** qui n'est pas écrasée par les réponses produites : [run 41490598696](https://github.com/greenpower2669/Bonze-AI/actions/runs/41490598696), 160/160 choix corrects sur les scripts déjà connus de BONZE-063 ; huit rejeux parfaits, sans démonstration de généralisation.
- [ ] **P0** Étendre à un jeu indépendant de conversations spontanées avec rappels de personnes, temporalité, faits et préférences ; l'ancre ne remplace pas la mémoire conversationnelle, doit rester séparée des tiroirs chiffrés.
- [ ] **P1** Examiner les coûts CPU/RAM et la latence sur Samsung, vérifier voix Piper et interruptions ; conserver Android et la Release existante. Ne pas intégrer cette expérimentation sans autorisation et validation sur appareil.

## BONZE-065 — nouveau banc narratif et diagnostic de sécurité (02/11/2026)
- [x] Geler **3 nouveaux récits de 20 tours**, chacun avec distracteurs de même sujet, et **30 formulations de sécurité** distinctes ; préserver les sources BONZE-061/062/064.
- [x] Exécuter le banc expérimental et archiver toutes les décisions, erreurs et réserves : [run 41494784678](https://github.com/greenpower2669/Bonze-AI/actions/runs/41494784678), [artefact](https://github.com/greenpower2669/Bonze-AI/actions/runs/41494784678/artifacts/13166236398). Ancre de sujet : 220/240 bonnes étiquettes, mais 112/240 bonnes suites ; réponse auto-contextualisée 140/240. Ne pas assimiler les rotations à des exemples indépendants.
- [ ] **P0 Narration** : concevoir **BONZE-066** comme séparation du thème choisi par l'utilisateur et du **dernier événement effectivement prononcé par Bonze**, avec confirmation explicite de livraison et provenance de l'événement, aucun stockage durable de texte privé. Le module suggéré n'a pas pu être créé (contrôle d'outil) et reste à réaliser ; ne pas modifier `core/topic-anchor.js` avant tests de non-régression.
- [ ] **P0 Langage** : élargir les tests des pivots narratifs, notamment « Reprenons l'histoire de notre dragon » (20 mauvais thèmes sur quatre rotations) ; évaluer sur des cas jamais utilisés pour régler le code.
- [ ] **P0 Sécurité** : revue humaine des 7 formulations indirectes + 3 discordances explicites ; distinguer citation, récit fictif, détresse implicite et urgence réelle. Aucune certification clinique ni activation Android de BONZE-061.
- [ ] **P1** Comparaison indépendante et multilingue sur au moins 20 tours spontanés, faits/événements/temporalité, voix et coût RAM/CPU Samsung. Ne publier aucune APK sans validation explicite.

## BONZE-066 — mémoire narrative en deux canaux (02/11/2026)
- [x] Ajouter `core/scene-anchor.js` avec **deux canaux distincts** : catégorie de sujet maintenue par l'utilisateur et dernière phrase de fiction effectivement acquittée, sans écriture persistante ni remise au modèle comme fait vérifié. Refuser les acquittements d'anciennes propositions, vider la scène au changement de sujet, à l'interruption et à la réinitialisation, conserver des reçus monotones.
- [x] Ajouter tests et workflow BONZE-066 ; exécution [41501094199](https://github.com/greenpower2669/Bonze-AI/actions/runs/41501094199) réussie, [données](https://github.com/greenpower2669/Bonze-AI/actions/runs/41501094199/artifacts/13167379693). Sur 240 décisions corrélées du banc BONZE-065 **déjà connu** : **112→132 bons indices**, abstentions **120→96**, mais erreurs de choix **8→12**, aucune session parfaite. Ne pas afficher cela comme preuve de généralisation.
- [ ] **P0** Remédier aux quatre erreurs supplémentaires de classement sans surajuster le banc connu ; concevoir un vrai évaluateur de contradiction entre événement retenu et suite candidate, avec abstention prudente. Faire tester à l'aveugle des histoires entièrement nouvelles par une personne indépendante.
- [ ] **P0** Établir une provenance narrative structurée : événement délivré vs proposé, corrections, personnages/objets, faits d'histoire vs faits vérifiés sur l'utilisateur. Ne pas recopier la mémoire de scène dans les tiroirs persistants sans consentement et règles de sécurité.
- [ ] **P1** Étudier l'intégration Android seulement après audit du cycle de livraison réelle (texte affiché, TTS Piper terminé ou interrompu, TalkBack, Stop, verrouillage), isolation des sessions et mesure CPU/RAM ; aucun changement de la Release ni fusion `main` sans accord.
