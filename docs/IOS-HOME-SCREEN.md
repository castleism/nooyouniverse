# iOS path from this Linux checkout

This environment is Linux. It cannot produce a signed iOS `.ipa` or open Xcode. Store submissions stay later even though the Apple account is verified.

## What Cursor can ship here

The observation log is a **mobile web app / PWA**:

1. Serve `mobile/web` (`cd mobile && npm run serve`) or open the same files from a trusted local host.
2. On iPhone Safari: Share → Add to Home Screen.
3. The home-screen icon uses `mobile/web/icon.svg` and `manifest.webmanifest`.
4. Notes still live in Safari/WebView storage on that device. They are not iCloud-synced by this app.

Android already has a sideload debug APK that also carries an offline site copy (`docs/DEVICE-INSTALL.md`). The live public site can be added to the iOS home screen the same way once PWA files are deployed. The PWA is the honest iOS install path until a Mac/Xcode job exists.

## What this is not

- Not an App Store build
- Not TestFlight
- Not a claim that iOS persistence was physically verified on an iPhone in this checkout
- Not a reason to change public Mission 09 / waitlist copy

If a later Mac build uses a different signature than any local prototype, export JSON first and import. Owner phone prototypes are local and are not in this checkout.
