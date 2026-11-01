# Bonze AI — TODO actif après audit du 01/11/2026
_État de référence : `feature/bonze042-field-fixes` HEAD `5fde323c`. Éléments historiques cochés et toutes les preuves conservés dans `docs/memory-archives/2026-11-01-pre-audit/todo.md`._

## P0 — Bloquants d'acceptation
- [ ] **Dialogue pertinent :** préparer un banc reproductible de 50–100 phrases françaises, incluant question spécifique, absurde, négation, correction, métalangage, prénom, chiffres, suite « et après », jeu de rôle et séquences de 20 tours. Mesurer adéquation, hors-sujet, répétition, sécurité et continuité ; comparer aux sorties du corpus et à l'intention classée.
- [ ] **Mémoire/contextualisation :** vérifier le plafond réel du contexte (300 caractères de dialogue précédent présentés au classificateur) et tester multi-tours ; définir un rappel sélectif autorisé des tiroirs SVC dans la conversation. Ne jamais ouvrir le coffre en arrière-plan ni traiter une déclaration comme un fait vérifié.
- [ ] **Piper sur Samsung :** tester un vrai APK, casque Bluetooth, silence, nombres 0–9 999, `15h30`/horaires, OOV, nom propre, cinq phrases consécutives, Stop en synthèse/lecture et réveil après mise en veille. Relever codes d'erreur et latence avant première syllabe.
- [ ] **Performance :** mesurer PSS/CPU/mémoire de pic et latences Liquid 230M, seconde sélection de synonyme, génération complète PCM Piper et basculement optionnel 1.2B ; un seul GGUF lourd en RAM.
- [ ] **Publication :** résoudre sans contournement le 403 de GitHub Release sur version 0.8, valider droit `Workflows: write` si nécessaire et publier **uniquement avec validation explicite de Fab**, APK direct .apk vérifié, jamais ZIP.

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
- [x] Architecture répertoire prioritaire BONZE-044, 20 intentions, 18 000 compositions virtuelles, 21 paires de synonymes, règles audio numérales/horaires ajoutées sur branche.
- [x] Tests `Bonze AI tests` du HEAD `5fde323c` : [41244426748](https://github.com/greenpower2669/Bonze-AI/actions/runs/41244426748) et [41244422050](https://github.com/greenpower2669/Bonze-AI/actions/runs/41244422050) réussis.
- [x] Packaging complet/lint/signature du SHA antérieur `a0cc30ad` : [41243984444](https://github.com/greenpower2669/Bonze-AI/actions/runs/41243984444) réussi ; ne démontre pas l'écoute sur appareil.
- [x] GitHub Release [0.7.0-dev](https://github.com/greenpower2669/Bonze-AI/releases/tag/bonze-ai-v0.7.0-dev) possède un asset APK direct ; 0.8 **pas publié**.

**Règle de clôture :** cocher uniquement après test/proof et indiquer commit, appareil, logs, résultats, limites dans `debughistorical.md`. Aucun merge `main` ni Release sans autorisation explicite.
