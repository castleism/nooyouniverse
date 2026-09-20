#!/usr/bin/env node
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const web = resolve(root, "mobile/web");
const androidWww = resolve(root, "mobile/android/app/src/main/assets/www");
mkdirSync(androidWww, { recursive: true });

copyFileSync(resolve(root, "mobile/src/approved-missions.js"), resolve(web, "approved-missions.js"));
copyFileSync(resolve(root, "mobile/src/noo-log.js"), resolve(web, "noo-log.js"));
copyFileSync(resolve(web, "index.html"), resolve(androidWww, "index.html"));
copyFileSync(resolve(web, "styles.css"), resolve(androidWww, "styles.css"));
copyFileSync(resolve(web, "app.js"), resolve(androidWww, "app.js"));
copyFileSync(resolve(web, "approved-missions.js"), resolve(androidWww, "approved-missions.js"));
copyFileSync(resolve(web, "noo-log.js"), resolve(androidWww, "noo-log.js"));
copyFileSync(resolve(web, "manifest.webmanifest"), resolve(androidWww, "manifest.webmanifest"));
copyFileSync(resolve(web, "icon.svg"), resolve(androidWww, "icon.svg"));
copyFileSync(resolve(web, "sw.js"), resolve(androidWww, "sw.js"));
console.log("Synced catalog + web assets into mobile/web and Android assets/www");
