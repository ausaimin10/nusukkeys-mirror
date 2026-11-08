// NusukKeys service worker — the offline layer. One shared file for
// every host (main site and all mirrors, at a root or under a subpath):
// all paths are relative, so it works identically everywhere.
//
// Installed on a visitor's first load. Afterwards it adds the one
// layer the page itself cannot provide: working when the page cannot
// be fetched at all.
//
//  - Navigations: network first (5s timeout) so updates arrive, with
//    the cached shell as fallback — the site opens even when the
//    network or this host is completely down.
//  - codes.json / codes-head.json: network first (4s), cache fallback.
//  - Other same-origin static files: stale-while-revalidate.
//  - /api/* and cross-origin requests are never intercepted, so the
//    database flow and the page's own cross-origin fallbacks are
//    untouched.
//  - If a navigation fails AND nothing is cached (first visit during
//    an outage), the worker redirects to the next live host in the
//    chain (each candidate is probed first); if none answers, it
//    serves a small offline page with the mirror links instead of a
//    browser error page.
//
// The cache is explicit and single-version ('nk-v32'); old caches are
// deleted on activate. Bump this version on EVERY deploy that changes
// any shell file (index.html, app.js, styles.css, sw.js itself), or
// returning visitors keep running the old cached files: the worker
// serves app.js/styles.css stale-while-revalidate from ITS cache, so
// a deploy that only changes app.js never reaches a returning
// visitor's page until the worker itself changes. (Seen live twice:
// 2026-11-06 the Task-18 app.js ran stale under nk-v1, and the
// reload fix ran stale under nk-v2 because only app.js changed.)
const CACHE = 'nk-v32';
const SHELL = ['./', 'index.html', 'styles.css', 'app.js', 'favicon.svg', 'manifest.webmanifest', 'codes.json', 'codes-head.json'];
const CHAIN = [
  'https://nusukkeys-cu9.pages.dev/',
  'https://nusukkeys-mirror.pages.dev/',
  'https://nusukkeys-backup.pages.dev/',
  'https://ausaimin10.github.io/nusukkeys-mirror/',
  'https://nusukkeys-mirror.netlify.app/',
  'https://nusukkeys-mirror.web.app/',
  'https://cdn.jsdelivr.net/gh/ausaimin10/nusukkeys-mirror@main/index.html'
];
const OFFLINE_HTML = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>NusukKeys — temporarily unavailable</title><style>body{margin:0;background:#0b261f;color:#e8f0e9;font-family:system-ui,sans-serif;text-align:center;padding:48px 20px}a{color:#f2b84b}</style></head><body><h1>NusukKeys</h1><p>This host is not reachable right now. Try a backup copy of the site:</p><p><a href="https://nusukkeys-mirror.pages.dev/">Backup mirror</a> &middot; <a href="https://nusukkeys-backup.pages.dev/">Second backup</a></p><p>Your used codes are saved in this browser, so they are not lost.</p></body></html>';

function fetchWithTimeout(url, ms) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), ms);
  return fetch(url, { signal: ctl.signal }).finally(() => clearTimeout(timer));
}
// Liveness probe only: no-cors, so any HTTP answer counts as alive and
// no CORS headers are needed on the target.
async function probeHost(url) {
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 3000);
    // The chain entry is a page URL (a root, a subpath, or a file URL
    // like the jsDelivr index.html): probe the code file next to it.
    const base = url.endsWith('/') ? url : url.slice(0, url.lastIndexOf('/') + 1);
    try { await fetch(base + 'codes-head.json', { mode: 'no-cors', signal: ctl.signal }); return true; }
    finally { clearTimeout(timer); }
  } catch (e) { return false; }
}
async function putCache(request, res) {
  try {
    const cache = await caches.open(CACHE);
    await cache.put(request, res.clone());
  } catch (e) { /* cache is best-effort */ }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}).then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // cross-origin: pass through
  if (url.pathname.includes('/api/')) return; // API: network only (root or subpath)

  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const res = await fetchWithTimeout(event.request.url, 5000);
        putCache(event.request, res);
        return res;
      } catch (e) {
        const cached = (await caches.match(event.request, { ignoreSearch: true })) || (await caches.match('index.html'));
        if (cached) return cached;
        for (const host of CHAIN) {
          if (new URL(host).hostname === self.location.hostname) continue;
          if (await probeHost(host)) return Response.redirect(host, 302);
        }
        return new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }
    })());
    return;
  }

  if (url.pathname.endsWith('/codes.json') || url.pathname.endsWith('/codes-head.json')) {
    event.respondWith((async () => {
      try {
        const res = await fetchWithTimeout(event.request.url, 4000);
        putCache(event.request, res);
        return res;
      } catch (e) {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        throw e;
      }
    })());
    return;
  }

  // Other static assets: serve the cache at once, refresh behind it.
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    const network = fetch(event.request).then((res) => { putCache(event.request, res); return res; }).catch(() => null);
    if (cached) { network.catch(() => {}); return cached; }
    return (await network) || fetch(event.request);
  })());
});
