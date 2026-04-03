import { Link } from "react-router-dom";

type CaseStatus = "open" | "in-review" | "approved" | "exported";
type CasePriority = "critical" | "high" | "medium" | "low";

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
  const activeCount = DEMO_CASES.filter(
    (c) => c.status === "open" || c.status === "in-review"
  ).length;

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Cases</h1>
          <p className="dashboard__subtitle">
            {DEMO_CASES.length} cases · {activeCount} active
          </p>
        </div>
        <button className="btn btn--primary btn--sm" disabled>
          New case
        </button>
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
            </tr>
          </thead>
          <tbody>
            {DEMO_CASES.map((c) => {
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
