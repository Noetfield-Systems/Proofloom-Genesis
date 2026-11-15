/**
 * Production verification performed from GitHub-hosted infrastructure.
 * No synthetic users, privileged secrets, or data mutations.
 */
import {setTimeout as delay} from 'node:timers/promises';
const BASE='https://proofloom-global-web-production.up.railway.app';
const SHA=process.env.EXPECTED_SHA||process.env.GITHUB_SHA;
const results=[];
async function request(path,{method='GET'}={}){
 const res=await fetch(BASE+path,{method,redirect:'manual',headers:{'cache-control':'no-cache','User-Agent':'Proofloom-live-smoke/0.4'}});
 const raw=await res.text();
 let json=null;try{json=JSON.parse(raw)}catch{}
 return {status:res.status,raw,json};
}
function record(id,ok,details){results.push({id,pass:Boolean(ok),details});if(!ok)console.error('FAIL',id,details);else console.log('PASS',id,details)}
let ready=false;
for(let attempt=0;attempt<24;attempt++){
 try {
  const health=await request('/health');
  const status=await request('/api/v1/status');
  if(health.status===200&&status.status===200&&status.json?.version==='genesis-0.5'&&(!SHA||status.json?.deployment_sha===SHA)){ready=true;break}
  console.log('AWAITING_RELEASE',attempt+1,{health:health.status,version:status.json?.version,expected:SHA,observed:status.json?.deployment_sha});
 }catch(e){console.log('AWAITING_RELEASE',attempt+1,String(e.message||e))}
 await delay(10000);
}
record('release_sha_observed',ready,'expected='+SHA);
if(ready){
 const health=await request('/health');
 record('health',health.status===200&&health.json?.status==='ok','HTTP '+health.status);
 const status=await request('/api/v1/status');
 record('version_and_source',status.status===200&&status.json?.version==='genesis-0.5'&&status.json?.deployment_sha===SHA,'sha='+status.json?.deployment_sha);
 const bridge=await request('/api/v1/bridge/status');
 record('bridge_truth',bridge.status===200&&bridge.json?.queue_live===true&&typeof bridge.json?.auto_execution==='boolean','HTTP '+bridge.status);
 const missions=await request('/api/v1/missions');
 record('q13_persisted',missions.status===200&&missions.json?.items?.some(m=>m.id==='q13')&&missions.json?.items?.length>=13,'missions='+missions.json?.items?.length);
 const fa=await request('/mission/q13?lang=fa');
 record('persian_q13',fa.status===200&&fa.raw.includes('بهبود ترجمه واقعی رابط کاربری')&&/dir="rtl"/.test(fa.raw),'HTTP '+fa.status);
 const ar=await request('/?lang=ar');
 record('arabic_rtl',ar.status===200&&/lang="ar"/.test(ar.raw)&&/dir="rtl"/.test(ar.raw),'HTTP '+ar.status);
 const en=await request('/');
 record('accessible_ui',en.status===200&&en.raw.includes('class="skip-link"')&&en.raw.includes('id="content"'),'HTTP '+en.status);
 const unauth=await request('/api/v1/bridge/verify-queue');
 record('verifier_auth_guard',unauth.status===401,'HTTP '+unauth.status);
 const unauthAgent=await request('/api/v1/bridge/event',{method:'POST'});
 record('agent_auth_guard',unauthAgent.status===401,'HTTP '+unauthAgent.status);
 const activities=await request('/activity');
 record('live_activity',activities.status===200&&activities.raw.includes('See what has actually happened.')&&activities.raw.includes('Verified release receipts.'),'HTTP '+activities.status);
 const missionFilter=await request('/missions?category=Feedback&search=translation&difficulty=Beginner');
 record('searchable_missions',missionFilter.status===200&&missionFilter.raw.includes('Improve a real interface translation')&&!missionFilter.raw.includes('Make the first minute clearer'),'HTTP '+missionFilter.status);
 const studio=await request('/studio');
 record('studio_real_submission',studio.status===200&&studio.raw.includes('Turn your prompt into real work.')&&studio.raw.includes('action=\"/submit\"'),'HTTP '+studio.status);
 const premium=await request('/');
 record('premium_design',premium.status===200&&premium.raw.includes('PROOFLOOM / GENESIS NETWORK')&&premium.raw.includes('feature-row'),'HTTP '+premium.status);
 const db=await request('/__smoke',{method:'POST'});
 record('db_rollback_smoke',db.status===200,'HTTP '+db.status);
 const locale=await request('/__i18n_smoke',{method:'POST'});
 record('60_locale_route_smoke',locale.status===200,'HTTP '+locale.status);
}
const summary={expected:SHA,checked_at:new Date().toISOString(),passed:results.filter(x=>x.pass).length,total:results.length,results};
console.log('PROOFLOOM_LIVE_SMOKE',JSON.stringify(summary));
if(process.env.GITHUB_STEP_SUMMARY){
 const {appendFileSync}=await import('node:fs');
 appendFileSync(process.env.GITHUB_STEP_SUMMARY,
  '## Proofloom live release checks\n\nExpected SHA: '+SHA+'\n\n'+
  results.map(x=>'- '+(x.pass?'PASS':'FAIL')+' '+x.id+' — '+x.details).join('\n')+'\n');
}
if(!results.length||results.some(x=>!x.pass))process.exitCode=1;
