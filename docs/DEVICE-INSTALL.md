# Owner device install — sideload + home-screen playbook

This cloud checkout cannot tap your launcher. The APK and install note are in your Google Drive folder so the phone can fetch them: https://drive.google.com/drive/folders/1sAyTL0yxwY8SpEpfpHBnXpR8w0nOAway

Debug APK: `mobile/dist/noo-observation-log-debug.apk`  
Package id: `com.nooyouniverse.observationlog.debug`  
Launcher names after install: **Noo Check Hub**, **Noo YouNiverse**, **Noo Observation Log**  
This build is **debug-signed**. Store submission is later.

Existing local phone-test prototypes are **not** in this cloud checkout. Do not overwrite them.

## What the APK now contains

| Home-screen / in-app card | What it is |
|---|---|
| **Check hub** (opens first) | List of every website and app to look at |
| **Offline website copy** | Snapshot of `public/` (home, /log, /sources, /corrections, images) |
| **Private observation log** | On-device notes for missions 01–11 |
| **Live in Chrome** links | Real `https://nooyouniverse.com` and AliaSpaces pages |

The APK still has **no** `INTERNET` permission. Live links hand off to Chrome. Waitlist submit only works on the live site. The **Noo YouNiverse** launcher icon is the saved website as an app. The live site becomes a Chrome PWA after those files are deployed.

## Preserve data if signing differs

Android will refuse an upgrade when the signature does not match.

1. Open the **old** install.
2. Transfer → Download JSON (keep that file off-device if you want a spare).
3. Install this APK **side-by-side** if the old id/signature differs, or uninstall only after the export is safe.
4. Transfer → Import (merge). Never replace until you have checked the export.

## Android sideload (personal Google account)

1. Enable Install unknown apps for the Files / browser app you will use.
2. Copy `mobile/dist/noo-observation-log-debug.apk` to the phone.
3. Install. Accept only the sideload prompt — this APK requests **no** network, sensors, or accounts.
4. After install you should see **three** home-screen apps from this one APK:
   - **Noo YouNiverse** — saved website (offline copy of home, /log, /sources, /corrections)
   - **Noo Observation Log** — the notes app we are building
   - **Noo Check Hub** — every page and live Chrome link to check
5. Open **Noo YouNiverse** and tap through Home → Mission Log → Sources → Corrections.
6. Open **Noo Observation Log**. Accept the 21+ / not-medical gate.
7. Log one ordinary, non-medical observation on Mission 07 (include a null result).
8. Leave the app (Home). From Settings → Apps → Noo Check Hub → Force stop.
9. Reopen. The observation must still be in History.
10. Transfer → confirm export format `noo-private-observation-log`.

## Save the live website as a browser app

See `docs/ANDROID-HOME-SCREEN.md`.

1. From the hub, tap **https://nooyouniverse.com/** (opens Chrome).
2. Chrome ⋮ → **Add to Home screen** / **Install app**.
3. You now have two icons: **Noo Check Hub (debug)** (APK) and **Noo YouNiverse** (live site).

The live-site install uses PWA files in `public/`. Those are on this branch; they go live after a human merge + Cloudflare deploy. Chrome can still add a shortcut to the current production site today.

## Tick when done

- [ ] Sideloaded this APK (or refused because signature collided — then used export/import)
- [ ] Hub listed site copy + observation log + live links
- [ ] Offline Mission Log 01–11 readable without radio
- [ ] Gate accepted on the observation log
- [ ] Observation survived Force stop
- [ ] Export opened and looks like notes, not measurements
- [ ] Live site added to the home screen from Chrome
- [ ] Old prototype data preserved

## iOS (home-screen PWA only)

See `docs/IOS-HOME-SCREEN.md`. This Linux checkout cannot sign an IPA.

## Debug persistence probe (emulator or `adb`)

Debug builds accept an extra that writes `/data/data/com.nooyouniverse.observationlog.debug/files/noo-probe.json`. It is **not** a user-facing feature and is compiled only when `BuildConfig.DEBUG` is true.

```bash
adb install -r mobile/dist/noo-observation-log-debug.apk
adb shell am start -n com.nooyouniverse.observationlog.debug/com.nooyouniverse.observationlog.MainActivity \
  -e noo_debug_cmd seed
# wait ~3s, then:
adb shell am force-stop com.nooyouniverse.observationlog.debug
adb shell am start -n com.nooyouniverse.observationlog.debug/com.nooyouniverse.observationlog.MainActivity \
  -e noo_debug_cmd dump
```

`mobile/scripts/emulator-persistence.sh` runs that sequence on a local emulator when the SDK is present. Debug seed/dump still open the observation log, not the hub.

## What this playbook is not

Not a Play / App Store install. Not permission to change `public/` waitlist or Mission 09 copy. Not access to the owner’s earlier local prototypes. Not Cursor installing onto your hardware.
