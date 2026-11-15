// Indique à l'administration quel dépôt GitHub modifier (variable GITHUB_REPO, ex. « cynthia/cynthia-inmotion »).
export async function onRequestGet({ env }) {
  return Response.json({ repo: env.GITHUB_REPO || '', branch: env.GITHUB_BRANCH || 'main' }, { headers: { 'Cache-Control': 'no-store' } });
}
