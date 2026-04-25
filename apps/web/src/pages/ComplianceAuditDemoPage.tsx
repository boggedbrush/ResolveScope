import { WorkspaceDemoPage } from "./WorkspaceDemoPage";
import { complianceAuditSeedData } from "../data/cases/complianceAuditCase";

export function ComplianceAuditDemoPage() {
  return <WorkspaceDemoPage seedData={complianceAuditSeedData} demoId="compliance-audit" />;
}
