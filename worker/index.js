// Entry point for Cloudflare Workers (git-integrated "Workers Builds" deploy,
// triggered via `npx wrangler deploy`, configured by wrangler.jsonc at repo root).
//
// This is a thin router in front of the same handlers used by the classic
// Cloudflare Pages Functions convention (functions/api/*.js) — those files
// still export onRequestGet/onRequestPost taking { request, env }, so they
// work here unmodified, just dispatched manually instead of by file-based
// routing. Everything that isn't an /api/* route falls through to the
// static assets binding (the plain HTML/CSS/JS/images at the repo root).

import { onRequestGet as contentGet, onRequestPost as contentPost } from '../functions/api/content.js';
import { onRequestPost as loginPost } from '../functions/api/login.js';
import { onRequestGet as meGet } from '../functions/api/me.js';
import { onRequestPost as logoutPost } from '../functions/api/logout.js';

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    const ctxObj = { request, env, ctx };

    if (pathname === '/api/content') {
      if (request.method === 'GET') return contentGet(ctxObj);
      if (request.method === 'POST') return contentPost(ctxObj);
    }
    if (pathname === '/api/login' && request.method === 'POST') return loginPost(ctxObj);
    if (pathname === '/api/me' && request.method === 'GET') return meGet(ctxObj);
    if (pathname === '/api/logout' && request.method === 'POST') return logoutPost(ctxObj);

    return env.ASSETS.fetch(request);
  },
};
