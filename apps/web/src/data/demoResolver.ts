import type { SeedCaseData } from "../types/case";
import { autoClaimSeedData } from "./cases/autoClaimCase";
import { fleetSafetySeedData } from "./cases/fleetSafetyCase";
import { siteInspectionSeedData } from "./cases/siteInspectionCase";

export const DEMO_SEED_MAP: Record<string, SeedCaseData> = {
  "auto-claim": autoClaimSeedData,
  "fleet-safety": fleetSafetySeedData,
  "site-inspection": siteInspectionSeedData,
};

export function resolveDemoCase(demoId: string): SeedCaseData | null {
  return DEMO_SEED_MAP[demoId] ?? null;
}
