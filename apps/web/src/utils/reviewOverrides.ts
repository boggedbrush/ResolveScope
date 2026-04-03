import type { OverrideMap, ReviewOverride } from "../types/case";

/**
 * Returns an updated OverrideMap after a reviewer changes a field.
 *
 * - If the new value equals the original, the override is cleared.
 * - If the new value differs from the original, an override entry is created
 *   or updated (preserving the existing reason if one was already set).
 */
export function applyOverride(
  overrides: OverrideMap,
  fieldKey: string,
  originalValue: string,
  currentValue: string,
  actor: string,
  reason?: string
): OverrideMap {
  if (currentValue === originalValue) {
    // Revert: clear override
    const next = { ...overrides };
    delete next[fieldKey];
    return next;
  }

  const existing = overrides[fieldKey];
  const override: ReviewOverride = {
    fieldKey,
    originalValue,
    currentValue,
    actor,
    timestamp: new Date().toISOString(),
    reason: reason ?? existing?.reason ?? "",
  };

  return { ...overrides, [fieldKey]: override };
}

/**
 * Updates only the reason for an existing override without changing other fields.
 * No-op if the override does not exist.
 */
export function updateOverrideReason(
  overrides: OverrideMap,
  fieldKey: string,
  reason: string
): OverrideMap {
  const existing = overrides[fieldKey];
  if (!existing) return overrides;
  return {
    ...overrides,
    [fieldKey]: { ...existing, reason },
  };
}

/**
 * Returns a human-readable summary of changes made to overridden fields,
 * suitable for an audit entry detail string.
 */
export function describeOverrides(overrides: OverrideMap): string {
  const parts = Object.values(overrides).map((o) => {
    const base = `${o.fieldKey}: "${o.originalValue}" → "${o.currentValue}"`;
    return o.reason ? `${base} (reason: ${o.reason})` : base;
  });
  return parts.join("; ");
}
