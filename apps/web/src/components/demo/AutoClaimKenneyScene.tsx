import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { SpatialMarker } from "../../types/case";

const KENNEY_VEHICLE_BASE = "/assets/kenney-car-kit/vehicle-scene";
const HOME_CAMERA: [number, number, number] = [8.3, 6.1, 10.1];

const AUTO_CLAIM_MARKER_POSITIONS: Record<string, [number, number, number]> = {
  "acm-001": [0.3, 0.04, 2.2],
  "acm-002": [1.45, 0.04, 1.95],
  "acm-003": [-2.52, 0.04, 2.04],
  "acm-004": [4.0, 0.04, -1.15],
};

function severityColor(severity: SpatialMarker["severity"]) {
  if (severity === "critical") return "#b12828";
  if (severity === "high") return "#d85a4c";
  if (severity === "medium") return "#d1a348";
  return "#3da170";
}

function SceneModel({
  url,
  position,
  rotation = [0, 0, 0],
  scale = 1,
  tint,
}: {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  tint?: string;
}) {
  const gltf = useLoader(GLTFLoader, url) as GLTF;
  const scene = gltf.scene;

  const preparedScene = useMemo(() => {
    const clone = scene.clone(true);
    const tintColor = tint ? new THREE.Color(tint) : null;

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      child.castShadow = true;
      child.receiveShadow = true;

      const cloneMaterial = (material: THREE.Material) => {
        const next = material.clone();

        if (tintColor && "color" in next && next.color instanceof THREE.Color) {
          next.color.multiply(tintColor);
        }

        return next;
      };

      child.material = Array.isArray(child.material)
        ? child.material.map(cloneMaterial)
        : cloneMaterial(child.material);
    });

    return clone;
  }, [scene, tint]);

  return (
    <primitive
      object={preparedScene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

function ParkingStripe({
  position,
  size,
  rotation = 0,
  color = "#f2d5b5",
  opacity = 0.82,
}: {
  position: [number, number, number];
  size: [number, number];
  rotation?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <mesh
      position={position}
      rotation={[0, rotation, 0]}
      receiveShadow
    >
      <boxGeometry args={[size[0], 0.02, size[1]]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        roughness={0.92}
        metalness={0}
      />
    </mesh>
  );
}

function RoadCrack({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0.02, 0.006, 0.04]} rotation={[-Math.PI / 2, 0.1, 0]}>
        <planeGeometry args={[1.92, 0.22]} />
        <meshStandardMaterial color="#3b404a" roughness={1} transparent opacity={0.42} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0.08, 0]}>
        <planeGeometry args={[1.56, 0.06]} />
        <meshStandardMaterial color="#111215" roughness={1} />
      </mesh>
      <mesh position={[-0.46, 0.011, 0.12]} rotation={[-Math.PI / 2, -0.58, 0]}>
        <planeGeometry args={[0.56, 0.05]} />
        <meshStandardMaterial color="#0f1012" roughness={1} />
      </mesh>
      <mesh position={[-0.12, 0.011, -0.16]} rotation={[-Math.PI / 2, 0.62, 0]}>
        <planeGeometry args={[0.42, 0.045]} />
        <meshStandardMaterial color="#0d0e10" roughness={1} />
      </mesh>
      <mesh position={[0.34, 0.011, 0.1]} rotation={[-Math.PI / 2, -0.74, 0]}>
        <planeGeometry args={[0.44, 0.045]} />
        <meshStandardMaterial color="#111215" roughness={1} />
      </mesh>
      <mesh position={[0.58, 0.011, -0.08]} rotation={[-Math.PI / 2, 0.48, 0]}>
        <planeGeometry args={[0.34, 0.04]} />
        <meshStandardMaterial color="#15171a" roughness={1} />
      </mesh>
      <mesh position={[-0.54, 0.012, -0.12]} rotation={[-Math.PI / 2, 0.28, 0]}>
        <planeGeometry args={[0.2, 0.12]} />
        <meshStandardMaterial color="#5e6470" roughness={1} transparent opacity={0.78} />
      </mesh>
      <mesh position={[0.18, 0.012, 0.18]} rotation={[-Math.PI / 2, -0.34, 0]}>
        <planeGeometry args={[0.24, 0.11]} />
        <meshStandardMaterial color="#525762" roughness={1} transparent opacity={0.74} />
      </mesh>
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
  const position = AUTO_CLAIM_MARKER_POSITIONS[marker.id];
  if (!position) return null;

  const color = severityColor(marker.severity);
  const headOffset = 0.95;
  const stemHeight = headOffset - 0.08;

  return (
    <group position={position}>
      <mesh position={[0, headOffset / 2 - 0.02, 0]}>
        <cylinderGeometry args={[0.012, 0.012, stemHeight, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isActive ? 0.55 : 0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.16, 0.26, 32]} />
        <meshBasicMaterial color={color} transparent opacity={isActive ? 0.28 : 0.18} side={THREE.DoubleSide} />
      </mesh>
      <mesh
        position={[0, headOffset, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(marker.id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
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
  // Drei exposes the underlying controls object through ref.
  controlsRef: React.RefObject<any>;
}) {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    camera.position.set(...HOME_CAMERA);
    controls.target.set(0, 0, 0);
    controls.update();
    camera.lookAt(0, 0, 0);
  }, [controlsRef, resetToken]);

  return null;
}

function AutoClaimCanvasScene({
  selectedMarkerId,
  markers,
  onSelectMarker,
}: {
  selectedMarkerId?: string;
  markers: SpatialMarker[];
  onSelectMarker?: (markerId: string | null) => void;
}) {
  const impactActive = selectedMarkerId === "acm-001" || selectedMarkerId === "acm-002";
  const corridorActive = selectedMarkerId === "acm-003";
  const estimateActive = selectedMarkerId === "acm-004";
  const stallRotation = 2.54;

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#120f0d", 13, 24]} />

      <ambientLight intensity={1.22} color="#f6e7d9" />
      <directionalLight
        castShadow
        position={[8, 11, 6]}
        intensity={2.2}
        color="#fff0df"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-6, 5, -6]} intensity={0.58} color="#8398b6" />
      <pointLight
        position={[0.58, 1.4, 1.18]}
        intensity={impactActive ? 1.9 : 0.92}
        distance={8}
        color="#ff9757"
      />

      <group rotation={[0.04, -0.48, 0.02]} position={[0.24, -0.08, 0.12]}>
        <mesh position={[1.08, 0.01, -0.18]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[18, 18]} />
          <meshStandardMaterial color="#2b313d" roughness={0.94} />
        </mesh>

        <ParkingStripe position={[0.81, 0.04, -4.17]} size={[0.16, 3.4]} rotation={stallRotation} opacity={corridorActive ? 0.8 : 0.5} />
        <ParkingStripe position={[2.71, 0.04, -2.87]} size={[0.16, 3.4]} rotation={stallRotation} opacity={estimateActive ? 0.9 : 0.62} />
        <ParkingStripe position={[4.61, 0.04, -1.57]} size={[0.16, 3.4]} rotation={stallRotation} opacity={estimateActive ? 0.9 : 0.62} />
        <ParkingStripe position={[6.51, 0.04, -0.27]} size={[0.16, 3.4]} rotation={stallRotation} opacity={0.48} />

        <ParkingStripe position={[4.62, 0.04, -3.62]} size={[6.9, 0.12]} rotation={stallRotation} color="#84695d" opacity={0.26} />
        <ParkingStripe position={[2.70, 0.04, -0.82]} size={[6.9, 0.12]} rotation={stallRotation} color="#7d6357" opacity={0.22} />

        <RoadCrack position={[-2.44, 0, 2.2]} rotation={-0.18} />

        <mesh position={[-2.52, 0.03, 2.04]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.54, 48]} />
          <meshBasicMaterial
            color="#8ed9b8"
            transparent
            opacity={corridorActive ? 0.72 : 0.18}
          />
        </mesh>

        <mesh position={[0.52, 0.04, 1.04]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.28, 0.58, 64]} />
          <meshBasicMaterial
            color="#ff8a43"
            transparent
            opacity={impactActive ? 0.78 : 0.28}
          />
        </mesh>
        <mesh position={[0.66, 0.05, 1.16]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.28, 48]} />
          <meshBasicMaterial
            color="#ffd2a6"
            transparent
            opacity={impactActive ? 0.36 : 0.12}
          />
        </mesh>

        <mesh position={[3.52, 0.04, -1.48]} rotation={[-Math.PI / 2, 2.54, 0]}>
          <planeGeometry args={[1.58, 1.06]} />
          <meshBasicMaterial
            color="#e2b18b"
            transparent
            opacity={estimateActive ? 0.46 : 0.16}
          />
        </mesh>

        <SceneModel
          url={`${KENNEY_VEHICLE_BASE}/suv.glb`}
          position={[-0.28, 0, 0.56]}
          rotation={[0, 1.0, 0]}
          scale={1.56}
        />
        <SceneModel
          url={`${KENNEY_VEHICLE_BASE}/sedan.glb`}
          position={[2.7, 0, -0.82]}
          rotation={[0, 2.54, 0]}
          scale={1.38}
          tint="#495469"
        />
        <SceneModel
          url={`${KENNEY_VEHICLE_BASE}/debris-bumper.glb`}
          position={[1.08, 0.04, 0.98]}
          rotation={[0, 0.56, 0]}
          scale={0.66}
        />
        <SceneModel
          url={`${KENNEY_VEHICLE_BASE}/cone.glb`}
          position={[-2.84, 0, 2.42]}
          rotation={[0, 0.12, 0]}
          scale={0.52}
        />
        <SceneModel
          url={`${KENNEY_VEHICLE_BASE}/cone.glb`}
          position={[-2.06, 0, 2.02]}
          rotation={[0, -0.12, 0]}
          scale={0.5}
        />

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

export function AutoClaimKenneyScene({
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
          <AutoClaimCanvasScene
            selectedMarkerId={selectedMarkerId}
            markers={markers}
            onSelectMarker={onSelectMarker}
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
          maxPolarAngle={Math.PI / 2.1}
          minDistance={7}
          maxDistance={18}
        />
      </Canvas>
    </div>
  );
}
