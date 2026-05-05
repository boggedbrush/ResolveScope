import { DEMO_SEED_MAP } from "../data/demoResolver";
import { resetAllDemoCaseStates } from "../data/demoState";
import { ThemeControl } from "../components/ThemeControl";
import { resetOnboardingTutorials } from "../utils/onboardingTutorial";

export function DashboardSettings() {
  function handleResetAllDemos() {
    resetAllDemoCaseStates(DEMO_SEED_MAP);
  }

  function handleResetTutorials() {
    resetOnboardingTutorials();
  }

  return (
    <div className="settings-page">
      <header className="settings-page__header">
        <div>
          <p className="settings-page__eyebrow">Workspace settings</p>
          <h1 className="settings-page__title">Review defaults for demo cases</h1>
          <p className="settings-page__subtitle">
            Tune the workspace around evidence review, approval, and export behavior without
            splitting ResolveScope into sponsor-specific tools.
          </p>
        </div>
      </header>

      <div className="settings-page__grid">
        <section className="settings-panel settings-panel--primary" aria-labelledby="workspace-preferences-title">
          <div className="settings-panel__heading">
            <div>
              <h2 id="workspace-preferences-title">Workspace preferences</h2>
              <p>Settings that are active in this browser session.</p>
            </div>
          </div>

          <div className="settings-field">
            <div>
              <label className="settings-field__label">Appearance</label>
              <p className="settings-field__hint">Saved locally for this device.</p>
            </div>
            <ThemeControl className="settings-page__theme" />
          </div>

          <div className="settings-action">
            <div>
              <h3>Demo case data</h3>
              <p>Restore the seeded examples used by the dashboard, reports, and live demos.</p>
            </div>
            <button className="btn btn--outline btn--sm" onClick={handleResetAllDemos}>
              Reset demos
            </button>
          </div>

          <div className="settings-action">
            <div>
              <h3>Guided tutorial</h3>
              <p>Show the dashboard and first-demo walkthrough again in this browser.</p>
            </div>
            <button className="btn btn--outline btn--sm" onClick={handleResetTutorials}>
              Reset tutorial
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
