import { useRef } from "react";
import type { EvidenceItem, EvidenceType } from "../../types/demo";

interface Props {
  evidence: EvidenceItem[];
  onAddEvidence: (items: EvidenceItem[]) => void;
  caseId: string;
  caseTitle: string;
  template: string;
  status: string;
  priority: string;
  severity: string;
}

const TYPE_ICONS: Record<EvidenceType, string> = {
  document: "📄",
  image: "🖼",
  note: "📝",
  video: "🎥",
};

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
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const newItems: EvidenceItem[] = files.map((f) => {
      const type: EvidenceType = f.type.startsWith("image/")
        ? "image"
        : f.type === "application/pdf"
        ? "document"
        : "document";
      return {
        id: `ev-upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type,
        name: f.name,
        uploadedBy: "Alex Chen (adjuster)",
        uploadedAt: new Date().toISOString(),
        description: "Uploaded via file picker.",
        mimeType: f.type,
        previewUrl: f.type.startsWith("image/")
          ? URL.createObjectURL(f)
          : undefined,
      };
    });
    onAddEvidence(newItems);
    // Reset input so same file can be re-added
    e.target.value = "";
  }

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
          <span className={`badge badge--status-${status.replace("-", "")}`}>
            {status.replace("-", " ")}
          </span>
          <span className={`badge badge--priority-${priority}`}>{priority}</span>
          <span className={`badge badge--severity-${severity}`}>{severity}</span>
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
              {TYPE_ICONS[item.type]}
            </div>
            <div className="evidence-item__body">
              <div className="evidence-item__row">
                <span className="evidence-item__type-badge">
                  {TYPE_LABELS[item.type]}
                </span>
                <span className="evidence-item__name">{item.name}</span>
              </div>
              {item.previewUrl && (
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  className="evidence-item__preview"
                />
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
    </aside>
  );
}
