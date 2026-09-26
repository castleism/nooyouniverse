# Desktop — install as an app, or self-host

There is no separate desktop program and none is planned. The public site and
the private observation log are both web apps; on desktop they install the
same way they do on a phone, and the site can additionally be self-hosted as a
container. Anything heavier (Electron/Tauri) would add an update channel and a
signing chain for zero new capability.

## Install nooyouniverse.com as a desktop app

Chrome / Edge / Brave (Windows, macOS, Linux):

1. Open https://nooyouniverse.com.
2. Address bar → the **Install** icon (or ⋮ → *Cast, save and share* → *Install
   page as app…*).
3. It opens in its own window with the Noo YouNiverse icon; `/log`, `/sources`
   and `/corrections` are pinned as app shortcuts (right-click the taskbar
   icon).

What you get: the network-first shell from `public/sw.js`, so a corrected page
is never served stale, and an honest offline page when the network is gone.
Safari on macOS: File → *Add to Dock* (Sonoma+). Firefox has no desktop PWA
install; bookmark it.

## Run the private observation log on desktop

```bash
cd mobile && npm run serve      # http://127.0.0.1:4173
```

Then install it from Chrome the same way. Notes stay in that browser profile's
storage; use Transfer → export/import JSON to move them. `localhost` counts as
a secure context, so the service worker and install prompt both work.

## Self-host / virtual appliance

`deploy/docker/` — nginx (unprivileged, port 8080) serving `public/` with the
same clean URLs, 404 page and security headers Cloudflare applies. See
`deploy/docker/README.md`; `deploy/docker/verify.sh` proves parity against a
running instance. Cloudflare remains canonical; this is a mirror for a home
server, a NAS, or an air-gapped demo.

## Agents

No server-side agents exist and none are gated open: the app has no network
permission and `docs/SYNC-BACKLOG.md` keeps remote sync closed until the
review packet is signed. The only automation is the repo's own scripts
(`mobile/scripts/*`, `deploy/docker/verify.sh`).
