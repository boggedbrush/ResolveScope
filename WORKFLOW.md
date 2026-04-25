# ResolveScope workflow

ResolveScope open sources the workflow as well as the product code. This repo was built as a hackathon project, so the prompts, agent contracts, and skill choices are part of the artifact.

## What is committed

- `AGENTS.md` files define product judgment, scope control, validation expectations, and implementation rules.
- `.agents/skills/*` contains curated local skills used during design, UI, SEO, and workflow tasks.
- `skills-lock.json` records where those skills came from and the expected content hash.
- `docs/prompting-guide.md` explains the prompt patterns and operating discipline used while building the project.

These files are intentionally public so reviewers can inspect how the build was guided, not only what code resulted.

## What is not committed

- Local agent settings, including `.agents/settings.local.json`.
- Secrets or machine-specific environment files.
- Generated build artifacts such as `dist/` and `*.tsbuildinfo`.
- Browser test logs, screenshots, and local cache directories.

If you use your own agent tooling, keep local permissions and credentials outside the repo. The committed workflow files should be safe to read and adapt without granting access to a specific machine.

## How skills were used

Skills were loaded only when they materially helped a task. For example:

- `frontend-design` guided product-facing UI, layout, spacing, and visual hierarchy.
- `gpt-taste` was used for a targeted dashboard design pass, then later constrained by user feedback.
- `seo-audit` is available for technical SEO review.
- `find-skills` supports discovering additional skills when a reusable workflow is likely.

The lockfile preserves skill provenance. The skill bodies are included so the repo remains inspectable without requiring every reviewer to install the same local tooling.

## Reproducing the workflow safely

1. Read the root `AGENTS.md`.
2. Read any nested `AGENTS.md` for files you plan to touch.
3. Use the smallest relevant skill for the task.
4. Keep generated local settings and secrets out of git.
5. Validate with `npm run typecheck` and `npm run build` before publishing changes.

The current app runs on fictional seeded data. No live AI provider or backend service is required.
