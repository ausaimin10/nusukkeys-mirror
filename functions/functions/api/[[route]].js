// NusukKeys — Cloudflare Pages Function, catch-all for /api/*
// Zero dependencies, no Node imports.
//
// Two modes:
//  1. D1 bound (env.DB): state lives in D1 (see schema.sql), queried
//     per endpoint by ./d1.mjs — every request touches only the rows
//     it needs. The free tier counts every row a query SCANS against
//     its 5,000,000 rows-read/day limit, so no query may scan the
//     13,721-row codes table: the seed check reads 1 row (LIMIT 1,
//     never COUNT(*)), and code lookups use the NOCASE index.
//     The per-user used set lives in the `used` table, so the
//     one-time-per-user exclusion survives across requests, isolates,
//     redeployments and devices (for a real NG- key).
//     On the very first request with an empty `codes` table, the
//     table is seeded from /data/seed.json. The recommended path is
//     to seed once with seed.sql instead (wrangler d1 execute), so
//     the first visitor never waits for 13,721 inserts.
//  2. No D1 bound: in-memory seed fallback, like the original site's
//     `offline: true` mode. Responses carry offline:true. State does
//     NOT persist across Cloudflare isolates in this mode.

import { createState, handleApi } from './core.mjs';
import { handleApiD1 } from './d1.mjs';
import { kvGetTotal, kvGetOnline, kvRecordVisitor, kvTouchOnline } from './kv.mjs';
import { firebaseGetOnline } from './presence.mjs';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    // CORS: the API answers only public stats and the caller's own
    // data (keyed by the key they present), so any origin may call it.
    // The static mirrors need this to fetch live visitor stats from
    // the primary host, which holds the only database.
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' },
  });
}

// ------------------------------------------------------- in-memory fallback

let memoryState = null;

// Compact code form (codes.json) -> full code object for createState.
function fromCompact(o) {
  return {
    id: o.i,
    rid: Number(o.r) || 0,
    code: o.c,
    name: o.n || '',
    country: '🕋',
    copies: Number(o.p) || 0,
    device_id: o.d || 'community-import',
    created_at: o.t || '',
  };
}

async function loadMemoryState(request) {
  if (memoryState) return memoryState;
  const res = await fetch(new URL('/codes.json', request.url));
  if (!res.ok) throw new Error('seed fetch failed: ' + res.status);
  const data = await res.json();
  memoryState = createState((data.codes || []).map(fromCompact));
  return memoryState;
}

// ------------------------------------------------------------ D1 self-seed
// Fallback only — prefer `wrangler d1 execute --file=seed.sql` once.

async function ensureSeeded(db, request) {
  // Cheap 1-row check: the old SELECT COUNT(*) here read all 13,721
  // code rows on EVERY api call and burned the free tier's daily
  // row-read limit (5M) in one day. LIMIT 1 stops after the first row.
  let row = null;
  try {
    row = await db.prepare('SELECT 1 AS x FROM codes LIMIT 1').first();
  } catch {
    return false; // tables not created yet (schema.sql not applied)
  }
  if (row) return true;
  const res = await fetch(new URL('/codes.json', request.url));
  if (!res.ok) throw new Error('seed fetch failed: ' + res.status);
  const data = await res.json();
  const state = createState((data.codes || []).map(fromCompact));
  const stmts = [];
  for (const c of state.codes) {
    stmts.push(db.prepare(
      'INSERT INTO codes (id, rid, code, name, country, copies, device_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(c.id, c.rid, c.code, c.name, c.country, c.copies, c.device_id, c.created_at));
  }
  stmts.push(db.prepare("INSERT OR REPLACE INTO meta (k, v) VALUES ('total_codes', ?)").bind(String(state.codes.length)));
  stmts.push(db.prepare("INSERT OR REPLACE INTO meta (k, v) VALUES ('used_total', ?)").bind(String(state.stats.used_total)));
  stmts.push(db.prepare("INSERT OR REPLACE INTO meta (k, v) VALUES ('used_today', '0')"));
  stmts.push(db.prepare("INSERT OR REPLACE INTO meta (k, v) VALUES ('today', ?)").bind(state.stats.today));
  for (let i = 0; i < stmts.length; i += 100) await db.batch(stmts.slice(i, i + 100));
  return true;
}

// ------------------------------------------------------------------ handler

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const route = context.params && context.params.route;
  const endpoint = Array.isArray(route)
    ? route.join('/')
    : url.pathname.replace(/^\/api\//, '').split('/')[0];

  if (request.method === 'OPTIONS') {
    // CORS preflight from the static mirrors.
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  if (request.method !== 'POST') {
    // GET /api/* -> same 401 as an unauthenticated call.
    return json({ ok: false, error: 'no_key' }, 401);
  }

  // Parse the request body exactly once.
  let body = {};
  try {
    const text = await request.text();
    body = text ? JSON.parse(text) : {};
  } catch {
    return json({ ok: false, error: 'server' }, 400);
  }

  // D1 mode, with fallback to in-memory seed mode if D1 fails —
  // the same fallback the original site used (offline:true).
  if (env && env.DB) {
    try {
      await ensureSeeded(env.DB, request);
      const result = await handleApiD1(env.DB, endpoint, body, new Date(), env);
      return json(result.body, result.status);
    } catch (e) {
      console.error('D1 error, falling back to in-memory seed mode:', e);
    }
  }

  try {
    const state = await loadMemoryState(request);
    const result = handleApi(state, endpoint, body);
    // In-memory fallback: state lives only in this isolate. The
    // visitor counters still come from KV when it is bound, so they
    // show the real totals (and keep moving) even while D1 reads are
    // exhausted — the in-memory 1/1 is only the last resort. New
    // visitors are recorded in KV here, because the D1 touchVisitor
    // never runs while D1 is unreachable.
    const bodyOut = { ...result.body, offline: true };
    if (result.body && result.body.ok && result.body.me && result.body.me.key) {
      await kvRecordVisitor(env, result.body.me.key);
    }
    // Ping in fallback mode: the in-memory handler only records
    // presence in this isolate, so refresh the KV online key too —
    // otherwise the realtime "active now" count drops to 1 while D1
    // is unreachable, even though real users keep pinging every 60s.
    // Ping never bumps the visitor total (kvTouchOnline only).
    if (endpoint === 'ping' && result.body && result.body.ok && typeof body.key === 'string' && body.key) {
      await kvTouchOnline(env, body.key);
    }
    if (bodyOut.stats) {
      const [kvTotal, kvOnline, fbOnline] = await Promise.all([kvGetTotal(env), kvGetOnline(env), firebaseGetOnline()]);
      if (kvTotal !== null) bodyOut.stats.visitors_total = Math.max(Number(bodyOut.stats.visitors_total) || 0, kvTotal);
      if (kvOnline !== null) bodyOut.stats.visitors_online = Math.max(Number(bodyOut.stats.visitors_online) || 0, kvOnline);
      if (fbOnline !== null) bodyOut.stats.visitors_online = Math.max(Number(bodyOut.stats.visitors_online) || 0, fbOnline);
    }
    return json(bodyOut, result.status);
  } catch (e) {
    console.error(e);
    return json({ ok: false, error: 'server' }, 500);
  }
}
