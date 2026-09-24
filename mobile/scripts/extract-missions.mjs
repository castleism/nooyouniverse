#!/usr/bin/env node
/**
 * Extract approved mission catalog from public/log.html.
 * Does not invent missions, titles, or source-basis labels.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const logPath = resolve(root, "public/log.html");
const outJs = resolve(root, "mobile/src/approved-missions.js");
const outJson = resolve(root, "mobile/src/approved-missions.json");

const html = readFileSync(logPath, "utf8");
const articleRe =
  /<article class="entry" id="(mission-\d+)">([\s\S]*?)<\/article>/g;

function decode(text) {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

const missions = [];
let match;
while ((match = articleRe.exec(html))) {
  const id = match[1];
  const body = match[2];
  const num = (body.match(/<span class="num">MISSION (\d+)<\/span>/) || [])[1];
  const basis = (body.match(/<span class="basis [^"]+">([^<]+)<\/span>/) || [])[1];
  const title = (body.match(/<h2>([\s\S]*?)<\/h2>/) || [])[1];
  const ask = (body.match(/<p class="ask">([\s\S]*?)<\/p>/) || [])[1];
  if (!num || !title || !basis) {
    throw new Error(`Incomplete mission block for ${id}`);
  }
  missions.push({
    id,
    number: Number(num),
    title: decode(title),
    sourceBasis: decode(basis),
    prompt: ask ? decode(ask) : "",
    logPath: `/log#${id}`,
  });
}

if (missions.length === 0) {
  throw new Error("No approved missions found in public/log.html");
}

missions.sort((a, b) => a.number - b.number);

const payload = {
  source: "public/log.html",
  extractedFrom: "approved Mission Log entries already published in this repository",
  note: "Catalog only. Not curriculum expansion. Not clinical content.",
  count: missions.length,
  missions,
};

const js = `/* Generated from public/log.html — do not hand-edit titles or invent missions. */
(function (root) {
  var catalog = ${JSON.stringify(payload, null, 2)};
  root.NOO_APPROVED_MISSIONS = catalog;
  if (typeof module === "object" && module.exports) {
    module.exports = catalog;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
`;

writeFileSync(outJson, JSON.stringify(payload, null, 2) + "\n");
writeFileSync(outJs, js);
console.log(`Extracted ${missions.length} approved missions -> mobile/src/approved-missions.{js,json}`);
