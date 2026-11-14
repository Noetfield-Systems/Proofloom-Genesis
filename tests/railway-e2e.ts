import postgres from 'postgres@3';
const BASE='https://proofloom-web-production.up.railway.app';
const email='proofloom-qa-'+crypto.randomUUID().slice(0,12)+'@example.invalid';
const handle='qa_'+crypto.randomUUID().replace(/-/g,'').slice(0,15);
const password='Temporary-QA-Password-'+crypto.randomUUID();
const db=postgres(Bun.env.DATABASE_URL||'postgres://unconfigured',{max:1,connect_timeout:8,ssl:false});
const results:{step:string,pass:boolean,detail:string}[]=[];
let uid:string|undefined; let sid:string|undefined;
function check(step:string,pass:boolean,detail:string){results.push({step,pass,detail});if(!pass)throw new Error(step+': '+detail)}
async function form(path:string,data:Record<string,string>,cookie=''){
 return fetch(BASE+path,{method:'POST',redirect:'manual',headers:{'content-type':'application/x-www-form-urlencoded','origin':BASE,...(cookie?{'cookie':cookie}:{})},body:new URLSearchParams(data).toString()});
}
async function clean(){
 if(!uid)return;
 try{
  await db`DELETE FROM reward_events WHERE user_id=${uid}`;
  await db`DELETE FROM workpackets WHERE submission_id IN (SELECT id FROM submissions WHERE user_id=${uid})`;
  await db`DELETE FROM submissions WHERE user_id=${uid}`;
  await db`DELETE FROM sessions WHERE user_id=${uid}`;
  await db`DELETE FROM users WHERE id=${uid}`;
  const left=await db`SELECT count(*)::int n FROM users WHERE id=${uid}`;
  results.push({step:'QA cleanup',pass:left[0].n===0,detail:'Technical account removed; no test users retained'});
 }catch(e:any){results.push({step:'QA cleanup',pass:false,detail:String(e.message)});}
}
try{
 check('DB configuration',!!Bun.env.DATABASE_URL,'DATABASE_URL present');
 const health=await fetch(BASE+'/health');check('Health GET',health.status===200,String(health.status));
 const missions=await fetch(BASE+'/api/v1/missions');const missionsData=await missions.json();check('Mission API',missions.status===200&&missionsData.items.length>=12,String(missionsData.items?.length));
 const register=await form('/register',{handle,email,password,agree:'yes'});
 check('Register redirect',register.status===302,String(register.status));
 const cookie=(register.headers.get('set-cookie')||'').split(';')[0];
 check('Secure session cookie',cookie.startsWith('__Host-proofloom='),'HttpOnly cookie issued');
 const account=await db`SELECT id,xp FROM users WHERE email=${email}`;uid=account[0]?.id;
 check('Account persisted',!!uid&&account[0].xp===0,'Created with zero XP');
 const submit=await form('/submit',{mission_id:'q01',body:'QA reproducible evidence: access the first mission and verify that acceptance is required before XP is granted.'},cookie);
 check('Submission redirect',submit.status===302,String(submit.status));
 const submissions=await db`SELECT id,status FROM submissions WHERE user_id=${uid}`;sid=submissions[0]?.id;
 check('Contribution persisted',!!sid&&submissions[0].status==='pending','Pending, no early XP');
 const duplicate=await form('/submit',{mission_id:'q01',body:'Duplicate QA submission must not generate another entry.'},cookie);
 const num=await db`SELECT count(*)::int n FROM submissions WHERE user_id=${uid}`;
 check('Duplicate submission suppressed',duplicate.status===302&&num[0].n===1,'One submission per user+mission');
 const reviewKey=Bun.env.OPERATOR_REVIEW_KEY||'';
 check('Operator config',reviewKey.length>=32,'Private review key present');
 const approve=await form('/operator/review',{key:reviewKey,id:sid!,status:'accepted',note:'Verified QA test contribution against the Genesis mission rubric.'});
 check('Review acceptance',approve.status===302,String(approve.status));
 const ledger=await db`SELECT count(*)::int n,sum(xp)::int earned FROM reward_events WHERE submission_id=${sid}`;
 const xp=await db`SELECT xp FROM users WHERE id=${uid}`;
 check('XP once after acceptance',ledger[0].n===1&&ledger[0].earned===45&&xp[0].xp===45,JSON.stringify({ledger:ledger[0],xp:xp[0].xp}));
 const proof=await fetch(BASE+'/proof/'+sid);check('Public verified proof',proof.status===200,String(proof.status));
 const again=await form('/operator/review',{key:reviewKey,id:sid!,status:'accepted',note:'Duplicate review must not pay again.'});
 const ledger2=await db`SELECT count(*)::int n FROM reward_events WHERE submission_id=${sid}`;
 check('Duplicate reward blocked',again.status===409&&ledger2[0].n===1,'Idempotent review');
} catch(e:any){console.error('Proofloom QA step failed:',e.message)}finally{await clean();await db.end();console.log('PROOFLOOM_QA_REPORT '+JSON.stringify({ok:results.length>=10&&results.every(r=>r.pass),results}));}
