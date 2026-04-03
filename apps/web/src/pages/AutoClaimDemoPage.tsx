import { useState } from "react";
import { Link } from "react-router-dom";
import { EvidencePanel } from "../components/demo/EvidencePanel";
import { ExtractionPanel } from "../components/demo/ExtractionPanel";
import { ReviewPanel } from "../components/demo/ReviewPanel";
import {
  DEMO_CASE_META,
  DEMO_EVIDENCE,
  INITIAL_REVIEW_STATE,
  DEMO_REVIEWER,
} from "../data/demo/autoClaimCase";
import { runMockExtraction } from "../utils/mockExtraction";
import {
  downloadCaseBundle,
  printCaseReport,
} from "../utils/exportCaseBundle";
import type {
  EvidenceItem,
  ExtractionResult,
  ReviewState,
  AuditEntry,
  CaseMeta,
} from "../types/demo";

function makeAuditId(): string {
  return `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function AutoClaimDemoPage() {
  const [caseMeta, setCaseMeta] = useState<CaseMeta>(DEMO_CASE_META);
  const [evidence, setEvidence] = useState<EvidenceItem[]>(DEMO_EVIDENCE);
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [review, setReview] = useState<ReviewState>(INITIAL_REVIEW_STATE);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);

  function appendAudit(
    action: AuditEntry["action"],
    detail?: string
  ): AuditEntry[] {
    const entry: AuditEntry = {
      id: makeAuditId(),
      timestamp: new Date().toISOString(),
      action,
      actor: DEMO_REVIEWER,
      detail,
    };
    const next = [...auditLog, entry];
    setAuditLog(next);
    return next;
  }

  async function handleRunExtraction() {
    setIsExtracting(true);
    try {
      const result = await runMockExtraction();
      setExtraction(result);
      appendAudit("extraction_run", "AI extraction completed successfully");
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

  function handleSave() {
    const parts: string[] = [];
    if (review.summary) parts.push("summary updated");
    if (review.nextSteps) parts.push("next steps updated");
    parts.push(`severity set to ${review.severity}`);
    appendAudit("field_edit", parts.join("; "));
  }

  function handleApprove() {
    setCaseMeta((prev) => ({ ...prev, status: "approved" }));
    appendAudit("case_approved", "Case approved and locked");
  }

  function handleExportJson() {
    const log = appendAudit("report_exported", "JSON bundle downloaded");
    downloadCaseBundle(caseMeta, evidence, extraction, review, log);
  }

  function handleExportReport() {
    const log = appendAudit("report_exported", "HTML report printed");
    printCaseReport(caseMeta, evidence, extraction, review, log);
  }

  return (
    <div className="demo-page">
      {/* Top bar */}
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
            Auto Claim Demo
          </span>
          <Link to="/" className="btn btn--outline demo-topbar__back">
            ← Back to home
          </Link>
        </div>
      </header>

      {/* Three-column workspace */}
      <main className="demo-workspace" aria-label="Case workspace">
        <EvidencePanel
          evidence={evidence}
          onAddEvidence={handleAddEvidence}
          caseId={caseMeta.id}
          caseTitle={caseMeta.title}
          template={caseMeta.template}
          status={caseMeta.status}
          priority={caseMeta.priority}
          severity={caseMeta.severity}
        />

        <ExtractionPanel
          extraction={extraction}
          isRunning={isExtracting}
          onRunExtraction={handleRunExtraction}
          evidence={evidence}
        />

        <ReviewPanel
          review={review}
          auditLog={auditLog}
          caseStatus={caseMeta.status}
          onReviewChange={setReview}
          onSave={handleSave}
          onApprove={handleApprove}
          onExportJson={handleExportJson}
          onExportReport={handleExportReport}
        />
      </main>
    </div>
  );
}
