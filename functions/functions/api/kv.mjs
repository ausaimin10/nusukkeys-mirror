// NusukKeys — visitor counters in Cloudflare KV.
//
// Why KV: the D1 free tier allows 5M row reads/day, and the session
// endpoint reads D1 on every call. When that limit is exhausted
// (it was, twice on 2026-11-07), the session falls back to an
// in-memory state that reports visitors_total = 1 and
// visitors_online = 1, so the counters on the live site freeze at
// 1/1 and never move. KV is a separate free service (100k reads/day,
// 1k writes/day) with its own limit, so the counters keep working
// even while D1 reads are exhausted.
//
// Keys:
//   visitors_total — a plain integer string. Incremented ONLY when
//     a brand-new visitor registers (rare), so KV writes stay far
//     under the 1k/day limit.
//   online:<visitorKey> — one key per visitor, value = last-seen
//     epoch ms, auto-expiring 120s after the write. Counting is a
//     prefix list, so there is no shared JSON map to clobber: the
//     old single-map design did a read-modify-write of the whole
//     map on every touch, so concurrent sessions overwrote each
//     other's entries and the "active now" count lost visitors
//     under real traffic. One key per visitor has no such race.
//   known:<visitorKey> — '1' when this visitor was ever counted in
//     the total. One key per visitor (same race fix as online).
// Writes are best-effort: if KV is unavailable or the write fails,
// the session still succeeds (D1 remains the system of record when
// it is reachable).
//
// All helpers are no-ops when the KV binding is absent (local dev,
// tests), so the code paths work with or without KV.

const TOTAL_KEY = 'visitors_total';
const ONLINE_PREFIX = 'online:';
const KNOWN_PREFIX = 'known:';
const ONLINE_TTL_S = 300; // 5 minutes — the "active now" window (was 2 min, matching the D1 presence-write throttle since 2026-11-08)
const TOUCH_MIN_MS = 300 * 1000; // at most one KV write per 5 min per visitor (was 60s)

function kv(env) {
  return env && env.NUSUKKEYS_STATS ? env.NUSUKKEYS_STATS : null;
}

export async function kvGetTotal(env) {
  const store = kv(env);
  if (!store) return null;
  try {
    const v = await store.get(TOTAL_KEY);
    return v === null ? null : Number(v) || 0;
  } catch { return null; }
}

export async function kvSetTotal(env, n) {
  const store = kv(env);
  if (!store) return;
  try { await store.put(TOTAL_KEY, String(Math.max(0, Math.floor(n)))); } catch { /* best-effort */ }
}

// Increment the total by 1 (new visitor). Returns the new total, or
// null when KV is absent/unavailable.
export async function kvBumpTotal(env) {
  const store = kv(env);
  if (!store) return null;
  try {
    const cur = await kvGetTotal(env);
    const next = (cur === null ? 0 : cur) + 1;
    await store.put(TOTAL_KEY, String(next));
    return next;
  } catch { return null; }
}

// Refresh this visitor's last-seen, at most once per 5 min. One KV
// key per visitor (auto-expiring), so concurrent touches can never
// overwrite each other. Returns nothing; best-effort.
export async function kvTouchOnline(env, key, now = new Date()) {
  const store = kv(env);
  if (!store || !key) return;
  try {
    const ms = now.getTime();
    const prev = Number((await store.get(ONLINE_PREFIX + key)) || 0);
    if (ms - prev < TOUCH_MIN_MS) return; // already fresh; skip the write
    await store.put(ONLINE_PREFIX + key, String(ms), { expirationTtl: ONLINE_TTL_S });
  } catch { /* best-effort */ }
}

// Count visitors seen within the last 5 minutes: the number of
// online:<key> keys still alive (each expires 300s after its last
// touch). Null when KV is absent/unavailable. The count is cached
// for 30s per isolate: every session/stats call used to run a fresh
// list, and that burned the free list quota (it was exhausted on
// 2026-11-08, so the count dropped to 1). One list per 30s per
// isolate is plenty for a number that only moves once a minute.
let _onlineCache = { at: 0, n: null };
export async function kvGetOnline(env, now = new Date()) {
  const store = kv(env);
  if (!store) return null;
  if (now.getTime() - _onlineCache.at < 30 * 1000 && _onlineCache.n !== null) return _onlineCache.n;
  try {
    let n = 0;
    let cursor;
    for (let page = 0; page < 5; page++) {
      const res = await store.list({ prefix: ONLINE_PREFIX, cursor });
      n += (res.keys || []).length;
      if (res.list_complete) break;
      cursor = res.cursor;
      if (!cursor) break;
    }
    _onlineCache = { at: now.getTime(), n };
    return n;
  } catch { return null; }
}

// Record a visitor in KV (used by the in-memory fallback path, where
// D1 is unreachable so the D1 touchVisitor never runs). Touches the
// visitor online, and bumps the total ONLY the first time this key
// is ever seen. Best-effort; a failure never breaks the session.
export async function kvRecordVisitor(env, key, now = new Date()) {
  const store = kv(env);
  if (!store || !key) return;
  try {
    await kvTouchOnline(env, key, now);
    if (await store.get(KNOWN_PREFIX + key)) return; // already counted
    await store.put(KNOWN_PREFIX + key, '1');
    await kvBumpTotal(env);
  } catch { /* best-effort */ }
}
