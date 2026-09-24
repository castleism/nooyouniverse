#!/usr/bin/env node
/**
 * Snapshot public/ into the Android APK as an offline website copy.
 * Rewrites Cloudflare clean URLs so file:// navigation works.
 * Does not change the live public/ waitlist or Mission 09 copy.
 */
import { cpSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const src = resolve(root, "public");
const dest = resolve(root, "mobile/android/app/src/main/assets/site");

mkdirSync(dirname(dest), { recursive: true });
cpSync(src, dest, { recursive: true, force: true });

const banner =
  '<div id="noo-offline-copy-banner" style="position:sticky;top:0;z-index:80;background:#1a2047;color:#e9ebf7;border-bottom:1px solid #2b3163;padding:8px 14px;font:600 .78rem/1.4 ui-sans-serif,system-ui,sans-serif;">Offline website copy in Noo Check Hub. <a href="file:///android_asset/www/hub.html" style="color:#f2b25c">Back to hub</a> · Waitlist send needs the live site in Chrome.</div>';

function rewrite(html) {
  return html
    .replace(/href="\/log#/g, 'href="log.html#')
    .replace(/href="\/log"/g, 'href="log.html"')
    .replace(/href="\/sources"/g, 'href="sources.html"')
    .replace(/href="\/corrections"/g, 'href="corrections.html"')
    .replace(/href="\/#/g, 'href="index.html#')
    .replace(/href="\/"/g, 'href="index.html"')
    .replace(/<body>/, "<body>\n" + banner);
}

for (const name of readdirSync(dest)) {
  if (!name.endsWith(".html")) continue;
  const path = join(dest, name);
  writeFileSync(path, rewrite(readFileSync(path, "utf8")));
}

console.log("Bundled offline site copy -> mobile/android/app/src/main/assets/site");
