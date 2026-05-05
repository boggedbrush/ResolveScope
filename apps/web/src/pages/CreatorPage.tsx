import { Link } from "react-router-dom";
import { ThemeControl } from "../components/ThemeControl";
import { MobileNavMenu, type MobileNavItem } from "../components/MobileNavMenu";

const CREATOR_NAV_ITEMS: MobileNavItem[] = [
  { label: "Product", to: "/" },
  { label: "Challenge", to: "/codex-creator-challenge" },
  { label: "Architecture", to: "/architecture" },
];

export function CreatorPage() {
  return (
    <main className="arch-page">
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
                <Link to="/">Product</Link>
              </li>
              <li>
                <Link to="/codex-creator-challenge">Challenge</Link>
              </li>
              <li>
                <Link to="/architecture">Architecture</Link>
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
            <div className="arch-hero__artifact reveal delay-2" aria-hidden="true">
              <div className="arch-artifact__bar">
                <span>creator-profile.yaml</span>
                <span>human-owned</span>
              </div>
              <div className="arch-artifact__body">
                <span>name:</span>
                <strong>Carleton Lees</strong>
                <span>project:</span>
                <strong>ResolveScope</strong>
                <span>tooling:</span>
                <strong>Codex-assisted</strong>
                <span>scope:</span>
                <strong>evidence.review.export</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="overview">
        <div className="container">
          <div className="arch-section-header reveal">
            <p className="eyebrow">Project role</p>
            <h2 className="display-lg">
              Product judgment stayed <em>human-owned</em>
            </h2>
            <p className="body-lg arch-section-sub">
              ResolveScope uses Codex as an implementation multiplier, not as a
              substitute for scope control, sponsor relevance, review quality,
              or final product judgment.
            </p>
          </div>

          <ol className="arch-component-ledger reveal delay-1">
            <li className="arch-component-row">
              <div className="arch-component-row__index">
                <span>01</span>
              </div>
              <h3>Evidence-to-action focus</h3>
              <p>
                The product story centers on structured evidence, review,
                approval, export, and spatial context for operational decisions.
              </p>
            </li>
            <li className="arch-component-row">
              <div className="arch-component-row__index">
                <span>02</span>
              </div>
              <h3>Challenge context</h3>
              <p>
                The OpenAI Handshake Codex Creator Challenge framing explains
                why the demo emphasizes employer-facing clarity and feasible
                execution.
              </p>
            </li>
            <li className="arch-component-row">
              <div className="arch-component-row__index">
                <span>03</span>
              </div>
              <h3>Responsible scope</h3>
              <p>
                The public demo uses fictional seeded data and avoids claims
                about production deployment, sponsor adoption, or live AI
                operations.
              </p>
            </li>
          </ol>
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
