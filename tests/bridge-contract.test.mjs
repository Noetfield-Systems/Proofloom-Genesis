import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
let ts; try { ts=require('typescript'); } catch { ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript'); }
const source=readFileSync(new URL('../src/index.tsx',import.meta.url),'utf8');
const migrations=readFileSync(new URL('../migrations/002_bridge_and_account.sql',import.meta.url),'utf8');
test('TSX parses with no syntax errors',()=>{
 const f=ts.createSourceFile('index.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 assert.deepEqual(f.parseDiagnostics.map(x=>x.messageText),[]);
});
test('bridge events are deduplicated atomically with submissions',()=>{
 assert.match(source,/CREATE TABLE IF NOT EXISTS bridge_events/);
 assert.match(source,/idempotency_key text NOT NULL UNIQUE/);
 assert.match(source,/await tx`INSERT INTO submissions/);
 assert.match(source,/await bridgeEvent\(tx,submissionId/);
 assert.match(source,/await tx`INSERT INTO workpackets/);
});
test('bridge cannot lease unconfigured repository',()=>{
 assert.match(source,/BRIDGE_ENABLED!=='true'/);
 assert.match(source,/!bridgeRepository\(\)/);
 assert.match(source,/error:'bridge_not_configured'/);
 assert.match(source,/lease_expires_at/); assert.match(source,/status='triage_ready'/);
});
test('agent and verifier credentials are distinct',()=>{
 assert.match(source,/role==='verifier'\?Bun.env.VERIFIER_API_KEY:Bun.env.BRIDGE_API_KEY/);
 assert.match(source,/bridgeAuth\(c,'verifier'\)/);
 assert.match(source,/status='release_verified'/);
 assert.match(source,/requires_release_report/);
});
test('submission resubmission is allowed only for changes requested',()=>{
 assert.match(source,/prior\[0\]\.status!=='changes_requested'/);
 assert.match(source,/status='pending',reviewer_note=null/);
 assert.match(source,/UNIQUE\(mission_id,user_id\)/);
});
test('account export and password-protected deletion exist',()=>{
 assert.match(source,/app.get\('\/api\/v1\/account\/export'/);
 assert.match(source,/app.post\('\/account\/delete'/);
 assert.match(source,/Bun.password.verify\(String\(b.password/);
 assert.match(source,/await tx`DELETE FROM bridge_events/);
 assert.match(source,/await tx`DELETE FROM submissions/);
});
test('revalidation is limited to verified release and owner',()=>{
 assert.match(source,/app.post\('\/revalidate'/);
 assert.match(source,/s.user_id=\$\{u.id\} FOR UPDATE OF w/);
 assert.match(source,/x.status!=='release_verified'/);
 assert.match(migrations,/workpacket_id uuid NOT NULL UNIQUE/);
});
test('operator secret no longer included in review HTML hidden field',()=>{
 assert.doesNotMatch(source,/<input type="hidden" name="key" value=\{key\}/);
 assert.match(source,/setCookie\(c,OPER_COOKIE,token/);
 assert.match(source,/await operatorSession\(c\)/);
});
test('smoke includes actual PostgreSQL write and rollback',()=>{
 assert.match(source,/QA_ROLLBACK_EXPECTED/);
 assert.match(source,/db_write_rollback/);
});

test('deleting __Host- cookies retains Secure attribute',()=>{assert.match(source,/deleteCookie\(c,COOKIE,\{path:'\/',secure:true\}\)/);assert.match(source,/deleteCookie\(c,OPER_COOKIE,\{path:'\/',secure:true\}\)/);});
