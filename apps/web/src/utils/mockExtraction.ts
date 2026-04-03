import type { ExtractionResult } from "../types/demo";
import { DEMO_EXTRACTION } from "../data/demo/autoClaimCase";

/**
 * Simulates an AI extraction run.
 * Replace the body of this function with a real API call when ready.
 * Returns a deterministic result derived from the seeded case.
 */
export async function runMockExtraction(): Promise<ExtractionResult> {
  // Simulate network/processing latency
  await new Promise((resolve) => setTimeout(resolve, 1800));

  return {
    ...DEMO_EXTRACTION,
    runAt: new Date().toISOString(),
  };
}
