# Synthsara

Synthsara is a local-first React/TanStack application implementing interactive chambers for the Mirror, Weaver, RTME, WORTH, Synthocracy, the Universal Diamond Standard, Witness, and Consent.

## Run locally

Requirements: Node.js 22 and npm.

```bash
npm ci
cp .env.example .env
npm run dev
```

The core application works without an API key by using its deterministic local behavior. To enable live AI responses, set `OPENAI_API_KEY` in the server environment. `OPENAI_MODEL` is optional and defaults to `gpt-6-astra`.

## Deploy

This project includes a Vercel-compatible build. Import the repository into Vercel, then add `OPENAI_API_KEY` as a server-side environment variable. Never expose it as a `VITE_` variable; those variables are delivered to the browser.

Build and verification commands:

```bash
npm test
npm run typecheck
npm run build
```

## Current scope

The present release is a working local-first implementation. Consent, WORTH, governance, Witness, and related application state are stored in the browser. It is not yet a distributed Witness network, production identity system, or decentralized governance backend.


## Browser-first consent and data boundary

This Node Zero release provides functioning browser-local chambers (Mirror, Weaver,
RTME, WORTH, Synthocracy, Witness, UDS and Consent), not a distributed multi-user
network. The app holds each browser's state locally. Seed governance votes are
sample data; no blockchain, shared identity, collective tally, or signed Witness
ledger is claimed by this preview.

External AI processing is an explicit optional scope, **off by default**. With
this scope off, Mirror, Weaver and Manifester use deterministic local behavior
without submitting their text to the application's AI endpoint. With it on,
text is submitted to the app server and is forwarded to an external provider
only when a server-side `OPENAI_API_KEY` is configured. Never place credentials
in a `VITE_` variable.

The Consent Vault exposes a global kill switch and **Erase local node**. Erasure
clears the browser's Synthsara records, including conversation history, vows,
WORTH and local governance actions. It does not purport to erase provider-side
records if the visitor previously opted into external AI processing.

Deployment checks should include `npm run typecheck` and `npm run build`.
The legacy `npm test` suite also contains environment-dependent PWA/OG
fixture assertions; failures there are tracked separately from the app
typecheck and deploy build. Do not disable Vercel security advisories.
