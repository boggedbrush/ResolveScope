import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { SpatialMarker } from "../../types/case";

const HOME_CAMERA: [number, number, number] = [10.2, 7.8, 14.4];
const SCENE_GROUP_ROTATION: [number, number, number] = [0, -0.52, 0];
const SCENE_GROUP_POSITION: [number, number, number] = [0, -0.34, 0];
const COMMERCIAL_BUILDING_MODEL = "/assets/kenney-city-kit-commercial/building-l.glb";

const SITE_MARKER_POSITIONS: Record<string, [number, number, number]> = {
  "sm-001": [-1.12, 6.42, -1.36],
  "sm-002": [-0.48, 4.14, -1.52],
  "sm-003": [1.9, 3.14, -0.9],
  "sm-004": [0.12, 0.12, -2.55],
};

function severityColor(severity: SpatialMarker["severity"]) {
  if (severity === "critical") return "#b12828";
  if (severity === "high") return "#d85a4c";
  if (severity === "medium") return "#d1a348";
  return "#3da170";
}

function AssetModel({
  url,
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}) {
  const gltf = useLoader(GLTFLoader, url) as GLTF;

  const scene = useMemo(() => {
    const clone = gltf.scene.clone(true);

    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
    });

    return clone;
  }, [gltf.scene]);

  return <primitive object={scene} position={position} rotation={rotation} scale={scale} />;
}

function BuildingModel() {
  return (
    <group>
      <AssetModel url={COMMERCIAL_BUILDING_MODEL} position={[0, 0, -0.18]} rotation={[0, Math.PI, 0]} scale={3.1} />
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
  const position = SITE_MARKER_POSITIONS[marker.id];
  if (!position) return null;

  const color = severityColor(marker.severity);
  const markerNumber = marker.id.slice(-3).replace(/^0+/, "").padStart(2, "0");
  const headOffset = 1.5;
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
        <sphereGeometry args={[0.34, 20, 20]} />
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
  controlsRef: RefObject<any>;
}) {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    camera.position.set(...HOME_CAMERA);
    controls.target.set(0.1, 4.0, 0.02);
    controls.update();
    camera.lookAt(0.1, 4.0, 0.02);
  }, [camera, controlsRef, resetToken]);

  return null;
}

function SiteInspectionCanvasScene({
  selectedMarkerId,
  markers,
  onSelectMarker,
}: {
  selectedMarkerId?: string;
  markers: SpatialMarker[];
  onSelectMarker?: (markerId: string | null) => void;
}) {
  return (
    <>
      <color attach="background" args={["#05070a"]} />
      <fog attach="fog" args={["#10151d", 13, 25]} />

      <ambientLight intensity={1.08} color="#edf4ff" />
      <directionalLight
        castShadow
        position={[8, 12, 7]}
        intensity={2.0}
        color="#f3f7ff"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-5, 4, -4]} intensity={0.48} color="#8fa8c7" />
      <pointLight
        position={[-2.8, 7.2, -2.4]}
        intensity={selectedMarkerId === "sm-001" ? 1.55 : 0.42}
        distance={12}
        color="#ffad7b"
      />
      <pointLight
        position={[4.2, 4.8, -1.6]}
        intensity={selectedMarkerId === "sm-003" ? 1.45 : 0.38}
        distance={12}
        color="#7eb7ff"
      />

      <group rotation={SCENE_GROUP_ROTATION} position={SCENE_GROUP_POSITION}>
        <BuildingModel />

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

export function SiteInspectionKenneyScene({
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
        camera={{ position: HOME_CAMERA, fov: 31, near: 0.1, far: 40 }}
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
          <SiteInspectionCanvasScene
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
          maxPolarAngle={Math.PI / 2.04}
          minDistance={8}
          maxDistance={22}
        />
      </Canvas>
    </div>
  );
}
