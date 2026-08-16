import { createSessionCookie } from '../_lib/auth.js';

const WINDOW_SECONDS = 600; // 10 min
const MAX_ATTEMPTS = 8;

async function tooManyAttempts(env, ip) {
  const key = `login_attempts:${ip}`;
  const count = Number((await env.ASRAMA_KV.get(key)) || '0');
  if (count >= MAX_ATTEMPTS) return true;
  await env.ASRAMA_KV.put(key, String(count + 1), { expirationTtl: WINDOW_SECONDS });
  return false;
}

export async function onRequestPost({ request, env }) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (await tooManyAttempts(env, ip)) {
    return new Response(JSON.stringify({ ok: false, reason: 'rate_limited' }), {
      status: 429,
      headers: { 'content-type': 'application/json' },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, reason: 'invalid_json' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const password = typeof body.password === 'string' ? body.password : '';
  if (!env.ADMIN_PASSWORD || password !== env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ ok: false, reason: 'invalid_password' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  const cookie = await createSessionCookie(env);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'Set-Cookie': cookie },
  });
}
