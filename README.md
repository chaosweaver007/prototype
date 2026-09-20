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

