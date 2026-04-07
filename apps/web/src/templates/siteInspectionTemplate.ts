import type { CaseTemplate } from "../types/case";

export const siteInspectionTemplate: CaseTemplate = {
  id: "site-inspection",
  label: "Site Inspection Report",
  domain: "Property & Facilities",
  description:
    "Structured field inspection workflow for commercial and industrial property assessments : findings, hazards, structural observations, and remediation actions",
  defaultOwner: "Alex Reyes",
  extractionSections: [
    {
      key: "siteSummary",
      title: "Inspection Summary",
      type: "text",
      provenanceKey: "siteSummary",
    },
    {
      key: "siteInfo",
      title: "Site & Property Details",
      type: "unit-info",
    },
    {
      key: "inspectionTimeline",
      title: "Inspection Timeline",
      type: "timeline",
      provenanceKey: "inspectionTimeline",
    },
    {
      key: "findings",
      title: "Findings & Deficiencies",
      type: "list",
      provenanceKey: "findings",
    },
    {
      key: "structuralObservations",
      title: "Structural Observations",
      type: "text",
      provenanceKey: "structuralObservations",
    },
    {
      key: "safetyHazards",
      title: "Safety Hazards",
      type: "list",
      provenanceKey: "safetyHazards",
    },
    {
      key: "recommendedActions",
      title: "Recommended Actions",
      type: "actions",
      provenanceKey: "recommendedActions",
    },
    {
      key: "inspectorNotes",
      title: "Inspector Notes",
      type: "text",
      provenanceKey: "inspectorNotes",
    },
  ],
  checklistItems: [
    { key: "exteriorReviewed", label: "Exterior facade fully reviewed" },
    { key: "photosDocumented", label: "All findings photographed and logged" },
    { key: "structuralFlagged", label: "Structural concerns escalated if required" },
    { key: "safetyHazardsReported", label: "Safety hazards formally reported" },
    { key: "clientNotified", label: "Client / property manager notified" },
    { key: "reportDrafted", label: "Inspection report drafted and reviewed" },
  ],
  severityOptions: [
    { value: "low", label: "Low : Minor cosmetic findings only" },
    { value: "moderate", label: "Moderate : Maintenance required, no immediate risk" },
    { value: "elevated", label: "Elevated : Structural or safety concerns identified" },
    { value: "critical", label: "Critical : Immediate remediation required" },
  ],
  reviewFieldLabels: {
    severity: "Inspection Severity",
    summary: "Lead inspector findings",
    nextSteps: "Remediation notes",
  },
  summaryPlaceholder: "Summarize overall site condition and key findings for the property manager…",
  nextStepsPlaceholder: "Detail remediation priorities, contractor referrals, or follow-up inspection schedule…",
  approvalConfig: {
    requireExtraction: true,
    requireAllChecklist: true,
    overrideReasonRequiredFor: ["severity"],
  },
};
