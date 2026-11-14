# Proofloom v0.2 Public and Operator API

Read-only:
- `GET /health` — public health.
- `GET /api/v1/status` — honest feature flags, aggregate metrics.
- `GET /api/v1/missions` — live mission discovery.
- `GET /api/v1/bridge/status` — aggregate development pipeline state (no private submissions).

Contributor authenticated (secure HTTP-only session):
- `POST /register`, `POST /login`, `POST /logout`.
- `POST /submit` (body, mission_id, optional HTTPS evidence link; one per mission, revise after changes requested).
- `GET /api/v1/me` and `GET /api/v1/my/workpackets`.
- `GET /api/v1/account/export`, `POST /account/delete` (requires password and `DELETE` confirmation).
- `GET /revalidate/:id`, `POST /revalidate` (only owning contributor after independent verified release).

Operator session:
- `POST /operator/queue` validates the `OPERATOR_REVIEW_KEY` and issues a short-lived secure operator cookie.
- `GET /operator/queue` shows pending contributions/WorkPackets.
- `POST /operator/review` is authenticated by the session or a private operator key. XP/reward events and WorkPackets are persisted in one database transaction.
- `POST /operator/logout` invalidates the operator session.

Sponsor inquiries:
- `POST /sponsor` writes a request, **does not** represent payment or funding.

Agent / verifier (Bearer secrets; project repo adapter currently disabled):
- `GET /api/v1/bridge/queue`
- `POST /api/v1/bridge/lease`
- `POST /api/v1/bridge/event`
- `GET /api/v1/bridge/events/:workpacket_id`
- `POST /api/v1/bridge/verify-release` (distinct verifier key)

See `BRIDGE_API_v0.2.md` for exact payloads and state transitions.

Test endpoints: `POST /__smoke` performs public read route checks plus rollback-only DB write. `POST /__e2e` is disabled by default and was disabled after its successful production run. No synthetic tests are represented as genuine signups.
