import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeControl } from "../components/ThemeControl";
import { MobileNavMenu, type MobileNavItem } from "../components/MobileNavMenu";

const CREATOR_NAV_ITEMS: MobileNavItem[] = [
  { label: "How it works", to: "/#proof" },
  { label: "Capabilities", to: "/#capabilities" },
  { label: "Spatial Review", to: "/#spatial" },
  { label: "Architecture", to: "/architecture" },
  { label: "Creator", to: "/creator" },
];

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
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    const timer = window.setTimeout(() => {
      document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    }, 100);

    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, []);
}

export function CreatorPage() {
  useScrollReveal();

  return (
    <main className="arch-page creator-page">
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
              <li>
                <Link to="/creator" aria-current="page">
                  Creator
                </Link>
              </li>
            </ul>
          </div>
          <div className="nav__zone nav__zone--right">
            <div className="nav__actions" role="group" aria-label="Primary actions">
              <Link to="/dashboard" className="btn btn--primary nav__cta">
                Try the Demo
              </Link>
              <ThemeControl className="nav__theme" />
              <MobileNavMenu items={CREATOR_NAV_ITEMS} />
            </div>
          </div>
        </div>
      </nav>

      <section className="arch-hero">
        <div className="container">
          <div className="arch-hero__inner">
            <div className="arch-hero__copy">
              <p className="eyebrow reveal">Creator</p>
              <h1 className="display-xl arch-hero__title reveal delay-1">
                Carleton Lees, creator of ResolveScope.
              </h1>
              <p className="body-lg arch-hero__sub reveal delay-2">
                Carleton Lees created ResolveScope as an evidence-to-action
                product concept for the OpenAI Handshake Codex Creator
                Challenge, with a focus on credible review workflows and
                maintainable demo scope.
              </p>
              <div className="arch-hero__links reveal delay-3">
                <Link to="/codex-creator-challenge" className="btn btn--primary">
                  Challenge entry
                </Link>
                <Link to="/" className="btn btn--outline">
                  Product overview
                </Link>
              </div>
            </div>
            <div className="creator-portrait-card reveal delay-2">
              <img
                src="/assets/carleton-lees-portrait.jpg"
                alt="Portrait of Carleton Lees, creator of ResolveScope"
                className="creator-portrait-card__image"
              />
              <div className="creator-portrait-card__caption">
                <span>Creator</span>
                <strong>Carleton Lees</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="creator-interest" id="overview">
        <div className="container">
          <div className="arch-section-header creator-section-header reveal">
            <h2 className="display-lg">
              Product judgment stayed <em>human-owned</em>
            </h2>
            <p className="body-lg arch-section-sub">
              ResolveScope uses Codex as an implementation multiplier, not as a
              substitute for scope control, sponsor relevance, review quality,
              or final product judgment.
            </p>
          </div>

          <div className="creator-bento reveal delay-1">
            <article className="creator-bento__card creator-bento__card--wide creator-bento__card--image creator-bento__card--evidence">
              <h3>Evidence-to-action focus</h3>
              <p>
                The product story centers on structured evidence, review,
                approval, export, and spatial context for operational decisions.
              </p>
            </article>
            <article className="creator-bento__card creator-bento__card--wide creator-bento__card--image creator-bento__card--context">
              <div>
                <h3>Challenge context</h3>
                <p>
                  The OpenAI Handshake Codex Creator Challenge framing explains
                  why the demo emphasizes employer-facing clarity and feasible
                  execution.
                </p>
              </div>
            </article>
            <article className="creator-bento__card creator-bento__card--image creator-bento__card--scope">
              <h3>Responsible scope</h3>
              <p>
                The public demo uses fictional seeded data and avoids claims
                about production deployment, sponsor adoption, or live AI
                operations.
              </p>
            </article>
            <article className="creator-bento__card creator-bento__card--image creator-bento__card--quality">
              <h3>Review quality</h3>
              <p>
                Human approval, traceability, and evidence provenance are kept
                visible instead of hidden behind one-shot summaries.
              </p>
            </article>
            <article className="creator-bento__card creator-bento__card--image creator-bento__card--discipline">
              <h3>Demo discipline</h3>
              <p>
                The product slice stays narrow enough to be credible while
                still showing a reusable platform direction.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="creator-desire">
        <div className="container creator-desire__inner">
          <div className="creator-desire__sticky reveal">
            <h2 className="display-lg">
              Built through review loops, not loose generation.
            </h2>
            <p className="body-lg">
              The work treats Codex as a drafting and implementation partner.
              Product framing, sponsor relevance, and acceptance criteria remain
              deliberate decisions.
            </p>
          </div>

          <div className="creator-process reveal delay-1">
            <article className="creator-process__panel">
              <span>Frame</span>
              <h3>One platform story</h3>
              <p>
                ResolveScope stays centered on structured evidence becoming an
                approved, export-ready case file.
              </p>
            </article>
            <article className="creator-process__panel">
              <span>Shape</span>
              <h3>Challenge context</h3>
              <p>
                Sponsor-facing workflows guide the demos without fragmenting the
                platform into separate products.
              </p>
            </article>
            <article className="creator-process__panel">
              <span>Verify</span>
              <h3>Review before polish</h3>
              <p>
                Each visible surface gets checked for scope honesty, navigation,
                responsiveness, and demo clarity.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="creator-action">
        <div className="container">
          <div className="creator-action__panel reveal">
            <p className="eyebrow">Continue the review</p>
            <h2 className="display-lg">
              See how the creator story connects to the product demo.
            </h2>
            <div className="creator-action__links">
              <Link to="/codex-creator-challenge" className="btn btn--primary">
                Challenge entry
              </Link>
              <Link to="/dashboard" className="btn btn--outline">
                Open Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__logo">
            Resolve<span>Scope</span>
          </div>
          <p className="footer__text">
            Evidence-to-action platform concept by Carleton Lees.
          </p>
          <ul className="footer__links">
            <li>
              <Link to="/">Product</Link>
            </li>
            <li>
              <Link to="/codex-creator-challenge">Challenge entry</Link>
            </li>
            <li>
              <Link to="/architecture">Architecture</Link>
            </li>
          </ul>
        </div>
      </footer>
    </main>
  );
}
