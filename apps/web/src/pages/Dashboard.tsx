import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DEMO_SEED_MAP } from "../data/demoResolver";
import { getDemoCaseState, resetAllDemoCaseStates, useDemoStateVersion } from "../data/demoState";
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
  /** If set, links to this path instead of /cases/:id */
  demoPath?: string;
  /** If set, shows a "View report" link */
  reportPath?: string;
}

const DEMO_CASES: CaseRow[] = [
  {
    id: "CLM-2024-00847",
    title: "Parking lot collision : Rivera vehicle",
    template: "Auto Claim Review",
    domain: "Insurance",
    status: "in-review",
    priority: "medium",
    updatedAt: "2024-11-13",
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
    updatedAt: "2024-10-29",
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
    updatedAt: "2024-11-06",
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
};

const DESKTOP_WARNING_DISMISSED_KEY = "resolvescope.dashboardDesktopWarningDismissed";

function displayCaseId(caseId: string): string {
  return caseId.replace("-2024-", "-2026-");
}

export function Dashboard() {
  const navigate = useNavigate();
  const [showDesktopWarning, setShowDesktopWarning] = useState(false);
  const [doNotAskAgain, setDoNotAskAgain] = useState(false);

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

  const rows = DEMO_CASES.map((row) => {
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
  });

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
            {c.reportPath && (
              <Link
                to={c.reportPath}
                className="case-table__report-link"
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
            <button className="btn btn--primary btn--sm" disabled>
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
    </main>
  );
}
