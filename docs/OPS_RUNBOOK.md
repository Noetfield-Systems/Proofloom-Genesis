# Operations Runbook

Railway Project ID: `67125ea9-a04c-4cae-a589-dd04347fc876`.
Environment ID: `15c11284-0f6b-498e-85ee-03a31082092b`.
Web Service: `proofloom-web` (`58cfbacb-4ba8-45d1-92c4-097a6e8f1865`).
Database Service: `Postgres` (`1cf7359b-c866-49dd-b511-c11a11ef9385`).
Public URL: https://proofloom-web-production.up.railway.app

The Railway function code is the complete content of `src/index.tsx`. Deploy by replacing the function's full source. Do not accidentally discard existing routes during an update.

Environment references: `DATABASE_URL=${{Postgres.DATABASE_URL}}`, `NODE_ENV=production`, secret `OPERATOR_REVIEW_KEY` set in Railway. Never paste the secret into public docs or GitHub.

Operator flow: `/operator` → enter key from secured Railway Variables → review queue → accept/reject with rationale. Accepted decisions award XP transactionally and cannot be accepted again.

Health: GET `/health`. Read-only smoke: POST `/__smoke` with provider tooling, expects 200 when all public routes render. `GET /api/v1/status` reports feature flags and DB-backed counts. If unavailable, inspect Railway service build/deploy logs and DB private network connection.

Before public outreach, ensure email verification and account support ownership are on the immediate backlog. Do not mark a token or funded marketplace as live from an aspirational whitepaper.
