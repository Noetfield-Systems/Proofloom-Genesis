import test from 'node:test';
import assert from 'node:assert/strict';
import { checkEvidence } from '../scripts/release-verifier.mjs';

const id='12345678-abcd-4567-9876-123456789abc';
const sha='a'.repeat(40),head='b'.repeat(40);
const repo='Noetfield-Systems/Proofloom-Genesis';
const body=JSON.stringify({locale:'fa',key:'Missions',text:'ماموریت‌های واقعی',why:'This version is more accurate for Persian-speaking builders.'});
const item={id,submission_id:'beefbeef-1234-4567-9999-999999999999',project_id:'proofloom-lab',repository:repo,
  mission_id:'q13',status:'release_reported',body,release_url:'https://github.com/'+repo+'/commit/'+sha};
const pr={number:42,head:{ref:'proofloom/translation-12345678abcd456798',sha:head},base:{ref:'main'},merged_at:'2026-11-14T00:00:00Z',merge_commit_sha:sha};
const checks={check_runs:[{name:'syntax-and-contracts',status:'completed',conclusion:'success'}]};
function setup({revision=sha,checksPass=true,translation='ماموریت‌های واقعی',merged=true}={}) {
  const gh=async path=>{
    if(path.includes('/pulls?'))return [{...pr,...(merged?{}:{merged_at:null})}];
    if(path.includes('/commits/'+sha))return {sha};
    if(path.includes('/check-runs'))return checksPass?checks:{check_runs:[]};
    if(path.includes('/contents/'))return {content:Buffer.from(JSON.stringify({Missions:translation})).toString('base64')};
    throw Error('Unexpected GitHub route '+path);
  };
  const fetchLive=async url=>String(url).includes('/api/v1/status')?
    {ok:true,json:async()=>({deployment_sha:revision})}:
    {ok:true,text:async()=>'<nav>ماموریت‌های واقعی</nav>'};
  return {gh,fetchLive};
}
test('verifier accepts only matching merged commit, passing PR CI, deployed SHA, and live content',async()=>{
  const r=await checkEvidence(item,setup());
  assert.equal(r.merge_sha,sha);
  assert.equal(r.pr_number,42);
  assert.equal(r.runtime_assertion,'passed');
});
test('verifier rejects a deployment at an older or unrelated revision',async()=>{
  await assert.rejects(checkEvidence(item,setup({revision:'c'.repeat(40)})),/production_sha_mismatch/);
});
test('verifier rejects missing PR CI and unmerged changes',async()=>{
  await assert.rejects(checkEvidence(item,setup({checksPass:false})),/pr_checks_not_passed/);
  await assert.rejects(checkEvidence(item,setup({merged:false})),/pr_not_merged/);
});
test('verifier rejects changed contents, target mismatch and premature states',async()=>{
  await assert.rejects(checkEvidence(item,setup({translation:'Other'})),/merged_artifact_mismatch/);
  await assert.rejects(checkEvidence({...item,repository:'unauthorized/other'},setup()),/wrong_scope/);
  await assert.rejects(checkEvidence({...item,status:'qa_passed'},setup()),/wrong_scope/);
  await assert.rejects(checkEvidence({...item,release_url:'https://example.com/fake'},setup()),/release_link_mismatch/);
});
