/**
 * Server-side MIRROR-FIRST-001 capabilities.
 *
 * The bearer is 256 bits of CSPRNG entropy, never stored in plaintext.
 * Server-backed receipt rows allow cross-instance revocation, unlike
 * unvalidated client booleans, JWT-only grants, or process-local sets.
 */
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { getSql } from "../db";
import { MIRROR_FIRST_VERSION } from "./mirror-first";

const LIVE_CONSENT_TTL_MS = 10 * 60_000;

function tokenDigest(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export type LiveMirrorReceipt = {
  token: string;
  receiptId: string;
  expiresAt: string;
};

export async function issueLiveMirrorConsent(userId: string): Promise<LiveMirrorReceipt> {
  const token = randomBytes(32).toString("base64url");
  const receiptId = randomUUID();
  const expiresAt = new Date(Date.now() + LIVE_CONSENT_TTL_MS).toISOString();
  const sql = await getSql();
  await sql.query(
    `INSERT INTO mirror_live_consents
     (id, user_id, token_sha256, consent_version, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [receiptId, userId, tokenDigest(token), MIRROR_FIRST_VERSION, expiresAt],
  );
  await sql.query(
    `INSERT INTO mirror_live_consent_events (event_id, consent_id, user_id, event_type)
     VALUES ($1, $2, $3, 'granted')`,
    [randomUUID(), receiptId, userId],
  );
  return { token, receiptId, expiresAt };
}

/** Fail closed on missing, malformed, expired, revoked, or foreign capabilities. */
export async function assertLiveMirrorConsent(
  token: string | undefined,
  userId: string,
): Promise<boolean> {
  if (!token || !/^[a-zA-Z0-9_-]{43}$/.test(token)) return false;
  const sql = await getSql();
  const rows = await sql.query<{ id: string }>(
    `SELECT id FROM mirror_live_consents
     WHERE token_sha256 = $1 AND user_id = $2
       AND consent_version = $3 AND revoked_at IS NULL
       AND expires_at > NOW()
     LIMIT 1`,
    [tokenDigest(token), userId, MIRROR_FIRST_VERSION],
  );
  return rows.length === 1;
}

export async function revokeLiveMirrorConsent(
  token: string,
  userId: string,
): Promise<boolean> {
  if (!/^[a-zA-Z0-9_-]{43}$/.test(token)) return false;
  const sql = await getSql();
  const rows = await sql.query<{ id: string }>(
    `UPDATE mirror_live_consents SET revoked_at = NOW()
     WHERE token_sha256 = $1 AND user_id = $2 AND revoked_at IS NULL
     RETURNING id`,
    [tokenDigest(token), userId],
  );
  if (rows.length === 0) return false;
  await sql.query(
    `INSERT INTO mirror_live_consent_events (event_id, consent_id, user_id, event_type)
     VALUES ($1, $2, $3, 'revoked')`,
    [randomUUID(), rows[0].id, userId],
  );
  return true;
}

/** Minimal inspectable event history; no conversation text, token or digest. */
export async function listLiveMirrorConsentEvents(userId: string) {
  const sql = await getSql();
  return sql.query<{
    event_id: string;
    consent_id: string;
    event_type: "granted" | "revoked";
    occurred_at: string;
  }>(
    `SELECT event_id, consent_id, event_type, occurred_at
     FROM mirror_live_consent_events WHERE user_id = $1
     ORDER BY occurred_at DESC LIMIT 100`,
    [userId],
  );
}
