# Android — save the live website as a browser app

This cloud checkout **cannot push an icon onto your phone**. After you open the live site in Chrome, Android can put it on the home screen like an app.

PWA files (`public/manifest.webmanifest`, `public/icons/`, `public/sw.js`) are in this branch. They appear on `https://nooyouniverse.com` only after a human merges and Cloudflare deploys. Until then, Chrome may offer **Add to Home screen** as a shortcut even without a full install prompt.

## Live site (Chrome)

1. Open Chrome on the phone.
2. Visit `https://nooyouniverse.com/` (or use **Live in Chrome** on the Check Hub APK).
3. Tap ⋮ → **Add to Home screen** or **Install app**.
4. Name it **Noo YouNiverse**.
5. Repeat if you also want a shortcut that opens `/log` directly (optional).

That icon is the **live** website. Waitlist submit works there. It is not the private observation log.

## Observation log + offline site copy

Those live in the debug APK (`docs/DEVICE-INSTALL.md`). One sideload gives you:

- Check hub (every page and app to look at)
- Offline snapshot of `public/`
- Private observation log

Do not confuse the Chrome home-screen icon (live site) with the APK icon (debug hub).
