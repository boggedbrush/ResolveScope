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
  - `README.md` — primary product overview and scope framing
  - challenge strategy / sponsor research files if present
  - future nested `AGENTS.md` files for subsystem-specific rules
  - installed skills discovered in project or runtime skill directories
- If project files conflict with vague assumptions, prefer the project files.

## Startup routine
- Before meaningful changes:
  1. read the request carefully
  2. identify likely relevant files and directories
  3. check for nested `AGENTS.md` files affecting those paths
  4. check for relevant installed skills
  5. if no local skill clearly fits and the task is specialized, use `find-skills` when available before proceeding from generic reasoning alone
  6. read only the minimum set of files needed to understand the task
  7. form a concrete plan proportional to task size
  8. execute in small, verifiable steps
  9. validate the result
- For trivial one-line edits, keep the routine lightweight, but still check for scoped instructions and relevant skills.

## Skills
- Actively check for relevant skills before substantial work.
- Skill discovery order:
  1. `.agents/skills/*/SKILL.md`
  2. repository-level or workspace-level skill directories documented by the project
  3. runtime-provided or tool-provided skill directories if the environment supports them
- If a relevant skill exists, use it. Do not ignore an applicable skill and proceed from generic reasoning alone.
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
  - 3D or visual presentation work in the frontend
- Use `frontend-design` before making frontend design decisions.
- If multiple skills are relevant:
  - use the narrowest relevant skill first
  - compose skills when helpful
  - avoid loading irrelevant skills into context
  - mention in the summary which skills materially guided the work
- If `find-skills` is available, use it when:
  - no installed local skill clearly covers the task
  - the task is specialized enough that a reusable ecosystem skill likely exists
  - the user asks whether a skill exists, asks to add a skill, or asks for help finding one
- `find-skills` workflow:
  - check local project skills first
  - if no clear match exists, use `find-skills` to search the broader skill ecosystem
  - prefer reputable, well-installed skills over obscure ones when recommending additions
  - if the environment and user instructions allow installation, install only the most relevant skill rather than many marginal ones
  - after adding a new skill, use it only if it is actually relevant to the task at hand
- If a specialized skill seems like it should exist but none is available:
  - proceed carefully using repository conventions and best judgment
  - do not invent nonexistent skill instructions
  - keep the implementation conservative

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
  - check for relevant skills
  - use `frontend-design` for frontend-related work when available
  - keep context usage efficient
  - avoid generic AI-product output
  - stay honest about scope and implementation status
  - validate changes where possible
  - leave the repository in a cleaner, more credible state than it started

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
  - no generic “AI-themed” visual clichés
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
  - stop researching once you have enough to make a grounded decision
- When the task involves current APIs, model names, framework behavior, vendor guidance, or challenge details, verify them before relying on memory.

### Repository hygiene
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
- Be aggressively efficient with context.
- Do:
  - inspect structure before opening files
  - use search, globbing, and directory inspection before reading large files
  - read only relevant sections of long files first
  - reuse already gathered context instead of rereading unchanged files
  - keep plans concise
  - keep diffs focused
  - stop researching once there is enough information to execute safely
- Do not:
  - dump large files into context without need
  - reread the same long file repeatedly
  - scan generated files or lockfiles unless necessary
  - perform broad exploratory edits when the request is narrow
  - introduce large abstractions unless they materially simplify the codebase
  - over-document simple changes

## Output and handoff
- When finishing a task, summarize briefly:
  - what changed
  - which files changed
  - any assumptions made
  - any validation performed
  - any follow-up risks or limitations worth knowing
- Keep summaries concise and specific.
