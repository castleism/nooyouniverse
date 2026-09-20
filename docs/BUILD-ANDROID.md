# Build the Android debug APK

This produces a **sideload debug APK** for the private observation log. It is not a Play Store artifact. Do not upload it to any store from this recipe.

The app uses a WebView over offline assets. It has no `INTERNET` permission and does not read sensors.

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

# 3. Generate or use the Gradle wrapper, then assemble debug
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
