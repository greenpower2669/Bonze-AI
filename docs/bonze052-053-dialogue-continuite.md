# BONZE-052/053/054 — progression des histoires et mémoire fiable
_Travail de la branche `feature/bonze042-field-fixes`, sans publication de Release._

## Ce qui est maintenant codé
1. Le répertoire prévisualise plusieurs phrases ; les filtres anti-écho/Piper choisissent une phrase valable, et **seule celle-ci** fait avancer l'état persisté, même sur le chemin de secours.
2. Les historiques `recentForms` ne perdent plus leur dernière entrée ancienne quand un premier tirage utilise une carte historique non composée.
3. Le contexte de jeu mémorise seulement un index de thème et une progression bornée : aucun nom, phrase privée ni récit libre sauvegardé dans cet index. « Et après ? » peut reprendre le thème au lieu d'ouvrir automatiquement un nouveau sujet.
4. Onze scènes imaginaires disposent désormais de trois **étapes narratives écrites et contrôlées** pour aller plus loin qu'une simple variation grammaticale. Elles sont composées dans le répertoire local avec les personnalités existantes et conservées dans la vérification du lexique Piper.
5. Liquid reste chargé de classer l'intention et, en mode précis, de sélectionner l'indice parmi les textes validés. Aucun nouveau LLM ni génération libre d'une réplique.

## Validation et limites
- Node/test : [41343213525](https://github.com/greenpower2669/Bonze-AI/actions/runs/41343213525) vert, nouveaux tests de forme et trois suites ; le contrôle Android [41343213502](https://github.com/greenpower2669/Bonze-AI/actions/runs/41343213502) est distinct.
- BONZE-054 : les trois événements aboutissent désormais à une clôture écrite et à la remise à zéro du thème. Liquid choisit uniquement le style d'une **même étape**, ce qui évite de passer à une histoire étrangère. Les nouveaux chapitres interactifs au-delà de cette clôture restent un développement futur.
- La qualité sur le **vrai Liquid 230M**, la voix Piper et le téléphone Samsung ne sont pas encore mesurées. Le catalogue reste majoritairement composé de 200 noyaux, donc une question hors corpus reste limitée.
- Aucune fusion dans `main`, aucune nouvelle GitHub Release sans accord explicite ; APK de contrôle expérimental seulement.

## Incident de validation BONZE-054
Une première clôture dépassait le budget vocal de 220 caractères dans certains rôles émotionnels, détectée par la CI Piper et non par le test initial. La clôture a été raccourcie et le contrôle de longueur renforcé dans le commit `ecf253ce`. Le package physique, l'écoute et la qualité réelle de la reconstruction restent à éprouver sur Android.
