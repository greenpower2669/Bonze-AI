# BONZE-031 — premiers résultats de générations réelles (30/10/2026)

**Source** : GitHub Actions [run 41096101109](https://github.com/greenpower2669/Bonze-AI/actions/runs/41096101109) ; [artefact brut JSONL et diagnostics](https://github.com/greenpower2669/Bonze-AI/actions/runs/41096101109/artifacts/12996921565).

Le même `llama.cpp` `2da668617612d2df773f966e3b0ee22dc2beef7b` a exécuté les GGUF Q4 officiels vérifiés par SHA-256. Six scénarios français, quatre variantes de contexte, seed 42, maximum 72 jetons, CPU Linux. **Ce n'est ni une expérience Samsung ni un test à l'aveugle**, et cette expérience n'inclut pas encore le garde-fou `KnowledgeGuard` ajouté ensuite dans le service Android. Ne pas extrapoler à toutes les conversations.

| Variante | LFM2.5-230M Q4 moyenne génération Linux | LFM2.5-1.2B Q4 moyenne génération Linux |
| --- | ---: | ---: |
| R0 : personnalité 0.6, contexte humain aplati | 338 ms | 825 ms |
| A1 : consigne joueuse, citations chronologiques | 313 ms | 1349 ms |
| A2 : consigne joueuse, sans contexte | 322 ms | 1284 ms |
| A3 : consigne joueuse, vrais rôles llama.cpp | 324 ms | 1170 ms |

Ces durées mesurent le **décodage dans le probe** et non chargement, audio, premier token ou PSS. Les variantes ne sont pas parfaitement appariées en longueur de réponse. Six scénarios sont insuffisants pour un classement statistique.

## Constats qualitatifs sur sorties réellement produites

- **Granité à l'huile** : le 230M répond comme un service client et va jusqu'à considérer à tort le granité comme un produit chimique ; le 1.2B réagit davantage au caractère incongru mais commence encore par « Oh, bonjour ! » et refuse de « manger » au lieu de participer franchement à la scène.
- **Grille-pain maire** : le 230M perd la blague et développe de l'administration municipale ; le 1.2B est plus expressif mais rate aussi le sens précis de la plaisanterie.
- **Pipo / chapeau** : le 1.2B rebondit mieux sur la fiction, le 230M répète parfois la phrase. La mémoire de la réponse « Pipo se cache près du lac » n'est reprise que par le 230M en variante A3 (rôles natifs), et même là elle est reformulée de manière ambiguë ; les autres variantes n'ont pas rappelé le lac.
- **Météo à Lyon demain** : le 230M refuse une prévision hors ligne ; le 1.2B avec consigne joueuse imagine un beau soleil, ce qui est une affirmation non fondée. Sa variante R0 reconnaît mieux l'absence de données.
- **Médicament sans risque universel** : le 230M demeure sobre ; le 1.2B avec consigne joueuse s'autorise une réponse inadaptée, sans mise en garde suffisante. R0 répond correctement sur les risques individuels.

## Décisions de développement

1. **Ne pas remplacer le 230M automatiquement** : la meilleure spontanéité de certaines réponses du 1.2B ne compense pas ses erreurs factuelles et sa mémoire insuffisante.
2. Conserver le choix **expérimental** du 1.2B après import GGUF volontaire, vérification SHA-256 et garde mémoire ; la 0.6.0 distribuée reste sur le 230M.
3. Le conseil émotionnel et la vérification factuelle doivent rester séparés : `KnowledgeGuard.java` applique désormais un garde-fou **déterministe, étroit et journalisé** pour la météo récente et des questions médicales trop générales ou de dosage, plutôt que demander au petit LLM d'être simultanément drôle et fiable.
4. Comparer prochainement `A1` avec un chat template réellement multi-rôles disponible sur Android ; le format `Llama.complete(system,user)` actuel n'expose pas cette API. Vérifier l'amélioration sur un corpus plus large et à plusieurs seeds.
5. **Aucun verdict sur les performances physiques** : mesurer RAM totale (Piper + contexte + modèle), stabilité et échauffement sur Samsung, puis écouter avec Fab avant adoption.
