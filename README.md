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

## Phone / browser app

The public site is a PWA (`public/manifest.webmanifest`, `public/sw.js`, `public/icons/`). After a merge + Cloudflare deploy:

1. Open `https://nooyouniverse.com/deck` in Android Chrome.
2. ⋮ → **Add to Home screen** or **Install app**.

`/deck` is the check hub: live pages (including Mission 12), AliaSpaces, and the companion observation-log debug PR. Tick marks stay in that browser. This checkout **cannot** push an icon onto a physical phone.

Playbook: `docs/ANDROID-HOME-SCREEN.md` · `docs/PHONE-CHECKLIST.md`.

The private debug APK / offline Check Hub lives on draft PR #3 and is not a released store product. Public Mission 09 remains an unbuilt concept.
