# APKs (this environment)

| File | Package id | Version | Signature | Use |
|---|---|---|---|---|
| `noo-observation-log-0.2.0-release.apk` | `com.nooyouniverse.observationlog` | 0.2.0 (versionCode 2) | **release key** `noo-release-2026.jks` (SHA-256 `1241938b…eb0f`), v2+v3 | **Install this one.** Not debuggable; debug intent hooks off. |
| `noo-observation-log-debug.apk` | `com.nooyouniverse.observationlog.debug` | 0.1.0-debug | debug keystore of the 2026-09-25 cloud build | Source of `classes*.dex` for `scripts/repack-apk.sh`; emulator probes. |

Both install **three** launcher apps: **Noo YouNiverse** (offline site copy), **Noo Observation Log**, **Noo Check Hub**. Different package ids, so they can sit side by side; export/import JSON to move notes between them.

- Not Play Store / App Store artifacts. Do not submit either.
- 0.2.0 built 2026-09-26 with `scripts/repack-apk.sh` (see `docs/BUILD-ANDROID.md`): offline site copy now matches `public/` on `main` (Missions 01–11, no `.deploy-poke`, network-first service worker).
- A copy of the release APK and the install note is in the owner Drive folder `Noo YouNiverse — phone check`.
