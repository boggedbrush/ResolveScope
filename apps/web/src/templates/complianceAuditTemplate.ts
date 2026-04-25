import type { CaseTemplate } from "../types/case";

export const complianceAuditTemplate: CaseTemplate = {
  id: "compliance-audit",
  label: "Compliance Audit Review",
  domain: "Compliance Operations",
  description: "Evidence review workflow for internal compliance checks",
  defaultOwner: "Nora Bell",
  extractionSections: [
    {
      key: "reviewSummary",
      title: "Review Summary",
      type: "text",
      provenanceKey: "reviewSummary",
    },
    {
      key: "controlDetails",
      title: "Control Details",
      type: "unit-info",
      provenanceKey: "controlDetails",
    },
    {
      key: "evidenceChecklist",
      title: "Evidence Checklist",
      type: "list",
      provenanceKey: "evidenceChecklist",
    },
    {
      key: "missingEvidence",
      title: "Missing Evidence",
      type: "text",
      provenanceKey: "missingEvidence",
    },
    {
      key: "provenanceSummary",
      title: "Provenance Summary",
      type: "list",
      provenanceKey: "provenanceSummary",
    },
    {
      key: "followUpActions",
      title: "Follow-Up",
      type: "actions",
      provenanceKey: "followUpActions",
    },
  ],
  checklistItems: [
    { key: "policyReviewed", label: "Policy excerpt reviewed" },
    { key: "approvalMatched", label: "Approval summary matched" },
    { key: "missingDocsConfirmed", label: "Missing documentation confirmed" },
    { key: "checklistReviewed", label: "Checklist reviewed" },
    { key: "followUpAssigned", label: "Follow-up assigned" },
  ],
  severityOptions: [
    { value: "low", label: "Low" },
    { value: "moderate", label: "Moderate" },
    { value: "elevated", label: "Elevated" },
    { value: "high", label: "High" },
  ],
  reviewFieldLabels: {
    severity: "Risk level",
    summary: "Reviewer notes",
    nextSteps: "Follow-up notes",
  },
  summaryPlaceholder: "Add reviewer context or control notes...",
  nextStepsPlaceholder: "Adjust remediation or follow-up owners...",
  approvalConfig: {
    requireExtraction: true,
    requireAllChecklist: true,
    overrideReasonRequiredFor: ["severity"],
  },
};
