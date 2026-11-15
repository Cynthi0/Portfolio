// Connexion à l'administration : envoie vers GitHub pour vous identifier.
// Réglages à faire dans Cloudflare (Variables d'environnement) : GITHUB_CLIENT_ID et GITHUB_CLIENT_SECRET.
export async function onRequestGet({ request, env }) {
  if (!env.GITHUB_CLIENT_ID) return new Response('GITHUB_CLIENT_ID manquant dans les réglages Cloudflare.', { status: 500 });
  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const gh = new URL('https://github.com/login/oauth/authorize');
  gh.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  gh.searchParams.set('redirect_uri', `${url.origin}/api/callback`);
  gh.searchParams.set('scope', 'repo,user');
  gh.searchParams.set('state', state);
  return new Response(null, {
    status: 302,
    headers: { Location: gh.toString(), 'Set-Cookie': `cms_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600` },
  });
}
