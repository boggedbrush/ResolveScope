import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  title: string;
  src: string;
  label: string;
  onClose: () => void;
}

export function FileViewerOverlay({ title, src, label, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isCsv = label === "CSV";

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

  useEffect(() => {
    let isActive = true;
    setContent(null);
    setError(null);

    fetch(src)
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load file (${response.status})`);
        return response.text();
      })
      .then((text) => {
        if (isActive) setContent(text);
      })
      .catch(() => {
        if (isActive) setError("Unable to load this preview.");
      });

    return () => {
      isActive = false;
    };
  }, [src]);

  const csvRows = useMemo(() => {
    if (!isCsv || content === null) return [];
    return content
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .map((row) => row.split(",").map((cell) => cell.trim()));
  }, [content, isCsv]);

  return (
    <div
      ref={overlayRef}
      className="pdf-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={`${label} preview for ${title}`}
      onClick={(event) => {
        if (event.target === overlayRef.current) onClose();
      }}
    >
      <div className="pdf-viewer__shell">
        <div className="pdf-viewer__header">
          <div className="pdf-viewer__meta">
            <span className="pdf-viewer__eyebrow">{label} preview</span>
            <h2 className="pdf-viewer__title">{title}</h2>
          </div>
          <button
            type="button"
            className="pdf-viewer__close"
            onClick={onClose}
            aria-label={`Close ${label} preview`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="file-viewer__body">
          {error ? (
            <p className="file-viewer__state">{error}</p>
          ) : content === null ? (
            <p className="file-viewer__state">Loading preview...</p>
          ) : isCsv ? (
            <div className="file-viewer__table-wrap">
              <table className="file-viewer__table">
                <thead>
                  <tr>
                    {(csvRows[0] ?? []).map((cell, index) => (
                      <th key={`${cell}-${index}`}>{cell}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvRows.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <pre className="file-viewer__pre">{content}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
