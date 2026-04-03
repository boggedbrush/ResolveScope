import type { CaseTemplate } from "../types/case";

export const autoClaimTemplate: CaseTemplate = {
  id: "auto-claim",
  label: "Auto Claim Review",
  domain: "Insurance",
  description: "Evidence-driven review workflow for vehicle insurance claims",
  defaultOwner: "Alex Chen",
  extractionSections: [
    {
      key: "incidentSummary",
      title: "Incident Summary",
      type: "text",
      provenanceKey: "incidentSummary",
    },
    {
      key: "timeline",
      title: "Timeline",
      type: "timeline",
      provenanceKey: "timeline",
    },
    {
      key: "parties",
      title: "Parties Involved",
      type: "parties",
    },
    {
      key: "vehicleInfo",
      title: "Vehicle Information",
      type: "unit-info",
    },
    {
      key: "damageObservations",
      title: "Damage Observations",
      type: "list",
      provenanceKey: "damageObservations",
    },
    {
      key: "severityAssessment",
      title: "Severity Assessment",
      type: "text",
      provenanceKey: "severityAssessment",
    },
    {
      key: "recommendedNextSteps",
      title: "Recommended Next Steps",
      type: "ordered-list",
      provenanceKey: "recommendedNextSteps",
    },
  ],
  checklistItems: [
    { key: "evidenceReviewed", label: "Evidence reviewed" },
    { key: "timelineVerified", label: "Timeline verified" },
    { key: "severityConfirmed", label: "Severity confirmed" },
    { key: "actionsReviewed", label: "Recommended actions reviewed" },
  ],
  severityOptions: [
    { value: "minor", label: "Minor" },
    { value: "moderate", label: "Moderate" },
    { value: "major", label: "Major" },
    { value: "total-loss", label: "Total Loss" },
  ],
  reviewFieldLabels: {
    severity: "Severity",
    summary: "Reviewer summary",
    nextSteps: "Next steps",
  },
  summaryPlaceholder: "Add your summary or notes…",
  nextStepsPlaceholder: "Override or supplement recommended next steps…",
};
