import { Suspense, useMemo } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

const KENNEY_VEHICLE_BASE = "/assets/kenney-car-kit/vehicle-scene";

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
      rotation={[-Math.PI / 2, rotation, 0]}
      receiveShadow
    >
      <planeGeometry args={size} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function AutoClaimCanvasScene({ selectedMarkerId }: { selectedMarkerId?: string }) {
  const impactActive = selectedMarkerId === "acm-001" || selectedMarkerId === "acm-002";
  const corridorActive = selectedMarkerId === "acm-003";
  const estimateActive = selectedMarkerId === "acm-004";

  return (
    <>
      <fog attach="fog" args={["#120f0d", 10, 21]} />

      <ambientLight intensity={1.45} color="#f6e7d9" />
      <directionalLight
        castShadow
        position={[7, 10, 5]}
        intensity={2.4}
        color="#fff0df"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-5, 4, -6]} intensity={0.65} color="#8398b6" />
      <pointLight
        position={[0.85, 1.4, 0.95]}
        intensity={impactActive ? 2.1 : 1.15}
        distance={7}
        color="#ff9757"
      />

      <group rotation={[0.06, -0.55, 0.04]} position={[0.15, -0.08, 0.1]}>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[14, 11]} />
          <meshStandardMaterial color="#241916" roughness={0.96} />
        </mesh>

        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10.4, 8.2]} />
          <meshStandardMaterial color="#34241f" roughness={0.94} />
        </mesh>

        <ParkingStripe position={[-2.9, 0.04, 1.9]} size={[0.18, 4.7]} rotation={0.34} opacity={corridorActive ? 0.95 : 0.62} />
        <ParkingStripe position={[-1.45, 0.04, 1.25]} size={[0.18, 4.9]} rotation={0.34} opacity={corridorActive ? 0.95 : 0.62} />
        <ParkingStripe position={[0.08, 0.04, 0.58]} size={[0.18, 5.1]} rotation={0.34} opacity={0.62} />
        <ParkingStripe position={[1.56, 0.04, -0.1]} size={[0.18, 5.2]} rotation={0.34} opacity={0.62} />
        <ParkingStripe position={[-1.26, 0.04, 2.86]} size={[4.25, 0.13]} rotation={-1.19} color="#7f685b" opacity={0.46} />

        <mesh position={[-2.12, 0.03, 2.06]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.44, 0.58, 48]} />
          <meshBasicMaterial
            color="#8ed9b8"
            transparent
            opacity={corridorActive ? 0.72 : 0.18}
          />
        </mesh>

        <mesh position={[0.84, 0.04, 0.92]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.62, 64]} />
          <meshBasicMaterial
            color="#ff8a43"
            transparent
            opacity={impactActive ? 0.78 : 0.28}
          />
        </mesh>
        <mesh position={[0.96, 0.05, 1.08]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.28, 48]} />
          <meshBasicMaterial
            color="#ffd2a6"
            transparent
            opacity={impactActive ? 0.36 : 0.12}
          />
        </mesh>

        <mesh position={[3.18, 0.04, -1.72]} rotation={[-Math.PI / 2, 0.18, 0]}>
          <planeGeometry args={[1.85, 1.22]} />
          <meshBasicMaterial
            color="#e2b18b"
            transparent
            opacity={estimateActive ? 0.46 : 0.16}
          />
        </mesh>

        <SceneModel
          url={`${KENNEY_VEHICLE_BASE}/suv.glb`}
          position={[0.18, 0, 0.58]}
          rotation={[0, 0.92, 0]}
          scale={1.96}
        />
        <SceneModel
          url={`${KENNEY_VEHICLE_BASE}/sedan.glb`}
          position={[1.6, 0, -0.96]}
          rotation={[0, -2.22, 0]}
          scale={1.82}
          tint="#4e5868"
        />
        <SceneModel
          url={`${KENNEY_VEHICLE_BASE}/debris-bumper.glb`}
          position={[0.98, 0.04, 1.14]}
          rotation={[0, 0.42, 0]}
          scale={0.84}
        />
        <SceneModel
          url={`${KENNEY_VEHICLE_BASE}/cone.glb`}
          position={[-2.72, 0, 2.7]}
          rotation={[0, 0.28, 0]}
          scale={0.58}
        />
        <SceneModel
          url={`${KENNEY_VEHICLE_BASE}/cone.glb`}
          position={[-1.46, 0, 2.18]}
          rotation={[0, -0.18, 0]}
          scale={0.58}
        />
      </group>

      <mesh position={[0.36, 0.02, 0.42]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 64]} />
        <meshBasicMaterial color="#000" transparent opacity={0.16} />
      </mesh>
      <mesh position={[1.66, 0.02, -0.98]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.46, 64]} />
        <meshBasicMaterial color="#000" transparent opacity={0.14} />
      </mesh>
    </>
  );
}

export function AutoClaimKenneyScene({ selectedMarkerId }: { selectedMarkerId?: string }) {
  return (
    <div className="spatial-scene__canvas">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [6.8, 5.4, 7.9], fov: 33, near: 0.1, far: 40 }}
      >
        <Suspense fallback={null}>
          <AutoClaimCanvasScene selectedMarkerId={selectedMarkerId} />
        </Suspense>
      </Canvas>
    </div>
  );
}
