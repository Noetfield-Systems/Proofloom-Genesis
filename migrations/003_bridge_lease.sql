-- Mirrors the idempotent schema additions in src/index.tsx.
ALTER TABLE workpackets ADD COLUMN IF NOT EXISTS lease_owner text;
ALTER TABLE workpackets ADD COLUMN IF NOT EXISTS lease_expires_at timestamptz;
CREATE INDEX IF NOT EXISTS ix_bridge_lease_recovery
 ON workpackets(status,lease_expires_at) WHERE status='leased';
