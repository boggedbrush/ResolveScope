import type { CaseTemplate } from "../types/case";

export const fleetSafetyTemplate: CaseTemplate = {
  id: "fleet-safety",
  label: "Fleet Safety Incident",
  domain: "Fleet Operations",
  description:
    "Structured incident response and corrective action workflow for commercial fleet safety events",
  defaultOwner: "Jordan Park",
  extractionSections: [
    {
      key: "incidentSummary",
      title: "Incident Summary",
      type: "text",
      provenanceKey: "incidentSummary",
    },
    {
      key: "timeline",
      title: "Event Timeline",
      type: "timeline",
      provenanceKey: "timeline",
    },
    {
      key: "parties",
      title: "People Involved",
      type: "parties",
    },
    {
      key: "unitInfo",
      title: "Unit & Vehicle",
      type: "unit-info",
    },
    {
      key: "findings",
      title: "Findings & Contributing Factors",
      type: "list",
      provenanceKey: "findings",
    },
    {
      key: "riskAssessment",
      title: "Risk Assessment",
      type: "text",
      provenanceKey: "riskAssessment",
    },
    {
      key: "correctiveActions",
      title: "Corrective Actions",
      type: "actions",
      provenanceKey: "correctiveActions",
    },
  ],
  checklistItems: [
    { key: "statementReviewed", label: "Driver statement reviewed" },
    { key: "photosVerified", label: "Incident photos verified" },
    { key: "supervisorNotified", label: "Supervisor notification confirmed" },
    { key: "actionsAssigned", label: "Corrective actions assigned" },
    { key: "reportFiled", label: "Safety report filed with compliance team" },
  ],
  severityOptions: [
    { value: "minor", label: "Minor : No injury, minimal property impact" },
    { value: "moderate", label: "Moderate : Reportable, no injury" },
    { value: "major", label: "Major : Injury or significant damage" },
    { value: "critical", label: "Critical : Fatality or major loss event" },
  ],
  reviewFieldLabels: {
    severity: "Risk Level",
    summary: "Safety officer findings",
    nextSteps: "Corrective action notes",
  },
  summaryPlaceholder: "Summarize contributing factors and safety officer findings…",
  nextStepsPlaceholder: "Add follow-up actions or override recommendations…",
  approvalConfig: {
    requireExtraction: true,
    requireAllChecklist: true,
    overrideReasonRequiredFor: ["severity"],
  },
};
