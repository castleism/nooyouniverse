# Debug APK (this environment)

`noo-observation-log-debug.apk` is a **sideload debug build** that installs **three** launcher apps: **Noo YouNiverse** (offline site copy), **Noo Observation Log**, and **Noo Check Hub**. It is signed with that environment's debug keystore. A copy of the install note lives in the owner Drive folder `Noo YouNiverse — phone check`.

- Not a Play Store / App Store artifact. Do not submit it.
- Existing owner phone prototypes are local and were not used to sign this file.
- If Android refuses an upgrade because the signature differs, keep the old app, export JSON, install side-by-side or after uninstall, then import.

Rebuild locally with `docs/BUILD-ANDROID.md`.
