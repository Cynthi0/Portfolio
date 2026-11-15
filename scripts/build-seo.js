// =====================================================================
//  Référencement (lancé automatiquement par Cloudflare à chaque mise à jour)
//  Crée une vraie page par projet et par rubrique (/projets/…, /video/…),
//  avec titre, description et image de partage propres, puis le sitemap.
//  Aucune dépendance : node scripts/build-seo.js
// =====================================================================
const fs = require('fs'), path = require('path');
const R = path.resolve(__dirname, '..');
const J = f => JSON.parse(fs.readFileSync(path.join(R, f), 'utf8'));
// 1) Les projets sont rangés un fichier par projet (content/projets/*.json) pour l'admin :
//    on les rassemble ici dans content/projets.json, que lit le site.
{ const dir = path.join(R, 'content/projets'), th = path.join(R, 'content/themes.json');
  if (fs.existsSync(dir) && fs.existsSync(th)) {
    const list = fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => { try { const p = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); if (!p.slug) p.slug = f.replace(/\.json$/, ''); return p; } catch (e) { console.warn('Projet illisible :', f); return null; } }).filter(Boolean);
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
const head = ({ title, desc, url, img, hash }) => `<!--seo-->
${hash ? `<base href="/">\n<script>if(!location.hash)history.replaceState(null,'','/#${hash}'+location.search)</script>\n` : ''}<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${SITE ? `<link rel="canonical" href="${esc(SITE + url)}">\n<meta property="og:url" content="${esc(SITE + url)}">\n` : ''}<meta property="og:type" content="website">
<meta property="og:site_name" content="Cynthia.inmotion">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
${img && SITE ? `<meta property="og:image" content="${esc(abs(img))}">\n<meta name="twitter:card" content="summary_large_image">\n` : ''}<!--/seo-->
`;
const page = (o) => src.replace(/<title>[\s\S]*?<\/title>\n?/, '').replace(/<meta name="description"[^>]*>\n?/, '').replace(/(<meta charset="[^"]*">\n?)/i, '$1' + head(o));
const pages = [];
const write = (url, o) => { const dir = path.join(R, url); fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, 'index.html'), page({ ...o, url })); pages.push(url); };
// accueil
const home = { title: G.site_titre || 'Cynthia.inmotion', desc: cut(G.description || A.intro?.texte), img: 'b/photo-accueil.webp' };
fs.writeFileSync(path.join(R, 'index.html'), page({ ...home, url: '/' })); pages.push('/');
// rubriques
for (const t of P.themes) write(`/${ROUTE[t.cle]}/`, { hash: ROUTE[t.cle], title: `${t.nom} · Cynthia.inmotion, Genève`, desc: cut(t.texte), img: t.affiche || t.fond_accueil || (/\.(mp4|webm)$/i.test(t.fond || '') ? '' : t.fond) });
write('/a-propos/', { hash: 'a-propos', title: 'À propos · Cynthia.inmotion, Genève', desc: cut(A.apropos?.chapo), img: A.apropos?.portrait });
// projets
for (const p of P.projets) { if (p.visible === false || !p.titre || !p.slug) continue;
  const th = P.themes.find(t => t.cle === p.theme) || {};
  write(`/projets/${p.slug}/`, { hash: 'projet-' + p.slug, title: `${p.titre} · ${th.nom || ''} · Cynthia.inmotion`, desc: cut(p.besoin || p.realisation || p.planche_texte || `${th.nom} : ${p.titre}${p.client ? ', pour ' + p.client : ''}.`), img: p.image }); }
// sitemap + robots
if (SITE) {
  fs.writeFileSync(path.join(R, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(u => `  <url><loc>${esc(SITE + u)}</loc></url>`).join('\n')}\n</urlset>\n`);
  fs.writeFileSync(path.join(R, 'robots.txt'), `User-agent: *\nDisallow: /admin/\nSitemap: ${SITE}/sitemap.xml\n`);
}
console.log(`SEO : ${pages.length} pages${SITE ? '' : " (adresse du site manquante : pas de sitemap)"}`);
