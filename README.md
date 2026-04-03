<div align="center">

<br>

# ResolveScope

### Evidence-to-action infrastructure for claims, safety, inspections, and quality workflows.

<p>Structured case files. Reviewable decisions. Stakeholder-ready reports.<br>Built for the operational teams that can't afford to get it wrong.</p>

<br>

**[→ resolvescope.pages.dev](https://resolvescope.pages.dev)**

<br>

<img alt="Status" src="https://img.shields.io/badge/status-live-16a34a?style=flat-square" />
<img alt="Stack" src="https://img.shields.io/badge/stack-React%2019%20%7C%20TypeScript%20%7C%20Cloudflare-111827?style=flat-square" />
<img alt="AI" src="https://img.shields.io/badge/AI-gemini--flash--lite-5B21B6?style=flat-square" />
<img alt="License" src="https://img.shields.io/badge/license-MIT-059669?style=flat-square" />

<br><br>

</div>

---

## Live demo

**[https://resolvescope.pages.dev](https://resolvescope.pages.dev)** — deployed on Cloudflare Pages, no login required.

| Route | Surface |
|---|---|
| [`/`](https://resolvescope.pages.dev/) | Landing page |
| [`/dashboard`](https://resolvescope.pages.dev/dashboard) | Case dashboard — seeded cases with status, priority, type |
| [`/demo/auto-claim`](https://resolvescope.pages.dev/demo/auto-claim) | Auto claim workspace — evidence, AI extraction, spatial review |
| [`/demo/fleet-safety`](https://resolvescope.pages.dev/demo/fleet-safety) | Fleet safety incident workspace |
| [`/demo/site-inspection`](https://resolvescope.pages.dev/demo/site-inspection) | Site inspection workspace — field observations, spatial annotation |
| [`/report/auto-claim`](https://resolvescope.pages.dev/report/auto-claim) | Stakeholder report — formatted case brief for external review |
| [`/report/fleet-safety`](https://resolvescope.pages.dev/report/fleet-safety) | Fleet safety stakeholder report |
| [`/report/site-inspection`](https://resolvescope.pages.dev/report/site-inspection) | Site inspection stakeholder report |
| [`/architecture`](https://resolvescope.pages.dev/architecture) | Architecture overview — system design, data model, stack |

---

## Suggested reviewer flow

**1. [Landing page](https://resolvescope.pages.dev/)** — product framing, problem statement, and the workflow at a glance.

**2. [Case dashboard](https://resolvescope.pages.dev/dashboard)** — the operational view. Browse seeded cases across types, statuses, and priorities.

**3. [Auto claim workspace](https://resolvescope.pages.dev/demo/auto-claim)** — open a case. Review evidence, structured AI extraction, and spatial annotation side by side.

**4. [Stakeholder report](https://resolvescope.pages.dev/report/auto-claim)** — the output. An export-ready case brief formatted for external review.

**5. [Architecture page](https://resolvescope.pages.dev/architecture)** — the system behind it. Data model, infrastructure direction, and design decisions.

---

## What ResolveScope is

Operational teams face the same failure mode repeatedly:

> **Important decisions get made from scattered, unstructured evidence.**

The evidence exists — photos, documents, notes, field observations, video — but it lives in email threads, shared drives, and chat. No single record. No clear approval. No audit trail.

ResolveScope is the case-centered workspace that fixes this. Every piece of evidence flows into a structured, reviewable, exportable case file. AI assists with extraction and summarization. Humans approve before anything becomes final.

The core loop is the same regardless of domain: **structured intake → AI extraction → human review → export.** The template layer makes it adaptable without making it generic.

---

## What makes it different

| Common approach | The problem | ResolveScope |
|---|---|---|
| Email threads and shared drives | Evidence is scattered and untraceable | Centralized case workspace with linked evidence |
| Manual report writing | Slow, inconsistent, error-prone | AI-assisted extraction and structured field generation |
| Static forms | Rigid intake, no AI leverage | Template-driven workflows with AI extraction and review |
| Flat image review | No spatial context | 360° and spatial annotation built into the review surface |
| One-shot AI summaries | Hard to trust, impossible to verify | Review, edits, approvals, and provenance for every AI output |
| Point tools per workflow | Fragmented handoffs | Single evidence-to-action platform across multiple domains |

---

## Product surfaces at a glance

- **Evidence intake** — documents, images, video, and field notes into a unified case workspace
- **AI-assisted extraction** — structured fields, timeline construction, summaries, and draft actions
- **Human-in-the-loop review** — every AI output is reviewable and editable before it becomes final
- **Spatial and 360° annotation** — inspectable scenes with evidence pins for field and inspection workflows
- **Stakeholder-ready outputs** — formatted case briefs, JSON bundles, and shareable report views
- **Template-driven workflows** — the same surface adapts across claims, safety, inspections, and quality review

---

## Documentation

<table>
<tr>
<td width="180"><strong><a href="docs/architecture.md">Architecture</a></strong></td>
<td>System overview, evidence lifecycle, data model, Cloudflare-native infrastructure direction, and current vs. directional implementation status.</td>
</tr>
<tr>
<td><strong><a href="docs/how-it-works.md">How it works</a></strong></td>
<td>End-to-end flow from intake through extraction, review, spatial annotation, and export. How the seeded demos map to the product story.</td>
</tr>
<tr>
<td><strong><a href="docs/how-i-built-this.md">How I built this</a></strong></td>
<td>Implementation overview, shaping decisions, tradeoffs, what was intentionally scoped out, and where the architecture is real vs. directional.</td>
</tr>
<tr>
<td><strong><a href="docs/prompting-guide.md">Prompting guide</a></strong></td>
<td>How this repo uses AGENTS.md as an agent operating contract, how implementation tasks are sliced for Codex, token-efficiency tactics, and prompt patterns.</td>
</tr>
<tr>
<td><strong><a href="docs/demo-surfaces.md">Demo surfaces</a></strong></td>
<td>What each demo surface shows, what it demonstrates, and what it is not claiming. Reference for reviewers navigating the live demo.</td>
</tr>
<tr>
<td><strong><a href="docs/screenshots.md">Screenshots</a></strong></td>
<td>Capture checklist, recommended viewports, and guidance for adding screenshots to the repo once taken.</td>
</tr>
</table>

---

## Local setup

```bash
npm install
npm run dev:web     # start the frontend
npm run typecheck   # type check
npm run build       # build all workspaces
```

Requires Node.js 20+ and npm 10+.

---

## Deployment

The frontend is live at **[resolvescope.pages.dev](https://resolvescope.pages.dev)** on Cloudflare Pages.

The Workers API, D1, R2, Queues, and Durable Objects layers are part of the architectural direction. The current demo surfaces run on seeded frontend data.

---

## License

MIT
