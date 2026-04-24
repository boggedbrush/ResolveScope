import { useSyncExternalStore } from "react";
import type { DemoCaseState, EvidenceItem, SeedCaseData } from "../types/case";

const STORAGE_PREFIX = "resolvescope:demo-case:";

type Listener = () => void;
const listeners = new Set<Listener>();
let stateVersion = 0;

function emitChange() {
  stateVersion += 1;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function storageKey(demoId: string): string {
  return `${STORAGE_PREFIX}${demoId}`;
}

function sanitizeEvidenceForPersistence(evidence: EvidenceItem[]): EvidenceItem[] {
  return evidence.map((item) => ({
    ...item,
    previewUrl:
      item.previewUrl && !item.previewUrl.startsWith("blob:")
        ? item.previewUrl
        : undefined,
  }));
}

function createSeedSignature(seedData: SeedCaseData): string {
  return JSON.stringify({
    reviewer: seedData.reviewer,
    caseMeta: seedData.caseMeta,
    evidence: seedData.evidence,
    extraction: seedData.extraction,
    initialReview: seedData.initialReview,
    spatialMarkers: seedData.spatialMarkers ?? [],
  });
}

function createInitialDemoState(demoId: string, seedData: SeedCaseData): DemoCaseState {
  return {
    demoId,
    seedSignature: createSeedSignature(seedData),
    reviewer: seedData.reviewer,
    caseMeta: { ...seedData.caseMeta },
    evidence: sanitizeEvidenceForPersistence(seedData.evidence),
    extraction: null,
    review: { ...seedData.initialReview, checklist: { ...seedData.initialReview.checklist } },
    overrides: {},
    auditLog: [],
    spatialMarkers: seedData.spatialMarkers?.map((marker) => ({ ...marker })),
  };
}

function loadStoredDemoCaseState(demoId: string): DemoCaseState | null {
  try {
    const raw = localStorage.getItem(storageKey(demoId));
    if (!raw) return null;
    return JSON.parse(raw) as DemoCaseState;
  } catch {
    return null;
  }
}

function persistDemoCaseState(demoId: string, state: DemoCaseState): void {
  localStorage.setItem(storageKey(demoId), JSON.stringify({
    ...state,
    evidence: sanitizeEvidenceForPersistence(state.evidence),
  }));
}

export function getDemoCaseState(demoId: string, seedData: SeedCaseData): DemoCaseState {
  const stored = loadStoredDemoCaseState(demoId);
  const currentSeedSignature = createSeedSignature(seedData);
  if (stored && stored.seedSignature === currentSeedSignature) return stored;

  const initialState = createInitialDemoState(demoId, seedData);
  persistDemoCaseState(demoId, initialState);
  return initialState;
}

export function updateDemoCaseState(
  demoId: string,
  seedData: SeedCaseData,
  updater: (prev: DemoCaseState) => DemoCaseState
): DemoCaseState {
  const prev = getDemoCaseState(demoId, seedData);
  const next = updater(prev);
  persistDemoCaseState(demoId, next);
  emitChange();
  return next;
}

export function resetDemoCaseState(demoId: string, seedData: SeedCaseData): DemoCaseState {
  const reset = createInitialDemoState(demoId, seedData);
  persistDemoCaseState(demoId, reset);
  emitChange();
  return reset;
}

export function resetAllDemoCaseStates(seedMap: Record<string, SeedCaseData>): void {
  Object.entries(seedMap).forEach(([demoId, seedData]) => {
    persistDemoCaseState(demoId, createInitialDemoState(demoId, seedData));
  });
  emitChange();
}

export function useDemoStateVersion(): number {
  return useSyncExternalStore(subscribe, () => stateVersion, () => 0);
}
