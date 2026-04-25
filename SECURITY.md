# Security

ResolveScope is a seeded frontend demo. It does not currently include authentication, persisted file uploads, production storage, or live AI provider calls.

## Reporting a vulnerability

If you find a security issue, please open a private report through GitHub Security Advisories if available. If advisories are not enabled, contact the repository owner privately before opening a public issue.

Please include:

- A short description of the issue
- Steps to reproduce
- Impact
- Suggested fix, if known

## Out of scope

The current public demo uses fictional seeded data. Reports about missing production controls for unimplemented systems are useful as product feedback, but they are not vulnerabilities in the shipped demo unless the repo claims those systems are deployed.

Examples that are out of scope for the current frontend-only demo:

- Missing authentication for seeded demo routes
- Missing backend authorization for a backend that is not deployed
- Live AI prompt injection against a provider that is not called

## Secrets

Do not commit `.env`, `.dev.vars`, local agent settings, API keys, private keys, or real evidence files. Use `.env.example` only for placeholder names.
