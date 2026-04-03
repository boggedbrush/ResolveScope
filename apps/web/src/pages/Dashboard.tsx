import { Link } from "react-router-dom";
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
    title: "Parking lot collision — Rivera vehicle",
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
    title: "Loading dock rear contact — Unit V-183",
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
    title: "Exterior facade inspection — Hargrove Building A",
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
};

export function Dashboard() {
  useDemoStateVersion();

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

  const activeCount = rows.filter(
    (c) => c.status === "open" || c.status === "in-review"
  ).length;

  function handleResetAllDemos() {
    resetAllDemoCaseStates(DEMO_SEED_MAP);
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Cases</h1>
          <p className="dashboard__subtitle">
            {rows.length} cases · {activeCount} active
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
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
          <tbody>
            {rows.map((c) => {
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
                      {c.id}
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
                    <span
                      className={`badge badge--status-${c.status.replace("-", "")}`}
                    >
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
