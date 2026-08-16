import { requireSession } from '../_lib/auth.js';

export async function onRequestGet({ request, env }) {
  const session = await requireSession(request, env);
  return new Response(JSON.stringify({ ok: !!session }), {
    status: session ? 200 : 401,
    headers: { 'content-type': 'application/json' },
  });
}
