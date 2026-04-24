import { useEffect, useRef } from "react";

interface Props {
  title: string;
  src: string;
  onClose: () => void;
}

export function PdfViewerOverlay({ title, src, onClose }: Props) {
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
      className="pdf-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={`PDF preview for ${title}`}
      onClick={(event) => {
        if (event.target === overlayRef.current) onClose();
      }}
    >
      <div className="pdf-viewer__shell">
        <div className="pdf-viewer__header">
          <div className="pdf-viewer__meta">
            <span className="pdf-viewer__eyebrow">PDF preview</span>
            <h2 className="pdf-viewer__title">{title}</h2>
          </div>
          <button
            type="button"
            className="pdf-viewer__close"
            onClick={onClose}
            aria-label="Close PDF preview"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="pdf-viewer__frame-wrap">
          <iframe
            title={title}
            src={`${src}#toolbar=1&navpanes=0&view=FitH`}
            className="pdf-viewer__frame"
          />
        </div>
      </div>
    </div>
  );
}
