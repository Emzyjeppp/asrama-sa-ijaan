import { requireSession } from '../_lib/auth.js';

const MAX_NAME_LEN = 80;
const MAX_ROLE_LEN = 60;
const VALID_TIERS = new Set(['ketua', 'inti', 'seksi']);
const PHONE_RE = /^62\d{8,13}$/; // raw wa.me format: country code 62, no + or leading 0
const MAX_BODY_BYTES = 20000;

export async function onRequestGet({ env }) {
  const data = await env.ASRAMA_KV.get('content', 'json');
  if (!data) {
    return new Response(JSON.stringify({ ok: false, reason: 'empty' }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    });
  }
  return new Response(JSON.stringify({ ok: true, data }), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=60',
    },
  });
}

function validatePayload(body) {
  const errors = [];
  if (!body || typeof body !== 'object') return ['Payload tidak valid.'];

  if (!Array.isArray(body.pengurus)) {
    errors.push('pengurus harus berupa array.');
  } else {
    if (body.pengurus.length < 1 || body.pengurus.length > 20) {
      errors.push('Jumlah pengurus harus antara 1 dan 20.');
    }
    let ketuaCount = 0;
    body.pengurus.forEach((p, i) => {
      if (!p || typeof p !== 'object') {
        errors.push(`pengurus[${i}] tidak valid.`);
        return;
      }
      const nama = String(p.nama ?? '').trim();
      const jabatan = String(p.jabatan ?? '').trim();
      if (!nama) errors.push(`pengurus[${i}].nama kosong.`);
      if (nama.length > MAX_NAME_LEN) errors.push(`pengurus[${i}].nama terlalu panjang.`);
      if (!jabatan) errors.push(`pengurus[${i}].jabatan kosong.`);
      if (jabatan.length > MAX_ROLE_LEN) errors.push(`pengurus[${i}].jabatan terlalu panjang.`);
      if (!VALID_TIERS.has(p.tier)) errors.push(`pengurus[${i}].tier harus salah satu dari ketua/inti/seksi.`);
      if (p.tier === 'ketua') ketuaCount++;
    });
    if (ketuaCount !== 1) errors.push('Harus ada tepat 1 pengurus dengan tier "ketua".');
  }

  if (!body.kontak || typeof body.kontak !== 'object') {
    errors.push('kontak harus berupa object.');
  } else {
    const nomor = String(body.kontak.whatsapp_nomor ?? '').trim();
    const tampil = String(body.kontak.whatsapp_tampil ?? '').trim();
    const namaKontak = String(body.kontak.kontak_nama ?? '').trim();
    if (!PHONE_RE.test(nomor)) {
      errors.push('kontak.whatsapp_nomor harus format 62xxxxxxxxxx (tanpa + atau 0 di depan).');
    }
    if (!tampil) errors.push('kontak.whatsapp_tampil kosong.');
    if (tampil.length > 40) errors.push('kontak.whatsapp_tampil terlalu panjang.');
    if (!namaKontak) errors.push('kontak.kontak_nama kosong.');
    if (namaKontak.length > MAX_NAME_LEN) errors.push('kontak.kontak_nama terlalu panjang.');
  }

  return errors;
}

export async function onRequestPost({ request, env }) {
  const session = await requireSession(request, env);
  if (!session) {
    return new Response(JSON.stringify({ ok: false, reason: 'unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return new Response(JSON.stringify({ ok: false, reason: 'payload_too_large' }), {
      status: 413,
      headers: { 'content-type': 'application/json' },
    });
  }

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response(JSON.stringify({ ok: false, reason: 'invalid_json' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const errors = validatePayload(body);
  if (errors.length) {
    return new Response(JSON.stringify({ ok: false, reason: 'validation', errors }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const clean = {
    pengurus: body.pengurus.map((p) => ({
      nama: String(p.nama).trim(),
      jabatan: String(p.jabatan).trim(),
      tier: p.tier,
    })),
    kontak: {
      whatsapp_nomor: String(body.kontak.whatsapp_nomor).trim(),
      whatsapp_tampil: String(body.kontak.whatsapp_tampil).trim(),
      kontak_nama: String(body.kontak.kontak_nama).trim(),
    },
    updated_at: new Date().toISOString(),
  };

  await env.ASRAMA_KV.put('content', JSON.stringify(clean));

  return new Response(JSON.stringify({ ok: true, data: clean }), {
    headers: { 'content-type': 'application/json' },
  });
}
