# Android — save Noo YouNiverse as a browser app

This cloud checkout **cannot push an icon onto your phone**. After a human merge + Cloudflare deploy, Chrome on Android can install the live site like an app.

PWA files live in `public/`: `manifest.webmanifest`, `icons/`, `sw.js`, and the `/check` hub.

## After this PR is live on nooyouniverse.com

1. Open **Chrome** on the Android phone (not a WebView, not Firefox for the install prompt).
2. Visit `https://nooyouniverse.com/` or `https://nooyouniverse.com/check`.
3. Tap **⋮** → **Add to Home screen** or **Install app**.
4. Name it **Noo YouNiverse**.
5. Open the new launcher icon. It should run standalone (no Chrome address bar).
6. Long-press the icon → app info if you want a second shortcut that opens `/log`.

Until merge/deploy, Chrome can still add a **shortcut** to today's production site. The full install prompt (manifest + service worker) needs this branch live.

## What that icon is

The Chrome/home-screen icon is the **live website**: Mission Log, sources, waitlist. Waitlist submit works there.

It is **not** the private observation-log debug APK. That companion checker is the draft at https://github.com/castleism/nooyouniverse/pull/3 (`Noo Check Hub (debug)`). Sideload steps: that PR's `docs/DEVICE-INSTALL.md`.

## Tick on the phone

- [ ] Chrome opened `https://nooyouniverse.com/`
- [ ] Add to Home screen / Install app completed
- [ ] Standalone icon opens Home
- [ ] App shortcut or in-app nav reaches Mission Log, Sources, Corrections, `/check`
- [ ] Waitlist form still only submits on the live origin
