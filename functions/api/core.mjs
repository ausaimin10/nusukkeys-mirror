// NusukKeys API core — pure JS, no Node / Cloudflare imports.
// Shared logic for the local Node server (server.mjs) and the
// Cloudflare Pages Function (functions/api/[[route]].js, which uses a
// copy of this file as functions/api/core.mjs — keep the two in sync).
//
// State shape (in memory):
//   {
//     codes:    [{id, rid, code, name, country, copies, device_id, created_at}],
//     users:    { [key]: {key, anon, created_at} },
//     used:     { [key]: Set<codeId> },          // codes copied/reported by that user
//     usedMeta: { [key]: { [codeId]: 'copy'|'skipped'|'already_used'|'invalid' } },
//     badReports: { [codeId]: count },      // distinct users who reported
//       // this code as already-used / does-not-work. At 2 the code is
//       // dead in Nusuk's own system (someone already redeemed it) and
//       // is excluded from every user's queue/list, so a dead code is
//       // never handed out again. 'skipped' reports do not count: a
//       // skip only means that user did not want the code.
//     dailyCopies: { [key]: { date: 'YYYY-MM-DD', count: n } },
//     dailyCopies: { [key]: { date: 'YYYY-MM-DD', count: n } },
//       // codes THIS user copied today (copy only, not reports).
//       // Resets automatically when the date changes. Exposed as
//       // me.copied_today; the global total stays in stats.used_total.
//     stats:    { used_total, used_today, today }, // today = 'YYYY-MM-DD' (UTC)
//     visitors: { [key]: lastSeenMs },
//     shares:   { [fp + '|' + 'YYYY-MM-DD']: count }, // successful shares per fp per day
//     nextRid:  Number
//   }
// Serialisation: see serializeState() / deserializeState() below.
// `used` is a Set in memory; on disk / in D1 it is stored as an array.
//
// One-time-per-user rule (original design, preserved exactly):
// once a user copies or reports a code, that code is recorded against
// that user's key and is NEVER shown to that same user again in
// /api/queue, /api/list filter=remaining or filter=new. It stays
// visible to every other user — UNLESS it is reported dead (see
// badReports above): a code two different users found already-used
// or not-working in Nusuk is dead for everyone and is excluded from
// every user's queue/list. That matters because the queue order is
// the same for every new user (mandatory first code, then rid order),
// so without the global exclusion the same early codes would be
// handed to everyone and the first ones redeemed would keep being
// handed out as dead codes. /api/undo is the only reversal, and
// only for a code that was copied (reported codes have no undo path
// in the frontend, so their exclusion is permanent for that user).
// Identity is the key the frontend stores in cookie + localStorage
// (mk_key). A real NG- key is stable across devices; an anon a- key
// is stable only while that cookie/localStorage survives. If a guest
// clears cookies/localStorage they get a new anon identity and the
// exclusion cannot follow them — that is the original design.

export function todayStr(date = new Date()) {
  return date.toISOString().slice(0, 10); // UTC date
}

// Highest rid in the static seed (codes.json). Codes shared after the
// seed get a higher rid; the session returns those as `delta` so the
// frontend sees new codes without the static file being regenerated.
// Keep in sync with codes.json "maxRid" (make-codes-json.mjs).
export const SEED_MAX_RID = 103461;

// Mandatory first code: every new user is shown this code first.
// It already exists in the seed (id nk-12256, rid 12255) — it is
// reused, never duplicated. Once a user copies/reports it, the
// one-time-per-user rule hides it from them like any other code.
export const FIRST_CODE = 'NG-0GjkSPjM';
export const FIRST_CODE_ID = 'nk-12256';

// Historical baseline from the PREVIOUS NusukKeys website (lost
// 2026-11-06; this site is its rebuild). Ahmad's own record: the
// old site had reached about 60,000 visitors, at least 55,000 of
// them established, and about 100,000 codes had been shared/used
// through it. These are HISTORY, not live measurements: the live
// counters (visitors_new / used_new) are kept separate and are
// added on top, and the response labels the two parts so nobody
// confuses the historical estimate with verified live records.
// The baseline is a constant, never reset by a deploy, a rebuild
// or a database reset — it is the site's history, carried forward.
export const HISTORICAL_VISITORS = 55000;
export const HISTORICAL_COPIES = 100000;

// Sort helper: the mandatory first code comes first, then rid order.
function firstFirst(a, b) {
  const af = String(a.code) === FIRST_CODE ? 0 : 1;
  const bf = String(b.code) === FIRST_CODE ? 0 : 1;
  if (af !== bf) return af - bf;
  return (Number(a.rid) || 0) - (Number(b.rid) || 0);
}

function randStr(n, alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789') {
  let s = '';
  for (let i = 0; i < n; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}

export function normalizeKey(s) {
  // Same rule as the frontend normalizeKey(): NG- + 8 alphanumerics,
  // or a bare 8-char code. Returns null when it does not look like a key.
  // The 'NG-' prefix is upper-cased; the 8 chars keep the case given.
  const m = String(s || '').match(/NG-[A-Za-z0-9]{8}/i) ||
    String(s || '').trim().match(/^([A-Za-z0-9]{8})$/);
  if (!m) return null;
  const raw = m[0];
  return raw.length === 8 ? 'NG-' + raw : 'NG-' + raw.slice(3);
}

function parseCodeFromText(s) {
  // Find an NG- code anywhere in the text (e.g. a pasted invite message),
  // else accept a bare 8-char code. Returns the normalised code or null.
  const text = String(s || '');
  if (!text.trim()) return null;
  const m = text.match(/NG-[A-Za-z0-9]{8}/i);
  if (m) return 'NG-' + m[0].slice(3);
  const bare = text.trim().match(/^([A-Za-z0-9]{8})$/);
  if (bare) return 'NG-' + bare[1];
  return null;
}

export function createState(seedCodes = []) {
  const codes = (seedCodes || []).map((c) => ({
    id: c.id,
    rid: Number(c.rid) || 0,
    code: c.code,
    name: c.name || '',
    country: c.country || '🕋',
    copies: Number(c.copies) || 0,
    device_id: c.device_id || 'community-import',
    created_at: c.created_at || '',
  }));
  codes.sort((a, b) => a.rid - b.rid);
  return {
    codes,
    users: {},
    used: {},
    usedMeta: {},
    badReports: {},
    dailyCopies: {},
    stats: {
      used_total: codes.reduce((n, c) => n + (c.copies || 0), 0),
      used_today: 0,
      today: todayStr(),
    },
    visitors: {},
    // Keys that ever registered a session (touchVisitor), as opposed
    // to keys only seen by /api/ping (presence). The visitor TOTAL
    // counts the first set only — a ping must never inflate it (see
    // the ping endpoint below). Mirrors D1, where the total is a
    // meta counter bumped only by touchVisitor's INSERT, not by ping.
    visitorsSeen: {},
    shares: {},
    nextRid: codes.length ? Math.max(...codes.map((c) => c.rid)) + 1 : 0,
  };
}

// Plain-JSON form, for data/state.json (local server) and for D1 adapters.
export function serializeState(state) {
  const used = {};
  for (const [k, set] of Object.entries(state.used || {})) used[k] = [...set];
  return {
    codes: state.codes,
    users: state.users,
    used,
    usedMeta: state.usedMeta || {},
    badReports: state.badReports || {},
    dailyCopies: state.dailyCopies || {},
    stats: state.stats,
    visitors: state.visitors,
    visitorsSeen: state.visitorsSeen || {},
    shares: state.shares || {},
    nextRid: state.nextRid,
  };
}

export function deserializeState(data) {
  if (!data || !Array.isArray(data.codes)) return null;
  const state = createState([]);
  state.codes = data.codes.map((c) => ({ ...c }));
  state.codes.sort((a, b) => a.rid - b.rid);
  state.users = data.users || {};
  state.used = {};
  for (const [k, arr] of Object.entries(data.used || {})) state.used[k] = new Set(arr || []);
  state.usedMeta = data.usedMeta || {};
  state.badReports = data.badReports || {};
  state.dailyCopies = data.dailyCopies || {};
  state.stats = data.stats || { used_total: 0, used_today: 0, today: todayStr() };
  state.visitors = data.visitors || {};
  // One-time migration for state files written before visitorsSeen
  // existed: every registered user counts as seen.
  state.visitorsSeen = data.visitorsSeen ||
    Object.fromEntries(Object.keys(data.users || {}).map((k) => [k, 1]));
  state.shares = data.shares || {};
  state.nextRid = typeof data.nextRid === 'number'
    ? data.nextRid
    : (state.codes.length ? Math.max(...state.codes.map((c) => c.rid)) + 1 : 0);
  return state;
}

// ---------------------------------------------------------------- helpers

function rollToday(state, now = new Date()) {
  const today = todayStr(now);
  if (state.stats.today !== today) {
    state.stats.today = today;
    state.stats.used_today = 0;
  }
}

function getUser(state, key) {
  return key ? state.users[key] || null : null;
}

function ensureUser(state, key, anon, now = new Date()) {
  if (!state.users[key]) {
    state.users[key] = { key, anon: !!anon, created_at: now.toISOString() };
  }
  return state.users[key];
}

function usedSet(state, key) {
  if (!state.used[key]) state.used[key] = new Set();
  return state.used[key];
}

function usedMetaFor(state, key) {
  if (!state.usedMeta[key]) state.usedMeta[key] = {};
  return state.usedMeta[key];
}

// This user's copies today (copy only, not reports). The stored
// record is for one UTC date; a record from an earlier date counts
// as 0, so the daily count resets automatically at a new day.
function copiedTodayCount(state, key, now = new Date()) {
  const rec = (state.dailyCopies || {})[key];
  if (!rec || rec.date !== todayStr(now)) return 0;
  return Number(rec.count) || 0;
}

function bumpDailyCopy(state, key, delta, now = new Date()) {
  if (!state.dailyCopies) state.dailyCopies = {};
  const today = todayStr(now);
  const rec = state.dailyCopies[key];
  if (!rec || rec.date !== today) state.dailyCopies[key] = { date: today, count: 0 };
  state.dailyCopies[key].count = Math.max(0, (state.dailyCopies[key].count || 0) + delta);
}

function findCode(state, id) {
  return state.codes.find((c) => c.id === id) || null;
}

function findCodeByCode(state, code) {
  const want = String(code).toLowerCase();
  return state.codes.find((c) => String(c.code).toLowerCase() === want) || null;
}

// A sharer's name (optional, shown under their code). Rejects links
// and phone numbers — a name is how people know who they are helping,
// never a place to advertise.
function cleanName(raw) {
  const name = String(raw || '').trim().slice(0, 40);
  if (!name) return { ok: true, name: '' };
  if (/https?:|www\.|\.com|\.net|\.org/i.test(name)) return { ok: false, error: 'name_link' };
  if (/\d{7,}/.test(name.replace(/[\s-]/g, ''))) return { ok: false, error: 'name_number' };
  return { ok: true, name };
}

function addCode(state, code, now = new Date(), name = '') {
  const entry = {
    id: 'nk-' + randStr(12),
    rid: state.nextRid++,
    code,
    name,
    country: '🕋',
    copies: 0,
    // Most live user-added codes used 'u-ng-' + the lower-cased 8 chars
    // of the code itself as device_id.
    device_id: 'u-ng-' + code.slice(3).toLowerCase(),
    created_at: now.toISOString(),
  };
  state.codes.push(entry);
  return entry;
}

function computeStats(state, now = new Date()) {
  rollToday(state, now);
  const today = todayStr(now);
  const withDate = state.codes.filter((c) => c.created_at);
  let latest = null;
  for (const c of withDate) {
    if (!latest || c.created_at > latest.created_at) latest = c;
  }
  const onlineCutoff = now.getTime() - 5 * 60 * 1000; // "active now" window: 5 min (was 2), matching the D1 presence-write throttle (see touchVisitor in d1.mjs)
  const visitorsOnline = Object.values(state.visitors || {})
    .filter((t) => Number(t) >= onlineCutoff).length;
  // People seen in the last hour (a wider window than "active now",
  // for the "N in the last hour" label). Live counts only — the
  // historical baseline is added to the totals below, never here.
  const hourCutoff = now.getTime() - 60 * 60 * 1000;
  const visitorsLastHour = Object.values(state.visitors || {})
    .filter((t) => Number(t) >= hourCutoff).length;
  // Total counts registered sessions only (visitorsSeen), never
  // ping-only presence keys.
  const visitorsNew = Object.keys(state.visitorsSeen || {}).length;
  const usedNew = state.stats.used_total;
  return {
    codes: state.codes.length,
    used_today: state.stats.used_today,
    // Totals include the historical baseline (see the constants
    // above); the live parts are reported separately so the two are
    // never confused.
    used_total: HISTORICAL_COPIES + usedNew,
    used_new: usedNew,
    used_historical: HISTORICAL_COPIES,
    visitors_online: visitorsOnline,
    visitors_last_hour: visitorsLastHour,
    visitors_total: HISTORICAL_VISITORS + visitorsNew,
    visitors_new: visitorsNew,
    visitors_historical: HISTORICAL_VISITORS,
    added_today: state.codes.filter(
      (c) => c.created_at && c.created_at.slice(0, 10) === today).length,
    user_added: state.codes.filter(
      (c) => c.device_id && c.device_id.startsWith('u-')).length,
    latest_code: latest ? { code: latest.code, created_at: latest.created_at } : null,
  };
}

function meFor(state, key, now = new Date()) {
  const user = getUser(state, key);
  if (!user) return null;
  const used = usedSet(state, key);
  const total = state.codes.length;
  const copied = used.size;
  const mineEntry = findCodeByCode(state, key);
  return {
    key,
    anon: !!user.anon,
    copied,
    copied_today: copiedTodayCount(state, key, now),
    // Your own key is in the pool but never shown to you, so it does
    // not count as remaining for you.
    remaining: Math.max(0, total - copied - (mineEntry ? 1 : 0)),
    total,
    mine: mineEntry ? { code: mineEntry.code, copies: mineEntry.copies } : null,
  };
}

// Presence only: updates last-seen without counting the key toward
// the visitor total (used by /api/ping).
function touchPresence(state, key, now = new Date()) {
  state.visitors[key] = now.getTime();
}

function touchVisitor(state, key, now = new Date()) {
  touchPresence(state, key, now);
  if (!state.visitorsSeen) state.visitorsSeen = {};
  state.visitorsSeen[key] = 1;
}

function publicCode(c) {
  return {
    id: c.id, code: c.code, name: c.name, country: c.country,
    copies: c.copies, rid: c.rid, device_id: c.device_id, created_at: c.created_at,
  };
}

function listCode(state, key, c) {
  const used = state.used[key];
  return { ...publicCode(c), used: used && used.has(c.id) ? 1 : 0 };
}

// Compact code form, same shape as codes.json (short keys; only
// non-default fields present). i=id, c=code, r=rid, d=device_id,
// n=name, p=copies, t=created_at.
function toCompact(c) {
  const o = { i: c.id, c: c.code, r: c.rid };
  if (c.device_id && c.device_id !== 'community-import') o.d = c.device_id;
  if (c.name) o.n = c.name;
  if (Number(c.copies) || 0) o.p = Number(c.copies);
  if (c.created_at) o.t = c.created_at;
  return o;
}

// Extra session payload for the static-first frontend: the ids this
// user already used (so the frontend can filter the static code list
// client-side, with no database read) and the codes shared after the
// static seed (rid > SEED_MAX_RID). Capped so the response stays small.
// Codes reported dead by at least two different users: excluded
// from every user's queue/list. Two reports (not one) so a single
// user cannot delete good codes by reporting them. The mandatory
// first code (NG-0GjkSPjM) is NEVER excluded as dead: it must always
// be the first code a new user sees. The one-time rule still applies
// to it (usedIds), and a user's own key is still never shown back.
const BAD_THRESHOLD = 2;
function badIds(state) {
  const out = [];
  for (const [id, n] of Object.entries(state.badReports || {})) {
    if (id === FIRST_CODE_ID) continue;
    if (Number(n) >= BAD_THRESHOLD) out.push(id);
  }
  return out.slice(0, 500);
}
function isBad(state, codeId) {
  if (codeId === FIRST_CODE_ID) return false;
  return Number((state.badReports || {})[codeId] || 0) >= BAD_THRESHOLD;
}

function sessionExtras(state, key) {
  const used = usedSet(state, key);
  const delta = state.codes
    .filter((c) => c.rid > SEED_MAX_RID)
    .slice(0, 200)
    .map(toCompact);
  return { usedIds: [...used], delta, badIds: badIds(state) };
}

// ------------------------------------------------------------ API handler
//
// handleApi(state, endpoint, body, now?) -> { status, body, changes }
// `changes` tells a persistence adapter what changed, so it can write
// back only the affected rows instead of the whole state:
//   { usersTouched, usedTouched, codeIdsTouched, newCodes, statsChanged }

export function handleApi(state, endpoint, body = {}, now = new Date()) {
  body = body && typeof body === 'object' ? body : {};
  const changes = {
    usersTouched: [], usedTouched: [], codeIdsTouched: [], newCodes: [], statsChanged: false,
  };
  const done = (status, responseBody) => ({ status, body: responseBody, changes });

  // ---- session: creates the identity, so it is the one endpoint
  // that does not require an already-known key.
  if (endpoint === 'session') {
    if (body.anon) {
      // Reuse an existing anon identity if the caller already has one.
      if (body.key && state.users[body.key] && state.users[body.key].anon) {
        const key = body.key;
        touchVisitor(state, key, now);
        return done(200, { ok: true, me: meFor(state, key, now), stats: computeStats(state, now), ...sessionExtras(state, key) });
      }
      const key = 'a-' + randStr(12);
      ensureUser(state, key, true, now);
      changes.usersTouched.push(key);
      touchVisitor(state, key, now);
      return done(200, { ok: true, me: meFor(state, key, now), stats: computeStats(state, now), ...sessionExtras(state, key) });
    }
    // Returning guest: the frontend boots with the saved anon key
    // (cookie/localStorage mk_key) and calls session with that key and
    // no anon flag. Reuse that anon identity so the guest keeps their
    // used-code history across refreshes and later returns. If the
    // identity is not in this state (the database is unreachable and
    // this is the in-memory fallback, which never saw the guest), accept
    // the key anyway instead of rejecting it: a rejected guest falls
    // back to local mode and sees the frozen 1/1 counters. The guest's
    // used-code history lives in the browser's local storage and is
    // merged back in by the frontend, so nothing is lost.
    if (typeof body.key === 'string' && /^a-[a-z0-9]{12}$/.test(body.key)) {
      const existing = state.users[body.key];
      if (existing && !existing.anon) return done(200, { ok: false, error: 'invalid_code' });
      if (!existing) {
        ensureUser(state, body.key, true, now);
        changes.usersTouched.push(body.key);
      }
      touchVisitor(state, body.key, now);
      return done(200, { ok: true, me: meFor(state, body.key, now), stats: computeStats(state, now), ...sessionExtras(state, body.key) });
    }
    const key = normalizeKey(body.key);
    if (!key) return done(200, { ok: false, error: 'invalid_code' });
    const isNew = !state.users[key];
    ensureUser(state, key, false, now);
    if (isNew) changes.usersTouched.push(key);
    // Migrate a previous anon identity's used set onto the real key.
    if (body.prevKey && body.prevKey !== key && state.users[body.prevKey]) {
      const prevUsed = state.used[body.prevKey];
      if (prevUsed && prevUsed.size) {
        const target = usedSet(state, key);
        const targetMeta = usedMetaFor(state, key);
        for (const id of prevUsed) {
          target.add(id);
          if (!targetMeta[id]) targetMeta[id] = (state.usedMeta[body.prevKey] || {})[id] || 'report';
        }
        changes.usedTouched.push(key);
      }
      delete state.used[body.prevKey];
      delete state.usedMeta[body.prevKey];
      delete state.users[body.prevKey];
      delete state.visitors[body.prevKey];
      if (state.visitorsSeen) delete state.visitorsSeen[body.prevKey];
      changes.usedTouched.push(body.prevKey);
    }
    // A user's own key is ALWAYS added to the pool (when it is not
    // already there), so others can use it. It is never issued back
    // to that same user: the queue/list filters below exclude the
    // user's own code, and the frontend does the same. No duplicate
    // is created when the code already exists in the repository.
    if (!findCodeByCode(state, key)) {
      const entry = addCode(state, key, now);
      changes.newCodes.push(entry);
    }
    touchVisitor(state, key, now);
    return done(200, { ok: true, me: meFor(state, key, now), stats: computeStats(state, now), ...sessionExtras(state, key) });
  }

  // ---- ping: record that this visitor is online right now.
  // Write-only presence, no identity and no reads: it works even
  // for a visitor still at the gate (no session yet), in local mode
  // (the database unreachable), and while the D1 read limit is
  // exhausted. It NEVER creates a user and NEVER bumps any total —
  // the visitor total only grows when a session registers a new
  // user. The key only has to be well-formed (an anon a- key or an
  // NG- key); an unknown key is simply recorded as present.
  if (endpoint === 'ping') {
    const pkey = typeof body.key === 'string' ? body.key : '';
    const okKey = /^a-[a-z0-9]{12}$/.test(pkey) || normalizeKey(pkey) !== null;
    if (!okKey) return done(200, { ok: false, error: 'invalid_code' });
    touchPresence(state, pkey, now);
    return done(200, { ok: true });
  }

  // ---- every other endpoint requires a known key.
  const key = typeof body.key === 'string' ? body.key : '';
  const user = getUser(state, key);
  if (!user) return done(401, { ok: false, error: 'no_key' });

  // ---- stats is read-only: it must NOT touch the visitor (same
  // reason as in d1.mjs — the 60s stats poll would otherwise cost
  // a D1 write per visitor per minute and exhaust the 100k/day
  // row-write limit; presence is kept fresh by /api/ping alone).
  if (endpoint === 'stats') {
    return done(200, { ok: true, me: meFor(state, key, now), stats: computeStats(state, now) });
  }

  touchVisitor(state, key, now);

  if (endpoint === 'queue') {
    const used = usedSet(state, key);
    const codes = state.codes
      .filter((c) => !used.has(c.id) && !isBad(state, c.id) && String(c.code).toLowerCase() !== key.toLowerCase())
      .sort(firstFirst)
      .slice(0, 40)
      .map(publicCode);
    return done(200, { ok: true, codes });
  }

  if (endpoint === 'list') {
    const filter = ['remaining', 'new', 'used', 'all'].includes(body.filter) ? body.filter : 'remaining';
    const qRaw = String(body.q || '').trim().toLowerCase();
    const q = qRaw.replace(/^ng-/, '');
    const used = usedSet(state, key);
    const matchesQ = (c) => {
      if (!q) return true;
      const code = String(c.code).toLowerCase();
      return code.includes(q) || code.replace(/^ng-/, '').includes(q);
    };
    const after = Number(body.after) || 0;
    let pool;
    if (filter === 'used') {
      pool = state.codes.filter((c) => used.has(c.id) && matchesQ(c));
    } else if (filter === 'all') {
      // The browser shows everything — except codes reported dead,
      // which are not available to anyone any more.
      pool = state.codes.filter((c) => matchesQ(c) && !isBad(state, c.id));
    } else {
      // remaining and new: never show this user a code they already
      // copied or reported, never a code reported dead, and never
      // their own key.
      pool = state.codes.filter((c) => !used.has(c.id) && !isBad(state, c.id) && matchesQ(c)
        && String(c.code).toLowerCase() !== key.toLowerCase());
    }
    if (filter === 'remaining') pool.sort(firstFirst);
    if (filter === 'new') {
      // Rid-descending, cursor pagination: `after` is a rid; 0 = start
      // at the newest code. `next` is the last rid on the page.
      const desc = [...pool].sort((a, b) => b.rid - a.rid);
      const page = after === 0 ? desc : desc.filter((c) => c.rid < after);
      const items = page.slice(0, 60);
      const hasMore = page.length > 60;
      return done(200, {
        ok: true,
        codes: items.map((c) => listCode(state, key, c)),
        hasMore,
        next: items.length ? items[items.length - 1].rid : 0,
      });
    }
    const items = pool.slice(after, after + 60);
    return done(200, {
      ok: true,
      codes: items.map((c) => listCode(state, key, c)),
      hasMore: after + items.length < pool.length,
      next: after + items.length,
    });
  }

  if (endpoint === 'copy') {
    const code = findCode(state, body.id);
    if (!code) return done(200, { ok: false, error: 'not_found' });
    const used = usedSet(state, key);
    if (!used.has(code.id)) {
      used.add(code.id);
      usedMetaFor(state, key)[code.id] = 'copy';
      bumpDailyCopy(state, key, 1, now);
      code.copies = (code.copies || 0) + 1;
      rollToday(state, now);
      state.stats.used_total += 1;
      state.stats.used_today += 1;
      changes.statsChanged = true;
      changes.usedTouched.push(key);
      changes.codeIdsTouched.push(code.id);
    }
    return done(200, { ok: true, copies: code.copies });
  }

  if (endpoint === 'report') {
    const code = findCode(state, body.id);
    if (!code) return done(200, { ok: false, error: 'not_found' });
    const reason = ['skipped', 'already_used', 'invalid'].includes(body.reason) ? body.reason : 'skipped';
    const used = usedSet(state, key);
    if (!used.has(code.id)) {
      used.add(code.id);
      usedMetaFor(state, key)[code.id] = reason;
      changes.usedTouched.push(key);
      // A code two different users found already-used or not-working
      // in Nusuk is dead: count it toward the global exclusion. A
      // skip does not count (it only means that user did not want it).
      // The `!used.has` guard above means each user counts at most
      // once per code.
      if (reason === 'already_used' || reason === 'invalid') {
        state.badReports[code.id] = Number(state.badReports[code.id] || 0) + 1;
      }
    }
    // Deliberately no copies increment: reporting only hides the code
    // for this user, permanently (no undo path in the frontend).
    return done(200, { ok: true });
  }

  if (endpoint === 'undo') {
    const code = findCode(state, body.id);
    if (!code) return done(200, { ok: false, error: 'not_found' });
    const used = usedSet(state, key);
    if (used.has(code.id)) {
      const reason = (state.usedMeta[key] || {})[code.id];
      const wasCopy = reason === 'copy';
      const wasReport = reason === 'already_used' || reason === 'invalid';
      used.delete(code.id);
      delete usedMetaFor(state, key)[code.id];
      changes.usedTouched.push(key);
      // Undoing a report must also take back the dead-code vote, or
      // the code stays excluded even though nobody reports it now.
      if (wasReport) {
        const n = Math.max(0, Number((state.badReports || {})[code.id] || 0) - 1);
        if (n === 0) delete state.badReports[code.id];
        else state.badReports[code.id] = n;
      }
      if (wasCopy) {
        // Only a copy incremented the counters; a report did not.
        // bumpDailyCopy only touches today's record, so undoing a
        // copy made on an earlier day leaves today's count alone.
        bumpDailyCopy(state, key, -1, now);
        code.copies = Math.max(0, (code.copies || 0) - 1);
        rollToday(state, now);
        state.stats.used_total = Math.max(0, state.stats.used_total - 1);
        state.stats.used_today = Math.max(0, state.stats.used_today - 1);
        changes.statsChanged = true;
        changes.codeIdsTouched.push(code.id);
      }
    }
    return done(200, { ok: true });
  }

  if (endpoint === 'share') {
    const raw = String(body.code || '');
    if (!raw.trim()) return done(200, { ok: false, error: 'empty' });
    const code = parseCodeFromText(raw);
    if (!code) return done(200, { ok: false, error: 'invalid_code' });
    if (findCodeByCode(state, code)) return done(200, { ok: false, error: 'duplicate' });
    const fp = String(body.fp || '');
    const shareKey = fp + '|' + todayStr(now);
    const count = state.shares[shareKey] || 0;
    if (count >= 10) return done(200, { ok: false, error: 'device_limit' });
    const cleaned = cleanName(body.name);
    if (!cleaned.ok) return done(200, { ok: false, error: cleaned.error });
    state.shares[shareKey] = count + 1;
    const entry = addCode(state, code, now, cleaned.name);
    changes.newCodes.push(entry);
    return done(200, { ok: true, code: publicCode(entry) });
  }

  return done(404, { ok: false, error: 'server' });
}
