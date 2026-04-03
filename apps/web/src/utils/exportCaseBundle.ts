import type {
  CaseBundle,
  CaseMeta,
  EvidenceItem,
  ExtractionResult,
  ReviewState,
  AuditEntry,
} from "../types/demo";

/** Download a JSON case bundle to the user's machine */
export function downloadCaseBundle(
  caseMeta: CaseMeta,
  evidence: EvidenceItem[],
  extraction: ExtractionResult | null,
  review: ReviewState,
  auditLog: AuditEntry[]
): void {
  const bundle: CaseBundle = {
    case: caseMeta,
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
  caseMeta: CaseMeta,
  evidence: EvidenceItem[],
  extraction: ExtractionResult | null,
  review: ReviewState,
  auditLog: AuditEntry[]
): void {
  const html = buildReportHtml(caseMeta, evidence, extraction, review, auditLog);
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

function buildReportHtml(
  caseMeta: CaseMeta,
  evidence: EvidenceItem[],
  extraction: ExtractionResult | null,
  review: ReviewState,
  auditLog: AuditEntry[]
): string {
  const checklistRows = [
    ["Evidence reviewed", review.checklist.evidenceReviewed],
    ["Timeline verified", review.checklist.timelineVerified],
    ["Severity confirmed", review.checklist.severityConfirmed],
    ["Recommended actions reviewed", review.checklist.actionsReviewed],
  ] as const;

  const evidenceRows = evidence
    .map(
      (e) =>
        `<tr><td>${e.type.toUpperCase()}</td><td>${e.name}</td><td>${e.uploadedBy}</td><td>${fmt(e.uploadedAt)}</td></tr>`
    )
    .join("");

  const timelineRows = extraction
    ? extraction.timeline
        .map((t) => `<tr><td>${t.time}</td><td>${t.event}</td></tr>`)
        .join("")
    : "";

  const auditRows = auditLog
    .map(
      (a) =>
        `<tr><td>${fmt(a.timestamp)}</td><td>${a.action.replace(/_/g, " ")}</td><td>${a.actor}</td><td>${a.detail ?? ""}</td></tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Case Report — ${caseMeta.id}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Outfit', system-ui, sans-serif; font-size: 13px; line-height: 1.6; color: #1a1917; padding: 40px; max-width: 900px; margin: 0 auto; }
  h1 { font-size: 24px; font-weight: 600; margin-bottom: 4px; }
  h2 { font-size: 15px; font-weight: 600; margin: 28px 0 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #6b6962; border-bottom: 1px solid #e0ddd6; padding-bottom: 6px; }
  .meta { display: flex; gap: 24px; margin-bottom: 32px; flex-wrap: wrap; }
  .meta span { font-size: 12px; color: #6b6962; }
  .meta strong { color: #1a1917; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #9c978e; padding: 6px 8px; border-bottom: 1px solid #e0ddd6; }
  td { padding: 8px 8px; border-bottom: 1px solid #f2f0eb; vertical-align: top; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; }
  .badge-open { background: #dceee4; color: #2a6b4a; }
  .badge-approved { background: #dceee4; color: #2a6b4a; }
  .badge-in-review { background: #fff4e0; color: #b06010; }
  p { margin-bottom: 12px; color: #3a3835; }
  ul { padding-left: 20px; margin-bottom: 12px; }
  li { margin-bottom: 6px; }
  .check { color: #2a6b4a; }
  .uncheck { color: #9c978e; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<h1>${caseMeta.title}</h1>
<div class="meta">
  <span>Case ID: <strong>${caseMeta.id}</strong></span>
  <span>Template: <strong>${caseMeta.template}</strong></span>
  <span>Status: <strong>${caseMeta.status}</strong></span>
  <span>Priority: <strong>${caseMeta.priority}</strong></span>
  <span>Severity: <strong>${caseMeta.severity}</strong></span>
  <span>Owner: <strong>${caseMeta.owner}</strong></span>
  <span>Claimant: <strong>${caseMeta.claimant}</strong></span>
  <span>Created: <strong>${fmt(caseMeta.createdAt)}</strong></span>
</div>

${
  extraction
    ? `
<h2>Incident Summary</h2>
<p>${extraction.incidentSummary}</p>

<h2>Timeline</h2>
<table>
<thead><tr><th>Time</th><th>Event</th></tr></thead>
<tbody>${timelineRows}</tbody>
</table>

<h2>Damage Observations</h2>
<ul>${extraction.damageObservations.map((d) => `<li>${d}</li>`).join("")}</ul>

<h2>Severity Assessment</h2>
<p>${extraction.severityAssessment}</p>

<h2>Recommended Next Steps</h2>
<ul>${extraction.recommendedNextSteps.map((s) => `<li>${s}</li>`).join("")}</ul>
`
    : "<p><em>Extraction not run.</em></p>"
}

<h2>Review Checklist</h2>
<table>
<tbody>
${checklistRows
  .map(
    ([label, done]) =>
      `<tr><td class="${done ? "check" : "uncheck"}">${done ? "✓" : "○"}</td><td>${label}</td></tr>`
  )
  .join("")}
</tbody>
</table>

${review.summary ? `<h2>Reviewer Summary</h2><p>${review.summary}</p>` : ""}
${review.nextSteps ? `<h2>Reviewer Next Steps</h2><p>${review.nextSteps}</p>` : ""}

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
