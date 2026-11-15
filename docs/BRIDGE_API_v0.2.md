# Proofloom Contributor-to-Agent Bridge v0.2

**Status (2026-11-14): Deployed persistent queue/API, NOT connected to a GitHub runtime.**

## Domain separation

Proofloom exclusively owns user identities, missions, submissions, reviews, non-financial XP, WorkPacket references, and event records. Connected execution systems own repository access, code changes, PRs, tests and deployment. A reported release is **not** a verified release. `BRIDGE_REPOSITORY` is not set in the live environment; `BRIDGE_ENABLED=false`.

## Environment controls

- `DATABASE_URL`: Proofloom's own PostgreSQL connection.
- `OPERATOR_REVIEW_KEY`: existing review access secret, kept server-side.
- `BRIDGE_API_KEY`: 32+ random characters; used for server-to-server agent callbacks.
- `VERIFIER_API_KEY`: distinct random key; only the independent verifier may confirm a release.
- `BRIDGE_ENABLED`: defaults `false`, must be deliberately enabled after repo + adapter authorization.
- `BRIDGE_REPOSITORY`: explicitly permitted `owner/name` of the Proofloom project, **not** an arbitrary URL submitted by a user.
- `QA_ENABLED`: `false` in production after test completion.

Never put keys in Git, localStorage, query parameters, screenshots or public responses. Send only `Authorization: Bearer <secret>` over HTTPS; operators access their own secure HTTP-only session.

## Endpoints

| Method/path | Auth | Effects |
|---|---|---|
| GET `/api/v1/bridge/status` | Public | Aggregate queue statuses and actual integration flags, no private content |
| GET `/api/v1/bridge/queue` | Agent key | Read scoped accepted contribution packets |
| POST `/api/v1/bridge/lease` | Agent key | Atomically lease eligible WorkPacket if bridge explicitly configured; doesn't assert code execution |
| POST `/api/v1/bridge/event` | Agent key | Save idempotent, evidence-linked status transitions |
| GET `/api/v1/bridge/events/:workpacket_id` | Agent key | Chronological integration events |
| POST `/api/v1/bridge/verify-release` | **Separate verifier key** | Record independently checked release receipt after `release_reported` |
| GET `/api/v1/my/workpackets` | Authenticated contributor | Own tasks and their progress only |
| GET `/revalidate/:id` and POST `/revalidate` | Source contributor | Evaluate only independently verified releases |

### Event payload

```json
{
  "workpacket_id": "UUID",
  "event_id": "UUID unique per transition",
  "event_type": "implementation.ready",
  "evidence_url": "https://github.com/..."
}
```

Allowed state changes:

`triage_ready` → `leased` → `dispatched` → `implementation_ready` → `qa_passed` → `release_reported` → `release_verified` → (`revalidated` or `reopened`).

The `release_verified` transition requires the independent verifier endpoint, not the ordinary agent endpoint. The verifier must validate the artifact, tests, release and target repo **before** submitting a receipt. No automated external evidence validation is yet integrated; this contract alone cannot prove the GitHub action occurred.

## Acceptance evidence

- Source syntax diagnostics: zero.
- 16 local tests: PASS.
- Railway smoke: HTTP 200, public route rendering and PostgreSQL transaction rollback.
- Live end-to-end: HTTP 200 on temporary-user test of registration, referred signup, submission, duplicate prevention, operator acceptance, single reward posting, proof read, WorkPacket creation, data export and self-deletion; synthetic accounts removed.
- Unauthenticated agent callback: HTTP 401.
- After testing, `QA_ENABLED=false`: HTTP 404 for the E2E route.

## Missing until separately verified

GitHub App installation/repository credentials, authenticated agent runner, actual PR, independent QA on generated changes, production release check, real-user revalidation, funding/checkout/payout and EVM issuance. Any of these should be reported only when its unique evidence exists.

## v0.4 pilot extension

See BRIDGE_PILOT_OPERATIONS.md for the strict q13 translation-to-PR implementation, lease owner/expiry fields, separate verifier-only queue, GitHub issue/PR/CI evidence checks, and live deployment SHA verification. This extends the existing contract without representing a completed real community contribution or verified release.
