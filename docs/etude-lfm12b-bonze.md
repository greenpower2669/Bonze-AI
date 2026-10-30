# Étude préalable BONZE — LFM2.5-230M vs LFM2.5-1.2B-Instruct (30 octobre 2026)

**Statut : repérage documentaire, pas un benchmark ni une intégration Android.** Aucune conclusion de performance Samsung, de qualité française ou de chauffe ne peut être tirée des tailles de fichiers.

| Variante officielle Liquid AI | Poids GGUF Q4_K_M | SHA-256 du fichier officiel | Licence |
| --- | ---: | --- | --- |
| LFM2.5-230M-GGUF | 153 MB | `7bbd90384d3deffe4c646ec9643b212802d32d4ce417c90a1ec9282100650062` | LFM Open License 1.0 |
| LFM2.5-1.2B-Instruct-GGUF | 731 MB | `b1b3de114215d9507409a662a501a631095a479a419584e8a2ded6304b19b4f5` | LFM Open License 1.0 |

Sources officielles :
- https://huggingface.co/LiquidAI/LFM2.5-230M-GGUF/blob/main/LFM2.5-230M-Q4_K_M.gguf
- https://huggingface.co/LiquidAI/LFM2.5-1.2B-Instruct-GGUF/blob/main/LFM2.5-1.2B-Instruct-Q4_K_M.gguf
- https://huggingface.co/LiquidAI/LFM2.5-1.2B-Instruct-GGUF/blob/main/LICENSE
- https://huggingface.co/LiquidAI/LFM2.5-230M/blob/main/README.md
- https://github.com/ffmpegkit-maintained/llama-android/blob/main/README.md

Écart de fichier : +578 MB, soit environ 4,8 fois le GGUF 230M. Il ne s'agit **pas** de PSS, RAM effective, cache KV, mémoire audio Piper ou pic de chargement. Le chiffre affiché par les fiches varie selon convention MB/MiB ; conserver les octets exacts des téléchargements.

Le texte de licence LFM1.0 autorise la distribution selon obligations de licence/notices et prévoit une limite de droits commerciaux au seuil de revenus annuels 10 millions USD (entité juridique comprise). **Ne pas qualifier ces poids de MIT/Apache sans réserve.** Vérification juridique adaptée en cas de distribution commerciale.

Liquid AI indique que le 230M est adapté à l'extraction/agents simples et **non recommandé pour l'écriture créative**. Cela justifie un essai du 1.2B, pas une promesse de meilleure conversation. Le GGUF officiel est annoncé compatible avec llama.cpp mais le binaire exact et l'AAR Android actuel doivent être testés.

L'AAR Android 0.1.1 offre `Llama.complete(model, prompt, systemPrompt)` mais pas de liste de messages multi-rôles documentée. Le 1.2B et le 230M utilisent un template de chat ; étudier un transport fidèle des rôles, sans bricoler des tokens spéciaux dans un message utilisateur.

## Expérience requise avant toute adoption

1. Télécharger/vérifier le Q4_K_M par SHA-256 dans un build d'étude reproductible ; conserver la licence et les notices.
2. Vérifier chargement, chat template, tokenizer, stop/EOS et sorties françaises avec le même llama.cpp/AAR que Bonze.
3. Mesurer séparément le 230M et le 1.2B sur les mêmes scénarios de `docs/bench-dialogue-fr-bonze031.md` avec contexte identique, sorties et paramètres conservés.
4. Tester sur Samsung : charge à froid/chaud, PSS, mémoire système libre, pic, temps premier jeton, débit, échauffement, Piper simultané, Stop et déchargement. **Jamais deux gros modèles simultanément.**
5. Ne pas embarquer les deux poids par défaut dans une mise à jour ordinaire sans arbitrage sur l'espace, le temps d'installation et la stabilité. Prévoir builds d'essai et secours au 230M selon mesures.
6. Ne pas modifier l'identifiant Android, la signature, les données `.bonze` ni les permissions réseau.

**Décision ouverte à Fab :** choisir le modèle après comparaison réelle ; aucune version ou Release autorisée par cette seule étude.
