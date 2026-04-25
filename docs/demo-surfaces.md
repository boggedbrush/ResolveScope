# Demo surfaces

A guide to each surface in the live demo, what it shows, and how it fits the product story.

Live demo: **[resolvescope.pages.dev](https://resolvescope.pages.dev)**

---

## Landing page : `/`

**What it is:** Product framing and workflow overview.

**What it demonstrates:**
- The problem statement: important decisions made from scattered, unstructured evidence
- The evidence-to-action loop at a glance
- The template-driven approach across multiple operational domains
- Spatial and 360° review as a product differentiator

**Why it matters:** A recruiter or sponsor who only visits one page should leave understanding what the product does, why it matters, and why it is more credible than scattered files and manual review.

---

## Case dashboard : `/dashboard`

**What it is:** The operational view of all cases.

**What it demonstrates:**
- A case list with status, priority, and type filtering
- The five seeded demo workflows across claims, safety, inspection, quality, and audit review
- Entry point into individual case workspaces and reports

**Why it matters:** Operational teams need to see across all their cases : not just one at a time. The dashboard surface demonstrates the multi-case view without requiring a backend.

---

## Workspace : `/demo/:id`

**What it is:** The core product surface. The full evidence-to-action loop in one view.

Five seeded demos:
- `/demo/auto-claim` : vehicle damage evidence, severity triage
- `/demo/fleet-safety` : driver incident intake, escalation workflow
- `/demo/site-inspection` : field observations, spatial annotation
- `/demo/consumer-quality` : consumer quality complaint, batch evidence, support notes
- `/demo/compliance-audit` : access review audit, missing evidence, follow-up workflow

**What it demonstrates:**
- **Evidence panel** : attached evidence items with type indicators; always visible alongside AI output
- **Extraction panel** : AI-populated structured fields (severity, summary, next steps, template-specific fields)
- **Review panel** : editable fields with override tracking; override reasons logged to audit trail
- **Spatial annotation panel** : 360° or lightweight 3D scene with evidence pins for location-specific findings

**Why it matters:** This is the product. Everything else is framing. A reviewer should be able to open this page and understand the full loop without explanation.

---

## Stakeholder report : `/report/:id`

**What it is:** The output surface. A formatted brief generated from the reviewed case.

Five seeded reports:
- `/report/auto-claim`
- `/report/fleet-safety`
- `/report/site-inspection`
- `/report/consumer-quality`
- `/report/compliance-audit`

**What it demonstrates:**
- Case summary, severity, and key findings in a clean, printable layout
- Evidence reference list with type indicators
- Override log : what the AI said vs. what the reviewer decided
- JSON export from the workspace case bundle
- A shareable, read-only view appropriate for external stakeholders

**Why it matters:** The report is the deliverable. For a claims adjuster, a safety officer, or an inspection team, the report is what actually goes to the next person in the chain. It must be formatted, legible, and defensible.

---

## Architecture page : `/architecture`

**What it is:** An in-app system overview covering the data model, infrastructure direction, and design decisions.

**What it demonstrates:**
- The Cloudflare-native infrastructure target (Pages, Workers, D1, R2, Queues, Durable Objects)
- The evidence lifecycle and data model
- Honest distinction between what is implemented today and what is directional
- The AI provider adapter approach

**Why it matters:** This surface exists for technical reviewers : engineers, architects, challenge judges : who want to see that the infrastructure thinking is coherent, not just the frontend.

---

## What each surface is *not* claiming

- The workspace demo runs on fictional seeded frontend data. There is no live AI inference in the deployed version.
- The backend infrastructure (Workers, D1, R2) is architectural direction : not deployed.
- There is no authentication, persisted file upload, or real-time collaboration in the current build.

The seeded demos are designed to show realistic case state, not to imply a fully operational backend.
