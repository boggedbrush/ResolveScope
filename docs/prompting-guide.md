# Prompting guide

How this project uses structured prompting and agent contracts to shape implementation work.

---

## Why prompting matters in this repo

ResolveScope was built under challenge timeline pressure using Claude Code as the primary implementation agent. The quality of what gets built depends directly on how well the agent understands the product constraints, the design philosophy, and the scope limits.

Prompting here is not about clever tricks. It is about operating a coding agent like a disciplined collaborator: give it clear scope, clear constraints, and a way to make judgment calls when the task is ambiguous.

---

## AGENTS.md as the default agent contract

`AGENTS.md` (symlinked as `CLAUDE.md`) is the default operating contract for any coding agent working in this repo. It is read at the start of each session and defines:

- **Product understanding** — what ResolveScope is, what the strongest product story is, what the sponsor framing is
- **Known truths** — established facts that should not be re-derived on every task
- **Precedence rules** — how to resolve conflicts between user instructions, nested configs, and general practice
- **Task classes** — small / medium / large, with different default behaviors for each
- **Core rules** — what to avoid, what to optimize for, what makes a good tradeoff
- **Validation standards** — what counts as sufficient validation for frontend and implementation work
- **Token-efficiency rules** — explicit prohibitions against over-reading, over-documenting, and over-generalizing

The contract is intentionally opinionated. A vague AGENTS.md produces vague implementations. A specific one produces work that fits the product without constant correction.

---

## How skills are used

The `frontend-design` skill is declared mandatory in `AGENTS.md` for all landing pages, marketing pages, dashboards, and design-system work. When it is available, it is invoked before significant frontend work begins.

Other skills (like `simplify`, `loop`, `schedule`) are used when the specific task warrants them — not by default.

The skill system keeps specialized guidance modular. Rather than cramming everything into `AGENTS.md`, specialized concerns live in invocable skills that are only loaded when relevant.

---

## How implementation tasks are sliced

The default approach is bounded slices:

1. Identify the smallest likely file set
2. Check for relevant nested `AGENTS.md` files
3. Check for relevant skills
4. Read only the files needed to act safely
5. Write a short plan proportional to task size
6. Execute in small steps
7. Validate with the narrowest useful check

Large tasks are split into phases. Each phase has clear acceptance criteria. Dependencies between phases are surfaced before implementation starts, not discovered mid-task.

---

## Prompt anatomy

A well-structured task prompt for this repo typically includes:

- **Goal** — what outcome should exist when the task is complete
- **Constraints** — what must not change, what must not be added
- **Scope** — which files or areas are in scope; which are not
- **Acceptance criteria** — how to know it is done
- **Honesty requirement** — what can and cannot be claimed (no fake data, no overclaiming)

Short prompts for small tasks. Structured prompts for large ones. The pattern scales with task complexity.

---

## Token-efficiency tactics

Several rules in `AGENTS.md` exist specifically to prevent context bloat:

- **Search before read** — glob and grep to narrow targets before opening files
- **Read once** — do not reread a file that has not changed and is already understood
- **Skip README for implementation** — the README is for product context, not implementation guidance; don't load it on every task
- **No broad scans** — do not explore the full repo to "understand architecture" unless the task genuinely requires architecture work
- **Bounded read budget** — 5 files for small tasks, 8 for medium, 12 for large; hard limit unless blocked

These rules exist because token-inefficiency compounds: one extra file read leads to another, leads to a longer context, leads to less accurate work and slower iteration.

---

## What stays human-directed

Not everything is delegated. The following stays under direct human control:

- Product strategy and sponsor framing decisions
- Design direction and visual hierarchy choices
- What to keep vs. cut when scope needs to shrink
- Truthfulness review — checking that copy does not overclaim
- Final review of any change to AGENTS.md or system-level config

The agent handles implementation. The human handles product judgment.

---

## Example prompt patterns

**Small UI fix:**
> The spacing between the evidence panel header and the first evidence item is too tight. Fix the gap in `EvidencePanel.tsx` — target `16px` between the header rule and the first item. Do not touch anything else.

**Medium feature slice:**
> Add an override reason field to the review panel. When a reviewer changes a field value, prompt them for a one-line reason. Log it to the audit array using the existing `makeAuditId` utility. The override map already exists in `reviewOverrides.ts` — use it. No new dependencies.

**Documentation task:**
> Refactor README.md to be a showcase landing page and docs hub. Move longer-form material into a new `docs/` directory. Keep the hero, live demo, reviewer flow, differentiation table, and local setup in the README. Create six docs files: architecture, how-it-works, how-i-built-this, prompting-guide, demo-surfaces, screenshots. Use relative links. Do not add broken links or invented content.

---

## Lessons learned

- **Specificity beats length.** A 3-line prompt with clear acceptance criteria produces better results than a 20-line prompt that is vague about what "done" means.
- **Constraints are as important as goals.** Telling the agent what *not* to do prevents well-intentioned scope creep.
- **Named known truths reduce drift.** The "Known truths" section in `AGENTS.md` means the agent does not re-derive product positioning on every task. This keeps implementations coherent across sessions.
- **Honesty constraints must be explicit.** Without explicit rules against overclaiming (fake metrics, fake production claims, fake testimonials), AI agents will optimistically embellish. The rules work.
- **Validation must be prescribed.** Without an explicit validation step in the task, the agent will declare success based on the appearance of correctness, not confirmed correctness. Always name the check.
