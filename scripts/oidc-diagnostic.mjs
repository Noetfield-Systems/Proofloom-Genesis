/**
 * Diagnostic on an actual GitHub-hosted runner; prints only non-secret claim comparisons.
 * Never prints a signed token, Authorization header or secret.
 */
import { actionsIdentity,parseOidcClaims,validActionsClaims,verifyActionsJwt,AUDIENCES,EXPECTED_REPO,EXPECTED_REPO_ID,EXPECTED_OWNER_ID } from './actions-identity.mjs';
const role=process.argv[2]==='verifier'?'verifier':'agent';
const token=await actionsIdentity(role);
const parsed=parseOidcClaims(token);
const c=parsed?.claims||{};
const now=Math.floor(Date.now()/1000);
const expectedWorkflow=EXPECTED_REPO+'/.github/workflows/'+(role==='agent'?'bridge-runner':'release-verify')+'.yml@refs/heads/main';
const checks={
 parsed:Boolean(parsed),
 alg:parsed?.header?.alg==='RS256',
 issuer:c.iss==='https://token.actions.githubusercontent.com',
 audience:c.aud===AUDIENCES[role],
 repository:c.repository===EXPECTED_REPO,
 repository_id:String(c.repository_id)===EXPECTED_REPO_ID,
 repository_owner_id:String(c.repository_owner_id)===EXPECTED_OWNER_ID,
 ref:c.ref==='refs/heads/main',
 sub:typeof c.sub==='string'&&c.sub.length>=10,
 workflow_ref:c.workflow_ref===expectedWorkflow,
 event_name:['schedule','workflow_dispatch','push'].includes(c.event_name),
 iat:Number.isInteger(c.iat),
 nbf:Number.isInteger(c.nbf),
 exp:Number.isInteger(c.exp),
 timing:c.exp>now-30&&c.iat<=now+30,
 valid_claims:validActionsClaims(c,role,now),
 signed:await verifyActionsJwt(token,role,{nowSeconds:now})
};
console.log('PROOFLOOM_OIDC_DIAGNOSTIC',JSON.stringify({role,checks,claims_keys:Object.keys(c).sort(),event:c.event_name,workflow_ref:c.workflow_ref}));
if(Object.values(checks).some(v=>v!==true))process.exitCode=1;
