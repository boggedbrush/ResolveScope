import type { CaseTemplate } from "../types/case";
import { autoClaimTemplate } from "./autoClaimTemplate";
import { fleetSafetyTemplate } from "./fleetSafetyTemplate";
import { siteInspectionTemplate } from "./siteInspectionTemplate";

export { autoClaimTemplate, fleetSafetyTemplate, siteInspectionTemplate };

export const TEMPLATE_REGISTRY: Record<string, CaseTemplate> = {
  [autoClaimTemplate.id]: autoClaimTemplate,
  [fleetSafetyTemplate.id]: fleetSafetyTemplate,
  [siteInspectionTemplate.id]: siteInspectionTemplate,
};

export function getTemplate(id: string): CaseTemplate {
  const t = TEMPLATE_REGISTRY[id];
  if (!t) throw new Error(`Unknown template: ${id}`);
  return t;
}
