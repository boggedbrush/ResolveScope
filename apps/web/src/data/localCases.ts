import { useSyncExternalStore } from "react";
import type { CaseStatus, Priority } from "../types/case";

export interface LocalCaseRecord {
  id: string;
  title: string;
  template: string;
  domain: string;
  status: CaseStatus;
  priority: Priority;
  updatedAt: string;
  evidenceCount: number;
  subject: string;
}

const LOCAL_CASES_KEY = "resolvescope:local-cases";

type Listener = () => void;
const listeners = new Set<Listener>();
let localCaseVersion = 0;

function emitChange() {
  localCaseVersion += 1;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function createLocalCaseId(): string {
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `LCL-${new Date().getFullYear()}-${suffix}`;
}

export function loadLocalCases(): LocalCaseRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(LOCAL_CASES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LocalCaseRecord[];
  } catch {
    return [];
  }
}

export function saveLocalCases(cases: LocalCaseRecord[]): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(LOCAL_CASES_KEY, JSON.stringify(cases));
  emitChange();
}

export function deleteLocalCase(caseId: string): void {
  const nextCases = loadLocalCases().filter((localCase) => localCase.id !== caseId);
  saveLocalCases(nextCases);
}

export function useLocalCaseVersion(): number {
  return useSyncExternalStore(subscribe, () => localCaseVersion, () => 0);
}
