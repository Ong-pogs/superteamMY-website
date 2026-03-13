"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface SpeakerProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export default function Speaker({
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: SpeakerProps) {
  const materials = useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({
        color: "#1a1a2e",
        roughness: 0.9,
        metalness: 0.05,
      }),
      baffle: new THREE.MeshStandardMaterial({
        color: "#141425",
        roughness: 0.95,
        metalness: 0.02,
      }),
      cone: new THREE.MeshStandardMaterial({
        color: "#0d0d1a",
        roughness: 0.7,
        metalness: 0.15,
      }),
      surround: new THREE.MeshStandardMaterial({
        color: "#222240",
        roughness: 0.6,
        metalness: 0.2,
      }),
      dustCap: new THREE.MeshStandardMaterial({
        color: "#18182e",
        roughness: 0.5,
        metalness: 0.25,
      }),
      grille: new THREE.MeshStandardMaterial({
        color: "#111122",
        roughness: 0.85,
        metalness: 0.1,
        transparent: true,
        opacity: 0.7,
      }),
    }),
    []
  );

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Main body */}
      <mesh material={materials.body}>
        <boxGeometry args={[0.5, 0.75, 0.4]} />
      </mesh>

      {/* Front baffle plate */}
      <mesh position={[0, 0, 0.201]} material={materials.baffle}>
        <boxGeometry args={[0.48, 0.73, 0.005]} />
      </mesh>

      {/* Woofer — large ring */}
      <mesh position={[0, -0.08, 0.21]} rotation={[0, 0, 0]} material={materials.surround}>
        <torusGeometry args={[0.15, 0.02, 16, 32]} />
      </mesh>

      {/* Woofer — cone */}
      <mesh position={[0, -0.08, 0.2]} material={materials.cone}>
        <circleGeometry args={[0.15, 32]} />
      </mesh>

      {/* Woofer — dust cap (center dome) */}
      <mesh position={[0, -0.08, 0.215]} material={materials.dustCap}>
        <sphereGeometry args={[0.04, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* Tweeter — ring */}
      <mesh position={[0, 0.2, 0.21]} material={materials.surround}>
        <torusGeometry args={[0.06, 0.012, 12, 24]} />
      </mesh>

      {/* Tweeter — dome */}
      <mesh position={[0, 0.2, 0.21]} material={materials.dustCap}>
        <sphereGeometry args={[0.055, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* Bass port (bottom) */}
      <mesh position={[0, -0.3, 0.205]} material={materials.cone}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
      </mesh>

      {/* Edge trim — top */}
      <mesh position={[0, 0.375, 0.201]} material={materials.surround}>
        <boxGeometry args={[0.5, 0.008, 0.005]} />
      </mesh>

      {/* Edge trim — bottom */}
      <mesh position={[0, -0.375, 0.201]} material={materials.surround}>
        <boxGeometry args={[0.5, 0.008, 0.005]} />
      </mesh>
    </group>
  );
}
