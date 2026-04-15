import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { SpatialMarker } from "../../types/case";

const KENNEY_VEHICLE_BASE = "/assets/kenney-car-kit/vehicle-scene";
const HOME_CAMERA: [number, number, number] = [8.3, 6.1, 10.1];

const AUTO_CLAIM_MARKER_POSITIONS: Record<string, [number, number, number]> = {
  "acm-001": [0.98, 0.68, 1.14],
  "acm-002": [0.58, 0.74, 1.34],
  "acm-003": [-2.52, 0.58, 2.04],
  "acm-004": [3.52, 0.58, -1.48],
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
  const stallRotation = 0.97;
  const aisleRotation = stallRotation - Math.PI / 2;

  return (
    <>
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
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[15.2, 11.8]} />
          <meshStandardMaterial color="#241916" roughness={0.96} />
        </mesh>

        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[11.4, 8.9]} />
          <meshStandardMaterial color="#34241f" roughness={0.94} />
        </mesh>

        <ParkingStripe position={[-3.36, 0.04, 1.54]} size={[0.16, 3.56]} rotation={stallRotation} opacity={corridorActive ? 0.94 : 0.56} />
        <ParkingStripe position={[-1.76, 0.04, 0.76]} size={[0.16, 3.52]} rotation={stallRotation} opacity={corridorActive ? 0.9 : 0.54} />
        <ParkingStripe position={[-0.18, 0.04, -0.02]} size={[0.16, 3.48]} rotation={stallRotation} opacity={0.52} />

        <ParkingStripe position={[1.98, 0.04, -0.42]} size={[0.16, 3.38]} rotation={stallRotation} opacity={0.58} />
        <ParkingStripe position={[3.56, 0.04, -1.18]} size={[0.16, 3.42]} rotation={stallRotation} opacity={estimateActive ? 0.86 : 0.6} />
        <ParkingStripe position={[5.14, 0.04, -1.96]} size={[0.16, 3.42]} rotation={stallRotation} opacity={0.54} />

        <ParkingStripe position={[-1.82, 0.04, 2.78]} size={[6.9, 0.12]} rotation={aisleRotation} color="#84695d" opacity={corridorActive ? 0.44 : 0.26} />
        <ParkingStripe position={[1.3, 0.04, 1.24]} size={[7.1, 0.12]} rotation={aisleRotation} color="#7d6357" opacity={0.3} />
        <ParkingStripe position={[4.34, 0.04, -0.28]} size={[6.2, 0.12]} rotation={aisleRotation} color="#745c52" opacity={0.24} />

        <mesh position={[-2.52, 0.03, 2.04]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.54, 48]} />
          <meshBasicMaterial
            color="#8ed9b8"
            transparent
            opacity={corridorActive ? 0.72 : 0.18}
          />
        </mesh>

        <mesh position={[1.22, 0.03, 0.12]} rotation={[-Math.PI / 2, 0.42, 0]}>
          <planeGeometry args={[0.12, 3.2]} />
          <meshBasicMaterial
            color="#e3baa4"
            transparent
            opacity={impactActive ? 0.42 : 0.14}
          />
        </mesh>
        <mesh position={[1.02, 0.031, 0.3]} rotation={[-Math.PI / 2, 0.42, 0]}>
          <planeGeometry args={[0.06, 3.05]} />
          <meshBasicMaterial
            color="#ffd5ba"
            transparent
            opacity={impactActive ? 0.6 : 0.18}
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

        <mesh position={[3.52, 0.04, -1.48]} rotation={[-Math.PI / 2, 0.18, 0]}>
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

      <mesh position={[-0.16, 0.02, 0.72]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.62, 64]} />
        <meshBasicMaterial color="#000" transparent opacity={0.13} />
      </mesh>
      <mesh position={[2.12, 0.02, -0.22]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.34, 64]} />
        <meshBasicMaterial color="#000" transparent opacity={0.12} />
      </mesh>
    </>
  );
}

export function AutoClaimKenneyScene({
  selectedMarkerId,
  onSelectMarker,
  markers,
  zoom = 1,
  resetToken = 0,
}: {
  selectedMarkerId?: string;
  onSelectMarker?: (markerId: string | null) => void;
  markers: SpatialMarker[];
  zoom?: number;
  resetToken?: number;
}) {
  const controlsRef = useRef<any>(null);

  return (
    <div className="spatial-scene__canvas">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        camera={{ position: HOME_CAMERA, fov: 30, near: 0.1, far: 40 }}
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
