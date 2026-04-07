## Product understanding
- Build **ResolveScope** into a polished, credible, employer-facing product concept for the current sponsor-facing challenge submission.
- Optimize decisions for:
  1. sponsor relevance
  2. feasibility within the challenge timeline
  3. technical quality and differentiation
  4. demo quality and employer-facing appeal
  5. honest scope and maintainable execution
- Prefer a smaller, sharper, more credible result over an ambitious but incomplete one.
- ResolveScope is an **evidence-to-action platform**:
  - important decisions are often made from scattered, unstructured evidence
  - evidence can include documents, notes, forms, images, video, and field observations
  - the product should help turn that evidence into structured, reviewable, exportable case files
  - AI may assist with summarization, extraction, classification, and draft outputs
  - humans remain in the loop for review, edits, and approval
  - spatial / 360 / lightweight 3D review is part of the product direction and should be treated as a meaningful differentiator, not decorative fluff
- Sponsor-aligned workflow framing:
  - **GEICO**: insurance claims, evidence review, severity triage, claim-ready outputs
  - **Uber**: fleet incidents, safety workflows, incident-to-action handoffs, operational review
  - **L'Oréal**: product testing, quality review, consumer-care issue triage, visual evidence review
  - **KPFF**: site inspections, field observations, punch lists, physical asset review
  - **ZS**: structured intake, governed review workflows, decision support, operational evidence systems
- Do not fragment the product into five separate tools. Build one strong platform story with multiple credible applications.
- Until the repository proves otherwise, assume:
  - this project is still early
  - `README.md` may describe direction rather than shipped capability
  - sponsor alignment matters
  - landing-page polish matters
  - credibility and restraint are strategic advantages

## Known truths
- Treat these as established unless the touched code directly contradicts them:
  - ResolveScope is one evidence-to-action platform, not five separate sponsor-specific products.
  - The strongest product story is structured evidence -> review -> approval -> export.
  - Multi-template workflows are a strategic advantage.
  - Spatial / 360 / lightweight 3D review matters only when it is product-relevant.
  - README and strategy docs may describe intended direction, not fully shipped capability.
- Do not reread `README.md` or strategy files during routine implementation unless:
  - the task is about product positioning, copy, architecture direction, or sponsor strategy
  - the user explicitly asks for documentation or strategy work
  - the code contradicts an established assumption and the conflict must be resolved

## Precedence
- When instructions conflict, use this order:
  1. direct user instructions
  2. more deeply nested `AGENTS.md` files covering the touched files
  3. this `AGENTS.md`
  4. project files that define current reality
  5. relevant installed skills
  6. general best practices
- Scope rules:
  - every touched file must follow all applicable `AGENTS.md` instructions in scope
  - more deeply nested `AGENTS.md` files take precedence for their subtree
  - code style, naming, and structure rules apply only within the scope that declares them unless explicitly stated otherwise
  - user instructions always override `AGENTS.md`
- Current high-value project context:
  - `README.md` for product overview and scope framing
  - challenge strategy / sponsor research files if the task is strategy or positioning related
  - future nested `AGENTS.md` files for subsystem-specific rules
  - installed skills discovered in project or runtime skill directories
- If project files conflict with vague assumptions, prefer the project files.

## Startup routine
- Default to a bounded startup routine.

### Bounded startup routine
1. read the request carefully
2. identify the smallest likely file set
3. check for nested `AGENTS.md` files affecting only those paths
4. check for directly relevant skills only
5. use search, globbing, and directory inspection before opening files
6. read only the minimum set of files needed to act
7. write a short plan proportional to task size
8. execute in small steps
9. validate with the narrowest useful check

### Initial read budget
- Default maximum before editing:
  - 5 files for small tasks
  - 8 files for medium tasks
  - 12 files for large tasks
- Do not exceed the default budget unless blocked.

### Allowed reasons to expand the read budget
- a referenced symbol cannot be resolved
- a scoped `AGENTS.md` requires more context
- a relevant skill requires specific local context
- validation failure requires tracing a dependency
- the user explicitly requests broader analysis

### Explicit prohibitions
- do not begin by reading `README.md` for routine implementation tasks
- do not read docs, strategy files, or large config files unless they are directly relevant
- do not reread unchanged files already understood
- do not scan the repo broadly to understand architecture unless the task truly requires architecture work

- For trivial one-line edits, keep the routine lighter still.

## Skills
- Check for relevant skills before substantial work only when the task is likely to benefit materially from specialized guidance.
- Do not perform broad skill discovery for routine edits.

### Skill discovery order
1. `.agents/skills/*/SKILL.md`
2. repository-level or workspace-level skill directories documented by the project
3. runtime-provided or tool-provided skill directories if the environment supports them

### When to check skills
- frontend UX, visual design, design systems, or presentation-heavy React work
- infrastructure or deployment work
- specialized domains such as PDF, docs, slides, spreadsheets, image processing, or 3D
- when the user explicitly asks about skills or asks to add one

### When not to check skills
- small refactors
- narrow bug fixes
- copy edits that do not change UX structure
- routine typed component or utility work already following local patterns

### Mandatory skill
- `frontend-design` is mandatory when available for:
  - landing pages
  - marketing pages
  - dashboards
  - app shell UX
  - UI redesigns
  - design systems
  - spacing, typography, hierarchy, responsiveness, or motion
  - React / frontend presentation changes
  - product-facing copy structure for frontend surfaces
  - 3D or spatial presentation work in the frontend

### Skill usage rules
- If a relevant skill exists, use it.
- Use the narrowest relevant skill first.
- Compose skills only when the task clearly benefits.
- Avoid loading irrelevant skills into context.
- If a specialized skill should exist but none is available:
  - proceed conservatively using repository conventions and best judgment
  - do not invent nonexistent skill instructions
  - keep the implementation restrained

### `find-skills`
- Use `find-skills` only if:
  - no local skill clearly fits
  - the task is specialized enough that a reusable skill is likely
  - the user explicitly asks to find or add a skill
- Do not use `find-skills` by default for normal application work.

## Core rules
- Make the smallest change that cleanly solves the problem.
- Preserve existing conventions unless there is a strong reason to improve them.
- Keep naming descriptive and consistent.
- Avoid unrelated opportunistic edits.
- Do not add fake data, fake metrics, fake testimonials, fake logos, or fake production claims.
- Keep scope honest:
  - avoid locking the project into unnecessary commitments in docs or marketing copy
  - present architecture and product direction as direction unless already implemented
  - do not write copy that implies production deployment when the repo does not support that claim
- Prefer one clear recommendation over many weak options.
- When tradeoffs are close, choose the option that best improves:
  1. clarity
  2. credibility
  3. sponsor relevance
  4. maintainability
  5. speed of completion
- When time slips, cut in this order:
  1. decorative complexity
  2. low-signal sections
  3. ambitious edge-case functionality
  4. extra dependencies
- Do not cut the core story, usability, or sponsor relevance.
- Minimum behavior contract:
  - check for relevant scoped instructions
  - check for relevant skills when warranted
  - use `frontend-design` for frontend-related work when available
  - keep context usage efficient
  - avoid generic AI-product output
  - stay honest about scope and implementation status
  - validate changes where possible
  - leave the repository in a cleaner, more credible state than it started

## Task classes
- Classify the task before gathering context.

### Small
Examples:
- single-component tweak
- copy change
- one utility fix
- narrow styling update

Default behavior:
- inspect target file(s)
- check scoped instructions
- check only clearly relevant skills
- edit
- run one narrow validation

### Medium
Examples:
- feature slice within an existing subsystem
- multi-file refactor in one area
- new template, panel, or export change

Default behavior:
- inspect target area and immediate dependencies only
- use relevant skills if applicable
- write a brief plan
- implement in phases
- run narrow validation, then one broader check if needed

### Large
Examples:
- architecture changes
- new subsystem
- major frontend redesign
- infra or deployment work

Default behavior:
- gather broader but still bounded context
- check relevant skills early
- define acceptance criteria
- execute in phases
- validate more comprehensively

## Task-specific standards
### Planning
- Use planning proportional to task size.
- Small tasks:
  - identify target file(s)
  - make the change
  - validate quickly
- Medium and large tasks:
  - define the goal
  - note constraints
  - identify affected files
  - define acceptance criteria
  - execute in phases
  - validate before stopping

### Product and marketing copy
- Emphasize **why it matters** before **how it works**.
- Avoid generic AI buzzword copy.
- Do not overclaim maturity, adoption, security, or performance.
- Treat the README and project docs as the boundary for what can be claimed directly.
- Frame forward-looking ideas honestly: `designed for`, `can support`, `example workflow`, `possible direction`, `illustrative`.
- Do not use em-dashes in any copy or writing.

### Frontend
- Optimize for:
  - clarity within the first few seconds
  - strong typography hierarchy
  - disciplined spacing
  - responsive layout quality
  - accessibility and keyboard usability
  - tasteful motion
  - visual originality without gimmicks
  - sponsor-relevant storytelling
  - product credibility
- Explicit prohibitions:
  - no generic AI-themed visual clichés
  - no default blue / purple neon treatment unless explicitly requested and justified
  - no dependence on dark mode alone
  - no emoji usage in UI or product-facing copy
  - no bloated template sections with low information value
  - no stack-heavy marketing copy on landing pages unless explicitly requested
- Landing and marketing pages should primarily answer:
  - why this matters
  - what painful workflow it fixes
  - why a user or sponsor should care
  - why this is more credible than scattered files and manual review
- Frontend work for ResolveScope should reinforce:
  - evidence
  - review
  - traceability
  - operational clarity
  - human oversight
  - spatial understanding

### 3D and spatial work
- Spatial or 3D work must feel product-relevant.
- Allowed:
  - purposeful Three.js previews
  - inspectable scenes
  - stylized evidence pins or zones
  - subtle product teasers for future dashboard capability
- Not allowed:
  - random decorative 3D objects with no product meaning
  - performance-heavy gimmicks
  - visual noise that distracts from clarity
- Any 3D implementation should be:
  - performant
  - responsive
  - purposeful
  - graceful under reduced-motion preferences where practical

### Implementation
- Unless the user explicitly asks for a prototype-only answer, aim for implementation quality that is:
  - coherent
  - maintainable
  - reviewable
  - runnable in the project’s existing setup
- Prefer:
  - reusable components
  - structured, data-driven rendering where appropriate
  - minimal but clear abstractions
  - small composable functions
- Avoid:
  - giant monolithic files when clean decomposition is obvious
  - premature generalization
  - dependency sprawl
- Only add dependencies when they materially improve the result and are worth the maintenance cost.

### Research
- When external research is needed:
  - prefer first-party documentation first
  - use third-party sources to clarify patterns, tradeoffs, and common practice
  - do not cargo-cult patterns from trendy examples
  - stop researching once there is enough information to make a grounded decision
- When the task involves current APIs, model names, framework behavior, vendor guidance, or challenge details, verify them before relying on memory.

### Repository hygiene
- Do not commit without explicit permission from the user.
- Do not commit secrets.
- Do not track generated artifacts unless intentionally part of the repo.
- Keep the worktree clean when the environment supports git workflows.
- Do not modify unrelated files opportunistically.
- Keep changes logically scoped.
- Do not rewrite existing history unless explicitly asked and the environment supports it.

## Validation
- Every meaningful change should be validated.
- Validation may include:
  - type checking
  - tests
  - linting
  - build verification
  - focused manual QA for UX changes
- If validation tools exist, run the narrowest reliable set that gives confidence.
- If you cannot run a check:
  - say so explicitly
  - explain why
  - do not pretend validation happened
- Frontend manual verification should include:
  - mobile and desktop sanity check
  - overflow and wrapping issues
  - CTA visibility
  - contrast and readability
  - interaction states
  - empty-state or missing-data resilience where relevant

## Token-efficiency
- Be aggressively efficient with context and tool usage.

### Search-first rule
- Prefer search, globbing, symbol lookup, and directory inspection before opening files.
- Open files only after narrowing to likely targets.

### Read-once rule
- Do not reread a long file unless:
  - it changed
  - a specific unresolved section must be checked
  - validation surfaced a contradiction

### Locality rule
- Read the files you expect to edit plus only the smallest number of dependencies needed to do so safely.
- Do not load adjacent files for context unless they are likely to be edited or referenced.

### Documentation rule
- Do not read README, strategy docs, or broad architecture docs for routine implementation tasks.
- Reuse already established project truths unless the task is documentation, strategy, or architecture-facing.

### Planning rule
- Keep plans short.
- Default:
  - small tasks: no written plan or 1–3 bullets
  - medium tasks: up to 5 bullets
  - large tasks: up to 7 bullets
- Do not produce long architectural narrations unless the user asks.

### Execution rule
- Start editing once the minimal viable context is gathered.
- Do not keep researching after you already have enough to implement safely.

### Validation rule
- Run the narrowest reliable validation first.
- Expand validation only if the first check fails or the change surface is broad.

### Prohibitions
- do not dump large files into context without need
- do not reread the same long file repeatedly
- do not scan generated files or lockfiles unless necessary
- do not perform broad exploratory edits when the request is narrow
- do not introduce large abstractions unless they materially simplify the codebase
- do not over-document simple changes

## Output and handoff
- Keep handoff concise and specific.
- Default handoff:
  - what changed
  - files changed
  - validation run
  - assumptions or blockers
- Do not include long narrative summaries unless the user asks.