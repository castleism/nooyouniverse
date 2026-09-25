#!/usr/bin/env node
import { mkdirSync, copyFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const chrome =
  process.env.CHROME_PATH ||
  ["/usr/bin/google-chrome", "/usr/local/bin/google-chrome", "/usr/bin/google-chrome-stable"].find((p) => {
    try {
      require("node:fs").accessSync(p);
      return true;
    } catch {
      return false;
    }
  });
if (!chrome) {
  console.log("SKIP screenshots: no Chrome");
  process.exit(0);
}
const puppeteer = require("puppeteer-core");
const out = "/opt/cursor/artifacts";
mkdirSync(out, { recursive: true });

function serve(dir, port) {
  const child = spawn("python3", ["-m", "http.server", String(port), "--directory", dir], {
    cwd: root,
    stdio: "ignore",
  });
  return child;
}

const site = serve(resolve(root, "public"), 4174);
const web = serve(resolve(root, "mobile/web"), 4175);
await new Promise((r) => setTimeout(r, 500));
const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto("http://127.0.0.1:4175/hub.html", { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: resolve(out, "check_hub_phone_pack.png") });
  await page.goto("http://127.0.0.1:4175/", { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: resolve(out, "observation_log_gate.png") });
  await page.goto("http://127.0.0.1:4174/", { waitUntil: "networkidle0" });
  await page.screenshot({ path: resolve(out, "website_pwa_home.png") });
  await page.goto("http://127.0.0.1:4174/log.html", { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: resolve(out, "website_pwa_mission_log.png") });
  console.log("wrote walkthrough screenshots to", out);
} finally {
  await browser.close();
  site.kill();
  web.kill();
}
