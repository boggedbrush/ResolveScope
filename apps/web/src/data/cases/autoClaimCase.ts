import type { SeedCaseData, ReviewState } from "../../types/case";

/* ═══════════════════════════════════════════
   Seeded demo case — Auto Claim Review
   Scenario: low-speed parking-lot collision,
   front-right bumper scrape + cracked headlight
   ═══════════════════════════════════════════ */

const initialReview: ReviewState = {
  severity: "moderate",
  summary: "",
  nextSteps: "",
  checklist: {
    evidenceReviewed: false,
    timelineVerified: false,
    severityConfirmed: false,
    actionsReviewed: false,
  },
};

export const autoClaimSeedData: SeedCaseData = {
  reviewer: "Alex Chen",
  caseMeta: {
    id: "CLM-2024-00847",
    title: "Parking Lot Collision — Rivera Vehicle",
    templateId: "auto-claim",
    status: "in-review",
    priority: "medium",
    severity: "moderate",
    createdAt: "2024-11-12T09:14:00Z",
    updatedAt: "2024-11-13T14:32:00Z",
    owner: "Alex Chen",
    subject: "Maria Rivera",
    unit: "2021 Honda CR-V (Silver)",
  },
  evidence: [
    {
      id: "ev-001",
      type: "document",
      name: "Intake Form — CLM-2024-00847.pdf",
      uploadedBy: "Maria Rivera (claimant portal)",
      uploadedAt: "2024-11-12T09:14:00Z",
      description:
        "Claimant-submitted intake form detailing the incident date, location, and initial damage description.",
      mimeType: "application/pdf",
    },
    {
      id: "ev-002",
      type: "image",
      name: "Damage Photo 1 — Front Bumper.jpg",
      uploadedBy: "Maria Rivera (claimant portal)",
      uploadedAt: "2024-11-12T09:17:00Z",
      description:
        "Front-right bumper showing scrape approximately 14 inches across the lower fascia. Paint transfer from a dark vehicle visible.",
      mimeType: "image/jpeg",
    },
    {
      id: "ev-003",
      type: "image",
      name: "Damage Photo 2 — Headlight Assembly.jpg",
      uploadedBy: "Maria Rivera (claimant portal)",
      uploadedAt: "2024-11-12T09:18:00Z",
      description:
        "Cracked right headlight housing. Internal reflector intact; DRL strip appears undamaged. Replacement likely required.",
      mimeType: "image/jpeg",
    },
    {
      id: "ev-004",
      type: "image",
      name: "Scene Photo — Parking Lot Overview.jpg",
      uploadedBy: "Maria Rivera (claimant portal)",
      uploadedAt: "2024-11-12T09:20:00Z",
      description:
        "Wide-angle shot of Westfield Plaza Lot C where the incident occurred. Adjacent stall markings and nearby signage visible.",
      mimeType: "image/jpeg",
    },
    {
      id: "ev-005",
      type: "note",
      name: "Adjuster Note — Initial Review",
      uploadedBy: "Alex Chen (adjuster)",
      uploadedAt: "2024-11-13T10:05:00Z",
      description:
        "Damage consistent with low-speed parking lot contact. No frame or structural involvement suspected. Repair estimate expected $800–$1,400. No police report filed; incident deemed non-reportable per state threshold.",
      mimeType: "text/plain",
    },
    {
      id: "ev-006",
      type: "document",
      name: "Repair Estimate — AutoBody Plus.pdf",
      uploadedBy: "Alex Chen (adjuster)",
      uploadedAt: "2024-11-13T14:32:00Z",
      description:
        "Third-party estimate from AutoBody Plus. Itemized: bumper fascia replacement $540, headlight assembly $320, paint blend $210. Total: $1,070 before applicable deductible.",
      mimeType: "application/pdf",
    },
  ],
  initialReview,
  extraction: {
    runAt: "", // filled at runtime
    sections: {
      incidentSummary: {
        type: "text",
        content:
          "On November 11, 2024 at approximately 2:15 PM, claimant Maria Rivera's 2021 Honda CR-V sustained cosmetic damage to the front-right bumper fascia and headlight assembly in Westfield Plaza Lot C. The incident was a low-speed, unwitnessed parking lot contact with an unknown vehicle. No injuries were reported. No police report was filed, consistent with the state's $1,000 non-reportable threshold. The vehicle remained operable. A third-party repair estimate of $1,070 has been received.",
      },
      timeline: {
        type: "timeline",
        entries: [
          { time: "2024-11-11 14:15", event: "Incident occurs — Westfield Plaza Lot C" },
          { time: "2024-11-11 14:45", event: "Claimant discovers damage upon returning to vehicle" },
          { time: "2024-11-11 15:02", event: "Claimant photographs damage on-site" },
          { time: "2024-11-12 09:14", event: "Claim submitted via claimant portal" },
          { time: "2024-11-12 09:20", event: "3 scene and damage photos uploaded by claimant" },
          { time: "2024-11-13 10:05", event: "Adjuster Alex Chen logs initial review note" },
          { time: "2024-11-13 14:32", event: "Repair estimate received from AutoBody Plus ($1,070)" },
        ],
      },
      parties: {
        type: "parties",
        parties: [
          { role: "Claimant", name: "Maria Rivera", contact: "mrivera@email.com" },
          { role: "Adjuster", name: "Alex Chen", contact: "a.chen@resolvescope.internal" },
          { role: "Third-party repairer", name: "AutoBody Plus", contact: "(555) 481-9200" },
        ],
      },
      vehicleInfo: {
        type: "unit-info",
        fields: [
          { label: "Make / Model", value: "2021 Honda CR-V" },
          { label: "Color", value: "Silver" },
          { label: "Plate", value: "7LMX443" },
          { label: "VIN", value: "2HKRW2H55MH123456" },
        ],
      },
      damageObservations: {
        type: "list",
        items: [
          "Front-right bumper fascia: scrape approx. 14 inches across lower section, with visible paint transfer from a dark-colored vehicle.",
          "Right headlight assembly: housing cracked at lower-left corner. DRL strip appears intact; internal reflector undamaged. Full replacement recommended.",
          "No structural damage observed. No airbag deployment. Vehicle remains operable.",
          "No damage to hood, fender, grille, or adjacent body panels based on submitted photos.",
        ],
      },
      severityAssessment: {
        type: "text",
        content:
          "Moderate — cosmetic damage only. No structural, mechanical, or safety systems affected. Repair cost within typical range for low-speed parking contact. No rental authorization required based on vehicle operability.",
      },
      recommendedNextSteps: {
        type: "ordered-list",
        items: [
          "Approve repair estimate from AutoBody Plus ($1,070) subject to applicable $500 deductible.",
          "Confirm claimant's preferred repair scheduling and arrange direct payment to shop.",
          "Close unwitnessed-party portion of claim — no subrogation avenue identified.",
          "Issue settlement summary to claimant within 5 business days per policy SLA.",
        ],
      },
    },
    provenance: {
      incidentSummary: ["ev-001", "ev-005"],
      timeline: ["ev-001", "ev-002", "ev-003", "ev-004", "ev-006"],
      damageObservations: ["ev-002", "ev-003", "ev-005"],
      recommendedNextSteps: ["ev-005", "ev-006"],
      severityAssessment: ["ev-002", "ev-003", "ev-005", "ev-006"],
    },
  },
};
