import { useRef, useState } from "react";
import type { EvidenceItem, EvidenceType } from "../../types/case";
import { EvidenceTypeIcon } from "./EvidenceTypeIcon";
import { FileViewerOverlay } from "./FileViewerOverlay";
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

function getEvidenceTypeLabel(item: EvidenceItem): string {
  if (item.mimeType === "text/csv") return "Data";
  if (item.type === "image" && item.name.toLowerCase().includes("screenshot")) return "Screenshot";
  return TYPE_LABELS[item.type];
}

function getEvidenceTypeClass(item: EvidenceItem): string {
  if (item.mimeType === "text/csv") return "data";
  return item.type;
}

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
  const [activeFile, setActiveFile] = useState<{ title: string; src: string; label: string } | null>(null);
  const [activeImage, setActiveImage] = useState<{ title: string; src: string } | null>(null);
  const [activeNote, setActiveNote] = useState<EvidenceItem | null>(null);
  const [isNoteComposerOpen, setIsNoteComposerOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const newItems: EvidenceItem[] = files.map((f) => {
      const type: EvidenceType = f.type.startsWith("image/") ? "image" : "document";
      const isPdf = f.type === "application/pdf";
      const isPreviewableFile = isPdf || f.type === "text/csv" || f.type.startsWith("text/");
      return {
        id: `ev-upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type,
        name: f.name,
        uploadedBy,
        uploadedAt: new Date().toISOString(),
        description: "Uploaded via file picker.",
        mimeType: f.type,
        previewUrl:
          f.type.startsWith("image/") || isPreviewableFile ? URL.createObjectURL(f) : undefined,
      };
    });
    onAddEvidence(newItems);
    e.target.value = "";
  }

  function handleAddNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = noteBody.trim();
    if (!body) return;

    onAddEvidence([
      {
        id: `ev-note-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type: "note",
        name: noteTitle.trim() || "Reviewer Note",
        uploadedBy,
        uploadedAt: new Date().toISOString(),
        description: body,
        mimeType: "text/plain",
      },
    ]);
    setNoteTitle("");
    setNoteBody("");
    setIsNoteComposerOpen(false);
  }

  const statusClass = status;
  const severityClass = severity.replace(/-/g, "");

  return (
    <aside className="demo-panel demo-panel--evidence" data-tour="demo-evidence">
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
        <div
          className="demo-panel__evidence-actions"
          aria-label="Add evidence"
          data-tour="demo-add-evidence"
        >
          <button
            type="button"
            className="btn btn--outline demo-panel__add-btn"
            onClick={() => setIsNoteComposerOpen(true)}
          >
            Add note
          </button>
          <button
            type="button"
            className="btn btn--outline demo-panel__add-btn"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload evidence file"
          >
            Upload file
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx"
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
                mimeType={item.mimeType}
                className={`evidence-item__icon-svg evidence-item__icon-svg--${getEvidenceTypeClass(item)}`}
              />
            </div>
            <div className="evidence-item__body">
              <div className="evidence-item__row">
                <span className={`evidence-item__type-badge evidence-item__type-badge--${getEvidenceTypeClass(item)}`}>
                  {getEvidenceTypeLabel(item)}
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
                      event.preventDefault();
                      if (item.mimeType === "application/pdf") {
                        setActivePdf({ title: item.name, src: item.previewUrl! });
                        return;
                      }
                      setActiveFile({
                        title: item.name,
                        src: item.previewUrl!,
                        label: item.mimeType === "text/csv" ? "CSV" : "File",
                      });
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
      {activeFile && (
        <FileViewerOverlay
          title={activeFile.title}
          src={activeFile.src}
          label={activeFile.label}
          onClose={() => setActiveFile(null)}
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
      {isNoteComposerOpen && (
        <div
          className="note-viewer"
          role="dialog"
          aria-modal="true"
          aria-label="Add evidence note"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsNoteComposerOpen(false);
          }}
        >
          <form className="note-viewer__shell note-composer" onSubmit={handleAddNote}>
            <div className="note-viewer__header">
              <div className="note-viewer__meta">
                <span className="note-viewer__eyebrow">New evidence</span>
                <h2 className="note-viewer__title">Add note</h2>
              </div>
              <button
                type="button"
                className="note-viewer__close"
                onClick={() => setIsNoteComposerOpen(false)}
                aria-label="Close note composer"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="note-viewer__body">
              <label className="note-composer__field">
                <span>Title</span>
                <input
                  value={noteTitle}
                  onChange={(event) => setNoteTitle(event.target.value)}
                  placeholder="Reviewer Note"
                />
              </label>
              <label className="note-composer__field">
                <span>Note</span>
                <textarea
                  value={noteBody}
                  onChange={(event) => setNoteBody(event.target.value)}
                  placeholder="Add context, observations, or follow-up notes..."
                  rows={7}
                  required
                />
              </label>
            </div>
            <div className="note-composer__footer">
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setIsNoteComposerOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn--primary" disabled={!noteBody.trim()}>
                Add note
              </button>
            </div>
          </form>
        </div>
      )}
    </aside>
  );
}
