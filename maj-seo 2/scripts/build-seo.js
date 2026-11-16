// =====================================================================
//  Référencement (lancé automatiquement par Cloudflare à chaque mise à jour)
//  Crée une vraie page par projet et par rubrique (/projets/…, /video/…),
//  avec titre, description et image de partage propres, puis le sitemap.
//  Aucune dépendance : node scripts/build-seo.js
// =====================================================================
const fs = require('fs'), path = require('path');
const R = path.resolve(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
// 0) Sécurité : Cloudflare refuse toute mise en ligne si UN fichier dépasse 25 Mo.
//    On retire ces fichiers de la version publiée (ils restent sur GitHub) pour que le reste du site se mette à jour.
{ const LIM = 25 * 1024 * 1024, trop = [];
  const walk = d => { for (const n of fs.readdirSync(d)) { if (n === '.git' || n === 'node_modules') continue; const p = path.join(d, n), st = fs.statSync(p);
    if (st.isDirectory()) walk(p); else if (st.size > LIM) { trop.push(`${path.relative(R, p)} (${(st.size / 1048576).toFixed(1)} Mo)`); fs.unlinkSync(p); } } };
  walk(R);
  if (trop.length) console.warn('ATTENTION, fichiers de plus de 25 Mo retirés du site (à remplacer par une version plus légère dans l’admin) :\n  ' + trop.join('\n  ')); }
// 1) Les projets sont rangés un fichier par projet (content/projets/*.json) pour l'admin :
//    on les rassemble ici dans content/projets.json, que lit le site.
{ const dir = path.join(R, 'content/projets'), th = path.join(R, 'content/themes.json');
  if (fs.existsSync(dir) && fs.existsSync(th)) {
    const list = fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => { try { const p = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); p.slug = String(p.slug || f.replace(/\.json$/, '')).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); return p; } catch (e) { console.warn('Projet illisible :', f); return null; } }).filter(Boolean);
    list.sort((a, b) => (a.ordre ?? 999) - (b.ordre ?? 999) || String(a.titre).localeCompare(String(b.titre)));
    fs.writeFileSync(path.join(R, 'content/projets.json'), JSON.stringify({ themes: JSON.parse(fs.readFileSync(th, 'utf8')).themes, projets: list }, null, 2));
    console.log(`Projets : ${list.length} rassemblés`);
  } }
// 2) L'accueil est rangé une section par fichier (content/accueil/*.json) : on recompose content/accueil.json.
{ const d = path.join(R, 'content/accueil'); if (fs.existsSync(d)) {
    const r = n => { const f = path.join(d, n + '.json'); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : undefined; };
    const prev = fs.existsSync(path.join(R, 'content/accueil.json')) ? J('content/accueil.json') : {};
    const out = Object.assign({}, prev);
    for (const k of ['intro', 'outils', 'projets', 'services']) { const v = r(k); if (v) out[k] = v; }
    const ap = r('apropos'), page = r('apropos-page'); if (ap) out.apropos = Object.assign({}, ap, { page: page || (prev.apropos || {}).page || {} });
    fs.writeFileSync(path.join(R, 'content/accueil.json'), JSON.stringify(out, null, 2)); console.log('Accueil recomposé');
  } }
const G = J('content/general.json'), P = J('content/projets.json'), A = J('content/accueil.json');
const SITE = String(G.site_url || process.env.SITE_URL || process.env.CF_PAGES_URL || '').replace(/\/+$/, '');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const cut = (s, n = 155) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s; };
const abs = u => !u ? '' : /^https?:/.test(u) ? u : SITE + '/' + String(u).replace(/^\/+/, '');
const src = fs.readFileSync(path.join(R, 'index.html'), 'utf8').replace(/<!--seo-->[\s\S]*?<!--\/seo-->\n?/g, '');
const ROUTE = { P: 'photo', V: 'video', D: 'design' };
const head = ({ title, desc, url, img, hash, extra }) => `<!--seo-->
${hash ? `<base href="/">\n<script>if(!location.hash)history.replaceState(null,'','/#${hash}'+location.search)</script>\n` : ''}<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${SITE ? `<link rel="canonical" href="${esc(SITE + url)}">\n<meta property="og:url" content="${esc(SITE + url)}">\n` : ''}<meta property="og:type" content="website">
<meta property="og:locale" content="fr_CH">
<meta property="og:site_name" content="Cynthia.inmotion">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
${img && SITE ? `<meta property="og:image" content="${esc(abs(img))}">\n<meta name="twitter:card" content="summary_large_image">\n` : ''}${extra || ''}<!--/seo-->
`;
const page = (o) => src.replace(/<title>[\s\S]*?<\/title>\n?/, '').replace(/<meta name="description"[^>]*>\n?/, '').replace(/(<meta charset="[^"]*">\n?)/i, '$1' + head(o));
const pages = [], SEO = { pages: {}, themes: {} };
// Textes de référencement par défaut (modifiables dans l'admin : champs « Référencement Google »)
const DEF = {
  home: { title: 'Photographe et vidéaste à Genève | Cynthia.inmotion',
    desc: "Photographe et vidéaste à Genève : événements sportifs, trail et running, associations et marques. Photo, vidéo, montage et design graphique. Devis sur demande." },
  P: { title: 'Photographe événementiel et sportif à Genève | Cynthia.inmotion',
    desc: "Photographe à Genève pour vos événements sportifs, courses à pied, trails, associations, conférences et portraits : des images vivantes de vos moments forts.",
    titre_txt: 'Photographe', accent: 'à Genève',
    texte: "Photographe basée à Genève, je couvre les événements sportifs (courses à pied, trails, ultra-trails), les manifestations associatives, les conférences et les portraits, dans tout le canton et le Grand Genève. Des images naturelles et vivantes, livrées rapidement et prêtes pour vos réseaux sociaux, votre site et la presse." },
  V: { title: 'Vidéaste à Genève : tournage et montage vidéo | Cynthia.inmotion',
    desc: "Vidéaste à Genève : aftermovies, reels Instagram, interviews et films de présentation pour événements sportifs, associations et entreprises du canton.",
    titre_txt: 'Vidéaste', accent: 'à Genève',
    texte: "Vidéaste à Genève, je filme et monte vos aftermovies, reels Instagram, interviews et films de présentation. Événements sportifs, associations, entreprises et institutions du canton : du tournage au montage final, je m'occupe de tout pour faire revivre vos instants forts." },
  D: { title: 'Graphiste et webdesign à Genève | Cynthia.inmotion',
    desc: "Graphiste à Genève : identités visuelles, affiches, visuels pour les réseaux sociaux et sites web pour associations, événements et petites structures.",
    titre_txt: 'Graphiste', accent: 'à Genève',
    texte: "Graphiste et webdesigner à Genève, je crée des identités visuelles, des affiches, des visuels pour les réseaux sociaux et des sites web pour les associations, les événements sportifs et les petites structures du canton." },
  apropos: { title: 'Cynthia Guerrero, photographe et vidéaste à Genève | Cynthia.inmotion' }
};
const KIND = { P: 'Photo', V: 'Vidéo', D: 'Design' };
const write = (url, o) => { const dir = path.join(R, url); fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, 'index.html'), page({ ...o, url })); pages.push(url); SEO.pages[url] = { title: o.title, desc: o.desc }; };
// données structurées (Google) : entreprise locale à Genève
const K = fs.existsSync(path.join(R, 'content/contact.json')) ? J('content/contact.json') : {};
const LD = { '@context': 'https://schema.org', '@type': 'ProfessionalService', name: 'Cynthia.inmotion',
  description: G.seo_description || DEF.home.desc, url: SITE || undefined, image: SITE ? abs('b/photo-accueil.webp') : undefined,
  email: K.email || undefined, founder: { '@type': 'Person', name: 'Cynthia Guerrero', jobTitle: 'Photographe et vidéaste' },
  address: { '@type': 'PostalAddress', addressLocality: 'Genève', addressRegion: 'GE', addressCountry: 'CH' },
  areaServed: [{ '@type': 'City', name: 'Genève' }, { '@type': 'AdministrativeArea', name: 'Canton de Genève' }, { '@type': 'Place', name: 'Grand Genève' }],
  knowsAbout: ['Photographie événementielle', 'Photographie sportive', 'Vidéo', 'Montage vidéo', 'Design graphique', 'Webdesign'],
  sameAs: [K.instagram].filter(Boolean) };
const ld = `<script type="application/ld+json">${JSON.stringify(LD).replace(/</g, '\\u003c')}</script>\n`;
// accueil
const home = { title: G.seo_titre || DEF.home.title, desc: cut(G.seo_description || DEF.home.desc, 165), img: 'b/photo-accueil.webp', extra: ld };
fs.writeFileSync(path.join(R, 'index.html'), page({ ...home, url: '/' })); pages.push('/'); SEO.pages['/'] = { title: home.title, desc: home.desc };
// rubriques
for (const t of P.themes) { const d = DEF[t.cle] || {};
  SEO.themes[t.cle] = { titre_txt: d.titre_txt, accent: d.accent, texte: t.seo_texte || d.texte || '' };
  write(`/${ROUTE[t.cle]}/`, { hash: ROUTE[t.cle], title: t.seo_titre || d.title || `${t.nom} à Genève | Cynthia.inmotion`, desc: cut(t.seo_description || d.desc || t.texte, 165), img: t.affiche || t.fond_accueil || (/\.(mp4|webm)$/i.test(t.fond || '') ? '' : t.fond) }); }
write('/a-propos/', { hash: 'a-propos', title: DEF.apropos.title, desc: cut(A.apropos?.chapo || DEF.home.desc), img: A.apropos?.portrait });
// projets
for (const p of P.projets) { if (p.visible === false || !p.titre || !p.slug) continue;
  const th = P.themes.find(t => t.cle === p.theme) || {};
  write(`/projets/${p.slug}/`, { hash: 'projet-' + p.slug, title: p.seo_titre || `${p.titre} · ${KIND[p.theme] || th.nom || ''}${/gen[eè]v/i.test(p.titre) ? '' : ' à Genève'} | Cynthia.inmotion`, desc: cut(p.seo_description || p.besoin || p.realisation || p.planche_texte || `${th.nom} à Genève : ${p.titre}${p.client ? ', pour ' + p.client : ''}.`), img: p.image }); }
fs.writeFileSync(path.join(R, 'content/seo.json'), JSON.stringify(SEO, null, 2));
// sitemap + robots
if (SITE) {
  fs.writeFileSync(path.join(R, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(u => `  <url><loc>${esc(SITE + u)}</loc></url>`).join('\n')}\n</urlset>\n`);
  fs.writeFileSync(path.join(R, 'robots.txt'), `User-agent: *\nDisallow: /admin/\nSitemap: ${SITE}/sitemap.xml\n`);
}
console.log(`SEO : ${pages.length} pages${SITE ? '' : " (adresse du site manquante : pas de sitemap)"}`);
