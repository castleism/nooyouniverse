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
  ["/usr/bin/google-chrome", "/usr/local/bin/google-chrome", "/usr/bin/google-chrome-stable"].find(
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

const port = process.env.NOO_SMOKE_PORT || "4173";
const url = "http://127.0.0.1:" + port + "/";
let server;

function serve() {
  return new Promise((resolveServe, reject) => {
    server = spawn(process.platform === "win32" ? "python" : "python3", ["-m", "http.server", port, "--directory", resolve(root, "web")], {
      cwd: root,
      stdio: "ignore",
    });
    server.on("error", reject);
    setTimeout(resolveServe, 400);
  });
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
  await page.goto(url, { waitUntil: "domcontentloaded" });

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

  console.log("UI smoke passed.");
} finally {
  await browser.close();
  if (server) server.kill();
}
