import { useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { HeroDemo } from "../components/HeroDemo";
import { CodexBanner } from "../components/CodexBanner";
import { ThemeControl } from "../components/ThemeControl";
import { MobileNavMenu, type MobileNavItem } from "../components/MobileNavMenu";

const SpatialPreview = lazy(() =>
  import("../components/SpatialPreview").then((m) => ({
    default: m.SpatialPreview,
  }))
);

const LANDING_NAV_ITEMS: MobileNavItem[] = [
  { label: "How it works", href: "#proof" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Spatial Review", href: "#spatial" },
  { label: "Architecture", to: "/architecture" },
];

/* ═══════════════════════════════════════════
   Section data
   ═══════════════════════════════════════════ */

const CAPABILITIES = [
  {
    title: "Case workspace",
    body: "Create and manage cases by template. Assign status, priority, severity, and ownership from a single timeline view.",
    accent: false,
  },
  {
    title: "AI extraction",
    body: "Summarize documents into case briefs. Extract entities, dates, timelines, defects, and action items automatically.",
    accent: true,
  },
  {
    title: "Human review",
    body: "Inspect AI-generated fields before finalization. Use checklist approval and audit history to keep reviewer decisions visible.",
    accent: false,
  },
  {
    title: "Export and reporting",
    body: "Open stakeholder report views, print or save PDFs from the browser, and download approved JSON bundles.",
    accent: true,
  },
];

const CAP_ICONS = [
  /* 01 Case workspace: stacked layers */
  <svg key="layers" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="3" y="13.5" width="14" height="2.5" rx="1.25" fill="currentColor" opacity="0.35" />
    <rect x="3" y="8.75" width="14" height="2.5" rx="1.25" fill="currentColor" opacity="0.65" />
    <rect x="3" y="4" width="14" height="2.5" rx="1.25" fill="currentColor" />
  </svg>,
  /* 02 AI extraction: radiant spark */
  <svg key="spark" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2.5v3M10 14.5v3M2.5 10h3M14.5 10h3M4.7 4.7l2.12 2.12M13.18 13.18l2.12 2.12M15.3 4.7l-2.12 2.12M6.82 13.18l-2.12 2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="10" r="2.25" fill="currentColor" />
  </svg>,
  /* 03 Human review: inspector's eye */
  <svg key="eye" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M2 10c2.5-4.5 5-6.5 8-6.5s5.5 2 8 6.5c-2.5 4.5-5 6.5-8 6.5s-5.5-2-8-6.5z" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="1" fill="currentColor" />
  </svg>,
  /* 04 Export and reporting: document with outbound arrow */
  <svg key="export" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M8 4H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 4h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 4 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
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
    <main className="landing-page">
      {/* ── Nav ─────────────────────────── */}
      <nav className="nav nav--landing">
        <div className="container nav__inner">
          <div className="nav__zone nav__zone--left">
            <a href="#" className="nav__logo">
              <img src="/logo-mark.svg" alt="" aria-hidden="true" className="nav__logo-mark" />
              <span className="nav__logo-wordmark">Resolve<span>Scope</span></span>
            </a>
          </div>
          <div className="nav__zone nav__zone--center">
            <ul className="nav__links">
              <li>
                <a href="#proof">How it works</a>
              </li>
              <li>
                <a href="#capabilities">Capabilities</a>
              </li>
              <li>
                <a href="#spatial">Spatial Review</a>
              </li>
              <li className="nav__dropdown">
                <button
                  type="button"
                  className="nav__dropdown-trigger"
                  aria-haspopup="true"
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
                  <Link to="/architecture" role="menuitem">
                    System overview
                  </Link>
                  <Link to="/architecture#components" role="menuitem">
                    Core components
                  </Link>
                  <Link to="/architecture#infrastructure" role="menuitem">
                    Infrastructure
                  </Link>
                  <Link to="/architecture#ai-trust" role="menuitem">
                    AI trust model
                  </Link>
                </div>
              </li>
            </ul>
          </div>
          <div className="nav__zone nav__zone--right">
            <div className="nav__actions" role="group" aria-label="Primary actions">
              <Link to="/dashboard" className="btn btn--primary nav__cta">
                Try the Demo
              </Link>
              <ThemeControl className="nav__theme" />
              <MobileNavMenu items={LANDING_NAV_ITEMS} />
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────── */}
      <section className="hero">
        <div className="hero__banner-wrap">
          <CodexBanner />
        </div>
        <div className="hero__stage">
          <div className="hero__copy reveal">
            <h1 className="display-xl hero__headline">
              Turn scattered evidence into approved case files.
            </h1>
            <p className="body-lg hero__subtitle">
              ResolveScope turns scattered documents, photos, and field notes
              into structured case files: reviewed, approved, and ready to act
              on.
            </p>
            <div className="hero__actions">
              <Link to="/dashboard" className="btn btn--primary">
                Try the Demo <ArrowIcon />
              </Link>
              <a
                href="https://github.com/boggedbrush/ResolveScope?ref=resolvescope.pages.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--github-dark"
              >
                <GitHubIcon /> Explore the Repo
              </a>
            </div>
          </div>
          <div className="hero__visual reveal delay-1">
            <HeroDemo />
          </div>
        </div>
      </section>

      {/* ── Proof ───────────────────────── */}
      <section className="proof" id="proof">
        <div className="container">
          <div className="proof__header reveal">
            <p className="eyebrow">Evidence pipeline</p>
            <h2 className="display-lg">
              Raw evidence becomes a reviewable record
            </h2>
          </div>
          <div className="proof__panel reveal delay-1">

            {/* Input */}
            <div className="proof__col">
              <div className="proof__col-label">Evidence in</div>
              <ul className="proof__evidence-list">
                <li className="proof__evidence-item">
                  <span className="proof__file-badge">PDF</span>
                  Incident report: 2024-03-12.pdf
                </li>
                <li className="proof__evidence-item">
                  <span className="proof__file-badge proof__file-badge--img">IMG</span>
                  Site photo 001.jpg
                </li>
                <li className="proof__evidence-item">
                  <span className="proof__file-badge proof__file-badge--img">IMG</span>
                  Site photo 002.jpg
                </li>
                <li className="proof__evidence-item">
                  <span className="proof__file-badge proof__file-badge--vid">VID</span>
                  Dashcam clip.mp4
                </li>
                <li className="proof__evidence-item">
                  <span className="proof__file-badge proof__file-badge--note">NOTE</span>
                  Adjuster field notes.txt
                </li>
              </ul>
            </div>

            {/* Extracted */}
            <div className="proof__col proof__col--extracted">
              <div className="proof__col-label">Extracted</div>
              <div className="proof__fields">
                <span className="proof__field-label">Severity</span>
                <span className="proof__field-value">
                  <span className="proof__status-badge proof__status-badge--high">High</span>
                </span>
                <span className="proof__field-label">Status</span>
                <span className="proof__field-value">
                  <span className="proof__status-badge proof__status-badge--review">In review</span>
                </span>
                <span className="proof__field-label">Finding</span>
                <span className="proof__field-value">Rear-end collision. No injuries. Rear bumper damage confirmed in photos.</span>
                <span className="proof__field-label">Next steps</span>
                <span className="proof__field-value">Assign adjuster. Request repair estimate. Schedule inspection.</span>
              </div>
            </div>

            {/* Output */}
            <div className="proof__col">
              <div className="proof__col-label">Ready to act</div>
              <ul className="proof__output-list">
                <li className="proof__output-item">PDF case summary report</li>
                <li className="proof__output-item">Structured JSON bundle</li>
                <li className="proof__output-item">Local stakeholder report view</li>
                <li className="proof__output-item">Full audit trail preserved</li>
              </ul>
              <div className="proof__output-action">
                Approve &amp; export
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Capabilities ────────────────── */}
      <section className="capabilities" id="capabilities">
        <div className="container">
          <div className="capabilities__header reveal">
            <p className="eyebrow eyebrow--dark">Review loop</p>
            <h2 className="display-lg capabilities__title">
              Intake, extract, approve, export
            </h2>
          </div>
          <div className="capabilities__grid">
            {CAPABILITIES.map((c, i) => (
              <div
                key={c.title}
                className={`capability__card reveal delay-${(i % 3) + 1} ${c.accent ? "capability__card--forest" : "capability__card--copper"}`}
              >
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
              <p className="eyebrow eyebrow--dark">Spatial review</p>
              <h2 className="display-lg">
                See evidence <em>in context</em>
              </h2>
              <p className="spatial__overlay-body">
                Flat photos miss what matters. Annotations placed directly on
                assets, structures, and environments: so reviewers see the
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

      {/* ── Architecture CTA ─────────────── */}
      <section className="arch-cta">
        <div className="container arch-cta__inner reveal">
          <div className="arch-cta__text">
            <p className="eyebrow">System design</p>
            <h2 className="display-lg">
              Built for <em>real workflows</em>
            </h2>
            <p className="body-lg">
              ResolveScope is designed around a structured evidence pipeline:
              intake, extraction, review, and export: with a system architecture
              built to support it end to end.
            </p>
          </div>
          <Link to="/architecture" className="btn btn--primary arch-cta__btn">
            View the architecture
          </Link>
        </div>
      </section>

      {/* ── Final CTA ───────────────────── */}
      <section className="cta-final" id="cta">
        <div className="container">
          <p className="eyebrow reveal">Try the workflow</p>
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
            <a
              href="https://github.com/boggedbrush/ResolveScope?ref=resolvescope.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--github-dark"
            >
              <GitHubIcon /> Explore the Repo
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
                href="https://github.com/boggedbrush/ResolveScope?ref=resolvescope.pages.dev"
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
                href="https://github.com/boggedbrush/ResolveScope/blob/main/docs/how-i-built-this.md?ref=resolvescope.pages.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                How I built this
              </a>
            </li>
            <li>
              <a
                href="https://github.com/boggedbrush/ResolveScope/blob/main/docs/prompting-guide.md?ref=resolvescope.pages.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                Prompting guide
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </main>
  );
}
