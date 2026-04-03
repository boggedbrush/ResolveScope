# How I built this

## Overview

ResolveScope is a challenge submission built under time pressure with a focus on credibility over completeness. The goal was a polished, navigable frontend that demonstrates a real product loop — not a mockup, not a slide deck.

The working approach: build the smallest version of the real thing, seed it with realistic data, and make every surface reviewable end-to-end. The frontend *is* the product argument.

---

## Shaping decisions

**One platform, not five sponsor demos.**
The challenge has five sponsors with distinct operational domains. The weak approach is to build five disconnected demos. The stronger approach is to show that one platform — same evidence loop, same review surface, same export format — applies across all of them. Templates are the mechanism.

**Seeded data over live inference.**
Building a live AI backend on Cloudflare Workers within the challenge timeline would have meant less time on the parts that matter: the workspace UX, the review surface, the spatial annotation, the report output. Seeded data lets the UI tell the full story without depending on a backend being available at demo time.

**Cloudflare-native infrastructure direction.**
The architectural target is Cloudflare Workers + D1 + R2 + Queues + Durable Objects. This was chosen for operational simplicity, not because it's the only viable option. It's credible and coherent for the workload profile. The infrastructure is *designed* and *directional* — not yet deployed.

**Custom CSS, no utility framework.**
The design system is hand-rolled. This was deliberate: utility frameworks produce generic-looking interfaces, and the product needs to feel premium and credible. The tradeoff is more styling work per component. Worth it for a challenge submission.

**React Three Fiber for spatial annotation.**
360° and spatial review is a genuine product differentiator — not decoration. The workspace includes a spatial panel because field and inspection workflows require spatial context. It's purposeful or it's not there.

---

## Tradeoffs

| Decision | What was traded off |
|---|---|
| Seeded frontend data | No live AI inference in the deployed demo |
| Custom CSS | More per-component styling work |
| Cloudflare-native direction | Some vendor dependency |
| Template-driven workspaces | More upfront data modeling |
| Single monorepo | Some workspace config overhead |

---

## What was intentionally scoped out

- Live AI extraction (the extraction UX is demonstrated with mock output)
- Backend API deployment (Workers, D1, R2 are architectural direction)
- Authentication (demo is public, no login)
- Multi-reviewer concurrent sessions (Durable Objects are directional)
- File upload and storage (R2 is directional)

None of these omissions affect the core product argument. The UI demonstrates the full loop. The infrastructure is coherent and buildable.

---

## Where the architecture is real today vs. directional

**Real today:**
- React SPA with full routing
- Template-driven workspace rendering
- Override tracking with audit log
- Spatial annotation panel
- Stakeholder report generation
- JSON export
- Cloudflare Pages deployment

**Directional:**
- Workers API layer
- D1 relational storage
- R2 evidence file storage
- Queues for async AI jobs
- Durable Objects for realtime coordination
- Live AI provider integration

See [architecture.md](./architecture.md) for the full system design.

---

## Key areas of the repo

| Area | What it is |
|---|---|
| `apps/web/src/pages/` | Page components: Landing, Dashboard, WorkspaceDemo, CaseReport, Architecture |
| `apps/web/src/components/demo/` | Workspace panels: Evidence, Extraction, Review, SpatialReview |
| `apps/web/src/templates/` | Template definitions for each case type |
| `apps/web/src/utils/` | Mock extraction, export bundle, review override logic |
| `apps/web/src/types/` | Shared TypeScript types: Case, EvidenceItem, ExtractionResult, ReviewState |
| `apps/web/src/styles.css` | Custom CSS design system |
