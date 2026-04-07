import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Edges, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/* ── Camera ──────────────────────────── */
const INITIAL_CAM: [number, number, number] = [24, 18, 24];

/* ── Palette ─────────────────────────── */
const COPPER = "#b85a30";
const FOREST = "#2a6b4a";
const AMBER = "#c49a3c";
const BASE_COLOR = "#222120";
const GRID_COLOR = "#2e2c2a";

/* ─────────────────────────────────────── *
 *  Scene data                             *
 * ─────────────────────────────────────── */

interface BoxDef {
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
  edges?: string;
}

interface CylDef {
  pos: [number, number, number];
  radius: number;
  height: number;
  color: string;
}

interface ZoneDef {
  pos: [number, number, number];
  size: [number, number];
  color: string;
  opacity: number;
}

interface AnnotationDef {
  pin: [number, number, number];
  color: string;
  status: string;
  label: string;
  detail: string;
  notes: string;
  reviewer: string;
  image: string;
  align: "left" | "center" | "right";
}

/* Main structures */
const STRUCTURES: BoxDef[] = [
  { pos: [0, 0, -0.5], size: [3.4, 2.8, 3.2], color: "#d6d2ca", edges: "#a09c94" },
  { pos: [0.8, 2.8, -0.2], size: [1.1, 0.65, 0.9], color: "#aaa69e", edges: "#908c84" },
  { pos: [-0.9, 2.8, -1.0], size: [0.6, 0.4, 0.5], color: "#b0aca4", edges: "#908c84" },
  { pos: [-4.0, 0, 1.0], size: [2.4, 1.4, 2.4], color: "#d2cec6", edges: "#a09c94" },
  { pos: [-4.0, 0, -0.8], size: [1.4, 1.4, 1.4], color: "#d2cec6", edges: "#a09c94" },
  { pos: [4.2, 0, -0.5], size: [2.6, 1.9, 2.2], color: "#d6d2ca", edges: "#a09c94" },
  { pos: [4.6, 1.9, -0.5], size: [0.7, 0.35, 0.6], color: "#aaa69e", edges: "#908c84" },
  { pos: [0.8, 0, 4.0], size: [4.0, 0.7, 1.8], color: "#ccc8c0", edges: "#a09c94" },
  { pos: [-2.8, 0, -4.0], size: [2.0, 1.1, 1.8], color: "#d0ccc4", edges: "#a09c94" },
  { pos: [4.0, 0, 2.2], size: [1.2, 0.38, 3.2], color: "#c8c4bc", edges: "#9c9890" },
];

const DETAIL_BOXES: BoxDef[] = [
  { pos: [-5.2, 0, 3.5], size: [0.8, 0.5, 0.8], color: "#c0bcb4", edges: "#9c9890" },
  { pos: [5.8, 0, -3.5], size: [0.6, 0.35, 0.6], color: "#c0bcb4", edges: "#9c9890" },
  { pos: [-1.8, 0, 2.0], size: [0.5, 0.7, 0.4], color: "#b8b4ac", edges: "#908c84" },
  { pos: [2.6, 0, 4.0], size: [1.2, 0.25, 0.5], color: "#bab6ae", edges: "#9c9890" },
  { pos: [6.0, 0, 2.0], size: [0.9, 0.9, 0.9], color: "#ccc8c0", edges: "#a09c94" },
  { pos: [0, 0, 1.6], size: [5.5, 0.55, 0.1], color: "#b0ada5", edges: "#908c84" },
];

const CYLINDERS: CylDef[] = [
  { pos: [-5.5, 0, -2.5], radius: 0.5, height: 1.3, color: "#bab6ae" },
  { pos: [-5.5, 0, -1.2], radius: 0.35, height: 0.9, color: "#b0aca4" },
  { pos: [5.8, 0, 3.8], radius: 0.3, height: 0.7, color: "#bab6ae" },
];

const PATHS: BoxDef[] = [
  { pos: [0, -0.005, 1.6], size: [8, 0.01, 0.5], color: "#302e2c", edges: "" },
  { pos: [-1.6, -0.005, 0.3], size: [0.5, 0.01, 5.5], color: "#302e2c", edges: "" },
  { pos: [2.2, -0.005, 0.3], size: [0.5, 0.01, 5.5], color: "#302e2c", edges: "" },
  { pos: [0.3, -0.005, -2.8], size: [4, 0.01, 0.4], color: "#302e2c", edges: "" },
];

const ZONES: ZoneDef[] = [
  { pos: [0.3, 0.02, -0.3], size: [4.2, 4.0], color: COPPER, opacity: 0.06 },
  { pos: [-4.0, 0.02, 0.2], size: [3.0, 3.0], color: FOREST, opacity: 0.08 },
  { pos: [4.2, 0.02, -0.5], size: [3.2, 2.8], color: AMBER, opacity: 0.05 },
  { pos: [0.8, 0.02, 4.0], size: [4.6, 2.4], color: COPPER, opacity: 0.04 },
];

const ANNOTATIONS: AnnotationDef[] = [
  {
    pin: [-4.0, 1.8, 1.0],
    color: FOREST,
    status: "Cleared",
    label: "Inspection passed",
    detail: "Wing B · reviewed 2h ago",
    notes: "All structural elements within tolerance. No remediation required. Field photos attached to case file.",
    reviewer: "J. Morales",
    image: "/assets/pin1.png",
    align: "left",
  },
  {
    pin: [0.8, 3.8, -0.5],
    color: COPPER,
    status: "Flagged",
    label: "Structural crack detected",
    detail: "East facade · severity high",
    notes: "Hairline fracture 14cm running vertically from parapet. Requires engineering sign-off before occupancy clearance.",
    reviewer: "A. Chen",
    image: "/assets/pin2.png",
    align: "right",
  },
  {
    pin: [4.2, 2.4, -0.5],
    color: COPPER,
    status: "Review",
    label: "Surface erosion noted",
    detail: "Zone C · pending reviewer",
    notes: "Mortar joint degradation on south-facing wall. Estimated 30% loss. Assign to masonry specialist for severity rating.",
    reviewer: "Unassigned",
    image: "/assets/pin3.png",
    align: "right",
  },
  {
    pin: [0.8, 1.2, 4.0],
    color: AMBER,
    status: "Noted",
    label: "Access point documented",
    detail: "Annex entry · routine",
    notes: "Secondary access door logged for site record. No defect observed. Confirm with facilities team before final report.",
    reviewer: "T. Park",
    image: "/assets/pin4.png",
    align: "left",
  },
];

/* ─────────────────────────────────────── *
 *  Components                             *
 * ─────────────────────────────────────── */

function Box({ pos, size, color, edges }: BoxDef) {
  return (
    <mesh position={[pos[0], pos[1] + size[1] / 2, pos[2]]}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.82} metalness={0.02} />
      {edges && <Edges threshold={15} color={edges} />}
    </mesh>
  );
}

function Cylinder({ pos, radius, height, color }: CylDef) {
  return (
    <mesh position={[pos[0], pos[1] + height / 2, pos[2]]}>
      <cylinderGeometry args={[radius, radius, height, 24]} />
      <meshStandardMaterial color={color} roughness={0.75} metalness={0.08} />
    </mesh>
  );
}

function Zone({ pos, size, color, opacity }: ZoneDef) {
  return (
    <mesh position={pos} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={size} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── Interactive annotation pin ──────── */

const _v3 = new THREE.Vector3();

function Annotation({
  pin,
  color,
  status: _status,
  label: _label,
  detail: _detail,
  align: _align,
  isActive,
  isAnyActive,
  onSelect,
}: AnnotationDef & {
  isActive: boolean;
  isAnyActive: boolean;
  onSelect: () => void;
}) {
  const headRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  const dimmed = isAnyActive && !isActive;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Bobbing — stop when active
    if (headRef.current) {
      const bob = isActive ? 0 : Math.sin(t * 0.9 + offset) * 0.04;
      headRef.current.position.y = pin[1] + bob;
    }

    // Sphere hover / active scale
    if (sphereRef.current) {
      const target = hovered || isActive ? 1.5 : 1;
      _v3.set(target, target, target);
      sphereRef.current.scale.lerp(_v3, 0.12);
    }

    // Pulse ring
    if (ringRef.current) {
      const p = 0.85 + Math.sin(t * 1.8 + offset) * 0.15;
      ringRef.current.scale.set(p, p, 1);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity =
        (dimmed ? 0.08 : isActive ? 0.5 : 0.3) * (1.1 - p);
    }
  });

  const handleOver = useCallback(() => {
    setHovered(true);
    document.body.style.cursor = "pointer";
  }, []);

  const handleOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = "auto";
  }, []);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onSelect();
    },
    [onSelect]
  );

  const stemLen = pin[1] - 0.08;
  const sphereEmissive = isActive ? 0.9 : dimmed ? 0.15 : 0.5;
  const stemOpacity = dimmed ? 0.1 : 0.3;

  return (
    <group>
      {/* Stem */}
      <mesh position={[pin[0], stemLen / 2, pin[2]]}>
        <cylinderGeometry args={[0.014, 0.014, stemLen, 6]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={stemOpacity}
          roughness={0.5}
        />
      </mesh>

      {/* Floating head */}
      <group ref={headRef} position={[pin[0], pin[1], pin[2]]}>
        {/* Clickable sphere */}
        <mesh
          ref={sphereRef}
          onClick={handleClick}
          onPointerOver={handleOver}
          onPointerOut={handleOut}
        >
          <sphereGeometry args={[0.14, 20, 20]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={sphereEmissive}
            roughness={0.3}
            transparent
            opacity={dimmed ? 0.35 : 1}
          />
        </mesh>

        {/* Pulse ring */}
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.18, 0.24, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

/* ── Subtle scan pulse ───────────────── */

function ScanPulse() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = (clock.getElapsedTime() % 7) / 7;
      const scale = 0.4 + t * 4;
      ref.current.scale.set(scale, scale, 1);
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        (1 - t) * 0.04;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
      <ringGeometry args={[0.92, 1.0, 64]} />
      <meshBasicMaterial
        color={COPPER}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── Full scene ──────────────────────── */

function Scene({
  activePin,
  onSelectPin,
}: {
  activePin: number | null;
  onSelectPin: (i: number | null) => void;
}) {
  return (
    <>
      <group>
        {/* Ground — click to deselect */}
        <mesh
          position={[0, -0.06, 0]}
          onClick={() => onSelectPin(null)}
        >
          <boxGeometry args={[14, 0.12, 14]} />
          <meshStandardMaterial color={BASE_COLOR} roughness={0.95} />
          <Edges threshold={15} color="#3a3735" />
        </mesh>

        <gridHelper
          args={[14, 28, GRID_COLOR, GRID_COLOR]}
          position={[0, 0.006, 0]}
        />

        {PATHS.map((p, i) => (
          <Box key={`path-${i}`} {...p} />
        ))}
        {STRUCTURES.map((s, i) => (
          <Box key={`struct-${i}`} {...s} />
        ))}
        {DETAIL_BOXES.map((d, i) => (
          <Box key={`detail-${i}`} {...d} />
        ))}
        {CYLINDERS.map((c, i) => (
          <Cylinder key={`cyl-${i}`} {...c} />
        ))}
        {ZONES.map((z, i) => (
          <Zone key={`zone-${i}`} {...z} />
        ))}

        {/* Interactive annotations */}
        {ANNOTATIONS.map((a, i) => (
          <Annotation
            key={`ann-${i}`}
            {...a}
            isActive={activePin === i}
            isAnyActive={activePin !== null}
            onSelect={() =>
              onSelectPin(activePin === i ? null : i)
            }
          />
        ))}

        <ScanPulse />
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 12, 6]} intensity={1.0} color="#faf5ed" />
      <directionalLight
        position={[-5, 8, -4]}
        intensity={0.3}
        color="#e8e4dc"
      />
      <pointLight position={[0, 6, 0]} intensity={0.2} color="#fff5eb" />

      <ContactShadows
        position={[0, -0.005, 0]}
        opacity={0.2}
        scale={16}
        blur={2.5}
        far={5}
        color="#000"
      />
    </>
  );
}

/* ── Smooth camera zoom ──────────────── */

function CameraZoom({ target }: { target: number }) {
  const camera = useThree((s) => s.camera);

  useFrame(() => {
    camera.zoom += (target - camera.zoom) * 0.08;
    camera.updateProjectionMatrix();
  });

  return null;
}

/* ── Smooth camera return to home ────── */

const HOME_POS = new THREE.Vector3(...INITIAL_CAM);
const HOME_TARGET = new THREE.Vector3(0, 0, 0);
const _pos = new THREE.Vector3();
const _tgt = new THREE.Vector3();

function CameraReturn({
  returning,
  orbitRef,
  onComplete,
}: {
  returning: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orbitRef: React.RefObject<any>;
  onComplete: () => void;
}) {
  const camera = useThree((s) => s.camera);

  useFrame(() => {
    if (!returning || !orbitRef.current) return;

    _pos.copy(camera.position);
    _tgt.copy(orbitRef.current.target);

    camera.position.lerp(HOME_POS, 0.04);
    orbitRef.current.target.lerp(HOME_TARGET, 0.04);
    orbitRef.current.update();

    const posClose = camera.position.distanceTo(HOME_POS) < 0.05;
    const tgtClose = orbitRef.current.target.distanceTo(HOME_TARGET) < 0.02;
    if (posClose && tgtClose) {
      camera.position.copy(HOME_POS);
      orbitRef.current.target.copy(HOME_TARGET);
      orbitRef.current.update();
      onComplete();
    }
  });

  return null;
}

/* ── Exported component ──────────────── */

/* ── Annotation sidebar ──────────────── */

const STATUS_COLORS: Record<string, string> = {
  Flagged: "#b85a30",
  Review: "#c49a3c",
  Cleared: "#2a6b4a",
  Noted: "#c49a3c",
};

function AnnotationSidebar({
  annotation,
  onClose,
}: {
  annotation: AnnotationDef | null;
  onClose: () => void;
}) {
  const visible = annotation !== null;
  const color = annotation ? STATUS_COLORS[annotation.status] ?? annotation.color : "#888";
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => { setLightbox(false); }, [annotation]);

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <>
      <div className={`spatial__sidebar${visible ? " spatial__sidebar--open" : ""}`}>
        {annotation && (
          <>
            <div className="spatial__sidebar-header">
              <div className="spatial__sidebar-status" style={{ color }}>
                {annotation.status}
              </div>
              <button
                className="spatial__sidebar-close"
                onClick={onClose}
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="spatial__sidebar-label">{annotation.label}</div>
            <div className="spatial__sidebar-detail">{annotation.detail}</div>
            <button
              className="spatial__sidebar-image-wrap"
              onClick={() => setLightbox(true)}
              aria-label="Expand image"
            >
              <img
                src={annotation.image}
                alt={annotation.label}
                className="spatial__sidebar-image"
              />
              <div className="spatial__sidebar-image-overlay">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 3h5M3 3v5M15 3h-5M15 3v5M3 15h5M3 15v-5M15 15h-5M15 15v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span>Expand</span>
              </div>
            </button>
            <div className="spatial__sidebar-notes">{annotation.notes}</div>
            <div className="spatial__sidebar-meta">
              <span className="spatial__sidebar-meta-key">Reviewer</span>
              <span className="spatial__sidebar-meta-val">{annotation.reviewer}</span>
            </div>
            <div
              className="spatial__sidebar-accent"
              style={{ background: color }}
            />
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && annotation && (
        <div
          className="spatial__lightbox"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label={annotation.label}
        >
          <button
            className="spatial__lightbox-close"
            onClick={() => setLightbox(false)}
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <img
            src={annotation.image}
            alt={annotation.label}
            className="spatial__lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

/* ── Exported component ──────────────── */

const RESUME_DELAY = 4_000;

export function SpatialPreview() {
  const [activePin, setActivePin] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1.4);
  const [hovered, setHovered] = useState(false);
  const [userInteracting, setUserInteracting] = useState(false);
  const [returning, setReturning] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitRef = useRef<any>(null);

  const scheduleResume = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      setUserInteracting(false);
      setReturning(true);
    }, RESUME_DELAY);
  }, []);

  const handleInteractStart = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setReturning(false);
    setUserInteracting(true);
  }, []);

  const handleInteractEnd = useCallback(() => {
    scheduleResume();
  }, [scheduleResume]);

  // Pause while hovered, resume timer on leave
  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    if (userInteracting) scheduleResume();
  }, [userInteracting, scheduleResume]);

  const zoomIn = useCallback(
    () => { handleInteractStart(); setZoom((z) => Math.min(z + 0.3, 2.5)); handleInteractEnd(); },
    [handleInteractStart, handleInteractEnd]
  );
  const zoomOut = useCallback(
    () => { handleInteractStart(); setZoom((z) => Math.max(z - 0.3, 0.4)); handleInteractEnd(); },
    [handleInteractStart, handleInteractEnd]
  );

  const activeAnnotation = activePin !== null ? ANNOTATIONS[activePin] : null;
  const autoRotate = activePin === null && !userInteracting && !hovered;

  return (
    <>
      <Canvas
        camera={{ position: INITIAL_CAM, fov: 26, near: 0.1, far: 120 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        style={{ background: "#1a1918" }}
        onPointerMissed={() => setActivePin(null)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <fog attach="fog" args={["#1a1918", 30, 60]} />
        <CameraZoom target={zoom} />
        <CameraReturn
          returning={returning}
          orbitRef={orbitRef}
          onComplete={() => setReturning(false)}
        />
        <Scene activePin={activePin} onSelectPin={setActivePin} />
        <OrbitControls
          ref={orbitRef}
          enableZoom={false}
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.25}
          maxPolarAngle={Math.PI / 2.3}
          minPolarAngle={Math.PI / 6}
          onStart={handleInteractStart}
          onEnd={handleInteractEnd}
        />
      </Canvas>

      <AnnotationSidebar
        annotation={activeAnnotation}
        onClose={() => setActivePin(null)}
      />

      <div className="spatial__zoom">
        <button
          className="spatial__zoom-btn"
          onClick={zoomIn}
          aria-label="Zoom in"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <button
          className="spatial__zoom-btn"
          onClick={zoomOut}
          aria-label="Zoom out"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </>
  );
}
