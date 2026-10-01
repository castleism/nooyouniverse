import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const read = path => readFileSync(resolve(root,path),'utf8');
test('app education matches website core copy and citations', () => {
  const website = read('public/education.html').match(/<main id="education-guide" class="education-guide">([\s\S]*?)<\/main>/)[1];
  const app = read('mobile/web/index.html').match(/<!-- education:start -->([\s\S]*?)<!-- education:end -->/)[1];
  const normalize = html => html.replace(/<\/?h[123][^>]*>/g,'').replace(/\s+/g,' ').trim();
  assert.equal(normalize(app),normalize(website));
  assert.match(app,/40276537/);
  assert.match(app,/38004235/);
  assert.match(app,/Not medically reviewed/);
  assert.match(app,/Capsule/);
  assert.match(app,/Limited and mixed human evidence/);
  assert.match(app,/Safety belongs in the comparison/);
});
test('education ships in Android and PWA shells', () => {
  assert.equal(read('mobile/web/index.html'),read('mobile/android/app/src/main/assets/www/index.html'));
  assert.equal(read('public/assets/education.css'),read('mobile/web/education.css'));
  assert.equal(read('mobile/web/education.css'),read('mobile/android/app/src/main/assets/www/education.css'));
  assert.match(read('mobile/web/sw.js'),/education\.css/);
  assert.match(read('public/sw.js'),/\/education/);
  const offline = read('mobile/android/app/src/main/assets/site/education.html');
  assert.match(offline,/href="assets\/education.css"/);
  assert.match(offline,/href="education.html"/);
});
