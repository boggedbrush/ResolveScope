# Screenshots

Capture checklist and guidance for adding screenshots to the repository or documentation.

---

## Capture checklist

Screenshots should be taken from the live demo at **[resolvescope.pages.dev](https://resolvescope.pages.dev)**.

Recommended viewport: **1440 × 900** or **1280 × 800** for desktop captures.

| Screenshot | Route | What to capture |
|---|---|---|
| Landing hero | `/` | Above the fold : headline, subhead, primary CTA |
| Landing workflow | `/` | Scrolled to the evidence-to-action flow section |
| Dashboard | `/dashboard` | Full case list with status/priority badges visible |
| Workspace : evidence | `/demo/auto-claim` | Evidence panel with items loaded |
| Workspace : extraction | `/demo/auto-claim` | Extraction panel with structured fields populated |
| Workspace : review | `/demo/auto-claim` | Review panel with an override applied |
| Workspace : spatial | `/demo/site-inspection` | Spatial annotation panel with a scene and evidence pins |
| Stakeholder report | `/report/auto-claim` | Full report view, above and below the fold |
| Architecture page | `/architecture` | System diagram and data model section |

---

## Capture notes

- Use a clean browser profile with no extensions that affect rendering
- Capture before any user interaction if you want the default seeded state
- For the spatial panel, ensure the Three.js scene has loaded fully before capturing
- For the report, a two-shot capture (above fold + below fold) is more useful than a full-page scroll screenshot

---

## Adding screenshots to the repo

If adding screenshots for README or docs embeds:

1. Place files in `docs/screenshots/` (create the directory)
2. Use descriptive filenames: `workspace-extraction.png`, `report-view.png`, etc.
3. Prefer PNG for UI screenshots; JPEG for photo-heavy views
4. Keep file sizes reasonable : compress before committing

Embed with relative paths from the file where the image is referenced:

```markdown
![Workspace extraction panel](./screenshots/workspace-extraction.png)
```

---

## Placeholder note

No screenshots are included in the repository yet. This file describes what to capture and where to put it. Do not add broken image links to README or docs files until the screenshot files exist.
