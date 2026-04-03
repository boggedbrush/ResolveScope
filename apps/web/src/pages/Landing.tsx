import { useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";

const SpatialPreview = lazy(() =>
  import("../components/SpatialPreview").then((m) => ({
    default: m.SpatialPreview,
  }))
);

/* ═══════════════════════════════════════════
   Section data
   ═══════════════════════════════════════════ */

const PAIN_POINTS = [
  {
    title: "Evidence lives everywhere",
    body: "Documents in shared drives. Photos in chat threads. Notes in inboxes. Nothing connects to the decision it supports.",
  },
  {
    title: "Review takes too long",
    body: "Manual summarization, repeated handoffs, inconsistent formatting. Every case starts from scratch — every reviewer reinvents the process.",
  },
  {
    title: "Audit trails don't exist",
    body: "When decisions need to be defensible, there is no clear record of what evidence was reviewed, by whom, or when.",
  },
];

const FLOW_STEPS = [
  {
    num: "01",
    title: "Collect",
    body: "Upload documents, images, video, and notes into a single case workspace organized by template.",
  },
  {
    num: "02",
    title: "Extract",
    body: "AI structures the evidence into timelines, summaries, severity assessments, and recommended actions.",
  },
  {
    num: "03",
    title: "Review",
    body: "Human reviewers validate, edit, and approve every output before it becomes final. Nothing ships unreviewed.",
  },
  {
    num: "04",
    title: "Export",
    body: "Generate polished PDF reports, structured JSON bundles, and shareable read-only case views for stakeholders.",
  },
];

const CAPABILITIES = [
  {
    title: "Case workspace",
    body: "Create and manage cases by template. Assign status, priority, severity, and ownership from a single timeline view.",
    accent: false,
    num: "01",
  },
  {
    title: "Evidence library",
    body: "Upload PDFs, images, videos, and freeform notes. Preserve originals and maintain source linkage to every extracted field.",
    accent: true,
    num: "02",
  },
  {
    title: "AI extraction",
    body: "Summarize documents into case briefs. Extract entities, dates, timelines, defects, and action items automatically.",
    accent: false,
    num: "03",
  },
  {
    title: "Human review",
    body: "Inspect AI-generated fields before finalization. Edit structured outputs with explicit audit history and role-based approval.",
    accent: true,
    num: "04",
  },
  {
    title: "Spatial annotation",
    body: "Review evidence in 360-degree or lightweight 3D scenes. Place pins and annotations directly on assets and environments.",
    accent: false,
    num: "05",
  },
  {
    title: "Export and reporting",
    body: "Generate polished PDF reports and JSON bundles. Create shareable links for external stakeholders and downstream systems.",
    accent: true,
    num: "06",
  },
];

const CAP_ICONS = [
  /* 01 Case workspace — stacked layers */
  <svg key="layers" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="3" y="13.5" width="14" height="2.5" rx="1.25" fill="currentColor" opacity="0.35" />
    <rect x="3" y="8.75" width="14" height="2.5" rx="1.25" fill="currentColor" opacity="0.65" />
    <rect x="3" y="4" width="14" height="2.5" rx="1.25" fill="currentColor" />
  </svg>,
  /* 02 Evidence library — 2×2 archive grid */
  <svg key="grid" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
  /* 03 AI extraction — radiant spark */
  <svg key="spark" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2.5v3M10 14.5v3M2.5 10h3M14.5 10h3M4.7 4.7l2.12 2.12M13.18 13.18l2.12 2.12M15.3 4.7l-2.12 2.12M6.82 13.18l-2.12 2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="10" r="2.25" fill="currentColor" />
  </svg>,
  /* 04 Human review — inspector's eye */
  <svg key="eye" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M2 10c2.5-4.5 5-6.5 8-6.5s5.5 2 8 6.5c-2.5 4.5-5 6.5-8 6.5s-5.5-2-8-6.5z" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="1" fill="currentColor" />
  </svg>,
  /* 05 Spatial annotation — crosshair with pin */
  <svg key="crosshair" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="2.5" fill="currentColor" />
    <path d="M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  /* 06 Export and reporting — document with outbound arrow */
  <svg key="export" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M8 4H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 4h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 4 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
];

const WORKFLOWS = [
  {
    domain: "Insurance",
    title: "Claims triage",
    body: "Upload incident evidence, summarize events, classify severity, and generate review-ready case reports for adjusters and stakeholders.",
  },
  {
    domain: "Fleet & Safety",
    title: "Incident review",
    body: "Standardize incident intake across drivers and field teams. Track evidence, build timelines, and accelerate escalation workflows.",
  },
  {
    domain: "Quality",
    title: "Defect review",
    body: "Document product issues with visual evidence, assign severity against structured criteria, and preserve a defensible audit trail.",
  },
  {
    domain: "Construction",
    title: "Site inspections",
    body: "Convert field photos and notes into structured findings tied to physical assets. Pin issues to locations and track remediation.",
  },
  {
    domain: "Operations",
    title: "Decision support",
    body: "Standardize intake, govern review flows, and ensure every operational decision traces back to the evidence that informed it.",
  },
];

const MVP_ITEMS = [
  "Case workspace with template-driven structure",
  "Evidence upload and organization across file types",
  "AI-assisted summarization and extraction",
  "Structured fields with human review and approval",
  "Spatial annotation for visual evidence",
  "PDF and JSON export for stakeholders",
  "Seeded demo cases for evaluation",
];

/* ═══════════════════════════════════════════
   Scroll reveal hook
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
      { threshold: 0.05, rootMargin: "0px 0px 0px 0px" }
    );

    // Small delay to ensure layout is settled before observing
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
   Icons (inline SVG)
   ═══════════════════════════════════════════ */

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
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

function GitHubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
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
   Landing
   ═══════════════════════════════════════════ */

export function Landing() {
  useScrollReveal();

  return (
    <>
      {/* ── Nav ─────────────────────────── */}
      <nav className="nav">
        <div className="container nav__inner">
          <a href="#" className="nav__logo">
            Resolve<span>Scope</span>
          </a>
          <ul className="nav__links">
            <li>
              <a href="#problem">Problem</a>
            </li>
            <li>
              <a href="#how">How it works</a>
            </li>
            <li>
              <a href="#capabilities">Capabilities</a>
            </li>
            <li>
              <a href="#workflows">Workflows</a>
            </li>
            <li>
              <a href="#spatial">Spatial</a>
            </li>
            <li>
              <Link to="/architecture">Architecture</Link>
            </li>
          </ul>
          <div className="nav__actions">
<Link to="/dashboard" className="btn btn--primary nav__cta">
              Try the Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────── */}
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <p className="hero__challenge-banner">
              OpenAI × Handshake Codex Creator Challenge — 2026 entry
            </p>
            <h1 className="display-xl">
              Evidence
              <br />
              becomes <em>action.</em>
            </h1>
            <p className="body-lg hero__subtitle">
              ResolveScope turns scattered documents, photos, and field notes
              into structured case files — reviewed, approved, and ready to act
              on.
            </p>
            <div className="hero__actions">
              <Link to="/dashboard" className="btn btn--primary">
                Try the Demo <ArrowIcon />
              </Link>
              <a
                href="https://github.com/boggedbrush/ResolveScope"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--github"
              >
                <GitHubIcon /> Explore the Repo
              </a>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__mockup">
              <div className="hero__mockup-bar">
                <div className="hero__mockup-dot" />
                <div className="hero__mockup-dot" />
                <div className="hero__mockup-dot" />
              </div>
              <div className="hero__mockup-body">
                <div className="hero__mockup-sidebar">
                  <div className="hero__mockup-nav-item" />
                  <div className="hero__mockup-nav-item--active hero__mockup-nav-item" />
                  <div className="hero__mockup-nav-item" />
                  <div className="hero__mockup-nav-item" />
                  <div className="hero__mockup-nav-item" />
                </div>
                <div className="hero__mockup-content">
                  <div className="hero__mockup-line hero__mockup-line--accent" />
                  <div className="hero__mockup-line" />
                  <div className="hero__mockup-line hero__mockup-line--short" />
                  <div className="hero__mockup-card">
                    <div className="hero__mockup-badge" />
                    <div className="hero__mockup-line" />
                    <div className="hero__mockup-line hero__mockup-line--short" />
                  </div>
                  <div className="hero__mockup-card">
                    <div className="hero__mockup-badge" />
                    <div className="hero__mockup-line" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pain ────────────────────────── */}
      <section className="pain" id="problem">
        <div className="container">
          <div className="pain__header reveal">
            <p className="section-label">The problem</p>
            <h2 className="display-lg">
              Decisions made from <em>scattered evidence</em>
            </h2>
          </div>
          <div className="pain__list">
            {PAIN_POINTS.map((p, i) => (
              <div
                key={p.title}
                className={`pain__row reveal delay-${i + 1}`}
              >
                <div className="pain__row-number">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="pain__row-content">
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform ────────────────────── */}
      <section id="how">
        <div className="container">
          <div className="platform__header reveal">
            <p className="section-label">The platform</p>
            <h2 className="display-lg">
              One workspace from <em>evidence to export</em>
            </h2>
            <p className="body-lg">
              ResolveScope brings evidence intake, AI-assisted extraction, human
              review, and export into a single case-centered workspace. No more
              scattered files, manual summaries, or invisible audit trails.
            </p>
          </div>

          {/* Flow */}
          <div className="flow__timeline">
            <div className="flow__connector-line" />
            {FLOW_STEPS.map((s, i) => (
              <div
                key={s.num}
                className={`flow__step reveal delay-${i + 1}`}
              >
                <div className="flow__step-node">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capabilities ────────────────── */}
      <section className="capabilities" id="capabilities">
        <div className="container">
          <div className="capabilities__header reveal">
            <p className="section-label section-label--light">Core capabilities</p>
            <h2 className="display-lg capabilities__title">
              Built for <em>structured review</em>
            </h2>
          </div>
          <div className="capabilities__grid">
            {CAPABILITIES.map((c, i) => (
              <div
                key={c.title}
                className={`capability__card reveal delay-${(i % 3) + 1} ${c.accent ? "capability__card--forest" : "capability__card--copper"}`}
              >
                <span className="capability__num">{c.num}</span>
                <div
                  className={`capability__icon${c.accent ? " capability__icon--green" : ""}`}
                >
                  {CAP_ICONS[i]}
                </div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflows ───────────────────── */}
      <section id="workflows">
        <div className="container">
          <div className="workflows__header reveal">
            <p className="section-label">Workflows</p>
            <h2 className="display-lg">
              Built for teams that need <em>answers fast</em>
            </h2>
            <p className="body-lg">
              The same platform adapts to different operational contexts —
              insurance, fleet safety, quality, construction, and beyond.
            </p>
          </div>
          <div className="workflows__table">
            {WORKFLOWS.map((w, i) => (
              <div
                key={w.domain}
                className={`workflow__row reveal delay-${i + 1}`}
              >
                <span className="workflow__row-domain">{w.domain}</span>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Spatial ─────────────────────── */}
      <section className="spatial" id="spatial">
        <div className="spatial__full reveal">
          <div className="spatial__toolbar">
            <div className="spatial__toolbar-left">
              <span className="spatial__toolbar-badge">3D</span>
              <span className="spatial__toolbar-title">Spatial Review</span>
            </div>
            <span className="spatial__toolbar-meta">
              4 annotations
            </span>
          </div>
          <div className="spatial__canvas-wrap">
            <Suspense fallback={null}>
              <SpatialPreview />
            </Suspense>
            <div className="spatial__overlay">
              <p className="section-label section-label--light">
                Spatial review
              </p>
              <h2 className="display-lg">
                See evidence <em>in context</em>
              </h2>
              <p className="spatial__overlay-body">
                Flat photos miss what matters. Annotations placed directly on
                assets, structures, and environments — so reviewers see the
                full picture.
              </p>
            </div>
          </div>
          <div className="spatial__statusbar">
            <span>click a pin to inspect</span>
            <span>drag to orbit</span>
          </div>
        </div>
      </section>

      {/* ── MVP ─────────────────────────── */}
      <section className="mvp">
        <div className="container mvp__grid">
          <div className="mvp__content reveal">
            <p className="section-label">First release</p>
            <h2 className="display-lg">
              What we're <em>building first</em>
            </h2>
            <p className="body-lg">
              A focused first version that delivers the full
              evidence-to-action loop — intake, extraction, review, and export —
              for one strong case workspace.
            </p>
          </div>
          <ul className="mvp__list reveal delay-1">
            {MVP_ITEMS.map((item) => (
              <li key={item}>
                <span className="mvp__check">
                  <CheckIcon />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Final CTA ───────────────────── */}
      <section className="cta-final" id="cta">
        <div className="container">
          <p className="section-label reveal">Ready to start</p>
          <h2 className="display-lg reveal delay-1">
            The operational layer between
            <br />
            <em>raw evidence</em> and <em>clear action</em>
          </h2>
          <p className="body-lg reveal delay-2">
            Stop building decisions from scattered files. Start building them
            from structured, reviewable, exportable case files.
          </p>
          <div className="cta-final__actions reveal delay-3">
            <Link to="/dashboard" className="btn btn--primary">
              Try the Demo <ArrowIcon />
            </Link>
            <a href="#how" className="btn btn--outline">
              See how it works
            </a>
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
            Evidence-to-action infrastructure. Built for the OpenAI × Handshake Codex Creator Challenge. MIT License.
          </p>
          <ul className="footer__links">
            <li>
              <a
                href="https://github.com/boggedbrush/ResolveScope"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <Link to="/architecture">Architecture</Link>
            </li>
            <li>
              <a
                href="https://github.com/boggedbrush/ResolveScope/blob/main/docs/how-i-built-this.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                How I built this
              </a>
            </li>
            <li>
              <a
                href="https://github.com/boggedbrush/ResolveScope/blob/main/docs/prompting-guide.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Prompting guide
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
