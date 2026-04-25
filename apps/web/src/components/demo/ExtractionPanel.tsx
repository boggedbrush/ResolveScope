import { useState, useEffect, useRef, useMemo } from "react";
import { ProvenanceInspector } from "./ProvenanceInspector";
import type {
  ExtractionResult,
  EvidenceItem,
  SectionData,
  ExtractionSectionDef,
  CaseTemplate,
} from "../../types/case";

interface Props {
  extraction: ExtractionResult | null;
  isRunning: boolean;
  onRunExtraction: () => void;
  evidence: EvidenceItem[];
  template: CaseTemplate;
}

function fmtRunAt(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getEvidenceThumbLabel(item: EvidenceItem): string {
  if (item.mimeType === "text/csv") return "CSV";
  if (item.type === "note") return "NOTE";
  if (item.type === "document") return "DOC";
  return item.type.toUpperCase();
}

function ProvenanceTags({
  ids,
  evidence,
  onInspect,
}: {
  ids: string[];
  evidence: EvidenceItem[];
  onInspect: () => void;
}) {
  const sources = ids
    .map((id) => evidence.find((e) => e.id === id))
    .filter(Boolean) as EvidenceItem[];
  if (!sources.length) return null;

  const names = sources.map((item) => item.name.split(":")[0].trim());

  return (
    <div className="extraction-provenance" aria-label="Supported by">
      <span className="extraction-provenance__label">Supported by:</span>
      <button
        type="button"
        className="extraction-provenance__thumbs"
        onClick={onInspect}
        aria-label={`Inspect ${ids.length} supporting evidence item${ids.length !== 1 ? "s" : ""}`}
      >
        {sources.slice(0, 3).map((item) => (
          <span key={item.id} className="extraction-provenance__thumb" title={item.name}>
            {item.type === "image" && item.previewUrl ? (
              <img src={item.previewUrl} alt="" loading="lazy" />
            ) : (
              <span className="extraction-provenance__thumb-fallback">
                {getEvidenceThumbLabel(item)}
              </span>
            )}
          </span>
        ))}
        {sources.length > 3 && (
          <span className="extraction-provenance__thumb extraction-provenance__thumb--more">
            +{sources.length - 3}
          </span>
        )}
      </button>
      {names.map((n) => (
        <span key={n} className="extraction-provenance__tag">
          {n}
        </span>
      ))}
      <button
        className="extraction-provenance__inspect-btn"
        onClick={onInspect}
        aria-label={`Inspect ${ids.length} supporting evidence item${ids.length !== 1 ? "s" : ""}`}
        title="Inspect supporting evidence"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.25" />
          <path d="M8.5 8.5l2 2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
        Inspect
      </button>
    </div>
  );
}

// Returns a flat string representation of section content for streaming purposes
function getSectionText(data: SectionData): string {
  switch (data.type) {
    case "text":
      return data.content;
    case "list":
    case "ordered-list":
      return data.items.join("\n");
    case "timeline":
      return data.entries.map((e) => `${e.time} : ${e.event}`).join("\n");
    case "parties":
      return data.parties
        .map((p) => [p.role, p.name, p.contact].filter(Boolean).join(" · "))
        .join("\n");
    case "unit-info":
      return data.fields.map((f) => `${f.label}: ${f.value}`).join("\n");
    case "actions":
      return data.items
        .map((item) => {
          const meta = [item.owner, item.due ? `Due ${item.due}` : null]
            .filter(Boolean)
            .join(" · ");
          return meta ? `${item.action} (${meta})` : item.action;
        })
        .join("\n");
  }
}

// Render section body with streaming progress applied
function renderSectionBody(data: SectionData, progress: number, showCursor: boolean) {
  // progress: 0.0–1.0 fraction of content revealed
  switch (data.type) {
    case "text": {
      const total = data.content.length;
      const chars = Math.floor(total * progress);
      const visible = data.content.slice(0, chars);
      return (
        <p className="extraction-section__body">
          {visible}
          {showCursor && progress < 1 && (
            <span className="stream-cursor" aria-hidden="true" />
          )}
        </p>
      );
    }

    case "list":
    case "ordered-list": {
      const total = data.items.length;
      const visibleCount = Math.max(1, Math.ceil(total * progress));
      const Tag = data.type === "ordered-list" ? "ol" : "ul";
      const cls =
        data.type === "ordered-list"
          ? "extraction-list extraction-list--ordered"
          : "extraction-list";
      return (
        <Tag className={cls}>
          {data.items.slice(0, visibleCount).map((item, i) => {
            const isLast = i === visibleCount - 1 && progress < 1;
            const itemProgress = isLast
              ? ((total * progress) % 1 || 1)
              : 1;
            const chars = Math.floor(item.length * itemProgress);
            return (
              <li key={i}>
                {item.slice(0, chars)}
                {isLast && showCursor && (
                  <span className="stream-cursor" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </Tag>
      );
    }

    case "timeline": {
      const total = data.entries.length;
      const visibleCount = Math.max(1, Math.ceil(total * progress));
      return (
        <ol className="extraction-timeline">
          {data.entries.slice(0, visibleCount).map((entry, i) => {
            const isLast = i === visibleCount - 1 && progress < 1;
            const fullEvent = entry.event;
            const itemProgress = isLast
              ? ((total * progress) % 1 || 1)
              : 1;
            const chars = Math.floor(fullEvent.length * itemProgress);
            return (
              <li key={i} className="extraction-timeline__item">
                <span className="extraction-timeline__time">{entry.time}</span>
                <span className="extraction-timeline__event">
                  {fullEvent.slice(0, chars)}
                  {isLast && showCursor && (
                    <span className="stream-cursor" aria-hidden="true" />
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      );
    }

    case "parties": {
      const total = data.parties.length;
      const visibleCount = Math.max(1, Math.ceil(total * progress));
      return (
        <div className="extraction-parties">
          {data.parties.slice(0, visibleCount).map((p, i) => {
            const isLast = i === visibleCount - 1 && progress < 1;
            const itemProgress = isLast
              ? ((total * progress) % 1 || 1)
              : 1;
            const fullName = p.name;
            const chars = Math.floor(fullName.length * itemProgress);
            return (
              <div key={p.role} className="extraction-party">
                <span className="extraction-party__role">{p.role}</span>
                <span className="extraction-party__name">
                  {fullName.slice(0, chars)}
                  {isLast && showCursor && !p.contact && (
                    <span className="stream-cursor" aria-hidden="true" />
                  )}
                </span>
                {p.contact && itemProgress >= 1 && (
                  <span className="extraction-party__contact">{p.contact}</span>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    case "unit-info": {
      const total = data.fields.length;
      const visibleCount = Math.max(1, Math.ceil(total * progress));
      return (
        <dl className="extraction-vehicle">
          {data.fields.slice(0, visibleCount).map((f, i) => {
            const isLast = i === visibleCount - 1 && progress < 1;
            const itemProgress = isLast
              ? ((total * progress) % 1 || 1)
              : 1;
            const chars = Math.floor(f.value.length * itemProgress);
            return (
              <div key={f.label} className="extraction-vehicle__row">
                <dt>{f.label}</dt>
                <dd>
                  {f.value.slice(0, chars)}
                  {isLast && showCursor && (
                    <span className="stream-cursor" aria-hidden="true" />
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      );
    }

    case "actions": {
      const total = data.items.length;
      const visibleCount = Math.max(1, Math.ceil(total * progress));
      return (
        <ol className="extraction-actions">
          {data.items.slice(0, visibleCount).map((item, i) => {
            const isLast = i === visibleCount - 1 && progress < 1;
            const itemProgress = isLast
              ? ((total * progress) % 1 || 1)
              : 1;
            const chars = Math.floor(item.action.length * itemProgress);
            return (
              <li key={i} className="extraction-action">
                <span className="extraction-action__text">
                  {item.action.slice(0, chars)}
                  {isLast && showCursor && (
                    <span className="stream-cursor" aria-hidden="true" />
                  )}
                </span>
                {!isLast && (item.owner || item.due) && (
                  <div className="extraction-action__meta">
                    {item.owner && (
                      <span className="extraction-action__owner">{item.owner}</span>
                    )}
                    {item.due && (
                      <span className="extraction-action__due">Due {item.due}</span>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      );
    }
  }
}

// Hook: manages per-section streaming progress once extraction arrives
function useStreamingReveal(
  extraction: ExtractionResult | null,
  sectionDefs: ExtractionSectionDef[],
  skipAnimation: boolean
) {
  // sectionProgress[i] = 0.0–1.0
  const [sectionProgress, setSectionProgress] = useState<number[]>([]);
  const [activeSectionIdx, setActiveSectionIdx] = useState(-1);
  const [streamDone, setStreamDone] = useState(false);
  const rafRef = useRef<number | null>(null);
  const stateRef = useRef({ activeSectionIdx: -1, progress: [] as number[] });
  const extractionRef = useRef<ExtractionResult | null>(null);

  useEffect(() => {
    if (!extraction) {
      setSectionProgress([]);
      setActiveSectionIdx(-1);
      setStreamDone(false);
      extractionRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    // Only restart stream if extraction identity changed
    if (extractionRef.current === extraction) return;
    extractionRef.current = extraction;

    // Already-generated content: reveal instantly, no animation
    if (skipAnimation) {
      const n = sectionDefs.filter((def) => extraction.sections[def.key]).length;
      setSectionProgress(new Array(n).fill(1));
      setActiveSectionIdx(n);
      setStreamDone(true);
      return;
    }

    const sections = sectionDefs.filter((def) => extraction.sections[def.key]);
    const n = sections.length;
    const initial = new Array(n).fill(0);
    setSectionProgress(initial);
    setActiveSectionIdx(0);
    setStreamDone(false);
    stateRef.current = { activeSectionIdx: 0, progress: initial };

    // Base speed: chars per second across all section text, targeting ~3s total
    const allText = sections.map((def) => {
      const data = extraction.sections[def.key];
      return data ? getSectionText(data) : "";
    });
    const totalChars = allText.reduce((s, t) => s + t.length, 0);
    // Target: stream all content in ~2.5s, min 80 chars/s
    const charsPerSec = Math.max(120, totalChars / 2.5);

    let lastTime: number | null = null;
    let currentSection = 0;

    function finishStream() {
      const completed = new Array(n).fill(1);
      stateRef.current = { activeSectionIdx: n, progress: completed };
      setSectionProgress(completed);
      setActiveSectionIdx(n);
      setStreamDone(true);
    }

    function tick(now: number) {
      if (lastTime === null) {
        lastTime = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (currentSection >= n) {
        finishStream();
        return;
      }

      const data = extraction!.sections[sections[currentSection].key];
      if (!data) {
        currentSection++;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const sectionLen = allText[currentSection].length;
      // Slight jitter: ±20% speed variation to feel organic
      const jitter = 0.8 + Math.random() * 0.4;
      const charsThisFrame = charsPerSec * jitter * dt;
      const delta = sectionLen > 0 ? charsThisFrame / sectionLen : 1;

      // Keep section advancement outside React state updaters; StrictMode may
      // re-run them and skip the completed state that reveals provenance.
      const next = [...stateRef.current.progress];
      const newProg = Math.min(1, (next[currentSection] ?? 0) + delta);
      next[currentSection] = newProg;

      if (newProg >= 1) {
        currentSection++;
        stateRef.current = { activeSectionIdx: currentSection, progress: next };
        setActiveSectionIdx(currentSection);
      } else {
        stateRef.current = { activeSectionIdx: currentSection, progress: next };
      }

      setSectionProgress(next);

      if (currentSection < n) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        finishStream();
      }
    }

    // Brief initial delay to feel like the model is "thinking"
    const startTimer = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick);
    }, 150);

    return () => {
      clearTimeout(startTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [extraction, sectionDefs, skipAnimation]);

  return { sectionProgress, activeSectionIdx, streamDone };
}

function ExtractionSection({
  def,
  extraction,
  evidence,
  onInspect,
  progress,
  isCurrent,
  streamDone,
}: {
  def: ExtractionSectionDef;
  extraction: ExtractionResult;
  evidence: EvidenceItem[];
  onInspect: (def: ExtractionSectionDef, ids: string[]) => void;
  progress: number;
  isCurrent: boolean;
  streamDone: boolean;
}) {
  const data = extraction.sections[def.key];
  if (!data || progress === 0) return null;

  const provenanceKey = def.provenanceKey ?? def.key;
  const provenanceIds = extraction.provenance[provenanceKey] ?? [];
  const showCursor = isCurrent && !streamDone;
  const isDone = progress >= 1;

  return (
    <section className={`extraction-section${isCurrent && !streamDone ? " extraction-section--streaming" : ""}`}>
      <h4 className="extraction-section__title">{def.title}</h4>
      {renderSectionBody(data, progress, showCursor)}
      {isDone && provenanceIds.length > 0 && (
        <ProvenanceTags
          ids={provenanceIds}
          evidence={evidence}
          onInspect={() => onInspect(def, provenanceIds)}
        />
      )}
    </section>
  );
}

// Streaming loading state : shows a mock "thinking" animation before content arrives
function StreamingLoader({ label }: { label: string }) {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? "." : d + ".")), 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="extraction-loading" aria-live="polite" aria-busy="true">
      <div className="extraction-loading__spinner" aria-hidden="true" />
      <p className="extraction-loading__label">{label}{dots}</p>
      <p className="extraction-loading__sub">
        Analyzing evidence and structuring case brief
      </p>
    </div>
  );
}

export function ExtractionPanel({
  extraction,
  isRunning,
  onRunExtraction,
  evidence,
  template,
}: Props) {
  const [inspecting, setInspecting] = useState<{
    def: ExtractionSectionDef;
    ids: string[];
  } | null>(null);

  // Track whether extraction arrived fresh from a run in this session.
  // If extraction is already present on mount (returning to a completed demo),
  // skip the streaming animation and reveal content instantly.
  const ranInSessionRef = useRef(false);
  useEffect(() => {
    if (isRunning) ranInSessionRef.current = true;
  }, [isRunning]);
  const skipAnimation = extraction !== null && !ranInSessionRef.current;

  const visibleSectionDefs = useMemo(
    () =>
      extraction
        ? template.extractionSections.filter((def) => extraction.sections[def.key])
        : template.extractionSections,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [extraction, template.extractionSections]
  );

  const { sectionProgress, activeSectionIdx, streamDone } = useStreamingReveal(
    extraction,
    visibleSectionDefs,
    skipAnimation
  );

  if (isRunning) {
    return (
      <div className="demo-panel demo-panel--extraction">
        <StreamingLoader label="Running extraction" />
      </div>
    );
  }

  if (!extraction) {
    return (
      <div className="demo-panel demo-panel--extraction">
        <div className="extraction-empty">
          <div className="extraction-empty__icon" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect
                x="8"
                y="6"
                width="24"
                height="28"
                rx="3"
                stroke="#b85a30"
                strokeWidth="1.5"
              />
              <path
                d="M14 14h12M14 20h12M14 26h8"
                stroke="#b85a30"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="32" cy="32" r="6" fill="#b85a30" />
              <path
                d="M32 29v3l2 2"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h3 className="extraction-empty__title">Ready to extract</h3>
          <p className="extraction-empty__body">
            Run extraction to generate a structured case brief : incident
            summary, timeline, findings, and recommended actions.
          </p>
          <button
            className="btn btn--primary"
            onClick={onRunExtraction}
            aria-label="Run extraction on this case"
          >
            Run Extraction
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="demo-panel demo-panel--extraction">
        <div className="demo-panel__section-header">
          <h3 className="demo-panel__section-title">Case Brief</h3>
          {streamDone && (
            <span className="extraction-run-meta">
              Extracted {fmtRunAt(extraction.runAt)}
            </span>
          )}
          {!streamDone && (
            <span className="extraction-run-meta extraction-run-meta--streaming" aria-live="polite">
              Generating
              <span className="stream-indicator" aria-hidden="true" />
            </span>
          )}
        </div>

        <div className="extraction-sections">
          {visibleSectionDefs.map((def, i) => (
            <ExtractionSection
              key={def.key}
              def={def}
              extraction={extraction}
              evidence={evidence}
              onInspect={(d, ids) => setInspecting({ def: d, ids })}
              progress={sectionProgress[i] ?? 0}
              isCurrent={i === activeSectionIdx}
              streamDone={streamDone}
            />
          ))}
        </div>
      </div>

      {inspecting && (
        <ProvenanceInspector
          section={inspecting.def}
          evidenceIds={inspecting.ids}
          evidence={evidence}
          onClose={() => setInspecting(null)}
        />
      )}
    </>
  );
}
