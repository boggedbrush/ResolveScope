import type { ReviewState, AuditEntry, Severity, AuditAction } from "../../types/demo";

interface Props {
  review: ReviewState;
  auditLog: AuditEntry[];
  caseStatus: string;
  onReviewChange: (r: ReviewState) => void;
  onSave: () => void;
  onApprove: () => void;
  onExportJson: () => void;
  onExportReport: () => void;
}

const SEVERITY_OPTIONS: { value: Severity; label: string }[] = [
  { value: "minor", label: "Minor" },
  { value: "moderate", label: "Moderate" },
  { value: "major", label: "Major" },
  { value: "total-loss", label: "Total Loss" },
];

const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  extraction_run: "Extraction run",
  field_edit: "Fields saved",
  case_approved: "Case approved",
  report_exported: "Report exported",
  evidence_added: "Evidence added",
};

function fmtAudit(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ReviewPanel({
  review,
  auditLog,
  caseStatus,
  onReviewChange,
  onSave,
  onApprove,
  onExportJson,
  onExportReport,
}: Props) {
  const isApproved = caseStatus === "approved";

  function updateChecklist(key: keyof ReviewState["checklist"], value: boolean) {
    onReviewChange({
      ...review,
      checklist: { ...review.checklist, [key]: value },
    });
  }

  return (
    <aside className="demo-panel demo-panel--review">
      {/* Review fields */}
      <div className="demo-panel__section-header">
        <h3 className="demo-panel__section-title">Review</h3>
        {isApproved && (
          <span className="badge badge--status-approved">Approved</span>
        )}
      </div>

      <div className="review-fields">
        {/* Severity */}
        <div className="review-field">
          <label className="review-field__label" htmlFor="review-severity">
            Severity
          </label>
          <select
            id="review-severity"
            className="review-field__select"
            value={review.severity}
            disabled={isApproved}
            onChange={(e) =>
              onReviewChange({ ...review, severity: e.target.value as Severity })
            }
            aria-label="Severity assessment"
          >
            {SEVERITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Summary */}
        <div className="review-field">
          <label className="review-field__label" htmlFor="review-summary">
            Reviewer summary
          </label>
          <textarea
            id="review-summary"
            className="review-field__textarea"
            rows={4}
            placeholder="Add your summary or notes…"
            value={review.summary}
            disabled={isApproved}
            onChange={(e) => onReviewChange({ ...review, summary: e.target.value })}
            aria-label="Reviewer summary"
          />
        </div>

        {/* Next steps */}
        <div className="review-field">
          <label className="review-field__label" htmlFor="review-next-steps">
            Next steps
          </label>
          <textarea
            id="review-next-steps"
            className="review-field__textarea"
            rows={3}
            placeholder="Override or supplement recommended next steps…"
            value={review.nextSteps}
            disabled={isApproved}
            onChange={(e) =>
              onReviewChange({ ...review, nextSteps: e.target.value })
            }
            aria-label="Reviewer next steps"
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="review-checklist">
        <h4 className="review-checklist__title">Review checklist</h4>
        {(
          [
            ["evidenceReviewed", "Evidence reviewed"],
            ["timelineVerified", "Timeline verified"],
            ["severityConfirmed", "Severity confirmed"],
            ["actionsReviewed", "Recommended actions reviewed"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="review-check">
            <input
              type="checkbox"
              checked={review.checklist[key]}
              disabled={isApproved}
              onChange={(e) => updateChecklist(key, e.target.checked)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>

      {/* Actions */}
      <div className="review-actions">
        {!isApproved && (
          <button className="btn btn--outline review-actions__save" onClick={onSave}>
            Save edits
          </button>
        )}
        {!isApproved && (
          <button
            className="btn btn--primary review-actions__approve"
            onClick={onApprove}
          >
            Approve case
          </button>
        )}
        <div className="review-actions__export-group">
          <button
            className="btn btn--outline review-actions__export"
            onClick={onExportJson}
            aria-label="Download JSON case bundle"
          >
            Export JSON
          </button>
          <button
            className="btn btn--outline review-actions__export"
            onClick={onExportReport}
            aria-label="Print or save HTML report"
          >
            Print report
          </button>
        </div>
      </div>

      {/* Audit log */}
      <div className="audit-log">
        <h4 className="audit-log__title">
          Audit history
          <span className="demo-panel__count">{auditLog.length}</span>
        </h4>
        {auditLog.length === 0 ? (
          <p className="audit-log__empty">No activity yet.</p>
        ) : (
          <ol className="audit-log__list" aria-label="Audit history">
            {[...auditLog].reverse().map((entry) => (
              <li key={entry.id} className="audit-entry">
                <div className="audit-entry__header">
                  <span className="audit-entry__action">
                    {AUDIT_ACTION_LABELS[entry.action]}
                  </span>
                  <span className="audit-entry__time">{fmtAudit(entry.timestamp)}</span>
                </div>
                <div className="audit-entry__meta">
                  <span className="audit-entry__actor">{entry.actor}</span>
                  {entry.detail && (
                    <span className="audit-entry__detail">{entry.detail}</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </aside>
  );
}
