import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeControl } from "../components/ThemeControl";
import { CodexBanner } from "../components/CodexBanner";
import { MobileNavMenu, type MobileNavItem } from "../components/MobileNavMenu";

const ARCHITECTURE_NAV_ITEMS: MobileNavItem[] = [
  { label: "How it works", to: "/#proof" },
  { label: "Capabilities", to: "/#capabilities" },
  { label: "Spatial Review", to: "/#spatial" },
  { label: "Architecture", to: "/architecture" },
  { label: "Challenge", to: "/codex-creator-challenge" },
  { label: "Creator", to: "/creator" },
];

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

/* ═══════════════════════════════════════════
   Section data
   ═══════════════════════════════════════════ */

const COMPONENTS = [
  {
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
    title: "Stakeholder Report",
    body: "Browser print/save report views and approved structured JSON bundles for downstream review.",
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
    body: "Static SPA delivery for the frontend.",
  },
  {
    name: "Workers",
    tag: "Compute",
    body: "API routing, evidence processing, and report generation at the edge.",
  },
  {
    name: "D1",
    tag: "Database",
    body: "Case records, evidence metadata, and audit history.",
  },
  {
    name: "R2",
    tag: "Storage",
    body: "Raw documents, images, and video originals.",
  },
  {
    name: "Queues",
    tag: "Async",
    body: "Async extraction jobs decoupled from intake.",
  },
  {
    name: "Durable Objects",
    tag: "State",
    body: "Active case session and review state.",
  },
  {
    name: "KV",
    tag: "Cache",
    body: "Fast lookups for sessions, flags, and case indexes.",
  },
];

const INFRA_MAP = [
  {
    stage: "Client",
    note: "The public application loads quickly and keeps the browser experience simple.",
    services: ["Pages"],
  },
  {
    stage: "Edge work",
    note: "Requests, extraction jobs, and report generation move through the edge runtime.",
    services: ["Workers", "Queues"],
  },
  {
    stage: "Case state",
    note: "Case records, active sessions, and fast lookup data stay separated by responsibility.",
    services: ["D1", "Durable Objects", "KV"],
  },
  {
    stage: "Evidence",
    note: "Original evidence files remain in object storage while records keep source references.",
    services: ["R2"],
  },
];

function getCloudflareService(name: string) {
  const service = CF_SERVICES.find((s) => s.name === name);

  if (!service) {
    throw new Error(`Unknown Cloudflare service: ${name}`);
  }

  return service;
}

const TRUST_STEPS = [
  {
    num: "01",
    title: "Summarize / Extract / Classify",
    body: "AI reads evidence and produces structured fields : summaries, timelines, severity scores, entity extractions. Never writes directly to the case record.",
  },
  {
    num: "02",
    title: "Human Approval Gate",
    body: "Every AI output enters a staged review queue. Reviewers inspect, edit, and explicitly approve each field before it becomes part of the case.",
  },
  {
    num: "03",
    title: "Provenance Linking",
    body: "Each approved field carries a source reference : the exact evidence item, page, or timestamp it was derived from. Nothing is orphaned.",
  },
  {
    num: "04",
    title: "Audit History",
    body: "Every state change, approval, and edit is recorded with actor identity and timestamp. The case file is a complete chain of custody.",
  },
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
    { label: "Export /\nCase Bundle", sub: "Report · JSON" },
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
    <main className="arch-page">
      {/* ── Nav ─────────────────────────── */}
      <nav className="nav nav--landing">
        <div className="container nav__inner">
          <div className="nav__zone nav__zone--left">
            <Link to="/" className="nav__logo">
              <img src="/logo-mark.svg" alt="" aria-hidden="true" className="nav__logo-mark" />
              <span className="nav__logo-wordmark">Resolve<span>Scope</span></span>
            </Link>
          </div>
          <div className="nav__zone nav__zone--center">
            <ul className="nav__links">
              <li>
                <Link to="/#proof">How it works</Link>
              </li>
              <li>
                <Link to="/#capabilities">Capabilities</Link>
              </li>
              <li>
                <Link to="/#spatial">Spatial Review</Link>
              </li>
              <li className="nav__dropdown nav__dropdown--active">
                <button
                  type="button"
                  className="nav__dropdown-trigger"
                  aria-haspopup="true"
                  aria-current="page"
                >
                  Architecture
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 4.5 6 7.5l3-3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div className="nav__dropdown-menu" role="menu">
                  <a href="#overview" role="menuitem">
                    System overview
                  </a>
                  <a href="#components" role="menuitem">
                    Core components
                  </a>
                  <a href="#infrastructure" role="menuitem">
                    Infrastructure
                  </a>
                  <a href="#ai-trust" role="menuitem">
                    AI trust model
                  </a>
                </div>
              </li>
              <li>
                <Link to="/creator">Creator</Link>
              </li>
            </ul>
          </div>
          <div className="nav__zone nav__zone--right">
            <div className="nav__actions" role="group" aria-label="Primary actions">
              <Link to="/dashboard" className="btn btn--primary nav__cta">
                Try the Demo
              </Link>
              <ThemeControl className="nav__theme" />
              <MobileNavMenu items={ARCHITECTURE_NAV_ITEMS} />
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────── */}
      <section className="arch-hero">
        <div className="container">
          <div className="arch-hero__inner">
            <div className="arch-hero__copy">
              <p className="eyebrow reveal">System architecture</p>
              <h1 className="display-xl arch-hero__title reveal delay-1">
                A governed evidence pipeline, built for review.
              </h1>
              <p className="body-lg arch-hero__sub reveal delay-2">
                ResolveScope turns loose evidence into structured case files
                through explicit intake, extraction, human approval,
                provenance, and export boundaries.
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
            <div className="arch-hero__artifact reveal delay-2" aria-hidden="true">
              <div className="arch-artifact__bar">
                <span>case-pipeline.yaml</span>
                <span>human-gated</span>
              </div>
              <div className="arch-artifact__body">
                <span>intake:</span>
                <strong>evidence.originals.preserve()</strong>
                <span>extract:</span>
                <strong>ai.draft_fields()</strong>
                <span>review:</span>
                <strong>approval.required = true</strong>
                <span>export:</span>
                <strong>bundle.only_after_approval()</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── System Overview ─────────────── */}
      <section id="overview">
        <div className="container">
          <div className="arch-section-header reveal">
            <p className="eyebrow">Evidence lifecycle</p>
            <h2 className="display-lg">
              Evidence lifecycle, <em>end to end</em>
            </h2>
            <p className="body-lg arch-section-sub">
              Every piece of evidence passes through a defined, traceable lifecycle:
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
        </div>
      </section>

      {/* ── Platform Components ──────────── */}
      <section className="arch-components" id="components">
        <div className="container">
          <div className="arch-section-header arch-section-header--compact reveal">
            <p className="eyebrow">Platform components</p>
            <h2 className="display-lg">
              Fewer moving parts, <em>clearer boundaries</em>
            </h2>
            <p className="body-lg arch-section-sub">
              Each surface owns one job in the case lifecycle, so evidence,
              review decisions, spatial context, and exports stay traceable.
            </p>
          </div>
          <ol className="arch-component-ledger reveal delay-1">
            {COMPONENTS.map((c, index) => (
              <li key={c.title} className="arch-component-row">
                <div className="arch-component-row__index">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i aria-hidden="true">{c.icon}</i>
                </div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Cloudflare Infrastructure ────── */}
      <section className="arch-infra" id="infrastructure">
        <div className="container">
          <div className="arch-section-header reveal">
            <p className="eyebrow arch-label--forest">Infrastructure</p>
            <h2 className="display-lg arch-infra__heading">
              Cloudflare-native, <em>edge-first</em>
            </h2>
            <p className="body-lg arch-section-sub">
              ResolveScope is designed around Cloudflare's edge platform: stateless
              compute, distributed storage, and coordinated state running close to users.
            </p>
          </div>

          <div className="arch-wiremap reveal delay-1">
            {INFRA_MAP.map((group) => (
              <article key={group.stage} className="arch-wiremap__lane">
                <div className="arch-wiremap__stage">
                  <span>{group.stage}</span>
                  <p>{group.note}</p>
                </div>
                <div className="arch-wiremap__services">
                  {group.services.map((serviceName) => {
                    const service = getCloudflareService(serviceName);

                    return (
                      <article key={service.name} className="arch-wiremap-service">
                        <div className="arch-wiremap-service__header">
                          <h3>{service.name}</h3>
                          <span>{service.tag}</span>
                        </div>
                        <p>{service.body}</p>
                      </article>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>

          <div className="arch-infra-strip reveal delay-3">
            {[
              ["intake", "browser"],
              ["process", "edge"],
              ["preserve", "storage"],
              ["review", "human gate"],
              ["export", "bundle"],
            ].map(([label, detail]) => (
              <div key={label} className="arch-infra-strip__cell">
                <span>{label}</span>
                <strong>{detail}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Trust Model ───────────────── */}
      <section id="ai-trust">
        <div className="container">
          <div className="arch-section-header reveal">
            <p className="eyebrow">AI routing and trust</p>
            <h2 className="display-lg">
              AI assists. <em>Humans decide.</em>
            </h2>
            <p className="body-lg arch-section-sub">
              Every AI output is provisional until a human approves it. The trust model
              is a four-step gate: not a setting, not a toggle.
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

      {/* ── Codex Banner ────────────────── */}
      <section className="arch-codex-banner">
        <div className="container">
          <CodexBanner variant="arch" />
        </div>
      </section>

      {/* ── Final CTA ───────────────────── */}
      <section className="cta-final">
        <div className="container">
          <p className="eyebrow reveal">Explore</p>
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
            Evidence-to-action infrastructure. OpenAI Handshake Codex Creator Challenge entry by Carleton Lees. MIT License.
          </p>
          <ul className="footer__links">
            <li>
              <a
                href="https://github.com/boggedbrush/ResolveScope?ref=resolvescope.pages.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <Link to="/">Product</Link>
            </li>
            <li>
              <Link to="/codex-creator-challenge">Challenge entry</Link>
            </li>
            <li>
              <Link to="/creator">Creator</Link>
            </li>
          </ul>
        </div>
      </footer>
    </main>
  );
}
