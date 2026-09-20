# Noo YouNiverse — agent handoff

Read this file, `docs/MOBILE-ROADMAP.md`, `public/log.html`, and `public/sources.html` before changing anything.

## What this repository is

`castleism/nooyouniverse` is the **deploy repo** for the static site. Cloudflare Workers serves only `public/`. The long-form site roadmap lives in MyPersonas at `nooyouniverse.com/SITE-ROADMAP.md`.

Cillian O'Sullivan is a fictional, AI-assisted, human-reviewed Castleborn character. Content is educational only. Nothing here is medical advice.

## Approved missions

The live Mission Log on `main` is the canon this checkout may use:

- Missions **01–11** in `public/log.html`
- Source-basis badges and ledger in `public/sources.html`

Do **not** invent missions, curriculum, evidence tiers, sensor data, or clinical claims. Mission 12 exists only as a draft PR (`cursor/caffeine-context-variable-af50`) and is not approved on `main`. Package A drafts (alternate Missions 11–14 in MyPersonas outputs) were never approved and are not in this repo.

## Public-site honesty

Mission 09 and the homepage waitlist describe an **unbuilt / not-released product**. A private debug prototype in `mobile/` does not make the public site a released tracker. Do not change waitlist or Mission 09 copy to claim store availability, measurements, prescriptions, or FDA status.

## Mobile milestone 1

`mobile/` is a **private, on-device observation log** linked to the approved missions above.

- Observations are notes, not medical measurements.
- No sensors, no invented vitals, no dosing, no diagnosis.
- Persistence is local (`localStorage` / Android WebView DOM storage).
- Export/import is versioned JSON (`noo-private-observation-log` v1) and rejects unknown missions and clinical/measurement fields.
- Test fixtures in `mobile/tests/fixtures/` are synthetic. The app starts empty.
- Existing owner phone-test prototypes are local and are **not** in this cloud checkout. Do not claim access to them. If signing keys differ, use export/import or side-by-side install.

## Commands

```bash
cd mobile
npm test
npm run serve   # http://127.0.0.1:4173
```

Android debug APK (when an SDK is present): see `docs/BUILD-ANDROID.md`.

## Hard limits

Do not merge, deploy, publish to stores, change account permissions, use production secrets, or start paid services unless a human explicitly asks. Store accounts may be verified; submissions are later. Prefer small, honest diffs. Keep public `public/` architecture intact unless the task is a site change.
