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
