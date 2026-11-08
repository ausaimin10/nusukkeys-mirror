// NusukKeys — realtime "active now" count from Firebase Realtime DB.
//
// Why Firebase: the Cloudflare free tier cannot count live users
// reliably — D1 row writes (100k/day) and the KV list operation
// (1k/day) both ran out on 2026-11-08, so the "active now" number
// froze at 1 even while real users were on the site. Firebase
// Realtime Database (project nusukkeys-mirror, free Spark plan) is
// a separate service with its own limits, so it keeps working while
// Cloudflare's are out.
//
// How it works (no SDK, plain REST, no persistent connection):
//   * Every visitor's browser PUTs {t: <epoch ms>} to
//     /presence/<their-key>.json once a minute (see app.js
//     pingFirebasePresence). The key is the same identity the
//     /api/ping uses, so one visitor is one entry.
//   * firebaseGetOnline() GETs /presence.json (one read), counts the
//     entries whose timestamp is within the last 5 minutes, and
//     returns that count. Entries from closed tabs go stale on their
//     own (their timestamp ages past 5 min) and are ignored, so no
//     explicit "leave" signal is needed.
//   * The count is cached 30s per isolate, like kvGetOnline.
// The /presence node is public read/write by rule (it holds only a
// timestamp per visitor key — no personal data), and nothing else in
// the database is readable. Returns null on any failure, so callers
// fall back to the D1/KV counts.

const FIREBASE_DB_URL = 'https://nusukkeys-mirror-default-rtdb.firebaseio.com';
const ONLINE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes — the "active now" window
const CACHE_MS = 30 * 1000;

let _fbCache = { at: 0, n: null };

export async function firebaseGetOnline(now = new Date()) {
  if (now.getTime() - _fbCache.at < CACHE_MS && _fbCache.n !== null) return _fbCache.n;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 5000);
  try {
    const res = await fetch(FIREBASE_DB_URL + '/presence.json', { signal: ctl.signal });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    if (!data || typeof data !== 'object') {
      _fbCache = { at: now.getTime(), n: 0 };
      return 0;
    }
    const cutoff = now.getTime() - ONLINE_WINDOW_MS;
    let n = 0;
    for (const k of Object.keys(data)) {
      const e = data[k];
      if (e && typeof e.t === 'number' && e.t >= cutoff) n++;
    }
    _fbCache = { at: now.getTime(), n };
    return n;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
