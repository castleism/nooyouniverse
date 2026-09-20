# Noo YouNiverse — mobile observation-log roadmap

Updated: 2026-09-20 · Owner: Christian · Persona: Cillian / Noo YouNiverse  
Companion to MyPersonas `nooyouniverse.com/SITE-ROADMAP.md` (site Phase 3 live; Package A still unapproved).

This file tracks the **private debug tracker**, not a store product. Public Mission 09 remains an unbuilt-product concept.

## Cursor-completable product work — finished in this checkout

| Item | State |
|---|---|
| Approved-mission catalog from `public/log.html` (01–11) | ✅ |
| Context + uncertainty + observations, including Mission 06 `stayedComparable` | ✅ |
| History, search, mission/outcome filters | ✅ |
| Edit with append-only correction history | ✅ |
| Delete one entry + wipe all on-device notes | ✅ |
| Validated export/import | ✅ |
| Persistence across relaunch | ✅ |
| 21+ / not-medical first-run acknowledgment | ✅ |
| Unreadable-store recovery (raw export + discard) | ✅ |
| Observations kept distinct from measurements | ✅ Schema + import |
| Fixtures isolated from shipped UI | ✅ `mobile/tests/fixtures/` only |
| Android `allowBackup=false` (notes are not auto-backed up to cloud) | ✅ |
| PWA / iOS home-screen path documented | ✅ `docs/IOS-HOME-SCREEN.md` |
| Public site waitlist / Mission 09 product claims unchanged | ✅ Intentionally unchanged |
| Unit tests | ✅ `cd mobile && npm test` |
| Headless Chrome smoke | ✅ `npm run smoke` 2026-09-20 |
| Installable Android debug APK | ✅ rebuilt after this slice |

### What this app is

A local-only log: pick one approved mission, record one ordinary variable, surrounding context (including what stayed roughly comparable), prior expectation, outcome (including null), stated uncertainty, and whether a pattern repeated. Correct without erasing the previous note. Export, import, or wipe. No sensors. No Android `INTERNET` permission. No cloud backup of notes.

### What this app is not

Not a released product, treatment tool, recommendation engine, medical record, measurement device, FDA-governed app, or store submission. Uncertainty is user-stated, not computed. Sleep-window fields are qualitative notes, not sleep-score or vitals.

## Still blocked — Cursor cannot finish these

1. **Owner device install** of the debug APK / PWA on a physical phone. Confirm persistence after process death. If the debug keystore differs from any local prototype, import a JSON export rather than overwrite.
2. **Human + privacy/legal/health review** before any public capability claim or waitlist copy change.
3. **Auth / remote sync** — out of scope until those reviews exist. The log must stay on-device.
4. **Community reports, Amber/Red gating, FHIR/MyChart, dosing, stacks, or sensor APIs** from the unapproved 2026-08-13 app specs — do not add.
5. **Signed iOS IPA / TestFlight / App Store or Play submission.** This Linux checkout has no Xcode. Store accounts are verified (Google personal); submissions stay later.
6. **Merging this branch or deploying `main`.** Cloudflare hook drift is a known ops issue; this is not a silent site release.
7. **Local owner phone-test prototypes** — not in this cloud checkout. Do not claim access.

## Concrete blockers

- This cloud checkout does **not** contain the owner's local phone-test prototypes or their signing keys.
- No named human health-claim approver (site roadmap, still open). Ingredient/dose/condition content stays gated.
- Automatic Cloudflare deploy hook was previously unreliable; do not merge as a silent site release.
- Mission 12 caffeine draft is an open PR, not approved canon. Do not add it to the catalog until it lands on `main`.
- No Xcode / Apple signing toolchain here.

## Evidence log

| Check | Result | Notes |
|---|---|---|
| `cd mobile && npm test` | ✅ 16/16 | Catalog 01–11; corrections; wipe; filters; recovery |
| `cd mobile && npm run smoke` | ✅ | Headless Chrome: 21+ gate → Mission 07 null save → reload → `heartRate` import rejected |
| Browser smoke (M1 + this slice) | ✅ 2026-09-20 | iPhone XR viewport; additional flows verified after this slice |
| Android debug APK | ✅ rebuilt | `mobile/dist/noo-observation-log-debug.apk` |

Owner phone-test prototypes remain local and were **not** available here. If a later sideload uses a different signature, export JSON from the old install and import — do not overwrite.
