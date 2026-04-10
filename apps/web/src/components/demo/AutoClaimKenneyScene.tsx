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

        <ParkingStripe position={[-3.15, 0.04, 2.02]} size={[0.16, 4.6]} rotation={0.3} opacity={corridorActive ? 0.96 : 0.58} />
        <ParkingStripe position={[-1.58, 0.04, 1.26]} size={[0.16, 4.9]} rotation={0.3} opacity={corridorActive ? 0.92 : 0.54} />
        <ParkingStripe position={[0.05, 0.04, 0.49]} size={[0.16, 5.2]} rotation={0.3} opacity={0.5} />
        <ParkingStripe position={[1.68, 0.04, -0.28]} size={[0.16, 5.3]} rotation={0.3} opacity={0.5} />
        <ParkingStripe position={[3.3, 0.04, -1.05]} size={[0.16, 5.1]} rotation={0.3} opacity={0.44} />
        <ParkingStripe position={[-1.44, 0.04, 3.02]} size={[4.65, 0.12]} rotation={-1.27} color="#7f685b" opacity={0.42} />
        <ParkingStripe position={[1.42, 0.04, -2.46]} size={[4.1, 0.12]} rotation={-1.27} color="#6b5a53" opacity={0.3} />

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
          position={[-0.72, 0, 0.86]}
          rotation={[0, 0.92, 0]}
          scale={1.56}
        />
        <SceneModel
          url={`${KENNEY_VEHICLE_BASE}/sedan.glb`}
          position={[2.34, 0, -0.32]}
          rotation={[0, -1.5, 0]}
          scale={1.38}
          tint="#495469"
        />
        <SceneModel
          url={`${KENNEY_VEHICLE_BASE}/debris-bumper.glb`}
          position={[0.78, 0.04, 1.58]}
          rotation={[0, 0.22, 0]}
          scale={0.66}
        />
        <SceneModel
          url={`${KENNEY_VEHICLE_BASE}/cone.glb`}
          position={[-3.04, 0, 2.6]}
          rotation={[0, 0.12, 0]}
          scale={0.52}
        />
        <SceneModel
          url={`${KENNEY_VEHICLE_BASE}/cone.glb`}
          position={[-2.24, 0, 2.18]}
          rotation={[0, -0.12, 0]}
          scale={0.5}
        />
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

export function AutoClaimKenneyScene({ selectedMarkerId }: { selectedMarkerId?: string }) {
  return (
    <div className="spatial-scene__canvas">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [8.3, 6.1, 10.1], fov: 30, near: 0.1, far: 40 }}
      >
        <Suspense fallback={null}>
          <AutoClaimCanvasScene selectedMarkerId={selectedMarkerId} />
        </Suspense>
      </Canvas>
    </div>
  );
}
