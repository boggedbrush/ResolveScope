import { useRef, useState } from "react";
import type { EvidenceItem, EvidenceType } from "../../types/case";
import { EvidenceTypeIcon } from "./EvidenceTypeIcon";
import { ImageViewerOverlay } from "./ImageViewerOverlay";
import { NoteViewerOverlay } from "./NoteViewerOverlay";
import { PdfViewerOverlay } from "./PdfViewerOverlay";

interface Props {
  evidence: EvidenceItem[];
  onAddEvidence: (items: EvidenceItem[]) => void;
  caseId: string;
  caseTitle: string;
  template: string;
  status: string;
  priority: string;
  severity: string;
  uploadedBy: string;
}

const TYPE_LABELS: Record<EvidenceType, string> = {
  document: "Document",
  image: "Photo",
  note: "Note",
  video: "Video",
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function EvidencePanel({
  evidence,
  onAddEvidence,
  caseId,
  caseTitle,
  template,
  status,
  priority,
  severity,
  uploadedBy,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePdf, setActivePdf] = useState<{ title: string; src: string } | null>(null);
  const [activeImage, setActiveImage] = useState<{ title: string; src: string } | null>(null);
  const [activeNote, setActiveNote] = useState<EvidenceItem | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const newItems: EvidenceItem[] = files.map((f) => {
      const type: EvidenceType = f.type.startsWith("image/") ? "image" : "document";
      const isPdf = f.type === "application/pdf";
      return {
        id: `ev-upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type,
        name: f.name,
        uploadedBy,
        uploadedAt: new Date().toISOString(),
        description: "Uploaded via file picker.",
        mimeType: f.type,
        previewUrl:
          f.type.startsWith("image/") || isPdf ? URL.createObjectURL(f) : undefined,
      };
    });
    onAddEvidence(newItems);
    e.target.value = "";
  }

  const statusClass = status;
  const severityClass = severity.replace(/-/g, "");

  return (
    <aside className="demo-panel demo-panel--evidence">
      {/* Case header */}
      <div className="demo-case-header">
        <div className="demo-case-header__meta">
          <span className="section-label">{template}</span>
          <span className="demo-case-header__id">{caseId}</span>
        </div>
        <h2 className="demo-case-header__title">{caseTitle}</h2>
        <div className="demo-case-header__badges">
          <span className={`badge badge--status-${statusClass}`}>
            {status.replace(/-/g, " ")}
          </span>
          <span className={`badge badge--priority-${priority}`}>{priority}</span>
          <span className={`badge badge--severity-${severityClass}`}>{severity.replace(/-/g, " ")}</span>
        </div>
      </div>

      {/* Evidence list header */}
      <div className="demo-panel__section-header">
        <h3 className="demo-panel__section-title">
          Evidence
          <span className="demo-panel__count">{evidence.length}</span>
        </h3>
        <button
          className="btn btn--outline demo-panel__add-btn"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Add evidence file"
        >
          + Add
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt,.doc,.docx"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {/* Evidence items */}
      <ul className="evidence-list" aria-label="Evidence items">
        {evidence.map((item) => (
          <li key={item.id} className="evidence-item">
            <div className="evidence-item__icon" aria-hidden="true">
              <EvidenceTypeIcon
                type={item.type}
                className={`evidence-item__icon-svg evidence-item__icon-svg--${item.type}`}
              />
            </div>
            <div className="evidence-item__body">
              <div className="evidence-item__row">
                <span className="evidence-item__type-badge">
                  {TYPE_LABELS[item.type]}
                </span>
                <span className="evidence-item__name">{item.name}</span>
              </div>
              {item.previewUrl && (
                item.type === "image" ? (
                  <button
                    type="button"
                    className="evidence-item__preview-button"
                    onClick={() => setActiveImage({ title: item.name, src: item.previewUrl! })}
                    aria-label={`Expand ${item.name}`}
                  >
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="evidence-item__preview"
                    />
                    <span className="evidence-item__preview-overlay">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path d="M3 3h5M3 3v5M15 3h-5M15 3v5M3 15h5M3 15v-5M15 15h-5M15 15v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span>Expand</span>
                    </span>
                  </button>
                ) : (
                  <a
                    href={item.previewUrl}
                    onClick={(event) => {
                      if (item.mimeType !== "application/pdf") return;
                      event.preventDefault();
                      setActivePdf({ title: item.name, src: item.previewUrl! });
                    }}
                    className="evidence-item__file-link"
                  >
                    Open file
                  </a>
                )
              )}
              {item.type === "note" && (
                <button
                  type="button"
                  className="evidence-item__file-link"
                  onClick={() => setActiveNote(item)}
                >
                  Open note
                </button>
              )}
              <p className="evidence-item__desc">{item.description}</p>
              <div className="evidence-item__footer">
                <span>{item.uploadedBy}</span>
                <span>{fmtDate(item.uploadedAt)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {activePdf && (
        <PdfViewerOverlay
          title={activePdf.title}
          src={activePdf.src}
          onClose={() => setActivePdf(null)}
        />
      )}
      {activeImage && (
        <ImageViewerOverlay
          title={activeImage.title}
          src={activeImage.src}
          onClose={() => setActiveImage(null)}
        />
      )}
      {activeNote && (
        <NoteViewerOverlay
          title={activeNote.name}
          body={activeNote.description}
          uploadedBy={activeNote.uploadedBy}
          uploadedAt={activeNote.uploadedAt}
          onClose={() => setActiveNote(null)}
        />
      )}
    </aside>
  );
}
