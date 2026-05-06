# How to use skills

Practical guide for reviewers and judges on how skills work and how this repo uses them.

---

## What skills are

Skills are reusable capability modules for coding agents. A skill packages specialized guidance : design principles, domain knowledge, workflow rules : into a loadable unit that an agent can invoke when the task warrants it.

Rather than cramming all possible guidance into a single `AGENTS.md`, skills keep expertise modular. A frontend design skill loads when you need visual hierarchy work. A documentation skill loads when you are restructuring docs. Neither loads when you are fixing a type error.

This matters for token efficiency and output quality: guidance loaded at the wrong time adds noise without adding signal.

---

## Discovering and installing skills

The skills ecosystem lives at **[skills.sh](https://skills.sh)**. You can browse available skills, see what each one does, and install what is relevant to your project.

To add a skill to your local agent environment:

```bash
npx skills add <skill-name>
```

To search for skills matching a topic:

```bash
npx skills find <query>
```

Skills install into a local skills directory and become available to agents running in that environment. They do not modify your project code.

> **Note:** `skills.sh` is an independent ecosystem. This repo uses skills from that ecosystem but is not affiliated with or endorsed by skills.sh or OpenAI.

---

## How skills trigger naturally

Skills include metadata : a name, a description, and optionally trigger patterns : that agents use to decide when a skill is relevant. When a task matches a skill's description closely enough, the agent can load and apply it without being explicitly told to.

This works through progressive disclosure:

1. **Lightweight metadata first** : the agent sees skill names and descriptions before loading full instructions
2. **Full instructions on trigger** : the complete skill content is loaded only when the agent decides it is relevant

The `description` field is the most important signal. A well-written description is specific enough that the agent activates the skill on the right tasks and skips it on unrelated ones.

You do not always need to name a skill explicitly in your prompt. For routine, clearly bounded tasks, the agent's natural matching is usually sufficient.

---

## When to let skills trigger naturally

*This is this repo's preferred default for most work.*

Let skills trigger on their own when:

- The task cleanly matches a known skill's stated purpose
- The request is routine and the skill's default activation should be sufficient
- You want to keep the prompt short and let the metadata do the work
- The task is low-stakes enough that minor drift is acceptable

Examples:
- A routine component refactor that might benefit from the `simplify` skill
- A bounded documentation edit where a docs skill might apply
- A standard implementation task that is clearly within scope

---

## When to force-enable or explicitly name a skill

*Use this when quality, consistency, or correctness matters more than prompt brevity.*

Explicitly name a skill in your prompt or task description when:

- The task is high-stakes, fragile, or high-variance
- Design quality matters unusually much (landing pages, hero sections, first impressions)
- Multiple skills could plausibly apply and you want one specific behavior
- You want to enforce a particular workflow discipline
- You want the agent to read the skill before touching anything
- The agent has previously drifted or ignored the intended approach on a similar task

In this repo, `frontend-design` is treated as mandatory for landing pages, marketing pages, dashboards, and any design-system work : regardless of whether the agent would have triggered it naturally.

Example invocation patterns:

```
Use /frontend-design to improve the README hero section.
```

```
Before editing the report layout, read the frontend-design skill and follow its guidance.
```

```
Apply the simplify skill after completing the feature implementation.
```

---

## How this repo uses skills

**`AGENTS.md` is the operating contract.** It defines product understanding, task classes, core rules, and what behavior is expected across all work in this repo. Skills are the modularity layer on top of it.

The specific conventions in this repo:

- **`frontend-design` is mandatory** for all frontend-facing work where visual hierarchy, spacing, typography, or layout is involved. It is declared in `AGENTS.md` and should be invoked before significant frontend changes.
- **Other skills are loaded on demand** : `simplify` after implementations, documentation skills for doc restructuring, etc.
- **Skills keep `AGENTS.md` lean.** Specialized guidance lives in skills, not in the main contract. This reduces context weight for tasks that don't need that guidance.
- **Prompting and skills together form the build system.** `AGENTS.md` sets the rules. Skills carry the expertise. Task prompts define the scope and acceptance criteria. These three layers work together.

### Final SEO closeout

The final project pass used the `seo-audit` skill. It started as a comprehensive audit of the public website and became the closing implementation checklist for search visibility.

That pass focused on route metadata, title tags, canonical URLs, sitemap scope, crawlability, indexability, structured data, keyword alignment, and 404 behavior. It also made the final public story easier to find for searches around ResolveScope, Carleton Lees, Codex, OpenAI, Handshake, the common Handhake misspelling, and the Creator Challenge.

This is a useful pattern for future projects: use product and frontend skills while the experience is still being shaped, then use `seo-audit` as a final quality gate once the site has a stable story to index.

---

## Example usage patterns

**Let a skill trigger naturally:**
> Refactor the evidence panel header to reduce visual clutter. Keep the layout structure. No new dependencies.

_(The agent may apply `simplify` or another relevant skill automatically. That is fine for a bounded, low-stakes refactor.)_

**Force a skill for visual work:**
> Use `/frontend-design` to redesign the hero section. The current version lacks hierarchy. Acceptance criteria: challenge badge visible above the fold, CTA is unmissable, no layout regressions.

**Force a skill when consistency matters:**
> Before editing `Landing.tsx`, load the `frontend-design` skill and follow its spacing and typography guidance. The page should feel consistent with the existing design system.

**Scope skill application explicitly:**
> Apply `/simplify` to the changes in `CaseReportPage.tsx` after the feature is complete. Focus on the new evidence grouping logic : do not touch the export section.

---

## Best practices

- **Prefer the smallest relevant skill set.** One well-chosen skill is better than three partially applicable ones.
- **Avoid over-constraining simple tasks.** Not every two-line fix needs a skill invocation.
- **Force explicit skill usage for fragile or high-variance work.** When the cost of drift is high, name the skill.
- **Read `AGENTS.md` before major changes.** It overrides general best practices for this repo.
- **Use skills for consistency, not ceremony.** The goal is better output, not process compliance.

---

## Relationship to the prompting guide

This document and `docs/prompting-guide.md` are complementary:

- **`how-to-use-skills.md`** : skill selection, discovery, triggering, and activation strategy. When to invoke a skill and why.
- **[prompting-guide.md](prompting-guide.md)** : broader orchestration: how to structure task prompts, how implementation tasks are sliced, token-efficiency tactics, and what stays human-directed.

Read both if you are reviewing the build methodology for the challenge, or if you are here to learn.
