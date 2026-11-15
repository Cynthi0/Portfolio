# Site Cynthia.inmotion : mise en ligne et administration

Ce dossier contient tout le site, prêt à être mis sur GitHub et publié par Cloudflare Pages.
Une fois en place, vous modifiez le site depuis **votre-site/admin**, sans toucher au code.

## Ce qu'il y a dans le dossier

| Dossier ou fichier | Rôle |
|---|---|
| `index.html` | Le site (animations, mise en page). On n'y touche plus. |
| `content/` | Tous les textes, boutons, projets et témoignages. C'est ce que l'administration modifie. |
| `media/uploads/` | Les photos et vidéos que vous ajoutez depuis l'administration. |
| `b/ t/ p/ ba/ v/` | Les médias actuels de la maquette (vidéo d'ouverture, images provisoires). |
| `admin/` | L'espace d'administration. |
| `functions/api/` | La petite brique qui vous connecte à l'administration avec votre compte GitHub. |

## Mise en ligne (une seule fois, environ 20 minutes)

### 1. Mettre le dossier sur GitHub

1. Créez un compte gratuit sur github.com si vous n'en avez pas.
2. Cliquez sur **New repository** : nom `cynthia-inmotion`, laissez **Private**, puis **Create repository**.
3. Sur la page du dépôt, cliquez sur **uploading an existing file**, glissez **tout le contenu** du dossier (pas le dossier lui-même), puis **Commit changes**.
   Astuce : GitHub Desktop (application gratuite) est plus simple si le glisser-déposer coince sur les dossiers.

### 2. Publier avec Cloudflare Pages

1. Créez un compte gratuit sur dash.cloudflare.com.
2. **Workers & Pages** → **Create** → onglet **Pages** → **Connect to Git** → choisissez le dépôt `cynthia-inmotion`.
3. Réglages de build : **Framework preset : None**, **Build command : vide**, **Build output directory : `/`**. Cliquez sur **Save and Deploy**.
4. Votre site est en ligne à une adresse du type `cynthia-inmotion.pages.dev`.
   Vous pourrez brancher votre propre nom de domaine plus tard (onglet **Custom domains**).

### 3. Autoriser la connexion à l'administration

1. Sur GitHub : votre photo en haut à droite → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**.
   - Application name : `Admin Cynthia.inmotion`
   - Homepage URL : `https://cynthia-inmotion.pages.dev` (ou votre domaine)
   - Authorization callback URL : `https://cynthia-inmotion.pages.dev/api/callback`
2. Cliquez sur **Register application**, puis sur **Generate a new client secret**. Gardez cette page ouverte.
3. Sur Cloudflare : votre projet Pages → **Settings** → **Variables and Secrets** → ajoutez ces trois variables (type **Secret** pour la deuxième) :

| Nom | Valeur |
|---|---|
| `GITHUB_CLIENT_ID` | le *Client ID* affiché par GitHub |
| `GITHUB_CLIENT_SECRET` | le *Client secret* que vous venez de générer |
| `GITHUB_REPO` | `votre-nom-github/cynthia-inmotion` |

4. Onglet **Deployments** → sur le dernier déploiement, **⋯** → **Retry deployment**, pour que les variables soient prises en compte.

Si vous changez d'adresse (votre propre domaine), mettez à jour les deux adresses de l'OAuth App sur GitHub.

### 4. Se connecter

Allez sur `https://cynthia-inmotion.pages.dev/admin` → **Se connecter avec GitHub**.
Seules les personnes qui ont accès à votre dépôt GitHub peuvent modifier le site.

## Utiliser l'administration

- **Pages du site** : l'accueil section par section (ouverture, outils, projets, services, à propos), les témoignages, le contact, les sections ajoutées et les réglages généraux.
- **Projets** : les trois thèmes et tous vos projets. Glissez un projet pour changer l'ordre. Les trois premiers de chaque thème s'affichent sur l'accueil.
- **Boutons** : presque chaque bloc a une liste « Boutons ». Ajoutez-en autant que vous voulez, choisissez le style (rouge, contour, lien souligné) et la destination (`#contact`, `#photo`, `#projet-portraits-trail`, `https://instagram.com/…`).
- **Sections ajoutées** : créez un nouveau bloc (titre, texte, image, boutons), choisissez sa couleur et son emplacement sur l'accueil. Donnez-lui une ancre (par ex. `tarifs`) pour qu'un bouton `#tarifs` y mène.
- **Médias** : dans chaque champ image ou vidéo, cliquez sur **Choisir une image**, puis **Envoyer** pour ajouter un fichier depuis votre ordinateur. Tout est rangé dans `media/uploads`.
- Cliquez sur **Publier** → **Publier maintenant**. Le site en ligne se met à jour tout seul en 1 à 2 minutes.

### Bon à savoir

- **Vidéos : 25 Mo maximum par fichier**, c'est une limite de Cloudflare Pages. Exportez en MP4 H.264, 1080p, environ 8 Mbit/s : un extrait de 30 secondes pèse environ 25 Mo. Pour un film plus long, gardez un extrait court sur le site.
- **Photos** : 2000 px de large en JPG qualité 80 suffit, environ 300 à 600 Ko par image.
- La **vidéo d'ouverture** (le jet d'eau, dossier `v/`) n'est pas dans l'administration : l'animation est calée image par image sur ce plan précis.
- **Formulaires** : créez une clé gratuite sur web3forms.com et collez-la dans **Réglages généraux**. Les demandes de devis et les témoignages arrivent alors par e-mail. Un témoignage reçu ne s'affiche pas tout seul : ajoutez-le dans **Témoignages et clients** après relecture.
- Chaque modification est sauvegardée dans l'historique GitHub : en cas d'erreur, on peut toujours revenir en arrière.

## Travailler en local (facultatif, pour une développeuse)

```
npx decap-server        # dans le dossier du site
python3 -m http.server  # dans un second terminal
```
Puis ouvrir http://localhost:8000/admin : les modifications s'enregistrent directement dans les fichiers, sans GitHub.
