import { useState } from "react";
import { Link } from "react-router-dom";
import { ApprovalRequirements } from "./ApprovalRequirements";
import { checkApproval } from "../../utils/approval";
import type {
  ReviewState,
  AuditEntry,
  AuditAction,
  CaseTemplate,
  ExtractionResult,
  OverrideMap,
} from "../../types/case";

interface Props {
  review: ReviewState;
  overrides: OverrideMap;
  originalValues: Record<string, string>;
  auditLog: AuditEntry[];
  caseStatus: string;
  extraction: ExtractionResult | null;
  template: CaseTemplate;
  onReviewChange: (r: ReviewState) => void;
  onOverrideReasonChange: (fieldKey: string, reason: string) => void;
  onSave: () => void;
  onApprove: () => void;
  reportPath: string;
  onExportJson: () => void;
}

const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  extraction_run: "Extraction run",
  field_edit: "Fields saved",
  field_override: "Override recorded",
  override_cleared: "Override cleared",
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

function OverrideBadge({ reason }: { reason: string }) {
  return (
    <span
      className={`override-badge ${!reason.trim() ? "override-badge--needs-reason" : ""}`}
      title={reason || "Override reason required"}
    >
      {reason.trim() ? "Overridden" : "Override : reason required"}
    </span>
  );
}

export function ReviewPanel({
  review,
  overrides,
  originalValues,
  auditLog,
  caseStatus,
  extraction,
  template,
  onReviewChange,
  onOverrideReasonChange,
  reportPath,
  onSave,
  onApprove,
  onExportJson,
}: Props) {
  const [showReportWarning, setShowReportWarning] = useState(false);
  const isApproved = caseStatus === "approved";
  const canExport = isApproved && extraction !== null;
  const { reviewFieldLabels } = template;

  const approvalStatus = checkApproval(
    extraction,
    template,
    review,
    overrides,
    caseStatus
  );

  function updateChecklist(key: string, value: boolean) {
    onReviewChange({
      ...review,
      checklist: { ...review.checklist, [key]: value },
    });
  }

  const severityOverride = overrides["severity"];
  const isSeverityOverridden =
    review.severity !== originalValues.severity;

  return (
    <aside className="demo-panel demo-panel--review">
      {/* Review header */}
      <div className="demo-panel__section-header">
        <h3 className="demo-panel__section-title">Review</h3>
        {isApproved && (
          <span className="badge badge--status-approved">Approved</span>
        )}
      </div>

      {/* Review fields */}
      <div className="review-fields">
        {/* Severity / Risk level */}
        <div className="review-field">
          <div className="review-field__label-row">
            <label className="review-field__label" htmlFor="review-severity">
              {reviewFieldLabels.severity}
            </label>
            {isSeverityOverridden && (
              <OverrideBadge reason={severityOverride?.reason ?? ""} />
            )}
          </div>
          <select
            id="review-severity"
            className={`review-field__select ${isSeverityOverridden ? "review-field__select--overridden" : ""}`}
            value={review.severity}
            disabled={isApproved}
            onChange={(e) =>
              onReviewChange({ ...review, severity: e.target.value })
            }
            aria-label={reviewFieldLabels.severity}
          >
            {template.severityOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {isSeverityOverridden && !isApproved && (
            <div className="override-reason">
              <label
                className="override-reason__label"
                htmlFor="override-reason-severity"
              >
                Override reason
                <span className="override-reason__required" aria-hidden="true">
                  *
                </span>
              </label>
              <textarea
                id="override-reason-severity"
                className={`override-reason__input ${!severityOverride?.reason.trim() ? "override-reason__input--empty" : ""}`}
                rows={2}
                placeholder="Why was this assessment overridden?"
                value={severityOverride?.reason ?? ""}
                onChange={(e) =>
                  onOverrideReasonChange("severity", e.target.value)
                }
                aria-label="Override reason for severity"
                aria-required="true"
              />
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="review-field">
          <label className="review-field__label" htmlFor="review-summary">
            {reviewFieldLabels.summary}
          </label>
          <textarea
            id="review-summary"
            className="review-field__textarea"
            rows={4}
            placeholder={template.summaryPlaceholder}
            value={review.summary}
            disabled={isApproved}
            onChange={(e) =>
              onReviewChange({ ...review, summary: e.target.value })
            }
            aria-label={reviewFieldLabels.summary}
          />
        </div>

        {/* Next steps */}
        <div className="review-field">
          <label className="review-field__label" htmlFor="review-next-steps">
            {reviewFieldLabels.nextSteps}
          </label>
          <textarea
            id="review-next-steps"
            className="review-field__textarea"
            rows={3}
            placeholder={template.nextStepsPlaceholder}
            value={review.nextSteps}
            disabled={isApproved}
            onChange={(e) =>
              onReviewChange({ ...review, nextSteps: e.target.value })
            }
            aria-label={reviewFieldLabels.nextSteps}
          />
        </div>
      </div>

      {/* Checklist : driven by template */}
      <div className="review-checklist">
        <h4 className="review-checklist__title">Review checklist</h4>
        {template.checklistItems.map(({ key, label }) => (
          <label key={key} className="review-check">
            <input
              type="checkbox"
              checked={!!review.checklist[key]}
              disabled={isApproved}
              onChange={(e) => updateChecklist(key, e.target.checked)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>

      {/* Approval requirements + trust summary */}
      {!isApproved && (
        <ApprovalRequirements status={approvalStatus} />
      )}

      {/* Actions */}
      <div className="review-actions">
        {!isApproved && (
          <button
            className="btn btn--outline review-actions__save"
            onClick={onSave}
          >
            Save edits
          </button>
        )}
        {!isApproved && (
          <button
            className="btn review-actions__approve"
            onClick={onApprove}
            disabled={!approvalStatus.allowed}
            aria-disabled={!approvalStatus.allowed}
            title={
              approvalStatus.allowed
                ? "Approve this case"
                : approvalStatus.blockers.join("; ")
            }
          >
            Approve case
          </button>
        )}
        <div className="review-actions__export-group">
          <button
            className="btn btn--outline review-actions__export"
            onClick={onExportJson}
            disabled={!canExport}
            aria-disabled={!canExport}
            aria-label="Download approved JSON case bundle"
            title={
              canExport
                ? "Download approved JSON case bundle"
                : extraction === null
                  ? "Run extraction and approve this case before exporting JSON"
                  : "Approve this case before exporting JSON"
            }
          >
            Export JSON
          </button>
          <Link
            to={reportPath}
            className="btn btn--outline review-actions__export"
            aria-label="View stakeholder report"
            onClick={(event) => {
              if (isApproved) return;

              event.preventDefault();
              setShowReportWarning(true);
            }}
          >
            View report
          </Link>
        </div>
      </div>

      {showReportWarning && (
        <div
          className="local-case-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="workspace-report-warning-title"
        >
          <div className="local-case-modal__panel">
            <div className="local-case-modal__header">
              <p className="local-case-modal__eyebrow">Report not checked off</p>
              <h2 id="workspace-report-warning-title">
                You have not checked off this report yet.
              </h2>
              <p>
                This case has not been approved, so the stakeholder report may
                include draft fields or unchecked review items.
              </p>
            </div>
            <div className="local-case-modal__actions">
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setShowReportWarning(false)}
              >
                Stay here
              </button>
              <Link
                to={reportPath}
                className="btn btn--primary"
                onClick={() => setShowReportWarning(false)}
              >
                View draft report
              </Link>
            </div>
          </div>
        </div>
      )}

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
                  <span className="audit-entry__time">
                    {fmtAudit(entry.timestamp)}
                  </span>
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
