import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="arch-page">
      <section className="arch-hero">
        <div className="container">
          <div className="arch-hero__inner">
            <div className="arch-hero__copy">
              <p className="eyebrow">404</p>
              <h1 className="display-xl arch-hero__title">
                Page not found.
              </h1>
              <p className="body-lg arch-hero__sub">
                This ResolveScope route is not available.
              </p>
              <div className="arch-hero__links">
                <Link to="/" className="btn btn--primary">
                  Product overview
                </Link>
                <Link to="/dashboard" className="btn btn--outline">
                  Open Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
