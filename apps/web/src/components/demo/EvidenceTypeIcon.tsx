import type { EvidenceType } from "../../types/case";

interface Props {
  type: EvidenceType;
  className?: string;
}

export function EvidenceTypeIcon({ type, className }: Props) {
  if (type === "image") {
    return (
      <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2.25" y="3" width="13.5" height="12" rx="2.25" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="6.25" cy="7" r="1.25" fill="currentColor" />
        <path d="M4.5 13l3.25-3.25 2.25 2.25 2.75-3 1.75 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "note") {
    return (
      <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M5.25 2.75h5.75l2.75 2.75v9A1.5 1.5 0 0 1 12.25 16h-7A1.5 1.5 0 0 1 3.75 14.5v-10A1.75 1.75 0 0 1 5.25 2.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M11 2.75V6h3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M6 8.5h6M6 11h6M6 13.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "video") {
    return (
      <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2.25" y="4" width="9.5" height="10" rx="2.25" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11.75 7.25 15.25 5.5v7l-3.5-1.75V7.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M5.25 2.75h5.75l2.75 2.75v9A1.5 1.5 0 0 1 12.25 16h-7A1.5 1.5 0 0 1 3.75 14.5v-10A1.75 1.75 0 0 1 5.25 2.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M11 2.75V6h3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 8.5h6M6 11h6M6 13.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
