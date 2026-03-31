import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html, Edges, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

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
    detail: "Wing B -- reviewed 2h ago",
    align: "left",
  },
  {
    pin: [0.8, 3.8, -0.5],
    color: COPPER,
    status: "Flagged",
    label: "Structural crack detected",
    detail: "East facade -- severity high",
    align: "right",
  },
  {
    pin: [4.2, 2.4, -0.5],
    color: COPPER,
    status: "Review",
    label: "Surface erosion noted",
    detail: "Zone C -- pending reviewer",
    align: "right",
  },
  {
    pin: [0.8, 1.2, 4.0],
    color: AMBER,
    status: "Noted",
    label: "Access point documented",
    detail: "Annex entry -- routine",
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
  status,
  label,
  detail,
  align,
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

    // Bobbing
    if (headRef.current) {
      headRef.current.position.y =
        pin[1] + Math.sin(t * 0.9 + offset) * 0.04;
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

  const labelTransform =
    align === "left"
      ? "translateX(-100%) translateX(-10px)"
      : align === "right"
        ? "translateX(10px)"
        : "translateX(-50%)";

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
        {/* Clickable sphere — slightly larger for easier click target */}
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

        {/* Label — always mounted, visibility animated */}
        <Html
          position={[0, 0.45, 0]}
          distanceFactor={18}
          occlude={false}
          style={{
            pointerEvents: isActive ? "auto" : "none",
            userSelect: "none",
          }}
        >
          <div
            style={{
              background: "rgba(250,250,247,0.96)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              borderRadius: "7px",
              padding: "8px 12px",
              borderLeft: `3px solid ${color}`,
              fontFamily: "Outfit, system-ui, sans-serif",
              lineHeight: 1.45,
              color: "#1a1917",
              boxShadow:
                "0 4px 24px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)",
              whiteSpace: "nowrap",
              transform: `${labelTransform} scale(${isActive ? 1 : 0.9})`,
              opacity: isActive ? 1 : 0,
              transition: "opacity 0.25s ease, transform 0.25s ease",
            }}
          >
            <div
              style={{
                fontSize: "8px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color,
                marginBottom: "2px",
              }}
            >
              {status}
            </div>
            <div style={{ fontWeight: 500, fontSize: "11px" }}>{label}</div>
            <div
              style={{
                color: "#9c978e",
                fontSize: "9px",
                marginTop: "1px",
              }}
            >
              {detail}
            </div>
          </div>
        </Html>
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

/* ── Exported component ──────────────── */

export function SpatialPreview() {
  const [activePin, setActivePin] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

  const zoomIn = useCallback(
    () => setZoom((z) => Math.min(z + 0.3, 2.5)),
    []
  );
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(z - 0.3, 0.4)),
    []
  );

  return (
    <>
      <Canvas
        camera={{ position: [24, 18, 24], fov: 26, near: 0.1, far: 120 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        style={{ background: "#1a1918" }}
        onPointerMissed={() => setActivePin(null)}
      >
        <fog attach="fog" args={["#1a1918", 30, 60]} />
        <CameraZoom target={zoom} />
        <Scene activePin={activePin} onSelectPin={setActivePin} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.25}
          maxPolarAngle={Math.PI / 2.3}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>

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
