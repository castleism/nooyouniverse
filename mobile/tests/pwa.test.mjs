import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

function readJson(rel) {
  return JSON.parse(readFileSync(resolve(root, rel), "utf8"));
}

function assertInstallable(manifest, iconsPrefix) {
  assert.equal(manifest.display, "standalone");
  assert.ok(manifest.start_url);
  assert.ok(manifest.name);
  assert.ok(manifest.short_name);
  assert.ok(manifest.theme_color);
  assert.ok(manifest.background_color);
  const anys = manifest.icons.filter((icon) => String(icon.purpose || "any").includes("any"));
  const maskable = manifest.icons.filter((icon) => String(icon.purpose || "").includes("maskable"));
  assert.ok(anys.some((icon) => icon.sizes === "192x192"));
  assert.ok(anys.some((icon) => icon.sizes === "512x512"));
  assert.ok(maskable.some((icon) => icon.sizes === "192x192"));
  assert.ok(maskable.some((icon) => icon.sizes === "512x512"));
  for (const icon of manifest.icons) {
    const file = icon.src.startsWith("/")
      ? resolve(root, "public", icon.src.slice(1))
      : resolve(root, iconsPrefix, icon.src);
    assert.ok(existsSync(file), "missing icon " + icon.src);
  }
}

test("public site manifest meets Chrome install fields", () => {
  const manifest = readJson("public/manifest.webmanifest");
  assertInstallable(manifest, "public");
  const sw = readFileSync(resolve(root, "public/sw.js"), "utf8");
  assert.match(sw, /addEventListener\("fetch"/);
  for (const page of ["index.html", "log.html", "sources.html", "corrections.html"]) {
    const html = readFileSync(resolve(root, "public", page), "utf8");
    assert.match(html, /manifest\.webmanifest/);
    assert.match(html, /pwa-register\.js/);
  }
});

test("observation log manifest meets Chrome install fields", () => {
  const manifest = readJson("mobile/web/manifest.webmanifest");
  assertInstallable(manifest, "mobile/web");
  const sw = readFileSync(resolve(root, "mobile/web/sw.js"), "utf8");
  assert.match(sw, /addEventListener\("fetch"/);
});
