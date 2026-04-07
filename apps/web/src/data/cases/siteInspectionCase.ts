import type { SeedCaseData, ReviewState, SpatialMarker } from "../../types/case";

/* ═══════════════════════════════════════════
   Seeded demo case : Site Inspection Report
   Scenario: Hargrove Commercial Properties
   requests exterior inspection of Building A
   at their Eastside Campus. Inspector Alex
   Reyes documents facade cracks, water
   intrusion, loose roof flashing, and an
   entry-level trip hazard.
   ═══════════════════════════════════════════ */

const initialReview: ReviewState = {
  severity: "elevated",
  summary: "",
  nextSteps: "",
  checklist: {
    exteriorReviewed: false,
    photosDocumented: false,
    structuralFlagged: false,
    safetyHazardsReported: false,
    clientNotified: false,
    reportDrafted: false,
  },
};

export const siteInspectionSpatialMarkers: SpatialMarker[] = [
  {
    id: "sm-001",
    label: "Roof Flashing : North Parapet",
    x: 17,
    y: 13,
    severity: "high",
    note: "Metal flashing lifted at north parapet seam, approximately 4 linear feet. Visible gap at roof-wall junction : active water ingress channel under wet conditions. Sealant fully failed.",
    relatedEvidenceIds: ["siev-003"],
    relatedExtractionSectionKey: "findings",
    status: "open",
  },
  {
    id: "sm-002",
    label: "Facade Crack : Level 2 Spandrel",
    x: 30,
    y: 44,
    severity: "high",
    note: "Diagonal crack through masonry spandrel panel, 14-inch length, approximately 3mm width at widest point. Pattern consistent with differential settlement or thermal movement. Requires structural engineer review.",
    relatedEvidenceIds: ["siev-004", "siev-005"],
    relatedExtractionSectionKey: "structuralObservations",
    status: "needs-review",
  },
  {
    id: "sm-003",
    label: "Water Intrusion : SE Corner",
    x: 81,
    y: 57,
    severity: "medium",
    note: "Efflorescence and dark staining on southeast face, approximately 6 sq ft. Consistent with window head flashing failure at Level 1 window bank. Staining pattern indicates recurring seasonal ingress.",
    relatedEvidenceIds: ["siev-005", "siev-006"],
    relatedExtractionSectionKey: "findings",
    status: "open",
  },
  {
    id: "sm-004",
    label: "Trip Hazard : Main Entry Threshold",
    x: 50,
    y: 90,
    severity: "medium",
    note: "Raised concrete lip at main building entry threshold : approximately 40mm height differential. ADA non-compliant. Concrete lip likely heaved due to tree root pressure. Immediate remediation advised; interim signage required.",
    relatedEvidenceIds: ["siev-007"],
    relatedExtractionSectionKey: "safetyHazards",
    status: "open",
  },
];

export const siteInspectionSeedData: SeedCaseData = {
  reviewer: "Alex Reyes",
  caseMeta: {
    id: "SIR-2024-00091",
    title: "Exterior Facade Inspection : Hargrove Building A",
    templateId: "site-inspection",
    status: "in-review",
    priority: "high",
    severity: "elevated",
    createdAt: "2024-11-04T08:00:00Z",
    updatedAt: "2024-11-06T16:45:00Z",
    owner: "Alex Reyes",
    subject: "Hargrove Commercial Properties",
    unit: "Building A : 1140 Eastside Blvd, Unit Campus",
  },
  evidence: [
    {
      id: "siev-001",
      type: "document",
      name: "Inspection Brief : Hargrove Building A.pdf",
      uploadedBy: "Client Portal (Hargrove PM)",
      uploadedAt: "2024-11-04T08:00:00Z",
      description:
        "Client-submitted inspection brief. Hargrove PM reports recurring damp patches in Level 1 northeast corridor and visible facade cracking noticed by tenants. Requests full exterior envelope assessment ahead of winter season.",
      mimeType: "application/pdf",
    },
    {
      id: "siev-002",
      type: "document",
      name: "Inspection Checklist : Exterior Envelope.pdf",
      uploadedBy: "Alex Reyes (field inspector)",
      uploadedAt: "2024-11-05T09:30:00Z",
      description:
        "Completed pre-inspection checklist for exterior envelope survey. Covers facade, roof edge, windows, ground plane, drainage, and entry areas. 47 of 52 line items satisfactory. 5 items flagged for documentation.",
      mimeType: "application/pdf",
    },
    {
      id: "siev-003",
      type: "image",
      name: "Photo 01 : Roof Flashing North Parapet.jpg",
      uploadedBy: "Alex Reyes (field inspector)",
      uploadedAt: "2024-11-05T10:15:00Z",
      description:
        "Close-up of north parapet at roof level. Metal cap flashing has lifted approximately 40mm from the substrate at the wall-roof junction. Sealant at seam is fully cracked and missing in two sections. Water staining visible on interior parapet face.",
      mimeType: "image/jpeg",
    },
    {
      id: "siev-004",
      type: "image",
      name: "Photo 02 : Level 2 Spandrel Crack Detail.jpg",
      uploadedBy: "Alex Reyes (field inspector)",
      uploadedAt: "2024-11-05T10:48:00Z",
      description:
        "Diagonal crack on Level 2 masonry spandrel panel between Window Column C and Column D. Crack runs from upper-left to lower-right at approximately 30 degrees from vertical, 14 inches in length, 3mm width at widest point. No previous repair attempts visible.",
      mimeType: "image/jpeg",
    },
    {
      id: "siev-005",
      type: "image",
      name: "Photo 03 : Southeast Corner Overview.jpg",
      uploadedBy: "Alex Reyes (field inspector)",
      uploadedAt: "2024-11-05T11:20:00Z",
      description:
        "Wide-angle view of southeast building corner from ground level. Shows water staining and efflorescence running vertically from Level 1 window head to ground plane, approximately 6 sq ft affected. Staining pattern consistent with head flashing failure at right-most window of ground floor bank.",
      mimeType: "image/jpeg",
    },
    {
      id: "siev-006",
      type: "note",
      name: "Inspector Field Note : Water Intrusion SE Corner",
      uploadedBy: "Alex Reyes (field inspector)",
      uploadedAt: "2024-11-05T11:35:00Z",
      description:
        "Field note: probed wall surface at staining zone with moisture meter : reading 32% at 25mm depth, significantly above 16% baseline for dry masonry. Suggests active or recent moisture infiltration. No interior access available for this visit but recommend interior ceiling check on Level 1 northeast.",
      mimeType: "text/plain",
    },
    {
      id: "siev-007",
      type: "image",
      name: "Photo 04 : Main Entry Trip Hazard.jpg",
      uploadedBy: "Alex Reyes (field inspector)",
      uploadedAt: "2024-11-05T12:05:00Z",
      description:
        "Main building entry threshold showing heaved concrete section. Measurement probe in frame indicates 40–42mm height differential at the joint. Tree root visible in adjacent landscaping bed. Hazard marked with cones by building maintenance on day of inspection.",
      mimeType: "image/jpeg",
    },
    {
      id: "siev-008",
      type: "note",
      name: "Supervisor Review Note : A. Chen",
      uploadedBy: "A. Chen (senior inspector)",
      uploadedAt: "2024-11-06T16:45:00Z",
      description:
        "Senior inspector review note: concur with field findings. Recommend fast-tracking structural engineer review for spandrel crack (sm-002) and roof flashing repair (sm-001) ahead of projected November rain events. Trip hazard (sm-004) must be addressed within 5 business days per client liability policy. Water intrusion (sm-003) is non-critical but should be included in remediation scope.",
      mimeType: "text/plain",
    },
  ],
  spatialMarkers: siteInspectionSpatialMarkers,
  initialReview,
  extraction: {
    runAt: "", // filled at runtime
    sections: {
      siteSummary: {
        type: "text",
        content:
          "Exterior envelope inspection of Hargrove Building A (1140 Eastside Blvd) completed on November 5, 2024 by inspector Alex Reyes. The three-story commercial office building presents four primary deficiencies: (1) lifted metal flashing at the north parapet with active sealant failure, (2) a diagonal masonry crack on the Level 2 spandrel panel requiring structural assessment, (3) water intrusion staining at the southeast corner consistent with window head flashing failure, and (4) a raised concrete trip hazard at the main building entry threshold. Overall site condition is rated Elevated : no immediate structural collapse risk, but two findings (roof flashing and spandrel crack) require prompt remediation before the winter wet season.",
      },
      siteInfo: {
        type: "unit-info",
        fields: [
          { label: "Property", value: "Hargrove Building A" },
          { label: "Address", value: "1140 Eastside Blvd, Eastside Campus" },
          { label: "Client", value: "Hargrove Commercial Properties" },
          { label: "Building Type", value: "3-storey commercial office" },
          { label: "Construction", value: "Masonry facade, steel frame" },
          { label: "Year Built", value: "1998 (approx.)" },
          { label: "Inspector", value: "Alex Reyes" },
          { label: "Inspection Date", value: "November 5, 2024" },
          { label: "Review Completed", value: "November 6, 2024" },
        ],
      },
      inspectionTimeline: {
        type: "timeline",
        entries: [
          { time: "2024-11-04 08:00", event: "Inspection brief received from Hargrove PM via client portal" },
          { time: "2024-11-05 09:30", event: "Inspector Alex Reyes arrives on site; pre-inspection checklist initiated" },
          { time: "2024-11-05 10:15", event: "North parapet flashing deficiency identified and photographed" },
          { time: "2024-11-05 10:48", event: "Level 2 spandrel crack documented; tagged for structural review" },
          { time: "2024-11-05 11:20", event: "Southeast corner water staining photographed and probed" },
          { time: "2024-11-05 11:35", event: "Field note recorded : moisture reading 32% at SE staining zone" },
          { time: "2024-11-05 12:05", event: "Main entry trip hazard measured and photographed; building maintenance notified" },
          { time: "2024-11-05 13:00", event: "On-site inspection concluded; all evidence uploaded to case portal" },
          { time: "2024-11-06 16:45", event: "Senior inspector A. Chen reviews findings and adds supervisory note" },
        ],
      },
      findings: {
        type: "list",
        items: [
          "Roof flashing failure at north parapet : metal cap flashing lifted 40mm, sealant fully failed over approx. 4 linear feet. Active water ingress channel under wet conditions.",
          "Diagonal masonry crack on Level 2 spandrel panel (Col C–D), 14-inch length, 3mm width. Pattern suggests differential settlement or thermal movement : structural engineer review required.",
          "Water intrusion staining and efflorescence on SE facade face, approx. 6 sq ft. Moisture probe reading 32% at 25mm depth. Consistent with Level 1 window head flashing failure.",
          "Trip hazard at main building entry : heaved concrete lip 40–42mm, likely root pressure. ADA non-compliant. Interim hazard marking in place by building maintenance.",
          "47 of 52 checklist line items satisfactory; 5 items flagged. No roof drainage obstructions, no window seal failures beyond SE corner, no ground floor structural cracking.",
        ],
      },
      structuralObservations: {
        type: "text",
        content:
          "The Level 2 spandrel crack is the primary structural concern noted in this inspection. The diagonal crack pattern (30 degrees from vertical) is more consistent with shear movement than pure shrinkage, and may indicate localized settlement or lateral thermal movement at the building's third-floor cantilever junction. No corresponding interior cracking was observed (interior access unavailable during this visit). The crack has not been previously repaired, suggesting it either appeared or was not documented in prior inspections. A licensed structural engineer should assess the crack and the surrounding masonry bay before next winter loading. All other observable structural elements : foundation perimeter, ground floor lintels, column lines : appeared sound and consistent with expected performance for a 1998 masonry-frame building.",
      },
      safetyHazards: {
        type: "list",
        items: [
          "Main entry trip hazard (40–42mm heaved concrete threshold) : ADA non-compliant, elevated fall risk for pedestrian traffic. Requires interim cones/signage immediately and permanent repair within 5 business days per Hargrove liability policy.",
          "Lifted roof flashing : secondary fall/access risk for any rooftop maintenance personnel until repair is completed. Recommend flagging with roof access log note.",
        ],
      },
      recommendedActions: {
        type: "actions",
        items: [
          {
            action:
              "Engage licensed structural engineer to assess Level 2 spandrel crack and provide remediation specification or clearance.",
            owner: "Hargrove Property Manager",
            due: "2024-11-15",
          },
          {
            action:
              "Commission roofing contractor to re-bed and seal north parapet flashing, minimum 6 linear feet of remediation. Complete before next significant rain event.",
            owner: "Hargrove Property Manager",
            due: "2024-11-12",
          },
          {
            action:
              "Repair main entry threshold : grind or re-pour heaved concrete section to achieve flush ≤6mm transition. Install interim hazard signage within 24 hours.",
            owner: "Building Maintenance",
            due: "2024-11-08",
          },
          {
            action:
              "Repair window head flashing at SE corner Level 1 window bank; include repointing of affected masonry joints. Confirm moisture readings post-repair.",
            owner: "Hargrove Property Manager",
            due: "2024-11-22",
          },
          {
            action:
              "Schedule Level 1 interior ceiling check in northeast corridor to confirm extent of moisture infiltration from SE corner deficiency.",
            owner: "Alex Reyes (lead inspector)",
            due: "2024-11-20",
          },
        ],
      },
      inspectorNotes: {
        type: "text",
        content:
          "Building overall presents well for its age and use class. The four flagged items are consistent with a 26-year-old masonry exterior that has had regular maintenance but may have had a gap in envelope-specific inspection coverage. Recommend establishing an annual exterior inspection cycle going forward. The spandrel crack warrants priority attention but does not in my assessment indicate imminent structural risk : the building is functioning normally and tenants should not be alarmed. If the structural engineer assessment identifies more extensive movement, a follow-up report will be filed. Note: south and west facades could not be fully assessed due to active scaffolding by adjacent site; a partial re-inspection is recommended once scaffolding is cleared (estimated Q1 2025).",
      },
    },
    provenance: {
      siteSummary: ["siev-001", "siev-002", "siev-008"],
      inspectionTimeline: ["siev-001", "siev-003", "siev-004", "siev-005", "siev-006", "siev-007", "siev-008"],
      findings: ["siev-003", "siev-004", "siev-005", "siev-006", "siev-007"],
      structuralObservations: ["siev-004", "siev-008"],
      safetyHazards: ["siev-007", "siev-008"],
      recommendedActions: ["siev-002", "siev-008"],
      inspectorNotes: ["siev-002", "siev-008"],
    },
  },
};
