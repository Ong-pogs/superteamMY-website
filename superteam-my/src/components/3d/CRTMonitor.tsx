"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CRTMonitorProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  screenTexture: THREE.CanvasTexture;
  emissiveColor: string;
  materials: {
    beigePlastic: THREE.MeshStandardMaterial;
    darkBeige: THREE.MeshStandardMaterial;
    offWhite: THREE.MeshStandardMaterial;
    darkPlastic: THREE.MeshStandardMaterial;
  };
}

export default function CRTMonitor({
  position,
  rotation = [0, 0, 0],
  screenTexture,
  emissiveColor,
  materials,
}: CRTMonitorProps) {
  const screenRef = useRef<THREE.Mesh>(null);
  const ledRef = useRef<THREE.Mesh>(null);
  const flickerRef = useRef(0);
  const nextFlickerRef = useRef(Math.random() * 5 + 3);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      let intensity = 0.6 + Math.sin(t * 1.5) * 0.05;

      // Random flicker
      if (t > nextFlickerRef.current) {
        flickerRef.current = 3; // frames to flicker
        nextFlickerRef.current = t + Math.random() * 6 + 3;
      }
      if (flickerRef.current > 0) {
        intensity = 0.1;
        flickerRef.current--;
      }

      mat.emissiveIntensity = intensity;
    }

    if (ledRef.current) {
      const mat = ledRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.8 + Math.sin(t * 2) * 0.2;
    }
  });

  const emissive = new THREE.Color(emissiveColor);

  return (
    <group position={position} rotation={rotation}>
      {/* Body */}
      <mesh material={materials.beigePlastic}>
        <boxGeometry args={[0.52, 0.44, 0.4]} />
      </mesh>

      {/* Rear bump */}
      <mesh position={[0, 0.02, -0.18]} material={materials.beigePlastic}>
        <boxGeometry args={[0.44, 0.36, 0.1]} />
      </mesh>

      {/* Screen bezel */}
      <mesh position={[0, 0.03, 0.201]} material={materials.darkPlastic}>
        <boxGeometry args={[0.46, 0.36, 0.008]} />
      </mesh>

      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0.03, 0.206]}>
        <boxGeometry args={[0.36, 0.28, 0.005]} />
        <meshStandardMaterial
          map={screenTexture}
          emissive={emissive}
          emissiveIntensity={0.6}
          emissiveMap={screenTexture}
          toneMapped={false}
        />
      </mesh>

      {/* Bottom panel */}
      <mesh position={[0, -0.17, 0.2]} material={materials.offWhite}>
        <boxGeometry args={[0.46, 0.06, 0.008]} />
      </mesh>

      {/* Power LED */}
      <mesh ref={ledRef} position={[0.2, -0.17, 0.208]}>
        <boxGeometry args={[0.006, 0.006, 0.004]} />
        <meshStandardMaterial
          color="#00FFA3"
          emissive="#00FFA3"
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>

    </group>
  );
}
