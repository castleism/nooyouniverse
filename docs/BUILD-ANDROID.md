# Build the Android debug APK

This produces a **sideload debug APK** for **Noo Check Hub**: offline website copy, observation log, and a checklist of live pages. It is not a Play Store artifact. Do not upload it to any store from this recipe.

The app uses a WebView over offline assets. It has no `INTERNET` permission and does not read sensors. Live `https://` taps open Chrome.

## Prerequisites

- JDK 17+ (this environment used 21)
- Android SDK with `platforms;android-34` and `build-tools;34.0.0`
- The mission catalog generated from this repo (`npm run prepare-web` in `mobile/`)

## Reproducible steps

```bash
# 1. Refresh the approved-mission catalog from public/log.html
cd mobile
npm test

# 2. Point Gradle at the SDK
#    Copy mobile/android/local.properties.example → local.properties
#    Set sdk.dir to the absolute SDK path.

# 3. The Gradle wrapper is committed. Assemble debug:
cd android
./gradlew :app:assembleDebug
```

The APK lands at:

`mobile/android/app/build/outputs/apk/debug/app-debug.apk`

Install with:

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

## Signing and user data

Debug builds are signed with the local debug keystore. A different machine (including this cloud checkout versus an owner's existing phone prototype) will usually have a **different signature**.

- Android will not upgrade over a differently signed package.
- **Preserve user data:** export JSON from the old install, install side-by-side or after uninstall, then import.
- Existing owner phone-test prototypes are local and are not in this cloud checkout.

## If the SDK is missing

Install command-line tools, accept licenses, then:

```bash
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

If this cloud environment cannot complete that install, use `cd mobile && npm run serve` and exercise the same UI in a browser. The persistence and export/import code is the same library.

## Repack without Gradle (release-signed sideload)

Used for the 2026-09-26 build. When `dl.google.com` (Android SDK, AGP, Google
Maven) is unreachable, Gradle cannot run, but the Java side of this app is tiny
and unchanged since the last Gradle build, so `mobile/scripts/repack-apk.sh`
rebuilds everything else:

1. `npm run prepare-web` refreshes `assets/www` and the offline site copy.
2. `aapt2 link` against `android-34/android.jar` rebuilds `AndroidManifest.xml`
   and `resources.arsc` from source with the requested `versionCode` /
   `versionName` / package id (`com.nooyouniverse.observationlog`, no
   `.debug` suffix, `android:debuggable="false"`).
3. `classes*.dex` are reused from `dist/noo-observation-log-debug.apk`
   (built at `95df7f2`, after the last change to `MainActivity.java` /
   `AndroidManifest.xml`). With `RELEASE=1` the script flips
   `BuildConfig.DEBUG` to `false` inside the dex — AGP stores it as
   `Boolean.parseBoolean("true")`, so the literal is rewritten in place and the
   dex checksum/SHA-1 recomputed. The debug `noo_debug_cmd` intent hooks are
   therefore inert in the release repack.
4. `zipalign -p 4`, then v2+v3 signing with uber-apk-signer.

Tools that do not need `dl.google.com`:

| Tool | Source |
|---|---|
| `aapt2`, `zipalign` (static linux x86_64) | github.com/lzhiyong/android-sdk-tools release `34.0.3` |
| `android-34/android.jar` | github.com/Sable/android-platforms |
| signer (`apksig` + zipalign wrapper) | github.com/patrickfav/uber-apk-signer `1.3.0` |

```bash
export AAPT2=…/aapt2 ZIPALIGN=…/zipalign ANDROID_JAR=…/android-34/android.jar SIGNER_JAR=…/uber-apk-signer.jar
RELEASE=1 VERSION_CODE=3 VERSION_NAME=0.3.0 \
KS=…/noo-release-2026.jks KS_ALIAS=noo-release KS_PASS=… \
mobile/scripts/repack-apk.sh mobile/dist/noo-observation-log-0.3.0-release.apk
```

**If `MainActivity.java`, the manifest `<activity>` set, or `res/` change**, the
reused dex is stale: do a real Gradle build (above) on a machine with the SDK
(Android Studio is installed on the owner's Windows PC), then commit that
`app-debug.apk` as the new `BASE_APK`.

## Release keystore

`noo-release-2026.jks` (alias `noo-release`, RSA-4096, valid to 2056) lives
**outside git** at `Documents/GitHub/_ops/keystores/` next to its
`.keystore.properties`. Every future sideload/Play build must use this key or
Android refuses the upgrade. Back it up (Drive folder “Noo YouNiverse — phone
check”). Never commit it; `.gitignore` blocks `*.jks` / `*.keystore`.
