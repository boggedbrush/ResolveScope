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
}

const DEMO_CASES: CaseRow[] = [
  {
    id: "case-001",
    title: "Fleet incident — Vehicle 4821, I-94 westbound",
    domain: "Fleet & Safety",
    status: "in-review",
    priority: "high",
    updatedAt: "2026-03-31",
    evidenceCount: 7,
  },
  {
    id: "case-002",
    title: "Claims triage — Policy #TXA-2291-B",
    domain: "Insurance",
    status: "open",
    priority: "critical",
    updatedAt: "2026-03-30",
    evidenceCount: 3,
  },
  {
    id: "case-003",
    title: "Defect report — Batch QC-0398 seam failure",
    domain: "Quality",
    status: "approved",
    priority: "medium",
    updatedAt: "2026-03-28",
    evidenceCount: 12,
  },
  {
    id: "case-004",
    title: "Site inspection — Tower B, Level 7",
    domain: "Construction",
    status: "open",
    priority: "high",
    updatedAt: "2026-03-27",
    evidenceCount: 9,
  },
  {
    id: "case-005",
    title: "Incident review — Warehouse loading dock",
    domain: "Operations",
    status: "exported",
    priority: "low",
    updatedAt: "2026-03-20",
    evidenceCount: 5,
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
                  <Link to={`/cases/${c.id}`} className="case-table__title-link">
                    {c.title}
                  </Link>
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
