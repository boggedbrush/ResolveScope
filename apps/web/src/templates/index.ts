import type { CaseTemplate } from "../types/case";
import { autoClaimTemplate } from "./autoClaimTemplate";
import { complianceAuditTemplate } from "./complianceAuditTemplate";
import { consumerQualityTemplate } from "./consumerQualityTemplate";
import { fleetSafetyTemplate } from "./fleetSafetyTemplate";
import { siteInspectionTemplate } from "./siteInspectionTemplate";

export {
  autoClaimTemplate,
  complianceAuditTemplate,
  consumerQualityTemplate,
  fleetSafetyTemplate,
  siteInspectionTemplate,
};

export const TEMPLATE_REGISTRY: Record<string, CaseTemplate> = {
  [autoClaimTemplate.id]: autoClaimTemplate,
  [consumerQualityTemplate.id]: consumerQualityTemplate,
  [complianceAuditTemplate.id]: complianceAuditTemplate,
  [fleetSafetyTemplate.id]: fleetSafetyTemplate,
  [siteInspectionTemplate.id]: siteInspectionTemplate,
};

export function getTemplate(id: string): CaseTemplate {
  const t = TEMPLATE_REGISTRY[id];
  if (!t) throw new Error(`Unknown template: ${id}`);
  return t;
}
