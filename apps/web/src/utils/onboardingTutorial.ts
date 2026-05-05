export const DASHBOARD_ONBOARDING_DISMISSED_KEY =
  "resolvescope.dashboardOnboardingDismissed";
export const FIRST_DEMO_ONBOARDING_DISMISSED_KEY =
  "resolvescope.firstDemoOnboardingDismissed";
export const FIRST_DEMO_REPORT_TOUR_PENDING_KEY =
  "resolvescope.firstDemoReportTourPending";
export const FIRST_DEMO_DASHBOARD_SIDEBAR_TOUR_PENDING_KEY =
  "resolvescope.firstDemoDashboardSidebarTourPending";

const ONBOARDING_TUTORIAL_KEYS = [
  DASHBOARD_ONBOARDING_DISMISSED_KEY,
  FIRST_DEMO_ONBOARDING_DISMISSED_KEY,
  FIRST_DEMO_REPORT_TOUR_PENDING_KEY,
  FIRST_DEMO_DASHBOARD_SIDEBAR_TOUR_PENDING_KEY,
];

export function resetOnboardingTutorials() {
  ONBOARDING_TUTORIAL_KEYS.forEach((key) => {
    window.localStorage.removeItem(key);
  });
}
