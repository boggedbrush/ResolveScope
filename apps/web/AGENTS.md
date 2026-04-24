## Scope
- Applies to the Vite / React application in `apps/web`.
- Follow the repository root `AGENTS.md` first, then these app-specific rules.
- Check for deeper `AGENTS.md` files before editing nested app areas.

## Product framing
- Treat the app as the primary demo surface for ResolveScope.
- Reinforce one platform story: structured evidence -> review -> approval -> export.
- Keep sponsor examples as workflow templates inside the same platform, not separate products.
- Make human review, traceability, and evidence provenance visible in product surfaces.
- Use spatial, 360, or lightweight 3D views only when they clarify evidence review or case context.

## Frontend workflow
- Use the `frontend-design` skill for landing pages, dashboards, app shell UX, demo pages, spatial presentation, styling, typography, hierarchy, responsiveness, or product-facing copy structure.
- Prefer data-driven rendering from `src/data`, `src/templates`, and shared types over duplicating case content inside components.
- Preserve lazy route loading in `src/App.tsx` unless a change clearly benefits from a different route structure.
- Keep new UI changes accessible by default: semantic controls, visible focus, keyboard reachability, readable contrast, and resilient wrapping.
- Verify both mobile and desktop behavior for meaningful UI changes.

## Design system
- Reuse theme tokens and base utilities from `src/styles.css` before adding new visual primitives.
- Keep light and dark themes coherent when changing global tokens.
- Avoid generic AI-product visuals, neon purple / blue defaults, emojis, fake dashboards, fake metrics, fake testimonials, and fake sponsor logos.
- Do not rely on color alone for status, severity, or approval state.
- Keep page sections and repeated cards visually restrained, credible, and operational.

## Spatial and 3D
- Use existing React Three Fiber, Drei, and Three.js patterns already present in the app.
- Spatial scenes should map to evidence, location, damage, inspection findings, safety zones, or review annotations.
- Keep 3D performant and responsive; avoid decorative objects that do not explain the workflow.
- Respect reduced-motion preferences where practical.

## Implementation
- Keep components typed and scoped to their route, panel, or workflow responsibility.
- Prefer small helper functions and shared types over ad hoc object shapes.
- Do not add frontend dependencies unless they materially improve demo quality or maintainability.
- Keep illustrative data honest: label examples as examples, avoid production claims, and avoid implying real sponsor deployment.

## Validation
- For TypeScript-only app changes, run `npm run typecheck --workspace apps/web`.
- For route, build, asset, or dependency changes, run `npm run build --workspace apps/web`.
- For visual changes, also perform focused manual QA for layout, overflow, CTA visibility, interaction states, and theme behavior.
