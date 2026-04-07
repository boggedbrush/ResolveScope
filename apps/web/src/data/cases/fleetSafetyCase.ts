import type { SeedCaseData, ReviewState } from "../../types/case";

/* ═══════════════════════════════════════════
   Seeded demo case : Fleet Safety Incident
   Scenario: low-speed rear contact at warehouse
   loading dock; driver distracted by in-cab
   dispatch tablet; no injuries; Unit V-183
   ═══════════════════════════════════════════ */

const initialReview: ReviewState = {
  severity: "moderate",
  summary: "",
  nextSteps: "",
  checklist: {
    statementReviewed: false,
    photosVerified: false,
    supervisorNotified: false,
    actionsAssigned: false,
    reportFiled: false,
  },
};

export const fleetSafetySeedData: SeedCaseData = {
  reviewer: "Jordan Park",
  caseMeta: {
    id: "FSI-2024-00312",
    title: "Loading Dock Rear Contact : Unit V-183",
    templateId: "fleet-safety",
    status: "in-review",
    priority: "high",
    severity: "moderate",
    createdAt: "2024-10-28T07:42:00Z",
    updatedAt: "2024-10-29T15:20:00Z",
    owner: "Jordan Park",
    subject: "Darnell Hughes (Driver)",
    unit: "Unit V-183 : 2023 Ford Transit 350",
  },
  evidence: [
    {
      id: "fev-001",
      type: "note",
      name: "Driver Statement : Darnell Hughes",
      uploadedBy: "Darnell Hughes (driver portal)",
      uploadedAt: "2024-10-28T08:10:00Z",
      description:
        "Driver statement: while completing a reversing maneuver into Bay 4, Hughes briefly diverted attention to an incoming dispatch notification on the in-cab tablet. The vehicle made contact with a stationary forklift parked outside the marked exclusion zone. No horn or spotter signal was in use. Speed estimated at under 5 mph at point of contact.",
      mimeType: "text/plain",
    },
    {
      id: "fev-002",
      type: "image",
      name: "Incident Photo 1 : Rear Bumper Contact Zone.jpg",
      uploadedBy: "Supervisor M. Okafor (ops portal)",
      uploadedAt: "2024-10-28T09:05:00Z",
      description:
        "Rear bumper of Unit V-183 showing impact scuff and bent trailer hitch receiver. No structural intrusion into cargo bay doors. Minor cosmetic damage to forklift counterweight housing also visible.",
      mimeType: "image/jpeg",
    },
    {
      id: "fev-003",
      type: "image",
      name: "Incident Photo 2 : Scene Overview Bay 4.jpg",
      uploadedBy: "Supervisor M. Okafor (ops portal)",
      uploadedAt: "2024-10-28T09:08:00Z",
      description:
        "Wide-angle view of Bay 4 loading area. Forklift positioned approx. 1.2m outside painted exclusion zone markings. No spotter or banksman visible in frame.",
      mimeType: "image/jpeg",
    },
    {
      id: "fev-004",
      type: "note",
      name: "Supervisor Note : M. Okafor",
      uploadedBy: "M. Okafor (supervisor)",
      uploadedAt: "2024-10-28T11:30:00Z",
      description:
        "Supervisor note: driver has clean record (3 years, zero incidents). In-cab tablet policy reviewed with driver post-incident. Forklift placement indicates a zone compliance failure by warehouse staff : separate corrective action underway. No injuries to driver, warehouse personnel, or third parties. Vehicle operationally fit pending bumper repair.",
      mimeType: "text/plain",
    },
    {
      id: "fev-005",
      type: "document",
      name: "Vehicle Inspection Report : Unit V-183.pdf",
      uploadedBy: "Fleet Maintenance (ops portal)",
      uploadedAt: "2024-10-29T09:45:00Z",
      description:
        "Post-incident inspection by fleet maintenance. Findings: bent trailer hitch receiver (non-safety critical), minor scratch on rear lower valance. All lights, brakes, and safety systems fully operational. Estimated repair cost: $380. Vehicle cleared for continued operations pending cosmetic repair.",
      mimeType: "application/pdf",
    },
    {
      id: "fev-006",
      type: "document",
      name: "Dashcam Footage Log : V-183 2024-10-28.pdf",
      uploadedBy: "Fleet Safety (ops portal)",
      uploadedAt: "2024-10-29T15:20:00Z",
      description:
        "Dashcam metadata and clip log for Unit V-183 on incident date. Confirms vehicle speed 4.2 mph at point of contact. Tablet interaction event recorded 8 seconds prior to impact. Clip retained in fleet safety system for 90-day review window.",
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
          "On October 28, 2024 at approximately 07:35 AM, Unit V-183 (2023 Ford Transit 350, driven by Darnell Hughes) made low-speed contact with a stationary forklift at Bay 4 of the Eastport Distribution Center. The driver was momentarily distracted by an incoming dispatch notification on the in-cab tablet during a reversing maneuver. Speed at impact was 4.2 mph per dashcam data. No injuries were sustained. Damage is limited to the rear bumper assembly and trailer hitch receiver on V-183, with minor cosmetic impact on the forklift counterweight housing. The vehicle has been inspected and cleared for operations pending cosmetic repair ($380 estimated). Contributing factors include tablet distraction and a zone compliance failure by warehouse staff.",
      },
      timeline: {
        type: "timeline",
        entries: [
          { time: "2024-10-28 07:35", event: "Unit V-183 begins reversing maneuver into Bay 4" },
          { time: "2024-10-28 07:35", event: "Driver interacts with in-cab dispatch tablet (~8s before impact)" },
          { time: "2024-10-28 07:36", event: "Low-speed contact with stationary forklift at 4.2 mph" },
          { time: "2024-10-28 07:40", event: "Driver reports incident to dispatch and calls supervisor" },
          { time: "2024-10-28 08:10", event: "Supervisor M. Okafor arrives at Bay 4, scene secured" },
          { time: "2024-10-28 08:10", event: "Driver statement collected via driver portal" },
          { time: "2024-10-28 09:08", event: "Scene and damage photos uploaded by supervisor" },
          { time: "2024-10-28 11:30", event: "Supervisor note submitted; in-cab tablet policy reviewed with driver" },
          { time: "2024-10-29 09:45", event: "Fleet maintenance inspection completed; vehicle cleared" },
          { time: "2024-10-29 15:20", event: "Dashcam footage log filed by Fleet Safety" },
        ],
      },
      parties: {
        type: "parties",
        parties: [
          { role: "Driver", name: "Darnell Hughes", contact: "d.hughes@fleetops.internal" },
          { role: "Supervisor", name: "M. Okafor", contact: "m.okafor@fleetops.internal" },
          { role: "Safety Officer", name: "Jordan Park", contact: "j.park@fleetops.internal" },
          { role: "Fleet Maintenance", name: "Eastport Maintenance Crew", contact: "maint@eastport.internal" },
        ],
      },
      unitInfo: {
        type: "unit-info",
        fields: [
          { label: "Unit Number", value: "V-183" },
          { label: "Vehicle", value: "2023 Ford Transit 350" },
          { label: "Fleet ID", value: "FLT-2023-183" },
          { label: "Assigned Route", value: "Eastport : Depot 7" },
          { label: "Driver Record", value: "Clean : 3 years, 0 prior incidents" },
          { label: "Odometer at Incident", value: "41,220 mi" },
        ],
      },
      findings: {
        type: "list",
        items: [
          "Primary cause: driver attention diversion : interaction with in-cab dispatch tablet 8 seconds before impact (confirmed by dashcam).",
          "Contributing factor: forklift positioned approx. 1.2m outside painted exclusion zone at Bay 4 : zone compliance failure by warehouse staff.",
          "No spotter or banksman in use during reversing maneuver : not required under current SOP but recommended for bay reversals.",
          "Damage limited to non-safety-critical components; vehicle structurally sound and operationally fit.",
          "No injuries to driver, warehouse personnel, or third parties.",
        ],
      },
      riskAssessment: {
        type: "text",
        content:
          "Moderate : low-speed incident with no injuries and limited material damage. However, the dual contributing factors (in-cab distraction and zone non-compliance) indicate a systemic risk pattern requiring process-level response, not just individual corrective action. Dashcam data confirms the distraction timeline. The forklift placement failure is being addressed under a separate warehouse ops corrective action. Repeat risk is elevated without a formal in-cab device policy update.",
      },
      correctiveActions: {
        type: "actions",
        items: [
          {
            action:
              "Issue formal in-cab device policy update prohibiting tablet interaction during active vehicle maneuvers; require driver acknowledgment.",
            owner: "Jordan Park (Safety Officer)",
            due: "2024-11-08",
          },
          {
            action:
              "Schedule driver coaching session for Darnell Hughes : distraction awareness and reversing protocols.",
            owner: "M. Okafor (Supervisor)",
            due: "2024-11-05",
          },
          {
            action:
              "Audit all Bay 4–8 exclusion zone markings for compliance; re-brief warehouse staff on forklift parking rules.",
            owner: "Warehouse Ops Lead",
            due: "2024-11-01",
          },
          {
            action:
              "Review dashcam footage policy and ensure 90-day retention is enforced fleet-wide.",
            owner: "Fleet Safety",
            due: "2024-11-15",
          },
          {
            action: "Schedule bumper and hitch repair for Unit V-183; update fleet maintenance log.",
            owner: "Fleet Maintenance",
            due: "2024-11-04",
          },
        ],
      },
    },
    provenance: {
      incidentSummary: ["fev-001", "fev-004", "fev-006"],
      timeline: ["fev-001", "fev-002", "fev-004", "fev-005", "fev-006"],
      findings: ["fev-001", "fev-002", "fev-003", "fev-006"],
      riskAssessment: ["fev-001", "fev-004", "fev-006"],
      correctiveActions: ["fev-001", "fev-004", "fev-005"],
    },
  },
};
