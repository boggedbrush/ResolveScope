## Scope
- Applies to local Codex skills under `.agents/skills`.
- Follow the repository root `AGENTS.md` first, then these skill-authoring rules.

## Skill design
- Keep each skill narrow, reusable, and task-oriented.
- A skill should add concrete workflow guidance that is not already obvious from the root instructions.
- Do not create broad catch-all skills that compete with `AGENTS.md`.
- Keep skill instructions compatible with ResolveScope's product stance: credible, sponsor-relevant, honest about scope, and focused on evidence-to-action workflows.

## File format
- Keep `SKILL.md` front matter valid and minimal.
- Use clear `name` and `description` fields that describe when the skill should trigger.
- Store large reusable assets, examples, or scripts in the skill folder instead of embedding long blocks in `SKILL.md`.
- Do not include secrets, private tokens, or environment-specific credentials.

## Maintenance
- Prefer updating an existing skill over adding a near-duplicate.
- If a skill references files or scripts, keep paths relative to that skill folder unless there is a strong reason otherwise.
- Keep instructions concise enough that loading the skill does not waste context.

## Validation
- After skill edits, verify the changed `SKILL.md` files still have front matter and readable trigger descriptions.
- Run `git diff --check` for whitespace and Markdown hygiene.
