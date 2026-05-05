import {
  type ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import type { SpatialMarker, EvidenceItem } from "../../types/case";
import { ImageViewerOverlay } from "./ImageViewerOverlay";
import { NoteViewerOverlay } from "./NoteViewerOverlay";
import { PdfViewerOverlay } from "./PdfViewerOverlay";

interface Props {
  markers: SpatialMarker[];
  evidence: EvidenceItem[];
  templateId: string;
}

const SEVERITY_LABELS: Record<SpatialMarker["severity"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const STATUS_LABELS: Record<NonNullable<SpatialMarker["status"]>, string> = {
  open: "Open",
  resolved: "Resolved",
  "needs-review": "Needs Review",
};

const getEvidenceFileLabel = (item: EvidenceItem) => {
  if (item.mimeType?.includes("pdf") || item.name.toLowerCase().endsWith(".pdf")) {
    return "PDF";
  }

  return item.type;
};

const getEvidenceFileAction = (item: EvidenceItem) => {
  if (item.mimeType?.includes("pdf") || item.name.toLowerCase().endsWith(".pdf")) {
    return "Open PDF";
  }

  return "Open file";
};

type SceneTone = "copper" | "forest" | "slate";

interface SceneMeta {
  title: string;
  subtitle: string;
  eyebrow: string;
  helper: string;
  tone: SceneTone;
  metrics: string[];
}

const SCENE_META: Record<string, SceneMeta> = {
  "auto-claim": {
    title: "Hazard Avoidance Review",
    subtitle: "Cone-marked pavement damage, sedan reverse-out angle, and claimant impact path aligned in one spatial reconstruction",
    eyebrow: "3D incident reconstruction",
    helper: "Orbit the claimant SUV, reversing sedan, road crack, cones, and repair evidence in one view so the contact narrative stays reviewable",
    tone: "copper",
    metrics: ["4 evidence anchors", "Hazard avoidance contact", "$1,070 estimate"],
  },
  "fleet-safety": {
    title: "Dock Maneuver Risk Replay",
    subtitle: "Warehouse reverse path, exclusion-zone breach, and operator distraction in one operational view",
    eyebrow: "3D safety reconstruction",
    helper: "The scene clarifies where the unit moved, what it struck, and which risk controls failed during the maneuver",
    tone: "forest",
    metrics: ["4 risk anchors", "4.2 mph impact", "Bay 4 workflow"],
  },
  "site-inspection": {
    title: "Facade Condition Map",
    subtitle: "Structural issues, envelope failures, and pedestrian hazards layered onto a premium spatial building model",
    eyebrow: "3D inspection review",
    helper: "Reviewers can scan the whole building instantly, then open each finding with linked evidence and remediation context",
    tone: "slate",
    metrics: ["4 field findings", "Exterior envelope", "Priority remediation"],
  },
};

function toneClassName(tone: SceneTone) {
  return `spatial-panel--${tone}`;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 2.35;
const ZOOM_STEP = 0.18;
const BASE_DRAG_ALLOWANCE = 28;
const MIN_SCENE_LOADING_MS = 500;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatAnchorNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function formatCount(value: number) {
  return String(value).padStart(2, "0");
}

function formatSectionLabel(sectionKey?: string) {
  if (!sectionKey) return "Supporting evidence";
  return sectionKey
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (match) => match.toUpperCase());
}

type KenneySceneProps = {
  selectedMarkerId?: string;
  onSelectMarker?: (markerId: string | null) => void;
  markers: SpatialMarker[];
  zoom: number;
  resetToken: number;
  interactive: boolean;
  allowScrollZoom: boolean;
};

type KenneySceneComponent = ComponentType<KenneySceneProps>;

function loadKenneyScene(templateId: string): Promise<KenneySceneComponent | null> {
  if (templateId === "auto-claim") {
    return import("./AutoClaimKenneyScene").then((module) => module.AutoClaimKenneyScene);
  }

  if (templateId === "fleet-safety") {
    return import("./FleetSafetyKenneyScene").then((module) => module.FleetSafetyKenneyScene);
  }

  if (templateId === "site-inspection") {
    return import("./SiteInspectionKenneyScene").then((module) => module.SiteInspectionKenneyScene);
  }

  return Promise.resolve(null);
}

function SpatialSceneLoader({ templateId }: { templateId: string }) {
  const meta = SCENE_META[templateId] ?? SCENE_META["auto-claim"];

  return (
    <div className="spatial-scene__canvas spatial-scene__loader" role="status" aria-live="polite" aria-busy="true">
      <div className="spatial-scene__loader-grid" aria-hidden="true">
        <span className="spatial-scene__loader-pin spatial-scene__loader-pin--one" />
        <span className="spatial-scene__loader-pin spatial-scene__loader-pin--two" />
        <span className="spatial-scene__loader-pin spatial-scene__loader-pin--three" />
        <span className="spatial-scene__loader-path spatial-scene__loader-path--one" />
        <span className="spatial-scene__loader-path spatial-scene__loader-path--two" />
      </div>
      <div className="spatial-scene__loader-copy">
        <span className="spatial-scene__loader-kicker">{meta.eyebrow}</span>
        <strong>Preparing spatial review</strong>
        <span>Resolving evidence anchors and scene geometry.</span>
      </div>
    </div>
  );
}

function SceneIllustration({
  templateId,
  selectedMarkerId,
  onSelectMarker,
  markers,
  zoom,
  resetToken,
  interactive = true,
  allowScrollZoom = false,
}: {
  templateId: string;
  selectedMarkerId?: string;
  onSelectMarker?: (markerId: string | null) => void;
  markers?: SpatialMarker[];
  zoom?: number;
  resetToken?: number;
  interactive?: boolean;
  allowScrollZoom?: boolean;
}) {
  const [hasMinimumLoadingElapsed, setHasMinimumLoadingElapsed] = useState(false);
  const [SceneComponent, setSceneComponent] = useState<KenneySceneComponent | null>(null);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [isLoaderExiting, setIsLoaderExiting] = useState(false);

  useEffect(() => {
    let isActive = true;

    setHasMinimumLoadingElapsed(false);
    setSceneComponent(null);
    setIsLoaderVisible(true);
    setIsLoaderExiting(false);

    const timerId = window.setTimeout(() => {
      setHasMinimumLoadingElapsed(true);
    }, MIN_SCENE_LOADING_MS);

    loadKenneyScene(templateId).then((loadedScene) => {
      if (!isActive) return;
      setSceneComponent(() => loadedScene);
    });

    return () => {
      isActive = false;
      window.clearTimeout(timerId);
    };
  }, [templateId]);

  useEffect(() => {
    if (!hasMinimumLoadingElapsed || !SceneComponent) return;

    setIsLoaderExiting(true);
    const timerId = window.setTimeout(() => {
      setIsLoaderVisible(false);
    }, 280);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [hasMinimumLoadingElapsed, SceneComponent]);

  return (
    <div className="spatial-scene__stage">
      {SceneComponent ? (
        <SceneComponent
          selectedMarkerId={selectedMarkerId}
          onSelectMarker={onSelectMarker}
          markers={markers ?? []}
          zoom={zoom ?? MIN_ZOOM}
          resetToken={resetToken ?? 0}
          interactive={interactive}
          allowScrollZoom={allowScrollZoom}
        />
      ) : (
        <div className="spatial-scene__canvas" />
      )}
      {isLoaderVisible && (
        <div className={`spatial-scene__loader-layer${isLoaderExiting ? " spatial-scene__loader-layer--exit" : ""}`}>
          <SpatialSceneLoader templateId={templateId} />
        </div>
      )}
    </div>
  );
}

export function SpatialReviewPanel({ markers, evidence, templateId }: Props) {
  const [selectedId, setSelectedId] = useState<string>("");
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [activeImage, setActiveImage] = useState<{ title: string; src: string } | null>(null);
  const [activePdf, setActivePdf] = useState<{ title: string; src: string } | null>(null);
  const [activeDocument, setActiveDocument] = useState<EvidenceItem | null>(null);

  const sceneViewportRef = useRef<HTMLDivElement | null>(null);
  const sceneSurfaceRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const meta = SCENE_META[templateId] ?? SCENE_META["site-inspection"];
  const isTrue3DScene = templateId === "auto-claim" || templateId === "fleet-safety" || templateId === "site-inspection";
  const allowDirectSceneManipulation = isTrue3DScene || !isCompactViewport;

  useEffect(() => {
    if (!markers.some((marker) => marker.id === selectedId)) {
      setSelectedId("");
    }
  }, [markers, selectedId]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 720px)");
    const syncViewportMode = () => {
      setIsCompactViewport(mediaQuery.matches);
    };

    syncViewportMode();
    mediaQuery.addEventListener("change", syncViewportMode);

    return () => {
      mediaQuery.removeEventListener("change", syncViewportMode);
    };
  }, []);

  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  const selectedMarker = useMemo(
    () => markers.find((m) => m.id === selectedId) ?? null,
    [markers, selectedId]
  );
  const selectedMarkerIndex = selectedMarker
    ? markers.findIndex((marker) => marker.id === selectedMarker.id)
    : -1;

  const relatedEvidence = useMemo(() => {
    if (!selectedMarker) return [] as EvidenceItem[];
    return selectedMarker.relatedEvidenceIds
      .map((id) => evidence.find((item) => item.id === id))
      .filter(Boolean) as EvidenceItem[];
  }, [selectedMarker, evidence]);

  const clampPan = useCallback((nextPan: { x: number; y: number }, nextZoom = zoom) => {
    const rect = sceneViewportRef.current?.getBoundingClientRect();

    if (!rect) return nextPan;

    const maxX = Math.max(((nextZoom - MIN_ZOOM) * rect.width) / 2, BASE_DRAG_ALLOWANCE);
    const maxY = Math.max(((nextZoom - MIN_ZOOM) * rect.height) / 2, BASE_DRAG_ALLOWANCE);

    return {
      x: clamp(nextPan.x, -maxX, maxX),
      y: clamp(nextPan.y, -maxY, maxY),
    };
  }, [zoom]);

  const handleZoomChange = useCallback((nextZoom: number, origin = { x: 0, y: 0 }) => {
    const safeZoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);

    setZoom((currentZoom) => {
      const ratio = safeZoom / currentZoom;

      setPan((currentPan) =>
        clampPan(
          {
            x: origin.x - (origin.x - currentPan.x) * ratio,
            y: origin.y - (origin.y - currentPan.y) * ratio,
          },
          safeZoom
        )
      );

      return safeZoom;
    });
  }, [clampPan]);

  const handleResetView = useCallback(() => {
    setZoom(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
    setResetToken((value) => value + 1);
  }, []);

  const focusMarker = useCallback((marker: SpatialMarker, requestedZoom = Math.max(zoom, 1.18)) => {
    const rect = sceneViewportRef.current?.getBoundingClientRect();
    const safeZoom = clamp(requestedZoom, MIN_ZOOM, MAX_ZOOM);

    setSelectedId(marker.id);

    if (!rect) {
      setZoom(safeZoom);
      return;
    }

    const baseX = (marker.x / 100 - 0.5) * rect.width;
    const baseY = (marker.y / 100 - 0.5) * rect.height;

    setZoom(safeZoom);
    setPan(
      clampPan(
        {
          x: -baseX * safeZoom,
          y: -baseY * safeZoom,
        },
        safeZoom
      )
    );
  }, [clampPan, zoom]);

  const handleWheel = useCallback((event: ReactWheelEvent<HTMLDivElement>) => {
    if (!allowDirectSceneManipulation) return;

    event.preventDefault();

    const rect = sceneViewportRef.current?.getBoundingClientRect();
    const delta = event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;

    if (!rect) {
      handleZoomChange(zoom + delta);
      return;
    }

    handleZoomChange(zoom + delta, {
      x: event.clientX - rect.left - rect.width / 2,
      y: event.clientY - rect.top - rect.height / 2,
    });
  }, [allowDirectSceneManipulation, handleZoomChange, zoom]);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!allowDirectSceneManipulation) return;
    if (!event.isPrimary || event.button !== 0) return;

    const target = event.target as HTMLElement;
    if (target.closest("button")) return;

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
    };

    sceneViewportRef.current?.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }, [allowDirectSceneManipulation, pan.x, pan.y]);

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!allowDirectSceneManipulation) return;
    if (!dragStateRef.current || dragStateRef.current.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - dragStateRef.current.startX;
    const deltaY = event.clientY - dragStateRef.current.startY;

    setPan(
      clampPan(
        {
          x: dragStateRef.current.originX + deltaX,
          y: dragStateRef.current.originY + deltaY,
        },
        zoom
      )
    );
  }, [allowDirectSceneManipulation, clampPan, zoom]);

  const handlePointerUp = useCallback((event?: ReactPointerEvent<HTMLDivElement>) => {
    if (event && dragStateRef.current?.pointerId === event.pointerId) {
      sceneViewportRef.current?.releasePointerCapture(event.pointerId);
    }

    dragStateRef.current = null;
    setIsDragging(false);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    setIsExpanded((current) => !current);
  }, []);

  const tilt = useMemo(
    () => ({
      x: clamp(-pan.y / 22, -7, 7),
      y: clamp(pan.x / 22, -7, 7),
    }),
    [pan.x, pan.y]
  );

  const activeAnchorNumber = selectedMarkerIndex >= 0 ? formatAnchorNumber(selectedMarkerIndex) : "00";
  const totalAnchorCount = formatCount(markers.length);

  return (
    <>
    <section
      className={[
        "spatial-panel",
        toneClassName(meta.tone),
        isCompactViewport ? "spatial-panel--compact" : "",
      ].filter(Boolean).join(" ")}
      aria-label="Spatial annotation review"
      data-tour="demo-spatial-review"
    >
      <div className="spatial-panel__body spatial-panel__body--single">
        <div className="spatial-panel__scene-wrap">
          <div
            className={[
              "spatial__full",
              "spatial-panel__viewer",
              isExpanded ? "spatial-panel__viewer--expanded" : "",
            ].filter(Boolean).join(" ")}
          >
            <div className="spatial__toolbar spatial-panel__toolbar">
              <div className="spatial__toolbar-left">
                <span className="spatial__toolbar-badge">3D</span>
                <span className="spatial__toolbar-title">Spatial Review</span>
              </div>
              <div className="spatial-panel__toolbar-actions">
                <span className="spatial__toolbar-meta">{markers.length} annotations</span>
                <button
                  type="button"
                  className="spatial-panel__toolbar-action"
                  onClick={handleResetView}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="spatial-panel__toolbar-action"
                  onClick={handleToggleFullscreen}
                >
                  {isExpanded ? "Collapse" : "Expand"}
                </button>
              </div>
            </div>

            <div className="spatial-panel__marker-index spatial-panel__marker-index--tabs">
              {markers.map((marker, index) => (
                <button
                  key={marker.id}
                  type="button"
                  className={[
                    "spatial-index-item",
                    `spatial-index-item--${marker.severity}`,
                    selectedMarker?.id === marker.id ? "spatial-index-item--active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => focusMarker(marker)}
                >
                  <span className="spatial-index-item__number">{formatAnchorNumber(index)}</span>
                  <span className="spatial-index-item__label">{marker.label}</span>
                  {marker.status && (
                    <span className={`spatial-index-item__status spatial-index-item__status--${marker.status}`}>
                      {STATUS_LABELS[marker.status]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="spatial__canvas-wrap spatial-panel__canvas-shell" data-tour="demo-spatial-scene">
              <div
                className="spatial-panel__scene-surface spatial-panel__scene-surface--landing"
                ref={sceneSurfaceRef}
              >
                {selectedMarker && (
                  <div className="spatial__overlay spatial-panel__overlay">
                    <p className="section-label section-label--light">
                      Anchor {activeAnchorNumber} of {totalAnchorCount}
                    </p>
                    <h3 className="spatial-panel__overlay-title">{selectedMarker.label}</h3>
                    <p className="spatial__overlay-body">
                      {selectedMarker.note}
                    </p>
                  </div>
                )}

                <div className="spatial__zoom spatial-panel__zoom">
                  <button
                    className="spatial__zoom-btn"
                    onClick={() => handleZoomChange(zoom + ZOOM_STEP)}
                    aria-label="Zoom in"
                    type="button"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button
                    className="spatial__zoom-btn"
                    onClick={() => handleZoomChange(zoom - ZOOM_STEP)}
                    aria-label="Zoom out"
                    type="button"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                <div className="spatial-scene__visual">
                  {isTrue3DScene ? (
                    <div className="spatial-scene__true3d">
                      <SceneIllustration
                        templateId={templateId}
                        selectedMarkerId={selectedMarker?.id}
                        onSelectMarker={(markerId) => setSelectedId(markerId ?? "")}
                        markers={markers}
                        zoom={zoom}
                        resetToken={resetToken}
                        interactive={allowDirectSceneManipulation}
                        allowScrollZoom={isExpanded}
                      />
                    </div>
                  ) : (
                    <div
                      ref={sceneViewportRef}
                      className={[
                        "spatial-scene__viewport",
                        isDragging ? "spatial-scene__viewport--dragging" : "",
                      ].filter(Boolean).join(" ")}
                      onWheel={allowDirectSceneManipulation ? handleWheel : undefined}
                      onPointerDown={allowDirectSceneManipulation ? handlePointerDown : undefined}
                      onPointerMove={allowDirectSceneManipulation ? handlePointerMove : undefined}
                      onPointerUp={allowDirectSceneManipulation ? handlePointerUp : undefined}
                      onPointerLeave={allowDirectSceneManipulation ? handlePointerUp : undefined}
                      onPointerCancel={allowDirectSceneManipulation ? handlePointerUp : undefined}
                      onDoubleClick={allowDirectSceneManipulation ? handleResetView : undefined}
                    >
                      <div
                        className="spatial-scene__transform"
                        style={{
                          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom}) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                        }}
                      >
                        <SceneIllustration templateId={templateId} selectedMarkerId={selectedMarker?.id} />

                        {markers.map((marker, index) => (
                          <button
                            key={marker.id}
                            type="button"
                            className={[
                              "spatial-marker",
                              `spatial-marker--${marker.severity}`,
                              selectedMarker?.id === marker.id ? "spatial-marker--active" : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedId(marker.id);
                            }}
                            aria-label={`${marker.label}: ${SEVERITY_LABELS[marker.severity]} severity`}
                            aria-pressed={selectedMarker?.id === marker.id}
                          >
                            <span className="spatial-marker__pulse" aria-hidden="true" />
                            <span className="spatial-marker__dot" aria-hidden="true" />
                            <span className="spatial-marker__index">{formatAnchorNumber(index)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`spatial__sidebar spatial-panel__sidebar${selectedMarker ? " spatial__sidebar--open" : ""}`}
                >
                  {selectedMarker && (
                    <div className="spatial-marker-detail spatial-marker-detail--sidebar" key={selectedMarker.id}>
                      <div className="spatial__sidebar-header">
                        <div className="spatial-marker-detail__header">
                          <span className={`spatial-marker-detail__severity spatial-marker-detail__severity--${selectedMarker.severity}`}>
                            {SEVERITY_LABELS[selectedMarker.severity]}
                          </span>
                          {selectedMarker.status && (
                            <span className={`spatial-marker-detail__status spatial-marker-detail__status--${selectedMarker.status}`}>
                              {STATUS_LABELS[selectedMarker.status]}
                            </span>
                          )}
                        </div>
                        <button
                          className="spatial__sidebar-close"
                          onClick={() => setSelectedId("")}
                          aria-label="Close"
                          type="button"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>

                      <h3 className="spatial-marker-detail__title">{selectedMarker.label}</h3>
                      <p className="spatial-marker-detail__note">{selectedMarker.note}</p>

                      <div className="spatial-marker-detail__meta-grid">
                        <div className="spatial-marker-detail__meta-card">
                          <span className="spatial-marker-detail__meta-label">Anchor</span>
                          <strong>{activeAnchorNumber} / {totalAnchorCount}</strong>
                        </div>
                        <div className="spatial-marker-detail__meta-card">
                          <span className="spatial-marker-detail__meta-label">Linked evidence</span>
                          <strong>{relatedEvidence.length}</strong>
                        </div>
                        <div className="spatial-marker-detail__meta-card spatial-marker-detail__meta-card--wide">
                          <span className="spatial-marker-detail__meta-label">Scene linkage</span>
                          <strong>{formatSectionLabel(selectedMarker.relatedExtractionSectionKey)}</strong>
                        </div>
                      </div>

                      <div className="spatial-marker-detail__actions">
                        <button
                          type="button"
                          className="spatial-marker-detail__action spatial-marker-detail__action--primary"
                          onClick={() => focusMarker(selectedMarker, Math.max(zoom, 1.2))}
                        >
                          Center in scene
                        </button>
                        <button
                          type="button"
                          className="spatial-marker-detail__action"
                          onClick={handleResetView}
                        >
                          Reset camera
                        </button>
                      </div>

                      {selectedMarker.relatedExtractionSectionKey && (
                        <div className="spatial-marker-detail__section-ref">
                          <span className="spatial-marker-detail__section-ref-label">Related section</span>
                          <span className="spatial-marker-detail__section-ref-key">
                            {selectedMarker.relatedExtractionSectionKey}
                          </span>
                        </div>
                      )}

                      {relatedEvidence.length > 0 && (
                        <div className="spatial-marker-detail__evidence" data-tour="demo-pinned-evidence">
                          <span className="spatial-marker-detail__evidence-label">Supporting evidence</span>
                          <ul className="spatial-marker-detail__evidence-list">
                            {relatedEvidence.map((ev) => (
                              <li key={ev.id} className="spatial-marker-detail__evidence-item">
                                {ev.type === "image" && ev.previewUrl ? (
                                  <button
                                    type="button"
                                    className="spatial-marker-detail__evidence-preview-button"
                                    onClick={() => setActiveImage({ title: ev.name, src: ev.previewUrl! })}
                                    aria-label={`Expand ${ev.name}`}
                                  >
                                    <img
                                      className="spatial-marker-detail__evidence-image"
                                      src={ev.previewUrl}
                                      alt=""
                                      loading="lazy"
                                    />
                                    <span className="spatial-marker-detail__evidence-preview-overlay">
                                      <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                                        <path d="M3 3h5M3 3v5M15 3h-5M15 3v5M3 15h5M3 15v-5M15 15h-5M15 15v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                      </svg>
                                      Expand
                                    </span>
                                  </button>
                                ) : ev.previewUrl ? (
                                  <a
                                    className="spatial-marker-detail__evidence-file"
                                    href={ev.previewUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(event) => {
                                      const isPdf = ev.mimeType?.includes("pdf") || ev.name.toLowerCase().endsWith(".pdf");
                                      if (!isPdf) return;
                                      event.preventDefault();
                                      setActivePdf({ title: ev.name, src: ev.previewUrl! });
                                    }}
                                  >
                                    <span className="spatial-marker-detail__evidence-file-type">
                                      {getEvidenceFileLabel(ev)}
                                    </span>
                                    <span className="spatial-marker-detail__evidence-file-action">
                                      {getEvidenceFileAction(ev)}
                                    </span>
                                  </a>
                                ) : (
                                  <button
                                    type="button"
                                    className="spatial-marker-detail__evidence-file spatial-marker-detail__evidence-file--static"
                                    onClick={() => setActiveDocument(ev)}
                                    aria-label={`Expand ${ev.name}`}
                                  >
                                    <span className="spatial-marker-detail__evidence-file-type">
                                      {getEvidenceFileLabel(ev)}
                                    </span>
                                    <span className="spatial-marker-detail__evidence-file-action">
                                      Expand summary
                                    </span>
                                  </button>
                                )}
                                <div className="spatial-marker-detail__evidence-body">
                                  <span className={`spatial-evidence-type spatial-evidence-type--${ev.type}`}>
                                    {ev.type}
                                  </span>
                                  <div className="spatial-marker-detail__evidence-copy">
                                    <span className="spatial-marker-detail__evidence-name">{ev.name}</span>
                                    <span className="spatial-marker-detail__evidence-desc">{ev.description}</span>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="spatial__statusbar spatial-panel__statusbar">
              <span>{meta.metrics.join(" · ")}</span>
              <span>
                {allowDirectSceneManipulation
                  ? isExpanded
                    ? "click a pin to inspect · drag to orbit · scroll to zoom"
                    : "click a pin to inspect · drag to orbit · zoom with +/-"
                  : "use marker tabs to inspect · page scroll stays active · zoom with +/-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
    {activeImage && (
      <ImageViewerOverlay
        title={activeImage.title}
        src={activeImage.src}
        onClose={() => setActiveImage(null)}
      />
    )}
    {activePdf && (
      <PdfViewerOverlay
        title={activePdf.title}
        src={activePdf.src}
        onClose={() => setActivePdf(null)}
      />
    )}
    {activeDocument && (
      <NoteViewerOverlay
        title={activeDocument.name}
        body={activeDocument.description}
        uploadedBy={activeDocument.uploadedBy}
        uploadedAt={activeDocument.uploadedAt}
        onClose={() => setActiveDocument(null)}
      />
    )}
    </>
  );
}
