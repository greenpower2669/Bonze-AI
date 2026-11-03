
# BONZE-044 — Liquid comme instrument de variation, pas comme auteur

Décision explicite de Fab du 31/10/2026. Branche de référence unique : `feature/bonze042-field-fixes`.

**Invariants :** au moins 2 000 compositions virtuelles par rôle (neuf rôles et donc 18 000 formes actuelles) ; répertoire local auteur de la phrase prononcée. Liquid sert au repérage de motifs et à la sélection de synonymes, **jamais à la génération libre de la réplique**. La compréhension et la continuité restent une mission distincte : la variété des tournures n'est pas un savoir encyclopédique.

Chaîne Android : transcription locale ou clavier → mémoire antérieure et garde factuel restreint → classification Liquid par 20 étiquettes fermées (secours lexical) → répertoire émotionnel, 8 tirages maximum et filtre des huit dernières réponses → candidat écrit → **synonymes contrôlés** → évaluation de qualité → Piper sélectionné ou voix Android expressément choisie.

**Synonymes 044 — première tranche :** uniquement quatre paires lexicales réversibles : `doucement/tranquillement`, `regarder/observer`, `continuer/poursuivre`, `réellement/vraiment`. En mode précis et seulement si au moins une correspondance est présente, Liquid 230M ou 1.2B déjà sélectionné choisit un **indice numérique** parmi 0 (inchangé) et 1–4 (variantes écrites préalablement). `SynonymChoice.pick()` reconstruit la phrase uniquement à partir de variantes autorisées ; texte libre ou index invalide du modèle => phrase initiale. Si le contrôle anti-répétition invalide la variation, on revient à la phrase initiale. En modes éco/léger, aucune seconde inférence. Le modèle reste partagé, jamais deux GGUF simultanément.

**Portée réelle :** ceci est une première validation d'architecture, pas une banque complète de synonymes. De nombreuses phrases resteront inchangées. Le coût d'une seconde inférence en mode précis doit être mesuré ; réduire ou supprimer ce passage si la fluidité vocale se dégrade. Élargir ultérieurement les substitutions après revue du sens, accord grammatical, négation et lexique Piper ; ne pas inventer silencieusement de faits.

**Voix :** sélection `piper-mls` enregistrée sans attendre que `TextToSpeech` Android s'initialise. Ne pas basculer automatiquement en synthèse vocale Android si Piper échoue. Les échecs par OOV, nombres, phonèmes trop courts, silence ou pression mémoire et la latence de synthèse restent à tester sur le Samsung réel.

Tests : `tests/SynonymChoiceTest.java`, `tests/ReplyQualityTest.java`, tests de répertoire 18k, audit lexique Piper, compilation Android et Playwright via GitHub Actions. Les résultats CI ne remplacent pas 20 tours réels, les observations de Fab et un `.apk` autonome publié comme asset GitHub Release. **Aucune fusion main ou Release sans validation explicite**.
