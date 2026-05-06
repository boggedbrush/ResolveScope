import { useEffect, useRef, useState } from "react";
import { OnboardingTutorial, type OnboardingStep } from "../components/OnboardingTutorial";
import { EvidencePanel } from "../components/demo/EvidencePanel";
import { ExtractionPanel } from "../components/demo/ExtractionPanel";
import { ReviewPanel } from "../components/demo/ReviewPanel";
import { SpatialReviewPanel } from "../components/demo/SpatialReviewPanel";
import { getDemoCaseState, resetDemoCaseState, updateDemoCaseState } from "../data/demoState";
import { getTemplate } from "../templates/index";
import { runMockExtraction } from "../utils/mockExtraction";
import { downloadCaseBundle } from "../utils/exportCaseBundle";
import {
  FIRST_DEMO_ONBOARDING_DISMISSED_KEY,
  FIRST_DEMO_REPORT_TOUR_PENDING_KEY,
} from "../utils/onboardingTutorial";
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

const FIRST_DEMO_ONBOARDING_STEPS = [
  {
    label: "Spatial review",
    title: "Spatial Review of current evidence.",
    body: "Click any numbered pin in the 3D scene to inspect where evidence anchors to the incident reconstruction. The tour continues after a pin is selected.",
    targetSelector: "[data-tour='demo-spatial-scene']",
    completionSelector: "[data-tour='demo-spatial-pin']",
    placement: "left" as const,
    primaryLabel: "Waiting for pin click",
    completeOnTargetClick: true,
    requireTargetClick: true,
    padding: 10,
  },
  {
    label: "Pinned evidence",
    title: "Look at the evidence pinned to that point.",
    body: "The side panel connects the selected 3D finding to source files, photos, and notes. This is how the spatial view stays tied to reviewable evidence.",
    targetSelector: "[data-tour='demo-pinned-evidence']",
    placement: "right" as const,
    primaryLabel: "Add more evidence",
    padding: 10,
  },
  {
    label: "Add evidence",
    title: "Add evidence when the case needs more context.",
    body: "Use Add note for reviewer observations or Upload file for new source material. Added evidence stays in the case timeline and audit history.",
    targetSelector: "[data-tour='demo-add-evidence']",
    placement: "right" as const,
    primaryLabel: "Show AI extraction",
    padding: 8,
  },
  {
    label: "Run extraction",
    title: "Run AI extraction from this panel.",
    body: "This panel turns the attached evidence into a structured starting point. Click Run Extraction here to generate the draft case brief.",
    targetSelector: "[data-tour='demo-extraction']",
    primaryTargetSelector: "[data-tour='demo-run-extraction']",
    waitForSelectorBeforeAdvance: "[data-tour-results='demo-extraction-results']",
    placement: "left" as const,
    primaryLabel: "Click run extraction",
    waitingLabel: "Running extraction",
    primaryAction: "click-target" as const,
    requireTargetClick: true,
    padding: 8,
  },
  {
    label: "Read results",
    title: "Read the extracted case brief.",
    body: "Review the generated summary, timeline, findings, recommendations, and provenance before treating the output as decision support.",
    targetSelector: "[data-tour='demo-extraction']",
    placement: "left" as const,
    primaryLabel: "Verify results",
    padding: 10,
  },
  {
    label: "Verify results",
    title: "Verify the result before approval.",
    body: "Check each review item against the evidence, then click Approve case. The tour waits here until that human approval step is complete.",
    targetSelector: "[data-tour='demo-verify-results']",
    completionSelector: "[data-tour='demo-approve-case']",
    placement: "left" as const,
    primaryLabel: "Approve case",
    primaryAction: "click-target" as const,
    primaryTargetSelector: "[data-tour='demo-approve-case']",
    completeOnTargetClick: true,
    padding: 10,
  },
  {
    label: "Print results",
    title: "Print or save the reviewed results.",
    body: "Open the stakeholder report. From that report view, use Print / Save PDF to produce the reviewed handoff.",
    targetSelector: "[data-tour='demo-print-results']",
    placement: "left" as const,
    primaryLabel: "Open report",
    primaryAction: "click-target" as const,
    padding: 8,
  },
];
const SIDEBAR_COLLAPSED_KEY = "resolvescope:sidebar-collapsed";
const SIDEBAR_COLLAPSED_EVENT = "resolvescope:set-sidebar-collapsed";

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
  const extractionRunIdRef = useRef(0);
  const didResetTutorialExtractionRef = useRef(false);
  const [showFirstDemoOnboarding, setShowFirstDemoOnboarding] = useState(
    () =>
      demoId === "auto-claim" &&
      window.localStorage.getItem(FIRST_DEMO_ONBOARDING_DISMISSED_KEY) !== "true"
  );

  const { caseMeta, evidence, extraction, review, overrides, auditLog } = demoState;

  useEffect(() => {
    if (!showFirstDemoOnboarding) return;

    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, "true");
    window.dispatchEvent(
      new CustomEvent(SIDEBAR_COLLAPSED_EVENT, { detail: true })
    );

    const collapseTimer = window.setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent(SIDEBAR_COLLAPSED_EVENT, { detail: true })
      );
    }, 0);

    return () => window.clearTimeout(collapseTimer);
  }, [showFirstDemoOnboarding]);

  useEffect(() => {
    if (didResetTutorialExtractionRef.current) return;
    if (!showFirstDemoOnboarding || demoId !== "auto-claim") return;

    didResetTutorialExtractionRef.current = true;

    if (demoState.extraction === null && !isExtracting) return;

    extractionRunIdRef.current += 1;
    setIsExtracting(false);
    commitDemoState((prev) => {
      if (prev.extraction === null) return prev;

      return {
        ...prev,
        extraction: null,
        caseMeta: touchCaseMeta({
          ...prev.caseMeta,
          status: seedData.caseMeta.status,
        }),
      };
    });
  }, [
    demoId,
    demoState.extraction,
    isExtracting,
    seedData.caseMeta.status,
    showFirstDemoOnboarding,
  ]);

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
    const runId = extractionRunIdRef.current + 1;
    extractionRunIdRef.current = runId;
    setIsExtracting(true);
    try {
      const result = await runMockExtraction(seedData.extraction);
      if (extractionRunIdRef.current !== runId) return;

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
      if (extractionRunIdRef.current === runId) {
        setIsExtracting(false);
      }
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
    extractionRunIdRef.current += 1;
    const resetState = resetDemoCaseState(demoId, seedData);
    setDemoState(resetState);
    setIsExtracting(false);
  }

  function handleDismissFirstDemoOnboarding() {
    window.localStorage.setItem(FIRST_DEMO_ONBOARDING_DISMISSED_KEY, "true");
    setShowFirstDemoOnboarding(false);
  }

  function handleFirstDemoPrimaryAction(step: OnboardingStep) {
    if (step.label !== "Print results") return;

    window.localStorage.setItem(FIRST_DEMO_REPORT_TOUR_PENDING_KEY, "true");
  }

  function handleFirstDemoReportOpen() {
    if (demoId !== "auto-claim" || !showFirstDemoOnboarding) return;

    window.localStorage.setItem(FIRST_DEMO_REPORT_TOUR_PENDING_KEY, "true");
  }

  const hasSpatial = (demoState.spatialMarkers ?? []).length > 0;

  return (
    <div className={`demo-page${hasSpatial ? " demo-page--with-spatial" : ""}`}>
      {showFirstDemoOnboarding && (
        <OnboardingTutorial
          title="Auto claim guided tour"
          steps={FIRST_DEMO_ONBOARDING_STEPS}
          onDismiss={handleDismissFirstDemoOnboarding}
          onBeforePrimaryAction={handleFirstDemoPrimaryAction}
        />
      )}

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
          onReportOpen={handleFirstDemoReportOpen}
        />
      </main>
    </div>
  );
}
