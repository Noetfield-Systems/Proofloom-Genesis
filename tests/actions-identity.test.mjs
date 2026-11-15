import test from 'node:test';
import assert from 'node:assert/strict';
import {generateKeyPairSync,sign} from 'node:crypto';
import {AUDIENCES,EXPECTED_REPO,EXPECTED_REPO_ID,EXPECTED_OWNER_ID,validActionsClaims,verifyActionsJwt} from '../scripts/actions-identity.mjs';

const {privateKey,publicKey}=generateKeyPairSync('rsa',{modulusLength:2048});
const jwk={...publicKey.export({format:'jwk'}),kid:'test-only',use:'sig',alg:'RS256'};
const fetcher=async()=>({ok:true,json:async()=>({keys:[jwk]})});
const now=1900000000;
function claims(role='agent'){
 return {
   iss:'https://token.actions.githubusercontent.com',
   aud:AUDIENCES[role],
   repository:EXPECTED_REPO,
   repository_id:EXPECTED_REPO_ID,
   repository_owner_id:EXPECTED_OWNER_ID,
   ref:'refs/heads/main',
   sub:'repo:'+EXPECTED_REPO+':ref:refs/heads/main',
   workflow_ref:EXPECTED_REPO+'/.github/workflows/'+(role==='agent'?'bridge-runner':'release-verify')+'.yml@refs/heads/main',
   event_name:'workflow_dispatch',
   iat:now-60,nbf:now-60,exp:now+240
 };
}
function mint(payload){
 const header=Buffer.from(JSON.stringify({alg:'RS256',kid:'test-only',typ:'JWT'})).toString('base64url');
 const body=Buffer.from(JSON.stringify(payload)).toString('base64url');
 const content=header+'.'+body;
 return content+'.'+sign('RSA-SHA256',Buffer.from(content),privateKey).toString('base64url');
}
test('accepts a cryptographically signed runner token with exact workflow and repository claims',async()=>{
 assert.equal(validActionsClaims(claims(), 'agent',now),true);
 assert.equal(await verifyActionsJwt(mint(claims()),'agent',{fetcher,nowSeconds:now}),true);
});
test('distinct verifier token has separate audience and cannot authorize runner',async()=>{
 assert.equal(await verifyActionsJwt(mint(claims('verifier')),'verifier',{fetcher,nowSeconds:now}),true);
 assert.equal(await verifyActionsJwt(mint(claims('verifier')),'agent',{fetcher,nowSeconds:now}),false);
});
test('rejects forged issuer, wrong workflow, wrong repository, stale token and unauthorized event',async()=>{
 for(const patch of [
  {iss:'https://attacker.invalid'},
  {workflow_ref:'Noetfield-Systems/Proofloom-Genesis/.github/workflows/ci.yml@refs/heads/main'},
  {repository:'another/other'},
  {repository_id:'111'},
  {ref:'refs/heads/feature'},
  {event_name:'pull_request'},
  {exp:now-100},
  {exp:now+3600}
 ]){
  assert.equal(await verifyActionsJwt(mint({...claims(),...patch}),'agent',{fetcher,nowSeconds:now}),false,JSON.stringify(patch));
 }
});
test('rejects signature tampering despite otherwise valid claims',async()=>{
 const token=mint(claims());const [a,b,c]=token.split('.');
 const signature=Buffer.from(c,'base64url');signature[0]^=1;
 assert.equal(await verifyActionsJwt(a+'.'+b+'.'+signature.toString('base64url'),'agent',{fetcher,nowSeconds:now}),false);
 assert.equal(await verifyActionsJwt('garbage','agent',{fetcher,nowSeconds:now}),false);
});
