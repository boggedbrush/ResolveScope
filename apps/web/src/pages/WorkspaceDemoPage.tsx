import { useState } from "react";
import { EvidencePanel } from "../components/demo/EvidencePanel";
import { ExtractionPanel } from "../components/demo/ExtractionPanel";
import { ReviewPanel } from "../components/demo/ReviewPanel";
import { SpatialReviewPanel } from "../components/demo/SpatialReviewPanel";
import { getDemoCaseState, resetDemoCaseState, updateDemoCaseState } from "../data/demoState";
import { getTemplate } from "../templates/index";
import { runMockExtraction } from "../utils/mockExtraction";
import { downloadCaseBundle } from "../utils/exportCaseBundle";
import { applyOverride, updateOverrideReason, describeOverrides } from "../utils/reviewOverrides";
import type {
  EvidenceItem,
  ReviewState,
  AuditEntry,
  CaseMeta,
  SeedCaseData,
  DemoCaseState,
} from "../types/case";

interface Props {
  seedData: SeedCaseData;
  demoId: string;
  onDeleteCase?: () => void;
  localCaseLabel?: string;
  topbarLabel?: string;
  showResetDemo?: boolean;
}

function makeAuditId(): string {
  return `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function WorkspaceDemoPage({
  seedData,
  demoId,
  onDeleteCase,
  localCaseLabel,
  topbarLabel,
  showResetDemo = true,
}: Props) {
  const template = getTemplate(seedData.caseMeta.templateId);
  const displayTemplateLabel = topbarLabel ?? template.label;

  // Original values snapshot : used to detect overrides
  const originalValues: Record<string, string> = {
    severity: seedData.initialReview.severity,
    summary: seedData.initialReview.summary,
    nextSteps: seedData.initialReview.nextSteps,
  };

  const [demoState, setDemoState] = useState<DemoCaseState>(() =>
    getDemoCaseState(demoId, seedData)
  );
  const [isExtracting, setIsExtracting] = useState(false);

  const { caseMeta, evidence, extraction, review, overrides, auditLog } = demoState;

  function commitDemoState(updater: (prev: DemoCaseState) => DemoCaseState): DemoCaseState {
    const nextState = updater(demoState);
    setDemoState(nextState);
    updateDemoCaseState(demoId, seedData, () => nextState);
    return nextState;
  }

  function touchCaseMeta(caseMeta: CaseMeta): CaseMeta {
    return { ...caseMeta, updatedAt: new Date().toISOString() };
  }

  function appendAudit(
    state: DemoCaseState,
    action: AuditEntry["action"],
    detail?: string
  ): DemoCaseState {
    const entry: AuditEntry = {
      id: makeAuditId(),
      timestamp: new Date().toISOString(),
      action,
      actor: seedData.reviewer,
      detail,
    };
    return {
      ...state,
      auditLog: [...state.auditLog, entry],
      caseMeta: touchCaseMeta(state.caseMeta),
    };
  }

  async function handleRunExtraction() {
    setIsExtracting(true);
    try {
      const result = await runMockExtraction(seedData.extraction);
      commitDemoState((prev) =>
        appendAudit(
          {
            ...prev,
            extraction: result,
          },
          "extraction_run",
          "Extraction completed successfully"
        )
      );
    } finally {
      setIsExtracting(false);
    }
  }

  function handleAddEvidence(items: EvidenceItem[]) {
    commitDemoState((prev) => {
      const withEvidence: DemoCaseState = {
        ...prev,
        evidence: [...prev.evidence, ...items],
      };

      return items.reduce(
        (acc, item) => appendAudit(acc, "evidence_added", `Added: ${item.name}`),
        withEvidence
      );
    });
  }

  /** Sync override state when a review field value changes. */
  function handleReviewChange(nextReview: ReviewState) {
    commitDemoState((prev) => {
      const nextOverrides = applyOverride(
        prev.overrides,
        "severity",
        originalValues.severity,
        nextReview.severity,
        seedData.reviewer,
        prev.overrides["severity"]?.reason
      );

      return {
        ...prev,
        review: nextReview,
        overrides: nextOverrides,
        caseMeta: touchCaseMeta({ ...prev.caseMeta, severity: nextReview.severity }),
      };
    });
  }

  /** Update just the reason for an existing override without changing the value. */
  function handleOverrideReasonChange(fieldKey: string, reason: string) {
    commitDemoState((prev) => ({
      ...prev,
      overrides: updateOverrideReason(prev.overrides, fieldKey, reason),
      caseMeta: touchCaseMeta(prev.caseMeta),
    }));
  }

  function handleSave() {
    const parts: string[] = [];
    if (review.summary) parts.push("summary updated");
    if (review.nextSteps) parts.push("next steps updated");
    parts.push(`${template.reviewFieldLabels.severity.toLowerCase()} set to ${review.severity}`);

    const overrideKeys = Object.keys(overrides);
    if (overrideKeys.length > 0) {
      parts.push(`overrides: ${describeOverrides(overrides)}`);
      commitDemoState((prev) => appendAudit(prev, "field_override", parts.join("; ")));
    } else {
      commitDemoState((prev) => appendAudit(prev, "field_edit", parts.join("; ")));
    }
  }

  function handleApprove() {
    const overrideCount = Object.keys(demoState.overrides).length;
    const detail = overrideCount > 0
      ? `Case approved with ${overrideCount} reviewer override${overrideCount > 1 ? "s" : ""}`
      : "Case approved and locked";

    commitDemoState((prev) =>
      appendAudit(
        {
          ...prev,
          caseMeta: touchCaseMeta({ ...prev.caseMeta, status: "approved" }),
        },
        "case_approved",
        detail
      )
    );
  }

  function handleExportJson() {
    // Export stays approval-gated so the demo preserves review before handoff.
    if (caseMeta.status !== "approved" || demoState.extraction === null) return;

    const nextState = commitDemoState((prev) =>
      appendAudit(prev, "report_exported", "JSON bundle downloaded")
    );
    downloadCaseBundle(
      template,
      nextState.caseMeta,
      nextState.evidence,
      nextState.extraction,
      nextState.review,
      nextState.overrides,
      nextState.auditLog,
      nextState.spatialMarkers
    );
  }

  function handleResetDemo() {
    const resetState = resetDemoCaseState(demoId, seedData);
    setDemoState(resetState);
    setIsExtracting(false);
  }

  const hasSpatial = (demoState.spatialMarkers ?? []).length > 0;

  return (
    <div className={`demo-page${hasSpatial ? " demo-page--with-spatial" : ""}`}>
      <header className="demo-topbar">
        <div className="demo-topbar__left">
          <span className="demo-topbar__badge section-label">
            {displayTemplateLabel}
          </span>
        </div>
        <div className="demo-topbar__right">
          {localCaseLabel && (
            <span className="demo-topbar__local-label">
              {localCaseLabel}
            </span>
          )}
          {onDeleteCase && (
            <button
              type="button"
              className="btn btn--outline demo-topbar__delete"
              onClick={onDeleteCase}
            >
              Delete case
            </button>
          )}
          {showResetDemo && (
            <button className="btn btn--outline demo-topbar__back" onClick={handleResetDemo}>
              Reset demo
            </button>
          )}
        </div>
      </header>

      {hasSpatial && (
        <SpatialReviewPanel
          markers={demoState.spatialMarkers!}
          evidence={evidence}
          templateId={seedData.caseMeta.templateId}
        />
      )}

      <main className="demo-workspace" aria-label="Case workspace">
        <EvidencePanel
          evidence={evidence}
          onAddEvidence={handleAddEvidence}
          caseId={caseMeta.id}
          caseTitle={caseMeta.title}
          template={displayTemplateLabel}
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
          reportPath={`/report/${demoId}`}
          onSave={handleSave}
          onApprove={handleApprove}
          onExportJson={handleExportJson}
        />
      </main>
    </div>
  );
}
