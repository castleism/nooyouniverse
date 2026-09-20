# Noo YouNiverse — mobile observation-log roadmap

Updated: 2026-09-20 · Owner: Christian · Persona: Cillian / Noo YouNiverse  
Companion to MyPersonas `nooyouniverse.com/SITE-ROADMAP.md` (site Phase 3 live; Package A still unapproved).

This file tracks the **private debug tracker**, not a store product. Public Mission 09 remains an unbuilt-product concept.

## Milestone 1 — mission-linked private observation log

| Item | State |
|---|---|
| Approved-mission catalog from `public/log.html` (01–11) | ✅ Implemented in this branch |
| Context + uncertainty + observation fields (Mission 03/06/07/09) | ✅ Implemented |
| History + search | ✅ Implemented |
| Edit + delete | ✅ Implemented |
| Validated export/import | ✅ Implemented |
| Persistence across relaunch | ✅ Implemented (local store + reload) |
| Observations kept distinct from measurements | ✅ Enforced in schema + import |
| Fixtures isolated from shipped UI | ✅ `mobile/tests/fixtures/` only |
| Meaningful automated tests | ⏳ Recorded after `npm test` |
| Mobile browser smoke | ⏳ Recorded after manual pass |
| Installable Android debug APK | ⏳ Recorded if SDK/tooling permits |
| Public site waitlist / Mission 09 product claims unchanged | ✅ Intentionally unchanged |
| Local owner phone prototypes | ❌ Not in this cloud checkout — do not claim access |

### What M1 is

A local-only log: pick one approved mission, record one ordinary variable, surrounding context, prior expectation, outcome (including null), stated uncertainty, and whether a pattern repeated. Export and import a validated JSON document. No sensors. No network permission on Android.

### What M1 is not

Not a released product, treatment tool, recommendation engine, medical record, measurement device, FDA-governed app, or store submission. Uncertainty is user-stated, not computed. Sleep-window fields are qualitative notes, not sleep-score or vitals.

## Next milestones (not started)

1. **Owner device install** of the debug APK (or web build) on the verified personal Google account — sideload only. Confirm persistence after process death. If the debug keystore differs from any local prototype, import a JSON export rather than overwrite.
2. **Human + privacy/legal/health review** before any public capability claim or waitlist copy change.
3. **Auth / remote sync** remains out of scope until those reviews exist. M1 must stay on-device.
4. **Do not** add community reports, Amber/Red gating, FHIR/MyChart, dosing, stacks, or sensor APIs from the unapproved 2026-08-13 app specs.
5. **iOS debug build** after Android sideload is confirmed useful. Both store accounts are verified; submissions stay later.
6. **Optional:** append-only correction history per observation (charter-aligned), still without turning notes into measurements.

## Concrete blockers

- This cloud checkout does **not** contain the owner's local phone-test prototypes or their signing keys.
- No named human health-claim approver (site roadmap, still open). Ingredient/dose/condition content stays gated.
- Automatic Cloudflare deploy hook was previously unreliable; this branch must not be merged to `main` as a silent site release.
- Android SDK / Gradle are environment-dependent. If this run cannot produce an APK, the web build + `docs/BUILD-ANDROID.md` remain the reproducible path.
- Mission 12 caffeine draft is an open PR, not approved canon. Do not add it to the catalog until it lands on `main`.

## Evidence log (fill as work is verified)

| Check | Result | Notes |
|---|---|---|
| `cd mobile && npm test` | pending | |
| Browser smoke (missions, save, reload, search, edit, export/import) | pending | |
| Android debug APK | pending | |
