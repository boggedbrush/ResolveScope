import { useState } from "react";
import type { SpatialMarker, EvidenceItem } from "../../types/case";

interface Props {
  markers: SpatialMarker[];
  evidence: EvidenceItem[];
}

const SEVERITY_LABELS: Record<SpatialMarker["severity"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const STATUS_LABELS: Record<NonNullable<SpatialMarker["status"]>, string> = {
  open: "Open",
  resolved: "Resolved",
  "needs-review": "Needs Review",
};

/* ── Inline SVG: 3-storey commercial building facade ── */
function BuildingFacadeSVG() {
  return (
    <svg
      viewBox="0 0 900 460"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="spatial-panel__facade-svg"
    >
      {/* Sky */}
      <rect width="900" height="460" fill="#e4e0d8" />

      {/* Ground plane */}
      <rect x="0" y="390" width="900" height="70" fill="#c0b8a8" />
      {/* Ground shadow */}
      <rect x="80" y="385" width="740" height="12" fill="#aaa090" opacity="0.5" />

      {/* Main building body */}
      <rect x="80" y="55" width="740" height="335" fill="#d2cdc4" />

      {/* Roof parapet cap */}
      <rect x="80" y="48" width="740" height="16" fill="#b8b2a8" />
      <rect x="80" y="64" width="740" height="4" fill="#a8a298" />

      {/* Subtle facade grid lines (column markers) */}
      {[200, 320, 450, 580, 700].map((x) => (
        <line key={x} x1={x} y1="55" x2={x} y2="390" stroke="#c0bbb2" strokeWidth="1" opacity="0.5" />
      ))}

      {/* Floor division lines */}
      <rect x="80" y="168" width="740" height="6" fill="#b8b2a8" />
      <rect x="80" y="280" width="740" height="6" fill="#b8b2a8" />

      {/* ── Level 3 windows (y: 80–148) ── */}
      {[108, 228, 348, 468, 588, 708].map((x) => (
        <g key={`l3-${x}`}>
          <rect x={x} y={82} width={80} height={70} rx={2} fill="#6e8fa0" opacity="0.85" />
          <rect x={x} y={82} width={80} height={3} fill="#8aafbf" opacity="0.6" />
          <rect x={x + 2} y={84} width={76} height={26} fill="#7ea4b8" opacity="0.4" />
          <rect x={x} y={82} width={80} height={70} rx={2} fill="none" stroke="#8a8278" strokeWidth="2" />
        </g>
      ))}

      {/* ── Level 2 windows (y: 190–258) ── */}
      {[108, 228, 348, 468, 588, 708].map((x) => (
        <g key={`l2-${x}`}>
          <rect x={x} y={192} width={80} height={70} rx={2} fill="#6e8fa0" opacity="0.85" />
          <rect x={x} y={192} width={80} height={3} fill="#8aafbf" opacity="0.6" />
          <rect x={x + 2} y={194} width={76} height={26} fill="#7ea4b8" opacity="0.4" />
          <rect x={x} y={192} width={80} height={70} rx={2} fill="none" stroke="#8a8278" strokeWidth="2" />
        </g>
      ))}

      {/* ── Level 1 windows (y: 304–355) — 4 windows, leaving space for entry ── */}
      {[108, 228, 588, 708].map((x) => (
        <g key={`l1-${x}`}>
          <rect x={x} y={304} width={80} height={70} rx={2} fill="#6e8fa0" opacity="0.85" />
          <rect x={x} y={304} width={80} height={3} fill="#8aafbf" opacity="0.6" />
          <rect x={x + 2} y={306} width={76} height={26} fill="#7ea4b8" opacity="0.4" />
          <rect x={x} y={304} width={80} height={70} rx={2} fill="none" stroke="#8a8278" strokeWidth="2" />
        </g>
      ))}

      {/* ── Main entrance ── */}
      {/* Canopy */}
      <rect x="348" y="292" width="204" height="12" rx={2} fill="#a8a298" />
      <rect x="344" y="291" width="212" height="4" rx={1} fill="#b8b2a8" />
      {/* Door surround */}
      <rect x="360" y="304" width="180" height="86" rx={2} fill="#a8a098" />
      {/* Double door */}
      <rect x="368" y="308" width="78" height="82" rx={2} fill="#888078" />
      <rect x="454" y="308" width="78" height="82" rx={2} fill="#888078" />
      {/* Door panels */}
      <rect x="372" y="314" width={34} height={34} rx={1} fill="#7a7268" />
      <rect x="372" y="352" width={34} height={34} rx={1} fill="#7a7268" />
      <rect x="458" y="314" width={34} height={34} rx={1} fill="#7a7268" />
      <rect x="458" y="352" width={34} height={34} rx={1} fill="#7a7268" />
      {/* Door handles */}
      <rect x="444" y="346" width={4} height={18} rx={2} fill="#c0b8a8" />
      <rect x="452" y="346" width={4} height={18} rx={2} fill="#c0b8a8" />
      {/* Entry steps */}
      <rect x="340" y="388" width="220" height="6" rx={1} fill="#b0a898" />
      <rect x="330" y="382" width="240" height="8" rx={1} fill="#b8b0a0" />

      {/* Subtle spandrel panels between windows */}
      {[174, 294, 414, 534, 654].map((x) => (
        <rect key={`sp-${x}`} x={x} y={82} width={46} height={282} fill="#cac5bc" opacity="0.4" />
      ))}

      {/* Building number sign */}
      <rect x="400" y="62" width="100" height="22" rx={3} fill="#b8b2a8" />
      <text x="450" y="77" textAnchor="middle" fontSize="11" fill="#6b6560" fontFamily="system-ui, sans-serif" fontWeight="600">
        BUILDING A
      </text>
    </svg>
  );
}

export function SpatialReviewPanel({ markers, evidence }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedMarker = selectedId ? markers.find((m) => m.id === selectedId) ?? null : null;
  const relatedEvidence = selectedMarker
    ? selectedMarker.relatedEvidenceIds.map((id) => evidence.find((e) => e.id === id)).filter(Boolean) as EvidenceItem[]
    : [];

  const openCount = markers.filter((m) => !m.status || m.status === "open" || m.status === "needs-review").length;

  return (
    <section className="spatial-panel" aria-label="Spatial annotation review">
      <div className="spatial-panel__header">
        <div className="spatial-panel__header-left">
          <span className="spatial-panel__title">Site Annotation Review</span>
          <span className="spatial-panel__subtitle">
            {markers.length} marker{markers.length !== 1 ? "s" : ""} · {openCount} open
          </span>
        </div>
        <div className="spatial-panel__legend">
          {(["high", "medium", "low", "critical"] as SpatialMarker["severity"][]).map((sev) => {
            const count = markers.filter((m) => m.severity === sev).length;
            if (!count) return null;
            return (
              <span key={sev} className={`spatial-legend-item spatial-legend-item--${sev}`}>
                <span className="spatial-legend-item__dot" aria-hidden="true" />
                {SEVERITY_LABELS[sev]} ({count})
              </span>
            );
          })}
        </div>
      </div>

      <div className="spatial-panel__body">
        {/* Image + overlaid markers */}
        <div className="spatial-panel__image-wrap">
          <BuildingFacadeSVG />

          {markers.map((marker) => (
            <button
              key={marker.id}
              className={[
                "spatial-marker",
                `spatial-marker--${marker.severity}`,
                selectedId === marker.id ? "spatial-marker--active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              onClick={() => setSelectedId(selectedId === marker.id ? null : marker.id)}
              aria-label={`Marker: ${marker.label} — ${SEVERITY_LABELS[marker.severity]} severity`}
              aria-pressed={selectedId === marker.id}
            >
              <span className="spatial-marker__dot" aria-hidden="true" />
              <span className="spatial-marker__ring" aria-hidden="true" />
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="spatial-panel__detail-pane">
          {selectedMarker ? (
            <div className="spatial-marker-detail" key={selectedMarker.id}>
              <div className="spatial-marker-detail__header">
                <span className={`spatial-marker-detail__severity spatial-marker-detail__severity--${selectedMarker.severity}`}>
                  {SEVERITY_LABELS[selectedMarker.severity]}
                </span>
                {selectedMarker.status && (
                  <span className={`spatial-marker-detail__status spatial-marker-detail__status--${selectedMarker.status}`}>
                    {STATUS_LABELS[selectedMarker.status]}
                  </span>
                )}
                <button
                  className="spatial-marker-detail__close"
                  onClick={() => setSelectedId(null)}
                  aria-label="Close marker detail"
                >
                  ×
                </button>
              </div>

              <h3 className="spatial-marker-detail__title">{selectedMarker.label}</h3>
              <p className="spatial-marker-detail__note">{selectedMarker.note}</p>

              {relatedEvidence.length > 0 && (
                <div className="spatial-marker-detail__evidence">
                  <span className="spatial-marker-detail__evidence-label">Supporting evidence</span>
                  <ul className="spatial-marker-detail__evidence-list">
                    {relatedEvidence.map((ev) => (
                      <li key={ev.id} className="spatial-marker-detail__evidence-item">
                        <span className={`spatial-evidence-type spatial-evidence-type--${ev.type}`}>
                          {ev.type}
                        </span>
                        <span className="spatial-marker-detail__evidence-name">{ev.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedMarker.relatedExtractionSectionKey && (
                <div className="spatial-marker-detail__section-ref">
                  <span className="spatial-marker-detail__section-ref-label">Related section</span>
                  <span className="spatial-marker-detail__section-ref-key">
                    {selectedMarker.relatedExtractionSectionKey}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="spatial-panel__no-selection">
              <div className="spatial-panel__no-selection-icon" aria-hidden="true">◎</div>
              <p className="spatial-panel__no-selection-text">
                Select a marker to inspect findings, evidence links, and severity details.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Marker index */}
      <div className="spatial-panel__marker-index">
        {markers.map((marker) => (
          <button
            key={marker.id}
            className={[
              "spatial-index-item",
              `spatial-index-item--${marker.severity}`,
              selectedId === marker.id ? "spatial-index-item--active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setSelectedId(selectedId === marker.id ? null : marker.id)}
          >
            <span className="spatial-index-item__dot" aria-hidden="true" />
            <span className="spatial-index-item__label">{marker.label}</span>
            {marker.status && (
              <span className={`spatial-index-item__status spatial-index-item__status--${marker.status}`}>
                {STATUS_LABELS[marker.status]}
              </span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
