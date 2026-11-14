# Proofloom Delivery Roadmap — verified November 14, 2026

## v0.1 Genesis foundation — DEPLOYED
Public application, 12 missions, authentication, persistent submission and review, XP, proof, referrals and sponsor inquiry intake on isolated PostgreSQL.

## v0.2 Contribution-to-Agent Bridge — DEPLOYED (queue + event contract only)
Persisted `bridge_events`, WorkPacket lifecycle, server-to-server agent and independent-verifier credentials, bounded lease state, evidence-linked callbacks, idempotent transitions, user-visible revalidation UI, revisions after requested changes, secure operator sessions, account export and password-confirmed deletion. `BRIDGE_ENABLED=false` until repo adapter is provisioned.

**Verified:** 16/16 local checks, production smoke HTTP 200, full temporary account-to-approval E2E HTTP 200 (all synthetic users removed), unauthenticated callback 401, temporary E2E endpoint disabled 404, latest Web+DB Online SUCCESS.

## P1.1 GitHub source deployment + multilingual front end — COMPLETED; agent PR integration — NOT DONE
The `Noetfield-Systems/Proofloom-Genesis` repository is populated and its `main` branch deploys to the live `proofloom-global-web` Railway service. Ten locales are selectable (English and nine translated). 354 fixed translated strings per non-English language, correct RTL direction and 60 passed live page-language checks. 45 local tests passed. GitHub Actions workflow is committed, but no claim is made about its execution results until observed.

**Remaining:** Install GitHub App with explicit repository permission, authorize a bounded agent runner, and prove one real accepted submission → GitHub issue → scoped PR → passing checks → merge → independently verified deployment → contributor revalidation. `BRIDGE_ENABLED` remains false; no production PR execution is claimed.

## P1.2 Usability / identity hardening — NOT DONE
Email confirmation and password recovery, external browser tests (mobile and keyboard), screenshot review, login recovery, moderation and impersonation controls, separate tenant-scoped GitHub keys, notifications, anti-abuse reviews.

## P2 Economic activation — NOT DONE
A real independent payment destination, funded sponsor mission agreement, payment confirmation/webhook, bounties/contract lifecycle, sponsor fee and real positive-margin external transaction. XP remains nonfinancial. Finalized token utility and claims are separate from both sponsor cash and reputation. Do not send funds to an unrelated venture's Stripe account by default.

## P3 Community / token economy — ROADMAP
Human+AI team workspace, advanced prompt-to-diff preview, Academy progression, time-bounded Genesis campaigns, external sponsor ecosystem, optional EVM chain decision, audited distribution and public treasury/claim data only when live.
