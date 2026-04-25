import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DEMO_SEED_MAP } from "../data/demoResolver";
import { getDemoCaseState, resetAllDemoCaseStates, useDemoStateVersion } from "../data/demoState";
import {
  createLocalCaseId,
  deleteLocalCase,
  loadLocalCases,
  saveLocalCases,
  type LocalCaseRecord,
} from "../data/localCases";
import type { CaseStatus, Priority } from "../types/case";

type CasePriority = Priority;

interface CaseRow {
  id: string;
  title: string;
  template: string;
  domain: string;
  status: CaseStatus;
  priority: CasePriority;
  updatedAt: string;
  evidenceCount: number;
  subject?: string;
  isLocal?: boolean;
  /** If set, links to this path instead of /cases/:id */
  demoPath?: string;
  /** If set, shows a "View report" link */
  reportPath?: string;
}

interface LocalCaseFormState {
  title: string;
  subject: string;
  template: string;
  priority: CasePriority;
}

const DEMO_CASES: CaseRow[] = [
  {
    id: "CLM-2024-00847",
    title: "Parking lot collision : Rivera vehicle",
    template: "Auto Claim Review",
    domain: "Insurance",
    status: "in-review",
    priority: "medium",
    updatedAt: "2025-11-13",
    evidenceCount: 6,
    subject: "Maria Rivera",
    demoPath: "/demo/auto-claim",
    reportPath: "/report/auto-claim",
  },
  {
    id: "FSI-2024-00312",
    title: "Loading dock rear contact : Unit V-183",
    template: "Fleet Safety Incident",
    domain: "Fleet Operations",
    status: "in-review",
    priority: "high",
    updatedAt: "2025-10-29",
    evidenceCount: 6,
    subject: "Darnell Hughes",
    demoPath: "/demo/fleet-safety",
    reportPath: "/report/fleet-safety",
  },
  {
    id: "SIR-2024-00091",
    title: "Exterior facade inspection : Hargrove Building A",
    template: "Site Inspection Report",
    domain: "Property & Facilities",
    status: "in-review",
    priority: "high",
    updatedAt: "2025-11-06",
    evidenceCount: 8,
    subject: "Hargrove Commercial Properties",
    demoPath: "/demo/site-inspection",
    reportPath: "/report/site-inspection",
  },
  {
    id: "CQC-2026-00428",
    title: "Texture complaint : Hydrating Face Cream",
    template: "Consumer Quality Complaint",
    domain: "Consumer Quality",
    status: "in-review",
    priority: "medium",
    updatedAt: "2026-03-19",
    evidenceCount: 6,
    subject: "Jordan Ellis",
    demoPath: "/demo/consumer-quality",
    reportPath: "/report/consumer-quality",
  },
  {
    id: "CAR-2026-00176",
    title: "Access approval evidence review : Vendor workspace",
    template: "Compliance Audit Review",
    domain: "Compliance Operations",
    status: "in-review",
    priority: "high",
    updatedAt: "2026-04-09",
    evidenceCount: 6,
    subject: "Vendor Workspace Access",
    demoPath: "/demo/compliance-audit",
    reportPath: "/report/compliance-audit",
  },
];

const STATUS_LABELS: Record<CaseStatus, string> = {
  open: "Open",
  "in-review": "In review",
  approved: "Approved",
  exported: "Exported",
};

const PRIORITY_LABELS: Record<CasePriority, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const DOMAIN_COLORS: Record<string, string> = {
  Insurance: "copper",
  "Fleet Operations": "forest",
  "Property & Facilities": "slate",
  "Consumer Quality": "forest",
  "Compliance Operations": "slate",
  "Local workspace": "slate",
};

const DESKTOP_WARNING_DISMISSED_KEY = "resolvescope.dashboardDesktopWarningDismissed";

const LOCAL_CASE_TEMPLATES = [
  { label: "General Evidence Review", domain: "Local workspace" },
  { label: "Auto Claim Review", domain: "Insurance" },
  { label: "Fleet Safety Incident", domain: "Fleet Operations" },
  { label: "Site Inspection Report", domain: "Property & Facilities" },
  { label: "Consumer Quality Complaint", domain: "Consumer Quality" },
  { label: "Compliance Audit Review", domain: "Compliance Operations" },
];

const EMPTY_LOCAL_CASE_FORM: LocalCaseFormState = {
  title: "",
  subject: "",
  template: LOCAL_CASE_TEMPLATES[0].label,
  priority: "medium",
};

function displayCaseId(caseId: string): string {
  return caseId.replace("-2024-", "-2026-");
}

export function Dashboard() {
  const navigate = useNavigate();
  const [showDesktopWarning, setShowDesktopWarning] = useState(false);
  const [doNotAskAgain, setDoNotAskAgain] = useState(false);
  const [localCases, setLocalCases] = useState<LocalCaseRecord[]>(() => loadLocalCases());
  const [isCreateCaseOpen, setIsCreateCaseOpen] = useState(false);
  const [casePendingDelete, setCasePendingDelete] = useState<CaseRow | null>(null);
  const [casePendingReport, setCasePendingReport] = useState<CaseRow | null>(null);
  const [localCaseForm, setLocalCaseForm] = useState<LocalCaseFormState>(
    EMPTY_LOCAL_CASE_FORM
  );

  useDemoStateVersion();

  useEffect(() => {
    const hasDismissed =
      window.localStorage.getItem(DESKTOP_WARNING_DISMISSED_KEY) === "true";

    if (hasDismissed) return;

    const mobileQuery = window.matchMedia(
      "(max-width: 767px), (pointer: coarse) and (max-width: 1024px)"
    );

    const updateWarning = () => {
      setShowDesktopWarning(mobileQuery.matches);
    };

    updateWarning();
    mobileQuery.addEventListener("change", updateWarning);

    return () => {
      mobileQuery.removeEventListener("change", updateWarning);
    };
  }, []);

  const rows = [
    ...localCases.map((row) => ({ ...row, isLocal: true })),
    ...DEMO_CASES.map((row) => {
      if (!row.demoPath) return row;
      const demoId = row.demoPath.replace("/demo/", "");
      const seedData = DEMO_SEED_MAP[demoId];
      if (!seedData) return row;

      const state = getDemoCaseState(demoId, seedData);
      return {
        ...row,
        status: state.caseMeta.status,
        updatedAt: state.caseMeta.updatedAt.slice(0, 10),
        evidenceCount: state.evidence.length,
        title: state.caseMeta.title,
        subject: state.caseMeta.subject,
        priority: state.caseMeta.priority,
      };
    }),
  ];

  const activeRows = rows.filter(
    (c) => c.status === "open" || c.status === "in-review"
  );
  const completedRows = rows.filter(
    (c) => c.status === "approved" || c.status === "exported"
  );

  function handleResetAllDemos() {
    resetAllDemoCaseStates(DEMO_SEED_MAP);
  }

  function handleContinueOnMobile() {
    if (doNotAskAgain) {
      window.localStorage.setItem(DESKTOP_WARNING_DISMISSED_KEY, "true");
    }
    setShowDesktopWarning(false);
  }

  function handleReturnFromMobile() {
    navigate("/", { replace: true });
  }

  function handleCreateCase() {
    const title = localCaseForm.title.trim();
    if (!title) return;

    const selectedTemplate =
      LOCAL_CASE_TEMPLATES.find(
        (template) => template.label === localCaseForm.template
      ) ?? LOCAL_CASE_TEMPLATES[0];
    const now = new Date().toISOString();
    const nextCase: LocalCaseRecord = {
      id: createLocalCaseId(),
      title,
      template: selectedTemplate.label,
      domain: selectedTemplate.domain,
      status: "open",
      priority: localCaseForm.priority,
      updatedAt: now.slice(0, 10),
      evidenceCount: 0,
      subject: localCaseForm.subject.trim() || "Local draft",
    };
    const nextCases = [nextCase, ...localCases];
    setLocalCases(nextCases);
    saveLocalCases(nextCases);
    setLocalCaseForm(EMPTY_LOCAL_CASE_FORM);
    setIsCreateCaseOpen(false);
  }

  function handleDeleteLocalCase(caseId: string) {
    deleteLocalCase(caseId);
    setLocalCases((cases) => cases.filter((localCase) => localCase.id !== caseId));
    setCasePendingDelete(null);
  }

  function renderCaseRows(caseRows: CaseRow[]) {
    return caseRows.map((c) => {
      const domainColor = DOMAIN_COLORS[c.domain] ?? "copper";
      return (
        <tr key={c.id}>
          <td>
            <Link
              to={c.demoPath ?? `/cases/${c.id}`}
              className="case-table__title-link"
            >
              {c.title}
            </Link>
            <div className="case-table__sub">
              {displayCaseId(c.id)}
              {c.subject && (
                <span className="case-table__subject">
                  · {c.subject}
                </span>
              )}
              {c.isLocal && (
                <span className="case-table__local-label">
                  Local only
                </span>
              )}
            </div>
          </td>
          <td>
            <div className="case-table__template">
              <span
                className={`case-table__template-name case-table__template-name--${domainColor}`}
              >
                {c.template}
              </span>
              <span className="case-table__domain">{c.domain}</span>
            </div>
          </td>
          <td>
            <span className={`badge badge--priority-${c.priority}`}>
              {PRIORITY_LABELS[c.priority]}
            </span>
          </td>
          <td>
            <span className={`badge badge--status-${c.status}`}>
              {STATUS_LABELS[c.status]}
            </span>
          </td>
          <td className="case-table__evidence-count">
            {c.evidenceCount}
          </td>
          <td className="case-table__date">{c.updatedAt}</td>
          <td className="case-table__actions">
            {c.isLocal ? (
              <button
                type="button"
                className="case-table__delete-button"
                onClick={() => setCasePendingDelete(c)}
              >
                Delete
              </button>
            ) : c.reportPath && (
              <Link
                to={c.reportPath}
                className="case-table__report-link"
                onClick={(event) => {
                  if (c.status === "approved" || c.status === "exported") return;

                  event.preventDefault();
                  setCasePendingReport(c);
                }}
              >
                View report
              </Link>
            )}
          </td>
        </tr>
      );
    });
  }

  return (
    <main className="dashboard" aria-labelledby="dashboard-title">
      {showDesktopWarning && (
        <div className="dashboard-mobile-warning" role="dialog" aria-modal="true" aria-labelledby="dashboard-mobile-warning-title">
          <div className="dashboard-mobile-warning__panel">
            <p className="dashboard-mobile-warning__eyebrow">Desktop workspace</p>
            <h2 id="dashboard-mobile-warning-title">
              This dashboard is designed for desktop review.
            </h2>
            <p>
              The workspace uses wide tables, side navigation, and report actions
              that are easier to review on a larger screen. You can continue on
              this device, but some content may require horizontal scanning.
            </p>
            <label className="dashboard-mobile-warning__check">
              <input
                type="checkbox"
                checked={doNotAskAgain}
                onChange={(event) => setDoNotAskAgain(event.target.checked)}
              />
              Do not ask again on this device
            </label>
            <div className="dashboard-mobile-warning__actions">
              <button
                type="button"
                className="btn btn--outline"
                onClick={handleReturnFromMobile}
              >
                Return
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={handleContinueOnMobile}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="dashboard__table-section" id="case-queue">
        <div className="dashboard__header">
          <div>
            <h2 className="dashboard__title">Case queue</h2>
            <p className="dashboard__subtitle">
              {activeRows.length} active {activeRows.length === 1 ? "case" : "cases"}
            </p>
          </div>
          <div className="dashboard__actions">
            <button className="btn btn--outline btn--sm" onClick={handleResetAllDemos}>
              Reset demos
            </button>
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => setIsCreateCaseOpen(true)}
            >
              New case
            </button>
          </div>
        </div>

        <div className="dashboard__table-wrap">
        <table className="case-table">
          <thead>
            <tr>
              <th>Case</th>
              <th>Template</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Evidence</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{renderCaseRows(activeRows)}</tbody>
        </table>
        </div>
      </section>

      <section className="dashboard__table-section dashboard__table-section--completed">
        <div className="dashboard__header">
          <div>
            <h2 className="dashboard__title">Completed cases</h2>
            <p className="dashboard__subtitle">
              {completedRows.length} completed {completedRows.length === 1 ? "case" : "cases"}
            </p>
          </div>
        </div>

        {completedRows.length > 0 ? (
          <div className="dashboard__table-wrap dashboard__table-wrap--completed">
            <table className="case-table">
              <thead>
                <tr>
                  <th>Case</th>
                  <th>Template</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Evidence</th>
                  <th>Updated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{renderCaseRows(completedRows)}</tbody>
            </table>
          </div>
        ) : (
          <div className="dashboard-empty">
            <h3>No completed cases yet</h3>
            <p>
              Approved or exported demo cases will move here after review.
            </p>
          </div>
        )}
      </section>

      {isCreateCaseOpen && (
        <div
          className="local-case-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="local-case-title"
        >
          <form
            className="local-case-modal__panel"
            onSubmit={(event) => {
              event.preventDefault();
              handleCreateCase();
            }}
          >
            <div className="local-case-modal__header">
              <p className="local-case-modal__eyebrow">Local draft</p>
              <h2 id="local-case-title">Create a case on this device</h2>
              <p>
                This case is saved only in this browser. It is not uploaded,
                synced, or shared.
              </p>
            </div>

            <label className="local-case-field">
              <span>Case title</span>
              <input
                value={localCaseForm.title}
                onChange={(event) =>
                  setLocalCaseForm((form) => ({
                    ...form,
                    title: event.target.value,
                  }))
                }
                placeholder="Example: Vendor access packet review"
                required
              />
            </label>

            <label className="local-case-field">
              <span>Subject</span>
              <input
                value={localCaseForm.subject}
                onChange={(event) =>
                  setLocalCaseForm((form) => ({
                    ...form,
                    subject: event.target.value,
                  }))
                }
                placeholder="Person, asset, site, or product"
              />
            </label>

            <div className="local-case-modal__grid">
              <label className="local-case-field">
                <span>Template</span>
                <select
                  value={localCaseForm.template}
                  onChange={(event) =>
                    setLocalCaseForm((form) => ({
                      ...form,
                      template: event.target.value,
                    }))
                  }
                >
                  {LOCAL_CASE_TEMPLATES.map((template) => (
                    <option key={template.label} value={template.label}>
                      {template.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="local-case-field">
                <span>Priority</span>
                <select
                  value={localCaseForm.priority}
                  onChange={(event) =>
                    setLocalCaseForm((form) => ({
                      ...form,
                      priority: event.target.value as CasePriority,
                    }))
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </label>
            </div>

            <div className="local-case-modal__actions">
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setIsCreateCaseOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn--primary">
                Create case
              </button>
            </div>
          </form>
        </div>
      )}

      {casePendingDelete && (
        <div
          className="local-case-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dashboard-local-case-title"
        >
          <div className="local-case-modal__panel local-case-modal__panel--danger">
            <div className="local-case-modal__header">
              <p className="local-case-modal__eyebrow">Delete local case</p>
              <h2 id="delete-dashboard-local-case-title">
                Remove this case from this device?
              </h2>
              <p>
                This deletes the local draft for {casePendingDelete.id}. It
                cannot be recovered from ResolveScope because it was never
                uploaded or synced.
              </p>
            </div>
            <div className="local-case-modal__actions">
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setCasePendingDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn--primary btn--danger"
                onClick={() => handleDeleteLocalCase(casePendingDelete.id)}
              >
                Delete case
              </button>
            </div>
          </div>
        </div>
      )}

      {casePendingReport?.reportPath && (
        <div
          className="local-case-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-warning-title"
        >
          <div className="local-case-modal__panel">
            <div className="local-case-modal__header">
              <p className="local-case-modal__eyebrow">Report not checked off</p>
              <h2 id="report-warning-title">
                You have not checked off this report yet.
              </h2>
              <p>
                The case is still in review, so the stakeholder report may
                include draft fields or unchecked review items.
              </p>
            </div>
            <div className="local-case-modal__actions">
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setCasePendingReport(null)}
              >
                Stay here
              </button>
              <Link
                to={casePendingReport.reportPath}
                className="btn btn--primary"
                onClick={() => setCasePendingReport(null)}
              >
                View draft report
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
