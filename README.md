<div align="center">

<br>

<img src="https://raw.githubusercontent.com/boggedbrush/ResolveScope/main/apps/web/public/favicon.svg" width="64" height="64" alt="ResolveScope" />

<br>

# ResolveScope

### Evidence-to-action infrastructure for claims, safety, inspections, and quality workflows.

<p>
Structured case files. Reviewable decisions. Stakeholder-ready reports.<br>
Built for operational teams that cannot afford to get it wrong.
</p>

<br>

<a href="https://resolvescope.pages.dev"><strong>→ resolvescope.pages.dev — live demo, no login required</strong></a>

<br>

<img alt="Status" src="https://img.shields.io/badge/status-live-16a34a?style=flat-square" />
<img alt="Stack" src="https://img.shields.io/badge/stack-React%2019%20%7C%20TypeScript%20%7C%20Cloudflare-0f172a?style=flat-square" />
<img alt="AI" src="https://img.shields.io/badge/AI-Gemini%20Flash-5B21B6?style=flat-square" />
<img alt="License" src="https://img.shields.io/badge/license-MIT-059669?style=flat-square" />

<br><br>

---

<p><em>Built as an entry for the <strong>OpenAI × Handshake Codex Creator Challenge</strong> — 2026<br>
Developed with Codex as the primary implementation agent, guided by <code>AGENTS.md</code> as the operating contract.</em></p>

---

<br>

</div>

## Live Demo

**[https://resolvescope.pages.dev](https://resolvescope.pages.dev)** — deployed on Cloudflare Pages, no login required.

<br>

<div align="center">

| Route | What you'll see |
|:---|:---|
| [**`/`**](https://resolvescope.pages.dev/) | Landing — product framing and workflow overview |
| [**`/dashboard`**](https://resolvescope.pages.dev/dashboard) | Case dashboard — seeded cases by status, priority, and type |
| [**`/demo/auto-claim`**](https://resolvescope.pages.dev/demo/auto-claim) | Auto claim workspace — evidence, AI extraction, spatial review |
| [**`/demo/fleet-safety`**](https://resolvescope.pages.dev/demo/fleet-safety) | Fleet safety incident workspace |
| [**`/demo/site-inspection`**](https://resolvescope.pages.dev/demo/site-inspection) | Site inspection — field observations, spatial annotation |
| [**`/report/auto-claim`**](https://resolvescope.pages.dev/report/auto-claim) | Stakeholder report — formatted case brief for external review |
| [**`/report/fleet-safety`**](https://resolvescope.pages.dev/report/fleet-safety) | Fleet safety stakeholder report |
| [**`/report/site-inspection`**](https://resolvescope.pages.dev/report/site-inspection) | Site inspection stakeholder report |
| [**`/architecture`**](https://resolvescope.pages.dev/architecture) | Architecture — system design, data model, infrastructure direction |

</div>

<br>

> **Note:** The frontend demo is live. Current demo surfaces run on seeded frontend data. The Workers API, D1, R2, Queues, and Durable Objects layers are part of the architectural direction — not yet deployed.

---

## Suggested Reviewer Flow

Five stops. Start to finish in under ten minutes.

<br>

**Step 1 → [Landing page](https://resolvescope.pages.dev/)**
Product framing, problem statement, and the core workflow at a glance.

**Step 2 → [Case dashboard](https://resolvescope.pages.dev/dashboard)**
The operational view. Browse seeded cases across types, statuses, and priorities.

**Step 3 → [Auto claim workspace](https://resolvescope.pages.dev/demo/auto-claim)**
Open a case. Review evidence, structured AI extraction, and spatial annotation side by side.

**Step 4 → [Stakeholder report](https://resolvescope.pages.dev/report/auto-claim)**
The output. An export-ready case brief formatted for external review.

**Step 5 → [Architecture page](https://resolvescope.pages.dev/architecture)**
The system behind it. Data model, infrastructure direction, and design decisions.

---

## What ResolveScope Is

Operational teams face the same failure mode repeatedly:

> **Important decisions get made from scattered, unstructured evidence.**

The evidence exists — photos, documents, notes, field observations, video — but it lives in email threads, shared drives, and chat. No single record. No clear approval. No audit trail.

ResolveScope is the case-centered workspace that fixes this. Every piece of evidence flows into a structured, reviewable, exportable case file. AI assists with extraction and summarization. Humans approve before anything becomes final.

The core loop is the same regardless of domain:

**Structured intake → AI extraction → human review → export.**

The template layer makes it adaptable without making it generic.

---

## Why It Matters

<div align="center">

| Common approach | The problem | ResolveScope |
|:---|:---|:---|
| Email threads and shared drives | Evidence is scattered, untraceable | Centralized case workspace with linked evidence |
| Manual report writing | Slow, inconsistent, error-prone | AI-assisted extraction and structured field generation |
| Static forms | Rigid intake, no AI leverage | Template-driven workflows with AI extraction and review |
| Flat image review | No spatial context | 360° and spatial annotation built into the review surface |
| One-shot AI summaries | Hard to trust, impossible to verify | Review, edits, approvals, and provenance for every AI output |
| Point tools per workflow | Fragmented handoffs | Single evidence-to-action platform across multiple domains |

</div>

---

## Product Surfaces

- **Evidence intake** — documents, images, video, and field notes into a unified case workspace
- **AI-assisted extraction** — structured fields, timeline construction, summaries, and draft actions
- **Human-in-the-loop review** — every AI output is reviewable and editable before it becomes final
- **Spatial and 360° annotation** — inspectable scenes with evidence pins for field and inspection workflows
- **Stakeholder-ready outputs** — formatted case briefs and shareable report views
- **Template-driven workflows** — the same surface adapts across claims, safety, inspections, and quality review

---

## Documentation

<div align="center">

<table>
<tr>
<th align="left" width="200">Document</th>
<th align="left">Description</th>
</tr>
<tr>
<td><a href="docs/architecture.md"><strong>Architecture</strong></a></td>
<td>System overview, evidence lifecycle, data model, Cloudflare-native infrastructure direction, and current vs. directional implementation status.</td>
</tr>
<tr>
<td><a href="docs/how-it-works.md"><strong>How it works</strong></a></td>
<td>End-to-end flow from intake through extraction, review, spatial annotation, and export. How the seeded demos map to the product story.</td>
</tr>
<tr>
<td><a href="docs/how-i-built-this.md"><strong>How I built this</strong></a></td>
<td>Implementation overview, shaping decisions, tradeoffs, what was scoped out, and where the architecture is real vs. directional.</td>
</tr>
<tr>
<td><a href="docs/prompting-guide.md"><strong>Prompting guide</strong></a></td>
<td>How this repo uses <code>AGENTS.md</code> as an agent operating contract, how tasks are sliced for Codex, token-efficiency tactics, and prompt patterns.</td>
</tr>
<tr>
<td><a href="docs/demo-surfaces.md"><strong>Demo surfaces</strong></a></td>
<td>What each demo surface shows, what it demonstrates, and what it is not claiming. Reference for reviewers navigating the live demo.</td>
</tr>
<tr>
<td><a href="docs/screenshots.md"><strong>Screenshots</strong></a></td>
<td>Capture checklist, recommended viewports, and guidance for adding screenshots to the repo.</td>
</tr>
<tr>
<td><a href="docs/how-to-use-skills.md"><strong>How to use skills</strong></a></td>
<td>How agent skills are discovered, installed, and invoked in this repo — when to let them trigger naturally vs. when to force them explicitly.</td>
</tr>
</table>

</div>

---

## Local Setup

```bash
npm install
npm run dev:web     # start the frontend dev server
npm run typecheck   # type check
npm run build       # build all workspaces
```

Requires Node.js 20+ and npm 10+.

---

## Deployment

The frontend is live at **[resolvescope.pages.dev](https://resolvescope.pages.dev)** on Cloudflare Pages.

The Workers API, D1, R2, Queues, and Durable Objects layers are part of the architectural direction. Current demo surfaces run on seeded frontend data.

---

## License

MIT
