-- MIRROR-FIRST-001: database-backed, individually revocable live AI consent.
-- No raw Mirror conversation text or plaintext capability token is stored.
CREATE TABLE IF NOT EXISTS mirror_live_consents (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_sha256 TEXT NOT NULL UNIQUE,
  consent_version TEXT NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS mirror_live_consents_owner
  ON mirror_live_consents (user_id, issued_at DESC);

CREATE TABLE IF NOT EXISTS mirror_live_consent_events (
  event_id TEXT PRIMARY KEY,
  consent_id TEXT NOT NULL REFERENCES mirror_live_consents (id),
  user_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('granted', 'revoked')),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS mirror_consent_events_owner
  ON mirror_live_consent_events (user_id, occurred_at DESC);
