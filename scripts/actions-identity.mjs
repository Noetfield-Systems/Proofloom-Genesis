/**
 * Verify GitHub Actions workload identity for Proofloom's two bounded service roles.
 * No long-lived GitHub or bridge credential is required by an Actions job.
 * Uses Github's published RS256 JWKS and exact repository/workflow claims.
 */
import {webcrypto} from 'node:crypto';

export const EXPECTED_REPO='Noetfield-Systems/Proofloom-Genesis';
export const EXPECTED_REPO_ID='1457579590';
export const EXPECTED_OWNER_ID='299319023';
export const GITHUB_JWKS='https://token.actions.githubusercontent.com/.well-known/jwks';
export const AUDIENCES=Object.freeze({agent:'proofloom-bridge',verifier:'proofloom-release-verifier'});
const WORKFLOWS=Object.freeze({
  agent:EXPECTED_REPO+'/.github/workflows/bridge-runner.yml@refs/heads/main',
  verifier:EXPECTED_REPO+'/.github/workflows/release-verify.yml@refs/heads/main'
});
let cachedKeys=null,cacheAt=0;
export function parseOidcClaims(token){
 if(typeof token!=='string'||token.length<300||token.length>12000)return null;
 const parts=token.split('.');
 if(parts.length!==3||parts.some(x=>!/^[A-Za-z0-9_-]+$/.test(x)))return null;
 try {
  return {header:JSON.parse(Buffer.from(parts[0],'base64url').toString('utf8')),
    claims:JSON.parse(Buffer.from(parts[1],'base64url').toString('utf8')),parts};
 }catch{return null}
}
export function validActionsClaims(claims,role,nowSeconds=Math.floor(Date.now()/1000)){
 if(!claims||!AUDIENCES[role])return false;
 const aud=claims.aud;
 const expected=WORKFLOWS[role];
 return claims.iss==='https://token.actions.githubusercontent.com'
  &&(aud===AUDIENCES[role]||(Array.isArray(aud)&&aud.length===1&&aud[0]===AUDIENCES[role]))
  &&claims.repository===EXPECTED_REPO
  &&String(claims.repository_id)===EXPECTED_REPO_ID
  &&String(claims.repository_owner_id)===EXPECTED_OWNER_ID
  &&claims.ref==='refs/heads/main'
  &&typeof claims.sub==='string'&&claims.sub.length>=10
  &&claims.workflow_ref===expected
  &&['schedule','workflow_dispatch','push'].includes(claims.event_name)
  &&Number.isInteger(claims.iat)&&Number.isInteger(claims.nbf)&&Number.isInteger(claims.exp)
  &&claims.iat<=nowSeconds+30&&claims.nbf<=nowSeconds+30&&claims.exp>nowSeconds-30
  &&claims.exp-claims.iat<=600;
}
async function getKeyset(fetcher=fetch){
 if(fetcher===fetch && cachedKeys && Date.now()-cacheAt<10*60*1000)return cachedKeys;
 const r=await fetcher(GITHUB_JWKS,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(7000)});
 if(!r.ok)throw Error('oidc_jwks_unavailable');
 const data=await r.json();
 if(!Array.isArray(data.keys)||data.keys.length===0||data.keys.length>40)throw Error('oidc_invalid_jwks');
 if(fetcher===fetch){cachedKeys=data.keys;cacheAt=Date.now();}
 return data.keys;
}
export async function verifyActionsJwt(token,role,{fetcher=fetch,nowSeconds=Math.floor(Date.now()/1000)}={}){
 const data=parseOidcClaims(token);
 if(!data||data.header?.alg!=='RS256'||typeof data.header.kid!=='string')return false;
 if(!validActionsClaims(data.claims,role,nowSeconds))return false;
 try{
  const keys=await getKeyset(fetcher);
  const jwk=keys.find(k=>k.kid===data.header.kid&&k.kty==='RSA'&&k.use!=='enc');
  if(!jwk)return false;
  const key=await webcrypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
  return await webcrypto.subtle.verify('RSASSA-PKCS1-v1_5',key,
    Buffer.from(data.parts[2],'base64url'),Buffer.from(data.parts[0]+'.'+data.parts[1]));
 }catch{return false}
}

/** Obtain an audience-specific short-lived token from the trusted Actions runtime. */
export async function actionsIdentity(role){
 if(!AUDIENCES[role])throw Error('unknown_actions_role');
 const url=process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
 const requestToken=process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
 if(!url||!requestToken)throw Error('github_actions_oidc_unavailable');
 const endpoint=new URL(url);
 if(!(endpoint.protocol==='https:'||(endpoint.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(endpoint.hostname))))throw Error('unsafe_oidc_endpoint');
 endpoint.searchParams.set('audience',AUDIENCES[role]);
 const r=await fetch(endpoint,{headers:{Authorization:'Bearer '+requestToken},signal:AbortSignal.timeout(8000)});
 if(!r.ok)throw Error('github_actions_oidc_request_'+r.status);
 const json=await r.json();
 if(typeof json.value!=='string')throw Error('missing_actions_oidc_token');
 return json.value;
}
