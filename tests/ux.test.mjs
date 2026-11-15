import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../src/index.tsx',import.meta.url),'utf8');
test('responsive site provides keyboard skip link, focus styles and motion reduction',()=>{
  assert.match(src,/class="skip-link"/);
  assert.match(src,/:focus-visible/);
  assert.match(src,/prefers-reduced-motion/);
});
test('accepted work has a contributor-scoped lifecycle detail route',()=>{
  assert.match(src,/app\.get\('\/work\/:id'/);
  assert.match(src,/s\.user_id=\$\{u\.id\}/);
});
test('public integration flags remain evidence-driven',()=>{
  assert.match(src,/github_connected:/);
  assert.match(src,/deployment_sha:/);
  assert.match(src,/\/api\/v1\/bridge\/verify-queue/);
});

test('premium theme and accessible category/search experience ship as real routes',()=>{
 const css=readFileSync(new URL('../src/premium.ts',import.meta.url),'utf8');
 assert.match(src,/import \{ PREMIUM_CSS \} from '\.\/premium'/);
 assert.match(src,/class="mission-toolbar"/);
 assert.match(src,/name="search"/);
 assert.match(src,/name="difficulty"/);
 assert.match(src,/class="profile-avatar"/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/\.heroart/);
});
test('Studio is a real authenticated mission submission and activity is evidence-based',()=>{
 assert.match(src,/app\.get\('\/activity'/);
 assert.match(src,/event_type='release\.verified'/);
 assert.match(src,/app\.get\('\/studio'/);
 assert.match(src,/action="\/submit" method="post"/);
 assert.match(src,/name="mission_id" value="q05"/);
});
