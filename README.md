# nooyouniverse.com — deploy repo

Static site for Noo YouNiverse (Cillian O'Sullivan, a fictional Castleborn character).

**Source of truth:** `MyPersonas/nooyouniverse.com/` — edit there, copy into `public/` here, push to deploy.
Docs & roadmap: `MyPersonas/nooyouniverse.com/SITE-ROADMAP.md`.
Agent handoff: `AGENTS.md`. Mobile milestone roadmap: `docs/MOBILE-ROADMAP.md`. Desktop/self-host: `docs/DESKTOP.md`, `deploy/docker/`. Missions 12–15 art brief: `docs/CLAUDE-DESIGN-BRIEF-missions-12-15.md`.

`mobile/` is a **private debug observation log** plus a check-hub APK that also carries an offline copy of this site. One sideload adds three launcher apps (website copy, observation log, check hub); install `mobile/dist/noo-observation-log-0.2.0-release.apk`. Cloudflare still serves only `public/`. The public Mission Log and waitlist still describe the tracker as not a released product. PWA files in `public/` let Android Chrome add the live site to the home screen after deploy. Owner phone drop: Google Drive folder `Noo YouNiverse — phone check`.

## Deploy

Cloudflare Workers (static assets), Git-connected to this repo. A push to `main` is configured to trigger a build, but that hook has failed before; every release requires dashboard build/deployment confirmation and live readback.

- `wrangler.jsonc` — declares `./public` as the asset directory; `404.html` handles unknown routes.
- `public/` — the entire published site. Nothing outside `public/` is served.
- `public/_headers` — Cloudflare static response headers (CSP, nosniff, frame-deny, referrer, permissions). On `main` since 2026-09-26; verify live after each deploy.
- `public/CNAME` — retained for the GitHub Pages fallback path only; harmless on Cloudflare.

The MyPersonas deployment helper is preview-first. Do not push this repository merely to test a sync: a push to `main` may publish externally.

Custom domain is attached in the Cloudflare dashboard (Worker → Domains → Custom domains).
