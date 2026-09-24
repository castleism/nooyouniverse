# Owner device install — sideload playbook

This is the human step Cursor cannot finish: install on **your** phone and confirm persistence after process death. Existing local phone-test prototypes are **not** in this cloud checkout. Do not overwrite them.

Debug APK: `mobile/dist/noo-observation-log-debug.apk`  
Package id: `com.nooyouniverse.observationlog.debug`  
This build is **debug-signed** by the machine that assembled it. Store submission is later.

## Preserve data if signing differs

Android will refuse an upgrade when the signature does not match.

1. Open the **old** install.
2. Transfer → Download JSON (keep that file off-device if you want a spare).
3. Install this APK **side-by-side** if the old id/signature differs, or uninstall only after the export is safe.
4. Transfer → Import (merge). Never replace until you have checked the export.

## Android sideload (personal Google account)

1. Enable Install unknown apps for the Files / browser app you will use.
2. Copy `noo-observation-log-debug.apk` to the phone.
3. Install. Accept only the sideload prompt — this APK requests **no** network, sensors, or accounts.
4. Open **Noo Observation Log (debug)**.
5. Accept the 21+ / not-medical gate.
6. Log one ordinary, non-medical observation on Mission 07 (include a null result).
7. Leave the app (Home). From Settings → Apps → Noo Observation Log → Force stop.
8. Reopen. The observation must still be in History.
9. Transfer → confirm export format `noo-private-observation-log`.
10. Optional: Settings → Apps → Storage — confirm you can still export before any uninstall.

Tick when done:

- [ ] Sideloaded this APK (or refused because signature collided — then used export/import)
- [ ] Gate accepted
- [ ] Observation survived Force stop
- [ ] Export opened and looks like notes, not measurements
- [ ] Old prototype data preserved

## iOS (home-screen PWA only)

See `docs/IOS-HOME-SCREEN.md`. This Linux checkout cannot sign an IPA. Safari → Share → Add to Home Screen, then repeat the force-quit / reopen check.

## Debug persistence probe (emulator or `adb`)

Debug builds accept an extra that writes `/data/data/com.nooyouniverse.observationlog.debug/files/noo-probe.json` (or the app-specific external file). It is **not** a user-facing feature and is compiled only when `BuildConfig.DEBUG` is true.

```bash
# After adb is connected to a device or emulator:
adb install -r mobile/dist/noo-observation-log-debug.apk
adb shell am start -n com.nooyouniverse.observationlog.debug/com.nooyouniverse.observationlog.MainActivity \
  -e noo_debug_cmd seed
# wait ~3s, then:
adb shell am force-stop com.nooyouniverse.observationlog.debug
adb shell am start -n com.nooyouniverse.observationlog.debug/com.nooyouniverse.observationlog.MainActivity \
  -e noo_debug_cmd dump
# pull the probe file (path printed in logcat / files dir)
```

`mobile/scripts/emulator-persistence.sh` runs that sequence on a local emulator when the SDK is present.

## What this playbook is not

Not a Play / App Store install. Not permission to change `public/` waitlist or Mission 09 copy. Not access to the owner’s earlier local prototypes.
