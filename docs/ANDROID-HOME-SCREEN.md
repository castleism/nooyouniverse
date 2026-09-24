# Android — save Noo YouNiverse as a browser app

This cloud checkout **cannot push an icon onto your physical phone**. After the site is open in Chrome, Android can put it on the home screen like an app.

## Live website (Chrome)

1. Open Chrome on the phone.
2. Visit `https://nooyouniverse.com/deck` (Check hub) or `https://nooyouniverse.com/`.
3. Tap **⋮ → Add to Home screen** or **Install app**.
4. Name it **Noo YouNiverse**.
5. Optional: from the hub, long-press and add a second shortcut that opens `/log#mission-12` directly.

Until this branch is merged and Cloudflare deploys, use the PR preview URL the same way. Chrome may offer **Add to Home screen** even before a full install prompt appears.

That icon is the **live** website. Waitlist submit works there. It is not a store listing and not the private observation-log APK.

## Companion observation log (debug)

The on-device Check Hub + observation log lives on draft PR #3 (`cursor/mission-observation-tracker-7487`). This environment cannot sideload an APK onto your hardware. If you already have that debug APK, keep it as a second icon:

- **Noo YouNiverse** — Chrome / PWA (live site)
- **Noo Check Hub (debug)** — sideloaded APK (offline snapshot + private notes)

Do not treat the debug APK as a released product. Public Mission 09 stays an unbuilt concept.

## iOS

Safari → Share → Add to Home Screen. Same public URLs.
