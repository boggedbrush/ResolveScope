# Contributing

Thanks for taking a look at ResolveScope. This is a hackathon project and is published for learning, reuse, and adaptation.

This repository is not currently accepting pull requests. Everyone is welcome to fork ResolveScope and build their own version.

## Local setup

```bash
npm install
npm run dev:web
```

Requires Node.js 20.19 or newer and npm 10 or newer.

## Validation

Run the narrowest useful check while developing, then run these before publishing changes in your fork:

```bash
npm run typecheck
npm run build
git diff --check
```

For UI changes, also verify the affected page in a browser at desktop and mobile widths.

## Forking guidance

- Keep your version honest about what is implemented vs. directional.
- Keep demo data fictional unless you have explicit rights to use real evidence.
- Do not add real customer data, secrets, sponsor logos, or unsupported deployment claims.
- Mark directional backend or AI functionality as directional unless it is implemented.
- Prefer small, reviewable changes over broad rewrites.

## Workflow files

`AGENTS.md`, nested `AGENTS.md`, `.agents/skills/*`, and `skills-lock.json` are part of the public build workflow. Update them only when the workflow itself changes.

Do not commit local agent settings, environment files, generated build artifacts, or local browser logs.
