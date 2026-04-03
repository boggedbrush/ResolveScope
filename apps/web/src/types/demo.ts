/* ═══════════════════════════════════════════
   ResolveScope — Demo / Case types
   ═══════════════════════════════════════════ */

export type CaseStatus = "open" | "in-review" | "approved" | "exported";
export type Priority = "low" | "medium" | "high" | "critical";
export type Severity = "minor" | "moderate" | "major" | "total-loss";
export type EvidenceType = "document" | "image" | "note" | "video";

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  name: string;
  uploadedBy: string;
  uploadedAt: string; // ISO timestamp
  description: string;
  mimeType?: string;
  /** Client-side object URL for uploaded files, or undefined for seeded items */
  previewUrl?: string;
}

export interface CaseMeta {
  id: string;
  title: string;
  template: string;
  status: CaseStatus;
  priority: Priority;
  severity: Severity;
  createdAt: string;
  updatedAt: string;
  owner: string;
  claimant: string;
  vehicle: string;
}

/* ── Extracted structured output ─────────── */

export interface TimelineEntry {
  time: string;
  event: string;
}

export interface Party {
  role: string;
  name: string;
  contact?: string;
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: string;
  vin?: string;
  color: string;
  plate: string;
}

export interface ExtractionResult {
  runAt: string;
  incidentSummary: string;
  timeline: TimelineEntry[];
  parties: Party[];
  vehicle: VehicleInfo;
  damageObservations: string[];
  recommendedNextSteps: string[];
  severityAssessment: string;
  /** Evidence IDs that support each key section */
  provenance: Record<string, string[]>;
}

/* ── Review state ────────────────────────── */

export interface ReviewState {
  severity: Severity;
  summary: string;
  nextSteps: string;
  checklist: {
    evidenceReviewed: boolean;
    timelineVerified: boolean;
    severityConfirmed: boolean;
    actionsReviewed: boolean;
  };
}

/* ── Audit log ───────────────────────────── */

export type AuditAction =
  | "extraction_run"
  | "field_edit"
  | "case_approved"
  | "report_exported"
  | "evidence_added";

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  actor: string;
  detail?: string;
}

/* ── Full case bundle (for export) ──────── */

export interface CaseBundle {
  case: CaseMeta;
  evidence: EvidenceItem[];
  extraction: ExtractionResult | null;
  review: ReviewState;
  auditLog: AuditEntry[];
  exportedAt: string;
}
