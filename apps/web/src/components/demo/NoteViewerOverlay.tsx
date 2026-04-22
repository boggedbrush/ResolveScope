import { useEffect, useRef } from "react";

interface Props {
  title: string;
  body: string;
  uploadedBy: string;
  uploadedAt: string;
  onClose: () => void;
}

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

export function NoteViewerOverlay({
  title,
  body,
  uploadedBy,
  uploadedAt,
  onClose,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="note-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={`Note preview for ${title}`}
      onClick={(event) => {
        if (event.target === overlayRef.current) onClose();
      }}
    >
      <div className="note-viewer__shell">
        <div className="note-viewer__header">
          <div className="note-viewer__meta">
            <span className="note-viewer__eyebrow">Note preview</span>
            <h2 className="note-viewer__title">{title}</h2>
          </div>
          <button
            type="button"
            className="note-viewer__close"
            onClick={onClose}
            aria-label="Close note preview"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="note-viewer__body">
          <div className="note-viewer__info">
            <span>{uploadedBy}</span>
            <span>{fmtDate(uploadedAt)}</span>
          </div>
          <div className="note-viewer__content">{body}</div>
        </div>
      </div>
    </div>
  );
}
