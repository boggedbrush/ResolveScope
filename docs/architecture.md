# Architecture

## System overview

ResolveScope is a single-page React application deployed on Cloudflare Pages. The current demo surfaces run on seeded frontend data. The infrastructure layer described below is the architectural direction : the Workers API, D1, R2, Queues, and Durable Objects are not yet deployed.

The frontend is the real artifact here. It demonstrates the complete evidence-to-action loop: intake, extraction, review, spatial annotation, and stakeholder-ready output : all navigable without a backend.

---

## Evidence lifecycle

```
Evidence intake
  → structured extraction (AI-assisted)
    → human review + overrides
      → spatial annotation (optional, field/inspection workflows)
        → stakeholder report (formatted, exportable)
```

Each stage is tracked. Overrides are logged. Nothing becomes final without explicit human approval.

---

## Product surfaces

| Surface | Route | What it shows |
|---|---|---|
| Landing | `/` | Product framing, problem statement, workflow overview |
| Dashboard | `/dashboard` | Case list with status, priority, type filtering |
| Workspace | `/demo/:id` | Evidence panel, AI extraction, review, spatial annotation |
| Report | `/report/:id` | Formatted stakeholder brief, export-ready |
| Architecture | `/architecture` | In-app system overview (see also this doc) |

---

## Current implementation vs. architectural direction

**What is implemented today:**
- Full React + TypeScript SPA
- Template-driven workspace rendering
- Mock AI extraction with structured field output
- Human review with override tracking and audit log
- Spatial/360° annotation panel (Three.js / React Three Fiber)
- Stakeholder report view with JSON export
- Seeded case data for five demo workflows
- Cloudflare Pages deployment

**Architectural direction (not yet deployed):**
- Cloudflare Workers API layer
- Cloudflare D1 : relational storage for cases, templates, audit logs
- Cloudflare R2 : document, image, and video evidence storage
- Cloudflare KV : config, caching, short-lived session state
- Cloudflare Queues : async AI job processing
- Cloudflare Durable Objects : realtime coordinated review sessions
- Provider-agnostic AI adapter with model routing and escalation

---

## Data model summary

**Case** : top-level record. Has a template, status, priority, type, and associated evidence items.

**Evidence item** : a document, image, video clip, or field note linked to a case. Stays visible alongside AI outputs; never hidden.

**Extraction result** : structured fields output by AI extraction. Tied to evidence items. Reviewable and overridable.

**Review state** : the human-edited version of extraction results. Includes override map and audit entries.

**Override** : a named divergence from AI extraction. Logged with reason and reviewer identity.

**Audit entry** : append-only log of significant case actions: extractions, overrides, approvals, exports.

**Template** : defines the field schema, workflow stages, and section layout for a case type.

---

## Cloudflare-native architecture notes

The infrastructure direction is intentionally Cloudflare-native:

- **Pages** : SPA hosting with edge delivery; no additional CDN needed
- **Workers** : stateless API layer at the edge; avoids cold starts common to traditional serverless
- **D1** : SQLite at the edge; appropriate for relational case and audit data without operational overhead
- **R2** : object storage for evidence files; S3-compatible API, no egress fees
- **Queues** : decouples AI extraction from synchronous request handling
- **Durable Objects** : enables per-case coordination for realtime review sessions without external state store

This architecture is chosen for operational simplicity and cost predictability at the scale of an initial deployment : not for maximum scale. The tradeoff is some vendor lock-in, which is acceptable given the workload profile.

---

## Stack

**Frontend**
- React 19 + TypeScript (strict mode)
- React Router v7
- Custom CSS design system (no utility framework)
- React Three Fiber / Three.js : 360° and spatial annotation

**Platform direction**
- Cloudflare Pages, Workers, D1, R2, Queues, Durable Objects

**AI**
- `gemini-flash-lite-latest` : default extraction and summarization
- Provider-agnostic adapter layer designed for model swapping and cost routing
- Escalation path for higher-complexity review tasks

**Tooling**
- npm workspaces monorepo
- Vite
- Wrangler
