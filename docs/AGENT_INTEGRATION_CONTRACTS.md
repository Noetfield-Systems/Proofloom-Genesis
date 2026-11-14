# Contributor-to-Agent Bridge — Future Integration Contract v0.1

**Status: specified, NOT connected in production.**

## Event envelope
```json
{"event_id":"uuid","event_type":"contribution.submitted","schema_version":1,"occurred_at":"RFC3339","tenant_id":"tenant","project_id":"project","contribution_id":"uuid","trace_id":"uuid","idempotency_key":"unique-per-transition","payload":{}}
```

## Required event sequence
`contribution.submitted` → `feedback.classified` → `issue.clustered` → `proposal.accepted` → `workpacket.created` → `workpacket.dispatched` → `implementation.ready` → `pr.opened` → `qa.completed` → `release.verified` → `contribution.accepted` → `reward.finalized` → `contributor.revalidation_completed`.

## WorkPacket
Fields: tenant/project/repository IDs, source submission IDs, objective, allowed paths, acceptance tests, budget ceiling and actual metering, tools, execution role, owner, data classification, desired artifact and verification policy. Reject stale policy or any repository permission mismatch.

## Adapter boundaries
Generic GitHub/GitLab and manual project adapters for external tenants. Optional authorized adapters for Founder OS strategic priorities, Company OS mission state, Agent Fabric/Paperclip assignment, Runway/Motor implementation, Executive Governor authorization, independent verifier, WorkforceOS matching. They remain separate systems. OAuth installation access and explicit tenant policy determine capabilities.

## Idempotency and security
Use transactional outbox, at-least-once delivery, deduplication by event ID and transition key, signature validation, bounded retries, dead-letter recovery and auditable callbacks. Never mark a generated diff as merged or deployed until independent evidence exists.
