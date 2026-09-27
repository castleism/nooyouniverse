# Verified debug-to-release transition plan — 2026-09-27

**Do not install while the portfolio installation hold is active.** This is a future execution plan; no personal observations were read or migrated.

## Identity evidence

Installed: com.nooyouniverse.observationlog.debug, code 1, 0.1.0-debug, target 36. Read-only APK pull confirmed signer SHA-256 e522332903499b3e615e03f543358836a3c89360904b202ca3745af6f16b2deb.

Existing release: com.nooyouniverse.observationlog, code 2, 0.2.0; signer 1241938be1eea287e5797c8671640157082027a391b4dffb1168c7a4ccd0eb0f. New source-built release: same release ID/key, code 3, 0.2.1, target 36. See mobile/BUILD-EVIDENCE-20260927.json. The two package IDs have separate Android data sandboxes. A matching version does not transfer data; a release install cannot upgrade the debug app.

## Tested preparation

- Read-only extraction of the installed debug engine; synthetic fixture imported into it, exported, then imported into current engine: identical observations. No device storage was accessed.
- Regression test confirms separate stores preserve corrections, repeat merge imports are idempotent and the original store remains intact.
- Both Gradle variants built from source (no patched/reused DEX needed); release lint passed. New release signed with the existing owner key using mobile/scripts/sign-release.ps1; passwords never written into tracked files. All 39 packaged web files match source exactly. Existing 0.2.0 APK also matched the 39 files.
- No Android runtime acceptance has been run: installation is held. Browser gate/save/reload/export/invalid-clinical-field rejection and hub smoke passed.

## After the portfolio gate is explicitly released

1. In the existing debug app export version-1 noo-private-observation-log JSON to an owner-controlled file. Keep two private copies; record counts and selected observations/correction counts. Do not send the backup to any service.
2. Recheck candidate hash, package, code, target and release certificate against the evidence. Keep the debug app installed and untouched.
3. Install the release side by side; acknowledge the 21+ / non-medical gate anew (acknowledgment is intentionally separate from observations).
4. Import the JSON using Merge. Compare entry IDs, counts, dates, context, uncertainty and correction history against the saved export. Export from release and compare parsed observations. Verify after relaunch/process death.
5. Keep the old debug app and backups until owner acceptance. Failure: stop, retain old app, correct the importer or candidate. No uninstall, downgrade, clear-data or signature bypass is a recovery step.

## Other completed work and residuals

Windows Python/Chrome discovery and smoke-server readiness were repaired. Puppeteer was updated to 25.12.0: npm audit reports zero vulnerabilities. Unit suite now has 22 passing tests. Docker image built locally and the actual container passed all 10 routing/header/privacy-path checks. The temporary loopback container was stopped after testing.

Named health/science approver, unsigned review packet, Missions 12–15 approval, production-account decisions and any remote sync remain gated. iOS signing/build requires Mac/Xcode and owner signing credentials. Public GETs here returned uniform HTTP 403 for both public/private paths; this cannot verify live routing, analytics or deployment parity. Smallest next action: owner/account-side preview/readback or a permitted network vantage; no redeployment authorized.
