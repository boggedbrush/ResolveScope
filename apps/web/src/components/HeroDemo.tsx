import { useState, useEffect } from "react";

const STAGE_DURATION = 3400;

const STAGE_META = [
  { label: "Evidence Intake", step: "01" },
  { label: "AI Extraction", step: "02" },
  { label: "Human Review", step: "03" },
  { label: "Export Ready", step: "04" },
] as const;

/* ── Icons ───────────────────────────────── */

function PdfIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="2" y="1" width="8" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 1v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M4 7h4M4 9h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="1.5" y="2.5" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4.5" cy="5.5" r="1" fill="currentColor" />
      <path d="M1.5 9.5l3-3 2.5 2.5 2-2 3 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="2.5" y="1.5" width="9" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 5h5M4.5 7h5M4.5 9h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="1.5" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9.5 5.5l3-2v7l-3-2" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 5l2.5 2.5L8 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Stage content ───────────────────────── */

const EVIDENCE_ITEMS = [
  { Icon: PdfIcon, name: "incident_report.pdf", type: "PDF" },
  { Icon: ImageIcon, name: "site_photo_03.jpg", type: "Image" },
  { Icon: NoteIcon, name: "field_notes.txt", type: "Note" },
  { Icon: VideoIcon, name: "footage_clip.mp4", type: "Video" },
];

function IntakeStage() {
  return (
    <div className="hd-stage">
      <p className="hd-stage__label">4 files attached</p>
      <div className="hd-chips">
        {EVIDENCE_ITEMS.map(({ Icon, name, type }, i) => (
          <div key={name} className="hd-chip" style={{ animationDelay: `${i * 0.12}s` }}>
            <span className="hd-chip__icon"><Icon /></span>
            <span className="hd-chip__name">{name}</span>
            <span className="hd-chip__type">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExtractionStage() {
  return (
    <div className="hd-stage">
      <p className="hd-stage__label">Extracted fields</p>

      {/* Summary card */}
      <div className="hd-summary-card" style={{ animationDelay: "0s" }}>
        <p className="hd-summary-card__text">
          Vehicle collision at loading dock, 14:32 hrs. Two parties involved. No injuries reported.
        </p>
        <div className="hd-badge-row">
          <span className="hd-field__badge hd-field__badge--copper">Severity: High</span>
          <span className="hd-field__badge hd-field__badge--neutral">Type: Incident</span>
        </div>
      </div>

      {/* 2-column metadata grid */}
      <div className="hd-field-grid" style={{ animationDelay: "0.18s" }}>
        <div className="hd-field-grid__item">
          <span className="hd-field__key">Date</span>
          <span className="hd-field__val">Mar 22, 2026</span>
        </div>
        <div className="hd-field-grid__item">
          <span className="hd-field__key">Location</span>
          <span className="hd-field__val">Loading Dock B</span>
        </div>
        <div className="hd-field-grid__item">
          <span className="hd-field__key">Entities</span>
          <span className="hd-field__val">2 parties</span>
        </div>
        <div className="hd-field-grid__item">
          <span className="hd-field__key">Source</span>
          <span className="hd-field__prov">report.pdf · p.2</span>
        </div>
      </div>

      {/* Timeline event */}
      <div className="hd-timeline-chip" style={{ animationDelay: "0.36s" }}>
        <span className="hd-timeline-chip__time">14:32</span>
        <span className="hd-timeline-chip__event">Impact recorded</span>
        <span className="hd-timeline-chip__src">footage_clip.mp4</span>
      </div>
    </div>
  );
}

const REVIEW_ITEMS = ["Timeline verified", "Severity confirmed", "Parties identified"];

function ReviewStage() {
  return (
    <div className="hd-stage hd-stage--centered">
      <p className="hd-stage__label">Review checklist</p>

      <div className="hd-checklist">
        {REVIEW_ITEMS.map((label, i) => (
          <div key={label} className="hd-check-row" style={{ animationDelay: `${i * 0.14}s` }}>
            <span className="hd-check-mark">
              <CheckIcon />
            </span>
            <span className="hd-check-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="hd-review-divider" style={{ animationDelay: "0.46s" }} />

      {/* Reviewer identity + field counts */}
      <div className="hd-reviewer-block" style={{ animationDelay: "0.54s" }}>
        <div className="hd-reviewer-block__header">
          <span className="hd-reviewer-block__name">J. Alvarez</span>
          <span className="hd-reviewer-block__role">Claims Adjuster</span>
        </div>
        <div className="hd-reviewer-block__meta">
          <span className="hd-meta-chip">4 fields confirmed</span>
          <span className="hd-meta-chip">0 edits</span>
        </div>
      </div>

      {/* Approval state */}
      <div className="hd-approval-block" style={{ animationDelay: "0.72s" }}>
        <span className="hd-approved-pill">Approved</span>
        <span className="hd-approval-block__ts">Mar 23, 2026 · 09:14</span>
      </div>
    </div>
  );
}

function ReportStage() {
  return (
    <div className="hd-stage">
      <p className="hd-stage__label">Case report</p>
      <div className="hd-report">
        <div className="hd-report__header">
          <span className="hd-report__id">RS-2026-0084</span>
          <span className="hd-export-pill">Ready to Export</span>
        </div>
        <div className="hd-report__rows">
          <div className="hd-report__row">
            <span>Status</span>
            <span className="hd-report__status-closed">Closed</span>
          </div>
          <div className="hd-report__row">
            <span>Reviewer</span>
            <span>J. Alvarez</span>
          </div>
          <div className="hd-report__row">
            <span>Approved</span>
            <span>Mar 23, 2026</span>
          </div>
        </div>
        <div className="hd-export-actions">
          <div className="hd-export-btn hd-export-btn--primary">Export PDF</div>
          <div className="hd-export-btn">Share Link</div>
        </div>
      </div>
    </div>
  );
}

/* ── HeroDemo ────────────────────────────── */

export function HeroDemo() {
  const [stage, setStage] = useState(2);
  const [panelKey, setPanelKey] = useState(0);
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setIsReduced(true);
      setStage(3);
      return;
    }

    const timer = setInterval(() => {
      setStage((s) => (s + 1) % 4);
      setPanelKey((k) => k + 1);
    }, STAGE_DURATION);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-demo">
      <div className="hero-demo__bar">
        <div className="hero-demo__dots">
          <div className="hero-demo__dot" />
          <div className="hero-demo__dot" />
          <div className="hero-demo__dot" />
        </div>
        <span className="hero-demo__bar-label">
          <span className="hero-demo__bar-step">{STAGE_META[stage].step}</span>
          {STAGE_META[stage].label}
        </span>
      </div>

      <div key={isReduced ? "static" : panelKey} className="hero-demo__panel">
        {stage === 0 && <IntakeStage />}
        {stage === 1 && <ExtractionStage />}
        {stage === 2 && <ReviewStage />}
        {stage === 3 && <ReportStage />}
      </div>

      <div className="hero-demo__footer">
        {STAGE_META.map((_, i) => (
          <div
            key={i}
            className={`hero-demo__pip${
              i === stage ? " hero-demo__pip--active" : i < stage ? " hero-demo__pip--done" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}
