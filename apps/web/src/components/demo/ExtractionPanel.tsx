import type { ExtractionResult, EvidenceItem } from "../../types/demo";

interface Props {
  extraction: ExtractionResult | null;
  isRunning: boolean;
  onRunExtraction: () => void;
  evidence: EvidenceItem[];
}

function fmtRunAt(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function ProvenanceTags({
  ids,
  evidence,
}: {
  ids: string[];
  evidence: EvidenceItem[];
}) {
  const names = ids
    .map((id) => evidence.find((e) => e.id === id)?.name.split("—")[0].trim())
    .filter(Boolean) as string[];
  if (!names.length) return null;
  return (
    <div className="extraction-provenance" aria-label="Supported by">
      <span className="extraction-provenance__label">Supported by:</span>
      {names.map((n) => (
        <span key={n} className="extraction-provenance__tag">
          {n}
        </span>
      ))}
    </div>
  );
}

export function ExtractionPanel({
  extraction,
  isRunning,
  onRunExtraction,
  evidence,
}: Props) {
  if (isRunning) {
    return (
      <div className="demo-panel demo-panel--extraction">
        <div className="extraction-loading" aria-live="polite" aria-busy="true">
          <div className="extraction-loading__spinner" aria-hidden="true" />
          <p className="extraction-loading__label">Running extraction…</p>
          <p className="extraction-loading__sub">
            Analyzing evidence and structuring case brief
          </p>
        </div>
      </div>
    );
  }

  if (!extraction) {
    return (
      <div className="demo-panel demo-panel--extraction">
        <div className="extraction-empty">
          <div className="extraction-empty__icon" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="8" y="6" width="24" height="28" rx="3" stroke="#b85a30" strokeWidth="1.5" />
              <path d="M14 14h12M14 20h12M14 26h8" stroke="#b85a30" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="32" cy="32" r="6" fill="#b85a30" />
              <path d="M32 29v3l2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="extraction-empty__title">Ready to extract</h3>
          <p className="extraction-empty__body">
            Run AI extraction to generate a structured case brief — incident
            summary, timeline, damage observations, and recommended next steps.
          </p>
          <button
            className="btn btn--primary"
            onClick={onRunExtraction}
            aria-label="Run AI extraction on this case"
          >
            Run Extraction
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="demo-panel demo-panel--extraction">
      {/* Header */}
      <div className="demo-panel__section-header">
        <h3 className="demo-panel__section-title">Case Brief</h3>
        <span className="extraction-run-meta">
          Extracted {fmtRunAt(extraction.runAt)}
        </span>
      </div>

      <div className="extraction-sections">
        {/* Incident summary */}
        <section className="extraction-section">
          <h4 className="extraction-section__title">Incident Summary</h4>
          <p className="extraction-section__body">{extraction.incidentSummary}</p>
          <ProvenanceTags
            ids={extraction.provenance["incidentSummary"] ?? []}
            evidence={evidence}
          />
        </section>

        {/* Timeline */}
        <section className="extraction-section">
          <h4 className="extraction-section__title">Timeline</h4>
          <ol className="extraction-timeline">
            {extraction.timeline.map((entry, i) => (
              <li key={i} className="extraction-timeline__item">
                <span className="extraction-timeline__time">{entry.time}</span>
                <span className="extraction-timeline__event">{entry.event}</span>
              </li>
            ))}
          </ol>
          <ProvenanceTags
            ids={extraction.provenance["timeline"] ?? []}
            evidence={evidence}
          />
        </section>

        {/* Parties */}
        <section className="extraction-section">
          <h4 className="extraction-section__title">Parties Involved</h4>
          <div className="extraction-parties">
            {extraction.parties.map((p) => (
              <div key={p.role} className="extraction-party">
                <span className="extraction-party__role">{p.role}</span>
                <span className="extraction-party__name">{p.name}</span>
                {p.contact && (
                  <span className="extraction-party__contact">{p.contact}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Vehicle */}
        <section className="extraction-section">
          <h4 className="extraction-section__title">Vehicle Information</h4>
          <dl className="extraction-vehicle">
            <dt>Make / Model</dt>
            <dd>
              {extraction.vehicle.year} {extraction.vehicle.make}{" "}
              {extraction.vehicle.model}
            </dd>
            <dt>Color</dt>
            <dd>{extraction.vehicle.color}</dd>
            <dt>Plate</dt>
            <dd>{extraction.vehicle.plate}</dd>
            {extraction.vehicle.vin && (
              <>
                <dt>VIN</dt>
                <dd className="extraction-vehicle__vin">{extraction.vehicle.vin}</dd>
              </>
            )}
          </dl>
        </section>

        {/* Damage */}
        <section className="extraction-section">
          <h4 className="extraction-section__title">Damage Observations</h4>
          <ul className="extraction-list">
            {extraction.damageObservations.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
          <ProvenanceTags
            ids={extraction.provenance["damageObservations"] ?? []}
            evidence={evidence}
          />
        </section>

        {/* Severity */}
        <section className="extraction-section">
          <h4 className="extraction-section__title">Severity Assessment</h4>
          <p className="extraction-section__body">{extraction.severityAssessment}</p>
          <ProvenanceTags
            ids={extraction.provenance["severityAssessment"] ?? []}
            evidence={evidence}
          />
        </section>

        {/* Next steps */}
        <section className="extraction-section">
          <h4 className="extraction-section__title">Recommended Next Steps</h4>
          <ol className="extraction-list extraction-list--ordered">
            {extraction.recommendedNextSteps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          <ProvenanceTags
            ids={extraction.provenance["recommendedNextSteps"] ?? []}
            evidence={evidence}
          />
        </section>
      </div>
    </div>
  );
}
