-- Keep independent verification receipt distinct from the PR CI evidence URL.
ALTER TABLE workpackets ADD COLUMN IF NOT EXISTS verification_receipt_url text;
