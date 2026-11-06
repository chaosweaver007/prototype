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
- Remote Sarah requests include the `MIRROR-FIRST-001` consent-version assertion.
- The server rejects missing or mismatched assertions for Sarah voice.
- The kill switch closes the Mirror route. An ended component discards late async replies rather than writing them to the thread.
- New browser profiles start with every optional Consent Vault scope off.
- Optional Witness receipts log session mode and challenge target id, not the user's raw text.
- The experience does not issue WORTH merely for disclosing something emotionally vulnerable.
- Human Sarah and Sarah AI are explicitly distinguished.

### Data flow and limitations

Local response is a deterministic text template, **not an on-device language model**.
The application state is stored in the browser via Zustand; when Mirror memory is off, the persisted chat thread is empty. Prior users may retain previously selected preferences until they change them.

Live mode sends the most recent conversation messages through Synthsara's server to the configured AI provider if an API key exists. A live request can already have been transmitted when a user presses End, so End prevents further interaction and ignores late responses but cannot retract a message already delivered to the server.

The server currently checks a **client-supplied consent version**; it is **not yet authenticated**, signed, or bound to a particular user/session. A custom client could forge it. Therefore the current implementation is a consent-first user experience and a preliminary fail-closed API contract, **not a cryptographic Gate Zero**.

The Witness layer remains a local editable store, not an immutable distributed ledger. Neither encrypted local storage, server-side retention deletion, independent auditing, nor full epistemic provenance are claimed as complete.

### Tests / acceptance

```bash
npm ci
npm test
npm run typecheck
npm run build
```

Manual review checklist:
- Before entering, neither local nor remote Sarah chat can be submitted.
- Decline leaves the Mirror closed and does not award WORTH.
- Local selection produces a deterministic reply without a Sarah API call.
- Live selection authorizes server processing and displays the data notice.
- Direct Sarah API request without consent assertion is rejected.
- Kill switch closes the active Mirror. End ignores any late model reply.
- Challenge appends a user correction without overwriting the prior answer.
- Witness logging off means no reflection or challenge receipt is written.
- Mirror memory off means the thread does not persist after reload.
- A new browser profile has optional scopes disabled.

### Before public release

Implement server-issued, short-lived, session-bound consent tokens, rate limiting,
provider retention/deletion policy review, accessibility and device QA, adversarial
tests, real provenance disclosures, and a consent revocation audit. Run full
CI against an actual deployment environment. No production certification is implied.
