import { Link } from "react-router-dom";
import { ThemeControl } from "../components/ThemeControl";
import { MobileNavMenu, type MobileNavItem } from "../components/MobileNavMenu";

const CHALLENGE_NAV_ITEMS: MobileNavItem[] = [
  { label: "Product", to: "/" },
  { label: "Architecture", to: "/architecture" },
  { label: "Creator", to: "/creator" },
];

export function ChallengeEntryPage() {
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
                <Link to="/architecture">Architecture</Link>
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
              <MobileNavMenu items={CHALLENGE_NAV_ITEMS} />
            </div>
          </div>
        </div>
      </nav>

      <section className="arch-hero">
        <div className="container">
          <div className="arch-hero__inner">
            <div className="arch-hero__copy">
              <p className="eyebrow reveal">Challenge entry</p>
              <h1 className="display-xl arch-hero__title reveal delay-1">
                ResolveScope for the OpenAI Handshake Codex Creator Challenge.
              </h1>
              <p className="body-lg arch-hero__sub reveal delay-2">
                Created by Carleton Lees, ResolveScope shows how Codex can help
                turn an employer-facing product concept into a working
                evidence-to-action demo with human review at the center.
              </p>
              <div className="arch-hero__links reveal delay-3">
                <Link to="/dashboard" className="btn btn--primary">
                  Open Demo
                </Link>
                <Link to="/creator" className="btn btn--outline">
                  Creator profile
                </Link>
              </div>
            </div>
            <div className="arch-hero__artifact reveal delay-2" aria-hidden="true">
              <div className="arch-artifact__bar">
                <span>challenge-entry.yaml</span>
                <span>seo-indexable</span>
              </div>
              <div className="arch-artifact__body">
                <span>platform:</span>
                <strong>ResolveScope</strong>
                <span>challenge:</span>
                <strong>OpenAI + Handshake Codex</strong>
                <span>creator:</span>
                <strong>Carleton Lees</strong>
                <span>focus:</span>
                <strong>evidence.to_action()</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="overview">
        <div className="container">
          <div className="arch-section-header reveal">
            <p className="eyebrow">Project focus</p>
            <h2 className="display-lg">
              A product story for <em>reviewable evidence</em>
            </h2>
            <p className="body-lg arch-section-sub">
              The entry focuses on scattered operational evidence becoming a
              structured, reviewable, export-ready case file. OpenAI Codex was
              used as an implementation accelerator, while the case workflow
              keeps approval and judgment human-owned.
            </p>
          </div>

          <ol className="arch-component-ledger reveal delay-1">
            <li className="arch-component-row">
              <div className="arch-component-row__index">
                <span>01</span>
              </div>
              <h3>ResolveScope</h3>
              <p>
                One evidence-to-action platform story for claims, safety,
                inspections, quality review, and governed operational intake.
              </p>
            </li>
            <li className="arch-component-row">
              <div className="arch-component-row__index">
                <span>02</span>
              </div>
              <h3>Codex Creator Challenge</h3>
              <p>
                The challenge context is used to explain the build process and
                product constraints without implying sponsor deployment or
                endorsement.
              </p>
            </li>
            <li className="arch-component-row">
              <div className="arch-component-row__index">
                <span>03</span>
              </div>
              <h3>Carleton Lees</h3>
              <p>
                The creator profile connects the public project, challenge
                context, and product direction in one indexable place.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="cta-final">
        <div className="container">
          <p className="eyebrow reveal">Continue</p>
          <h2 className="display-lg reveal delay-1">
            See the evidence workflow <em>in context</em>
          </h2>
          <p className="body-lg reveal delay-2">
            Review the architecture, then open the demo to inspect intake,
            extraction, approval, and export in one flow.
          </p>
          <div className="cta-final__actions reveal delay-3">
            <Link to="/architecture" className="btn btn--primary">
              View architecture
            </Link>
            <Link to="/dashboard" className="btn btn--outline">
              Open Demo
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__logo">
            Resolve<span>Scope</span>
          </div>
          <p className="footer__text">
            OpenAI Handshake Codex Creator Challenge entry by Carleton Lees.
          </p>
          <ul className="footer__links">
            <li>
              <Link to="/">Product</Link>
            </li>
            <li>
              <Link to="/architecture">Architecture</Link>
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
