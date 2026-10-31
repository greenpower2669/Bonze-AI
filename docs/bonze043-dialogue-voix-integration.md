# BONZE-043 — réconciliation dialogue, répertoire et voix (31 octobre 2026)

Branche canonique de cette expérimentation : `feature/bonze042-field-fixes`.
Base : BONZE-041, qui a déjà intégré les modules issus du répertoire BONZE-032/034/037, les mémoires SVC de BONZE-039 et les contrôles audio de BONZE-040. Les branches historiques restent conservées ; aucune fusion vers `main`.

## Problème réellement constaté
L'APK Bonze 0.8.0-dev distribué en artefact GitHub Actions provenait du commit `cd17a6bfd8ac07fd80cabf32c2ca989b900690be`. Le corpus de 18 000 formulations y était *emballé*, mais la génération libre Liquid était prioritaire et le répertoire ne servait qu'en secours. Les réponses hors sujet non rejetées pouvaient donc parvenir à la voix. Les corrections ultérieures de BONZE-042 n'étaient pas présentes dans cet APK.

Les 18 000 formulations sont des compositions de **200 noyaux × 10 formes × neuf rôles** (huit tendances et le sage), et non 18 000 intentions ou répliques écrites indépendamment. Le répertoire est construit à la demande, et ne consomme pas 18 000 chaînes permanentes en RAM.

## Chaîne native expérimentale corrigée
1. Texte/STT local → garde des sujets sensibles et scène existante.
2. Liquid LFM2.5-230M ou 1.2B déjà installé, **un seul modèle en RAM**, sollicité pour fournir une **étiquette d'intention**, pas le texte à prononcer ; `IntentClassify` n'admet qu'une des 20 catégories prédéfinies.
3. Si le modèle est indisponible, occupé ou incohérent, l'analyse lexicale locale détermine l'intention. Les règles d'urgence, de négation et de correction restent prioritaires à l'étiquette neuronale.
4. `ScriptedDialogue` sélectionne la réplique via les rôles/états affectifs existants, avec au plus huit tirages si une réponse ressemble à un ancien message de Bonze ou répète inutilement l'utilisateur.
5. Lorsque Piper est choisi, le répertoire privilégie des formulations suffisamment longues ; si Piper échoue malgré cela, l'erreur devient visible dans l'état et le journal. **La voix Android ne remplace plus Piper en silence.** Une voix Android reste sélectionnable manuellement.
6. La réplique choisie est conservée dans l'historique natif ; sauvegardes `.bonze`, mémoire privée et identités de l'application restent inchangées.

## Limites et validation requise
Cette architecture augmente la diversité contrôlable mais **ne fournit pas 18 000 réponses factuelles spécifiques**. La classification Liquid et les mécanismes lexicaux peuvent mal comprendre certaines phrases. Les nombres, mots inconnus et séquences phonétiques courtes restent susceptibles de faire échouer Piper : l'utilisateur est averti, sans substitution vocale non choisie.

Vérifier en CI les régressions Node/Java, la compilation Kotlin/Java, l'audit des 18 000 textes contre le lexique Piper et le navigateur hors ligne ; puis essayer sur Samsung : critique « naze », question précise, relance « et après », 20 tours sans répétition, jeu de rôle, noms et nombres, voix Piper choisie, casque/veille/Stop, latence, mémoire/sauvegardes. Les tests automatisés **ne prouvent pas** l'intonation, la pertinence réelle de Liquid ou la lecture audio sur le téléphone.

**Livraison :** ne publier ni Release ni fusion `main` sans accord explicite. Une prochaine version de test devra être signée, inspectée et mise à disposition sous forme d'un **.apk direct sur GitHub Releases, jamais ZIP utilisateur**. Le 403 de publication de la 0.8 est un incident distinct du problème de branches ; il reste ouvert et doit être traité sans nouvelles relances identiques.

**Avenant BONZE-044** : le prototype classificateur seul a été complété par une étape supplémentaire en mode précis. Liquid reçoit une phrase **déjà rédigée**, plus quatre alternatives maximum rédigées par notre lexique français fermé, et ne renvoie que le **numéro de variante**. Le code Java reconstruit la réponse et invalide les sorties non conformes ; aucun texte généré librement n'est prononcé. Le choix explicite Piper est enregistré même si Android TTS n'est pas prêt. Voir `bonze044-liquid-synonymes.md`.
