import { useState } from "react";
import { Link } from "react-router-dom";
import { EvidencePanel } from "../components/demo/EvidencePanel";
import { ExtractionPanel } from "../components/demo/ExtractionPanel";
import { ReviewPanel } from "../components/demo/ReviewPanel";
import { SpatialReviewPanel } from "../components/demo/SpatialReviewPanel";
import { getTemplate } from "../templates/index";
import { runMockExtraction } from "../utils/mockExtraction";
import {
  downloadCaseBundle,
  printCaseReport,
} from "../utils/exportCaseBundle";
import { applyOverride, updateOverrideReason, describeOverrides } from "../utils/reviewOverrides";
import type {
  EvidenceItem,
  ExtractionResult,
  ReviewState,
  AuditEntry,
  CaseMeta,
  SeedCaseData,
  OverrideMap,
} from "../types/case";

interface Props {
  seedData: SeedCaseData;
}

function makeAuditId(): string {
  return `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function WorkspaceDemoPage({ seedData }: Props) {
  const template = getTemplate(seedData.caseMeta.templateId);

  // Original values snapshot — used to detect overrides
  const originalValues: Record<string, string> = {
    severity: seedData.initialReview.severity,
    summary: seedData.initialReview.summary,
    nextSteps: seedData.initialReview.nextSteps,
  };

  const [caseMeta, setCaseMeta] = useState<CaseMeta>(seedData.caseMeta);
  const [evidence, setEvidence] = useState<EvidenceItem[]>(seedData.evidence);
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [review, setReview] = useState<ReviewState>(seedData.initialReview);
  const [overrides, setOverrides] = useState<OverrideMap>({});
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);

  function appendAudit(
    action: AuditEntry["action"],
    detail?: string
  ): AuditEntry[] {
    const entry: AuditEntry = {
      id: makeAuditId(),
      timestamp: new Date().toISOString(),
      action,
      actor: seedData.reviewer,
      detail,
    };
    const next = [...auditLog, entry];
    setAuditLog(next);
    return next;
  }

  async function handleRunExtraction() {
    setIsExtracting(true);
    try {
      const result = await runMockExtraction(seedData.extraction);
      setExtraction(result);
      appendAudit("extraction_run", "Extraction completed successfully");
    } finally {
      setIsExtracting(false);
    }
  }

  function handleAddEvidence(items: EvidenceItem[]) {
    setEvidence((prev) => [...prev, ...items]);
    items.forEach((item) => {
      appendAudit("evidence_added", `Added: ${item.name}`);
    });
  }

  /** Sync override state when a review field value changes. */
  function handleReviewChange(nextReview: ReviewState) {
    setReview(nextReview);

    // Update override map for severity (the primary extracted field)
    const prevOverrides = overrides;
    const nextOverrides = applyOverride(
      prevOverrides,
      "severity",
      originalValues.severity,
      nextReview.severity,
      seedData.reviewer,
      prevOverrides["severity"]?.reason
    );
    if (nextOverrides !== prevOverrides) {
      setOverrides(nextOverrides);
    }
  }

  /** Update just the reason for an existing override without changing the value. */
  function handleOverrideReasonChange(fieldKey: string, reason: string) {
    setOverrides((prev) => updateOverrideReason(prev, fieldKey, reason));
  }

  function handleSave() {
    const parts: string[] = [];
    if (review.summary) parts.push("summary updated");
    if (review.nextSteps) parts.push("next steps updated");
    parts.push(`${template.reviewFieldLabels.severity.toLowerCase()} set to ${review.severity}`);

    const overrideKeys = Object.keys(overrides);
    if (overrideKeys.length > 0) {
      parts.push(`overrides: ${describeOverrides(overrides)}`);
      appendAudit("field_override", parts.join("; "));
    } else {
      appendAudit("field_edit", parts.join("; "));
    }
  }

  function handleApprove() {
    setCaseMeta((prev) => ({ ...prev, status: "approved" }));
    const overrideCount = Object.keys(overrides).length;
    const detail = overrideCount > 0
      ? `Case approved with ${overrideCount} reviewer override${overrideCount > 1 ? "s" : ""}`
      : "Case approved and locked";
    appendAudit("case_approved", detail);
  }

  function handleExportJson() {
    const log = appendAudit("report_exported", "JSON bundle downloaded");
    downloadCaseBundle(template, caseMeta, evidence, extraction, review, overrides, log, seedData.spatialMarkers);
  }

  function handleExportReport() {
    const log = appendAudit("report_exported", "HTML report printed");
    printCaseReport(template, caseMeta, evidence, extraction, review, overrides, log, seedData.spatialMarkers);
  }

  const hasSpatial = (seedData.spatialMarkers ?? []).length > 0;

  return (
    <div className={`demo-page${hasSpatial ? " demo-page--with-spatial" : ""}`}>
      <header className="demo-topbar">
        <div className="demo-topbar__left">
          <Link to="/" className="demo-topbar__logo">
            Resolve<span>Scope</span>
          </Link>
          <span className="demo-topbar__sep" aria-hidden="true">/</span>
          <span className="demo-topbar__breadcrumb">Demo workspace</span>
        </div>
        <div className="demo-topbar__right">
          <span className="demo-topbar__badge section-label">
            {template.label}
          </span>
          <Link to="/dashboard" className="btn btn--outline demo-topbar__back">
            ← Dashboard
          </Link>
        </div>
      </header>

      {hasSpatial && (
        <SpatialReviewPanel
          markers={seedData.spatialMarkers!}
          evidence={evidence}
        />
      )}

      <main className="demo-workspace" aria-label="Case workspace">
        <EvidencePanel
          evidence={evidence}
          onAddEvidence={handleAddEvidence}
          caseId={caseMeta.id}
          caseTitle={caseMeta.title}
          template={template.label}
          status={caseMeta.status}
          priority={caseMeta.priority}
          severity={caseMeta.severity}
          uploadedBy={seedData.reviewer}
        />

        <ExtractionPanel
          extraction={extraction}
          isRunning={isExtracting}
          onRunExtraction={handleRunExtraction}
          evidence={evidence}
          template={template}
        />

        <ReviewPanel
          review={review}
          overrides={overrides}
          originalValues={originalValues}
          auditLog={auditLog}
          caseStatus={caseMeta.status}
          extraction={extraction}
          template={template}
          onReviewChange={handleReviewChange}
          onOverrideReasonChange={handleOverrideReasonChange}
          onSave={handleSave}
          onApprove={handleApprove}
          onExportJson={handleExportJson}
          onExportReport={handleExportReport}
        />
      </main>
    </div>
  );
}
