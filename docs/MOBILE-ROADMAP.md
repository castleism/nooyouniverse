# Noo YouNiverse — mobile observation-log roadmap

**2026-09-27 execution:** See [DATA-TRANSITION-20260927.md](DATA-TRANSITION-20260927.md) for fresh build/test evidence, source reconciliation and remaining dependencies. Portfolio installation hold remains active.

Updated: 2026-09-26 (merged to main; release-signed APK 0.2.0; Docker mirror) · Owner: Christian · Persona: Cillian / Noo YouNiverse  
Companion to MyPersonas `nooyouniverse.com/SITE-ROADMAP.md` (site Phase 3 live; Package A still unapproved).

This file tracks the **private debug tracker**, not a store product. Public Mission 09 remains an unbuilt-product concept.

## Cursor-completable product work — finished

| Item | State |
|---|---|
| Approved-mission catalog from `public/log.html` (01–11) | ✅ |
| Context + uncertainty + observations, including Mission 06 `stayedComparable` | ✅ |
| History, search, mission/outcome filters | ✅ |
| Edit with append-only correction history | ✅ |
| Delete one entry + wipe all on-device notes | ✅ |
| Validated export/import | ✅ |
| Persistence across relaunch (web) | ✅ |
| Persistence after Android force-stop (emulator) | ✅ 2026-09-24 `emulator-persistence.sh` |
| 21+ / not-medical first-run acknowledgment | ✅ |
| Unreadable-store recovery | ✅ |
| Observations kept distinct from measurements | ✅ |
| Fixtures isolated from shipped UI | ✅ |
| Android `allowBackup=false` | ✅ |
| PWA / iOS home-screen path | ✅ `docs/IOS-HOME-SCREEN.md` |
| Owner sideload playbook | ✅ `docs/DEVICE-INSTALL.md` |
| Human review packet (unsigned) | ✅ `docs/REVIEW-PACKET.md` |
| Store listing drafts — not submitted | ✅ `docs/STORE-LISTING-DRAFT.md` |
| Remote sync explicitly gated, not built | ✅ `docs/SYNC-BACKLOG.md` |
| Public waitlist / Mission 09 unchanged | ✅ |
| Unit tests | ✅ `cd mobile && npm test` |
| Headless Chrome smoke | ✅ `npm run smoke` |
| Installable Android debug APK | ✅ `mobile/dist/noo-observation-log-debug.apk` (dex source for repacks) |
| **Release-signed sideload APK 0.2.0** | ✅ `mobile/dist/noo-observation-log-0.2.0-release.apk` — `com.nooyouniverse.observationlog`, not debuggable, studio release key; built 2026-09-26 by `scripts/repack-apk.sh` (Gradle-free; `docs/BUILD-ANDROID.md`) |
| Gradle-free rebuild path when SDK downloads are blocked | ✅ `mobile/scripts/repack-apk.sh` |
| Desktop install + self-host mirror | ✅ `docs/DESKTOP.md`, `deploy/docker/` |
| Check hub of every site/app to verify | ✅ `mobile/web/hub.html` |
| Offline snapshot of `public/` in the APK | ✅ `npm run bundle-site` |
| Live-site PWA files for Chrome Add to Home screen | ✅ on `main` 2026-09-26: manifest + shortcuts + maskable icons + network-first SW + offline page on all pages; headless-verified. Live once the Cloudflare deploy in the evidence log shows ✅ |
| Phone checklist | ✅ `docs/PHONE-CHECKLIST.md` |
| Three Android launcher apps from one APK (site + log + hub) | ✅ |

## Recommendations — what was done vs still human

| Recommendation | Cursor action this pass | Still needs a human |
|---|---|---|
| Owner phone install + process death | Hub APK + offline site + playbook + emulator probe | Your phone: sideload + Chrome Add to Home screen |
| Live website as a browser app | PWA files + `docs/ANDROID-HOME-SCREEN.md` | You tap Add to Home screen; merge/deploy for full PWA |
| Privacy / legal / health review | Unsigned packet with data inventory and sign-off table | Named reviewers; Cursor did **not** sign |
| Auth / remote sync | Documented why it stays out; no server added | Packet sign-off first |
| No community / FHIR / sensors / dosing | Still not implemented | Do not approve those specs here |
| iOS IPA / TestFlight / store submit | Listing drafts only; no Xcode; **not submitted** | Mac + you press Submit later |
| Merge / deploy | Merged to `main` 2026-09-26 (owner-authorized). Deploy: see evidence log | Confirm deploy if the evidence log still shows ⚠️ |
| Local phone prototypes | Not accessed | Export/import if you compare installs |

## Still blocked

- Physical owner device (this checkout is not your phone) — APK + link staged; you tap Install
- Named health-claim approver — **master blocker**, overdue since 2026-09-04
- iOS IPA (needs a Mac); Android release keystore now exists (`_ops/keystores/`)
- Store upload (accounts verified; submissions later; review packet unsigned)
- Missions 12–15: copy drafted, art brief written (`docs/CLAUDE-DESIGN-BRIEF-missions-12-15.md`), zero approved; `cursor/caffeine-context-variable-af50` remains an unapproved draft branch

## Evidence log

| Check | Result | Notes |
|---|---|---|
| `cd mobile && npm test` | ✅ 2026-09-25 | 21/21 including PWA install fields |
| `cd mobile && npm run smoke` | ✅ | Gate → save → reload → `heartRate` rejected |
| Emulator force-stop persistence | ✅ 2026-09-24 | Seed count 1 → force-stop → dump still `noo-private-observation-log` observation |
| Android debug APK | ✅ | `mobile/dist/noo-observation-log-debug.apk` |
| Release APK 0.2.0 repack | ✅ 2026-09-26 | aapt2 rebuild of manifest/arsc (versionCode 2, debuggable=false), dex reused from `95df7f2` build with `BuildConfig.DEBUG` flipped false, no `.deploy-poke` in assets, zipalign + v2/v3 signature verified, badging verified. **Not run on a device/emulator in this environment** (no SDK/KVM) — first launch on the phone is the runtime check |
| PWA on `main`, headless Chromium | ✅ 2026-09-26 | SW active on `/`, `/log`, `/sources`, `/corrections`; 14 shell entries cached; offline `/log` served from cache; offline unknown route → "Signal lost" page |
| `deploy/docker` nginx parity | ✅ config, ⚠️ image | `verify.sh` 10/10 against nginx running the shipped `nginx.conf`; `docker build` not run here (no daemon) |
| Cloudflare deploy of `main` | ✅ 2026-09-26 | Git build of 0478c13 succeeded; version 2917eaa8 at 100% traffic. Live: manifest 200 (3 shortcuts), SW active, offline page 200, `.deploy-poke` 404, CSP/nosniff/frame-deny present. CSP then widened for Cloudflare Web Analytics |
| Play / App Store submit | ❌ not done | Drafts only |
| Owner phone | ⚠️ APK + steps in Drive | https://drive.google.com/drive/folders/1sAyTL0yxwY8SpEpfpHBnXpR8w0nOAway — you tap Install |
