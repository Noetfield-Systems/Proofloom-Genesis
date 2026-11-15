/**
 * Narrow Proofloom GitHub bridge pilot.
 * Executes only accepted q13 localization proposals for this repository.
 * All other WorkPackets remain in triage. Never eval user input or run its commands.
 */
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { actionsIdentity } from './actions-identity.mjs';

export const REPOSITORY = 'Noetfield-Systems/Proofloom-Genesis';
export const SUPPORTED_LOCALES = new Set(['fa','ar','es','fr','de','pt-BR','ru','zh-CN','hi']);
export const SURFACE_KEYS = new Set(['Missions','Community','Academy','Opportunities','Rewards','Log in','Whitepaper','Sponsors','Privacy','Terms','Build it.','Prove it.','Earn it.','Become a Genesis builder']);
const ORIGIN = process.env.PROOFLOOM_BASE_URL || 'https://proofloom-global-web-production.up.railway.app';
const API = 'https://api.github.com';
const RUNNER_ID = String(process.env.GITHUB_RUN_ID || 'manual') + '-' + String(process.env.GITHUB_RUN_ATTEMPT || '1');
let cachedCredential=null,credentialAt=0;
async function agentCredential(){
  if(process.env.BRIDGE_API_KEY)return process.env.BRIDGE_API_KEY;
  if(cachedCredential&&Date.now()-credentialAt<2*60*1000)return cachedCredential;
  cachedCredential=await actionsIdentity('agent');credentialAt=Date.now();return cachedCredential;
}

export function parseTranslationProposal(body) {
  let x;
  try { x=JSON.parse(body); } catch { throw Error('q13 requires a JSON proposal'); }
  if (!x || typeof x!=='object' || Array.isArray(x)) throw Error('proposal_not_object');
  if (!SUPPORTED_LOCALES.has(x.locale)) throw Error('invalid_locale');
  if (!SURFACE_KEYS.has(x.key)) throw Error('key_outside_pilot_allowlist');
  if (typeof x.text!=='string' || x.text.trim().length<2 || x.text.trim().length>160 ||
      /[<>{}\u0000-\u001f]/u.test(x.text)) throw Error('unsafe_translation_text');
  if (typeof x.why!=='string' || x.why.trim().length<12 || x.why.length>700) throw Error('missing_rationale');
  return {locale:x.locale,key:x.key,text:x.text.trim(),why:x.why.trim()};
}
export function leaseNeedsRecovery(item, now=Date.now()) {
  const expires=Date.parse(item?.lease_expires_at||'');
  return item?.status==='leased' && (!Number.isFinite(expires)||expires<=now);
}
export function stableEventId(packetId,type) {
  const x=createHash('sha256').update(packetId+':'+type).digest('hex');
  return x.slice(0,8)+'-'+x.slice(8,12)+'-5'+x.slice(13,16)+'-a'+x.slice(17,20)+'-'+x.slice(20,32);
}
export function isPilotPacket(x) {
  return x.project_id==='proofloom-lab' && x.mission_id==='q13' &&
    ['triage_ready','leased','dispatched','implementation_ready','qa_passed'].includes(x.status);
}
export function branchFor(id) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw Error('invalid_workpacket_id');
  return 'proofloom/translation-' + id.replace(/-/g,'').slice(0,18);
}
export function containsExpectedTranslation(html, text) { return html.includes(text.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll("'",'&#39;')); }

async function github(path, {method='GET',body}={}) {
  if (!process.env.GITHUB_TOKEN) throw Error('GITHUB_TOKEN is required from repository-scoped GitHub App');
  const response=await fetch(API+path,{method,headers:{
    Authorization:'Bearer '+process.env.GITHUB_TOKEN,
    Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'proofloom-bridge/0.4',
    ...(body?{'Content-Type':'application/json'}:{})
  },...(body?{body:JSON.stringify(body)}:{})});
  const data=await response.json().catch(()=>({}));
  if (!response.ok) {
    const error=new Error('github_'+response.status+' '+path+' '+(data.message||''));
    error.status=response.status;throw error;
  }
  return data;
}
async function platform(path,{method='GET',body}={}) {
  const response=await fetch(ORIGIN+path,{method,headers:{
    Authorization:'Bearer '+await agentCredential(),'Content-Type':'application/json'
  },...(body?{body:JSON.stringify(body)}:{})});
  const data=await response.json().catch(()=>({}));
  if (!response.ok) {
    const e=new Error('bridge_'+response.status+':'+(data.error||'unknown'));
    e.status=response.status;throw e;
  }
  return data;
}
async function event(item,type,url) {
  return platform('/api/v1/bridge/event',{method:'POST',body:{
    workpacket_id:item.id,event_type:type,event_id:stableEventId(item.id,type),evidence_url:url
  }});
}
async function findIssue(id) {
  const list=await github('/repos/'+REPOSITORY+'/issues?state=all&per_page=100');
  return list.find(x=>!x.pull_request && (x.body||'').includes('proofloom-workpacket:'+id));
}
async function findPR(head) {
  const list=await github('/repos/'+REPOSITORY+'/pulls?state=all&per_page=100');
  return list.find(x=>x.head?.ref===head && x.base?.ref==='main');
}
async function ensurePRChecks(pr) {
  const list=await github('/repos/'+REPOSITORY+'/actions/workflows/ci.yml/runs?branch='+encodeURIComponent(pr.head.ref)+'&per_page=30');
  if((list.workflow_runs||[]).some(x=>x.head_sha===pr.head.sha)){
    return;
  }
  await github('/repos/'+REPOSITORY+'/actions/workflows/ci.yml/dispatches',{method:'POST',body:{ref:pr.head.ref}});
  console.log('REQUESTED_PR_CHECKS',pr.head.ref,pr.head.sha);
}
async function checkedPR(pr) {
  const runs=await github('/repos/'+REPOSITORY+'/commits/'+pr.head.sha+'/check-runs?per_page=100');
  return (runs.check_runs||[]).some(x=>x.name==='syntax-and-contracts'&&x.status==='completed'&&x.conclusion==='success'&&
    x.app?.slug==='github-actions');
}
async function translationFile(locale) {
  const path='locales/'+locale+'.json';
  const file=await github('/repos/'+REPOSITORY+'/contents/'+path+'?ref=main');
  return {path,sha:file.sha,source:JSON.parse(Buffer.from(file.content,'base64').toString('utf8'))};
}
async function processPacket(item) {
  const proposal=parseTranslationProposal(item.body);
  const branch=branchFor(item.id);
  if (item.status==='triage_ready' || item.status==='leased') {
    if (item.status==='triage_ready') {
      const lease=await platform('/api/v1/bridge/lease',{method:'POST',body:{workpacket_id:item.id,runner_id:RUNNER_ID}});
      if(lease.repository!==REPOSITORY||lease.lease_owner!==RUNNER_ID)throw Error('repository_grant_mismatch');
    } else if(item.lease_owner!==RUNNER_ID) {
      if (!leaseNeedsRecovery(item)) {
        console.log('LEASE_HELD_BY_OTHER',item.id);return;
      }
      const recovered=await platform('/api/v1/bridge/lease',{method:'POST',body:{workpacket_id:item.id,runner_id:RUNNER_ID}});
      if(recovered.repository!==REPOSITORY||recovered.lease_owner!==RUNNER_ID)throw Error('lease_recovery_not_authorized');
      console.log('LEASE_RECOVERED',item.id);
    }
    const file=await translationFile(proposal.locale);
    if(!Object.hasOwn(file.source,proposal.key))throw Error('translation_key_missing_in_current_main');
    if(file.source[proposal.key]===proposal.text)throw Error('proposed_translation_already_live');
    let issue=await findIssue(item.id);
    if(!issue)issue=await github('/repos/'+REPOSITORY+'/issues',{method:'POST',body:{
      title:'[Proofloom translation] '+proposal.locale+': '+proposal.key,
      body:'Reviewed Proofloom contributor localization proposal.\n\nWorkPacket: '+item.id+
        '\nSubmission: '+item.submission_id+'\nLocale: '+proposal.locale+
        '\nKey: '+proposal.key+'\n\n<!-- proofloom-workpacket:'+item.id+' -->'
    }});
    await event(item,'workpacket.dispatched',issue.html_url);
    item.status='dispatched';
  }
  if (item.status==='dispatched') {
    let pr=await findPR(branch);
    if(!pr) {
      const file=await translationFile(proposal.locale);
      if(!Object.hasOwn(file.source,proposal.key))throw Error('translation_key_missing');
      if(file.source[proposal.key]===proposal.text)throw Error('translation_already_in_main');
      const main=await github('/repos/'+REPOSITORY+'/git/ref/heads/main');
      try {await github('/repos/'+REPOSITORY+'/git/refs',{method:'POST',body:{ref:'refs/heads/'+branch,sha:main.object.sha}});}
      catch(e){if(e.status!==422)throw e;}
      const source={...file.source,[proposal.key]:proposal.text};
      // Do not remove or reorder existing keys.
      const preserved=Object.fromEntries(Object.keys(file.source).map(key=>[key,source[key]]));
      const branchFile=await github('/repos/'+REPOSITORY+'/contents/'+file.path+'?ref='+encodeURIComponent(branch));
      await github('/repos/'+REPOSITORY+'/contents/'+file.path,{method:'PUT',body:{
        branch,message:'fix(i18n): verified community copy edit for '+proposal.locale,
        content:Buffer.from(JSON.stringify(preserved,null,2)+'\n').toString('base64'),sha:branchFile.sha
      }});
      const issue=await findIssue(item.id);
      pr=await github('/repos/'+REPOSITORY+'/pulls',{method:'POST',body:{
        title:'fix(i18n): contributor translation · '+proposal.locale+' · '+proposal.key,
        head:branch,base:'main',draft:false,
        body:'Closes #'+issue.number+'\n\nSource WorkPacket: '+item.id+
          '\nSubmitted proposal: '+item.submission_id+'\n\nRestricted to one existing UI translation string.\n\n'+
          'QA: Proofloom CI required. Automatic release verification is a separate step.'
      }});
    }
    await event(item,'implementation.ready',pr.html_url);
    await ensurePRChecks(pr);
    item.status='implementation_ready';
  }
  if (item.status==='implementation_ready') {
    const pr=await findPR(branch);
    if(!pr)throw Error('pr_not_found');
    if (!await checkedPR(pr)){await ensurePRChecks(pr);console.log('AWAITING_PR_CI',pr.html_url);return;}
    await event(item,'qa.completed',pr.html_url+'/checks');
    item.status='qa_passed';
  }
  if (item.status==='qa_passed') {
    let pr=await findPR(branch);
    if(!pr)throw Error('pr_not_found');
    if(!pr.merged_at) {
      if(process.env.PROOFLOOM_AUTO_MERGE==='true'){
        if(!await checkedPR(pr))return;
        await github('/repos/'+REPOSITORY+'/pulls/'+pr.number+'/merge',{method:'PUT',body:{
          merge_method:'squash',sha:pr.head.sha,
          commit_title:'fix(i18n): reviewed community translation ('+proposal.locale+')'
        }});
        pr=await github('/repos/'+REPOSITORY+'/pulls/'+pr.number);
      } else {console.log('AWAITING_MERGE',pr.html_url);return;}
    }
    if(!pr.merge_commit_sha)throw Error('merge_sha_missing');
    const res=await fetch(ORIGIN+'/api/v1/status',{headers:{'cache-control':'no-cache'}});
    if(!res.ok)return;
    const live=await res.json();
    if(live.deployment_sha!==pr.merge_commit_sha){console.log('AWAITING_DEPLOYMENT',pr.merge_commit_sha,live.deployment_sha);return;}
    const page=await fetch(ORIGIN+'/?lang='+encodeURIComponent(proposal.locale),{headers:{'cache-control':'no-cache'}});
    if(!page.ok || !containsExpectedTranslation(await page.text(),proposal.text)){
      console.log('AWAITING_RUNTIME_ASSERTION',item.id);return;
    }
    await event(item,'release.reported','https://github.com/'+REPOSITORY+'/commit/'+pr.merge_commit_sha);
    console.log('RELEASE_REPORTED_AWAITING_INDEPENDENT_VERIFIER',item.id);
  }
}
export async function main() {
  if(!process.env.GITHUB_TOKEN)throw Error('Missing repository-scoped GitHub token');
  await agentCredential();
  const q=await platform('/api/v1/bridge/queue');
  if(!q.execution_enabled || q.allowed_repository!==REPOSITORY){
    console.log('BRIDGE_DISABLED_OR_REPOSITORY_MISMATCH');return;
  }
  const limit=Math.max(1,Math.min(3,Number(process.env.PROOFLOOM_MAX_PACKETS||3)||3));
  const work=q.items.filter(isPilotPacket).slice(0,limit);
  for(const item of work) {
    try {await processPacket(item);}
    catch(e) {console.error('PACKET_BLOCKED',item.id,String(e.message||e));process.exitCode=1;}
  }
  console.log('PILOT_PACKETS_SEEN',work.length);
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{console.error(e);process.exitCode=1});
