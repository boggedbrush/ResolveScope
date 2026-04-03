import { Link } from "react-router-dom";

type CaseStatus = "open" | "in-review" | "approved" | "exported";
type CasePriority = "critical" | "high" | "medium" | "low";

interface CaseRow {
  id: string;
  title: string;
  domain: string;
  status: CaseStatus;
  priority: CasePriority;
  updatedAt: string;
  evidenceCount: number;
  /** If set, links to this path instead of /cases/:id */
  demoPath?: string;
}

const DEMO_CASES: CaseRow[] = [
  {
    id: "demo-auto-claim",
    title: "Parking lot collision — Rivera vehicle",
    domain: "Insurance",
    status: "in-review",
    priority: "medium",
    updatedAt: "2024-11-13",
    evidenceCount: 6,
    demoPath: "/demo/auto-claim",
  },
];

const STATUS_LABELS: Record<CaseStatus, string> = {
  "open": "Open",
  "in-review": "In review",
  "approved": "Approved",
  "exported": "Exported",
};

const PRIORITY_LABELS: Record<CasePriority, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Cases</h1>
          <p className="dashboard__subtitle">
            {DEMO_CASES.length} cases · {DEMO_CASES.filter((c) => c.status === "open" || c.status === "in-review").length} active
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
              <th>Domain</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Evidence</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_CASES.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link
                    to={c.demoPath ?? `/cases/${c.id}`}
                    className="case-table__title-link"
                  >
                    {c.title}
                  </Link>
                  {c.demoPath && (
                    <span className="case-table__demo-tag">Live demo</span>
                  )}
                </td>
                <td>
                  <span className="case-table__domain">{c.domain}</span>
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
                <td className="case-table__evidence-count">{c.evidenceCount}</td>
                <td className="case-table__date">{c.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
