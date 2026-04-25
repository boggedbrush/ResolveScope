import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";

const Landing = lazy(() =>
  import("./pages/Landing").then((m) => ({ default: m.Landing }))
);
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((m) => ({ default: m.Dashboard }))
);
const DashboardSettings = lazy(() =>
  import("./pages/DashboardSettings").then((m) => ({
    default: m.DashboardSettings,
  }))
);
const CaseWorkspace = lazy(() =>
  import("./pages/CaseWorkspace").then((m) => ({ default: m.CaseWorkspace }))
);
const AutoClaimDemoPage = lazy(() =>
  import("./pages/AutoClaimDemoPage").then((m) => ({
    default: m.AutoClaimDemoPage,
  }))
);
const FleetSafetyDemoPage = lazy(() =>
  import("./pages/FleetSafetyDemoPage").then((m) => ({
    default: m.FleetSafetyDemoPage,
  }))
);
const SiteInspectionDemoPage = lazy(() =>
  import("./pages/SiteInspectionDemoPage").then((m) => ({
    default: m.SiteInspectionDemoPage,
  }))
);
const CaseReportPage = lazy(() =>
  import("./pages/CaseReportPage").then((m) => ({
    default: m.CaseReportPage,
  }))
);
const ArchitecturePage = lazy(() =>
  import("./pages/ArchitecturePage").then((m) => ({
    default: m.ArchitecturePage,
  }))
);

export function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/report/:demoId" element={<CaseReportPage />} />
        <Route path="/architecture" element={<ArchitecturePage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/settings" element={<DashboardSettings />} />
          <Route path="/cases/:id" element={<CaseWorkspace />} />
          <Route path="/demo/auto-claim" element={<AutoClaimDemoPage />} />
          <Route path="/demo/fleet-safety" element={<FleetSafetyDemoPage />} />
          <Route path="/demo/site-inspection" element={<SiteInspectionDemoPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
