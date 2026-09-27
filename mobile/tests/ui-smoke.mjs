#!/usr/bin/env node
/**
 * Headless Chrome smoke for the private observation log.
 * Requires system Chrome. Does not invent missions or sensor data.
 */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const chrome =
  process.env.CHROME_PATH ||
  ["/usr/bin/google-chrome", "/usr/local/bin/google-chrome", "/usr/bin/google-chrome-stable",
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(
    (p) => {
      try {
        require("node:fs").accessSync(p);
        return true;
      } catch {
        return false;
      }
    }
  );

if (!chrome) {
  console.log("SKIP: no Chrome on this machine; unit tests still cover the store.");
  process.exit(0);
}

let puppeteer;
try {
  puppeteer = require("puppeteer-core");
} catch {
  console.log("SKIP: puppeteer-core is not installed. Run npm install in mobile/.");
  process.exit(0);
}

const port = process.env.NOO_SMOKE_PORT || "18474";
const url = "http://127.0.0.1:" + port + "/";
let server;

async function serve() {
  await new Promise((resolveServe, reject) => {
    server = spawn(process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3'), ["-m", "http.server", port, "--bind", "127.0.0.1", "--directory", resolve(root, "web")], {
      cwd: root,
      stdio: "inherit",
    });
    server.on("error", reject);
    server.once("spawn", resolveServe);
  });
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error('Smoke server exited before becoming ready');
    try { if ((await fetch(url)).ok) return; } catch {}
    await new Promise(resolveReady => setTimeout(resolveReady, 100));
  }
  throw new Error('Smoke server did not become ready');
}

const invalid = {
  format: "noo-private-observation-log",
  version: 1,
  kind: "private-observation-log",
  observations: [
    {
      id: "bad",
      missionId: "mission-04",
      observedAt: "2026-09-20T10:30:00.000Z",
      variable: "Should be rejected",
      outcome: "Should be rejected",
      outcomeKind: "noticed",
      pattern: "first",
      uncertainty: "unknown",
      heartRate: 72,
    },
  ],
};

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});

try {
  await serve();
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  assert.equal(response.status(), 200, await page.content());
  assert.match(await page.content(), /id="acceptGate"/, 'Smoke server must serve the observation log');

  await page.waitForSelector("#acceptGate");
  await page.click("#acceptGate");
  await page.waitForSelector("[data-open-mission='mission-07']");

  const body = await page.evaluate(() => document.body.innerText);
  assert.match(body, /Sleep before stack/);
  assert.match(body, /The One-Switch Rule/);
  assert.doesNotMatch(body, /Mission 12/);

  await page.click("[data-tab='history']");
  let history = await page.evaluate(() => document.getElementById("panel-history").innerText);
  assert.match(history, /No observations yet/);

  await page.click("[data-tab='missions']");
  await page.click("[data-open-mission='mission-07']");
  await page.waitForSelector("#obsForm");
  await page.$eval("#variable", (el) => {
    el.value = "Evening desk lamp vs usual overhead light";
  });
  await page.$eval("#sleepWindow", (el) => {
    el.value = "Usual bedtime window";
  });
  await page.$eval("#stayedComparable", (el) => {
    el.value = "Same room, same evening hour";
  });
  await page.select("#outcomeKind", "null");
  await page.select("#uncertainty", "high");
  await page.click("#obsForm button[type='submit']");
  await page.waitForFunction(() => document.querySelector(".status.ok"));

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.click("[data-tab='history']");
  history = await page.evaluate(() => document.getElementById("panel-history").innerText);
  assert.match(history, /Evening desk lamp/);
  assert.match(history, /null/);

  await page.click("[data-tab='transfer']");
  await page.waitForSelector("#importBox");
  const exported = await page.$eval("#exportBox", (el) => el.value);
  assert.match(exported, /noo-private-observation-log/);
  assert.match(exported, /stayedComparable/);
  await page.$eval("#importBox", (el, payload) => {
    el.value = payload;
  }, JSON.stringify(invalid));
  await page.click("#runImport");
  const err = await page.$eval(".status.err", (el) => el.textContent);
  assert.match(err, /heartRate/);

  await page.goto("http://127.0.0.1:" + port + "/hub.html", { waitUntil: "domcontentloaded" });
  const hub = await page.evaluate(() => document.body.innerText);
  assert.match(hub, /Check hub/);
  assert.match(hub, /Private observation log/);
  assert.match(hub, /nooyouniverse.com/);
  assert.doesNotMatch(hub, /heartRate/);

  console.log("UI smoke passed.");
} finally {
  await browser.close();
  if (server) server.kill();
}
