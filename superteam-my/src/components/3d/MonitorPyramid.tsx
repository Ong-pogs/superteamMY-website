"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useControls, button } from "leva";
import CRTMonitor from "./CRTMonitor";
import Speaker from "./Speaker";
import { useMonitorTextures } from "./useMonitorTextures";

// ─── Default layouts ────────────────────────────────────

const DEFAULT_MONITORS: { pos: [number, number, number]; rot: [number, number, number] }[] = [
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

const DEFAULT_SPEAKERS: { pos: [number, number, number]; rot: [number, number, number]; scale: number }[] = [
  { pos: [-1.55, 0.0, 0.1], rot: [0, 0.15, 0], scale: 1 },
  { pos: [1.55, 0.0, 0.1], rot: [0, -0.15, 0], scale: 1 },
];

// ─── Leva hook per object ───────────────────────────────

function useObjectControls(
  name: string,
  defaultPos: [number, number, number],
  defaultRot: [number, number, number],
  defaultScale: number,
  debug: boolean
) {
  const controls = useControls(
    name,
    {
      posX: { value: defaultPos[0], min: -5, max: 5, step: 0.01 },
      posY: { value: defaultPos[1], min: -5, max: 5, step: 0.01 },
      posZ: { value: defaultPos[2], min: -5, max: 5, step: 0.01 },
      rotX: { value: defaultRot[0], min: -Math.PI, max: Math.PI, step: 0.01 },
      rotY: { value: defaultRot[1], min: -Math.PI, max: Math.PI, step: 0.01 },
      rotZ: { value: defaultRot[2], min: -Math.PI, max: Math.PI, step: 0.01 },
      scale: { value: defaultScale, min: 0.1, max: 3, step: 0.01 },
    },
    { collapsed: true },
    [debug]
  );
  return controls;
}

// ─── Component ──────────────────────────────────────────

interface MonitorPyramidProps {
  visible?: boolean;
}

export default function MonitorPyramid({ visible = true }: MonitorPyramidProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { textures, colors } = useMonitorTextures();
  const [entered, setEntered] = useState(false);
  const entryProgressRef = useRef<number[]>(new Array(8).fill(0));

  // ── Master debug toggle ──
  const { debug } = useControls("Scene", {
    debug: { value: false, label: "Edit Mode" },
  });

  // ── Monitor controls ──
  const m0 = useObjectControls("Mon 1 (BL)", DEFAULT_MONITORS[0].pos, DEFAULT_MONITORS[0].rot, 1, debug);
  const m1 = useObjectControls("Mon 2 (BL)", DEFAULT_MONITORS[1].pos, DEFAULT_MONITORS[1].rot, 1, debug);
  const m2 = useObjectControls("Mon 3 (BR)", DEFAULT_MONITORS[2].pos, DEFAULT_MONITORS[2].rot, 1, debug);
  const m3 = useObjectControls("Mon 4 (BR)", DEFAULT_MONITORS[3].pos, DEFAULT_MONITORS[3].rot, 1, debug);
  const m4 = useObjectControls("Mon 5 (ML)", DEFAULT_MONITORS[4].pos, DEFAULT_MONITORS[4].rot, 1, debug);
  const m5 = useObjectControls("Mon 6 (MC)", DEFAULT_MONITORS[5].pos, DEFAULT_MONITORS[5].rot, 1, debug);
  const m6 = useObjectControls("Mon 7 (MR)", DEFAULT_MONITORS[6].pos, DEFAULT_MONITORS[6].rot, 1, debug);
  const m7 = useObjectControls("Mon 8 (Top)", DEFAULT_MONITORS[7].pos, DEFAULT_MONITORS[7].rot, 1, debug);
  const s0 = useObjectControls("Speaker L", DEFAULT_SPEAKERS[0].pos, DEFAULT_SPEAKERS[0].rot, DEFAULT_SPEAKERS[0].scale, debug);
  const s1 = useObjectControls("Speaker R", DEFAULT_SPEAKERS[1].pos, DEFAULT_SPEAKERS[1].rot, DEFAULT_SPEAKERS[1].scale, debug);

  const allMonitors = [m0, m1, m2, m3, m4, m5, m6, m7];
  const allSpeakers = [s0, s1];

  // ── Log button ──
  useControls("Scene", {
    "Log All Positions": button(() => {
      const monitorData = allMonitors.map((m, i) => ({
        name: `Monitor ${i + 1}`,
        pos: [+m.posX.toFixed(3), +m.posY.toFixed(3), +m.posZ.toFixed(3)],
        rot: [+m.rotX.toFixed(3), +m.rotY.toFixed(3), +m.rotZ.toFixed(3)],
        scale: +m.scale.toFixed(3),
      }));
      const speakerData = allSpeakers.map((s, i) => ({
        name: `Speaker ${i + 1}`,
        pos: [+s.posX.toFixed(3), +s.posY.toFixed(3), +s.posZ.toFixed(3)],
        rot: [+s.rotX.toFixed(3), +s.rotY.toFixed(3), +s.rotZ.toFixed(3)],
        scale: +s.scale.toFixed(3),
      }));

      console.log("\n========== SCENE LAYOUT ==========");
      console.log("MONITORS:");
      console.log(JSON.stringify(monitorData, null, 2));
      console.log("SPEAKERS:");
      console.log(JSON.stringify(speakerData, null, 2));
      console.log("==================================\n");

      // Also log as copy-pasteable code
      console.log("// ── Copy-paste arrays ──");
      console.log("const MONITORS = [");
      monitorData.forEach((m) => {
        console.log(`  { pos: [${m.pos}], rot: [${m.rot}] },`);
      });
      console.log("];");
      console.log("const SPEAKERS = [");
      speakerData.forEach((s) => {
        console.log(`  { pos: [${s.pos}], rot: [${s.rot}], scale: ${s.scale} },`);
      });
      console.log("];");
    }),
  });

  // Shared materials
  const materials = useMemo(
    () => ({
      beigePlastic: new THREE.MeshStandardMaterial({ color: "#c8b89a", roughness: 0.85, metalness: 0.05 }),
      darkBeige: new THREE.MeshStandardMaterial({ color: "#a89878", roughness: 0.9, metalness: 0.05 }),
      offWhite: new THREE.MeshStandardMaterial({ color: "#d4cfc0", roughness: 0.8, metalness: 0.05 }),
      darkPlastic: new THREE.MeshStandardMaterial({ color: "#2a2a2a", roughness: 0.7, metalness: 0.1 }),
    }),
    []
  );

  useEffect(() => {
    return () => { Object.values(materials).forEach((m) => m.dispose()); };
  }, [materials]);

  // Entrance animation
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setEntered(true), 200);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Disable idle sway in debug mode so positions are accurate
    if (!debug) {
      groupRef.current.rotation.y = Math.sin(t * 0.08) * 0.06;
    } else {
      groupRef.current.rotation.y = 0;
    }

    // Skip entrance animation in debug mode
    if (!debug && entered) {
      const children = groupRef.current.children;
      for (let i = 0; i < 8 && i < children.length; i++) {
        const progress = entryProgressRef.current[i];
        if (progress < 1) {
          const staggerDelay = i * 0.08;
          const elapsed = t - staggerDelay;
          if (elapsed > 0) {
            entryProgressRef.current[i] = Math.min(1, progress + 0.035);
          }
          const p = entryProgressRef.current[i];
          const eased = 1 - Math.pow(1 - p, 3);
          const targetY = allMonitors[i].posY;
          children[i].position.y = targetY + 2 * (1 - eased);
        }
      }
    }
  });

  // Helper to get pos/rot from controls
  const monPos = (c: typeof m0): [number, number, number] => [c.posX, c.posY, c.posZ];
  const monRot = (c: typeof m0): [number, number, number] => [c.rotX, c.rotY, c.rotZ];

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 3, 4]} intensity={0.8} />
      <pointLight position={[0, 0.5, 2]} intensity={1.5} color="#00FFA3" />
      <pointLight position={[-1, 1, 1.5]} intensity={0.5} color="#9945FF" />

      <group ref={groupRef} position={[0, -0.3, 0]}>
        {/* Monitors */}
        {allMonitors.map((ctrl, i) => {
          const pos = monPos(ctrl);
          const rot = monRot(ctrl);
          // In non-debug mode with entrance animation not done, offset Y
          const finalPos: [number, number, number] =
            !debug && !entered ? [pos[0], pos[1] + 2, pos[2]] : pos;
          return (
            <CRTMonitor
              key={`mon-${i}`}
              position={finalPos}
              rotation={rot}
              screenTexture={textures[i]}
              emissiveColor={colors[i]}
              materials={materials}
            />
          );
        })}

        {/* Speakers */}
        {allSpeakers.map((ctrl, i) => (
          <Speaker
            key={`spk-${i}`}
            position={monPos(ctrl)}
            rotation={monRot(ctrl)}
            scale={ctrl.scale}
          />
        ))}
      </group>
    </>
  );
}
