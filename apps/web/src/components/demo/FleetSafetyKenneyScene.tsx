import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import type { SpatialMarker } from "../../types/case";
import { useTheme } from "../../theme/theme";

const HOME_CAMERA: [number, number, number] = [8.6, 6.4, 10.8];
const SCENE_GROUP_ROTATION: [number, number, number] = [0.02, -0.46, 0.01];
const SCENE_GROUP_POSITION: [number, number, number] = [0.18, -0.06, 0.08];
const FLEET_VAN_MODEL = "/assets/kenney-car-kit/vehicle-scene/van.glb";

const FLEET_MARKER_POSITIONS: Record<string, [number, number, number]> = {
  "flt-001": [1.22, 0.04, 0.8],
  "flt-002": [1.88, 0.04, 0.42],
  "flt-003": [-2.18, 0.04, 0.32],
  "flt-004": [-1.24, 0.04, 1.18],
};

type SceneTheme = "light" | "dark";

const FLEET_SCENE = {
  dark: {
    background: "#000000",
    fog: "#0c1311",
    ambient: "#e5fff4",
    key: "#ecfff6",
    fill: "#8aa39a",
    floor: "#1b2522",
    wall: "#101816",
    bayMark: "#d7e6df",
    bayInterior: "#1b2522",
    path: "#8fe8c7",
  },
  light: {
    background: "#f4f7f0",
    fog: "#dce8df",
    ambient: "#fbfff7",
    key: "#ffffff",
    fill: "#94a99e",
    floor: "#cfd9d1",
    wall: "#dbe4db",
    bayMark: "#f7fbf7",
    bayInterior: "#bbc9bf",
    path: "#2fa777",
  },
} satisfies Record<SceneTheme, Record<string, string>>;

function severityColor(severity: SpatialMarker["severity"]) {
  if (severity === "critical") return "#b12828";
  if (severity === "high") return "#d85a4c";
  if (severity === "medium") return "#d1a348";
  return "#3da170";
}

function FloorMarking({
  position,
  size,
  rotation = 0,
  color = "#c7efdc",
  opacity = 0.62,
}: {
  position: [number, number, number];
  size: [number, number];
  rotation?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, rotation]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.95} />
    </mesh>
  );
}

function DoorFace({
  label,
  z,
  labelZ,
  labelRotation = 0,
}: {
  label: string;
  z: number;
  labelZ: number;
  labelRotation?: number;
}) {
  return (
    <>
      <mesh position={[0, 1.54, z]}>
        <boxGeometry args={[1.7, 2.5, 0.08]} />
        <meshStandardMaterial color="#31433d" roughness={0.84} />
      </mesh>
      {Array.from({ length: 5 }).map((_, index) => (
        <mesh key={index} position={[0, 0.52 + index * 0.48, z * 1.42]}>
          <boxGeometry args={[1.68, 0.025, 0.025]} />
          <meshStandardMaterial color="#5f766f" roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 3.16, z * 1.24]}>
        <boxGeometry args={[0.86, 0.22, 0.05]} />
        <meshStandardMaterial color="#d7e6df" roughness={0.5} />
      </mesh>
      <mesh position={[0, 3.16, labelZ]}>
        <planeGeometry args={[0.72, 0.16]} />
        <meshBasicMaterial color="#121816" side={THREE.DoubleSide} />
      </mesh>
      <TextPlate label={label} position={[0, 3.16, labelZ + Math.sign(labelZ) * 0.005]} rotationY={labelRotation} />
    </>
  );
}

function DockDoor({ position, label }: { position: [number, number, number]; label: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[2.05, 3, 0.52]} />
        <meshStandardMaterial color="#18221f" roughness={0.88} metalness={0.05} />
      </mesh>
      <DoorFace label={label} z={-0.24} labelZ={-0.35} labelRotation={Math.PI} />
      <DoorFace label={label} z={0.24} labelZ={0.35} />
    </group>
  );
}

function TextPlate({
  label,
  position,
  rotationY = 0,
}: {
  label: string;
  position: [number, number, number];
  rotationY?: number;
}) {
  const canvas = useMemo(() => {
    const element = document.createElement("canvas");
    element.width = 256;
    element.height = 72;
    const context = element.getContext("2d");

    if (context) {
      context.fillStyle = "#121816";
      context.fillRect(0, 0, element.width, element.height);
      context.fillStyle = "#d7e6df";
      context.font = "700 38px sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(label, element.width / 2, element.height / 2);
    }

    return element;
  }, [label]);

  const texture = useMemo(() => new THREE.CanvasTexture(canvas), [canvas]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={position} rotation={[0, rotationY, 0]}>
      <planeGeometry args={[0.64, 0.18]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

function ForkliftModel({ active }: { active: boolean }) {
  return (
    <group position={[1.65, 0.02, 1.02]} rotation={[0, -0.62, 0]}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.38, 1.08]} />
        <meshStandardMaterial color="#c58b2b" roughness={0.72} />
      </mesh>
      <mesh position={[0.02, 0.62, -0.18]} castShadow receiveShadow>
        <boxGeometry args={[0.66, 0.42, 0.52]} />
        <meshStandardMaterial color="#2b2620" roughness={0.78} />
      </mesh>
      <mesh position={[0, 1.02, -0.18]} castShadow>
        <boxGeometry args={[0.74, 0.06, 0.66]} />
        <meshStandardMaterial color="#2b2620" roughness={0.65} />
      </mesh>
      <mesh position={[-0.42, 0.78, -0.18]} castShadow>
        <boxGeometry args={[0.06, 0.78, 0.06]} />
        <meshStandardMaterial color="#2b2620" roughness={0.65} />
      </mesh>
      <mesh position={[0.42, 0.78, -0.18]} castShadow>
        <boxGeometry args={[0.06, 0.78, 0.06]} />
        <meshStandardMaterial color="#2b2620" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.62, 0.76]} castShadow>
        <boxGeometry args={[0.1, 1.22, 0.08]} />
        <meshStandardMaterial color="#262a27" roughness={0.7} />
      </mesh>
      <mesh position={[-0.26, 0.12, 1.38]} castShadow>
        <boxGeometry args={[0.09, 0.08, 1.18]} />
        <meshStandardMaterial color="#262a27" roughness={0.72} />
      </mesh>
      <mesh position={[0.26, 0.12, 1.38]} castShadow>
        <boxGeometry args={[0.09, 0.08, 1.18]} />
        <meshStandardMaterial color="#262a27" roughness={0.72} />
      </mesh>
      <mesh position={[0.54, 0.13, -0.38]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.18, 24]} />
        <meshStandardMaterial color="#171a18" roughness={0.86} />
      </mesh>
      <mesh position={[-0.54, 0.13, -0.38]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.18, 24]} />
        <meshStandardMaterial color="#171a18" roughness={0.86} />
      </mesh>
      <mesh position={[0.58, 0.13, 0.38]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 24]} />
        <meshStandardMaterial color="#171a18" roughness={0.86} />
      </mesh>
      <mesh position={[-0.58, 0.13, 0.38]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 24]} />
        <meshStandardMaterial color="#171a18" roughness={0.86} />
      </mesh>
      <mesh position={[-0.12, 0.035, 0.98]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.48, 0.68, 48]} />
        <meshBasicMaterial
          color="#d1a348"
          transparent
          opacity={active ? 0.46 : 0.18}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function ReversePath({ active, theme }: { active: boolean; theme: SceneTheme }) {
  const palette = FLEET_SCENE[theme];
  const steps: [number, number, number, number][] = [
    [-3.45, -0.45, 0.1, 0.86],
    [-2.72, -0.05, 0.18, 0.72],
    [-2.0, 0.32, 0.26, 0.58],
    [-1.26, 0.68, 0.34, 0.44],
    [-0.52, 1.0, 0.42, 0.32],
  ];

  return (
    <group>
      {steps.map(([x, z, rotation, opacity], index) => (
        <FloorMarking
          key={index}
          position={[x, 0.055, z]}
          size={[0.28, 1.04]}
          rotation={rotation}
          color={palette.path}
          opacity={active ? opacity : opacity * 0.36}
        />
      ))}
      <mesh position={[-2.02, 0.062, 0.28]} rotation={[-Math.PI / 2, 0, -0.2]}>
        <ringGeometry args={[1.65, 1.74, 64, 1, 0.2, 1.26]} />
        <meshBasicMaterial
          color={palette.path}
          transparent
          opacity={active ? 0.42 : 0.16}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function InCabTablet({ active }: { active: boolean }) {
  return (
    <group position={[0.49, 0.66, 0.48]} rotation={[0, Math.PI / 2, -0.12]}>
      <mesh castShadow>
        <boxGeometry args={[0.32, 0.22, 0.035]} />
        <meshStandardMaterial
          color="#111918"
          roughness={0.6}
          emissive="#12382f"
          emissiveIntensity={active ? 0.32 : 0.08}
        />
      </mesh>
      <mesh position={[0, 0, 0.021]}>
        <planeGeometry args={[0.24, 0.15]} />
        <meshBasicMaterial color={active ? "#7ef0c8" : "#466d60"} transparent opacity={active ? 0.88 : 0.52} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <ringGeometry args={[0.18, 0.28, 40]} />
        <meshBasicMaterial color="#7ef0c8" transparent opacity={active ? 0.38 : 0.12} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function isVanWindowFace(center: THREE.Vector3, normal: THREE.Vector3) {
  const isCabGlassHeight = center.y > 0.72 && center.y < 0.96;
  const isWindshield = normal.z > 0.75 && center.z > 0.55 && center.z < 0.75 && Math.abs(center.x) < 0.58;
  const isRearGlass = normal.z < -0.75 && center.z < -1.25 && Math.abs(center.x) < 0.58;
  const isSideGlass =
    Math.abs(normal.x) > 0.9 &&
    center.y > 0.6 &&
    center.y < 1.08 &&
    center.z > 0.18 &&
    center.z < 0.68 &&
    Math.abs(center.x) > 0.42 &&
    Math.abs(center.x) < 0.58;

  return (isCabGlassHeight && (isWindshield || isRearGlass)) || isSideGlass;
}

function assignVanBodyMaterialGroups(geometry: THREE.BufferGeometry) {
  const position = geometry.getAttribute("position");
  const index = geometry.index;
  const triangle = new THREE.Triangle();
  const center = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const vertexA = new THREE.Vector3();
  const vertexB = new THREE.Vector3();
  const vertexC = new THREE.Vector3();
  const indexCount = index?.count ?? position.count;

  geometry.clearGroups();

  let groupStart = 0;
  let currentMaterialIndex = 0;

  for (let i = 0; i < indexCount; i += 3) {
    const a = index ? index.getX(i) : i;
    const b = index ? index.getX(i + 1) : i + 1;
    const c = index ? index.getX(i + 2) : i + 2;

    vertexA.fromBufferAttribute(position, a);
    vertexB.fromBufferAttribute(position, b);
    vertexC.fromBufferAttribute(position, c);
    triangle.set(vertexA, vertexB, vertexC);
    triangle.getMidpoint(center);
    triangle.getNormal(normal);

    const materialIndex = isVanWindowFace(center, normal) ? 1 : 0;

    if (i === 0) {
      currentMaterialIndex = materialIndex;
      continue;
    }

    if (materialIndex !== currentMaterialIndex) {
      geometry.addGroup(groupStart, i - groupStart, currentMaterialIndex);
      groupStart = i;
      currentMaterialIndex = materialIndex;
    }
  }

  geometry.addGroup(groupStart, indexCount - groupStart, currentMaterialIndex);
}

function FleetVanModel({ tabletActive }: { tabletActive: boolean }) {
  const gltf = useLoader(GLTFLoader, FLEET_VAN_MODEL) as GLTF;

  const scene = useMemo(() => {
    const model = gltf.scene.clone(true);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: "#eef0ea",
      roughness: 0.74,
      metalness: 0.02,
    });
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: "#020303",
      roughness: 0.46,
      metalness: 0.04,
    });
    bodyMaterial.userData.fleetVanOverride = true;
    glassMaterial.userData.fleetVanOverride = true;

    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      object.castShadow = true;
      object.receiveShadow = true;

      if (object.name === "body") {
        object.geometry = object.geometry.clone();
        object.geometry.userData.fleetVanOverride = true;
        assignVanBodyMaterialGroups(object.geometry);
        object.material = [bodyMaterial, glassMaterial];
      }
    });

    return model;
  }, [gltf.scene]);

  useEffect(
    () => () => {
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry.userData.fleetVanOverride) {
            object.geometry.dispose();
          }

          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => {
            if (material instanceof THREE.MeshStandardMaterial && material.userData.fleetVanOverride) {
              material.dispose();
            }
          });
        }
      });
    },
    [scene],
  );

  return (
    <group position={[-0.72, 0.02, 0.64]} rotation={[0, -1.72, 0]} scale={[1.45, 1.45, 1.45]}>
      <primitive object={scene} />
      <InCabTablet active={tabletActive} />
    </group>
  );
}

function MarkerPin({
  marker,
  isActive,
  onSelect,
}: {
  marker: SpatialMarker;
  isActive: boolean;
  onSelect: (markerId: string) => void;
}) {
  const position = FLEET_MARKER_POSITIONS[marker.id];
  if (!position) return null;

  const color = severityColor(marker.severity);
  const markerNumber = marker.id.slice(-3).replace(/^0+/, "").padStart(2, "0");
  const headOffset = 1.85;
  const stemHeight = headOffset - 0.08;
  const handleSelect = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    onSelect(marker.id);
  };
  const handlePointerOver = () => {
    document.body.style.cursor = "pointer";
  };
  const handlePointerOut = () => {
    document.body.style.cursor = "auto";
  };

  return (
    <group position={position}>
      <Html position={[0, headOffset, 0]} center zIndexRange={[12, 0]}>
        <button
          type="button"
          className={[
            "spatial-scene__pin-hit",
            `spatial-scene__pin-hit--${marker.severity}`,
            isActive ? "spatial-scene__pin-hit--active" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={handleSelect}
          aria-label={`Inspect ${marker.label}`}
          aria-pressed={isActive}
        >
          {markerNumber}
        </button>
      </Html>
      <mesh
        position={[0, headOffset, 0]}
        onPointerDown={handleSelect}
        onClick={handleSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.38, 20, 20]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh position={[0, headOffset / 2 - 0.02, 0]}>
        <cylinderGeometry args={[0.012, 0.012, stemHeight, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isActive ? 0.55 : 0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.16, 0.26, 32]} />
        <meshBasicMaterial color={color} transparent opacity={isActive ? 0.3 : 0.18} side={THREE.DoubleSide} />
      </mesh>
      <mesh
        position={[0, headOffset, 0]}
        onPointerDown={handleSelect}
        onClick={handleSelect}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.14, 20, 20]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isActive ? 1.1 : 0.55} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, headOffset - 0.08, 0]}>
        <ringGeometry args={[0.18, 0.28, 32]} />
        <meshBasicMaterial color={color} transparent opacity={isActive ? 0.52 : 0.28} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function CameraZoom({ zoom }: { zoom: number }) {
  const camera = useThree((state) => state.camera);

  useFrame(() => {
    camera.zoom += (zoom - camera.zoom) * 0.12;
    camera.updateProjectionMatrix();
  });

  return null;
}

function CameraReset({
  resetToken,
  controlsRef,
}: {
  resetToken: number;
  controlsRef: React.RefObject<any>;
}) {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    camera.position.set(...HOME_CAMERA);
    controls.target.set(0, 0.18, 0.2);
    controls.update();
    camera.lookAt(0, 0.18, 0.2);
  }, [controlsRef, resetToken]);

  return null;
}

function FleetSafetyCanvasScene({
  selectedMarkerId,
  markers,
  onSelectMarker,
  theme,
}: {
  selectedMarkerId?: string;
  markers: SpatialMarker[];
  onSelectMarker?: (markerId: string | null) => void;
  theme: SceneTheme;
}) {
  const contactActive = selectedMarkerId === "flt-001";
  const zoneActive = selectedMarkerId === "flt-002";
  const pathActive = selectedMarkerId === "flt-003";
  const tabletActive = selectedMarkerId === "flt-004";
  const palette = FLEET_SCENE[theme];

  return (
    <>
      <color attach="background" args={[palette.background]} />
      <fog attach="fog" args={[palette.fog, theme === "light" ? 16 : 14, theme === "light" ? 29 : 25]} />

      <ambientLight intensity={theme === "light" ? 1.36 : 1.04} color={palette.ambient} />
      <directionalLight
        castShadow
        position={[7, 10, 6]}
        intensity={theme === "light" ? 2.35 : 2.1}
        color={palette.key}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-6, 4, -5]} intensity={theme === "light" ? 0.68 : 0.48} color={palette.fill} />
      <pointLight
        position={[0.6, 1.1, 1.76]}
        intensity={contactActive ? 2.1 : 0.75}
        distance={8}
        color="#ff8f6c"
      />
      <pointLight
        position={[1.8, 1.6, 1.0]}
        intensity={zoneActive ? 1.35 : 0.45}
        distance={7}
        color="#d1a348"
      />

      <group rotation={SCENE_GROUP_ROTATION} position={SCENE_GROUP_POSITION}>
        <mesh position={[0.5, 0, 0.46]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[14, 13]} />
          <meshStandardMaterial color={palette.floor} roughness={0.96} />
        </mesh>

        <mesh position={[1.1, 1.58, -3.42]} receiveShadow>
          <boxGeometry args={[8.8, 3.2, 0.26]} />
          <meshStandardMaterial color={palette.wall} roughness={0.9} />
        </mesh>

        <DockDoor position={[-2.2, 0, -3.58]} label="BAY 3" />
        <DockDoor position={[0, 0, -3.58]} label="BAY 4" />
        <DockDoor position={[2.2, 0, -3.58]} label="BAY 5" />

        <FloorMarking position={[0, 0.054, -1.16]} size={[2.12, 4.2]} color={palette.bayMark} opacity={0.28} />
        <FloorMarking position={[0, 0.058, -1.16]} size={[1.62, 3.54]} color={palette.bayInterior} opacity={1} />
        <FloorMarking position={[0, 0.062, -3.14]} size={[1.76, 0.14]} color={palette.bayMark} opacity={0.58} />

        <FloorMarking position={[1.38, 0.064, 0.96]} size={[2.08, 1.72]} color="#d1a348" opacity={zoneActive ? 0.42 : 0.2} />
        <FloorMarking position={[1.38, 0.068, 0.96]} size={[1.56, 1.22]} color={palette.bayInterior} opacity={1} />
        <FloorMarking position={[1.38, 0.071, 1.82]} size={[2.08, 0.12]} color="#d1a348" opacity={zoneActive ? 0.88 : 0.5} />
        <FloorMarking position={[1.38, 0.071, 0.1]} size={[2.08, 0.12]} color="#d1a348" opacity={zoneActive ? 0.88 : 0.5} />
        <FloorMarking position={[0.34, 0.071, 0.96]} size={[0.12, 1.72]} color="#d1a348" opacity={zoneActive ? 0.88 : 0.5} />
        <FloorMarking position={[2.42, 0.071, 0.96]} size={[0.12, 1.72]} color="#d1a348" opacity={zoneActive ? 0.88 : 0.5} />

        <ReversePath active={pathActive} theme={theme} />

        <mesh position={[1.36, 0.07, 0.88]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.72, 64]} />
          <meshBasicMaterial
            color="#ff8f6c"
            transparent
            opacity={contactActive ? 0.76 : 0.24}
            side={THREE.DoubleSide}
          />
        </mesh>

        <FleetVanModel tabletActive={tabletActive} />

        <ForkliftModel active={zoneActive} />

        {markers.map((marker) => (
          <MarkerPin
            key={marker.id}
            marker={marker}
            isActive={selectedMarkerId === marker.id}
            onSelect={(markerId) => onSelectMarker?.(markerId)}
          />
        ))}
      </group>
    </>
  );
}

export function FleetSafetyKenneyScene({
  selectedMarkerId,
  onSelectMarker,
  markers,
  zoom = 1,
  resetToken = 0,
  interactive = true,
  allowScrollZoom = false,
}: {
  selectedMarkerId?: string;
  onSelectMarker?: (markerId: string | null) => void;
  markers: SpatialMarker[];
  zoom?: number;
  resetToken?: number;
  interactive?: boolean;
  allowScrollZoom?: boolean;
}) {
  const controlsRef = useRef<any>(null);
  const eventSourceRef = useRef<HTMLDivElement | null>(null);
  const eventSource = eventSourceRef as unknown as RefObject<HTMLElement>;
  const { resolvedTheme } = useTheme();

  return (
    <div
      ref={eventSourceRef}
      className={[
        "spatial-scene__canvas",
        interactive ? "spatial-scene__canvas--interactive" : "spatial-scene__canvas--inactive",
      ].join(" ")}
    >
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        camera={{ position: HOME_CAMERA, fov: 30, near: 0.1, far: 40 }}
        eventSource={eventSource}
        eventPrefix="client"
        onCreated={({ events, gl }) => {
          if (eventSourceRef.current) {
            events.connect?.(eventSourceRef.current);
          }

          gl.domElement.style.touchAction = interactive ? "none" : "pan-y pinch-zoom";
        }}
        onPointerMissed={() => onSelectMarker?.(null)}
      >
        <CameraZoom zoom={zoom} />
        <CameraReset resetToken={resetToken} controlsRef={controlsRef} />
        <Suspense fallback={null}>
          <FleetSafetyCanvasScene
            selectedMarkerId={selectedMarkerId}
            markers={markers}
            onSelectMarker={onSelectMarker}
            theme={resolvedTheme}
          />
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          enabled={interactive}
          enableZoom={allowScrollZoom}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={Math.PI / 5}
          maxPolarAngle={Math.PI / 2.08}
          minDistance={7}
          maxDistance={18}
        />
      </Canvas>
    </div>
  );
}
