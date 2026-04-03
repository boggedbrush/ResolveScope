import { useEffect, useRef } from "react";
import type { EvidenceItem, ExtractionSectionDef } from "../../types/case";

const EVIDENCE_ICONS: Record<string, string> = {
  document: "📄",
  image: "🖼",
  note: "📝",
  video: "🎥",
};

function fmtDate(iso: string): string {
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

interface Props {
  /** The section whose provenance is being inspected */
  section: ExtractionSectionDef;
  /** Evidence IDs linked to this section */
  evidenceIds: string[];
  /** All available evidence items */
  evidence: EvidenceItem[];
  onClose: () => void;
}

export function ProvenanceInspector({
  section,
  evidenceIds,
  evidence,
  onClose,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  const linkedEvidence = evidenceIds
    .map((id) => evidence.find((e) => e.id === id))
    .filter((e): e is EvidenceItem => !!e);

  // Focus trap and keyboard close
  useEffect(() => {
    firstFocusRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      className="provenance-overlay"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Evidence supporting ${section.title}`}
      onClick={handleOverlayClick}
    >
      <div className="provenance-drawer">
        <div className="provenance-drawer__header">
          <div className="provenance-drawer__header-left">
            <span className="provenance-drawer__section-label">
              {section.title}
            </span>
            <h2 className="provenance-drawer__title">Supporting evidence</h2>
          </div>
          <button
            ref={firstFocusRef}
            className="provenance-drawer__close"
            onClick={onClose}
            aria-label="Close provenance inspector"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {linkedEvidence.length === 0 ? (
          <div className="provenance-drawer__empty">
            <p>No evidence items are linked to this section.</p>
          </div>
        ) : (
          <ol className="provenance-evidence-list" aria-label="Linked evidence">
            {linkedEvidence.map((item, idx) => (
              <li key={item.id} className="provenance-evidence-item">
                <div className="provenance-evidence-item__index" aria-hidden="true">
                  {idx + 1}
                </div>
                <div className="provenance-evidence-item__body">
                  <div className="provenance-evidence-item__row">
                    <span className="provenance-evidence-item__type-badge">
                      {EVIDENCE_ICONS[item.type] ?? "📎"}{" "}
                      {item.type.toUpperCase()}
                    </span>
                    <span className="provenance-evidence-item__name">
                      {item.name}
                    </span>
                  </div>

                  {item.type === "image" && item.previewUrl && (
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="provenance-evidence-item__preview"
                    />
                  )}

                  <p className="provenance-evidence-item__desc">
                    {item.description}
                  </p>

                  <div className="provenance-evidence-item__meta">
                    <span>
                      <span className="provenance-evidence-item__meta-label">
                        Uploaded by
                      </span>{" "}
                      {item.uploadedBy}
                    </span>
                    <span>
                      <span className="provenance-evidence-item__meta-label">
                        Uploaded
                      </span>{" "}
                      {fmtDate(item.uploadedAt)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}

        <div className="provenance-drawer__footer">
          <span className="provenance-drawer__count">
            {linkedEvidence.length} evidence item{linkedEvidence.length !== 1 ? "s" : ""} linked
          </span>
          <button className="btn btn--outline provenance-drawer__close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
