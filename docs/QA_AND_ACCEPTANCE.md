# Proofloom QA & Acceptance — 2026-11-14

## Confirmed from live Railway

| Check | Result | Scope |
|---|---|---|
| Production Web + Postgres | PASS | Both online; deployment status SUCCESS |
| Main route rendering | PASS | HTTP `/__smoke` 200; 15 public routes, basic DB write/rollback transaction |
| Browser-like registration | PASS | E2E test registered a temporary parent and referral child; secure session cookies issued |
| Mission → submission | PASS | E2E saved one pending contribution; duplicate second submission did not create a second row |
| Acceptance → XP | PASS | E2E operator approved; contributor XP 45 and parent qualified referral XP 30; no XP before acceptance |
| Reward idempotency | PASS | Duplicate review rejected; one unique reward-event record |
| Public proof / WorkPacket | PASS | E2E public proof responded 200; stored WorkPacket in `triage_ready` |
| Export and account deletion | PASS | Real authenticated JSON export; password-confirmed delete; no E2E users retained |
| E2E disabled in production | PASS | `QA_ENABLED=false`, test endpoint returned 404 |
| Unauthorized bridge event | PASS | HTTP 401 without agent key |
| Local syntax and contract tests | PASS | 16/16, TypeScript TSX parse 0 errors |

The E2E run initially detected a `__Host-` cookie deletion error and produced HTTP 503. The implementation was corrected to supply `secure:true` for cookie deletion and passed in the subsequent run (HTTP 200). Do not claim an external human user participated in QA: it used synthetic accounts and deleted them.

## Not demonstrated yet

| Mandate | Status |
|---|---|
| Actual autonomous coding / issue triage with AI | Not connected; persistent Bridge API supports the adapter contract |
| GitHub pull request, checked/merged code | Not done; GitHub source repository exists; contributor-initiated App PR and verified release still not demonstrated |
| Independent release QA and user revalidation | Routes and state machine built; no actual verified release receipt |
| Project isolation under multiple real external tenants | Not proven; one Proofloom self project |
| Paid sponsor transaction and net-positive contribution margin | No checkout or payments connected |
| Token issuance, claims or liquidity | Not active |
| Automated customer growth and retention | No real traffic conversion claims |

## Verification caution

Actual browser screenshots, accessibility audits, email confirmation/reset, payment reconciliation and GitHub source CI runs now exist; a real contributor-originated checked PR remains outstanding. The QA code is opt-in and disabled after testing.

## Genesis v0.4 implementation evidence

GitHub PR #1 adds a bounded translation-to-PR pilot, explicit lease recovery, separately credentialed release verification and a contributor evidence timeline. The repository CI must pass after these changes. **No real end-to-end contributor execution claim is justified by this implementation PR.** A successful PR merge and Railway deploy of the implementation code are distinct from a genuine user-sourced task releasing through the automated bridge.

## v0.5 verification scope

Source-level tests cover token signing, exact OIDC claims, role separation, expired lease recovery, translation parity (408 keys across nine non-English languages), genuine Studio submission wiring, public Activity proof, and separate QA vs verifier receipts. CI and production results must reference the actual v0.5 deployed SHA; results from v0.4 cannot be relabeled. First genuine q13 runner-originated PR and verifier receipt remain separately auditable gates.
