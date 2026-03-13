"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import CRTMonitor from "./CRTMonitor";
import { useMonitorTextures } from "./useMonitorTextures";

// Pyramid layout (4-3-1): positions and slight random tilts
const PYRAMID_POSITIONS: { pos: [number, number, number]; rot: [number, number, number] }[] = [
  // Bottom row (4)
  { pos: [-0.87, 0.0, 0.05], rot: [0, 0.04, -0.02] },
  { pos: [-0.29, 0.0, -0.02], rot: [0, -0.03, 0.01] },
  { pos: [0.29, 0.0, 0.03], rot: [0, 0.02, 0.02] },
  { pos: [0.87, 0.0, -0.04], rot: [0, -0.05, -0.01] },
  // Middle row (3)
  { pos: [-0.58, 0.50, 0.08], rot: [0, 0.03, 0.02] },
  { pos: [0.0, 0.50, -0.01], rot: [0, -0.02, -0.01] },
  { pos: [0.58, 0.50, 0.05], rot: [0, 0.04, -0.02] },
  // Top (1)
  { pos: [0.0, 1.02, 0.10], rot: [0, -0.03, 0.01] },
];

interface MonitorPyramidProps {
  visible?: boolean;
}

export default function MonitorPyramid({ visible = true }: MonitorPyramidProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { textures, colors } = useMonitorTextures();
  const [entered, setEntered] = useState(false);
  const entryProgressRef = useRef<number[]>(new Array(8).fill(0));

  // Shared materials
  const materials = useMemo(
    () => ({
      beigePlastic: new THREE.MeshStandardMaterial({
        color: "#c8b89a",
        roughness: 0.85,
        metalness: 0.05,
      }),
      darkBeige: new THREE.MeshStandardMaterial({
        color: "#a89878",
        roughness: 0.9,
        metalness: 0.05,
      }),
      offWhite: new THREE.MeshStandardMaterial({
        color: "#d4cfc0",
        roughness: 0.8,
        metalness: 0.05,
      }),
      darkPlastic: new THREE.MeshStandardMaterial({
        color: "#2a2a2a",
        roughness: 0.7,
        metalness: 0.1,
      }),
    }),
    []
  );

  // Cleanup materials
  useEffect(() => {
    return () => {
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [materials]);

  // Trigger entrance animation
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setEntered(true), 200);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Gentle idle sway
    groupRef.current.rotation.y = Math.sin(t * 0.08) * 0.06;

    // Entrance animation: staggered lerp from y+2
    if (entered) {
      groupRef.current.children.forEach((child, i) => {
        const progress = entryProgressRef.current[i];
        if (progress < 1) {
          const staggerDelay = i * 0.08;
          const elapsed = t - staggerDelay;
          if (elapsed > 0) {
            entryProgressRef.current[i] = Math.min(1, progress + 0.035);
          }
          const p = entryProgressRef.current[i];
          // Ease out cubic
          const eased = 1 - Math.pow(1 - p, 3);
          const targetY = PYRAMID_POSITIONS[i].pos[1];
          child.position.y = targetY + 2 * (1 - eased);
        }
      });
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 3, 4]} intensity={0.8} />
      <pointLight position={[0, 0.5, 2]} intensity={1.5} color="#00FFA3" />
      <pointLight position={[-1, 1, 1.5]} intensity={0.5} color="#9945FF" />

      <group ref={groupRef} position={[0, -0.3, 0]}>
        {PYRAMID_POSITIONS.map((layout, i) => (
          <CRTMonitor
            key={i}
            position={entered ? layout.pos : [layout.pos[0], layout.pos[1] + 2, layout.pos[2]]}
            rotation={layout.rot}
            screenTexture={textures[i]}
            emissiveColor={colors[i]}
            materials={materials}
          />
        ))}
      </group>
    </>
  );
}
