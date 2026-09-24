# nooyouniverse.com — deploy repo

Static site for Noo YouNiverse (Cillian O'Sullivan, a fictional Castleborn character).

**Source of truth:** `MyPersonas/nooyouniverse.com/` — edit there, copy into `public/` here, push to deploy.
Docs & roadmap: `MyPersonas/nooyouniverse.com/SITE-ROADMAP.md`.

## Deploy

Cloudflare Workers (static assets), Git-connected to this repo. Pushing to `main` triggers a build.

- `wrangler.jsonc` — declares `./public` as the asset directory; `404.html` handles unknown routes.
- `public/` — the entire published site. Nothing outside `public/` is served.
- `public/CNAME` — retained for the GitHub Pages fallback path only; harmless on Cloudflare.

Custom domain is attached in the Cloudflare dashboard (Worker → Domains → Custom domains).

## Phone / Android

A cloud checkout **cannot** push an icon onto a physical phone.

After this site is deployed:

1. Open Chrome on Android → `https://nooyouniverse.com/check`
2. ⋮ → **Add to Home screen** / **Install app**
3. Use that launcher icon as the live website (Mission Log, sources, waitlist)

PWA files: `public/manifest.webmanifest`, `public/sw.js`, `public/icons/`.
Playbook: `docs/ANDROID-HOME-SCREEN.md`. Tick list: `docs/PHONE-CHECKLIST.md`.

The public observation tracker is still unbuilt (Mission 09). A private debug Check Hub APK is drafted on [PR #3](https://github.com/castleism/nooyouniverse/pull/3) and is not a store listing.
