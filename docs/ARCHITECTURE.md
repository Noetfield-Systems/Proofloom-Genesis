# Proofloom Architecture — Independent Genesis v0.2

## Production reality

- **Railway project:** `proofloom`, isolated from Noetfield/ARQANT/BuildRelay/SignalForge/WorkforceOS/Cairn/Earnloop.
- **Frontend and API:** One Railway Bun Function executing Hono TypeScript + TSX. Responsive dark-first web pages are rendered server-side; forms and API share PostgreSQL transactions.
- **Persistence:** Dedicated PostgreSQL with a 5 GB Railway persistent volume (actual allocation observed in Railway inventory), `DATABASE_URL` via Railway private reference.
- **Identity:** Email+password (Bun one-way hash); secure, HttpOnly, SameSite session cookies. Email confirmation/reset not integrated.
- **Operator:** Separate time-bounded HttpOnly operator session; review key stored in Railway only.
- **Contribution:** `projects`, `missions`, `submissions`, `workpackets`, `bridge_events`, `revalidations`, `reward_events`, `users`, `sponsor_leads`, `sessions`.
- **Economic boundary:** XP is nontransferable and nonfinancial. There is no token ledger, sponsor payment processor or custody layer.
- **Bridge:** `BRIDGE_API_KEY` and `VERIFIER_API_KEY` separated; WorkPacket leasing requires explicit enabled flag and configured repo; callbacks record traceable state changes but do not perform repo operations. An external verifier is required to assert `release_verified`.
- **Data controls:** User-scoped workpacket queries, export and password-confirmed deletion.

## Logical dataflow

```
Explore project/quest
    ↓
Account → Submission (Postgres)
    ↓ contribution.submitted event
Operator review → [rejected / changes requested / accepted]
    ↓ accepted
XP event (once) + WorkPacket(triage_ready) + bridge event
    ↓ [requires approved GitHub agent adapter: not connected]
Lease → Dispatch → Artifact evidence → QA evidence → Release reported
    ↓ [independent verifier: API ready, not connected]
Release verified → Origin contributor revalidates → Revalidated/Reopened
```

## Integration rule

External portfolio projects may use an **authorized adapter** but remain independent customer tenants. The original Founder OS, Company OS, Agent Fabric, Runway, Executive Governor, independent verifier and WorkforceOS should not be duplicated inside Proofloom. The available v0.2 bridge is an authenticated data-plane contract; an AgentOS runtime is **not** running as a side effect of creating a WorkPacket.

## Repository and CI

A GitHub-ready file tree and `.github/workflows/ci.yml` are in the source bundle. No independent GitHub repository was created by the connector; no CI run in GitHub is claimed. Current live Railway Function is authoritative until a verified repo-sourced deployment replaces it.
