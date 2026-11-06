import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomBytes, randomUUID, createHash } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";

// Executes the actual migration in the same embedded PostgreSQL family
// used for Synthsara's local/preview database path.
test("Mirror consent SQL enforces ownership, expiry and revocation", async () => {
  const db = new PGlite();
  try {
    await db.exec(await readFile(new URL("../migrations/0001_mirror_live_consent.sql", import.meta.url), "utf8"));
    const bearer = randomBytes(32).toString("base64url");
    const digest = createHash("sha256").update(bearer).digest("hex");
    const id = randomUUID();
    await db.query(
      "INSERT INTO mirror_live_consents (id, user_id, token_sha256, consent_version, expires_at) VALUES ($1,$2,$3,$4,NOW() + INTERVAL '10 minutes')",
      [id, "visitor-1", digest, "MIRROR-FIRST-001"],
    );
    const lookup = (userId) => db.query(
      "SELECT id FROM mirror_live_consents WHERE token_sha256 = $1 AND user_id = $2 AND consent_version = $3 AND revoked_at IS NULL AND expires_at > NOW() LIMIT 1",
      [digest, userId, "MIRROR-FIRST-001"],
    );
    assert.equal((await lookup("visitor-1")).rows.length, 1);
    assert.equal((await lookup("visitor-2")).rows.length, 0);
    // The receipt table is usable without storing the plaintext bearer.
    const stored = await db.query("SELECT token_sha256 FROM mirror_live_consents WHERE id = $1", [id]);
    assert.equal(stored.rows[0].token_sha256, digest);
    assert.notEqual(stored.rows[0].token_sha256, bearer);
    await db.query(
      "UPDATE mirror_live_consents SET revoked_at = NOW() WHERE token_sha256 = $1 AND user_id = $2",
      [digest, "visitor-1"],
    );
    assert.equal((await lookup("visitor-1")).rows.length, 0);
    const id2 = randomUUID();
    await db.query(
      "INSERT INTO mirror_live_consents (id, user_id, token_sha256, consent_version, expires_at) VALUES ($1,$2,$3,$4,NOW() - INTERVAL '1 minute')",
      [id2, "visitor-1", createHash("sha256").update("other-token").digest("hex"), "MIRROR-FIRST-001"],
    );
    const expired = await db.query(
      "SELECT id FROM mirror_live_consents WHERE id = $1 AND expires_at > NOW()",
      [id2],
    );
    assert.equal(expired.rows.length, 0);
  } finally {
    await db.close();
  }
});
