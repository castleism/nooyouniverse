// education.html in the canonical website is the single copy source.
// public/ is a synced input here; never author educational copy in this script.
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const page = readFileSync(resolve(root, 'public/education.html'), 'utf8');
const guide = page.match(/<main id="education-guide" class="education-guide">([\s\S]*?)<\/main>/);
if (!guide) throw new Error('Education guide is missing; sync canonical site source first.');
const path = resolve(root, 'mobile/web/index.html');
const html = readFileSync(path, 'utf8');
if (!html.includes('<!-- education:start -->') || !html.includes('<!-- education:end -->')) {
  throw new Error('Education build markers missing from app shell.');
}
const content = guide[1].replace('<h1>', '<h2 id="learn-title">').replace('</h1>', '</h2>')
  .replace(/<h2 id="guide-/g, '<h3 id="guide-').replace(/(<h3[^>]*>[\s\S]*?)<\/h2>/g, '$1</h3>');
writeFileSync(path, html.replace(/<!-- education:start -->[\s\S]*?<!-- education:end -->/,
  '<!-- education:start -->' + content + '<!-- education:end -->'));
copyFileSync(resolve(root, 'public/assets/education.css'), resolve(root, 'mobile/web/education.css'));
console.log('Shared educational guide synced into app Learn panel.');
