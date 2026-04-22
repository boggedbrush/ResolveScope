import { useEffect, useRef } from "react";

interface Props {
  title: string;
  src: string;
  onClose: () => void;
}

export function ImageViewerOverlay({ title, src, onClose }: Props) {
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
      className="spatial__lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Image preview for ${title}`}
      onClick={(event) => {
        if (event.target === overlayRef.current) onClose();
      }}
    >
      <button
        type="button"
        className="spatial__lightbox-close"
        onClick={onClose}
        aria-label="Close image preview"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <img
        src={src}
        alt={title}
        className="spatial__lightbox-image spatial__lightbox-image--evidence"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}
