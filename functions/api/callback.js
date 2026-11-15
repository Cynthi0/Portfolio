// Retour de GitHub après connexion : on échange le code contre une clé, puis on la transmet à l'administration.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code'), state = url.searchParams.get('state');
  const saved = (request.headers.get('Cookie') || '').match(/(?:^|;\s*)cms_state=([^;]+)/);
  if (!code || !saved || saved[1] !== state) return reply(url.origin, 'error', { error: 'La connexion a expiré. Fermez cette fenêtre et réessayez.' });
  const r = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': 'cynthia-inmotion-admin' },
    body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: `${url.origin}/api/callback` }),
  });
  const data = await r.json().catch(() => ({}));
  if (!data.access_token) return reply(url.origin, 'error', { error: data.error_description || 'GitHub a refusé la connexion.' });
  return reply(url.origin, 'success', { token: data.access_token, provider: 'github' });
}
function reply(origin, status, content) {
  const msg = JSON.stringify(`authorization:github:${status}:${JSON.stringify(content)}`);
  const html = `<!doctype html><html lang="fr"><meta charset="utf-8"><title>Connexion…</title><body style="font:15px system-ui;padding:24px;background:#1C2938;color:#F6EFE4">Connexion en cours…
<script>
(function () {
  var ORIGIN = ${JSON.stringify(origin)};
  function receive(e) {
    if (e.origin !== ORIGIN) return;
    window.opener.postMessage(${msg}, e.origin);
    window.removeEventListener('message', receive);
    setTimeout(function () { window.close(); }, 400);
  }
  window.addEventListener('message', receive, false);
  if (window.opener) window.opener.postMessage('authorizing:github', ORIGIN);
  else document.body.textContent = 'Ouvrez l’administration depuis /admin.';
})();
</script></body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Set-Cookie': 'cms_state=; Path=/api; Max-Age=0' } });
}
