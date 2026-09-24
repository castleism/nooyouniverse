# nooyouniverse.com — deploy repo

Static site for Noo YouNiverse (Cillian O'Sullivan, a fictional Castleborn character).

**Source of truth:** `MyPersonas/nooyouniverse.com/` — edit there, copy into `public/` here, push to deploy.
Docs & roadmap: `MyPersonas/nooyouniverse.com/SITE-ROADMAP.md`.

## Deploy

Cloudflare Workers (static assets), Git-connected to this repo. A push to `main` is configured to trigger a build, but that hook has failed before; every release requires dashboard build/deployment confirmation and live readback.

- `wrangler.jsonc` — declares `./public` as the asset directory; `404.html` handles unknown routes.
- `public/` — the entire published site. Nothing outside `public/` is served.
- `public/_headers` — Cloudflare static response headers; the current hardening candidate is local-only until separately approved, deployed, and verified live.
- `public/CNAME` — retained for the GitHub Pages fallback path only; harmless on Cloudflare.

The MyPersonas deployment helper is preview-first. Do not push this repository merely to test a sync: a push to `main` may publish externally.

Custom domain is attached in the Cloudflare dashboard (Worker → Domains → Custom domains).
