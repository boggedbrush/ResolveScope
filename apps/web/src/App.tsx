import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { RouteSeo } from "./components/RouteSeo";
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
const ConsumerQualityDemoPage = lazy(() =>
  import("./pages/ConsumerQualityDemoPage").then((m) => ({
    default: m.ConsumerQualityDemoPage,
  }))
);
const ComplianceAuditDemoPage = lazy(() =>
  import("./pages/ComplianceAuditDemoPage").then((m) => ({
    default: m.ComplianceAuditDemoPage,
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
const ChallengeEntryPage = lazy(() =>
  import("./pages/ChallengeEntryPage").then((m) => ({
    default: m.ChallengeEntryPage,
  }))
);
const CreatorPage = lazy(() =>
  import("./pages/CreatorPage").then((m) => ({
    default: m.CreatorPage,
  }))
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage").then((m) => ({
    default: m.NotFoundPage,
  }))
);

export function App() {
  return (
    <>
      <RouteSeo />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/report/:demoId" element={<CaseReportPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/codex-creator-challenge" element={<ChallengeEntryPage />} />
          <Route path="/creator" element={<CreatorPage />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/settings" element={<DashboardSettings />} />
            <Route path="/cases/:id" element={<CaseWorkspace />} />
            <Route path="/demo/auto-claim" element={<AutoClaimDemoPage />} />
            <Route path="/demo/fleet-safety" element={<FleetSafetyDemoPage />} />
            <Route path="/demo/site-inspection" element={<SiteInspectionDemoPage />} />
            <Route path="/demo/consumer-quality" element={<ConsumerQualityDemoPage />} />
            <Route path="/demo/compliance-audit" element={<ComplianceAuditDemoPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}
