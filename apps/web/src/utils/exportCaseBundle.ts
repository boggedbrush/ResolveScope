import type {
  CaseBundle,
  CaseMeta,
  CaseTemplate,
  EvidenceItem,
  ExtractionResult,
  ReviewState,
  AuditEntry,
  SectionData,
  OverrideMap,
  SpatialMarker,
} from "../types/case";

/** Download a JSON case bundle to the user's machine */
export function downloadCaseBundle(
  template: CaseTemplate,
  caseMeta: CaseMeta,
  evidence: EvidenceItem[],
  extraction: ExtractionResult | null,
  review: ReviewState,
  overrides: OverrideMap,
  auditLog: AuditEntry[],
  spatialMarkers?: SpatialMarker[]
): void {
  const bundle: CaseBundle = {
    case: caseMeta,
    template: { id: template.id, label: template.label, domain: template.domain },
    evidence: evidence.map((e) => ({ ...e, previewUrl: undefined })),
    extraction,
    review,
    overrides,
    auditLog,
    exportedAt: new Date().toISOString(),
    ...(spatialMarkers && spatialMarkers.length > 0 ? { spatialMarkers } : {}),
  };

  const json = JSON.stringify(bundle, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${caseMeta.id}-case-bundle.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Generate and trigger browser print of an HTML report */
export function printCaseReport(
  template: CaseTemplate,
  caseMeta: CaseMeta,
  evidence: EvidenceItem[],
  extraction: ExtractionResult | null,
  review: ReviewState,
  overrides: OverrideMap,
  auditLog: AuditEntry[],
  spatialMarkers?: SpatialMarker[]
): void {
  const html = buildReportHtml(template, caseMeta, evidence, extraction, review, overrides, auditLog, spatialMarkers);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) {
    win.addEventListener("load", () => {
      win.print();
      URL.revokeObjectURL(url);
    });
  }
}

function fmt(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function renderSectionHtml(data: SectionData): string {
  switch (data.type) {
    case "text":
      return `<p>${data.content}</p>`;
    case "list":
      return `<ul>${data.items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
    case "ordered-list":
      return `<ol>${data.items.map((i) => `<li>${i}</li>`).join("")}</ol>`;
    case "timeline":
      return `<table><thead><tr><th>Time</th><th>Event</th></tr></thead><tbody>${data.entries
        .map((e) => `<tr><td>${e.time}</td><td>${e.event}</td></tr>`)
        .join("")}</tbody></table>`;
    case "parties":
      return `<table><thead><tr><th>Role</th><th>Name</th><th>Contact</th></tr></thead><tbody>${data.parties
        .map((p) => `<tr><td>${p.role}</td><td>${p.name}</td><td>${p.contact ?? "—"}</td></tr>`)
        .join("")}</tbody></table>`;
    case "unit-info":
      return `<dl class="dl-grid">${data.fields
        .map((f) => `<dt>${f.label}</dt><dd>${f.value}</dd>`)
        .join("")}</dl>`;
    case "actions":
      return `<ol>${data.items
        .map(
          (item) =>
            `<li>${item.action}${item.owner ? ` <span class="meta">Owner: ${item.owner}</span>` : ""}${item.due ? ` <span class="meta">Due: ${item.due}</span>` : ""}</li>`
        )
        .join("")}</ol>`;
  }
}

function buildProvenanceAppendix(
  template: CaseTemplate,
  extraction: ExtractionResult,
  evidence: EvidenceItem[]
): string {
  const rows = template.extractionSections
    .map((def) => {
      const provenanceKey = def.provenanceKey ?? def.key;
      const ids = extraction.provenance[provenanceKey] ?? [];
      if (!ids.length) return "";
      const names = ids
        .map((id) => evidence.find((e) => e.id === id)?.name ?? id)
        .join(", ");
      return `<tr><td>${def.title}</td><td>${names}</td></tr>`;
    })
    .join("");

  if (!rows) return "";

  return `
<h2>Provenance Appendix</h2>
<p style="font-size:12px;color:#6b6962;margin-bottom:12px;">Maps each extracted section to the evidence items that supported it.</p>
<table>
<thead><tr><th>Section</th><th>Supporting evidence</th></tr></thead>
<tbody>${rows}</tbody>
</table>`;
}

function buildOverridesSection(
  overrides: OverrideMap,
  fieldLabels: CaseTemplate["reviewFieldLabels"]
): string {
  const entries = Object.values(overrides);
  if (!entries.length) return "";

  const labelMap: Record<string, string> = {
    severity: fieldLabels.severity,
    summary: fieldLabels.summary,
    nextSteps: fieldLabels.nextSteps,
  };

  const rows = entries
    .map((o) => {
      const label = labelMap[o.fieldKey] ?? o.fieldKey;
      return `<tr>
        <td>${label}</td>
        <td>${o.originalValue || "<em>empty</em>"}</td>
        <td><strong>${o.currentValue}</strong></td>
        <td>${o.reason || "<em>no reason provided</em>"}</td>
        <td>${o.actor}</td>
        <td>${fmt(o.timestamp)}</td>
      </tr>`;
    })
    .join("");

  return `
<h2>Reviewer Overrides</h2>
<p style="font-size:12px;color:#6b6962;margin-bottom:12px;">Fields where the reviewer changed the extracted or default value.</p>
<table>
<thead><tr><th>Field</th><th>Original</th><th>Reviewer value</th><th>Reason</th><th>Actor</th><th>Timestamp</th></tr></thead>
<tbody>${rows}</tbody>
</table>`;
}

function buildSpatialMarkersSection(
  markers: SpatialMarker[],
  evidence: EvidenceItem[]
): string {
  if (!markers.length) return "";

  const SEVERITY_LABELS: Record<SpatialMarker["severity"], string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
  };
  const STATUS_LABELS: Record<NonNullable<SpatialMarker["status"]>, string> = {
    open: "Open",
    resolved: "Resolved",
    "needs-review": "Needs Review",
  };

  const rows = markers
    .map((m) => {
      const evidenceNames = m.relatedEvidenceIds
        .map((id) => evidence.find((e) => e.id === id)?.name ?? id)
        .join(", ");
      const status = m.status ? STATUS_LABELS[m.status] : "—";
      return `<tr>
        <td><strong>${m.label}</strong></td>
        <td>${SEVERITY_LABELS[m.severity]}</td>
        <td>${status}</td>
        <td>${m.note}</td>
        <td>${evidenceNames || "—"}</td>
      </tr>`;
    })
    .join("");

  return `
<h2>Spatial Annotations (${markers.length} markers)</h2>
<p style="font-size:12px;color:#6b6962;margin-bottom:12px;">On-site findings linked to specific locations on the inspected structure.</p>
<table>
<thead><tr><th>Finding</th><th>Severity</th><th>Status</th><th>Note</th><th>Supporting evidence</th></tr></thead>
<tbody>${rows}</tbody>
</table>`;
}

function buildReportHtml(
  template: CaseTemplate,
  caseMeta: CaseMeta,
  evidence: EvidenceItem[],
  extraction: ExtractionResult | null,
  review: ReviewState,
  overrides: OverrideMap,
  auditLog: AuditEntry[],
  spatialMarkers?: SpatialMarker[]
): string {
  const evidenceRows = evidence
    .map(
      (e) =>
        `<tr><td>${e.type.toUpperCase()}</td><td>${e.name}</td><td>${e.uploadedBy}</td><td>${fmt(e.uploadedAt)}</td><td>${e.description}</td></tr>`
    )
    .join("");

  const auditRows = auditLog
    .map(
      (a) =>
        `<tr><td>${fmt(a.timestamp)}</td><td>${a.action.replace(/_/g, " ")}</td><td>${a.actor}</td><td>${a.detail ?? ""}</td></tr>`
    )
    .join("");

  const extractionSectionsHtml = extraction
    ? template.extractionSections
        .map((def) => {
          const data = extraction.sections[def.key];
          if (!data) return "";
          const provenanceKey = def.provenanceKey ?? def.key;
          const provenanceIds = extraction.provenance[provenanceKey] ?? [];
          const provenanceNote = provenanceIds.length
            ? `<p class="prov-note">Supported by: ${provenanceIds
                .map((id) => evidence.find((e) => e.id === id)?.name.split("—")[0].trim() ?? id)
                .join(", ")}</p>`
            : "";
          return `<h2>${def.title}</h2>${renderSectionHtml(data)}${provenanceNote}`;
        })
        .join("")
    : "<p><em>Extraction not run.</em></p>";

  const checklistRows = template.checklistItems
    .map(({ key, label }) => {
      const done = !!review.checklist[key];
      return `<tr><td class="${done ? "check" : "uncheck"}">${done ? "✓" : "○"}</td><td>${label}</td></tr>`;
    })
    .join("");

  const subjectLine = caseMeta.subject
    ? `<span>${caseMeta.subject.includes("Driver") ? "Driver" : "Claimant"}: <strong>${caseMeta.subject}</strong></span>`
    : "";
  const unitLine = caseMeta.unit
    ? `<span>Unit/Vehicle: <strong>${caseMeta.unit}</strong></span>`
    : "";

  const approvalLine = caseMeta.status === "approved"
    ? `<div class="approval-stamp">✓ Approved</div>`
    : `<div class="pending-stamp">Pending approval</div>`;

  const overridesHtml = buildOverridesSection(overrides, template.reviewFieldLabels);
  const provenanceAppendix = extraction
    ? buildProvenanceAppendix(template, extraction, evidence)
    : "";
  const spatialMarkersHtml = spatialMarkers && spatialMarkers.length > 0
    ? buildSpatialMarkersSection(spatialMarkers, evidence)
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Case Report — ${caseMeta.id}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Outfit', system-ui, sans-serif; font-size: 13px; line-height: 1.6; color: #1a1917; padding: 40px; max-width: 900px; margin: 0 auto; }
  h1 { font-size: 24px; font-weight: 600; margin-bottom: 4px; }
  h2 { font-size: 14px; font-weight: 600; margin: 28px 0 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #6b6962; border-bottom: 1px solid #e0ddd6; padding-bottom: 6px; }
  .meta { display: flex; gap: 24px; margin-bottom: 32px; flex-wrap: wrap; }
  .meta span { font-size: 12px; color: #6b6962; }
  .meta strong { color: #1a1917; }
  .template-tag { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #b85a30; font-weight: 600; margin-bottom: 16px; display: block; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #9c978e; padding: 6px 8px; border-bottom: 1px solid #e0ddd6; }
  td { padding: 8px 8px; border-bottom: 1px solid #f2f0eb; vertical-align: top; font-size: 12px; }
  .dl-grid { display: grid; grid-template-columns: 160px 1fr; gap: 4px 16px; margin-bottom: 12px; }
  dt { font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: #9c978e; padding-top: 2px; }
  dd { color: #1a1917; }
  p { margin-bottom: 12px; color: #3a3835; }
  ul, ol { padding-left: 20px; margin-bottom: 12px; }
  li { margin-bottom: 6px; }
  .check { color: #2a6b4a; }
  .uncheck { color: #9c978e; }
  .meta-tag { font-size: 11px; color: #6b6962; margin-left: 8px; }
  .prov-note { font-size: 11px; color: #9c978e; font-style: italic; margin-top: 4px; margin-bottom: 0; }
  .approval-stamp { display: inline-block; background: #dceee4; color: #2a6b4a; font-weight: 700; font-size: 13px; padding: 6px 14px; border-radius: 6px; margin-bottom: 24px; }
  .pending-stamp { display: inline-block; background: #f2f0eb; color: #6b6962; font-size: 13px; padding: 6px 14px; border-radius: 6px; margin-bottom: 24px; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<span class="template-tag">${template.label} · ${template.domain}</span>
<h1>${caseMeta.title}</h1>
<div class="meta">
  <span>Case ID: <strong>${caseMeta.id}</strong></span>
  <span>Status: <strong>${caseMeta.status}</strong></span>
  <span>Priority: <strong>${caseMeta.priority}</strong></span>
  <span>${template.reviewFieldLabels.severity}: <strong>${caseMeta.severity}</strong></span>
  <span>Owner: <strong>${caseMeta.owner}</strong></span>
  ${subjectLine}
  ${unitLine}
  <span>Created: <strong>${fmt(caseMeta.createdAt)}</strong></span>
</div>
${approvalLine}

${extractionSectionsHtml}

${spatialMarkersHtml}

<h2>Review Checklist</h2>
<table>
<tbody>${checklistRows}</tbody>
</table>

${review.summary ? `<h2>${template.reviewFieldLabels.summary}</h2><p>${review.summary}</p>` : ""}
${review.nextSteps ? `<h2>${template.reviewFieldLabels.nextSteps}</h2><p>${review.nextSteps}</p>` : ""}

${overridesHtml}

<h2>Evidence (${evidence.length} items)</h2>
<table>
<thead><tr><th>Type</th><th>Name</th><th>Uploaded by</th><th>Date</th><th>Description</th></tr></thead>
<tbody>${evidenceRows}</tbody>
</table>

${provenanceAppendix}

<h2>Audit Log</h2>
<table>
<thead><tr><th>Timestamp</th><th>Action</th><th>Actor</th><th>Detail</th></tr></thead>
<tbody>${auditRows}</tbody>
</table>

<p style="margin-top:40px;font-size:11px;color:#9c978e;">Generated by ResolveScope — ${fmt(new Date().toISOString())}</p>
</body>
</html>`;
}
