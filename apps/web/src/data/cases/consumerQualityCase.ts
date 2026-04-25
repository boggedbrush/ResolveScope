import type { SeedCaseData, ReviewState } from "../../types/case";

/* ═══════════════════════════════════════════
   Seeded demo case : Consumer Quality Complaint
   Scenario: product texture complaint linked to
   a specific order and batch / lot record.
   ═══════════════════════════════════════════ */

const initialReview: ReviewState = {
  severity: "moderate",
  summary: "",
  nextSteps: "",
  checklist: {
    complaintReviewed: false,
    productMatched: false,
    lotVerified: false,
    transcriptReviewed: false,
    actionsReviewed: false,
  },
};

export const consumerQualitySeedData: SeedCaseData = {
  reviewer: "Maya Patel",
  caseMeta: {
    id: "CQC-2026-00428",
    title: "Texture Complaint : Hydrating Face Cream",
    templateId: "consumer-quality",
    status: "in-review",
    priority: "medium",
    severity: "moderate",
    createdAt: "2026-03-18T14:26:00Z",
    updatedAt: "2026-03-19T16:10:00Z",
    owner: "Maya Patel",
    subject: "Jordan Ellis",
    unit: "Hydrating Face Cream 50 ml : Lot HC-26-0417B",
  },
  evidence: [
    {
      id: "cqev-001",
      type: "note",
      name: "Complaint Note : CQC-2026-00428",
      uploadedBy: "Support intake",
      uploadedAt: "2026-03-18T14:26:00Z",
      description:
        "Customer reports the cream arrived with a grainy texture and separated appearance after first opening. No medical concern was reported. Customer requested a replacement or review of the batch.",
      mimeType: "text/plain",
    },
    {
      id: "cqev-002",
      type: "document",
      name: "Product Reference : Hydrating Face Cream.pdf",
      uploadedBy: "Product operations",
      uploadedAt: "2026-03-18T14:33:00Z",
      description:
        "Internal product reference sheet for Hydrating Face Cream 50 ml. Includes expected texture, packaging configuration, storage guidance, and quality hold criteria.",
      mimeType: "application/pdf",
      previewUrl: "/assets/consumer-quality/product-reference-hydrating-face-cream.pdf",
    },
    {
      id: "cqev-003",
      type: "document",
      name: "Order Metadata : ORD-882145.csv",
      uploadedBy: "Commerce system",
      uploadedAt: "2026-03-18T14:35:00Z",
      description:
        "Order metadata for ORD-882145. Shows shipment from Fulfillment Center 3 on March 12, 2026 with standard parcel service and delivery on March 16, 2026.",
      mimeType: "text/csv",
      previewUrl: "/assets/consumer-quality/order-metadata-ord-882145.csv",
    },
    {
      id: "cqev-004",
      type: "document",
      name: "Batch Record Snapshot : HC-26-0417B.pdf",
      uploadedBy: "Quality operations",
      uploadedAt: "2026-03-18T15:05:00Z",
      description:
        "Batch record snapshot for lot HC-26-0417B. Release checks show fill weight, seal integrity, and appearance within expected range at release.",
      mimeType: "application/pdf",
      previewUrl: "/assets/consumer-quality/batch-record-hc-26-0417b.pdf",
    },
    {
      id: "cqev-005",
      type: "image",
      name: "Sample Photo : Texture Complaint.png",
      uploadedBy: "Quality operations",
      uploadedAt: "2026-03-18T15:12:00Z",
      description:
        "Review photo of the returned sample jar for lot HC-26-0417B. The cream surface shows visible graininess and slight separation consistent with the complaint note.",
      mimeType: "image/png",
      previewUrl: "/assets/consumer-quality/texture-complaint-sample-hc-26-0417b.png",
    },
    {
      id: "cqev-006",
      type: "note",
      name: "Support Transcript : March 18",
      uploadedBy: "Support intake",
      uploadedAt: "2026-03-18T15:18:00Z",
      description:
        "Transcript from support chat. Customer describes product as grainy and slightly separated, confirms outer package arrived intact, and provides batch / lot ID from the jar base.",
      mimeType: "text/plain",
    },
    {
      id: "cqev-007",
      type: "note",
      name: "Reviewer Notes : Initial Quality Check",
      uploadedBy: "Maya Patel (quality reviewer)",
      uploadedAt: "2026-03-19T16:10:00Z",
      description:
        "Reviewer notes: single complaint currently tied to lot HC-26-0417B. Batch release record does not show an out-of-spec condition. Recommend customer replacement, returned sample request if available, and watchlist monitoring for 14 days.",
      mimeType: "text/plain",
    },
  ],
  initialReview,
  extraction: {
    runAt: "",
    sections: {
      complaintSummary: {
        type: "text",
        content:
          "Customer Jordan Ellis reported that a Hydrating Face Cream 50 ml jar from order ORD-882145 had a grainy texture and slight separation when first opened. The support transcript confirms the package arrived intact and the batch / lot ID was HC-26-0417B. No medical concern was reported. Current evidence supports a moderate quality complaint requiring replacement handling and lot monitoring rather than escalation.",
      },
      productDetails: {
        type: "unit-info",
        fields: [
          { label: "Product", value: "Hydrating Face Cream 50 ml" },
          { label: "Batch / Lot ID", value: "HC-26-0417B" },
          { label: "Order", value: "ORD-882145" },
          { label: "Shipment date", value: "2026-03-12" },
          { label: "Delivery date", value: "2026-03-16" },
          { label: "Reviewer", value: "Maya Patel" },
        ],
      },
      supportTimeline: {
        type: "timeline",
        entries: [
          { time: "2026-03-12 09:20", event: "Order ORD-882145 shipped from Fulfillment Center 3" },
          { time: "2026-03-16 15:42", event: "Order delivered by standard parcel service" },
          { time: "2026-03-18 10:26", event: "Customer complaint note opened by support" },
          { time: "2026-03-18 11:18", event: "Support transcript added with batch / lot ID HC-26-0417B" },
          { time: "2026-03-18 11:35", event: "Order metadata matched to product and shipment record" },
          { time: "2026-03-19 12:10", event: "Quality reviewer adds initial notes and recommended actions" },
        ],
      },
      issueClassification: {
        type: "unit-info",
        fields: [
          { label: "Issue type", value: "Texture / separation complaint" },
          { label: "Severity", value: "Moderate" },
          { label: "Impact", value: "Single customer complaint, no medical concern reported" },
          { label: "Review status", value: "In review" },
        ],
      },
      evidenceSummary: {
        type: "list",
        items: [
          "Complaint note and support transcript describe the same texture concern and confirm the lot ID from the product container.",
          "Product reference sheet defines smooth texture as the expected condition and lists visible separation as a quality review trigger.",
          "Order metadata ties the complaint to ORD-882145 and confirms ordinary fulfillment and delivery timing.",
          "Batch record snapshot shows lot HC-26-0417B was within release checks at the time of packaging.",
          "Sample photo shows visible graininess and slight separation on the returned jar surface.",
          "Reviewer notes recommend replacement handling and short-term lot monitoring because this is currently a single matched complaint.",
        ],
      },
      recommendedActions: {
        type: "actions",
        items: [
          {
            action: "Issue replacement or refund according to support policy and record the complaint disposition.",
            owner: "Support operations",
            due: "2026-03-20",
          },
          {
            action: "Request returned sample or customer photo if available for quality inspection.",
            owner: "Quality reviewer",
            due: "2026-03-21",
          },
          {
            action: "Place lot HC-26-0417B on 14-day complaint watchlist and compare against any new texture reports.",
            owner: "Quality operations",
            due: "2026-04-02",
          },
        ],
      },
    },
    provenance: {
      complaintSummary: ["cqev-001", "cqev-005", "cqev-006"],
      productDetails: ["cqev-002", "cqev-003", "cqev-004"],
      supportTimeline: ["cqev-001", "cqev-003", "cqev-005", "cqev-006"],
      issueClassification: ["cqev-001", "cqev-002", "cqev-006"],
      evidenceSummary: ["cqev-001", "cqev-002", "cqev-003", "cqev-004", "cqev-005", "cqev-006"],
      recommendedActions: ["cqev-005", "cqev-006"],
    },
  },
};
