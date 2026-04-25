import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ThemeControl } from "../components/ThemeControl";
import { DEMO_SEED_MAP } from "../data/demoResolver";
import { getDemoCaseState, useDemoStateVersion } from "../data/demoState";
import { loadLocalCases, useLocalCaseVersion } from "../data/localCases";

function LayersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="13.5" width="14" height="2.5" rx="1.25" fill="currentColor" opacity="0.4" />
      <rect x="3" y="8.75" width="14" height="2.5" rx="1.25" fill="currentColor" opacity="0.7" />
      <rect x="3" y="4" width="14" height="2.5" rx="1.25" fill="currentColor" />
    </svg>
  );
}

function SettingsCogIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M8.95 2.75h2.1l.45 2.04c.37.12.72.27 1.05.46l1.76-1.13 1.49 1.49-1.13 1.76c.19.33.34.68.46 1.05l2.04.45v2.1l-2.04.45c-.12.37-.27.72-.46 1.05l1.13 1.76-1.49 1.49-1.76-1.13c-.33.19-.68.34-1.05.46l-.45 2.04h-2.1l-.45-2.04a5.27 5.27 0 0 1-1.05-.46l-1.76 1.13-1.49-1.49 1.13-1.76a5.27 5.27 0 0 1-.46-1.05l-2.04-.45v-2.1l2.04-.45c.12-.37.27-.72.46-1.05L4.2 5.61l1.49-1.49 1.76 1.13c.33-.19.68-.34 1.05-.46l.45-2.04Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.35" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SidebarLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21.97 15V9C21.97 4 19.97 2 14.97 2H8.96997C3.96997 2 1.96997 4 1.96997 9V15C1.96997 20 3.96997 22 8.96997 22H14.97C19.97 22 21.97 20 21.97 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.96997 2V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.97 9.43994L12.41 11.9999L14.97 14.5599" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SidebarRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21.97 15V9C21.97 4 19.97 2 14.97 2H8.96997C3.96997 2 1.96997 4 1.96997 9V15C1.96997 20 3.96997 22 8.96997 22H14.97C19.97 22 21.97 20 21.97 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.97 2V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.96997 9.43994L10.53 11.9999L7.96997 14.5599" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardBackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10H16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

const SIDEBAR_DEMOS = [
  { demoId: "auto-claim", path: "/demo/auto-claim", label: "Auto claim" },
  { demoId: "fleet-safety", path: "/demo/fleet-safety", label: "Fleet incident" },
  { demoId: "site-inspection", path: "/demo/site-inspection", label: "Site inspection" },
  { demoId: "consumer-quality", path: "/demo/consumer-quality", label: "Quality complaint" },
  { demoId: "compliance-audit", path: "/demo/compliance-audit", label: "Audit review" },
];

function displayCaseId(caseId: string): string {
  return caseId.replace("-2024-", "-2026-");
}

const SIDEBAR_COLLAPSED_KEY = "resolvescope:sidebar-collapsed";

export function AppLayout() {
  useDemoStateVersion();
  useLocalCaseVersion();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  });

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const localCaseWorkspaces = loadLocalCases().map((localCase) => ({
    demoId: localCase.id,
    path: `/cases/${localCase.id}`,
    title: displayCaseId(localCase.id),
    subject: localCase.subject || "Local draft",
  }));

  const demoCaseWorkspaces = SIDEBAR_DEMOS.map(({ demoId, path, label }) => {
    const state = getDemoCaseState(demoId, DEMO_SEED_MAP[demoId]);
    return {
      demoId,
      path,
      title: displayCaseId(state.caseMeta.id),
      subject: label,
    };
  });
  const caseWorkspaces = [...localCaseWorkspaces, ...demoCaseWorkspaces];
  const isWorkspaceRoute =
    location.pathname.startsWith("/demo/") ||
    location.pathname.startsWith("/cases/") ||
    location.pathname === "/dashboard/settings";

  return (
    <div className={`app-layout${isSidebarCollapsed ? " app-layout--sidebar-collapsed" : ""}`}>
      <aside className="app-sidebar">
        <div className="app-sidebar__logo">
          {isWorkspaceRoute ? (
            <NavLink
              to="/dashboard"
              className="app-sidebar__workspace-back"
              title="Back to dashboard"
            >
              <DashboardBackIcon />
              <span>Dashboard</span>
            </NavLink>
          ) : (
            <NavLink to="/" className="app-sidebar__wordmark">
              <img src="/logo-mark.svg" alt="" aria-hidden="true" className="app-sidebar__logo-mark" />
              <span className="app-sidebar__wordmark-text">Resolve<span>Scope</span></span>
            </NavLink>
          )}
          <button
            type="button"
            className="app-sidebar__collapse"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isSidebarCollapsed}
            onClick={() => setIsSidebarCollapsed((value) => !value)}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <SidebarRightIcon /> : <SidebarLeftIcon />}
          </button>
        </div>

        <nav className="app-sidebar__nav">
          <p className="app-sidebar__nav-label">Cases</p>
          <ul className="app-sidebar__nav-list">
            {caseWorkspaces.map((workspace) => (
              <li key={workspace.demoId}>
                <NavLink
                  to={workspace.path}
                  title={`${workspace.title} · ${workspace.subject}`}
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
            title="Settings"
            className={({ isActive }) =>
              `app-sidebar__nav-item app-sidebar__nav-item--muted${isActive ? " app-sidebar__nav-item--active" : ""}`
            }
          >
            <SettingsCogIcon />
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
