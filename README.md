# Proofloom — Build it. Prove it. Earn it.

An **independent global human × AI builder contribution economy**. Genesis v0.3 is a functioning public beta, not a funded marketplace or issued token.

**Global production (GitHub-backed):** https://proofloom-global-web-production.up.railway.app

**Legacy production fallback:** https://proofloom-web-production.up.railway.app

**GitHub:** https://github.com/Noetfield-Systems/Proofloom-Genesis (main, auto-deployed to the new Railway service).

**Railway project:** `proofloom` (`67125ea9-a04c-4cae-a589-dd04347fc876`). New GitHub-backed Web: `proofloom-global-web`, previous Function: `proofloom-web`, database: dedicated PostgreSQL with persistent volume.

## Working v0.3 functionality

- Responsive public pages: home, 13 self-contained Genesis missions including a reviewed translation pilot, Vibe Studio entry, Academy, Community, Rewards, Opportunities, Whitepaper, Sponsors, Privacy, Terms.
- Email/password registration, durable sessions, authenticated profiles and evidence-backed mission submissions.
- Review panel with short-lived secure operator session. Decision and nontransferable XP are recorded in PostgreSQL transactions with unique reward events.
- Qualified referral XP only after a first accepted contribution; proof-of-work pages for accepted submissions.
- Sponsor inquiry collection (no payment collected or advertised as funded).
- Contributor-to-Agent Bridge: persisted event log and WorkPackets, bounded, authorized queue/lease/callback interfaces, independent verifier API and release feedback paths.
- Self-service JSON account export, password-confirmed deletion and resubmission after requested changes.
- Synthetic E2E test passed in production and cleaned up test accounts. QA endpoint is disabled by default and currently disabled in production.

## Multilingual platform

Language selector on every HTML page, cookie-persisted preference, shareable `?lang=...`, correct LTR/RTL. Literal, editorial translations are provided for English, Persian, Arabic, Spanish, French, German, Brazilian Portuguese, Russian, Simplified Chinese and Hindi, covering 12 missions and 354 platform-owned copy keys per non-English language. User-submitted data and technical identifiers are not machine-translated. See `docs/LOCALIZATION.md`.

## Live verification

- Web & DB: **Online**, both Railway `SUCCESS`.
- Smoke: HTTP **200** (page rendering and rollback-only DB test).
- E2E: HTTP **200** after a corrected `__Host-` cookie deletion bug. Temporary users were deleted.
- Auth guard: unauthenticated agent callback **401**.
- Source tests: **16/16 PASS**, TSX parser zero diagnostics.

No external commercial revenue or genuine community enrollment has been verified.

## Deploy and development

Railway Function source: complete `src/index.tsx` (Bun with Hono and postgres package imports). Runtime dependencies are inferred by the Railway Function runtime. For a regular Bun/GitHub deployment:

```bash
node scripts/make-local.mjs
bun install
bun run start
```

Add `DATABASE_URL`, `OPERATOR_REVIEW_KEY`, `BRIDGE_API_KEY` and `VERIFIER_API_KEY` to your private deployment environment. Never commit secret values. Keep `BRIDGE_ENABLED=false` and `QA_ENABLED=false` until the named integrations are verified.

For CI and source tests:

```bash
npm install
npm test
```

The repository-ready package includes `.github/workflows/ci.yml` and two SQL migration files. The live Railway Function currently applies idempotent schema changes at startup.

## Remaining external integration boundaries

The GitHub repository `Noetfield-Systems/Proofloom-Genesis` is created and deployed as the source of `proofloom-global-web`. The bounded GitHub App adapter and independently credentialed verifier workflows are implemented but remain disabled until the GitHub App, Actions credentials and repository variables are provisioned. GitHub App, paid bounty checkout, EVM issuance, genuine independent QA receipts and a real first shipped change remain separate, unverified work. Proofloom must not merge its user data, token liabilities or treasury into Noetfield, ARQANT, BuildRelay, WorkforceOS, SignalForge, Cairn or Earnloop.

Start with [Bridge API v0.2](docs/BRIDGE_API_v0.2.md), [QA report](docs/QA_AND_ACCEPTANCE.md), and [Founder Mandate](docs/FOUNDER_MANDATE_v1.txt).

## Genesis v0.4 — contributor execution pilot and polished UI

The responsive interface now has enhanced contrast, keyboard focus and mobile layout; a contributor WorkPacket timeline shows exact recorded events. Mission q13 accepts bounded JSON localization changes with human review, a repo-scoped GitHub App issue/PR runner, and a separately credentialed released-change verifier. All nine published non-English languages include the new mission and timeline labels. The source tests and CI enforce localization coverage and release-evidence invariants.

**Actual activation status:** GitHub App installation/secrets, bridge enablement and a genuine user-originated verified release are not evidenced. Workflows are opt-in; do not interpret code presence as operational dispatch. Follow [Bridge pilot operations](docs/BRIDGE_PILOT_OPERATIONS.md). The existing source-linked Railway Web and PostgreSQL remain authoritative.
