import type {
  CaseBundle,
  CaseMeta,
  CaseTemplate,
  EvidenceItem,
  ExtractionResult,
  ReviewState,
  AuditEntry,
  SectionData,
} from "../types/case";

/** Download a JSON case bundle to the user's machine */
export function downloadCaseBundle(
  template: CaseTemplate,
  caseMeta: CaseMeta,
  evidence: EvidenceItem[],
  extraction: ExtractionResult | null,
  review: ReviewState,
  auditLog: AuditEntry[]
): void {
  const bundle: CaseBundle = {
    case: caseMeta,
    template: { id: template.id, label: template.label, domain: template.domain },
    evidence: evidence.map((e) => ({ ...e, previewUrl: undefined })),
    extraction,
    review,
    auditLog,
    exportedAt: new Date().toISOString(),
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
  auditLog: AuditEntry[]
): void {
  const html = buildReportHtml(template, caseMeta, evidence, extraction, review, auditLog);
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

function buildReportHtml(
  template: CaseTemplate,
  caseMeta: CaseMeta,
  evidence: EvidenceItem[],
  extraction: ExtractionResult | null,
  review: ReviewState,
  auditLog: AuditEntry[]
): string {
  const evidenceRows = evidence
    .map(
      (e) =>
        `<tr><td>${e.type.toUpperCase()}</td><td>${e.name}</td><td>${e.uploadedBy}</td><td>${fmt(e.uploadedAt)}</td></tr>`
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
          return `<h2>${def.title}</h2>${renderSectionHtml(data)}`;
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
  td { padding: 8px 8px; border-bottom: 1px solid #f2f0eb; vertical-align: top; }
  .dl-grid { display: grid; grid-template-columns: 160px 1fr; gap: 4px 16px; margin-bottom: 12px; }
  dt { font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: #9c978e; padding-top: 2px; }
  dd { color: #1a1917; }
  p { margin-bottom: 12px; color: #3a3835; }
  ul, ol { padding-left: 20px; margin-bottom: 12px; }
  li { margin-bottom: 6px; }
  .check { color: #2a6b4a; }
  .uncheck { color: #9c978e; }
  .meta-tag { font-size: 11px; color: #6b6962; margin-left: 8px; }
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

${extractionSectionsHtml}

<h2>Review Checklist</h2>
<table>
<tbody>${checklistRows}</tbody>
</table>

${review.summary ? `<h2>${template.reviewFieldLabels.summary}</h2><p>${review.summary}</p>` : ""}
${review.nextSteps ? `<h2>${template.reviewFieldLabels.nextSteps}</h2><p>${review.nextSteps}</p>` : ""}

<h2>Evidence (${evidence.length} items)</h2>
<table>
<thead><tr><th>Type</th><th>Name</th><th>Uploaded by</th><th>Date</th></tr></thead>
<tbody>${evidenceRows}</tbody>
</table>

<h2>Audit Log</h2>
<table>
<thead><tr><th>Timestamp</th><th>Action</th><th>Actor</th><th>Detail</th></tr></thead>
<tbody>${auditRows}</tbody>
</table>

<p style="margin-top:40px;font-size:11px;color:#9c978e;">Generated by ResolveScope — ${fmt(new Date().toISOString())}</p>
</body>
</html>`;
}
