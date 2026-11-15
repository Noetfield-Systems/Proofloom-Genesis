# Proofloom Genesis v0.5 — Production bridge and contributor experience

## Shipped UI
Proofloom remains independent. The upgrade includes a premium responsive design, translated navigation, searchable missions, genuine authenticated Studio submissions, contributor proof timelines and a public, database-backed Activity page. XP remains off-chain and non-financial.

## Bound execution path
**One pilot mission only:** q13, accepted translations of existing UI keys in Noetfield-Systems/Proofloom-Genesis. Accepted submissions create WorkPackets. A GitHub Actions runner claims one eight-minute lease, creates a WorkPacket-linked issue, a branch and a one-file PR, requests PR CI and merges only if checks pass. The PR and reported deployment are not independently verified releases.

The separate release-verification workflow reads the merged GitHub commit, PR checks, exact Railway deployed revision and live localized content before posting a verifier-only receipt. The original contributor may then revalidate or reopen.

## No-static-secret GitHub Actions authentication
Both Actions workflows use short-lived, audience-specific GitHub OIDC identities verified against published RSA JWKS and exact issuer, audience, repository ID, organization ID, workflow_ref, ref, event name, expiry and signature. The implementation runner cannot use the verifier identity. GitHub Actions uses the default ephemeral GITHUB_TOKEN for its own repository GitHub API calls.

Runner permissions: contents write, issues write, pull-requests write, actions write, id-token write.
Verifier permissions: contents read, checks read, id-token write.

**Possible one-time repository setting:** GitHub Settings > Actions > General > Workflow permissions > Allow GitHub Actions to create and approve pull requests. Organization policy may override workflow permissions. This connection cannot change GitHub administrative settings. No new GitHub App installation, copied private key or duplicate Railway service is needed.

## Runtime switch
Service: proofloom-global-web, source linked to main with the existing persistent PostgreSQL. BRIDGE_REPOSITORY must equal Noetfield-Systems/Proofloom-Genesis. Keep BRIDGE_ENABLED=false until signed Actions OIDC authentication has been observed successfully. QA_ENABLED=false normally. The older BRIDGE_API_KEY and VERIFIER_API_KEY may remain for authenticated external service clients but need not be duplicated in GitHub Actions.

## State machine
triage_ready -> leased -> dispatched (GitHub issue) -> implementation_ready (GitHub PR) -> qa_passed (passing PR checks) -> release_reported (deployed merge SHA observed) -> release_verified (separate verifier) -> revalidated / reopened (original contributor).

A maximum of three eligible packets is processed per run. Deterministic event IDs prevent duplicated callbacks, and expired leases can be reclaimed without stealing active work. User-submitted text remains untrusted data, never a shell command.

## E2E acceptance
1. Independent human submits q13 with specific JSON locale/key/text/why.
2. Operator accepts once; exactly one XP event and WorkPacket exist.
3. GitHub Actions runner authenticates through OIDC and claims that packet.
4. WorkPacket-linked issue and single-file PR exist in the allowed repository.
5. PR's actual head passes syntax-and-contracts; merge SHA is recorded.
6. Railway succeeds at the same merge SHA; the new localized label renders in production.
7. Distinct verifier posts a source-linked Actions receipt; PR CI evidence is preserved separately.
8. Original contributor revalidates or reopens.

Public activity is the actual database-backed /activity page. Personal timelines live at /work/:id, available only to the source contributor. /api/v1/status reports Railway deployment_sha when available.

## Failure recovery
Set BRIDGE_ENABLED=false to suspend new dispatch without shutting down the public site. Expired leases are re-claimable. Failed PR checks, fake evidence, mismatched deployment SHA or unverified receipt must never advance release_verified. A rollback does not rewrite historical evidence.

## Truth boundary
Merged source files and green CI do not prove a genuine submission-driven PR lifecycle. Main branch protection and GitHub Actions' PR-creation authorization are repository settings and must be verified independently. Never invent contributors, merged PRs, funds or verification receipts.
