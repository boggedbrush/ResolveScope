## Scope
- Applies to the shared `@resolvescope/text` package.
- Follow the repository root `AGENTS.md` first, then these package-specific rules.

## Package purpose
- Keep this package focused on deterministic text measurement and layout helpers.
- Treat it as a thin typed layer over `@chenglou/pretext`, not a general formatting or UI package.
- Do not introduce DOM measurement, React dependencies, browser layout reads, or app-specific rendering concerns here.

## Token sync
- Keep exported font strings and line-height constants synchronized with `apps/web/src/styles.css` and any inline font declarations that depend on exact metrics.
- When changing typography tokens in the web app, update this package in the same change if the measured text can be affected.
- Document metric-sensitive constants briefly and concretely.

## Implementation
- Preserve pure functions and stable return shapes.
- Prefer explicit exported constants for shared measurements rather than hidden magic numbers.
- Keep comments focused on why a metric or helper exists, especially when it prevents layout drift.
- Do not add dependencies unless they are necessary for accurate text layout.

## Validation
- For package changes, run `npm run build --workspace apps/web` because the web app consumes this package directly.
- If only comments or package metadata changed, `git diff --check` is sufficient.
