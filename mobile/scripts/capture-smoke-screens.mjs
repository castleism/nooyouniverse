import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer-core");
const chrome = process.env.CHROME_PATH || "/usr/bin/google-chrome";
const url = process.env.NOO_URL || "http://127.0.0.1:4173/";
const out = process.env.NOO_SHOT_DIR || "/opt/cursor/artifacts";
mkdirSync(out, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "domcontentloaded" });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForSelector("#acceptGate");
await page.screenshot({ path: resolve(out, "gate_21_plus.png"), fullPage: true });
await page.click("#acceptGate");
await page.waitForSelector("[data-open-mission='mission-07']");
await page.click("[data-open-mission='mission-07']");
await page.waitForSelector("#stayedComparable");
await page.$eval("#variable", (el) => {
  el.value = "Lamp vs overhead (correction test)";
});
await page.$eval("#stayedComparable", (el) => {
  el.value = "Same room, same evening hour";
});
await page.select("#outcomeKind", "null");
await page.click("#obsForm button[type='submit']");
await page.waitForFunction(() => document.querySelector(".status.ok"));
await page.$eval("#outcome", (el) => {
  el.value = "Still nothing noticeable — kept as a null result.";
});
await page.click("#obsForm button[type='submit']");
await page.waitForFunction(() => document.getElementById("correctionHistory"));
await page.screenshot({ path: resolve(out, "correction_history.png"), fullPage: true });
await page.click("[data-tab='transfer']");
await page.waitForSelector("#exportBox");
await page.screenshot({ path: resolve(out, "export_with_corrections.png"), fullPage: true });
await browser.close();
console.log("Wrote screenshots to", out);
