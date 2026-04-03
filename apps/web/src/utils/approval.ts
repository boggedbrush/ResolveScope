import type {
  CaseTemplate,
  ExtractionResult,
  ReviewState,
  OverrideMap,
} from "../types/case";

const DEFAULT_OVERRIDE_REASON_FIELDS = ["severity"];

export interface ApprovalStatus {
  /** Whether approval is currently permitted */
  allowed: boolean;
  /** Human-readable descriptions of each blocker */
  blockers: string[];
  /** Extraction has been run */
  extractionRun: boolean;
  /** Number of checklist items completed */
  checklistDone: number;
  /** Total checklist items */
  checklistTotal: number;
  /** Number of committed overrides */
  overrideCount: number;
  /** Number of overrides missing a required reason */
  overridesMissingReason: number;
}

/**
 * Evaluates approval gate conditions for a case.
 * Rules are template-configurable; defaults apply when approvalConfig is absent.
 */
export function checkApproval(
  extraction: ExtractionResult | null,
  template: CaseTemplate,
  review: ReviewState,
  overrides: OverrideMap,
  caseStatus: string
): ApprovalStatus {
  const cfg = template.approvalConfig;
  const requireExtraction = cfg?.requireExtraction ?? true;
  const requireAllChecklist = cfg?.requireAllChecklist ?? true;
  const overrideReasonFields =
    cfg?.overrideReasonRequiredFor ?? DEFAULT_OVERRIDE_REASON_FIELDS;

  const blockers: string[] = [];

  // Already approved
  if (caseStatus === "approved") {
    return {
      allowed: false,
      blockers: ["Case is already approved"],
      extractionRun: !!extraction,
      checklistDone: 0,
      checklistTotal: template.checklistItems.length,
      overrideCount: Object.keys(overrides).length,
      overridesMissingReason: 0,
    };
  }

  // Extraction requirement
  const extractionRun = !!extraction;
  if (requireExtraction && !extractionRun) {
    blockers.push("Extraction has not been run");
  }

  // Checklist requirement
  const checklistTotal = template.checklistItems.length;
  const checklistDone = template.checklistItems.filter(
    (item) => !!review.checklist[item.key]
  ).length;

  if (requireAllChecklist && checklistDone < checklistTotal) {
    const remaining = checklistTotal - checklistDone;
    blockers.push(
      `${remaining} checklist item${remaining > 1 ? "s" : ""} not completed`
    );
  }

  // Override reason requirements
  const overrideCount = Object.keys(overrides).length;
  const overridesMissingReason = overrideReasonFields.filter((fieldKey) => {
    const override = overrides[fieldKey];
    return override && !override.reason.trim();
  }).length;

  if (overridesMissingReason > 0) {
    blockers.push(
      `${overridesMissingReason} override${overridesMissingReason > 1 ? "s" : ""} missing a reason`
    );
  }

  return {
    allowed: blockers.length === 0,
    blockers,
    extractionRun,
    checklistDone,
    checklistTotal,
    overrideCount,
    overridesMissingReason,
  };
}
