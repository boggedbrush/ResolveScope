import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DEMO_SEED_MAP } from "../data/demoResolver";
import { deleteLocalCase, loadLocalCases, useLocalCaseVersion } from "../data/localCases";
import type { SeedCaseData } from "../types/case";
import { WorkspaceDemoPage } from "./WorkspaceDemoPage";

const TEMPLATE_TO_DEMO_ID: Record<string, keyof typeof DEMO_SEED_MAP> = {
  "General Evidence Review": "compliance-audit",
  "Auto Claim Review": "auto-claim",
  "Fleet Safety Incident": "fleet-safety",
  "Site Inspection Report": "site-inspection",
  "Consumer Quality Complaint": "consumer-quality",
  "Compliance Audit Review": "compliance-audit",
};

function cloneSeedForLocalCase(baseSeed: SeedCaseData, localCase: ReturnType<typeof loadLocalCases>[number]): SeedCaseData {
  return {
    ...baseSeed,
    caseMeta: {
      ...baseSeed.caseMeta,
      id: localCase.id,
      title: localCase.title,
      status: localCase.status,
      priority: localCase.priority,
      subject: localCase.subject,
      owner: localCase.subject,
      createdAt: `${localCase.updatedAt}T00:00:00.000Z`,
      updatedAt: `${localCase.updatedAt}T00:00:00.000Z`,
    },
    evidence: [],
    extraction: {
      ...baseSeed.extraction,
      runAt: "",
      sections: {},
      provenance: {},
    },
    spatialMarkers: [],
  };
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M13 8H3M3 8L7 4M3 8L7 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CaseWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useLocalCaseVersion();
  const localCase = loadLocalCases().find((caseRecord) => caseRecord.id === id);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const localSeedData = useMemo(() => {
    if (!localCase) return null;

    const demoId = TEMPLATE_TO_DEMO_ID[localCase.template] ?? "compliance-audit";
    return cloneSeedForLocalCase(DEMO_SEED_MAP[demoId], localCase);
  }, [localCase]);

  function handleDeleteLocalCase() {
    if (!localCase) return;

    deleteLocalCase(localCase.id);
    navigate("/dashboard", { replace: true });
  }

  if (localCase && localSeedData) {
    return (
      <>
        <WorkspaceDemoPage
          seedData={localSeedData}
          demoId={localCase.id}
          localCaseLabel="Local only"
          topbarLabel={localCase.template}
          showResetDemo={false}
          onDeleteCase={() => setIsDeleteConfirmOpen(true)}
        />

        {isDeleteConfirmOpen && (
          <div
            className="local-case-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-local-case-title"
          >
            <div className="local-case-modal__panel local-case-modal__panel--danger">
              <div className="local-case-modal__header">
                <p className="local-case-modal__eyebrow">Delete local case</p>
                <h2 id="delete-local-case-title">Remove this case from this device?</h2>
                <p>
                  This deletes the local draft for {localCase.id}. It cannot be
                  recovered from ResolveScope because it was never uploaded or
                  synced.
                </p>
              </div>
              <div className="local-case-modal__actions">
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => setIsDeleteConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn--primary btn--danger"
                  onClick={handleDeleteLocalCase}
                >
                  Delete case
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="workspace">
      <div className="workspace__header">
        <Link to="/dashboard" className="workspace__back">
          <BackIcon />
          All cases
        </Link>
        <div className="workspace__header-main">
          <h1 className="workspace__title">Case {id}</h1>
          <span className="badge badge--status-open">Open</span>
        </div>
      </div>

      <div className="workspace__body">
        <div className="workspace__main">
          <section className="workspace__section">
            <h2 className="workspace__section-title">Evidence</h2>
            <div className="workspace__empty">
              <p>No evidence uploaded yet.</p>
              <button className="btn btn--outline btn--sm" disabled>
                Upload evidence
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
