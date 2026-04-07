import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeControl } from "../components/ThemeControl";

/* ═══════════════════════════════════════════
   Scroll reveal hook (matches Landing.tsx)
   ═══════════════════════════════════════════ */

function useScrollReveal() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const els = document.querySelectorAll(".reveal");

    if (prefersReduced) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    const timer = setTimeout(() => {
      document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, []);
}

/* ═══════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════ */

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8H13M13 8L9 4M13 8L9 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none">
      <path
        d="M2.5 6L5 8.5L9.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Section data
   ═══════════════════════════════════════════ */

const COMPONENTS = [
  {
    num: "01",
    title: "Case Workspace",
    body: "Template-driven case structure. Status, priority, severity, and ownership from a single timeline view.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="13.5" width="14" height="2.5" rx="1.25" fill="currentColor" opacity="0.35" />
        <rect x="3" y="8.75" width="14" height="2.5" rx="1.25" fill="currentColor" opacity="0.65" />
        <rect x="3" y="4" width="14" height="2.5" rx="1.25" fill="currentColor" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Evidence Library",
    body: "Upload PDFs, images, video, and freeform notes. Originals preserved with source linkage to every extracted field.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "AI Extraction Engine",
    body: "Summarize documents, extract entities and timelines, classify defects, and generate action items automatically.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2.5v3M10 14.5v3M2.5 10h3M14.5 10h3M4.7 4.7l2.12 2.12M13.18 13.18l2.12 2.12M15.3 4.7l-2.12 2.12M6.82 13.18l-2.12 2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="10" r="2.25" fill="currentColor" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Human Review Gate",
    body: "Every AI-generated field requires explicit human approval before finalization. Edits tracked with full audit history.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2 10c2.5-4.5 5-6.5 8-6.5s5.5 2 8 6.5c-2.5 4.5-5 6.5-8 6.5s-5.5-2-8-6.5z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Spatial Review",
    body: "Annotations placed directly on 360° environments and 3D assets. Pins tied to evidence entries and case findings.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="2.5" fill="currentColor" />
        <path d="M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "06",
    title: "Stakeholder Report",
    body: "Polished PDF output and shareable read-only case views. Structured JSON bundles for downstream systems.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M8 4H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 4h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 4 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

const CF_SERVICES = [
  {
    name: "Pages",
    tag: "Hosting",
    body: "Static asset delivery and SPA hosting. Zero cold starts for the frontend.",
  },
  {
    name: "Workers",
    tag: "Compute",
    body: "Edge-deployed serverless functions for API routing, evidence processing, and report generation.",
  },
  {
    name: "D1",
    tag: "Database",
    body: "SQLite-compatible relational store for case records, evidence metadata, and audit history.",
  },
  {
    name: "R2",
    tag: "Storage",
    body: "Object storage for raw evidence files — documents, images, and video originals.",
  },
  {
    name: "Queues",
    tag: "Async",
    body: "Async job dispatch for extraction pipelines. Decouples intake from processing.",
  },
  {
    name: "Durable Objects",
    tag: "State",
    body: "Coordinated state for active case sessions and real-time review collaboration.",
  },
  {
    name: "KV",
    tag: "Cache",
    body: "Fast lookups for user sessions, feature flags, and case index data.",
  },
];

const TRUST_STEPS = [
  {
    num: "01",
    title: "Summarize / Extract / Classify",
    body: "AI reads evidence and produces structured fields — summaries, timelines, severity scores, entity extractions. Never writes directly to the case record.",
  },
  {
    num: "02",
    title: "Human Approval Gate",
    body: "Every AI output enters a staged review queue. Reviewers inspect, edit, and explicitly approve each field before it becomes part of the case.",
  },
  {
    num: "03",
    title: "Provenance Linking",
    body: "Each approved field carries a source reference — the exact evidence item, page, or timestamp it was derived from. Nothing is orphaned.",
  },
  {
    num: "04",
    title: "Audit History",
    body: "Every state change, approval, and edit is recorded with actor identity and timestamp. The case file is a complete chain of custody.",
  },
];

const CODEX_ITEMS = [
  "Scaffolded evidence lifecycle types and case state machines from spec",
  "Generated component variants from existing design patterns without drift",
  "Explored architectural trade-offs for Cloudflare edge data routing",
  "Maintained consistency across extraction, review, and export surfaces",
];

/* ═══════════════════════════════════════════
   Architecture diagram (inline SVG)
   ═══════════════════════════════════════════ */

function ArchDiagram() {
  const nodes = [
    { label: "Evidence\nIntake", sub: "Upload & organize" },
    { label: "Extraction", sub: "AI structuring" },
    { label: "Human\nReview", sub: "Approval gate" },
    { label: "Audit &\nProvenance", sub: "Chain of custody" },
    { label: "Export /\nCase Bundle", sub: "PDF · JSON · Share" },
  ];

  const nodeW = 108;
  const nodeH = 64;
  const arrowGap = 32;
  const totalNodes = nodes.length;
  const totalW = totalNodes * nodeW + (totalNodes - 1) * arrowGap;
  const svgW = totalW + 80;
  const svgH = 160;
  const startX = 40;
  const nodeY = 32;

  return (
    <div className="arch-diagram-wrap reveal delay-2">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        width="100%"
        style={{ maxHeight: 200, overflow: "visible" }}
        aria-label="ResolveScope evidence lifecycle diagram"
      >
        <defs>
          <marker
            id="arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L8,3 z" fill="#b85a30" opacity="0.7" />
          </marker>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {nodes.map((node, i) => {
          const x = startX + i * (nodeW + arrowGap);
          const cx = x + nodeW / 2;
          const isLast = i === totalNodes - 1;

          // Split label lines
          const lines = node.label.split("\n");

          return (
            <g key={i}>
              {/* Node box */}
              <rect
                x={x}
                y={nodeY}
                width={nodeW}
                height={nodeH}
                rx={8}
                fill="#242320"
                stroke="#b85a30"
                strokeWidth={1.5}
                opacity={0.95}
              />
              {/* Top accent bar */}
              <rect
                x={x}
                y={nodeY}
                width={nodeW}
                height={3}
                rx={2}
                fill="#b85a30"
                opacity={0.6}
              />
              {/* Label */}
              {lines.map((line, li) => (
                <text
                  key={li}
                  x={cx}
                  y={nodeY + (lines.length === 1 ? 38 : 30 + li * 16)}
                  textAnchor="middle"
                  fill="#f2f0eb"
                  fontSize={11}
                  fontFamily="'Outfit', system-ui, sans-serif"
                  fontWeight={500}
                >
                  {line}
                </text>
              ))}
              {/* Sub label */}
              <text
                x={cx}
                y={nodeY + nodeH + 18}
                textAnchor="middle"
                fill="#9c978e"
                fontSize={9.5}
                fontFamily="'JetBrains Mono', monospace"
                letterSpacing="0.04em"
              >
                {node.sub}
              </text>

              {/* Arrow to next node */}
              {!isLast && (
                <line
                  x1={x + nodeW + 4}
                  y1={nodeY + nodeH / 2}
                  x2={x + nodeW + arrowGap - 4}
                  y2={nodeY + nodeH / 2}
                  stroke="#b85a30"
                  strokeWidth={1.5}
                  opacity={0.6}
                  markerEnd="url(#arrow)"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Page
   ═══════════════════════════════════════════ */

export function ArchitecturePage() {
  useScrollReveal();

  return (
    <>
      {/* ── Nav ─────────────────────────── */}
      <nav className="nav nav--landing">
        <div className="container nav__inner">
          <div className="nav__zone nav__zone--left">
            <a href="/" className="nav__logo">
              <img src="/logo-mark.svg" alt="" aria-hidden="true" className="nav__logo-mark" />
              <span className="nav__logo-wordmark">Resolve<span>Scope</span></span>
            </a>
          </div>
          <div className="nav__zone nav__zone--center">
            <div className="nav__item--active">
              <span className="nav__link-label">Architecture</span>
              <ul className="nav__subnav">
                <li><a href="#overview">Overview</a></li>
                <li><a href="#components">Components</a></li>
                <li><a href="#infrastructure">Infrastructure</a></li>
                <li><a href="#ai-trust">AI Trust</a></li>
                <li><a href="#codex">Codex</a></li>
              </ul>
            </div>
          </div>
          <div className="nav__zone nav__zone--right">
            <div className="nav__actions" role="group" aria-label="Primary actions">
              <Link to="/dashboard" className="btn btn--primary nav__cta">
                Try the Demo
              </Link>
              <ThemeControl className="nav__theme" />
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────── */}
      <section className="arch-hero">
        <div className="container">
          <div className="arch-hero__inner">
            <p className="section-label reveal">Architecture</p>
            <h1 className="display-xl reveal delay-1">
              Under the Hood
            </h1>
            <p className="body-lg arch-hero__sub reveal delay-2">
              A systems-level view of how ResolveScope processes evidence,
              enforces governance, and produces audit-ready outputs.
            </p>
            <div className="arch-hero__links reveal delay-3">
              <a href="#overview" className="btn btn--primary">
                Explore the system <ArrowIcon />
              </a>
              <Link to="/" className="btn btn--outline">
                Back to product
              </Link>
            </div>
          </div>
        </div>
        <div className="arch-hero__rule" />
      </section>

      {/* ── System Overview ─────────────── */}
      <section id="overview">
        <div className="container">
          <div className="arch-section-header reveal">
            <p className="section-label">System overview</p>
            <h2 className="display-lg">
              Evidence lifecycle, <em>end to end</em>
            </h2>
            <p className="body-lg arch-section-sub">
              Every piece of evidence passes through a defined, traceable lifecycle —
              from initial intake through structured extraction, human review,
              provenance recording, and final export.
            </p>
          </div>

          <div className="arch-diagram-card">
            <div className="arch-diagram-card__header">
              <span className="arch-diagram-card__label">Evidence pipeline</span>
              <span className="arch-diagram-card__meta">5 stages · human-gated</span>
            </div>
            <ArchDiagram />
          </div>

          <div className="arch-overview-grid reveal delay-1">
            <div className="arch-overview-item">
              <div className="arch-overview-item__num">01</div>
              <div>
                <strong>Evidence Intake</strong>
                <p>Documents, photos, video, and notes ingested into a structured case workspace. Originals preserved without modification.</p>
              </div>
            </div>
            <div className="arch-overview-item">
              <div className="arch-overview-item__num">02</div>
              <div>
                <strong>Extraction</strong>
                <p>AI reads evidence and produces structured fields. Summaries, timelines, entities, and severity assessments generated but not committed.</p>
              </div>
            </div>
            <div className="arch-overview-item">
              <div className="arch-overview-item__num">03</div>
              <div>
                <strong>Human Review</strong>
                <p>Reviewers inspect and approve every AI output before it enters the case record. No field is finalized without explicit human action.</p>
              </div>
            </div>
            <div className="arch-overview-item">
              <div className="arch-overview-item__num">04</div>
              <div>
                <strong>Audit & Provenance</strong>
                <p>All approvals, edits, and state changes are recorded with actor and timestamp. Source linkage preserved for every derived field.</p>
              </div>
            </div>
            <div className="arch-overview-item">
              <div className="arch-overview-item__num">05</div>
              <div>
                <strong>Export / Case Bundle</strong>
                <p>PDF stakeholder reports, shareable read-only views, and structured JSON bundles — all traceable to the evidence that produced them.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Platform Components ──────────── */}
      <section className="arch-components" id="components">
        <div className="container">
          <div className="arch-section-header reveal">
            <p className="section-label">Platform components</p>
            <h2 className="display-lg">
              Six surfaces, <em>one system</em>
            </h2>
          </div>
          <div className="arch-components__grid">
            {COMPONENTS.map((c, i) => (
              <div key={c.num} className={`arch-comp-card reveal delay-${(i % 3) + 1}`}>
                <div className="arch-comp-card__top">
                  <span className="arch-comp-card__num">{c.num}</span>
                  <span className="arch-comp-card__icon">{c.icon}</span>
                </div>
                <h3 className="arch-comp-card__title">{c.title}</h3>
                <p className="arch-comp-card__body">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cloudflare Infrastructure ────── */}
      <section className="arch-infra" id="infrastructure">
        <div className="container">
          <div className="arch-section-header reveal">
            <p className="section-label arch-label--forest">Infrastructure</p>
            <h2 className="display-lg arch-infra__heading">
              Cloudflare-native, <em>edge-first</em>
            </h2>
            <p className="body-lg arch-section-sub">
              ResolveScope is designed around Cloudflare's edge platform — stateless
              compute, distributed storage, and coordinated state running close to users.
            </p>
          </div>

          <div className="arch-cf-grid">
            {CF_SERVICES.map((s, i) => (
              <div key={s.name} className={`arch-cf-card reveal delay-${(i % 3) + 1}`}>
                <div className="arch-cf-card__top">
                  <span className="arch-cf-card__name">{s.name}</span>
                  <span className="arch-cf-card__tag">{s.tag}</span>
                </div>
                <p className="arch-cf-card__body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Trust Model ───────────────── */}
      <section id="ai-trust">
        <div className="container">
          <div className="arch-section-header reveal">
            <p className="section-label">AI routing & trust</p>
            <h2 className="display-lg">
              AI assists. <em>Humans decide.</em>
            </h2>
            <p className="body-lg arch-section-sub">
              Every AI output is provisional until a human approves it. The trust model
              is a four-step gate — not a setting, not a toggle.
            </p>
          </div>

          <div className="arch-trust-steps">
            {TRUST_STEPS.map((step, i) => (
              <div key={step.num} className={`arch-trust-step reveal delay-${i + 1}`}>
                <div className="arch-trust-step__connector">
                  <div className="arch-trust-step__node">{step.num}</div>
                  {i < TRUST_STEPS.length - 1 && (
                    <div className="arch-trust-step__line" />
                  )}
                </div>
                <div className="arch-trust-step__content">
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Built with Codex ─────────────── */}
      <section className="arch-codex" id="codex">
        <div className="container">
          <div className="arch-codex__grid reveal">
            <div className="arch-codex__left">
              <p className="section-label">Implementation</p>
              <h2 className="display-lg">
                Built with <em>Codex</em>
              </h2>
              <p className="body-lg">
                Codex served as an implementation multiplier throughout the build —
                not a gimmick, but a practical way to hold systems-level design in
                mind while shipping working code fast.
              </p>
            </div>
            <div className="arch-codex__right">
              <ul className="arch-codex__list">
                {CODEX_ITEMS.map((item) => (
                  <li key={item}>
                    <span className="mvp__check"><CheckIcon /></span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="arch-codex__note">
                Every output was reviewed, edited, and approved by the builder before
                merge — the same human-review model ResolveScope enforces for
                AI-generated case data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────── */}
      <section className="cta-final">
        <div className="container">
          <p className="section-label reveal">Explore</p>
          <h2 className="display-lg reveal delay-1">
            See the system <em>in action</em>
          </h2>
          <p className="body-lg reveal delay-2">
            The demo cases walk through real evidence intake, AI extraction,
            human review, and stakeholder export.
          </p>
          <div className="cta-final__actions reveal delay-3">
            <Link to="/dashboard" className="btn btn--primary">
              Open Demo <ArrowIcon />
            </Link>
            <Link to="/" className="btn btn--outline">
              Back to product
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────── */}
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__logo">
            Resolve<span>Scope</span>
          </div>
          <p className="footer__text">
            Evidence-to-action infrastructure. MIT License.
          </p>
          <ul className="footer__links">
            <li><a href="#">GitHub</a></li>
            <li><a href="#">Documentation</a></li>
          </ul>
        </div>
      </footer>
    </>
  );
}
