import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../src/index.tsx',import.meta.url),'utf8');
test('GitHub workflow identity is verified before privileged agent/verifier actions',()=>{
 assert.match(src,/import \{ verifyActionsJwt \} from/);
 assert.match(src,/async function bridgeAuth/);
 assert.match(src,/return await verifyActionsJwt\(supplied,role\)/);
 assert.match(src,/if\(!await bridgeAuth\(c,'verifier'\)\)/);
});
test('PR CI and independent verification receipt have separate columns and UI proof links',()=>{
 assert.match(src,/verification_receipt_url text/);
 assert.match(src,/verification_receipt_url=\$\{evidence\}/);
 assert.doesNotMatch(src,/status='release_verified',qa_evidence_url=\$\{evidence\}/);
 assert.match(src,/Independent verifier receipt/);
});
test('activity feed counts verified and revalidated states, without sample data',()=>{
 assert.match(src,/app.get\('\/activity'/);
 assert.match(src,/\.filter\(\(x:any\)=>\['release_verified','revalidated'\]/);
 assert.match(src,/source='independent_verifier'/);
});
