import { WorkspaceDemoPage } from "./WorkspaceDemoPage";
import { fleetSafetySeedData } from "../data/cases/fleetSafetyCase";

export function FleetSafetyDemoPage() {
  return <WorkspaceDemoPage seedData={fleetSafetySeedData} />;
}
