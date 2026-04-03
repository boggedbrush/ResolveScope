/* ═══════════════════════════════════════════
   ResolveScope — Template-driven case types
   ═══════════════════════════════════════════ */

export type CaseStatus = "open" | "in-review" | "approved" | "exported";
export type Priority = "low" | "medium" | "high" | "critical";
export type EvidenceType = "document" | "image" | "note" | "video";

export type AuditAction =
  | "extraction_run"
  | "field_edit"
  | "field_override"
  | "override_cleared"
  | "case_approved"
  | "report_exported"
  | "evidence_added";

/* ── Evidence ────────────────────────────── */

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  name: string;
  uploadedBy: string;
  uploadedAt: string; // ISO timestamp
  description: string;
  mimeType?: string;
  /** Client-side object URL for uploaded files */
  previewUrl?: string;
}

/* ── Case metadata (template-neutral) ────── */

export interface CaseMeta {
  id: string;
  title: string;
  templateId: string;
  status: CaseStatus;
  priority: Priority;
  /** Severity value — valid options defined by the active template */
  severity: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  /** Primary subject: claimant name, driver name, etc. */
  subject?: string;
  /** Primary asset: vehicle description, unit number, etc. */
  unit?: string;
}

/* ── Extraction (section-based, template-driven) ── */

export type SectionData =
  | { type: "text"; content: string }
  | { type: "list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "timeline"; entries: { time: string; event: string }[] }
  | { type: "parties"; parties: { role: string; name: string; contact?: string }[] }
  | { type: "unit-info"; fields: { label: string; value: string }[] }
  | { type: "actions"; items: { action: string; owner?: string; due?: string }[] };

export interface ExtractionResult {
  runAt: string;
  sections: Record<string, SectionData>;
  provenance: Record<string, string[]>;
}

/* ── Review ──────────────────────────────── */

export interface ReviewState {
  severity: string;
  summary: string;
  nextSteps: string;
  /** Keyed by ChecklistItemDef.key from the active template */
  checklist: Record<string, boolean>;
}

/* ── Reviewer overrides ───────────────────── */

/**
 * A structured override record created when a reviewer changes an extracted
 * or default field value. Stored keyed by fieldKey in OverrideMap.
 */
export interface ReviewOverride {
  fieldKey: string;
  originalValue: string;
  currentValue: string;
  actor: string;
  timestamp: string;
  /** Required before approval for severity overrides. */
  reason: string;
}

export type OverrideMap = Record<string, ReviewOverride>;

/* ── Audit ───────────────────────────────── */

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  actor: string;
  detail?: string;
}

/* ── Template config ─────────────────────── */

export type ExtractionSectionType =
  | "text"
  | "list"
  | "ordered-list"
  | "timeline"
  | "parties"
  | "unit-info"
  | "actions";

export interface ExtractionSectionDef {
  key: string;
  title: string;
  type: ExtractionSectionType;
  /** Defaults to key if omitted */
  provenanceKey?: string;
  /** Optional label shown in provenance UI (defaults to title) */
  provenanceLabel?: string;
}

export interface ChecklistItemDef {
  key: string;
  label: string;
}

export interface SeverityOptionDef {
  value: string;
  label: string;
}

/**
 * Template-level approval gate configuration.
 * Default logic (requireExtraction + requireAllChecklist) applies when omitted.
 */
export interface ApprovalConfig {
  requireExtraction: boolean;
  requireAllChecklist: boolean;
  /**
   * Field keys whose overrides must have a non-empty reason before approval.
   * Defaults to ["severity"] if not specified.
   */
  overrideReasonRequiredFor?: string[];
}

export interface CaseTemplate {
  id: string;
  label: string;
  domain: string;
  description: string;
  defaultOwner: string;
  extractionSections: ExtractionSectionDef[];
  checklistItems: ChecklistItemDef[];
  severityOptions: SeverityOptionDef[];
  reviewFieldLabels: {
    severity: string;
    summary: string;
    nextSteps: string;
  };
  summaryPlaceholder: string;
  nextStepsPlaceholder: string;
  /** Approval gate rules for this template. Falls back to defaults if omitted. */
  approvalConfig?: ApprovalConfig;
}

/* ── Spatial markers (site inspection, field review) ── */

export type SpatialMarkerSeverity = "low" | "medium" | "high" | "critical";
export type SpatialMarkerStatus = "open" | "resolved" | "needs-review";

export interface SpatialMarker {
  id: string;
  label: string;
  /** Horizontal position as a percentage (0–100) of the image width */
  x: number;
  /** Vertical position as a percentage (0–100) of the image height */
  y: number;
  severity: SpatialMarkerSeverity;
  note: string;
  relatedEvidenceIds: string[];
  /** Optional key into extraction.sections for cross-reference */
  relatedExtractionSectionKey?: string;
  status?: SpatialMarkerStatus;
}

/* ── Seed case bundle (used to initialize demo state) ── */

export interface SeedCaseData {
  caseMeta: CaseMeta;
  evidence: EvidenceItem[];
  /** Pre-seeded extraction — runAt is filled in at runtime */
  extraction: ExtractionResult;
  initialReview: ReviewState;
  reviewer: string;
  /** Optional spatial markers for inspection-type workflows */
  spatialMarkers?: SpatialMarker[];
}

/* ── Export bundle ───────────────────────── */

export interface CaseBundle {
  case: CaseMeta;
  template: Pick<CaseTemplate, "id" | "label" | "domain">;
  evidence: EvidenceItem[];
  extraction: ExtractionResult | null;
  review: ReviewState;
  overrides: OverrideMap;
  auditLog: AuditEntry[];
  exportedAt: string;
  /** Spatial annotation markers, present for inspection workflows */
  spatialMarkers?: SpatialMarker[];
}
