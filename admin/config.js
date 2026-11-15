// =====================================================================
//  Espace d'administration du site Cynthia.inmotion
//  Chaque champ ci-dessous correspond à un texte, un bouton ou un média du site.
//  Les changements sont enregistrés dans GitHub, puis Cloudflare remet le site
//  à jour tout seul (environ 1 minute).
// =====================================================================

// ---------- briques réutilisées ----------
const LIEN_AIDE = "Où mène le bouton. Une section de l'accueil : #projets, #services, #a-propos, #contact · un thème : #photo, #video, #design · un projet : #projet- suivi de son identifiant (ex. #projet-afrique-coeur-assiette) · un autre site : l'adresse complète https://…";

const BOUTONS = (label = 'Boutons', hint = 'Ajoutez autant de boutons que vous voulez. Glissez-les pour changer leur ordre.') => ({
  label, name: 'boutons', widget: 'list', required: false, collapsed: true, hint,
  label_singular: 'bouton', summary: '{{fields.texte}} → {{fields.lien}}',
  fields: [
    { label: 'Texte du bouton', name: 'texte', widget: 'string' },
    { label: 'Lien', name: 'lien', widget: 'string', default: '#contact', hint: LIEN_AIDE },
    { label: 'Style', name: 'style', widget: 'select', default: 'rouge', options: [
      { label: 'Rouge (bouton principal)', value: 'rouge' },
      { label: 'Contour (bouton secondaire)', value: 'contour' },
      { label: 'Lien souligné (discret)', value: 'lien' }] },
    { label: 'Ouvrir dans un nouvel onglet', name: 'nouvel_onglet', widget: 'boolean', default: false, required: false },
  ],
});
const ETIQ = { label: 'Petite étiquette au-dessus du titre', name: 'etiquette', widget: 'string', required: false };
const TITRE = { label: 'Titre (partie en gras)', name: 'titre', widget: 'string', required: false };
const ACCENT = { label: 'Fin du titre (en couleur, plus fine)', name: 'accent', widget: 'string', required: false, hint: 'Exemple : « Mes projets » + « par thème. »' };
const THEME = (label = 'Thème') => ({ label, name: 'theme', widget: 'select', options: [
  { label: 'P · Photo', value: 'P' }, { label: 'V · Vidéo', value: 'V' }, { label: 'D · Design', value: 'D' }] });
const ICONES = ['pinceau', 'reglages', 'montage', 'motion', 'appareil', 'pocket', 'mise-en-page', 'figma', 'web', 'crayon', 'drone', 'micro', 'ordinateur', 'etoile'];
const IMG = (label, name, hint) => ({ label, name, widget: 'image', required: false, hint: hint || 'JPG ou WebP, 2000 px de large maximum, idéalement moins de 500 Ko.', choose_url: false });
const VIDEO_AIDE = 'Format .mp4, 25 Mo maximum (limite de Cloudflare). Exportez en H.264, 1080p, environ 8 Mbit/s.';


// ---------- projets : une collection par thème, un fichier par projet ----------
const SEC = (n, t) => ({ label: `${n}  ${t}`, name: `_sec${n.charCodeAt(0)}`, widget: 'section', required: false });
const PROJETS = (cle, label, sing, desc) => {
  const commun1 = [
    SEC('①', 'Affichage'),
    { label: 'Afficher ce projet sur le site', name: 'visible', widget: 'boolean', default: true },
    { label: 'Mettre en avant (premier de son thème, sur l’accueil et dans la grille)', name: 'en_avant', widget: 'boolean', default: false, required: false },
    { label: 'Ordre (plus petit = plus haut dans la liste)', name: 'ordre', widget: 'number', value_type: 'int', default: 500, required: false, hint: 'Ex. 10, 20, 30… Laissez un écart pour pouvoir glisser un projet entre deux.' },
    { label: 'Thème', name: 'theme', widget: 'hidden', default: cle },
    SEC('②', 'En-tête de la page (grande image + titre)'),
    { label: 'Titre du projet', name: 'titre', widget: 'string' },
    { label: 'Client', name: 'client', widget: 'string', required: false },
    { label: 'Année', name: 'annee', widget: 'number', value_type: 'int', default: 2026 },
    { label: 'Catégorie (petite étiquette, sert aux filtres)', name: 'categorie', widget: 'string', required: false, hint: cle === 'P' ? 'Ex. Sport, Événementiel' : cle === 'V' ? 'Ex. Aftermovies, Reels' : 'Ex. Sites web, Identités' },
    IMG('Grande image de l’en-tête', 'image', 'JPG ou WebP, 2000 px de large, moins de 500 Ko.'),
    IMG('Vignette dans la grille (facultatif)', 'vignette', 'Vide = la grande image.'),
    { label: 'Votre rôle', name: 'role', widget: 'string', required: false, hint: 'Ex. Prise de vue, retouche' },
    { label: 'Outils utilisés (séparés par des virgules)', name: 'outils', widget: 'string', required: false, hint: 'Ex. Lightroom, Photoshop' },
    { label: 'Adresse de la page (identifiant)', name: 'slug', widget: 'string', required: false, pattern: ['^[a-z0-9-]*$', 'Minuscules, chiffres et tirets seulement'], hint: 'Ex. trail-du-grand-geneve → cynthia-inmotion.ch/projets/trail-du-grand-geneve. Vide = calculée depuis le titre.' },
  ];
  const recit = [
    SEC('③', 'Le récit (trois colonnes sous l’en-tête)'),
    { label: '01 · Le besoin', name: 'besoin', widget: 'text', required: false },
    { label: '02 · La réalisation', name: 'realisation', widget: 'text', required: false },
    { label: '03 · Le résultat : grand chiffre (facultatif)', name: 'resultat_chiffre', widget: 'string', required: false, hint: 'Ex. 18,3 K, +40 %' },
    { label: '03 · Le résultat : texte', name: 'resultat_texte', widget: 'text', required: false },
    BOUTONS('Boutons sous le récit (YouTube, Instagram, site…)'),
  ];
  const extra = [
    SEC('⑥', 'Sections en plus sur cette page (facultatif)'),
    { label: 'Sections en plus', name: 'sections', widget: 'list', required: false, collapsed: true, label_singular: 'section', summary: '{{fields.titre}} {{fields.accent}}', hint: 'Un bloc libre (titre, texte, image, boutons) affiché seulement sur ce projet, avant l’encadré de contact.', fields: [
      { label: 'Afficher', name: 'visible', widget: 'boolean', default: true },
      { label: 'Couleur de fond', name: 'fond', widget: 'select', default: 'creme', options: [{ label: 'Crème', value: 'creme' }, { label: 'Beige', value: 'beige' }, { label: 'Bleu nuit', value: 'nuit' }, { label: 'Vert-gris', value: 'vert' }] },
      ETIQ, TITRE, ACCENT,
      { label: 'Texte', name: 'texte', widget: 'text', required: false },
      IMG('Image (facultative)', 'image'), BOUTONS()] },
  ];
  const parTheme = {
    P: [
      SEC('④', 'La série photo'),
      { label: 'Photos de la série', name: 'galerie', widget: 'list', required: false, collapsed: true, label_singular: 'photo', field: IMG('Photo', 'image'), hint: 'Ajoutez autant de photos que vous voulez ; glissez-les pour changer l’ordre. Elles s’affichent par pages de 6.' },
      IMG('Avant retouche (facultatif)', 'avant', 'Le comparateur avant / après apparaît si les deux photos sont remplies.'),
      IMG('Après retouche (facultatif)', 'apres'),
    ],
    V: [
      SEC('④', 'Le film'),
      { label: 'Format du film', name: 'format', widget: 'select', default: 'horizontal', options: [{ label: 'Horizontal 16:9 (YouTube, aftermovie)', value: 'horizontal' }, { label: 'Vertical 9:16 (Reel, story)', value: 'vertical' }] },
      { label: 'Lien YouTube (le film complet en pleine qualité)', name: 'youtube', widget: 'string', required: false, hint: 'Ex. https://youtu.be/…' },
      { label: 'Lien Instagram (facultatif)', name: 'instagram', widget: 'string', required: false },
      { label: 'Fichier du film .mp4 (moins de 25 Mo)', name: 'video', widget: 'file', required: false, choose_url: false, hint: VIDEO_AIDE },
      { label: 'Extrait muet en boucle, 5 à 10 s (vignette et haut de page)', name: 'apercu', widget: 'file', required: false, choose_url: false, hint: 'Moins de 2 Mo. Vide = le film.' },
      { label: 'Version haute qualité pour le plein écran (facultatif)', name: 'video_hd', widget: 'file', required: false, choose_url: false },
      { label: 'Diffusion (facultatif)', name: 'diffusion', widget: 'string', required: false, hint: 'Ex. Instagram, avec les partenaires' },
      SEC('⑤', '« Du rush au film » (films horizontaux)'),
      { label: '5 images extraites du film', name: 'rushes', widget: 'list', required: false, max: 5, field: { label: 'Image', name: 'image', widget: 'image', choose_url: false } },
    ],
    D: [
      SEC('④', 'Les pages du site (captures plein écran)'),
      { label: 'Pages', name: 'ecrans', widget: 'list', required: false, collapsed: true, label_singular: 'page', summary: '{{fields.titre}}', hint: 'Capture de toute la page, 1400 px de large. Elle défile au survol et s’ouvre en grand au clic.', fields: [
        { label: 'Nom de la page', name: 'titre', widget: 'string' }, IMG('Capture', 'image')] },
      SEC('⑤', 'La planche de style'),
      { label: 'Texte de la planche', name: 'planche_texte', widget: 'text', required: false },
      { label: 'Couleurs (codes, ex. #0E0F54)', name: 'palette', widget: 'list', required: false, field: { label: 'Couleur', name: 'couleur', widget: 'string' } },
      { label: 'Police des titres', name: 'typo', widget: 'string', required: false },
      { label: 'Police des textes', name: 'typo_texte', widget: 'string', required: false },
      { label: 'Autres supports à montrer', name: 'supports', widget: 'select', multiple: true, required: false, options: [
        { label: 'Affiche', value: 'affiche' }, { label: 'Post Instagram', value: 'post' }, { label: 'Story', value: 'story' },
        { label: 'Carrousel Instagram', value: 'carrousel' }, { label: 'Bannière web', value: 'banniere' }, { label: 'Site web', value: 'web' }] },
      { label: 'Réglages avancés : police des titres (CSS)', name: 'typo_css', widget: 'string', required: false },
      { label: 'Réglages avancés : graisse des titres', name: 'typo_poids', widget: 'string', required: false },
      { label: 'Réglages avancés : police des textes (CSS)', name: 'typo_texte_css', widget: 'string', required: false },
      { label: 'Réglages avancés : couleur d’accent', name: 'accent', widget: 'string', required: false },
    ],
  };
  return {
    name: 'projets-' + cle.toLowerCase(), label, label_singular: sing, description: desc,
    folder: 'content/projets', extension: 'json', format: 'json', create: true, delete: true,
    filter: { field: 'theme', value: cle }, slug: '{{slug}}', identifier_field: 'titre',
    summary: '{{titre}} · {{client}} ({{annee}})', sortable_fields: ['ordre', 'titre', 'annee'],
    view_filters: [{ label: 'Masqués', field: 'visible', pattern: false }, { label: 'Mis en avant', field: 'en_avant', pattern: true }],
    editor: { preview: true },
    fields: [...commun1, ...recit, ...parTheme[cle], ...extra],
  };
};

// ---------- la configuration ----------
const config = {
  load_config_file: false,
  locale: 'fr',
  backend: { name: 'github', repo: '', branch: 'main', base_url: location.origin, auth_endpoint: 'api/auth', commit_messages: {
    create: 'Ajout : {{slug}}', update: 'Modification : {{slug}}', delete: 'Suppression : {{slug}}', uploadMedia: 'Média ajouté : {{path}}', deleteMedia: 'Média supprimé : {{path}}' } },
  site_url: location.origin,
  display_url: location.origin,
  logo_url: '/admin/logo.svg',
  media_folder: 'media/uploads',
  public_folder: 'media/uploads',
  collections: [
    // =================================================================
    {
      name: 'pages', label: 'Pages du site', label_singular: 'page', editor: { preview: false },
      description: 'Tous les textes, boutons et images du site, section par section.',
      files: [
        // ----------------------------------------------------------- accueil
        {
          name: 'accueil', label: "Page d'accueil", file: 'content/accueil.json',
          fields: [
            { label: "Ouverture (le grand titre sur la vidéo)", name: 'intro', widget: 'object', collapsed: false, fields: [
              { label: 'Titre, ligne 1 (en capitales)', name: 'titre1', widget: 'string' },
              { label: 'Titre, ligne 2 (plus fine)', name: 'titre2', widget: 'string' },
              { label: 'Texte sous le titre', name: 'texte', widget: 'text' },
              { label: "Texte au centre avant le démarrage", name: 'invite', widget: 'string', hint: 'Ex. : Moteur… action !' },
              { label: 'Lieu affiché dans le viseur', name: 'lieu', widget: 'string', required: false },
              { label: 'Vidéo d’ouverture (ordinateur, facultatif)', name: 'video', widget: 'file', required: false, choose_url: false, hint: 'Vide = la vidéo de la rade actuelle. Le viseur de l’intro est calé sur la rade : avec une autre vidéo, il ne suivra plus le jet d’eau. ' + VIDEO_AIDE },
              { label: 'Vidéo d’ouverture (téléphone, facultatif)', name: 'video_mobile', widget: 'file', required: false, choose_url: false, hint: 'Version plus légère, 720p conseillé.' },
              { label: 'Boucle après l’ouverture (ordinateur, facultatif)', name: 'boucle', widget: 'file', required: false, choose_url: false },
              { label: 'Boucle après l’ouverture (téléphone, facultatif)', name: 'boucle_mobile', widget: 'file', required: false, choose_url: false },
              BOUTONS('Boutons sous le titre'),
            ] },
            { label: 'Bande « Mes outils »', name: 'outils', widget: 'object', collapsed: true, fields: [
              { label: 'Titre de la bande', name: 'titre', widget: 'string' },
              { label: "Groupes d'outils", name: 'groupes', widget: 'list', label_singular: 'groupe', summary: '{{fields.nom}}', collapsed: true, fields: [
                { label: 'Nom du groupe', name: 'nom', widget: 'string' },
                { label: 'Couleur des icônes', name: 'couleur', widget: 'select', options: [
                  { label: 'Corail', value: 'corail' }, { label: 'Crème', value: 'creme' }, { label: 'Bleu nuit', value: 'nuit' }] },
                { label: 'Outils', name: 'outils', widget: 'list', label_singular: 'outil', summary: '{{fields.nom}}', collapsed: true, fields: [
                  { label: "Nom de l'outil", name: 'nom', widget: 'string', hint: 'Écrivez-le comme dans le champ « Outils » des projets pour que l’icône y apparaisse aussi.' },
                  { label: 'À quoi il sert', name: 'usage', widget: 'string', required: false },
                  { label: 'Icône', name: 'icone', widget: 'select', options: ICONES },
                  { label: 'Logo du logiciel (facultatif)', name: 'logo', widget: 'image', required: false, choose_url: false, hint: 'Image carrée (PNG ou WebP, environ 200 × 200 px). Remplace l’icône dessinée.' },
                ] },
              ] },
            ] },
            { label: 'Section « Mes projets »', name: 'projets', widget: 'object', collapsed: true, fields: [ETIQ, TITRE, ACCENT, BOUTONS()] },
            { label: 'Section « Services »', name: 'services', widget: 'object', collapsed: true, fields: [
              ETIQ, TITRE, ACCENT,
              { label: 'Texte sous le titre', name: 'texte', widget: 'text', required: false },
              BOUTONS('Boutons sous le texte'),
              { label: 'Les 3 barres de services', name: 'cartes', widget: 'list', label_singular: 'service', summary: '{{fields.theme}}', collapsed: true, min: 1, max: 3, fields: [
                THEME(),
                IMG('Image de fond', 'image'),
                { label: 'Phrase de présentation', name: 'texte', widget: 'text' },
                { label: 'Liste des prestations', name: 'points', widget: 'list', field: { label: 'Prestation', name: 'point', widget: 'string' } },
                { label: 'Texte du bouton « devis » (vide = pas de bouton)', name: 'bouton_devis', widget: 'string', required: false },
                { label: 'Texte du lien vers les projets (vide = pas de lien)', name: 'lien_projets', widget: 'string', required: false },
                BOUTONS('Boutons en plus'),
              ] },
            ] },
            { label: 'Bloc « À propos »', name: 'apropos', widget: 'object', collapsed: true, fields: [
              ETIQ, TITRE, ACCENT,
              IMG('Votre portrait', 'portrait', 'Format vertical (4:5) conseillé.'),
              { label: 'Phrase principale', name: 'chapo', widget: 'text', required: false },
              { label: 'Texte', name: 'texte', widget: 'text', required: false },
              { label: 'Note en gris (vide = rien)', name: 'note', widget: 'string', required: false },
              { label: 'Texte du lien vers la page À propos (vide = pas de lien)', name: 'lien', widget: 'string', required: false },
              BOUTONS(),
              { label: 'Page « À propos » complète', name: 'page', widget: 'object', collapsed: true, fields: [
                { label: 'Titre de la page', name: 'titre', widget: 'string' },
                { label: 'Chiffres clés', name: 'chiffres', widget: 'list', label_singular: 'chiffre', summary: '{{fields.valeur}} {{fields.label}}', collapsed: true, required: false, max: 4, fields: [
                  { label: 'Valeur (ex. 40+, 6, 120)', name: 'valeur', widget: 'string' },
                  { label: 'Légende', name: 'label', widget: 'string' }] },
                { label: 'Paragraphes sous le portrait', name: 'paragraphes', widget: 'list', required: false, field: { label: 'Paragraphe', name: 'p', widget: 'text' } },
                { label: 'Note en gris (vide = rien)', name: 'note', widget: 'string', required: false },
                BOUTONS(),
                { label: 'Section « Mon parcours » (frise)', name: 'parcours', widget: 'object', collapsed: true, required: false, fields: [
                  ETIQ, TITRE, ACCENT,
                  { label: 'Étapes de la frise', name: 'etapes', widget: 'list', label_singular: 'étape', summary: '{{fields.date}} · {{fields.titre}}', collapsed: true, fields: [
                    { label: 'Date (ex. 2016 — 2023)', name: 'date', widget: 'string', required: false }, { label: 'Titre', name: 'titre', widget: 'string' }, { label: 'Texte', name: 'texte', widget: 'text' }] },
                  { label: 'Encadré vert « Ce qui me différencie »', name: 'difference', widget: 'object', collapsed: true, required: false, fields: [
                    { label: 'Titre', name: 'titre', widget: 'string', required: false }, { label: 'Texte', name: 'texte', widget: 'text', required: false }] }] },
                { label: 'Afficher le bandeau « Ils me font confiance » en bas de page', name: 'logos', widget: 'boolean', default: true, required: false },
                { label: 'Section « Ce qui m’anime ? » (fond bleu nuit)', name: 'anime', widget: 'object', collapsed: true, fields: [
                  TITRE, ACCENT,
                  { label: 'Valeurs', name: 'items', widget: 'list', label_singular: 'valeur', summary: '{{fields.titre}}', collapsed: true, fields: [
                    { label: 'Titre', name: 'titre', widget: 'string' },
                    { label: 'Texte', name: 'texte', widget: 'text' },
                    { label: 'Phrase courte pour l’accueil (1 ligne)', name: 'court', widget: 'string', required: false },
                    { label: 'Animation', name: 'anim', widget: 'select', options: [
                      { label: 'Mouvement (traits de vitesse)', value: 'mouvement' }, { label: 'Humain (deux personnes)', value: 'humain' },
                      { label: 'Émotion (battement)', value: 'emotion' }, { label: 'Créativité (points reliés)', value: 'creativite' }] }] }] },
                { label: 'Section « Domaines de compétences » (cartes vertes)', name: 'competences', widget: 'object', collapsed: true, fields: [
                  ETIQ, TITRE, ACCENT,
                  { label: 'Compétences', name: 'items', widget: 'list', label_singular: 'compétence', summary: '{{fields.titre}}', collapsed: true, fields: [
                    { label: 'Titre', name: 'titre', widget: 'string' }, { label: 'Texte (visible à l’ouverture de la carte)', name: 'texte', widget: 'text' },
                    { label: 'Lien (ex. #photo, #video, #design)', name: 'lien', widget: 'string', required: false }, { label: 'Texte du lien', name: 'lien_texte', widget: 'string', required: false }] }] },
                { label: 'Section « Ma méthode » (cartes marron)', name: 'vision', widget: 'object', collapsed: true, fields: [
                  ETIQ, TITRE, ACCENT,
                  { label: 'Points', name: 'items', widget: 'list', label_singular: 'point', summary: '{{fields.titre}}', collapsed: true, fields: [
                    { label: 'Titre', name: 'titre', widget: 'string' }, { label: 'Texte', name: 'texte', widget: 'text' }] }] },
              ] },
            ] },
          ],
        },
        // ----------------------------------------------------------- témoignages
        {
          name: 'temoignages', label: 'Témoignages et clients', file: 'content/temoignages.json',
          fields: [
            { label: 'Titre de la bande des logos (sous l’ouverture)', name: 'bandeau', widget: 'string', hint: 'Ex. Ils m’ont fait confiance' },
            { label: 'Logos clients', name: 'logos', widget: 'list', label_singular: 'client', summary: '{{fields.nom}}', collapsed: true, fields: [
              { label: 'Nom du client', name: 'nom', widget: 'string' },
              IMG('Logo (PNG transparent ou SVG)', 'logo', 'Version blanche sur fond transparent, pour rester lisible sur la bande vert-gris.'),
            ] },
            ETIQ, TITRE, ACCENT,
            { label: 'Texte du bouton « Laisser un témoignage »', name: 'bouton_laisser', widget: 'string' },
            BOUTONS('Boutons en plus'),
            { label: 'Note sous le carnet (vide = rien)', name: 'note', widget: 'string', required: false },
            { label: 'Bandeau d’invitation (affiché tant qu’aucun témoignage n’est publié) : phrase', name: 'invitation', widget: 'string', required: false, default: 'Vous avez travaillé avec moi ?' },
            { label: 'Bandeau d’invitation : fin de phrase (en rouge)', name: 'invitation_accent', widget: 'string', required: false, default: 'Racontez-moi votre expérience.' },
            { label: 'Témoignages (le premier est aussi affiché en citation)', name: 'liste', widget: 'list', label_singular: 'témoignage', summary: '{{fields.nom}} · {{fields.structure}}', collapsed: true, fields: [
              { label: 'Publier ce témoignage sur le site', name: 'publie', widget: 'boolean', default: true, required: false, hint: 'Décochez pour le garder en attente (ou le masquer) sans le supprimer.' },
              { label: 'Témoignage', name: 'texte', widget: 'text', hint: 'Sans guillemets : ils sont ajoutés automatiquement.' },
              { label: 'Prénom et nom', name: 'nom', widget: 'string' },
              { label: 'Structure · projet', name: 'structure', widget: 'string', required: false },
              IMG('Photo du polaroïd', 'image'),
              { label: 'Légende du polaroïd', name: 'legende', widget: 'string', required: false },
            ] },
          ],
        },
        // ----------------------------------------------------------- contact
        {
          name: 'contact', label: 'Contact', file: 'content/contact.json',
          fields: [
            ETIQ, TITRE, ACCENT,
            { label: 'Texte sous le titre', name: 'texte', widget: 'string', required: false },
            BOUTONS('Boutons sous le texte'),
            { label: 'Votre adresse e-mail', name: 'email', widget: 'string', required: false, hint: 'Utilisée par le bouton sous le formulaire (ouvre la messagerie du visiteur).' },
            { label: 'Texte du bouton e-mail sous le formulaire (vide = pas de bouton)', name: 'bouton_email', widget: 'string', required: false },
            { label: 'Lien Instagram (vide = masqué)', name: 'instagram', widget: 'string', required: false, hint: 'Adresse complète, ex. https://www.instagram.com/cynthia.inmotion/ . Le lien apparaît dans le contact et le pied de page.' },
            { label: 'Texte du lien Instagram', name: 'instagram_texte', widget: 'string', required: false },
          ],
        },
        // ----------------------------------------------------------- sections libres
        {
          name: 'sections', label: 'Sections ajoutées', file: 'content/sections.json',
          fields: [
            { label: 'Vos sections', name: 'sections', widget: 'list', label_singular: 'section', summary: '{{fields.titre}} {{fields.accent}} · {{fields.position}}', collapsed: true, required: false,
              hint: "Ajoutez des blocs (titre, texte, image, boutons) à l'accueil ou à n'importe quelle page, et choisissez où ils apparaissent. Sur les pages intérieures, ils se placent avant l'encadré « Votre projet en images ? ».", fields: [
              { label: 'Afficher cette section', name: 'visible', widget: 'boolean', default: true },
              { label: 'Emplacement', name: 'position', widget: 'select', default: 'apres-services', options: [
                { label: "Accueil · après l'ouverture", value: 'apres-intro' },
                { label: 'Accueil · après « Mes projets »', value: 'apres-projets' },
                { label: 'Accueil · après « Services / À propos »', value: 'apres-services' },
                { label: 'Accueil · après les témoignages', value: 'apres-temoignages' },
                { label: 'Accueil · après le contact', value: 'apres-contact' },
                { label: 'Page Photo', value: 'page-photo' }, { label: 'Page Vidéo', value: 'page-video' }, { label: 'Page Design', value: 'page-design' },
                { label: 'Page À propos', value: 'page-apropos' },
                { label: 'Toutes les pages projets', value: 'page-projets' },
                { label: 'Toutes les pages projets photo', value: 'page-projets-photo' }, { label: 'Toutes les pages projets vidéo', value: 'page-projets-video' }, { label: 'Toutes les pages projets design', value: 'page-projets-design' }] },
              { label: 'Couleur de fond', name: 'fond', widget: 'select', default: 'creme', options: [
                { label: 'Crème', value: 'creme' }, { label: 'Beige', value: 'beige' }, { label: 'Bleu nuit', value: 'nuit' }, { label: 'Vert-gris', value: 'vert' }] },
              ETIQ, TITRE, ACCENT,
              { label: 'Texte', name: 'texte', widget: 'text', required: false, hint: 'Laissez une ligne vide pour commencer un nouveau paragraphe.' },
              IMG('Image (facultative, affichée à côté du texte)', 'image'),
              BOUTONS(),
              { label: 'Ancre (facultatif)', name: 'ancre', widget: 'string', required: false, hint: 'Un mot sans espace, ex. « tarifs ». Un bouton avec le lien #tarifs mènera ici.' },
            ] },
          ],
        },
        // ----------------------------------------------------------- mentions légales
        {
          name: 'legal', label: 'Mentions légales et confidentialité', file: 'content/legal.json',
          fields: [
            { label: 'Titre de la page', name: 'titre', widget: 'string' },
            { label: 'Date de mise à jour', name: 'maj', widget: 'string', required: false },
            { label: 'Rubriques', name: 'sections', widget: 'list', label_singular: 'rubrique', summary: '{{fields.titre}}', collapsed: true, fields: [
              { label: 'Titre', name: 'titre', widget: 'string' },
              { label: 'Texte', name: 'texte', widget: 'text', hint: 'Laissez une ligne vide pour un nouveau paragraphe.' }] },
          ],
        },
        // ----------------------------------------------------------- réglages
        {
          name: 'general', label: 'Réglages généraux', file: 'content/general.json',
          fields: [
            { label: 'Adresse du site', name: 'site_url', widget: 'string', required: false, hint: 'Ex. https://cynthia-inmotion.ch : sert au plan du site pour Google et aux aperçus de partage.' },
            IMG('Logo du menu (facultatif)', 'logo', 'Image PNG ou SVG sur fond transparent, en clair (le menu est sur fond foncé). Vide = le logo texte « Cynthia.inmotion ».'),
            IMG('Icône d’onglet (favicon, facultatif)', 'favicon', 'Image carrée PNG ou SVG, 512 × 512 px idéalement.'),
            { label: "Titre du site (onglet du navigateur et Google)", name: 'site_titre', widget: 'string' },
            { label: 'Description pour Google (150 caractères environ)', name: 'description', widget: 'text' },
            { label: 'Textes du site à remplacer', name: 'textes', widget: 'list', required: false, collapsed: true, label_singular: 'texte', summary: '{{fields.original}} → {{fields.nouveau}}',
              hint: 'Pour changer n’importe quel petit texte fixe du site (ex. « Le besoin », « Voir le film », « Votre projet en deux lignes », « Envoyer »). Recopiez le texte exact tel qu’il apparaît, puis le nouveau.',
              fields: [{ label: 'Texte actuel (exactement comme sur le site)', name: 'original', widget: 'string' }, { label: 'Nouveau texte', name: 'nouveau', widget: 'string', required: false }] },
            { label: 'Menu', name: 'nav', widget: 'object', collapsed: true, fields: [
              { label: 'Lien « À propos »', name: 'apropos', widget: 'string' },
              { label: 'Bouton « Me contacter »', name: 'contact', widget: 'string' },
              { label: 'Bouton « Passer l’intro »', name: 'passer_intro', widget: 'string' },
              { label: '(Photo, Vidéo et Design reprennent le nom des thèmes, dans « Projets »)', name: 'photo', widget: 'hidden' },
              { label: 'video', name: 'video', widget: 'hidden' }, { label: 'design', name: 'design', widget: 'hidden' },
            ] },
            { label: 'Encadré en bas des pages projet et thème', name: 'cta_pages', widget: 'object', collapsed: true, fields: [
              { label: 'Titre', name: 'titre', widget: 'string' }, { label: 'Texte (vide = rien)', name: 'texte', widget: 'string', required: false }, { label: 'Bouton', name: 'bouton', widget: 'string' }] },
            { label: 'Pied de page', name: 'pied', widget: 'object', collapsed: true, fields: [
              { label: 'Texte à gauche', name: 'gauche', widget: 'string' }, { label: 'Texte à droite', name: 'droite', widget: 'string' }] },
            { label: 'Clé Web3Forms (pour recevoir les messages par e-mail)', name: 'web3forms_cle', widget: 'string', required: false,
              hint: 'Créez-la gratuitement sur web3forms.com avec votre adresse e-mail, puis collez-la ici. Vide = les formulaires n’envoient rien.' },
          ],
        },
      ],
    },
    // =================================================================
    // =================================================================
    {
      name: 'themes', label: 'Bannières et thèmes', editor: { preview: false },
      description: 'Le nom, la phrase et la bannière (image ou vidéo de fond) des pages Photo, Vidéo et Design.',
      files: [{
        name: 'themes', label: 'Les 3 thèmes : Photo, Vidéo, Design', file: 'content/themes.json',
        fields: [
          { label: 'Thèmes', name: 'themes', widget: 'list', min: 3, max: 3, allow_add: false, allow_remove: false, allow_reorder: false, collapsed: true, summary: '{{fields.nom}}', fields: [
            { label: 'Lettre (ne pas changer)', name: 'cle', widget: 'hidden' },
            { label: 'Nom du thème (menu et titre de la page)', name: 'nom', widget: 'string' },
            { label: 'Phrase sous le grand titre', name: 'texte', widget: 'text' },
            { label: 'Bannière : image ou vidéo .mp4 en fond de la page', name: 'fond', widget: 'file', hint: VIDEO_AIDE, choose_url: false },
            { label: 'Image affichée pendant le chargement de la vidéo (facultatif)', name: 'affiche', widget: 'image', required: false, choose_url: false },
            { label: 'Fond sur l’accueil quand ce thème est choisi (facultatif)', name: 'fond_accueil', widget: 'file', required: false, choose_url: false, hint: 'Vide = la même bannière que la page du thème.' },
          ] },
        ],
      }],
    },
    PROJETS('P', 'Projets photo', 'projet photo', 'Vos séries photo. Un projet = une page avec sa galerie.'),
    PROJETS('V', 'Projets vidéo', 'projet vidéo', 'Vos films. Un projet = une page avec le film, « Du rush au film » et les liens YouTube / Instagram.'),
    PROJETS('D', 'Projets design', 'projet design', 'Vos sites et identités. Un projet = une page avec les écrans, la palette et les typographies.'),
  ],
};


// ---------- admin visuel : titres de sections et aperçu de la page à droite ----------
function registerVisuel() {
  const h = window.h, createClass = window.createClass;
  // titre de section (ne stocke rien)
  CMS.registerWidget('section', createClass({ render() { return h('div', { style: { margin: '18px 0 2px', padding: '10px 14px', borderRadius: '8px', background: '#1C2938', color: '#F6EFE4', font: '700 15px/1.2 system-ui', letterSpacing: '.02em' } }, this.props.field.get('label')); } }), createClass({ render() { return null; } }));
  const css = `
  body{margin:0;font-family:system-ui,-apple-system,sans-serif;background:#F6EFE4;color:#1C2938}
  .z{position:relative;outline:2px dashed rgba(200,16,46,.35);outline-offset:-2px}
  .n{position:absolute;top:8px;left:8px;z-index:3;background:#C8102E;color:#fff;font:700 13px system-ui;border-radius:999px;padding:3px 9px}
  .hero{min-height:300px;background:#1C2938 center/cover no-repeat;color:#F6EFE4;display:flex;align-items:flex-end;padding:28px}
  .hero:before{content:"";position:absolute;inset:0;background:linear-gradient(transparent 30%,rgba(18,28,40,.85))}
  .hero>div{position:relative}.hero h1{font:800 44px/1 system-ui;text-transform:uppercase;margin:6px 0}
  .tag{display:inline-block;font:600 11px system-ui;letter-spacing:.12em;text-transform:uppercase;border:1px solid rgba(246,239,228,.6);border-radius:999px;padding:4px 10px;margin-right:6px}
  .meta{opacity:.85;font-size:14px}
  .story{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:30px 24px}
  .story h3{font:800 18px system-ui;text-transform:uppercase;margin:4px 0 8px}.story p{font-size:13.5px;line-height:1.55;margin:0;opacity:.85}
  .story .k{color:#C8102E;font:700 12px system-ui}.big{font:800 34px system-ui;color:#C8102E}
  .btns{padding:0 24px 24px;display:flex;gap:10px;flex-wrap:wrap}.btn{border-radius:999px;padding:10px 16px;font:600 13px system-ui;background:#C8102E;color:#fff}.btn.c{background:none;border:1.5px solid #1C2938;color:#1C2938}
  .sec{padding:30px 24px}.sec h2{font:800 22px system-ui;text-transform:uppercase;margin:0 0 14px}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.grid img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px;display:block}
  .film{background:#1C2938;color:#F6EFE4;border-radius:12px;aspect-ratio:16/9;display:grid;place-items:center;background-size:cover;background-position:center}.film.v{aspect-ratio:9/16;max-width:220px}
  .play{background:#C8102E;border-radius:999px;padding:10px 18px;font:600 14px system-ui}
  .sw{display:flex;gap:8px;flex-wrap:wrap}.sw i{width:56px;height:56px;border-radius:10px;display:block;box-shadow:inset 0 0 0 1px rgba(0,0,0,.1)}
  .vide{opacity:.5;font-style:italic;font-size:13px}`;
  CMS.registerPreviewStyle(css, { raw: true });
  const Apercu = createClass({ render() {
    const e = this.props.entry, d = k => e.getIn(['data', k]), url = v => { if (!v) return ''; const a = this.props.getAsset(v); let u = a ? a.toString() : String(v); if (!/^(blob:|https?:|\/|data:)/.test(u)) u = '/' + u; return u; };
    const list = k => { const v = d(k); return v && v.toJS ? v.toJS() : (v || []); };
    const z = (n, kids, extra) => h('div', Object.assign({ className: 'z' }, extra || {}), h('span', { className: 'n' }, n), ...[].concat(kids));
    const th = d('theme'), img = url(d('image'));
    const out = [];
    out.push(z('②', h('div', null, h('span', { className: 'tag' }, d('categorie') || 'catégorie'), h('h1', null, d('titre') || 'Titre du projet'), h('div', { className: 'meta' }, [d('client'), d('annee'), d('role')].filter(Boolean).join(' · '))), { className: 'z hero', style: { backgroundImage: img ? `url("${img}")` : 'none' } }));
    out.push(z('③', [h('div', { className: 'story' },
      h('div', null, h('div', { className: 'k' }, '01'), h('h3', null, 'Le besoin'), h('p', null, d('besoin') || h('span', { className: 'vide' }, 'à remplir'))),
      h('div', null, h('div', { className: 'k' }, '02'), h('h3', null, 'La réalisation'), h('p', null, d('realisation') || h('span', { className: 'vide' }, 'à remplir'))),
      h('div', null, h('div', { className: 'k' }, '03'), h('h3', null, 'Le résultat'), d('resultat_chiffre') ? h('div', { className: 'big' }, d('resultat_chiffre')) : null, h('p', null, d('resultat_texte') || h('span', { className: 'vide' }, 'à remplir')))),
      h('div', { className: 'btns' }, list('boutons').map(b => h('span', { className: 'btn' + (b.style === 'rouge' ? '' : ' c') }, b.texte || 'Bouton')))]));
    if (th === 'P') {
      const g = list('galerie').map(x => typeof x === 'string' ? x : x && x.image).filter(Boolean);
      out.push(z('④', h('div', { className: 'sec' }, h('h2', null, `La série · ${g.length} photo${g.length > 1 ? 's' : ''}`), g.length ? h('div', { className: 'grid' }, g.slice(0, 9).map(x => h('img', { src: url(x) }))) : h('p', { className: 'vide' }, 'Ajoutez des photos dans « La série photo ».'))));
    }
    if (th === 'V') {
      const v = d('format') === 'vertical', yt = d('youtube');
      out.push(z('④', h('div', { className: 'sec' }, h('h2', null, v ? 'Le reel (vertical)' : 'Le film'), h('div', { className: 'film' + (v ? ' v' : ''), style: { backgroundImage: img ? `url("${img}")` : 'none' } }, h('span', { className: 'play' }, yt ? '▶ Voir le film (YouTube)' : d('video') ? '▶ Voir le film' : 'Ajoutez un lien YouTube ou un fichier')))));
      if (!v) { const r = list('rushes').map(x => typeof x === 'string' ? x : x && x.image).filter(Boolean);
        out.push(z('⑤', h('div', { className: 'sec' }, h('h2', null, 'Du rush au film'), r.length ? h('div', { className: 'grid' }, r.map(x => h('img', { src: url(x) }))) : h('p', { className: 'vide' }, 'Ajoutez 5 images extraites du film.')))); }
    }
    if (th === 'D') {
      const ec = list('ecrans');
      out.push(z('④', h('div', { className: 'sec' }, h('h2', null, 'Les pages du site'), ec.length ? h('div', { className: 'grid' }, ec.map(x => h('div', null, h('img', { src: url(x.image), style: { aspectRatio: '3/4', objectPosition: 'top' } }), h('div', { style: { fontSize: '12px', marginTop: '4px' } }, x.titre)))) : h('p', { className: 'vide' }, 'Ajoutez des captures de pages.'))));
      const pal = list('palette').map(x => typeof x === 'string' ? x : x && x.couleur).filter(Boolean);
      out.push(z('⑤', h('div', { className: 'sec' }, h('h2', null, 'La planche de style'), h('div', { className: 'sw' }, pal.map(c => h('i', { style: { background: c } }))), h('p', null, [d('typo'), d('typo_texte')].filter(Boolean).join(' · ')), h('p', { style: { fontSize: '13.5px', opacity: .85 } }, d('planche_texte') || ''))));
    }
    return h('div', null, h('div', { style: { padding: '10px 14px', font: '600 12px system-ui', background: '#EDE4D5' } }, 'Aperçu de la page projet · les numéros rouges correspondent aux sections du formulaire à gauche'), ...out);
  } });
  ['projets-p', 'projets-v', 'projets-d'].forEach(c => CMS.registerPreviewTemplate(c, Apercu));
}


// ---------- menu de l'admin : une entrée courte par section du site ----------
function reorganiser() {
  const pages = config.collections.find(c => c.name === 'pages'); if (!pages) return;
  const fichier = n => pages.files.find(x => x.name === n);
  const acc = fichier('accueil'), F = n => acc.fields.find(x => x.name === n);
  const ap = F('apropos'), apPage = ap.fields.find(x => x.name === 'page'), apAccueil = ap.fields.filter(x => x.name !== 'page');
  const ouvrir = l => l.map(x => x.widget === 'object' ? Object.assign({}, x, { collapsed: false }) : x);
  const entree = (name, label, file, fields, description) => ({ name, label, file, fields, description });
  const t = fichier('temoignages'), c = fichier('contact');
  const accueil = { name: 'accueil', label: '🏠 Page d’accueil', label_singular: 'section', editor: { preview: false },
    description: 'Les sections de l’accueil, dans l’ordre où elles apparaissent en descendant la page.',
    files: [
      entree('intro', '1 · Ouverture : grand titre sur la vidéo', 'content/accueil/intro.json', F('intro').fields),
      entree('projets-titre', '2 · Titre de la section « Mes projets »', 'content/accueil/projets.json', F('projets').fields),
      entree('services', '3 · Services (cartes Photo, Vidéo, Design)', 'content/accueil/services.json', ouvrir(F('services').fields)),
      entree('apropos-accueil', '4 · Bloc « À propos » de l’accueil', 'content/accueil/apropos.json', apAccueil),
      Object.assign({}, t, { label: '5 · Logos clients et témoignages' }),
      Object.assign({}, c, { label: '6 · Contact (formulaire, e-mail, Instagram)' }),
    ] };
  const apropos = { name: 'page-apropos', label: '👤 Page À propos', editor: { preview: false },
    files: [
      entree('apropos-page', 'Page À propos : parcours, valeurs, compétences', 'content/accueil/apropos-page.json', apPage.fields),
      entree('outils', 'Mes outils (logiciels)', 'content/accueil/outils.json', ouvrir(F('outils').fields)),
    ] };
  const reglages = { name: 'reglages', label: '⚙️ Réglages', editor: { preview: false },
    files: [Object.assign({}, fichier('general'), { label: 'Réglages généraux : logo, menu, Google, textes du site' }), fichier('legal')].filter(Boolean) };
  const proj = config.collections.filter(x => /^projets-/.test(x.name));
  proj.forEach(x => { x.label = { 'projets-p': '📷 Projets photo', 'projets-v': '🎬 Projets vidéo', 'projets-d': '🎨 Projets design' }[x.name] || x.label; });
  const themes = config.collections.find(x => x.name === 'themes'); if (themes) themes.label = '🖼 Bannières (Photo, Vidéo, Design)';
  const plus = { name: 'sections-plus', label: '➕ Sections en plus', editor: { preview: false }, description: 'Ajoutez un bloc (titre, texte, image, boutons) sur l’accueil ou sur n’importe quelle page.',
    files: [Object.assign({}, fichier('sections'), { label: 'Mes sections ajoutées (accueil, pages Photo / Vidéo / Design, À propos, projets)' })] };
  config.collections = [accueil, ...proj, themes, apropos, plus, reglages].filter(Boolean);
}

// ---------- démarrage ----------
(async () => {
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  if (local) config.local_backend = true; // travail sur ordinateur avec « npx decap-server »
  try {
    const r = await fetch('/api/config');
    if (r.ok) { const j = await r.json(); config.backend.repo = j.repo; config.backend.branch = j.branch || 'main'; }
  } catch (e) {}
  if (!config.backend.repo && !local) {
    document.body.innerHTML = '<p style="font:16px system-ui;padding:32px;max-width:560px">Il manque le nom du dépôt GitHub : ajoutez la variable <b>GITHUB_REPO</b> dans les réglages Cloudflare de ce site (voir LISEZMOI).</p>';
    return;
  }
  if (!config.backend.repo) config.backend.repo = 'local/site';
  registerVisuel();
  reorganiser();
  CMS.init({ config });
})();
