import type { SeedCaseData, ReviewState } from "../../types/case";

/* ═══════════════════════════════════════════
   Seeded demo case : Compliance Audit Review
   Scenario: internal approval evidence review
   with one missing documentation flag.
   ═══════════════════════════════════════════ */

const initialReview: ReviewState = {
  severity: "elevated",
  summary: "",
  nextSteps: "",
  checklist: {
    policyReviewed: false,
    approvalMatched: false,
    missingDocsConfirmed: false,
    checklistReviewed: false,
    followUpAssigned: false,
  },
};

export const complianceAuditSeedData: SeedCaseData = {
  reviewer: "Nora Bell",
  caseMeta: {
    id: "CAR-2026-00176",
    title: "Access Approval Evidence Review : Vendor Workspace",
    templateId: "compliance-audit",
    status: "in-review",
    priority: "high",
    severity: "elevated",
    createdAt: "2026-04-08T13:00:00Z",
    updatedAt: "2026-04-09T17:20:00Z",
    owner: "Nora Bell",
    subject: "Vendor Workspace Access",
    unit: "Control AC-07 : Quarterly Access Review",
  },
  evidence: [
    {
      id: "caev-001",
      type: "document",
      name: "Policy Excerpt : Access Review Standard.pdf",
      uploadedBy: "Control library",
      uploadedAt: "2026-04-08T13:00:00Z",
      description:
        "Internal policy excerpt describing required evidence for vendor workspace access reviews, including manager approval, business owner sign-off, and quarterly checklist completion.",
      mimeType: "application/pdf",
    },
    {
      id: "caev-002",
      type: "document",
      name: "Approval Summary : Workspace V-214.pdf",
      uploadedBy: "Access operations",
      uploadedAt: "2026-04-08T13:22:00Z",
      description:
        "Approval summary for vendor workspace V-214. Shows manager approval and renewal date, but business owner sign-off field is blank.",
      mimeType: "application/pdf",
    },
    {
      id: "caev-003",
      type: "note",
      name: "Internal Note : Evidence Follow-Up",
      uploadedBy: "Access operations",
      uploadedAt: "2026-04-08T15:10:00Z",
      description:
        "Internal note states the business owner sign-off was requested by email but not attached to the review packet before audit sampling.",
      mimeType: "text/plain",
    },
    {
      id: "caev-004",
      type: "document",
      name: "Missing Documentation Flag : MDF-219.csv",
      uploadedBy: "Audit intake",
      uploadedAt: "2026-04-09T09:15:00Z",
      description:
        "Audit intake flag identifying one missing documentation item: business owner sign-off for vendor workspace V-214.",
      mimeType: "text/csv",
    },
    {
      id: "caev-005",
      type: "document",
      name: "Quarterly Checklist : Access Review.xlsx",
      uploadedBy: "Control owner",
      uploadedAt: "2026-04-09T10:05:00Z",
      description:
        "Completed quarterly access review checklist. Most evidence items are checked complete, with one exception noted for pending business owner sign-off.",
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    {
      id: "caev-006",
      type: "note",
      name: "Remediation Note : Owner Outreach",
      uploadedBy: "Nora Bell (reviewer)",
      uploadedAt: "2026-04-09T17:20:00Z",
      description:
        "Reviewer note: assign follow-up to control owner, attach business owner sign-off when received, and mark the sampled item ready for recheck.",
      mimeType: "text/plain",
    },
  ],
  initialReview,
  extraction: {
    runAt: "",
    sections: {
      reviewSummary: {
        type: "text",
        content:
          "Internal compliance review for vendor workspace V-214 found that the approval summary includes manager approval and renewal timing, but the business owner sign-off required by the internal access review standard is missing from the sampled packet. The issue is an evidence completeness gap, not a legal or regulatory determination. Follow-up should focus on collecting the missing sign-off and updating the checklist record.",
      },
      controlDetails: {
        type: "unit-info",
        fields: [
          { label: "Review category", value: "Quarterly access review" },
          { label: "Control area", value: "Vendor workspace access" },
          { label: "Sample", value: "Workspace V-214" },
          { label: "Missing evidence", value: "Business owner sign-off" },
          { label: "Risk level", value: "Elevated" },
          { label: "Reviewer", value: "Nora Bell" },
          { label: "Review status", value: "In review" },
        ],
      },
      evidenceChecklist: {
        type: "list",
        items: [
          "Policy excerpt requires manager approval, business owner sign-off, and completed quarterly checklist.",
          "Approval summary includes manager approval and renewal date.",
          "Business owner sign-off is blank in the approval summary.",
          "Internal note says sign-off was requested but not attached before sampling.",
          "Quarterly checklist marks one evidence exception tied to the same missing sign-off.",
        ],
      },
      missingEvidence: {
        type: "text",
        content:
          "The sampled packet is missing business owner sign-off for vendor workspace V-214. The missing documentation flag and quarterly checklist both point to the same evidence gap, and no conflicting sign-off artifact is present in the packet.",
      },
      provenanceSummary: {
        type: "list",
        items: [
          "Policy requirement comes from Access Review Standard excerpt.",
          "Approval state comes from Workspace V-214 approval summary.",
          "Missing evidence is corroborated by audit intake flag MDF-219 and the quarterly checklist exception.",
          "Remediation path comes from reviewer note assigning owner outreach and recheck.",
        ],
      },
      followUpActions: {
        type: "actions",
        items: [
          {
            action: "Request and attach business owner sign-off for workspace V-214.",
            owner: "Control owner",
            due: "2026-04-12",
          },
          {
            action: "Update quarterly checklist exception once the sign-off is attached.",
            owner: "Access operations",
            due: "2026-04-13",
          },
          {
            action: "Recheck the sampled packet and record reviewer disposition.",
            owner: "Nora Bell",
            due: "2026-04-15",
          },
        ],
      },
    },
    provenance: {
      reviewSummary: ["caev-001", "caev-002", "caev-004", "caev-006"],
      controlDetails: ["caev-001", "caev-002", "caev-005"],
      evidenceChecklist: ["caev-001", "caev-002", "caev-003", "caev-004", "caev-005"],
      missingEvidence: ["caev-002", "caev-003", "caev-004", "caev-005"],
      provenanceSummary: ["caev-001", "caev-002", "caev-004", "caev-005", "caev-006"],
      followUpActions: ["caev-003", "caev-006"],
    },
  },
};
