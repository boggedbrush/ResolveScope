## Scope
- Applies to documentation and strategy-facing Markdown files in `docs`.
- Follow the repository root `AGENTS.md` first, then these documentation-specific rules.

## Documentation stance
- Write ResolveScope as one evidence-to-action platform with multiple credible workflow templates.
- Lead with why the workflow matters before explaining how the product works.
- Keep claims grounded in shipped repo capability unless clearly marked as direction, planned work, or illustrative examples.
- Use sponsor references to clarify relevance, not to imply endorsement, deployment, access, or partnership.
- Avoid fake metrics, fake customer quotes, fake sponsor logos, fake security claims, and fake production maturity.

## Product language
- Prefer concrete workflow language: evidence intake, structured extraction, review, approval, export, provenance, case file, inspection, incident, claim.
- Avoid generic AI buzzwords and broad claims that could describe any software product.
- Use phrases such as `designed for`, `can support`, `example workflow`, `possible direction`, and `illustrative` when describing unshipped or aspirational behavior.
- Do not use emojis or em dashes in documentation.

## Structure
- Keep docs scan-friendly with short sections, clear headings, and only the level of detail needed for the audience.
- Avoid duplicating long explanations across docs. Link or summarize when a concept already exists elsewhere.
- Keep README-level claims and docs claims consistent when the touched doc changes product positioning.

## Validation
- Run `git diff --check` after documentation edits.
- For docs that reference app routes, scripts, or generated artifacts, verify the referenced path or command exists.
