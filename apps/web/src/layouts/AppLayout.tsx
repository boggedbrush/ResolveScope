import { NavLink, Outlet } from "react-router-dom";
import { ThemeControl } from "../components/ThemeControl";

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

export function AppLayout() {
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
          <p className="app-sidebar__nav-label">Workspace</p>
          <ul className="app-sidebar__nav-list">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `app-sidebar__nav-item${isActive ? " app-sidebar__nav-item--active" : ""}`
                }
              >
                <LayersIcon />
                Cases
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="app-sidebar__footer">
          <ThemeControl className="app-sidebar__theme" />
          <button className="app-sidebar__nav-item app-sidebar__nav-item--muted">
            <GridIcon />
            Settings
          </button>
        </div>
      </aside>

      <div className="app-main">
        <Outlet />
      </div>
    </div>
  );
}
