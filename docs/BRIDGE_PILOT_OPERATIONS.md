# Proofloom Genesis v0.4 — bounded GitHub delivery pilot

**Status:** Code and workflows are implemented, but GitHub App credentials and a genuine user-originated PR are NOT evidenced. This is an operating runbook, not a completed release receipt.

## Scope

The first automated vertical slice is q13: Improve a real interface translation. The contributor supplies strict JSON with locale, key, text and why, for example:

    {"locale":"fa","key":"Missions","text":"ماموریت‌های واقعی","why":"This version is clearer for Persian-speaking builders."}

Allowed locales: fa, ar, es, fr, de, pt-BR, ru, zh-CN, hi. Allowed keys are a fixed set of public UI labels in scripts/github-bridge.mjs. Unrelated WorkPackets remain in triage and are never run as code or commands. Human approval grants off-chain XP and a WorkPacket, NOT source merge or release verification.

## GitHub App authorization

Create an organization GitHub App and install it ONLY on Noetfield-Systems/Proofloom-Genesis.

| Repository permission | Level |
|---|---|
| Metadata | Read |
| Contents | Read/write |
| Issues | Read/write |
| Pull requests | Read/write |
| Checks | Read |
| Actions | Read |
| Commit statuses | Read |
| Workflows / Administration | None |

Set repository Actions secrets: PROOFLOOM_GITHUB_APP_ID, PROOFLOOM_GITHUB_APP_PRIVATE_KEY, PROOFLOOM_BRIDGE_API_KEY, PROOFLOOM_VERIFIER_API_KEY. The bridge and verifier API keys must match the respective existing Railway environment secrets and must be different. These values cannot be recovered from the repository.

Set repository Actions variables to enable the actual jobs: PROOFLOOM_BRIDGE_RUNNER_ENABLED=true and PROOFLOOM_BRIDGE_VERIFIER_ENABLED=true. Until then, the jobs are skipped. In Railway service proofloom-global-web, ensure BRIDGE_REPOSITORY=Noetfield-Systems/Proofloom-Genesis and only then enable BRIDGE_ENABLED=true. Keep QA_ENABLED=false normally.

No new Railway database, Web service, Company OS or user table should be created.

## Process

1. Genuine human submits q13; operator accepts once; one WorkPacket and one XP event are persisted.
2. Bridge workflow uses a short-lived repository-scoped GitHub App token, leases eligible work for eight minutes, and enforces fixed locale/key/path restrictions.
3. Runner creates a GitHub issue referencing the WorkPacket, deterministic branch and single-file PR. Payload is treated as untrusted data, not runnable instructions.
4. Actual PR checks pass on the precise PR revision. Reviewed q13 changes may be auto-squash-merged when the fixed pilot auto-merge option is enabled; other missions are not dispatched.
5. Railway auto-deploys the merge commit. Runner observes the deployed SHA via the live API plus the live translated label before reporting release.
6. Separate verifier workflow with a different key re-reads GitHub PR, check runs, merged locale data, and live revision/content. Only then posts release verification with its GitHub Actions run receipt.
7. Original contributor separately revalidates or reopens the result.

The verifier is logically and credential-separated, but its implementation lives in the same source repo; do not claim full organizational independence.

## Acceptance and negative cases

A real end-to-end proof requires real submission ID; accepted WorkPacket UUID; GitHub issue; scoped PR; passing PR check; merged commit; SUCCESS Railway deploy of that same SHA; live behavior assertion; verifier run URL; original contributor revalidation. Test rejection for wrong project/repo, unsupported locale/key, HTML injection, non-JSON submissions, duplicate rewards, concurrent/expired leases, failing CI, unmerged changes, mismatched deployment SHA, fake receipt URL and wrong-owner revalidation.

## Recovery and known remaining limitations

Stop new work with repository variable PROOFLOOM_BRIDGE_RUNNER_ENABLED=false, and set Railway BRIDGE_ENABLED=false to reject new leases/events. The queue and GitHub evidence remain available; stale leases expire. Do not force-push or backfill fabricated verifier receipts.

Still not evidenced: installing an actual GitHub App, configuring repository secret values and variables, protecting main with required checks, enabling Railway check-suite gating, a real q13 submission, an App-created PR, and a real independent released-change receipt.

Production revision proof depends on Railway exposing RAILWAY_GIT_COMMIT_SHA at runtime; a null deployment_sha must be treated as a failure of the release check rather than replaced with an assumed value.
