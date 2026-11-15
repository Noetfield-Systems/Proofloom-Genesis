import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseTranslationProposal,isPilotPacket,branchFor,containsExpectedTranslation,REPOSITORY,leaseNeedsRecovery,stableEventId} from '../scripts/github-bridge.mjs';
const good={locale:'fa',key:'Missions',text:'ماموریت‌های واقعی',why:'The navigation needs a more specific translation.'};
test('only safe, narrow, human-reviewed q13 translation proposals are executable',()=>{
  assert.deepEqual(parseTranslationProposal(JSON.stringify(good)),good);
  assert.throws(()=>parseTranslationProposal('rm -rf /'),/JSON proposal/);
  assert.throws(()=>parseTranslationProposal(JSON.stringify({...good,locale:'en'})),/invalid_locale/);
  assert.throws(()=>parseTranslationProposal(JSON.stringify({...good,key:'DATABASE_URL'})),/key_outside/);
  assert.throws(()=>parseTranslationProposal(JSON.stringify({...good,text:'<script>alert(1)</script>'})),/unsafe_translation/);
  assert.throws(()=>parseTranslationProposal(JSON.stringify({...good,why:'short'})),/missing_rationale/);
  assert.equal(isPilotPacket({project_id:'proofloom-lab',mission_id:'q13',status:'triage_ready'}),true);
  assert.equal(isPilotPacket({project_id:'other',mission_id:'q13',status:'triage_ready'}),false);
  assert.equal(isPilotPacket({project_id:'proofloom-lab',mission_id:'q10',status:'triage_ready'}),false);
  assert.equal(REPOSITORY,'Noetfield-Systems/Proofloom-Genesis');
});
test('branch names are deterministically derived from WorkPacket ID',()=>{
  const id='12345678-abcd-4567-9876-123456789abc';
  assert.equal(branchFor(id),'proofloom/translation-12345678abcd456798');
  assert.throws(()=>branchFor('../bad'),/invalid_workpacket_id/);
});
test('renderer assertion checks actual visible translated string',()=>{
  assert.equal(containsExpectedTranslation('<nav>ماموریت‌های واقعی</nav>','ماموریت‌های واقعی'),true);
  assert.equal(containsExpectedTranslation('<nav>Nothing</nav>','ماموریت‌های واقعی'),false);
});
test('both runtime workflows use separate credentials and opt-in switches',()=>{
  const bridge=readFileSync(new URL('../.github/workflows/bridge-runner.yml',import.meta.url),'utf8');
  const verify=readFileSync(new URL('../.github/workflows/release-verify.yml',import.meta.url),'utf8');
  assert.match(bridge,/PROOFLOOM_BRIDGE_RUNNER_ENABLED/);
  assert.match(bridge,/create-github-app-token@v2/);
  assert.match(bridge,/PROOFLOOM_GITHUB_APP_PRIVATE_KEY/);
  assert.doesNotMatch(bridge,/PROOFLOOM_VERIFIER_API_KEY/);
  assert.match(verify,/PROOFLOOM_BRIDGE_VERIFIER_ENABLED/);
  assert.match(verify,/PROOFLOOM_VERIFIER_API_KEY/);
  assert.doesNotMatch(verify,/PROOFLOOM_BRIDGE_API_KEY/);
});

test('expired and legacy leases are recoverable without stealing active leases',()=>{
 const now=Date.parse('2026-11-15T00:00:00Z');
 assert.equal(leaseNeedsRecovery({status:'leased',lease_expires_at:'2026-11-14T23:59:59Z'},now),true);
 assert.equal(leaseNeedsRecovery({status:'leased',lease_expires_at:'2026-11-15T00:00:01Z'},now),false);
 assert.equal(leaseNeedsRecovery({status:'leased',lease_expires_at:null},now),true);
 assert.equal(leaseNeedsRecovery({status:'dispatched',lease_expires_at:null},now),false);
});
test('each WorkPacket state has a reproducible UUID event id for retry safety',()=>{
 const packet='12345678-abcd-4567-9876-123456789abc';
 const a=stableEventId(packet,'implementation.ready');
 assert.match(a,/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-a[0-9a-f]{3}-[0-9a-f]{12}$/);
 assert.equal(a,stableEventId(packet,'implementation.ready'));
 assert.notEqual(a,stableEventId(packet,'qa.completed'));
});
