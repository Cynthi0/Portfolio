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
                { label: 'Section « Ce qui m’anime ? » (fond bleu nuit)', name: 'anime', widget: 'object', collapsed: true, fields: [
                  TITRE, ACCENT,
                  { label: 'Valeurs', name: 'items', widget: 'list', label_singular: 'valeur', summary: '{{fields.titre}}', collapsed: true, fields: [
                    { label: 'Titre', name: 'titre', widget: 'string' },
                    { label: 'Texte', name: 'texte', widget: 'text' },
                    { label: 'Animation', name: 'anim', widget: 'select', options: [
                      { label: 'Mouvement (traits de vitesse)', value: 'mouvement' }, { label: 'Humain (deux personnes)', value: 'humain' },
                      { label: 'Émotion (battement)', value: 'emotion' }, { label: 'Créativité (points reliés)', value: 'creativite' }] }] }] },
                { label: 'Section « Domaines de compétences »', name: 'competences', widget: 'object', collapsed: true, fields: [
                  ETIQ, TITRE, ACCENT,
                  { label: 'Compétences', name: 'items', widget: 'list', label_singular: 'compétence', summary: '{{fields.titre}}', collapsed: true, fields: [
                    { label: 'Titre', name: 'titre', widget: 'string' }, { label: 'Sous-titre', name: 'texte', widget: 'text' }] }] },
                { label: 'Section « Ma vision » (fond beige)', name: 'vision', widget: 'object', collapsed: true, fields: [
                  TITRE, ACCENT,
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
            { label: 'Témoignages (le premier est aussi affiché en citation)', name: 'liste', widget: 'list', label_singular: 'témoignage', summary: '{{fields.nom}} · {{fields.structure}}', collapsed: true, fields: [
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
              hint: "Ajoutez des blocs à l'accueil (texte, image, boutons) et choisissez où ils apparaissent.", fields: [
              { label: 'Afficher cette section', name: 'visible', widget: 'boolean', default: true },
              { label: 'Emplacement', name: 'position', widget: 'select', default: 'apres-services', options: [
                { label: "Après l'ouverture", value: 'apres-intro' },
                { label: 'Après « Mes projets »', value: 'apres-projets' },
                { label: 'Après « Services / À propos »', value: 'apres-services' },
                { label: 'Après les témoignages', value: 'apres-temoignages' },
                { label: 'Après le contact', value: 'apres-contact' }] },
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
            { label: "Titre du site (onglet du navigateur et Google)", name: 'site_titre', widget: 'string' },
            { label: 'Description pour Google (150 caractères environ)', name: 'description', widget: 'text' },
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
    {
      name: 'portfolio', label: 'Projets', editor: { preview: false },
      description: 'Vos thèmes (Photo, Vidéo, Design) et tous vos projets.',
      files: [{
        name: 'projets', label: 'Thèmes et projets', file: 'content/projets.json',
        fields: [
          { label: 'Les 3 thèmes', name: 'themes', widget: 'list', min: 3, max: 3, allow_add: false, collapsed: true, summary: '{{fields.cle}} · {{fields.nom}}', fields: [
            { label: 'Lettre (ne pas changer)', name: 'cle', widget: 'hidden' },
            { label: 'Nom du thème', name: 'nom', widget: 'string' },
            { label: 'Phrase en haut de la page du thème', name: 'texte', widget: 'text' },
            { label: 'Fond de la page du thème (image, ou vidéo .mp4 pour Vidéo)', name: 'fond', widget: 'file', hint: VIDEO_AIDE, choose_url: false },
            { label: 'Fond sur l’accueil (facultatif)', name: 'fond_accueil', widget: 'file', required: false, hint: 'Image affichée en plein écran sur l’accueil quand ce thème est choisi. Vide = même image que la page du thème.', choose_url: false },
          ] },
          { label: 'Projets', name: 'projets', widget: 'list', label_singular: 'projet', collapsed: true, summary: '{{fields.theme}} · {{fields.titre}} ({{fields.annee}})', add_to_top: true,
            hint: "Glissez les projets pour changer leur ordre : les 3 premiers de chaque thème apparaissent sur l'accueil. Gardez au moins un projet par thème.",
            fields: [
              { label: 'Afficher ce projet sur le site', name: 'visible', widget: 'boolean', default: true },
              THEME(),
              { label: 'Titre', name: 'titre', widget: 'string' },
              { label: 'Identifiant (adresse de la page)', name: 'slug', widget: 'string', required: false, pattern: ['^[a-z0-9-]*$', 'Minuscules, chiffres et tirets seulement'], hint: 'Ex. afrique-coeur-assiette → la page sera #projet-afrique-coeur-assiette. Vide = créé à partir du titre.' },
              { label: 'Client', name: 'client', widget: 'string', required: false },
              { label: 'Année', name: 'annee', widget: 'number', value_type: 'int', default: 2026 },
              { label: 'Catégorie (sert aux filtres)', name: 'categorie', widget: 'string', required: false, hint: 'Ex. Sport, Paysages, Aftermovies, Identités…' },
              { label: 'Votre rôle', name: 'role', widget: 'string', required: false },
              { label: 'Outils utilisés (séparés par des virgules)', name: 'outils', widget: 'string', required: false, hint: 'Ex. Canon EOS 77D, Lightroom' },
              IMG('Image principale', 'image', 'Vignette, fond de la page projet et base des maquettes design.'),
              { label: 'Vidéo du projet (thème Vidéo)', name: 'video', widget: 'file', required: false, hint: VIDEO_AIDE, choose_url: false },
              { label: 'Format de la vidéo', name: 'format', widget: 'select', required: false, default: 'horizontal', options: [{ label: 'Horizontal (16:9)', value: 'horizontal' }, { label: 'Vertical (9:16, réseaux sociaux)', value: 'vertical' }], hint: 'Vertical : le film s’affiche dans un téléphone sur la page du projet.' },
              { label: 'Aperçu en boucle (facultatif)', name: 'apercu', widget: 'file', required: false, choose_url: false, hint: 'Court extrait muet de 5 à 10 s (moins de 2 Mo), utilisé pour les vignettes et le haut de la page. Vide = la vidéo du projet.' },
              { label: 'Diffusion (facultatif)', name: 'diffusion', widget: 'string', required: false, hint: 'Ex. Instagram, avec l’ambassadeur' },
              { label: 'Vidéo haute qualité pour le plein écran (facultatif)', name: 'video_hd', widget: 'file', required: false, choose_url: false, hint: 'Version 1080p de moins de 25 Mo, lue quand on agrandit le film. Vide = la vidéo du projet.' },
              { label: 'Lien Instagram de la vidéo (facultatif)', name: 'instagram', widget: 'string', required: false, hint: 'Ajoute un bouton « Voir sur Instagram ».' },
              { label: 'Supports à montrer (thème Design)', name: 'supports', widget: 'select', multiple: true, required: false, options: [
                { label: 'Affiche', value: 'affiche' }, { label: 'Post Instagram', value: 'post' }, { label: 'Story', value: 'story' },
                { label: 'Carrousel Instagram', value: 'carrousel' }, { label: 'Bannière web', value: 'banniere' }, { label: 'Site web', value: 'web' }] },
              IMG('Photo avant retouche (thème Photo)', 'avant', 'Facultatif. Le comparateur avant/après n’apparaît, sous la série, que si les deux photos (avant et après) sont remplies.'),
              IMG('Photo après retouche (thème Photo)', 'apres'),
              { label: 'Galerie « La série » (thème Photo)', name: 'galerie', widget: 'list', required: false, collapsed: true, field: IMG('Photo', 'image') },
              { label: '01 · Le besoin', name: 'besoin', widget: 'text', required: false },
              { label: '02 · La réalisation', name: 'realisation', widget: 'text', required: false },
              { label: '03 · Le résultat : chiffre', name: 'resultat_chiffre', widget: 'string', required: false, hint: 'Ex. +40 %, 12 000 vues…' },
              { label: '03 · Le résultat : texte', name: 'resultat_texte', widget: 'text', required: false },
              BOUTONS('Boutons sous le récit'),
            ] },
        ],
      }],
    },
  ],
};

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
  CMS.init({ config });
})();
