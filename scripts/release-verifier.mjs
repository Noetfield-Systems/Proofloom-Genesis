/**
 * Separately authenticated, read-only evidence verifier.
 * Only this job holds VERIFIER_API_KEY; it cannot dispatch agent callbacks.
 */
import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { REPOSITORY, parseTranslationProposal, branchFor, containsExpectedTranslation } from './github-bridge.mjs';

const ORIGIN=process.env.PROOFLOOM_BASE_URL||'https://proofloom-global-web-production.up.railway.app';
const API='https://api.github.com';
const token=process.env.GITHUB_TOKEN;
async function github(path) {
  const r=await fetch(API+path,{headers:{
    Authorization:'Bearer '+token,Accept:'application/vnd.github+json',
    'X-GitHub-Api-Version':'2022-11-28','User-Agent':'proofloom-verifier/0.4'
  }});
  if(!r.ok)throw Error('GitHub evidence unavailable '+r.status+' '+path);
  return r.json();
}
async function verificationApi(path,{method='GET',body}={}) {
  const r=await fetch(ORIGIN+path,{method,headers:{
    Authorization:'Bearer '+process.env.VERIFIER_API_KEY,'Content-Type':'application/json'
  },...(body?{body:JSON.stringify(body)}:{})});
  const data=await r.json().catch(()=>({}));
  if(!r.ok)throw Error('Verifier callback '+r.status+' '+(data.error||''));
  return data;
}
export async function checkEvidence(item,{gh=github,fetchLive=fetch}={}) {
  if(item.status!=='release_reported'||item.repository!==REPOSITORY||
     item.project_id!=='proofloom-lab'||item.mission_id!=='q13')throw Error('wrong_scope');
  const proposal=parseTranslationProposal(item.body);
  const branch=branchFor(item.id);
  const prs=await gh('/repos/'+REPOSITORY+'/pulls?state=all&per_page=100');
  const pr=prs.find(x=>x.head?.ref===branch&&x.base?.ref==='main');
  if(!pr || !pr.merged_at || !pr.merge_commit_sha)throw Error('pr_not_merged');
  const commits=await gh('/repos/'+REPOSITORY+'/commits/'+pr.merge_commit_sha);
  if(!commits?.sha || commits.sha!==pr.merge_commit_sha)throw Error('missing_merged_commit');
  const checks=await gh('/repos/'+REPOSITORY+'/commits/'+pr.head.sha+'/check-runs?per_page=100');
  if(!(checks.check_runs||[]).some(x=>x.name==='syntax-and-contracts'&&x.conclusion==='success'&&x.status==='completed'))
    throw Error('pr_checks_not_passed');
  const file=await gh('/repos/'+REPOSITORY+'/contents/locales/'+proposal.locale+'.json?ref='+pr.merge_commit_sha);
  const json=JSON.parse(Buffer.from(file.content,'base64').toString('utf8'));
  if(json[proposal.key]!==proposal.text)throw Error('merged_artifact_mismatch');
  if(item.release_url!=='https://github.com/'+REPOSITORY+'/commit/'+pr.merge_commit_sha)throw Error('release_link_mismatch');
  const status=await fetchLive(ORIGIN+'/api/v1/status',{headers:{'cache-control':'no-cache'}});
  if(!status.ok)throw Error('production_status_not_available');
  const live=await status.json();
  if(live.deployment_sha!==pr.merge_commit_sha)throw Error('production_sha_mismatch');
  const page=await fetchLive(ORIGIN+'/?lang='+encodeURIComponent(proposal.locale),{headers:{'cache-control':'no-cache'}});
  if(!page.ok || !containsExpectedTranslation(await page.text(),proposal.text))
    throw Error('live_translation_assertion_failed');
  return {workpacket_id:item.id,submission_id:item.submission_id,repository:REPOSITORY,pr_number:pr.number,
    pr_head_sha:pr.head.sha,merge_sha:pr.merge_commit_sha,active_deployment_sha:live.deployment_sha,
    runtime_assertion:'passed',checked_at:new Date().toISOString()};
}
export async function main(){
  if(!token || !process.env.VERIFIER_API_KEY || !process.env.GITHUB_RUN_ID)
    throw Error('GITHUB_TOKEN, VERIFIER_API_KEY and GITHUB_RUN_ID required');
  const queue=await verificationApi('/api/v1/bridge/verify-queue');
  let ok=0,failed=0;
  for(const item of queue.items||[]){
    try{
      const result=await checkEvidence(item);
      const receipt='https://github.com/'+REPOSITORY+'/actions/runs/'+process.env.GITHUB_RUN_ID;
      const record={...result,receipt_url:receipt,verifier_run_id:process.env.GITHUB_RUN_ID};
      console.log('INDEPENDENT_EVIDENCE',JSON.stringify(record));
      if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,
        '### Verified Proofloom release\n\n'+'- WorkPacket: \`'+item.id+'\`\n- PR: #'+result.pr_number+
        '\n- Merge SHA: \`'+result.merge_sha+'\`\n- Railway revision: \`'+result.active_deployment_sha+'\`\n\n');
      await verificationApi('/api/v1/bridge/verify-release',{method:'POST',
        body:{workpacket_id:item.id,receipt_url:receipt,event_id:item.id}});
      ok++;
    }catch(e){failed++;console.error('VERIFICATION_NOT_CONFIRMED',item.id,String(e.message||e));}
  }
  console.log(JSON.stringify({verified:ok,unverified:failed}));
  if(failed)process.exitCode=1;
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href)
  main().catch(e=>{console.error(e);process.exitCode=1});
