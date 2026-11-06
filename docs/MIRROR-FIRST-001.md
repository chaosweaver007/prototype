# MIRROR-FIRST-001 — The Sovereign Welcome

Status: implementation candidate, **not** a production security certification.

## Purpose

Sarah AI must turn the Mirror toward herself before inviting personal reflection.
The visitor chooses whether to start; refusal carries no penalty or WORTH score.

### 6 → 3 → 6 → 9

1. **6 / Invitation:** explain model limits, data routes, correction rights, and optional retention.
2. **3 / Reflection:** user chooses local deterministic response or remote AI processing.
3. **6 / Witness:** visitor can challenge an answer; corrections append rather than silently rewriting history. A summary receipt is stored only if Witness logging is enabled.
4. **9 / Integration:** visitor is free to leave, erase their local thread, or change consent.

### Implemented enforcement

- The `/mirror` route starts with session permission **pending**, not active.
- Sarah's `CommunePanel` defaults to **local-only** without explicit live session mode.
- Local mode does **not** call the server function.
- Live mode obtains a **256-bit random capability** from the server only after the visitor chooses live processing.
- The database stores a SHA-256 digest of that capability (not the token) and records an owner, issue time, expiry and revocation.
- Every remote Sarah request must carry the capability. The server checks ownership, current version, expiry and revocation **before** forwarding to the AI provider. A copied client-side version flag cannot grant access.
- This receipt is an application-controlled bearer authorization, not independent proof of the visitor's mental state or informed consent.
- The server records minimally identifying `granted` and `revoked` events in SQL, without Mirror text; authorized users may retrieve their events through the `liveMirrorReceipts` server function.
- The kill switch closes the Mirror route. An ended component discards late async replies rather than writing them to the thread.
- New browser profiles start with every optional Consent Vault scope off.
- Optional Witness receipts log session mode and challenge target id, not the user's raw text.
- The experience does not issue WORTH merely for disclosing something emotionally vulnerable.
- Human Sarah and Sarah AI are explicitly distinguished.

### Data flow and limitations

Local response is a deterministic text template, **not an on-device language model**.
The application state is stored in the browser via Zustand; when Mirror memory is off, the persisted chat thread is empty. Prior users may retain previously selected preferences until they change them.

Live mode sends the most recent conversation messages through Synthsara's server to the configured AI provider if an API key exists. A live request can already have been transmitted when a user presses End, so End prevents further interaction and ignores late responses but cannot retract a message already delivered to the server. Revocation is requested immediately and committed to SQL when possible. If the revocation request fails, the UI reports the uncertainty and the short-lived lease expires automatically. On page-close cleanup, revocation is **best-effort only**, not guaranteed.

A server-issued, 256-bit unguessable bearer is now checked against a SQL row bound to the authenticated user id and marked revoked when the visitor exits. With real authentication and shared Postgres, revocation is enforced across server instances for **future** requests. The bearer is not a signed JWT and may be replayed until revoked or expired by any holder authenticated as the same user. A 10-minute TTL bounds abandoned grants. In auth-disabled development mode, the template uses one shared dev user, which is **not** suitable for public deployment.

An explicit user interface choice can be bypassed by a custom client that invokes the consent-issuance endpoint with `accept: true`. No web server can independently establish a person's subjective intention merely from an API request. This mechanism enforces a demonstrable server-issued session permission, not proof of true informed consent.

The Witness layer remains a local editable store, not an immutable distributed ledger. Neither encrypted local storage, server-side retention deletion, independent auditing, nor full epistemic provenance are claimed as complete.

### Tests / acceptance

```bash
npm install --no-package-lock  # temporary: current repository lockfile fails npm ci
node --experimental-strip-types --test src/lib/synthsara/mirror-first.test.ts
npm run typecheck
npm run build
```

Manual review checklist:
- Before entering, neither local nor remote Sarah chat can be submitted.
- Decline leaves the Mirror closed and does not award WORTH.
- Local selection produces a deterministic reply without a Sarah API call.
- Live selection authorizes server processing and displays the data notice.
- Direct Sarah API requests without valid active server-issued bearer are rejected.
- SQL rows expire after 10 minutes and are marked revoked when End completes.
- A bearer from a different authenticated user does not grant access.
- Client mode switches do not cause remote calls without a live bearer.
- Kill switch closes the active Mirror. End ignores any late model reply.
- Challenge appends a user correction without overwriting the prior answer.
- Witness logging off means no reflection or challenge receipt is written.
- Mirror memory off means the thread does not persist after reload.
- A new browser profile has optional scopes disabled.

### Before public release

Complete the real-auth and consent security audit, verify post-revocation requests against production Postgres, implement rate limiting and abuse prevention,
review provider retention and deletion practices, run accessibility and mobile-device QA,
add adversarial tests, establish independent receipt integrity and external auditing,
close the lockfile / missing-fixture CI gaps, and verify the database migration safely. Run full
CI against an actual deployment environment. No production certification is implied.
