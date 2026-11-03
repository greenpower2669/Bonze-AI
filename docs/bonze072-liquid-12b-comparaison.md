# BONZE-072 — essai comparatif Android : Liquid 230M vs 1,2B génératif

## Pourquoi cet essai

Fab a testé la conversation normale de **Bonze Lab 070**, puis signalé que Bonze « ne comprend rien ». L'audit du flux Android a révélé une limite importante : la version précédente chargeait le Liquid 230M surtout pour **classifier une intention et choisir une réplique préparée**, puis ses composants narratifs BONZE-066–070 n'étaient présents que dans le laboratoire visuel. Tester une version 1,2B **sans modifier ce circuit** ne permettrait pas de mesurer l'intérêt d'un modèle linguistique plus capable.

Cette mission teste donc, dans une **APK séparée**, une véritable génération locale de réponses par **LFM2.5-1.2B-Instruct Q4_K_M**. Le moteur Liquid 230M et l'ancienne logique restent sélectionnables dans Options comme **référence témoin**. Ce n'est pas un nouveau modèle d'émotions, ni une intégration de la mémoire narrative de fiction dans la mémoire personnelle.

## Architecture de test

- Identité Android indépendante : `fr.bonzeai.companion.lab12b` ; nom **Bonze Liquid 1.2B**, version `0.8.2-lab12b`, code 10, signature debug de test. Bonze AI principal et **Bonze Lab 070** restent intacts, sans partage de données d'application.
- Le fichier `LFM2.5-1.2B-Instruct-Q4_K_M.gguf` est **embarqué dans l'APK**, sans téléchargement manuel de l'utilisateur. Source officielle [LiquidAI sur Hugging Face](https://huggingface.co/LiquidAI/LFM2.5-1.2B-Instruct-GGUF), empreinte SHA-256 `b1b3de114215d9507409a662a501a631095a479a419584e8a2ded6304b19b4f5`. Le pipeline vérifie le hash avant packaging et embarque la [LFM Open License v1.0](https://huggingface.co/LiquidAI/LFM2.5-1.2B-Instruct-GGUF/blob/main/LICENSE).
- Lors du premier usage, `LocalModelStore.ensureBundled()` copie les poids dans le stockage **privé Android**, vérifie de nouveau le hash et valide l'installation par renommage atomique. Pour limiter les erreurs, elle réclame 850 Mo disponibles pour la copie, en plus de l'espace déjà nécessaire à l'APK. Un seul grand modèle doit être actif à la fois ; si Android signale peu de mémoire, l'application reste utilisable avec le moteur 230M.
- `BonzeInference.generateDialogue()` utilise le modèle 1,2B chargé par le moteur natif, un contexte récent plafonné à 850 caractères et un message utilisateur plafonné à 350 caractères. Réponses limitées à 120 tokens et 450 caractères, en français. Le modèle peut **rédiger du texte** au lieu de classer uniquement une intention.
- `ConversationService.reply()` conserve la priorité de `KnowledgeGuard` et du bouton Stop, les contrôles de répétitions et la voie de repli du répertoire. Les réponses natives ne sont pas acceptées si elles deviennent périmées après une interruption. Le journal technique mesure la durée et le CPU, sans afficher de faux scores de compréhension.
- L'interface `docs/app.js` sélectionne par défaut le 1,2B dans la variante dédiée mais conserve l'option 230M. Les autres applications ne changent ni de modèle par défaut ni de dialogue ; import manuel de GGUF masqué dans l'édition 1,2B.

## Limites honnêtes

La taille des poids **ne garantit pas** une bonne conversation. Le modèle 1,2B peut halluciner, échouer sur des phrases françaises, être lent sur CPU ou être interrompu par Android. L'architecture et le prompt restent courts, et la reconnaissance vocale Android/Piper n'ont pas fait l'objet de mesures sur le téléphone de Fab.

Il faut tester sur Samsung la **latence réelle**, la RAM libre, la cohérence sur plusieurs tours, les répétitions, la qualité des réponses, les interruptions Stop et la préférence entre les deux moteurs. La barrière symbolique des conversations fictives n'est pas automatiquement un garde-fou de sécurité clinique.

**Important :** jusqu'à confirmation du workflow et de la présence réelle de l'asset GitHub, aucune APK directe n'est déclarée livrée. Ne jamais inventer de lien, fournir une archive ZIP en remplacement ou supprimer la version précédente.
