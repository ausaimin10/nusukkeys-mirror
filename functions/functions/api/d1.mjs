// NusukKeys — D1 adapter for the Cloudflare Pages Function.
// Per-endpoint SQL against the D1 schema (see schema.sql).
// Same API contract and response shapes as api-core.mjs (the local
// server), so the frontend works unchanged on both backends.
//
// Visitor counters also live in KV (see ./kv.mjs): KV has its own
// free limit, so the counters keep working even while D1's daily
// row-read limit is exhausted. D1 remains the system of record;
// KV is the display source that survives a D1 read outage.

import { kvGetTotal, kvBumpTotal, kvTouchOnline, kvGetOnline, kvSetTotal } from './kv.mjs';
import { firebaseGetOnline } from './presence.mjs';
//
// Why this exists instead of loading the whole table (the old
// loadFromD1 approach): D1's free tier allows 5,000,000 rows read
// per day. Loading all 13,721 codes on every API request would burn
// that in ~350 requests. Every query here touches only the rows it
// needs, using the indexes in schema.sql:
//   session/stats/queue/list/copy/report/undo/share: ~1-70 rows each.
// The one exception is deep offset paging of /api/list (remaining/all),
// which reads offset+60 rows — the same as any offset-paged list.
//
// Storage notes (D1 mode only; the local server keeps its own format):
//   - visitors, daily_copies and shares are real tables here, not
//     JSON blobs in meta — so they stay small and indexed.
//   - The total code count lives in meta.total_codes and is maintained
//     incrementally (set at seed time, +1 per shared code), because
//     COUNT(*) over the whole table would cost 13,721 reads per call.
//   - Visitor "last seen" is written at most once per user per 60
//     seconds, so a page load that makes several API calls costs one
//     visitor write, not five (D1 free: 100,000 rows written/day).

export function todayStr(date = new Date()) {
  return date.toISOString().slice(0, 10); // UTC date
}

function randStr(n, alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789') {
  let s = '';
  for (let i = 0; i < n; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}

export function normalizeKey(s) {
  // Same rule as api-core / the frontend: NG- + 8 alphanumerics,
  // or a bare 8-char code.
  const m = String(s || '').match(/NG-[A-Za-z0-9]{8}/i) ||
    String(s || '').trim().match(/^([A-Za-z0-9]{8})$/);
  if (!m) return null;
  const raw = m[0];
  return raw.length === 8 ? 'NG-' + raw : 'NG-' + raw.slice(3);
}

function parseCodeFromText(s) {
  const text = String(s || '');
  if (!text.trim()) return null;
  const m = text.match(/NG-[A-Za-z0-9]{8}/i);
  if (m) return 'NG-' + m[0].slice(3);
  const bare = text.trim().match(/^([A-Za-z0-9]{8})$/);
  if (bare) return 'NG-' + bare[1];
  return null;
}

function publicCode(c) {
  return {
    id: c.id, code: c.code, name: c.name || '', country: c.country || '🕋',
    copies: Number(c.copies) || 0, rid: Number(c.rid) || 0,
    device_id: c.device_id || '', created_at: c.created_at || '',
  };
}

// ------------------------------------------------------------ meta helpers

async function metaGet(db, k) {
  const row = await db.prepare('SELECT v FROM meta WHERE k = ?').bind(k).first();
  return row ? row.v : null;
}

async function metaSet(db, k, v) {
  await db.prepare('INSERT OR REPLACE INTO meta (k, v) VALUES (?, ?)').bind(k, String(v)).run();
}

// Roll the global daily counter when the UTC date changes.
// Returns the current date string.
async function ensureToday(db, now = new Date()) {
  const today = todayStr(now);
  const stored = await metaGet(db, 'today');
  if (stored !== today) {
    await db.batch([
      db.prepare("INSERT OR REPLACE INTO meta (k, v) VALUES ('today', ?)").bind(today),
      db.prepare("INSERT OR REPLACE INTO meta (k, v) VALUES ('used_today', '0')"),
      db.prepare("INSERT OR REPLACE INTO meta (k, v) VALUES ('added_today', '0')"),
    ]);
  }
  return today;
}

// ------------------------------------------------------------ user helpers

async function getUser(db, key) {
  if (!key) return null;
  return db.prepare('SELECT key, anon, created_at FROM users WHERE key = ?').bind(key).first();
}

async function ensureUser(db, key, anon, now = new Date()) {
  const u = await getUser(db, key);
  if (u) return u;
  await db.prepare('INSERT INTO users (key, anon, created_at) VALUES (?, ?, ?)')
    .bind(key, anon ? 1 : 0, now.toISOString()).run();
  return { key, anon: !!anon, created_at: now.toISOString() };
}

// Visitor "last seen": write-only, no read. A SELECT here would cost
// a D1 read on every session call, and when the daily read limit is
// exhausted that read fails and the visitor is never counted — the
// "total users" figure then freezes and undercounts. Instead:
//   - INSERT OR IGNORE adds a brand-new visitor with no read; if it
//     actually inserted a row (changes === 1) the meta visitors_total
//     counter is bumped once. A returning visitor is ignored.
//   - A returning visitor refreshes last_seen with a conditional
//     UPDATE that only touches the row when it is stale (>5 min old);
//     D1 counts rows actually changed, so a fresh row costs no write.
//     The 5-minute staleness (was 60s) is deliberate: at 60s, the
//     ping + stats poll together cost ~1 write per visitor per
//     minute, and that background burn exhausted the 100k/day D1
//     row-write limit on 2026-11-08, about an hour after the daily
//     reset. At 5 min the same traffic costs ~5x fewer writes.
// One page load (several API calls) still costs at most one visitor
// write, and a new visitor is counted even while reads are exhausted.
async function touchVisitor(db, key, now = new Date(), env = null) {
  const ms = now.getTime();
  const ins = await db.prepare('INSERT OR IGNORE INTO visitors (user_key, last_seen) VALUES (?, ?)')
    .bind(key, ms).run();
  if (ins.meta && ins.meta.changes === 1) {
    await db.prepare("UPDATE meta SET v = CAST(v AS INTEGER) + 1 WHERE k = 'visitors_total'").run();
    // New visitor: the total grows by 1 in KV too, so the displayed
    // total keeps moving even while D1 reads are exhausted.
    await kvBumpTotal(env);
  } else {
    await db.prepare('UPDATE visitors SET last_seen = ? WHERE user_key = ? AND last_seen < ?')
      .bind(ms, key, ms - 300 * 1000).run();
  }
  // Mirror the last-seen to KV (best-effort, at most once per 5 min
  // per visitor) so "active now" survives a D1 read outage too.
  await kvTouchOnline(env, key, now);
}

async function copiedTodayCount(db, key, today) {
  const row = await db.prepare('SELECT count FROM daily_copies WHERE user_key = ? AND date = ?')
    .bind(key, today).first();
  return row ? Number(row.count) || 0 : 0;
}

async function meFor(db, key, now = new Date()) {
  const user = await getUser(db, key);
  if (!user) return null;
  const today = todayStr(now);
  const [copiedRow, totalRow, mineRow, todayRow] = await Promise.all([
    db.prepare('SELECT COUNT(*) AS n FROM used WHERE user_key = ?').bind(key).first(),
    metaGet(db, 'total_codes'),
    // Exact match on purpose: `code` has a UNIQUE index, so this reads
    // 1 row. A NOCASE match would need idx_codes_code_ci and would
    // scan all 13,721 codes without it. If the user typed their key in
    // a different case than stored, `mine` is just null and the "your
    // key copied N×" line is omitted — the identity still works.
    db.prepare('SELECT code, copies FROM codes WHERE code = ? LIMIT 1').bind(key).first(),
    copiedTodayCount(db, key, today),
  ]);
  const copied = copiedRow ? Number(copiedRow.n) : 0;
  const total = Number(totalRow || 0);
  return {
    key,
    anon: !!user.anon,
    copied,
    copied_today: todayRow,
    // Your own key is in the pool but never shown to you, so it does
    // not count as remaining for you.
    remaining: Math.max(0, total - copied - (mineRow ? 1 : 0)),
    total,
    mine: mineRow ? { code: mineRow.code, copies: Number(mineRow.copies) || 0 } : null,
  };
}

// Highest rid in the static seed (codes.json). Keep in sync with
// codes.json "maxRid" (make-codes-json.mjs).
const SEED_MAX_RID = 103461;

// Mandatory first code: every new user is shown this code first.
// It already exists in the seed (id nk-12256, rid 12255) — reused,
// never duplicated. The one-time-per-user rule hides it from a user
// once they copy/report it. It is NEVER excluded as dead (see the
// bad_reports exemptions below): even if two users report it, it
// must still be the first code a new user sees.
const FIRST_CODE = 'NG-0GjkSPjM';
const FIRST_CODE_ID = 'nk-12256';

// Historical baseline from the PREVIOUS NusukKeys website (lost
// 2026-11-06; this site is its rebuild). Ahmad's own record: the
// old site had reached about 60,000 visitors, at least 55,000 of
// them established, and about 100,000 codes had been shared/used
// through it. These are HISTORY, not live measurements: the live
// counters are kept separate and added on top, and the response
// labels the two parts so nobody confuses the historical estimate
// with verified live records. A constant, never reset by a deploy,
// a rebuild or a database reset.
const HISTORICAL_VISITORS = 55000;
const HISTORICAL_COPIES = 100000;

// Compact code form, same shape as codes.json (short keys; only
// non-default fields present).
function toCompact(row) {
  const o = { i: row.id, c: row.code, r: Number(row.rid) || 0 };
  if (row.device_id && row.device_id !== 'community-import') o.d = row.device_id;
  if (row.name) o.n = row.name;
  if (Number(row.copies) || 0) o.p = Number(row.copies);
  if (row.created_at) o.t = row.created_at;
  return o;
}

// Extra session payload for the static-first frontend: the ids this
// user already used (so the frontend can filter the static code list
// client-side, with no database read), the codes reported dead by at
// least two different users (same filter, client-side), and the codes
// shared after the static seed (rid > SEED_MAX_RID). The bad list is
// a small indexed read (idx_codes_bad_reports); the ids are few.
async function sessionExtras(db, key) {
  const usedRes = await db.prepare('SELECT code_id FROM used WHERE user_key = ?').bind(key).all();
  const deltaRes = await db.prepare(
    'SELECT id, rid, code, name, device_id, created_at FROM codes WHERE rid > ? ORDER BY rid LIMIT 200'
  ).bind(SEED_MAX_RID).all();
  const badRes = await badIdsQuery(db);
  return {
    usedIds: (usedRes.results || []).map((r) => r.code_id),
    delta: (deltaRes.results || []).map(toCompact),
    badIds: badRes,
  };
}

// Codes reported dead by at least two different users. The column
// (bad_reports) and its index are added by the post-reset job; until
// then this returns [] and the exclusion is simply inactive — the
// session must not fail because the column is not there yet.
async function badIdsQuery(db) {
  try {
    // The mandatory first code is never reported dead (see FIRST_CODE
    // above), so it is never sent to the client as a bad id.
    const r = await db.prepare('SELECT id FROM codes WHERE bad_reports >= 2 AND id != ? LIMIT 500').bind(FIRST_CODE_ID).all();
    return (r.results || []).map((x) => x.id);
  } catch { return []; }
}

// The "active now" count is cached in this worker for 30 seconds:
// the frontend refreshes stats every 60s, so a shorter cache would
// not help, and the COUNT is an index range scan that would otherwise
// run on every single session call (the main read cost after the
// code-table scans below were removed). The window is 5 minutes
// (was 2): presence writes are now throttled to once per 5 min per
// visitor (see touchVisitor), so a 2-minute window would undercount
// people who are still on the site between writes.
let _onlineCache = { at: 0, n: 0 };
async function visitorsOnline(db, now = new Date()) {
  if (now.getTime() - _onlineCache.at < 30 * 1000) return _onlineCache.n;
  const row = await db.prepare('SELECT COUNT(*) AS n FROM visitors WHERE last_seen >= ?')
    .bind(now.getTime() - 5 * 60 * 1000).first();
  const n = row ? Number(row.n) : 0;
  _onlineCache = { at: now.getTime(), n };
  return n;
}

// Stats counters that used to be COUNT(*) / scans over the whole
// codes table on EVERY session call (added_today, user_added and the
// latest code). At 81,625 codes each of those reads 81,625 rows per
// call — that is what exhausted the 5M/day read limit by mid-afternoon
// and froze the figures. They are now meta counters, maintained
// incrementally on every share (see the share endpoint) and read here
// as single-row meta lookups. If a counter is missing (first deploy
// after this change), it is computed once from the table and stored,
// so the numbers are right without a manual backfill.
async function addedTodayMeta(db, today) {
  const v = await metaGet(db, 'added_today');
  if (v !== null) return Number(v) || 0;
  const row = await db.prepare('SELECT COUNT(*) AS n FROM codes WHERE created_at >= ? AND created_at < ?')
    .bind(today + 'T00:00:00.000Z', today + 'T23:59:59.999Z').first();
  const n = row ? Number(row.n) : 0;
  await metaSet(db, 'added_today', String(n));
  return n;
}
async function userAddedMeta(db) {
  const v = await metaGet(db, 'user_added');
  if (v !== null) return Number(v) || 0;
  const row = await db.prepare("SELECT COUNT(*) AS n FROM codes WHERE device_id LIKE 'u-%'").first();
  const n = row ? Number(row.n) : 0;
  await metaSet(db, 'user_added', String(n));
  return n;
}
async function latestCodeMeta(db) {
  const v = await metaGet(db, 'latest_code');
  if (v !== null) {
    try { return JSON.parse(v); } catch { return null; }
  }
  const row = await db.prepare("SELECT code, created_at FROM codes WHERE created_at != '' ORDER BY created_at DESC LIMIT 1").first();
  const latest = row ? { code: row.code, created_at: row.created_at } : null;
  if (latest) await metaSet(db, 'latest_code', JSON.stringify(latest));
  return latest;
}

// People seen in the last hour (a wider window than the 5-minute
// "active now"). An index range scan on visitors.last_seen, so it
// costs almost nothing.
async function visitorsLastHour(db, now = new Date()) {
  const row = await db.prepare('SELECT COUNT(*) AS n FROM visitors WHERE last_seen >= ?')
    .bind(now.getTime() - 60 * 60 * 1000).first();
  return row ? Number(row.n) : 0;
}

async function computeStats(db, now = new Date(), env = null) {
  const today = await ensureToday(db, now);
  const [totalRow, usedTotalRow, usedTodayRow, latest, addedToday, userAdded, visRow, online, lastHour] = await Promise.all([
    metaGet(db, 'total_codes'),
    metaGet(db, 'used_total'),
    metaGet(db, 'used_today'),
    latestCodeMeta(db),
    addedTodayMeta(db, today),
    userAddedMeta(db),
    metaGet(db, 'visitors_total'),
    visitorsOnline(db, now),
    visitorsLastHour(db, now),
  ]);
  // Visitor counters: prefer KV when it is bound, because KV keeps
  // working while D1's daily read limit is exhausted. Reconcile the
  // total upward when D1 knows more (a KV write that was skipped or
  // failed must not lose a real visitor).
  let visitorsTotal = visRow !== null ? Number(visRow) : 0;
  let visitorsOnlineCount = online;
  const kvTotal = await kvGetTotal(env);
  if (kvTotal !== null) {
    if (visitorsTotal > kvTotal) await kvSetTotal(env, visitorsTotal);
    visitorsTotal = Math.max(visitorsTotal, kvTotal);
  }
  const kvOnline = await kvGetOnline(env, now);
  if (kvOnline !== null) visitorsOnlineCount = Math.max(visitorsOnlineCount, kvOnline);
  // Firebase Realtime DB presence: the count that keeps working while
  // D1 writes and the KV list quota are exhausted (see presence.mjs).
  // Take the highest of the three sources — each counts the same
  // visitors, so the max is the most complete, never a sum.
  const fbOnline = await firebaseGetOnline(now);
  if (fbOnline !== null) visitorsOnlineCount = Math.max(visitorsOnlineCount, fbOnline);
  // Totals include the historical baseline (see the constants
  // above); the live parts are reported separately so the two are
  // never confused.
  const usedNew = Number(usedTotalRow || 0);
  return {
    codes: Number(totalRow || 0),
    used_today: Number(usedTodayRow || 0),
    used_total: HISTORICAL_COPIES + usedNew,
    used_new: usedNew,
    used_historical: HISTORICAL_COPIES,
    visitors_online: visitorsOnlineCount,
    visitors_last_hour: lastHour,
    visitors_total: HISTORICAL_VISITORS + visitorsTotal,
    visitors_new: visitorsTotal,
    visitors_historical: HISTORICAL_VISITORS,
    added_today: addedToday,
    user_added: userAdded,
    latest_code: latest,
  };
}

// ------------------------------------------------------------ API handler
//
// handleApiD1(db, endpoint, body, now?) -> { status, body }
// Same contract as api-core's handleApi. D1 binding required.

export async function handleApiD1(db, endpoint, body = {}, now = new Date(), env = null) {
  body = body && typeof body === 'object' ? body : {};
  const done = (status, responseBody) => ({ status, body: responseBody });

  // ---- session: creates the identity, so it is the one endpoint
  // that does not require an already-known key.
  if (endpoint === 'session') {
    if (body.anon) {
      if (body.key && /^a-[a-z0-9]{12}$/.test(body.key)) {
        const existing = await getUser(db, body.key);
        if (existing && existing.anon) {
          await touchVisitor(db, body.key, now, env);
          return done(200, { ok: true, me: await meFor(db, body.key, now), stats: await computeStats(db, now, env), ...(await sessionExtras(db, body.key)) });
        }
      }
      const key = 'a-' + randStr(12);
      await ensureUser(db, key, true, now);
      await touchVisitor(db, key, now, env);
      return done(200, { ok: true, me: await meFor(db, key, now), stats: await computeStats(db, now, env), ...(await sessionExtras(db, key)) });
    }
    // Returning guest: saved anon key, no anon flag. Reuse the anon
    // identity so the guest keeps their used-code history. If the
    // identity is not in the database (it was created while the
    // database was unreachable, or the row was lost), accept the key
    // anyway instead of rejecting it: a rejected guest falls back to
    // local mode and sees the frozen 1/1 counters. The guest's
    // used-code history lives in the browser's local storage and is
    // merged back in by the frontend, so nothing is lost.
    if (typeof body.key === 'string' && /^a-[a-z0-9]{12}$/.test(body.key)) {
      const existing = await getUser(db, body.key);
      if (existing && !existing.anon) return done(200, { ok: false, error: 'invalid_code' });
      if (!existing) await ensureUser(db, body.key, true, now);
      await touchVisitor(db, body.key, now, env);
      return done(200, { ok: true, me: await meFor(db, body.key, now), stats: await computeStats(db, now, env), ...(await sessionExtras(db, body.key)) });
    }
    const key = normalizeKey(body.key);
    if (!key) return done(200, { ok: false, error: 'invalid_code' });
    const isNew = !(await getUser(db, key));
    await ensureUser(db, key, false, now);
    // Migrate a previous anon identity's used set onto the real key.
    if (body.prevKey && body.prevKey !== key) {
      const prev = await getUser(db, body.prevKey);
      if (prev) {
        await db.batch([
          db.prepare('INSERT OR IGNORE INTO used (user_key, code_id, reason, at) SELECT ?, code_id, reason, at FROM used WHERE user_key = ?').bind(key, body.prevKey),
          db.prepare('DELETE FROM used WHERE user_key = ?').bind(body.prevKey),
          db.prepare('DELETE FROM users WHERE key = ?').bind(body.prevKey),
          db.prepare('DELETE FROM visitors WHERE user_key = ?').bind(body.prevKey),
        ]);
      }
    }
    // A user's own key is ALWAYS added to the pool (when it is not
    // already there), so others can use it. It is never issued back
    // to that same user: queue/list exclude the user's own code.
    // No duplicate is created when the code already exists.
    {
      const mine = await db.prepare('SELECT id FROM codes WHERE code = ? COLLATE NOCASE LIMIT 1').bind(key).first();
      if (!mine) {
        const maxRow = await db.prepare('SELECT MAX(rid) AS m FROM codes').first();
        const rid = (maxRow && maxRow.m !== null ? Number(maxRow.m) : -1) + 1;
        await db.batch([
          db.prepare('INSERT INTO codes (id, rid, code, name, country, copies, device_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
            .bind('nk-' + randStr(12), rid, key, '', '🕋', 0, 'u-ng-' + key.slice(3).toLowerCase(), now.toISOString()),
          db.prepare("UPDATE meta SET v = CAST(v AS INTEGER) + 1 WHERE k = 'total_codes'"),
        ]);
      }
    }
    await touchVisitor(db, key, now, env);
    return done(200, { ok: true, me: await meFor(db, key, now), stats: await computeStats(db, now, env), ...(await sessionExtras(db, key)) });
  }

  // ---- ping: record that this visitor is online right now.
  // Write-only presence, no identity and no reads: it works even
  // for a visitor still at the gate (no session yet), in local mode
  // (the database unreachable), and while the D1 read limit is
  // exhausted — writes are not blocked by the read limit, and this
  // endpoint never reads. It NEVER creates a user and NEVER bumps
  // any total: the visitor total only grows when a session
  // registers a new user. The key only has to be well-formed (an
  // anon a- key or an NG- key); an unknown key is simply recorded
  // as present. The KV mirror is best-effort, so presence survives
  // a D1 outage too. The last_seen write only fires when the row
  // is stale (>5 min old, was 60s): at 60s, every visitor's
  // once-a-minute ping cost a D1 write, and that background burn
  // exhausted the 100k/day D1 row-write limit on 2026-11-08.
  if (endpoint === 'ping') {
    const pkey = typeof body.key === 'string' ? body.key : '';
    const okKey = /^a-[a-z0-9]{12}$/.test(pkey) || normalizeKey(pkey) !== null;
    if (!okKey) return done(200, { ok: false, error: 'invalid_code' });
    const ms = now.getTime();
    // Refresh the KV presence FIRST: the D1 writes below throw when
    // the free row-write limit is exhausted, and if they throw first
    // the KV key is never refreshed — so the realtime "active now"
    // count (which reads KV) drops to 1 even while real users are on
    // the site. KV is best-effort and never throws, so it always runs.
    await kvTouchOnline(env, pkey, now);
    // D1 presence is best-effort too while the write limit is out: a
    // failed D1 write must not fail the ping (KV already recorded it).
    try {
      await db.prepare('INSERT OR IGNORE INTO visitors (user_key, last_seen) VALUES (?, ?)')
        .bind(pkey, ms).run();
      await db.prepare('UPDATE visitors SET last_seen = ? WHERE user_key = ? AND last_seen < ?')
        .bind(ms, pkey, ms - 300 * 1000).run();
    } catch { /* D1 write limit out — KV presence already recorded */ }
    return done(200, { ok: true });
  }

  // ---- every other endpoint requires a known key.
  const key = typeof body.key === 'string' ? body.key : '';
  const user = await getUser(db, key);
  if (!user) return done(401, { ok: false, error: 'no_key' });

  // ---- stats is read-only: it must NOT touch the visitor. The
  // frontend polls stats every 60s and the mirrors poll the primary
  // too, so a touch here cost one D1 write per visitor per minute —
  // that background burn exhausted the 100k/day D1 row-write limit
  // on 2026-11-08. Presence is kept fresh by /api/ping alone.
  if (endpoint === 'stats') {
    return done(200, { ok: true, me: await meFor(db, key, now), stats: await computeStats(db, now, env) });
  }

  await touchVisitor(db, key, now, env);

  if (endpoint === 'queue') {
    const res = await db.prepare(
      'SELECT id, rid, code, name, country, copies, device_id, created_at FROM codes ' +
      'WHERE id NOT IN (SELECT code_id FROM used WHERE user_key = ?) ' +
      'AND (bad_reports < 2 OR id = ?) ' +
      'AND code != ? COLLATE NOCASE ORDER BY CASE WHEN code = ? THEN 0 ELSE 1 END, rid LIMIT 40'
    ).bind(key, FIRST_CODE_ID, key, FIRST_CODE).all();
    return done(200, { ok: true, codes: (res.results || []).map(publicCode) });
  }

  if (endpoint === 'list') {
    const filter = ['remaining', 'new', 'used', 'all'].includes(body.filter) ? body.filter : 'remaining';
    const qRaw = String(body.q || '').trim().toLowerCase();
    const q = qRaw.replace(/^ng-/, '');
    const after = Number(body.after) || 0;
    const like = q ? '%' + q.replace(/[%_\\]/g, (m) => '\\' + m) + '%' : null;
    const qCond = like ? ' AND LOWER(code) LIKE ? ESCAPE \'\\\' ' : '';
    const qArgs = like ? [like] : [];

    if (filter === 'used') {
      const res = await db.prepare(
        'SELECT id, rid, code, name, country, copies, device_id, created_at FROM codes ' +
        'WHERE id IN (SELECT code_id FROM used WHERE user_key = ?)' + qCond +
        ' ORDER BY rid LIMIT 61 OFFSET ?'
      ).bind(key, ...qArgs, after).all();
      const rows = res.results || [];
      const usedSet = new Set(rows.map((r) => r.id));
      return done(200, {
        ok: true,
        codes: rows.slice(0, 60).map((c) => ({ ...publicCode(c), used: usedSet.has(c.id) ? 1 : 0 })),
        hasMore: rows.length > 60,
        next: after + Math.min(rows.length, 60),
      });
    }
    if (filter === 'new') {
      // Rid-descending, cursor pagination: `after` is a rid; 0 = start
      // at the newest code. `next` is the last rid on the page.
      const res = await db.prepare(
        'SELECT id, rid, code, name, country, copies, device_id, created_at FROM codes ' +
        'WHERE id NOT IN (SELECT code_id FROM used WHERE user_key = ?)' + qCond +
        ' AND (bad_reports < 2 OR id = ?)' +
        ' AND code != ? COLLATE NOCASE' +
        (after === 0 ? '' : ' AND rid < ?') +
        ' ORDER BY rid DESC LIMIT 61'
      ).bind(key, ...qArgs, FIRST_CODE_ID, key, ...(after === 0 ? [] : [after])).all();
      const rows = res.results || [];
      const items = rows.slice(0, 60);
      return done(200, {
        ok: true,
        codes: items.map((c) => ({ ...publicCode(c), used: 0 })),
        hasMore: rows.length > 60,
        next: items.length ? items[items.length - 1].rid : 0,
      });
    }
    // remaining and all: offset pagination, 61 rows fetched so hasMore
    // needs no COUNT(*) over the table. Remaining never shows the
    // user's own key, and the mandatory first code comes first. The
    // first code is never excluded as dead (OR id = FIRST_CODE_ID).
    const whereAll = filter === 'all'
      ? (like ? "WHERE LOWER(code) LIKE ? ESCAPE '\\' AND (bad_reports < 2 OR id = ?) " : 'WHERE (bad_reports < 2 OR id = ?) ')
      : ('WHERE id NOT IN (SELECT code_id FROM used WHERE user_key = ?)' + qCond +
        ' AND (bad_reports < 2 OR id = ?)' +
        ' AND code != ? COLLATE NOCASE');
    const orderAll = filter === 'all'
      ? ' ORDER BY rid'
      : ' ORDER BY CASE WHEN code = ? THEN 0 ELSE 1 END, rid';
    const argsAll = filter === 'all' ? [...qArgs, FIRST_CODE_ID] : [key, ...qArgs, FIRST_CODE_ID, key, FIRST_CODE];
    const res = await db.prepare(
      'SELECT id, rid, code, name, country, copies, device_id, created_at FROM codes ' +
      whereAll + orderAll + ' LIMIT 61 OFFSET ?'
    ).bind(...argsAll, after).all();
    const rows = res.results || [];
    const items = rows.slice(0, 60);
    const usedRows = items.length
      ? await db.prepare(
          'SELECT code_id FROM used WHERE user_key = ? AND code_id IN (' +
          items.map(() => '?').join(',') + ')'
        ).bind(key, ...items.map((c) => c.id)).all()
      : { results: [] };
    const usedSet = new Set((usedRows.results || []).map((r) => r.code_id));
    return done(200, {
      ok: true,
      codes: items.map((c) => ({ ...publicCode(c), used: usedSet.has(c.id) ? 1 : 0 })),
      hasMore: rows.length > 60,
      next: after + items.length,
    });
  }

  if (endpoint === 'copy') {
    const code = await db.prepare('SELECT id, copies FROM codes WHERE id = ?').bind(body.id).first();
    if (!code) return done(200, { ok: false, error: 'not_found' });
    const already = await db.prepare('SELECT 1 AS x FROM used WHERE user_key = ? AND code_id = ?').bind(key, code.id).first();
    if (!already) {
      const today = await ensureToday(db, now);
      await db.batch([
        db.prepare('INSERT INTO used (user_key, code_id, reason, at) VALUES (?, ?, ?, ?)').bind(key, code.id, 'copy', now.toISOString()),
        db.prepare('UPDATE codes SET copies = copies + 1 WHERE id = ?').bind(code.id),
        db.prepare("UPDATE meta SET v = CAST(v AS INTEGER) + 1 WHERE k = 'used_total'"),
        db.prepare("UPDATE meta SET v = CAST(v AS INTEGER) + 1 WHERE k = 'used_today'"),
        db.prepare('INSERT INTO daily_copies (user_key, date, count) VALUES (?, ?, 1) ON CONFLICT(user_key, date) DO UPDATE SET count = count + 1').bind(key, today),
      ]);
      return done(200, { ok: true, copies: (Number(code.copies) || 0) + 1 });
    }
    return done(200, { ok: true, copies: Number(code.copies) || 0 });
  }

  if (endpoint === 'report') {
    const code = await db.prepare('SELECT id FROM codes WHERE id = ?').bind(body.id).first();
    if (!code) return done(200, { ok: false, error: 'not_found' });
    const reason = ['skipped', 'already_used', 'invalid'].includes(body.reason) ? body.reason : 'skipped';
    const already = await db.prepare('SELECT 1 AS x FROM used WHERE user_key = ? AND code_id = ?').bind(key, code.id).first();
    if (!already) {
      // Store the specific reason (not a generic 'report'): it is
      // what distinguishes a dead code (already_used/invalid) from a
      // plain skip, and it is what the global exclusion counts.
      // The per-user exclusion (the used row) is the critical part
      // and must succeed even if the global counter cannot yet be
      // updated (the bad_reports column lands with the post-reset
      // job); so the counter update is a separate guarded step.
      await db.prepare('INSERT INTO used (user_key, code_id, reason, at) VALUES (?, ?, ?, ?)')
        .bind(key, code.id, reason, now.toISOString()).run();
      // A code two different users found already-used or not-working
      // in Nusuk is dead: count it toward the global exclusion. The
      // `already` guard above means each user counts at most once.
      if (reason === 'already_used' || reason === 'invalid') {
        try {
          await db.prepare('UPDATE codes SET bad_reports = bad_reports + 1 WHERE id = ?').bind(code.id).run();
        } catch { /* column not there yet; the per-user row above still counts */ }
      }
    }
    return done(200, { ok: true });
  }

  if (endpoint === 'undo') {
    const code = await db.prepare('SELECT id, copies FROM codes WHERE id = ?').bind(body.id).first();
    if (!code) return done(200, { ok: false, error: 'not_found' });
    const usedRow = await db.prepare('SELECT reason FROM used WHERE user_key = ? AND code_id = ?').bind(key, code.id).first();
    if (usedRow) {
      const wasCopy = usedRow.reason === 'copy';
      const wasReport = usedRow.reason === 'already_used' || usedRow.reason === 'invalid';
      const stmts = [db.prepare('DELETE FROM used WHERE user_key = ? AND code_id = ?').bind(key, code.id)];
      // Undoing a report must also take back the dead-code vote, or
      // the code stays excluded even though nobody reports it now.
      // (The frontend offers undo only for copies, but the API must
      // stay consistent for any caller.)
      if (wasReport) {
        stmts.push(db.prepare('UPDATE codes SET bad_reports = MAX(0, bad_reports - 1) WHERE id = ?').bind(code.id));
      }
      if (wasCopy) {
        const today = await ensureToday(db, now);
        stmts.push(
          db.prepare('UPDATE codes SET copies = MAX(0, copies - 1) WHERE id = ?').bind(code.id),
          db.prepare("UPDATE meta SET v = MAX(0, CAST(v AS INTEGER) - 1) WHERE k = 'used_total'"),
          db.prepare("UPDATE meta SET v = MAX(0, CAST(v AS INTEGER) - 1) WHERE k = 'used_today'"),
          db.prepare('UPDATE daily_copies SET count = MAX(0, count - 1) WHERE user_key = ? AND date = ?').bind(key, today),
        );
      }
      await db.batch(stmts);
    }
    return done(200, { ok: true });
  }

  if (endpoint === 'share') {
    const raw = String(body.code || '');
    if (!raw.trim()) return done(200, { ok: false, error: 'empty' });
    const code = parseCodeFromText(raw);
    if (!code) return done(200, { ok: false, error: 'invalid_code' });
    const dup = await db.prepare('SELECT id FROM codes WHERE code = ? COLLATE NOCASE LIMIT 1').bind(code).first();
    if (dup) return done(200, { ok: false, error: 'duplicate' });
    // A sharer's name (optional, shown under their code). Rejects
    // links and phone numbers — a name is how people know who they
    // are helping, never a place to advertise.
    const name = String(body.name || '').trim().slice(0, 40);
    if (/https?:|www\.|\.com|\.net|\.org/i.test(name)) return done(200, { ok: false, error: 'name_link' });
    if (/\d{7,}/.test(name.replace(/[\s-]/g, ''))) return done(200, { ok: false, error: 'name_number' });
    const fp = String(body.fp || '');
    const today = todayStr(now);
    // Roll the daily counters first, so the added_today increment
    // below counts today even if the date changed since the last
    // stats call.
    await ensureToday(db, now);
    const shareRow = await db.prepare('SELECT count FROM shares WHERE fp = ? AND date = ?').bind(fp, today).first();
    if (shareRow && Number(shareRow.count) >= 10) return done(200, { ok: false, error: 'device_limit' });
    const maxRow = await db.prepare('SELECT MAX(rid) AS m FROM codes').first();
    const rid = (maxRow && maxRow.m !== null ? Number(maxRow.m) : -1) + 1;
    const entry = {
      id: 'nk-' + randStr(12), rid, code, name, country: '🕋', copies: 0,
      device_id: 'u-ng-' + code.slice(3).toLowerCase(), created_at: now.toISOString(),
    };
    await db.batch([
      db.prepare('INSERT INTO codes (id, rid, code, name, country, copies, device_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(entry.id, entry.rid, entry.code, entry.name, entry.country, entry.copies, entry.device_id, entry.created_at),
      db.prepare('INSERT INTO shares (fp, date, count) VALUES (?, ?, 1) ON CONFLICT(fp, date) DO UPDATE SET count = count + 1').bind(fp, today),
      db.prepare("UPDATE meta SET v = CAST(v AS INTEGER) + 1 WHERE k = 'total_codes'"),
      // Stats counters (read as single-row meta lookups in
      // computeStats, never COUNT(*) over the codes table).
      db.prepare("UPDATE meta SET v = CAST(v AS INTEGER) + 1 WHERE k = 'user_added'"),
      db.prepare("UPDATE meta SET v = CAST(v AS INTEGER) + 1 WHERE k = 'added_today'"),
      db.prepare("INSERT OR REPLACE INTO meta (k, v) VALUES ('latest_code', ?)").bind(JSON.stringify({ code: entry.code, created_at: entry.created_at })),
    ]);
    return done(200, { ok: true, code: publicCode(entry) });
  }

  return done(404, { ok: false, error: 'server' });
}
