import type { CaseTemplate } from "../types/case";

export const consumerQualityTemplate: CaseTemplate = {
  id: "consumer-quality",
  label: "Consumer Quality Complaint",
  domain: "Consumer Quality",
  description: "Structured review workflow for product quality complaints",
  defaultOwner: "Maya Patel",
  extractionSections: [
    {
      key: "complaintSummary",
      title: "Complaint Summary",
      type: "text",
      provenanceKey: "complaintSummary",
    },
    {
      key: "productDetails",
      title: "Product Details",
      type: "unit-info",
      provenanceKey: "productDetails",
    },
    {
      key: "supportTimeline",
      title: "Support Timeline",
      type: "timeline",
      provenanceKey: "supportTimeline",
    },
    {
      key: "issueClassification",
      title: "Issue Classification",
      type: "unit-info",
      provenanceKey: "issueClassification",
    },
    {
      key: "evidenceSummary",
      title: "Evidence Summary",
      type: "list",
      provenanceKey: "evidenceSummary",
    },
    {
      key: "recommendedActions",
      title: "Recommended Actions",
      type: "actions",
      provenanceKey: "recommendedActions",
    },
  ],
  checklistItems: [
    { key: "complaintReviewed", label: "Complaint note reviewed" },
    { key: "productMatched", label: "Product and order matched" },
    { key: "lotVerified", label: "Batch / lot ID verified" },
    { key: "transcriptReviewed", label: "Support transcript reviewed" },
    { key: "actionsReviewed", label: "Recommended actions reviewed" },
  ],
  severityOptions: [
    { value: "low", label: "Low" },
    { value: "moderate", label: "Moderate" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
  ],
  reviewFieldLabels: {
    severity: "Severity",
    summary: "Reviewer notes",
    nextSteps: "Recommended action notes",
  },
  summaryPlaceholder: "Add quality review notes...",
  nextStepsPlaceholder: "Adjust recommended actions or customer follow-up...",
  approvalConfig: {
    requireExtraction: true,
    requireAllChecklist: true,
    overrideReasonRequiredFor: ["severity"],
  },
};
