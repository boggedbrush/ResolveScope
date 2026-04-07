import { useParams, Link } from "react-router-dom";

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M13 8H3M3 8L7 4M3 8L7 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CaseWorkspace() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="workspace">
      <div className="workspace__header">
        <Link to="/dashboard" className="workspace__back">
          <BackIcon />
          All cases
        </Link>
        <div className="workspace__header-main">
          <h1 className="workspace__title">Case {id}</h1>
          <span className="badge badge--status-open">Open</span>
        </div>
      </div>

      <div className="workspace__body">
        <div className="workspace__main">
          <section className="workspace__section">
            <h2 className="workspace__section-title">Evidence</h2>
            <div className="workspace__empty">
              <p>No evidence uploaded yet.</p>
              <button className="btn btn--outline btn--sm" disabled>
                Upload evidence
              </button>
            </div>
          </section>

          <section className="workspace__section">
            <h2 className="workspace__section-title">AI extraction</h2>
            <div className="workspace__empty">
              <p>Run extraction after uploading evidence.</p>
              <button className="btn btn--outline btn--sm" disabled>
                Run extraction
              </button>
            </div>
          </section>
        </div>

        <aside className="workspace__sidebar">
          <section className="workspace__section">
            <h2 className="workspace__section-title">Details</h2>
            <dl className="workspace__details">
              <dt>Status</dt>
              <dd><span className="badge badge--status-open">Open</span></dd>
              <dt>Priority</dt>
              <dd><span className="badge badge--priority-high">High</span></dd>
              <dt>Domain</dt>
              <dd>:</dd>
              <dt>Created</dt>
              <dd>:</dd>
              <dt>Owner</dt>
              <dd>:</dd>
            </dl>
          </section>

          <section className="workspace__section">
            <h2 className="workspace__section-title">Timeline</h2>
            <div className="workspace__empty workspace__empty--sm">
              <p>No activity yet.</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
