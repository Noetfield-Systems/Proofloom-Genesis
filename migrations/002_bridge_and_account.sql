-- P1 bridge v0.2: mirrors idempotent initialization in src/index.tsx.
-- This file documents the delta; the current Railway Function still performs
-- safe CREATE IF NOT EXISTS / ADD COLUMN IF NOT EXISTS at boot.
CREATE TABLE IF NOT EXISTS operator_sessions (
 token_hash text PRIMARY KEY,
 expires_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS bridge_events (
 id uuid PRIMARY KEY,
 submission_id uuid REFERENCES submissions(id) ON DELETE CASCADE,
 workpacket_id uuid,
 project_id text NOT NULL REFERENCES projects(id),
 event_type text NOT NULL,
 idempotency_key text NOT NULL UNIQUE,
 evidence_url text,
 source text NOT NULL DEFAULT 'platform',
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_bridge_events_project ON bridge_events(project_id,created_at DESC);
ALTER TABLE workpackets ADD COLUMN IF NOT EXISTS repository text;
ALTER TABLE workpackets ADD COLUMN IF NOT EXISTS artifact_url text;
ALTER TABLE workpackets ADD COLUMN IF NOT EXISTS qa_evidence_url text;
ALTER TABLE workpackets ADD COLUMN IF NOT EXISTS release_url text;
ALTER TABLE workpackets ADD COLUMN IF NOT EXISTS execution_trace_id text;
ALTER TABLE workpackets ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
CREATE INDEX IF NOT EXISTS ix_workpackets_status ON workpackets(status,updated_at DESC);
CREATE TABLE IF NOT EXISTS revalidations (
 id uuid PRIMARY KEY,
 workpacket_id uuid NOT NULL UNIQUE REFERENCES workpackets(id) ON DELETE CASCADE,
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 resolved boolean NOT NULL,
 note text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
