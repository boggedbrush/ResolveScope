# How it works

## End-to-end flow

Every case follows the same loop, regardless of domain:

```
Intake → Extraction → Review → (Spatial annotation) → Export
```

**1. Intake**
A case is created with a template : auto claim, fleet safety, site inspection, or custom. Evidence is attached: documents, photos, video clips, field notes. The template defines which fields matter for this case type.

**2. Extraction**
AI reads the attached evidence and populates structured fields: severity, summary, key observations, next steps, and any template-specific fields. Extraction runs against the evidence, not from memory. The raw evidence stays visible alongside the AI output.

**3. Review**
A human reviewer sees the AI-populated fields side by side with the source evidence. Every field can be overridden. Every override is logged with a reason. Nothing is finalized without explicit approval.

**4. Spatial annotation** *(field and inspection workflows)*
For cases involving physical locations : vehicle damage, site defects, inspection findings : a spatial annotation panel lets reviewers pin evidence to a scene. The 360° view or lightweight 3D model shows where on the vehicle, building, or asset each finding originated.

**5. Export**
The approved case generates a stakeholder report: a formatted brief with structured fields, evidence links, the override log, and the audit trail. The same data is available as a JSON bundle for downstream integration.

---

## How seeded demos map to the product story

The live demo runs on seeded frontend data : there is no live AI inference in the deployed version. The seeded data is designed to show realistic case state at each stage of the workflow.

| Demo | Seed state | What it demonstrates |
|---|---|---|
| Auto claim | Evidence attached, extraction complete, one override applied | Full workspace with AI extraction + human correction |
| Fleet safety | Multi-stage handoff, escalation flag | Structured timeline, severity routing |
| Site inspection | Field observations, spatial pins | 360° spatial annotation, punch list generation |

Each demo is accessible from the [dashboard](https://resolvescope.pages.dev/dashboard) or directly via `/demo/:id`. Each has a corresponding stakeholder report at `/report/:id`.

---

## Why the workflow matters operationally

The evidence-to-action loop exists because the alternative : scattered evidence, manual report writing, no audit trail : creates predictable downstream failures:

- Evidence is hard to find after the fact
- Handoffs between submitters and reviewers create gaps
- Reports written from memory are inconsistent
- Decisions are hard to defend when supporting evidence is not linked
- Spatial context (where on a vehicle, a site, a product) is lost entirely

The core product insight is that the workflow is the same across claims, safety incidents, inspections, and quality reviews. The template layer makes it domain-adaptable without making it domain-generic.

---

## Product principles

- **Evidence first** : raw evidence stays visible and linked, never hidden behind AI output
- **Human approval required** : outputs are reviewable and editable before finalization
- **Structured by default** : summaries are useful, but structured fields drive action
- **Template-driven** : the platform adapts across domains without becoming generic
- **Defensible outputs** : every decision is traceable to the evidence that supported it
