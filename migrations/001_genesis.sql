-- Mirror of the embedded idempotent initialization in src/index.tsx.
-- Source of truth for the deployed Railway Function remains src/index.tsx until a migration runner is enabled.
CREATE TABLE IF NOT EXISTS users (
 id uuid PRIMARY KEY,email text UNIQUE NOT NULL,handle text UNIQUE NOT NULL,
 password_hash text NOT NULL,xp integer NOT NULL DEFAULT 0,
 referred_by uuid REFERENCES users(id),referral_awarded boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash text PRIMARY KEY,user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 expires_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS projects (
 id text PRIMARY KEY,title text NOT NULL,description text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS missions (
 id text PRIMARY KEY,project_id text NOT NULL REFERENCES projects(id),title text NOT NULL,
 category text NOT NULL,difficulty text NOT NULL,xp integer NOT NULL CHECK(xp>=0),
 brief text NOT NULL,deliverable text NOT NULL,status text NOT NULL DEFAULT 'open'
);
CREATE TABLE IF NOT EXISTS submissions (
 id uuid PRIMARY KEY,mission_id text NOT NULL REFERENCES missions(id),user_id uuid NOT NULL REFERENCES users(id),
 body text NOT NULL,evidence_url text,status text NOT NULL DEFAULT 'pending',reviewer_note text,
 created_at timestamptz NOT NULL DEFAULT now(),reviewed_at timestamptz,UNIQUE(mission_id,user_id)
);
CREATE TABLE IF NOT EXISTS reward_events (
 id uuid PRIMARY KEY,user_id uuid NOT NULL REFERENCES users(id),
 submission_id uuid UNIQUE REFERENCES submissions(id),kind text NOT NULL,
 xp integer NOT NULL CHECK(xp>=0),created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS workpackets (
 id uuid PRIMARY KEY,submission_id uuid UNIQUE NOT NULL REFERENCES submissions(id),
 project_id text NOT NULL REFERENCES projects(id),status text NOT NULL DEFAULT 'triage_ready',
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sponsor_leads (
 id uuid PRIMARY KEY,name text NOT NULL,email text NOT NULL,project text NOT NULL,
 budget text NOT NULL,description text NOT NULL,created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS rate_limits (
 key text PRIMARY KEY,bucket bigint NOT NULL,count integer NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS ix_submissions_user ON submissions(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS ix_submissions_status ON submissions(status,created_at DESC);
