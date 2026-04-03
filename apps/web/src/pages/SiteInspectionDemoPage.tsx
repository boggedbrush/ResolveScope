import { WorkspaceDemoPage } from "./WorkspaceDemoPage";
import { siteInspectionSeedData } from "../data/cases/siteInspectionCase";

export function SiteInspectionDemoPage() {
  return <WorkspaceDemoPage seedData={siteInspectionSeedData} demoId="site-inspection" />;
}
