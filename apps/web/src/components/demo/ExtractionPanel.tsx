import { useState } from "react";
import { ProvenanceInspector } from "./ProvenanceInspector";
import type {
  ExtractionResult,
  EvidenceItem,
  SectionData,
  ExtractionSectionDef,
  CaseTemplate,
} from "../../types/case";

interface Props {
  extraction: ExtractionResult | null;
  isRunning: boolean;
  onRunExtraction: () => void;
  evidence: EvidenceItem[];
  template: CaseTemplate;
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
  onInspect,
}: {
  ids: string[];
  evidence: EvidenceItem[];
  onInspect: () => void;
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
      <button
        className="extraction-provenance__inspect-btn"
        onClick={onInspect}
        aria-label={`Inspect ${ids.length} supporting evidence item${ids.length !== 1 ? "s" : ""}`}
        title="Inspect supporting evidence"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.25" />
          <path d="M8.5 8.5l2 2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
        Inspect
      </button>
    </div>
  );
}

function renderSectionBody(data: SectionData) {
  switch (data.type) {
    case "text":
      return <p className="extraction-section__body">{data.content}</p>;

    case "list":
      return (
        <ul className="extraction-list">
          {data.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );

    case "ordered-list":
      return (
        <ol className="extraction-list extraction-list--ordered">
          {data.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      );

    case "timeline":
      return (
        <ol className="extraction-timeline">
          {data.entries.map((entry, i) => (
            <li key={i} className="extraction-timeline__item">
              <span className="extraction-timeline__time">{entry.time}</span>
              <span className="extraction-timeline__event">{entry.event}</span>
            </li>
          ))}
        </ol>
      );

    case "parties":
      return (
        <div className="extraction-parties">
          {data.parties.map((p) => (
            <div key={p.role} className="extraction-party">
              <span className="extraction-party__role">{p.role}</span>
              <span className="extraction-party__name">{p.name}</span>
              {p.contact && (
                <span className="extraction-party__contact">{p.contact}</span>
              )}
            </div>
          ))}
        </div>
      );

    case "unit-info":
      return (
        <dl className="extraction-vehicle">
          {data.fields.map((f) => (
            <div key={f.label} className="extraction-vehicle__row">
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      );

    case "actions":
      return (
        <ol className="extraction-actions">
          {data.items.map((item, i) => (
            <li key={i} className="extraction-action">
              <span className="extraction-action__text">{item.action}</span>
              {(item.owner || item.due) && (
                <div className="extraction-action__meta">
                  {item.owner && (
                    <span className="extraction-action__owner">{item.owner}</span>
                  )}
                  {item.due && (
                    <span className="extraction-action__due">Due {item.due}</span>
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>
      );
  }
}

function ExtractionSection({
  def,
  extraction,
  evidence,
  onInspect,
}: {
  def: ExtractionSectionDef;
  extraction: ExtractionResult;
  evidence: EvidenceItem[];
  onInspect: (def: ExtractionSectionDef, ids: string[]) => void;
}) {
  const data = extraction.sections[def.key];
  if (!data) return null;

  const provenanceKey = def.provenanceKey ?? def.key;
  const provenanceIds = extraction.provenance[provenanceKey] ?? [];

  return (
    <section className="extraction-section">
      <h4 className="extraction-section__title">{def.title}</h4>
      {renderSectionBody(data)}
      {provenanceIds.length > 0 && (
        <ProvenanceTags
          ids={provenanceIds}
          evidence={evidence}
          onInspect={() => onInspect(def, provenanceIds)}
        />
      )}
    </section>
  );
}

export function ExtractionPanel({
  extraction,
  isRunning,
  onRunExtraction,
  evidence,
  template,
}: Props) {
  const [inspecting, setInspecting] = useState<{
    def: ExtractionSectionDef;
    ids: string[];
  } | null>(null);

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
              <rect
                x="8"
                y="6"
                width="24"
                height="28"
                rx="3"
                stroke="#b85a30"
                strokeWidth="1.5"
              />
              <path
                d="M14 14h12M14 20h12M14 26h8"
                stroke="#b85a30"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="32" cy="32" r="6" fill="#b85a30" />
              <path
                d="M32 29v3l2 2"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h3 className="extraction-empty__title">Ready to extract</h3>
          <p className="extraction-empty__body">
            Run extraction to generate a structured case brief — incident
            summary, timeline, findings, and recommended actions.
          </p>
          <button
            className="btn btn--primary"
            onClick={onRunExtraction}
            aria-label="Run extraction on this case"
          >
            Run Extraction
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="demo-panel demo-panel--extraction">
        <div className="demo-panel__section-header">
          <h3 className="demo-panel__section-title">Case Brief</h3>
          <span className="extraction-run-meta">
            Extracted {fmtRunAt(extraction.runAt)}
          </span>
        </div>

        <div className="extraction-sections">
          {template.extractionSections.map((def) => (
            <ExtractionSection
              key={def.key}
              def={def}
              extraction={extraction}
              evidence={evidence}
              onInspect={(d, ids) => setInspecting({ def: d, ids })}
            />
          ))}
        </div>
      </div>

      {inspecting && (
        <ProvenanceInspector
          section={inspecting.def}
          evidenceIds={inspecting.ids}
          evidence={evidence}
          onClose={() => setInspecting(null)}
        />
      )}
    </>
  );
}
