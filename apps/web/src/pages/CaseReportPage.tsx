import { useParams, Link } from "react-router-dom";
import { resolveDemoCase } from "../data/demoResolver";
import { getTemplate } from "../templates/index";
import type {
  SectionData,
  EvidenceItem,
  SpatialMarker,
  CaseTemplate,
  ExtractionResult,
} from "../types/case";

/* ── Helpers ───────────────────────────────────────────────── */

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function fmtDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  "in-review": "In Review",
  approved: "Approved",
  exported: "Exported",
};

const PRIORITY_LABELS: Record<string, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const SEVERITY_MARKER_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const MARKER_STATUS_LABELS: Record<string, string> = {
  open: "Open",
  resolved: "Resolved",
  "needs-review": "Needs review",
};

/* ── Section renderers ─────────────────────────────────────── */

function SectionContent({ data }: { data: SectionData }) {
  switch (data.type) {
    case "text":
      return <p className="report-section__text">{data.content}</p>;

    case "list":
      return (
        <ul className="report-section__list">
          {data.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );

    case "ordered-list":
      return (
        <ol className="report-section__list report-section__list--ordered">
          {data.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );

    case "timeline":
      return (
        <ol className="report-timeline">
          {data.entries.map((entry, i) => (
            <li key={i} className="report-timeline__entry">
              <span className="report-timeline__time">{entry.time}</span>
              <span className="report-timeline__event">{entry.event}</span>
            </li>
          ))}
        </ol>
      );

    case "parties":
      return (
        <div className="report-parties">
          {data.parties.map((p, i) => (
            <div key={i} className="report-party">
              <span className="report-party__role">{p.role}</span>
              <span className="report-party__name">{p.name}</span>
              {p.contact && (
                <span className="report-party__contact">{p.contact}</span>
              )}
            </div>
          ))}
        </div>
      );

    case "unit-info":
      return (
        <dl className="report-unit-info">
          {data.fields.map((f, i) => (
            <div key={i} className="report-unit-info__row">
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      );

    case "actions":
      return (
        <ol className="report-actions-list">
          {data.items.map((item, i) => (
            <li key={i} className="report-action-item">
              <span className="report-action-item__text">{item.action}</span>
              {(item.owner || item.due) && (
                <span className="report-action-item__meta">
                  {item.owner && <span>Owner: {item.owner}</span>}
                  {item.due && <span>Due: {item.due}</span>}
                </span>
              )}
            </li>
          ))}
        </ol>
      );

    default:
      return null;
  }
}

/* ── Provenance note ───────────────────────────────────────── */

function ProvenanceNote({
  ids,
  evidence,
}: {
  ids: string[];
  evidence: EvidenceItem[];
}) {
  if (!ids.length) return null;
  const names = ids
    .map((id) => {
      const ev = evidence.find((e) => e.id === id);
      return ev ? ev.name.split("—")[0].trim() : id;
    })
    .join(", ");
  return (
    <p className="report-provenance-note">
      <span className="report-provenance-note__label">Sources:</span> {names}
    </p>
  );
}

/* ── Spatial findings section ──────────────────────────────── */

function SpatialFindingsSection({
  markers,
  evidence,
}: {
  markers: SpatialMarker[];
  evidence: EvidenceItem[];
}) {
  const openCount = markers.filter((m) => m.status === "open").length;
  const highCount = markers.filter(
    (m) => m.severity === "high" || m.severity === "critical"
  ).length;

  return (
    <div className="report-section">
      <div className="report-section__header">
        <span className="report-section__label">Spatial findings</span>
        <h2 className="report-section__title">On-Site Annotations</h2>
        <div className="report-spatial-summary">
          <span className="report-spatial-summary__chip report-spatial-summary__chip--open">
            {openCount} open
          </span>
          <span className="report-spatial-summary__chip report-spatial-summary__chip--high">
            {highCount} high/critical
          </span>
          <span className="report-spatial-summary__chip">
            {markers.length} total
          </span>
        </div>
      </div>

      <div className="report-spatial-grid">
        {markers.map((marker) => {
          const relatedNames = marker.relatedEvidenceIds
            .map((id) => evidence.find((e) => e.id === id)?.name ?? id)
            .join(", ");
          return (
            <div
              key={marker.id}
              className={`report-spatial-card report-spatial-card--${marker.severity}`}
            >
              <div className="report-spatial-card__header">
                <div className="report-spatial-card__title-row">
                  <span
                    className={`report-spatial-card__severity report-spatial-card__severity--${marker.severity}`}
                  >
                    {SEVERITY_MARKER_LABELS[marker.severity]}
                  </span>
                  {marker.status && (
                    <span
                      className={`report-spatial-card__status report-spatial-card__status--${marker.status}`}
                    >
                      {MARKER_STATUS_LABELS[marker.status]}
                    </span>
                  )}
                </div>
                <h3 className="report-spatial-card__label">{marker.label}</h3>
              </div>
              <p className="report-spatial-card__note">{marker.note}</p>
              {relatedNames && (
                <p className="report-spatial-card__evidence">
                  <span className="report-spatial-card__evidence-label">
                    Evidence:
                  </span>{" "}
                  {relatedNames}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Evidence section ──────────────────────────────────────── */

const EVIDENCE_TYPE_ICONS: Record<string, string> = {
  image: "◼",
  document: "▤",
  note: "✎",
  video: "▶",
};

function EvidenceSection({ evidence }: { evidence: EvidenceItem[] }) {
  return (
    <div className="report-section">
      <div className="report-section__header">
        <span className="report-section__label">Evidence</span>
        <h2 className="report-section__title">
          Evidence Items
          <span className="report-section__count">{evidence.length}</span>
        </h2>
      </div>
      <div className="report-evidence-list">
        {evidence.map((item) => (
          <div key={item.id} className="report-evidence-item">
            <div className="report-evidence-item__icon">
              <span
                className={`report-evidence-item__type-icon report-evidence-item__type-icon--${item.type}`}
                aria-label={item.type}
              >
                {EVIDENCE_TYPE_ICONS[item.type] ?? "●"}
              </span>
            </div>
            <div className="report-evidence-item__body">
              <div className="report-evidence-item__header-row">
                <span className="report-evidence-item__name">{item.name}</span>
                <span className="report-evidence-item__date">
                  {fmtDateTime(item.uploadedAt)}
                </span>
              </div>
              <p className="report-evidence-item__desc">{item.description}</p>
              <span className="report-evidence-item__by">
                Uploaded by {item.uploadedBy}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Provenance appendix ───────────────────────────────────── */

function ProvenanceAppendix({
  template,
  extraction,
  evidence,
}: {
  template: CaseTemplate;
  extraction: ExtractionResult;
  evidence: EvidenceItem[];
}) {
  const rows = template.extractionSections.filter((def) => {
    const key = def.provenanceKey ?? def.key;
    return (extraction.provenance[key] ?? []).length > 0;
  });

  if (!rows.length) return null;

  return (
    <div className="report-section report-section--appendix">
      <div className="report-section__header">
        <span className="report-section__label">Appendix</span>
        <h2 className="report-section__title">Extraction Provenance</h2>
        <p className="report-section__subtitle">
          Supporting evidence references for each extracted section.
        </p>
      </div>
      <table className="report-provenance-table">
        <thead>
          <tr>
            <th>Section</th>
            <th>Supporting evidence</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((def) => {
            const key = def.provenanceKey ?? def.key;
            const ids = extraction.provenance[key] ?? [];
            const names = ids
              .map((id) => evidence.find((e) => e.id === id)?.name ?? id)
              .join(", ");
            return (
              <tr key={def.key}>
                <td>{def.title}</td>
                <td>{names}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────── */

export function CaseReportPage() {
  const { demoId } = useParams<{ demoId: string }>();
  const seedData = demoId ? resolveDemoCase(demoId) : null;

  if (!seedData) {
    return (
      <div className="report-not-found">
        <p className="report-not-found__title">Report not found</p>
        <p className="report-not-found__sub">
          No demo case matched <code>{demoId}</code>.
        </p>
        <Link to="/dashboard" className="btn btn--outline">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const template = getTemplate(seedData.caseMeta.templateId);
  const { caseMeta, evidence, extraction, initialReview, reviewer, spatialMarkers } =
    seedData;

  const hasSpatial = (spatialMarkers ?? []).length > 0;
  const isApproved = caseMeta.status === "approved";

  const completedChecklist = Object.values(initialReview.checklist).filter(
    Boolean
  ).length;
  const totalChecklist = template.checklistItems.length;

  return (
    <div className="report-page">
      {/* ── Top bar ── */}
      <header className="report-topbar">
        <div className="report-topbar__left">
          <Link to="/" className="report-topbar__logo">
            Resolve<span>Scope</span>
          </Link>
          <span className="report-topbar__sep" aria-hidden="true">/</span>
          <span className="report-topbar__breadcrumb">Case Report</span>
        </div>
        <div className="report-topbar__right">
          <span className="section-label report-topbar__template">
            {template.label}
          </span>
          <Link
            to={`/demo/${demoId}`}
            className="btn btn--outline btn--sm report-topbar__btn"
          >
            Open workspace
          </Link>
          <button
            className="btn btn--primary btn--sm report-topbar__btn"
            onClick={() => window.print()}
          >
            Print / Save PDF
          </button>
        </div>
      </header>

      {/* ── Report body ── */}
      <main className="report-body" aria-label="Case report">
        {/* ── Document header ── */}
        <div className="report-header">
          <div className="report-header__eyebrow">
            <span className="report-header__domain-tag">
              {template.domain}
            </span>
            <span className="report-header__template-tag">
              {template.label}
            </span>
          </div>

          <h1 className="report-header__title">{caseMeta.title}</h1>

          <div className="report-header__meta">
            <div className="report-header__meta-row">
              <div className="report-meta-item">
                <span className="report-meta-item__label">Case ID</span>
                <span className="report-meta-item__value report-meta-item__value--mono">
                  {caseMeta.id}
                </span>
              </div>
              <div className="report-meta-item">
                <span className="report-meta-item__label">Status</span>
                <span
                  className={`badge badge--status-${caseMeta.status.replace("-", "")}`}
                >
                  {STATUS_LABELS[caseMeta.status] ?? caseMeta.status}
                </span>
              </div>
              <div className="report-meta-item">
                <span className="report-meta-item__label">Priority</span>
                <span
                  className={`badge badge--priority-${caseMeta.priority}`}
                >
                  {PRIORITY_LABELS[caseMeta.priority] ?? caseMeta.priority}
                </span>
              </div>
              <div className="report-meta-item">
                <span className="report-meta-item__label">
                  {template.reviewFieldLabels.severity}
                </span>
                <span className="report-meta-item__value report-meta-item__value--severity">
                  {caseMeta.severity.charAt(0).toUpperCase() +
                    caseMeta.severity.slice(1)}
                </span>
              </div>
            </div>

            <div className="report-header__meta-row report-header__meta-row--secondary">
              <div className="report-meta-item">
                <span className="report-meta-item__label">Owner</span>
                <span className="report-meta-item__value">{caseMeta.owner}</span>
              </div>
              {caseMeta.subject && (
                <div className="report-meta-item">
                  <span className="report-meta-item__label">Subject</span>
                  <span className="report-meta-item__value">
                    {caseMeta.subject}
                  </span>
                </div>
              )}
              {caseMeta.unit && (
                <div className="report-meta-item">
                  <span className="report-meta-item__label">Unit / Asset</span>
                  <span className="report-meta-item__value">{caseMeta.unit}</span>
                </div>
              )}
              <div className="report-meta-item">
                <span className="report-meta-item__label">Created</span>
                <span className="report-meta-item__value">
                  {fmtDate(caseMeta.createdAt)}
                </span>
              </div>
              <div className="report-meta-item">
                <span className="report-meta-item__label">Last updated</span>
                <span className="report-meta-item__value">
                  {fmtDate(caseMeta.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          {isApproved ? (
            <div className="report-approval-stamp report-approval-stamp--approved">
              <span className="report-approval-stamp__icon" aria-hidden="true">
                ✓
              </span>
              Case Approved
            </div>
          ) : (
            <div className="report-approval-stamp report-approval-stamp--pending">
              Pending approval
            </div>
          )}
        </div>

        <div className="report-divider" aria-hidden="true" />

        {/* ── Extraction sections ── */}
        <div className="report-sections">
          {template.extractionSections.map((def) => {
            const data = extraction.sections[def.key];
            if (!data) return null;
            const provenanceKey = def.provenanceKey ?? def.key;
            const provenanceIds = extraction.provenance[provenanceKey] ?? [];

            return (
              <div key={def.key} className="report-section">
                <div className="report-section__header">
                  <span className="report-section__label">
                    {template.label}
                  </span>
                  <h2 className="report-section__title">{def.title}</h2>
                </div>
                <SectionContent data={data} />
                <ProvenanceNote ids={provenanceIds} evidence={evidence} />
              </div>
            );
          })}
        </div>

        {/* ── Spatial findings ── */}
        {hasSpatial && (
          <>
            <div className="report-divider" aria-hidden="true" />
            <SpatialFindingsSection
              markers={spatialMarkers!}
              evidence={evidence}
            />
          </>
        )}

        <div className="report-divider" aria-hidden="true" />

        {/* ── Reviewer assessment ── */}
        <div className="report-section report-section--review">
          <div className="report-section__header">
            <span className="report-section__label">Review</span>
            <h2 className="report-section__title">Reviewer Assessment</h2>
          </div>

          <div className="report-review-grid">
            <div className="report-review-field">
              <span className="report-review-field__label">
                {template.reviewFieldLabels.severity}
              </span>
              <span className="report-review-field__value report-review-field__value--severity">
                {initialReview.severity.charAt(0).toUpperCase() +
                  initialReview.severity.slice(1)}
              </span>
            </div>
            <div className="report-review-field">
              <span className="report-review-field__label">Reviewer</span>
              <span className="report-review-field__value">{reviewer}</span>
            </div>
          </div>

          {initialReview.summary ? (
            <div className="report-review-block">
              <h3 className="report-review-block__title">
                {template.reviewFieldLabels.summary}
              </h3>
              <p className="report-review-block__content">
                {initialReview.summary}
              </p>
            </div>
          ) : (
            <p className="report-review-empty">
              No reviewer summary recorded.
            </p>
          )}

          {initialReview.nextSteps && (
            <div className="report-review-block">
              <h3 className="report-review-block__title">
                {template.reviewFieldLabels.nextSteps}
              </h3>
              <p className="report-review-block__content">
                {initialReview.nextSteps}
              </p>
            </div>
          )}

          {/* Checklist */}
          <div className="report-checklist">
            <div className="report-checklist__header">
              <h3 className="report-checklist__title">Review checklist</h3>
              <span className="report-checklist__progress">
                {completedChecklist}/{totalChecklist} completed
              </span>
            </div>
            <div className="report-checklist__items">
              {template.checklistItems.map(({ key, label }) => {
                const done = !!initialReview.checklist[key];
                return (
                  <div
                    key={key}
                    className={`report-checklist-item ${done ? "report-checklist-item--done" : ""}`}
                  >
                    <span
                      className="report-checklist-item__icon"
                      aria-hidden="true"
                    >
                      {done ? "✓" : "○"}
                    </span>
                    <span className="report-checklist-item__label">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="report-divider" aria-hidden="true" />

        {/* ── Evidence ── */}
        <EvidenceSection evidence={evidence} />

        <div className="report-divider" aria-hidden="true" />

        {/* ── Provenance appendix ── */}
        <ProvenanceAppendix
          template={template}
          extraction={extraction}
          evidence={evidence}
        />

        {/* ── Footer ── */}
        <footer className="report-footer">
          <div className="report-footer__brand">
            Resolve<span>Scope</span>
          </div>
          <div className="report-footer__meta">
            <span>
              {caseMeta.id} · {template.label} · {template.domain}
            </span>
            <span>Generated {fmtDateTime(new Date().toISOString())}</span>
          </div>
          <p className="report-footer__note">
            This is a read-only stakeholder report generated from the
            ResolveScope case management system.
          </p>
        </footer>
      </main>
    </div>
  );
}
