# Noo YouNiverse site roadmap (deploy-repo view)

Last reconciled: 2026-09-26 AKDT · long-form roadmap: `MyPersonas/nooyouniverse.com/SITE-ROADMAP.md`

## Current state

- `nooyouniverse.com` live on a Cloudflare Worker serving `public/`.
- Live Mission Log: 01–11 (M11 "Sleep before stack", September 2026).
- `main` now carries: installable PWA (manifest with shortcuts, network-first
  service worker, offline page, maskable icons under `/assets`), `_headers`
  (CSP + hardening), no `.deploy-poke`, the private Android observation log
  under `mobile/`, a Docker self-host mirror under `deploy/docker/`, and the
  Claude Design brief for Missions 12–15 art.
- Package A (P-Value / Claim Constellation / Flight Plan / Field-not-Measurement)
  ships as **Missions 12–15**; still zero approved, zero on site.
- Social destinations stay text-only/unverified; Cillian's MyPersonas profile
  stays unpublished.

## Dated content plan

| Target | Item | Gate |
|---|---|---|
| **overdue since 2026-09-04** | Name the human health/science approver | qualified accountable reviewer and written scope — **master blocker** |
| +1 week after approver | 12 — The P-Value Is Not the Payload | copy, source, visual (`docs/CLAUDE-DESIGN-BRIEF-missions-12-15.md`), owner approval |
| +2 weeks | 13 — The Claim Is the Whole Constellation | same + legal read if applied to a named claim |
| +3 weeks | 14 — Read the Flight Plan Before the Landing | same |
| +4 weeks | 15 — Tracker Build Diary: A Field Is Not Yet a Measurement | same + product, privacy, legal, health-safety, technical review |
| 2026-11-02 | Next-quarter checkpoint | only approved `/log` entries with sources/corrections support |

Dates are editorial targets. Ingredient-specific or health-benefit material
does not advance without the named human reviewer. Never imply testing,
efficacy, clinical validation, or lived experience.

## Release gates

- Verify every public account destination before adding live social links.
- Approve Cillian's exact public fields before MyPersonas republication.
- Preserve Verified / Reported / Inferred / Unknown language and the corrections path.
- Build, approve, deploy, and verify each mission as separate states.
- Every deploy: `npx wrangler deploy` or dashboard confirm (the Git hook is
  unreliable), then live readback of `/manifest.webmanifest`, `/sw.js`,
  `/.deploy-poke` → 404, CSP header present.
- After any `public/` change, rebuild the APK so the offline copy matches
  (`mobile/scripts/repack-apk.sh`, `docs/BUILD-ANDROID.md`).

## Changelog

- **2026-09-26** — Consolidated three competing PWA branches into `main`
  (kept the network-first SW/offline page/manifest-with-shortcuts; merged
  `cursor/mission-observation-tracker-7487` for `mobile/` and docs; merged
  `codex/noo-roadmap-20260924` for `_headers` and `.deploy-poke` removal).
  Offline site copy rebundled without Cloudflare-only files. Release-signed
  APK 0.2.0 (`com.nooyouniverse.observationlog`) built via Gradle-free repack;
  release keystore created (`_ops/keystores/`, never in git). Added
  `deploy/docker/` mirror + `verify.sh`, `docs/DESKTOP.md`,
  `docs/CLAUDE-DESIGN-BRIEF-missions-12-15.md`. PWA verified headless
  (SW active on all four pages, offline nav to cached and unknown routes).
  Deploy + phone install status: see `docs/MOBILE-ROADMAP.md` evidence log.
- **2026-09-25** — PWA files, favicon, checkpoint of local work.
- **2026-09-18** — Mission 11 live.
- **2026-08-26** — Phase 3 verified live.
- **2026-09-26 (later)** — `main` 0478c13 pushed; Cloudflare Git build
  succeeded and deployed (version 2917eaa8, 100% traffic). Live readback:
  `/manifest.webmanifest` 200 (5 icons, 3 shortcuts), `/sw.js` 200 and
  active, `/offline.html` 200, `/.deploy-poke` and `/_headers` 404, CSP +
  nosniff + frame-deny on every response. Follow-up: CSP allow-listed
  Cloudflare Web Analytics (`static.cloudflareinsights.com`,
  `cloudflareinsights.com`) which the first CSP had blocked.
