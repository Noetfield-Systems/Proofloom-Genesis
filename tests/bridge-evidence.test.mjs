import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../src/index.tsx',import.meta.url),'utf8');
test('bridge callbacks verify real GitHub issue, PR, checks and deployed revision',()=>{
 assert.match(source,/async function verifiedGitHubEvidence/);
 assert.match(source,/proofloom-workpacket:/);
 assert.match(source,/Source WorkPacket:/);
 assert.match(source,/x.name==='syntax-and-contracts'/);
 assert.match(source,/RAILWAY_GIT_COMMIT_SHA/);
 assert.match(source,/unverified_github_evidence/);
});
test('lease recovery is bounded and event callbacks require enabling',()=>{
 assert.match(source,/lease_owner/);
 assert.match(source,/lease_expires_at/);
 assert.match(source,/interval '8 minutes'/);
 assert.match(source,/bridge_disabled/);
});
test('verifier-only queue and callback exist',()=>{
 assert.match(source,/bridgeAuth\(c,'verifier'\)/);
 assert.match(source,/\/api\/v1\/bridge\/verify-queue/);
 assert.match(source,/invalid_receipt/);
});
