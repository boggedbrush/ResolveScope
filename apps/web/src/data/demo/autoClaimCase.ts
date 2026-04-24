import type {
  CaseMeta,
  EvidenceItem,
  ExtractionResult,
  ReviewState,
} from "../../types/demo";

/* ═══════════════════════════════════════════
   Seeded demo case : Auto Claim Review
   Scenario: low-speed reverse-out contact during
   a hazard-avoidance maneuver in Lot C
   ═══════════════════════════════════════════ */

export const DEMO_CASE_META: CaseMeta = {
  id: "CLM-2024-00847",
  title: "Lot C Hazard-Avoidance Contact : Rivera Vehicle",
  template: "Auto Claim Review",
  status: "in-review",
  priority: "medium",
  severity: "moderate",
  createdAt: "2024-11-12T17:14:00Z",
  updatedAt: "2024-11-13T19:32:00Z",
  owner: "Alex Chen",
  claimant: "Maria Rivera",
  vehicle: "2021 Honda CR-V (Sage Green)",
};

export const DEMO_EVIDENCE: EvidenceItem[] = [
  {
    id: "ev-001",
    type: "document",
    name: "Intake Form : CLM-2024-00847.pdf",
    uploadedBy: "Maria Rivera (claimant portal)",
    uploadedAt: "2024-11-12T17:14:00Z",
    description:
      "Claimant-submitted intake form describing a low-speed contact in Westfield Plaza Lot C while steering around a cone-marked pavement crack beside the right-side parking stalls.",
    mimeType: "application/pdf",
    previewUrl: "/assets/auto-claim/intake-form-clm-2024-00847.pdf",
  },
  {
    id: "ev-002",
    type: "image",
    name: "Damage Photo 1 : Front Bumper.jpg",
    uploadedBy: "Maria Rivera (claimant portal)",
    uploadedAt: "2024-11-12T17:17:00Z",
    description:
      "Front-right bumper showing a scrape approximately 14 inches across the lower fascia, dark paint transfer, and a detached lower trim piece resting near the contact area.",
    mimeType: "image/jpeg",
    previewUrl: "/assets/auto-claim/front-bumper-damage.jpg",
  },
  {
    id: "ev-003",
    type: "image",
    name: "Damage Photo 2 : Headlight Assembly.jpg",
    uploadedBy: "Maria Rivera (claimant portal)",
    uploadedAt: "2024-11-12T17:18:00Z",
    description:
      "Cracked right headlight housing at the same corner as the bumper contact. Internal reflector appears intact, but the housing fracture supports full assembly replacement.",
    mimeType: "image/jpeg",
    previewUrl: "/assets/auto-claim/right-headlight-fracture.jpg",
  },
  {
    id: "ev-004",
    type: "image",
    name: "Scene Photo : Parking Lot Overview.jpg",
    uploadedBy: "Maria Rivera (claimant portal)",
    uploadedAt: "2024-11-12T17:20:00Z",
    description:
      "Wide-angle shot of Westfield Plaza Lot C showing temporary cones, a cracked section of pavement, and adjacent stall markings where the claimant reported steering left before contact.",
    mimeType: "image/jpeg",
    previewUrl: "/assets/auto-claim/lot-c-scene-overview.jpg",
  },
  {
    id: "ev-005",
    type: "note",
    name: "Adjuster Note : Initial Review",
    uploadedBy: "Alex Chen (adjuster)",
    uploadedAt: "2024-11-13T18:05:00Z",
    description:
      "Damage is consistent with a low-speed reverse-out contact from the adjacent stall in Lot C. The bumper scrape, headlight crack, detached trim piece, and cone-marked road crack all line up with Rivera shifting around the pavement hazard as the sedan entered the lane. No frame or structural involvement suspected. Repair estimate expected $800–$1,400. No police report filed; incident deemed non-reportable per state threshold.",
    mimeType: "text/plain",
  },
  {
    id: "ev-006",
    type: "document",
    name: "Repair Estimate : AutoBody Plus.pdf",
    uploadedBy: "Alex Chen (adjuster)",
    uploadedAt: "2024-11-13T19:32:00Z",
    description:
      "Third-party estimate from AutoBody Plus. Itemized: bumper fascia replacement $540, headlight assembly $320, and paint blend work $210. Total: $1,070 before applicable deductible.",
    mimeType: "application/pdf",
    previewUrl: "/assets/auto-claim/repair-estimate-autobody-plus.pdf",
  },
];

/* ─── Deterministic extraction output ─────
   This is what "Run extraction" produces.
   Derived from the seed case above : not random.
   ─────────────────────────────────────────── */

export const DEMO_EXTRACTION: ExtractionResult = {
  runAt: "", // filled in at runtime
  incidentSummary:
    "On November 11, 2024 at approximately 2:15 PM, claimant Maria Rivera's 2021 Honda CR-V sustained cosmetic damage to the front-right bumper fascia and right headlight assembly in Westfield Plaza Lot C. Rivera reported moving slowly past the right-side stalls and steering around a cone-marked crack in the pavement when a dark sedan began backing out from the adjacent stall and clipped the SUV's front-right corner. Scene reconstruction from cone placement, cracked-road geometry, paint transfer, and a detached trim piece supports that hazard-avoidance and reverse-out contact narrative. The other driver was not identified on-site. No injuries were reported. No police report was filed, consistent with the state's non-reportable threshold. The vehicle remained operable. A third-party repair estimate of $1,070 has been received.",
  timeline: [
    { time: "2024-11-11 14:15", event: "Incident occurs as claimant steers around cone-marked road damage in Lot C" },
    { time: "2024-11-11 14:45", event: "Claimant discovers damage upon returning to vehicle" },
    { time: "2024-11-11 15:02", event: "Claimant photographs damage on-site" },
    { time: "2024-11-12 12:14", event: "Claim submitted via claimant portal" },
    { time: "2024-11-12 12:20", event: "3 scene and damage photos uploaded by claimant" },
    { time: "2024-11-13 13:05", event: "Adjuster Alex Chen logs initial review note" },
    { time: "2024-11-13 13:40", event: "Scene reconstructed from cone placement, cracked pavement, and paint transfer : reverse-out sedan inferred as other party" },
    { time: "2024-11-13 14:32", event: "Repair estimate received from AutoBody Plus ($1,070)" },
  ],
  parties: [
    {
      role: "Claimant",
      name: "Maria Rivera",
      contact: "mrivera@email.com",
    },
    {
      role: "Adjuster",
      name: "Alex Chen",
      contact: "a.chen@resolvescope.internal",
    },
    {
      role: "Third-party repairer",
      name: "AutoBody Plus",
      contact: "(555) 481-9200",
    },
  ],
  vehicle: {
    make: "Honda",
    model: "CR-V",
    year: "2021",
    vin: "2HKRW2H55MH123456",
    color: "Sage Green",
    plate: "7LMX443",
  },
  damageObservations: [
    "Front-right bumper fascia: scrape approximately 14 inches across the lower section, with visible dark paint transfer and a detached lower trim piece near the contact cluster.",
    "Right headlight assembly: housing cracked at the same corner as the bumper damage. DRL strip appears intact; full replacement recommended.",
    "Scene photo shows temporary cones around a cracked stretch of pavement beside the adjacent stall, supporting an avoidance maneuver that tightened the reverse-out contact path.",
    "No structural damage observed. No airbag deployment. No visible hood or fender deformation. Vehicle remains operable.",
  ],
  recommendedNextSteps: [
    "Approve repair estimate from AutoBody Plus ($1,070) subject to applicable $500 deductible.",
    "Retain the scene photo and spatial reconstruction in the file to document the cone-marked road crack and reverse-out contact geometry.",
    "Confirm claimant's preferred repair scheduling and arrange direct payment to shop.",
    "Close unwitnessed-party portion of claim : no subrogation avenue identified.",
    "Issue settlement summary to claimant within 5 business days per policy SLA.",
  ],
  severityAssessment:
    "Moderate : the loss remains cosmetic and repairable, but the scene evidence now more clearly supports a hazard-avoidance and reverse-out impact sequence. Damage appears limited to the bumper fascia, right headlight assembly, and related finish work, with no visible structural, mechanical, or safety-system involvement.",
  provenance: {
    incidentSummary: ["ev-001", "ev-005"],
    timeline: ["ev-001", "ev-002", "ev-003", "ev-004", "ev-006"],
    damageObservations: ["ev-002", "ev-003", "ev-005"],
    recommendedNextSteps: ["ev-005", "ev-006"],
    severityAssessment: ["ev-002", "ev-003", "ev-005", "ev-006"],
  },
};

export const INITIAL_REVIEW_STATE: ReviewState = {
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

export const DEMO_REVIEWER = "Alex Chen";
