import { WorkspaceDemoPage } from "./WorkspaceDemoPage";
import { autoClaimSeedData } from "../data/cases/autoClaimCase";

export function AutoClaimDemoPage() {
  return <WorkspaceDemoPage seedData={autoClaimSeedData} />;
}
