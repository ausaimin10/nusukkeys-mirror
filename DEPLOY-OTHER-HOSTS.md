# NusukKeys — Deploy the mirror on other free hosts

The mirror is a database-free static copy of NusukKeys: `index.html` +
`codes.json` (13,721 codes, 618 KB). It needs no server, no database, no
card. It works on any static host. Used codes are saved only in each
visitor's own browser (localStorage), so it does NOT share used-code
history across devices — that is the trade-off for needing no database.

Package: `nusukkeys-mirror.zip` (~180 KB). Unzip it, or drag the zip
itself onto Netlify Drop.

## One Gmail per provider (keep accounts separate)

- Cloudflare (already live): ausaimin10@gmail.com — main, staging,
  mirror, backup mirror.
- Netlify: a second Gmail.
- Vercel: a third Gmail.
- GitHub Pages: a fourth Gmail.

Sign-in is the one step only Ahmad can do: each site asks him to sign
in with Google (or email). No account is created for him by Muse, and
no password is ever shared.

**Not done on purpose:** extra Cloudflare accounts to multiply the D1
database quota. Providers forbid using several accounts to get around
one account's limits, so the database stays on the one real account.
The mirrors avoid the database entirely instead.

## 1. Netlify Drop (fastest — drag and drop, no build)

1. Sign in at https://app.netlify.com/ with Google (Gmail #2).
2. Open https://app.netlify.com/drop and drag `nusukkeys-mirror.zip` onto it.
3. The site goes live at a random address like
   `https://cheery-...netlify.app`. Rename it in Site settings if wanted.

Free limits (new accounts, verified 2026-11-06): 300 credits a month,
hard cap. Bandwidth 20 credits per GB, web requests 2 credits per
10,000, each production deploy 15 credits. Roughly 15 GB of bandwidth
a month if nothing else uses credits. When credits run out, every site
on the account pauses until the next month.

## 2. Vercel (Hobby)

1. Sign in at https://vercel.com/ with Google (Gmail #3).
2. Unzip `nusukkeys-mirror.zip` into a folder, then in a terminal in
   that folder run: `npx vercel --prod` (accept the defaults).
   Or use the dashboard: Add New → Project → import a Git repo with
   these files.
3. The site goes live at `https://<name>.vercel.app`.

Free limits (Hobby, verified 2026-11-06): 100 GB bandwidth a month,
1,000,000 edge requests a month, 1,000,000 function invocations a
month (the mirror uses no functions). Hobby is for personal,
non-commercial projects only — NusukKeys is a free community tool
with no sales, so it fits, but it must stay non-commercial. At the
limit the site pauses until the monthly reset.

## 3. GitHub Pages

1. Sign in at https://github.com/ (Gmail #4, new account if needed).
2. Create a new **public** repository, e.g. `nusukkeys-mirror`.
3. On the repo page: Add file → Upload files → upload `index.html`
   and `codes.json` (and `README.md` if wanted). Commit.
4. Settings → Pages → Source: Deploy from a branch → branch `main`,
   folder `/ (root)`. Save.
5. The site goes live at `https://<username>.github.io/nusukkeys-mirror/`.

Free limits (verified 2026-11-06): 1 GB published site, 100 GB
bandwidth a month (soft limit), 10 builds an hour (soft limit).
Static files only — no server code, which the mirror does not need.
Public repos only on the free plan.

## What this does and does not fix

- More hosts = if Cloudflare is down, the Netlify/Vercel/GitHub
  copies still serve codes. That is real redundancy.
- It does NOT make the database-backed main site unlimited. The main
  site still uses Cloudflare D1: 5,000,000 rows read a day,
  100,000 function calls a day. At ~100 rows per page load that is
  roughly 20,000–50,000 page loads a day.
- It does NOT reach 10,000,000 simultaneous users. No free tier can.
  A single page load is ~700 KB; 10 million at once is ~7 TB in one
  burst, and 10 million database sessions would need ~1,000,000,000
  D1 row reads against a 5,000,000-a-day limit. That needs paid
  infrastructure (paid CDN + managed database with replicas + load
  balancing), not more free accounts.
