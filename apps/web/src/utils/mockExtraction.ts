import type { ExtractionResult } from "../types/case";

/**
 * Simulates an extraction run with a brief delay.
 * Returns the seeded extraction result with a live runAt timestamp.
 * Replace with a real API call when ready.
 */
export async function runMockExtraction(
  seededExtraction: ExtractionResult
): Promise<ExtractionResult> {
  await new Promise((resolve) => setTimeout(resolve, 1800));
  return {
    ...seededExtraction,
    runAt: new Date().toISOString(),
  };
}
