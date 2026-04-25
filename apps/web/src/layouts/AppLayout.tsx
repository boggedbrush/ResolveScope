import { NavLink, Outlet } from "react-router-dom";
import { ThemeControl } from "../components/ThemeControl";
import { DEMO_SEED_MAP } from "../data/demoResolver";
import { getDemoCaseState, useDemoStateVersion } from "../data/demoState";

function LayersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="13.5" width="14" height="2.5" rx="1.25" fill="currentColor" opacity="0.4" />
      <rect x="3" y="8.75" width="14" height="2.5" rx="1.25" fill="currentColor" opacity="0.7" />
      <rect x="3" y="4" width="14" height="2.5" rx="1.25" fill="currentColor" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const SIDEBAR_DEMOS = [
  { demoId: "auto-claim", path: "/demo/auto-claim", label: "Auto claim" },
  { demoId: "fleet-safety", path: "/demo/fleet-safety", label: "Fleet incident" },
  { demoId: "site-inspection", path: "/demo/site-inspection", label: "Site inspection" },
];

function displayCaseId(caseId: string): string {
  return caseId.replace("-2024-", "-2026-");
}

export function AppLayout() {
  useDemoStateVersion();

  const caseWorkspaces = SIDEBAR_DEMOS.map(({ demoId, path, label }) => {
    const state = getDemoCaseState(demoId, DEMO_SEED_MAP[demoId]);
    return {
      demoId,
      path,
      title: displayCaseId(state.caseMeta.id),
      subject: label,
    };
  });

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="app-sidebar__logo">
          <NavLink to="/" className="app-sidebar__wordmark">
            <img src="/logo-mark.svg" alt="" aria-hidden="true" className="app-sidebar__logo-mark" />
            <span className="app-sidebar__wordmark-text">Resolve<span>Scope</span></span>
          </NavLink>
        </div>

        <nav className="app-sidebar__nav">
          <p className="app-sidebar__nav-label">Cases</p>
          <ul className="app-sidebar__nav-list">
            {caseWorkspaces.map((workspace) => (
              <li key={workspace.demoId}>
                <NavLink
                  to={workspace.path}
                  className={({ isActive }) =>
                    `app-sidebar__nav-item app-sidebar__nav-item--case${isActive ? " app-sidebar__nav-item--active" : ""}`
                  }
                >
                  <LayersIcon />
                  <span className="app-sidebar__case-copy">
                    <span className="app-sidebar__case-title">
                      {workspace.title}
                    </span>
                    <span className="app-sidebar__case-meta">
                      {workspace.subject}
                    </span>
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="app-sidebar__footer">
          <ThemeControl className="app-sidebar__theme" />
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `app-sidebar__nav-item app-sidebar__nav-item--muted${isActive ? " app-sidebar__nav-item--active" : ""}`
            }
          >
            <GridIcon />
            Settings
          </NavLink>
        </div>
      </aside>

      <div className="app-main">
        <Outlet />
      </div>
    </div>
  );
}
