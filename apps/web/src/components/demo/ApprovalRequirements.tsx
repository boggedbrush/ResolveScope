import type { ApprovalStatus } from "../../utils/approval";

interface Props {
  status: ApprovalStatus;
}

function CheckIcon({ done }: { done: boolean }) {
  if (done) {
    return (
      <svg
        className="approval-req__icon approval-req__icon--done"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="6.5" fill="#2a6b4a" />
        <path
          d="M4 7l2 2 4-4"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg
      className="approval-req__icon approval-req__icon--pending"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="6.5" stroke="#e0ddd6" strokeWidth="1.5" />
    </svg>
  );
}

export function ApprovalRequirements({ status }: Props) {
  const checklistLabel =
    status.checklistDone === status.checklistTotal
      ? `All ${status.checklistTotal} items checked`
      : `${status.checklistDone} / ${status.checklistTotal} checklist items checked`;

  const overridesLabel =
    status.overrideCount === 0
      ? "No overrides"
      : status.overridesMissingReason === 0
        ? `${status.overrideCount} override${status.overrideCount !== 1 ? "s" : ""} — all have reasons`
        : `${status.overridesMissingReason} override${status.overridesMissingReason !== 1 ? "s" : ""} missing reason`;

  const extractionDone = status.extractionRun;
  const checklistDone = status.checklistDone === status.checklistTotal;
  const overridesDone = status.overridesMissingReason === 0;

  return (
    <div
      className="approval-requirements"
      role="status"
      aria-label="Approval requirements"
    >
      <h4 className="approval-requirements__title">Approval requirements</h4>
      <ul className="approval-req__list" aria-label="Requirement checklist">
        <li className="approval-req__item">
          <CheckIcon done={extractionDone} />
          <span className={extractionDone ? "approval-req__label--done" : "approval-req__label--pending"}>
            Extraction run
          </span>
        </li>
        <li className="approval-req__item">
          <CheckIcon done={checklistDone} />
          <span className={checklistDone ? "approval-req__label--done" : "approval-req__label--pending"}>
            {checklistLabel}
          </span>
        </li>
        <li className="approval-req__item">
          <CheckIcon done={overridesDone} />
          <span className={overridesDone ? "approval-req__label--done" : "approval-req__label--pending"}>
            {overridesLabel}
          </span>
        </li>
      </ul>

      {!status.allowed && status.blockers.length > 0 && (
        <div className="approval-requirements__blockers" role="alert" aria-live="polite">
          {status.blockers.map((b) => (
            <span key={b} className="approval-blocker">
              {b}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
