import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const catalog = require("../src/approved-missions.js");
const html = readFileSync(resolve(root, "public/log.html"), "utf8");

test("catalog is extracted from published log.html only", () => {
  assert.equal(catalog.source, "public/log.html");
  assert.ok(catalog.count >= 11, "expected the approved live missions (01–11)");
  assert.equal(catalog.missions.length, catalog.count);
});

test("every catalog mission exists in log.html with the same title", () => {
  for (const mission of catalog.missions) {
    const idAttr = `id="${mission.id}"`;
    assert.ok(html.includes(idAttr), `missing ${mission.id} in log.html`);
    assert.ok(
      html.includes(`<h2>${escapeHtml(mission.title)}</h2>`) || html.includes(mission.title),
      `title for ${mission.id} is not in log.html`
    );
    assert.ok(html.includes(mission.sourceBasis), `source basis for ${mission.id} drifted`);
  }
});

test("catalog does not invent unpublished missions", () => {
  const ids = catalog.missions.map((m) => m.id);
  assert.ok(!ids.includes("mission-12"), "Mission 12 is a draft PR, not approved on main");
  assert.ok(!ids.includes("mission-99"));
});

test("Mission 09 remains an unbuilt-product concept in source", () => {
  const m09 = catalog.missions.find((m) => m.id === "mission-09");
  assert.ok(m09);
  assert.match(m09.title, /Tracker Build Diary/i);
  assert.match(html, /not a released product/i);
});

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
