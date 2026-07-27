# Tirely — APK Android compilé automatiquement par GitHub

Tu pousses ton code, GitHub compile l'APK, tu le télécharges depuis ton téléphone.
Aucun logiciel à installer sur ton ordinateur. Pas d'Android Studio, pas de SDK.

---

## Ce qu'il y a dans ce dossier

| Fichier | Rôle |
|---|---|
| `www/` | Ton application (déjà rendue 100 % hors ligne) |
| `resources/` | Icône et splash screen sources, en 1024 et 2732 px |
| `package.json` | Les dépendances Capacitor |
| `capacitor.config.json` | Nom de l'app, identifiant, splash screen |
| `.github/workflows/build-apk.yml` | La recette de compilation |
| `.gitignore` | Empêche d'envoyer `node_modules/` et `android/` |

`android/` et `node_modules/` ne sont **pas** versionnés : ils sont régénérés à
chaque compilation. C'est voulu, ça garde le dépôt léger et évite les conflits.

---

## Étape 1 — Créer le dépôt

1. Sur GitHub : bouton **+** en haut à droite → **New repository**.
2. Nom : `tirely`. **Private** si tu veux (ça fonctionne pareil).
3. Ne cocher **aucune** case d'initialisation (pas de README, pas de .gitignore).
4. **Create repository**.

## Étape 2 — Envoyer les fichiers

Le plus simple, sans ligne de commande : sur la page du dépôt vide, clique
**uploading an existing file**, puis glisse **le contenu** du dossier
(pas le dossier lui-même) dans la zone.

⚠️ **Piège important :** l'interface web de GitHub ne prend pas les dossiers
commençant par un point. Le dossier `.github` risque d'être ignoré silencieusement.
Deux solutions :

- **Soit** tu crées le fichier à la main : bouton **Add file → Create new file**,
  et dans le champ du nom tu tapes exactement
  `.github/workflows/build-apk.yml`
  (les `/` créent les dossiers automatiquement), puis tu colles le contenu du
  fichier fourni.
- **Soit** tu utilises Git en ligne de commande :

```bash
cd tirely-repo
git init
git add -A
git commit -m "Tirely hors ligne"
git branch -M main
git remote add origin https://github.com/TON-PSEUDO/tirely.git
git push -u origin main
```

## Étape 3 — La compilation démarre toute seule

Va dans l'onglet **Actions**. Tu verras « Construire l'APK Tirely » en cours.
Compte **5 à 8 minutes** pour le premier build (téléchargement de Gradle et du
SDK), puis 3 à 4 minutes les fois suivantes.

Si tu veux relancer sans rien modifier : **Actions** → le workflow à gauche →
bouton **Run workflow**.

## Étape 4 — Récupérer l'APK sur ton téléphone

Va dans l'onglet **Releases** (colonne de droite de la page d'accueil du dépôt).
Chaque compilation y crée une version `v1`, `v2`, etc. avec le fichier
`Tirely-v1.apk` en pièce jointe.

**Depuis ton téléphone, ouvre le lien de la Release et appuie sur le `.apk`.**
C'est la bonne méthode : lien direct, rien à décompresser.

> Il existe aussi une copie dans l'onglet **Actions** (section « Artifacts »),
> mais elle arrive en `.zip` et demande d'être connecté à GitHub — moins pratique
> sur mobile. Sers-t'en seulement comme secours.

Android va afficher un avertissement et demander d'autoriser l'installation
d'applications depuis cette source. C'est normal pour tout APK hors Play Store :
tu acceptes, et l'app s'installe.

---

## Mettre à jour l'app plus tard

Tu modifies un fichier dans `www/`, tu pousses, une nouvelle Release apparaît.
Tu installes le nouvel APK par-dessus l'ancien : **tes données sont conservées**
(même identifiant d'application, même signature).

En revanche, si tu **désinstalles** l'app, tout est effacé. Pense à utiliser les
boutons Exporter / Importer de tes Réglages de temps en temps.

---

## Points techniques, si tu es curieux

- **APK de debug.** Il est signé avec la clé de debug d'Android, donc installable
  immédiatement sans que tu aies à gérer un keystore. Parfait pour un usage
  personnel. Le seul inconvénient : impossible de le publier sur le Play Store —
  ce qui n'est pas ton objectif.
- **Capacitor sert les fichiers via `https://localhost`**, pas via `file://`.
  C'est nettement plus fiable : `localStorage` fonctionne de façon garantie, ce
  qui n'est pas toujours le cas en `file://` selon les versions de WebView.
- **Le service worker a été retiré** de cette version. Il ne servait à rien ici
  (tout est déjà embarqué dans l'app) et il aurait pu te servir une ancienne
  version en cache après une mise à jour. Il reste présent dans la version ZIP
  si tu veux installer Tirely en PWA un jour.
- **Versions verrouillées :** Capacitor 8.4.2, Node 22, Java 21, compileSdk 36.
  Elles sont figées dans `package.json` et le workflow pour qu'un build qui
  fonctionne aujourd'hui fonctionne encore dans six mois.
- **`minSdkVersion` 24** = Android 7.0 minimum.

## Ce qui a été vérifié, et ce qui ne l'a pas été

Testé pour de vrai, dans un Chromium (le même moteur que le WebView Android),
avec tout accès réseau extérieur bloqué, sur les fichiers réellement embarqués
dans `android/app/src/main/assets/public/` :

- onboarding : 266 nœuds rendus — app principale : 392 nœuds
- React et ReactDOM chargés depuis `vendor/`, police Open Sans active
- routage 1er lancement → onboarding, 2e lancement → app
- **zéro** requête vers l'extérieur, **zéro** erreur JavaScript

Les étapes `npm install`, `cap add android`, `capacitor-assets generate` et
`cap sync` ont été exécutées réellement et fonctionnent.

Ce que je n'ai **pas** pu exécuter : le `gradlew assembleDebug` final, qui exige
le SDK Android et un accès aux serveurs Google. C'est justement le travail que
GitHub Actions fait pour toi. Si une étape devait coincer, ce serait celle-là :
dans ce cas, ouvre le log dans l'onglet Actions et envoie-moi le message d'erreur.
