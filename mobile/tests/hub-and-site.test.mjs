import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

test("check hub lists the website copy, observation log, and live pages", () => {
  const hub = readFileSync(resolve(root, "mobile/web/hub.html"), "utf8");
  assert.match(hub, /noo-app:\/\/log/);
  assert.match(hub, /noo-app:\/\/site/);
  assert.match(hub, /https:\/\/nooyouniverse\.com\//);
  assert.match(hub, /https:\/\/nooyouniverse\.com\/log/);
  assert.match(hub, /https:\/\/nooyouniverse\.com\/sources/);
  assert.match(hub, /https:\/\/nooyouniverse\.com\/corrections/);
  assert.match(hub, /#waitlist/);
  assert.match(hub, /castleborn\.cillian/);
  assert.doesNotMatch(hub, /heartRate|dose|diagnosis/);
});

test("offline site bundle rewrites clean URLs and stays non-clinical", () => {
  const run = spawnSync(process.execPath, [resolve(root, "mobile/scripts/bundle-site-copy.mjs")], {
    encoding: "utf8"
  });
  assert.equal(run.status, 0, run.stderr || run.stdout);
  const site = resolve(root, "mobile/android/app/src/main/assets/site");
  const log = readFileSync(resolve(site, "log.html"), "utf8");
  assert.match(log, /href="log\.html"/);
  assert.match(log, /href="sources\.html"/);
  assert.match(log, /href="index\.html#waitlist"/);
  assert.match(log, /noo-offline-copy-banner/);
  assert.doesNotMatch(log, /href="\/log"/);
  assert.ok(existsSync(resolve(site, "assets/hero.jpg")));
  assert.ok(existsSync(resolve(site, "assets/log/11-sleep-before-stack.jpg")));
});
