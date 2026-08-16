import { clearSessionCookie } from '../_lib/auth.js';

export async function onRequestPost({ request }) {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json', 'Set-Cookie': clearSessionCookie(request) },
  });
}
