# nooyouniverse.com — deploy repo

Static site for Noo YouNiverse (Cillian O'Sullivan, a fictional Castleborn character).

**Source of truth:** `MyPersonas/nooyouniverse.com/` — edit there, copy into `public/` here, push to deploy.
Docs & roadmap: `MyPersonas/nooyouniverse.com/SITE-ROADMAP.md`.
Agent handoff: `AGENTS.md`. Mobile milestone roadmap: `docs/MOBILE-ROADMAP.md`.

`mobile/` is a **private debug observation log** plus a check-hub APK that also carries an offline copy of this site. One sideload adds three launcher apps (website copy, observation log, check hub). Cloudflare still serves only `public/`. The public Mission Log and waitlist still describe the tracker as not a released product. PWA files in `public/` let Android Chrome add the live site to the home screen after deploy. Owner phone drop: Google Drive folder `Noo YouNiverse — phone check`.

## Deploy

Cloudflare Workers (static assets), Git-connected to this repo. Pushing to `main` triggers a build.

- `wrangler.jsonc` — declares `./public` as the asset directory; `404.html` handles unknown routes.
- `public/` — the entire published site. Nothing outside `public/` is served.
- `public/CNAME` — retained for the GitHub Pages fallback path only; harmless on Cloudflare.

Custom domain is attached in the Cloudflare dashboard (Worker → Domains → Custom domains).
