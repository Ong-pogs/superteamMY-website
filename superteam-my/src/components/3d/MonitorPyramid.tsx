"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
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

// ─── Scripted physics simulation ────────────────────────

const GRAVITY = -12;
const BOUNCE = 0.35;
const ROT_DAMPING = 0.92;
const SETTLE_THRESHOLD = 0.002;
const DROP_HEIGHT = 3.5;

interface PhysicsBody {
  y: number;
  vy: number;
  targetY: number;
  rotVelX: number;
  rotVelZ: number;
  rotOffsetX: number;
  rotOffsetZ: number;
  settled: boolean;
  delay: number;
  started: boolean;
}

function createBodies(
  count: number,
  targetYs: number[],
  staggerBase: number,
  staggerStep: number
): PhysicsBody[] {
  return Array.from({ length: count }, (_, i) => {
    const seed = Math.sin(i * 73.17 + 31.4) * 10000;
    const pseudoRand = seed - Math.floor(seed);
    return {
      y: targetYs[i] + DROP_HEIGHT + pseudoRand * 0.8,
      vy: 0,
      targetY: targetYs[i],
      rotVelX: (pseudoRand - 0.5) * 0.8,
      rotVelZ: ((Math.sin(i * 127.3) * 10000) % 1 - 0.5) * 0.6,
      rotOffsetX: 0,
      rotOffsetZ: 0,
      settled: false,
      delay: staggerBase + i * staggerStep,
      started: false,
    };
  });
}

function stepBody(body: PhysicsBody, dt: number, elapsed: number): void {
  if (body.settled) return;
  if (elapsed < body.delay) return;
  if (!body.started) body.started = true;

  body.vy += GRAVITY * dt;
  body.y += body.vy * dt;

  if (body.y <= body.targetY) {
    body.y = body.targetY;
    body.vy = -body.vy * BOUNCE;
    const impactForce = Math.abs(body.vy) * 0.15;
    body.rotVelX += (body.rotVelX > 0 ? 1 : -1) * impactForce * 0.3;
    body.rotVelZ += (body.rotVelZ > 0 ? 1 : -1) * impactForce * 0.3;

    if (Math.abs(body.vy) < SETTLE_THRESHOLD) {
      body.y = body.targetY;
      body.vy = 0;
      body.rotOffsetX = 0;
      body.rotOffsetZ = 0;
      body.rotVelX = 0;
      body.rotVelZ = 0;
      body.settled = true;
      return;
    }
  }

  body.rotOffsetX += body.rotVelX * dt;
  body.rotOffsetZ += body.rotVelZ * dt;
  body.rotVelX *= ROT_DAMPING;
  body.rotVelZ *= ROT_DAMPING;
}

// ─── Camera Rig ─────────────────────────────────────────
// Always drives the camera. In edit mode you tweak via leva;
// in normal mode the defaults give the corner view.

function CameraRig({ debug }: { debug: boolean }) {
  const { camera } = useThree();
  const lastFovRef = useRef(40);

  // Defaults: angled corner view — camera looks into where the two walls meet
  const cam = useControls(
    "Camera",
    {
      posX: { value: 1.8, min: -10, max: 10, step: 0.05 },
      posY: { value: 1.0, min: -5, max: 10, step: 0.05 },
      posZ: { value: 3.8, min: -5, max: 15, step: 0.05 },
      lookX: { value: -0.3, min: -5, max: 5, step: 0.05 },
      lookY: { value: 0.1, min: -5, max: 5, step: 0.05 },
      lookZ: { value: -0.5, min: -5, max: 5, step: 0.05 },
      fov: { value: 40, min: 10, max: 120, step: 1 },
    },
    { collapsed: true }
  );

  // Apply camera on every frame so it's always in sync
  useFrame(() => {
    const perspCam = camera as THREE.PerspectiveCamera;
    perspCam.position.set(cam.posX, cam.posY, cam.posZ);
    perspCam.lookAt(cam.lookX, cam.lookY, cam.lookZ);
    if (lastFovRef.current !== cam.fov) {
      perspCam.fov = cam.fov;
      perspCam.updateProjectionMatrix();
      lastFovRef.current = cam.fov;
    }
  });

  return null;
}

// ─── Room Corner (floor + back wall + side wall) ────────
// Walls meet at a corner. Objects sit in the corner.

function Room() {
  const floor = useControls(
    "Floor",
    {
      posX: { value: 0, min: -5, max: 5, step: 0.01 },
      posY: { value: -0.55, min: -3, max: 3, step: 0.01 },
      posZ: { value: 0, min: -5, max: 5, step: 0.01 },
      width: { value: 8, min: 1, max: 20, step: 0.1 },
      depth: { value: 6, min: 1, max: 20, step: 0.1 },
      color: { value: "#0a0a12" },
      roughness: { value: 0.95, min: 0, max: 1, step: 0.01 },
    },
    { collapsed: true }
  );

  const backWall = useControls(
    "Back Wall",
    {
      posX: { value: 0, min: -5, max: 5, step: 0.01 },
      posY: { value: 1.7, min: -3, max: 8, step: 0.01 },
      posZ: { value: -1.0, min: -5, max: 5, step: 0.01 },
      width: { value: 8, min: 1, max: 20, step: 0.1 },
      height: { value: 5, min: 1, max: 10, step: 0.1 },
      color: { value: "#08080e" },
      roughness: { value: 0.98, min: 0, max: 1, step: 0.01 },
    },
    { collapsed: true }
  );

  const sideWall = useControls(
    "Side Wall",
    {
      posX: { value: -2.5, min: -10, max: 5, step: 0.01 },
      posY: { value: 1.7, min: -3, max: 8, step: 0.01 },
      posZ: { value: 0, min: -5, max: 5, step: 0.01 },
      depth: { value: 6, min: 1, max: 20, step: 0.1 },
      height: { value: 5, min: 1, max: 10, step: 0.1 },
      color: { value: "#0a0a10" },
      roughness: { value: 0.96, min: 0, max: 1, step: 0.01 },
    },
    { collapsed: true }
  );

  return (
    <>
      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[floor.posX, floor.posY, floor.posZ]}
      >
        <planeGeometry args={[floor.width, floor.depth]} />
        <meshStandardMaterial color={floor.color} roughness={floor.roughness} metalness={0.05} />
      </mesh>

      {/* Back wall — faces toward camera (+Z) */}
      <mesh position={[backWall.posX, backWall.posY, backWall.posZ]}>
        <planeGeometry args={[backWall.width, backWall.height]} />
        <meshStandardMaterial color={backWall.color} roughness={backWall.roughness} metalness={0.02} />
      </mesh>

      {/* Side wall — faces right (+X), placed on the left */}
      <mesh
        rotation={[0, Math.PI / 2, 0]}
        position={[sideWall.posX, sideWall.posY, sideWall.posZ]}
      >
        <planeGeometry args={[sideWall.depth, sideWall.height]} />
        <meshStandardMaterial color={sideWall.color} roughness={sideWall.roughness} metalness={0.02} />
      </mesh>
    </>
  );
}

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
  const startTimeRef = useRef<number | null>(null);

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

  // ── Physics bodies ──
  const bodiesRef = useRef<PhysicsBody[] | null>(null);
  const allSettledRef = useRef(false);

  useEffect(() => {
    if (entered && !debug) {
      const monTargetYs = DEFAULT_MONITORS.map((m) => m.pos[1]);
      const spkTargetYs = DEFAULT_SPEAKERS.map((s) => s.pos[1]);
      bodiesRef.current = [
        ...createBodies(8, monTargetYs, 0, 0.12),
        ...createBodies(2, spkTargetYs, 0.15, 0.2),
      ];
      allSettledRef.current = false;
      startTimeRef.current = null;
    }
  }, [entered, debug]);

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
      console.log("MONITORS:", JSON.stringify(monitorData, null, 2));
      console.log("SPEAKERS:", JSON.stringify(speakerData, null, 2));
      console.log("==================================\n");
      console.log("// ── Copy-paste arrays ──");
      console.log("const MONITORS = [");
      monitorData.forEach((m) => console.log(`  { pos: [${m.pos}], rot: [${m.rot}] },`));
      console.log("];");
      console.log("const SPEAKERS = [");
      speakerData.forEach((s) => console.log(`  { pos: [${s.pos}], rot: [${s.rot}], scale: ${s.scale} },`));
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

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setEntered(true), 200);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    if (!debug && allSettledRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.08) * 0.06;
    } else if (debug) {
      groupRef.current.rotation.y = 0;
    }

    // ── Physics step ──
    if (!debug && entered && bodiesRef.current && !allSettledRef.current) {
      if (startTimeRef.current === null) startTimeRef.current = t;
      const elapsed = t - startTimeRef.current;
      const dt = Math.min(1 / 30, clock.getDelta() || 1 / 60);

      let allDone = true;
      const bodies = bodiesRef.current;
      const children = groupRef.current.children;

      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        stepBody(body, dt, elapsed);
        if (!body.settled) allDone = false;

        if (children[i]) {
          const child = children[i];
          if (body.started) {
            child.position.y = body.y;
            if (i < 8) {
              child.position.x = allMonitors[i].posX;
              child.position.z = allMonitors[i].posZ;
              child.rotation.x = allMonitors[i].rotX + body.rotOffsetX;
              child.rotation.y = allMonitors[i].rotY;
              child.rotation.z = allMonitors[i].rotZ + body.rotOffsetZ;
            } else {
              const si = i - 8;
              child.position.x = allSpeakers[si].posX;
              child.position.z = allSpeakers[si].posZ;
              child.rotation.x = allSpeakers[si].rotX + body.rotOffsetX;
              child.rotation.y = allSpeakers[si].rotY;
              child.rotation.z = allSpeakers[si].rotZ + body.rotOffsetZ;
            }
          } else {
            child.position.y = (i < 8 ? allMonitors[i].posY : allSpeakers[i - 8].posY) + DROP_HEIGHT + 2;
          }
        }
      }

      if (allDone) {
        allSettledRef.current = true;
        for (let i = 0; i < children.length; i++) {
          if (i < 8) {
            children[i].position.set(allMonitors[i].posX, allMonitors[i].posY, allMonitors[i].posZ);
            children[i].rotation.set(allMonitors[i].rotX, allMonitors[i].rotY, allMonitors[i].rotZ);
          } else if (i - 8 < allSpeakers.length) {
            const si = i - 8;
            children[i].position.set(allSpeakers[si].posX, allSpeakers[si].posY, allSpeakers[si].posZ);
            children[i].rotation.set(allSpeakers[si].rotX, allSpeakers[si].rotY, allSpeakers[si].rotZ);
          }
        }
      }
    }
  });

  const monPos = (c: typeof m0): [number, number, number] => [c.posX, c.posY, c.posZ];
  const monRot = (c: typeof m0): [number, number, number] => [c.rotX, c.rotY, c.rotZ];

  const getMonitorPos = (ctrl: typeof m0): [number, number, number] => {
    if (debug) return monPos(ctrl);
    if (!entered) return [ctrl.posX, ctrl.posY + DROP_HEIGHT + 2, ctrl.posZ];
    return monPos(ctrl);
  };

  return (
    <>
      {/* Camera rig — only active in debug mode */}
      <CameraRig debug={debug} />

      {/* Room geometry */}
      <Room />

      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 3, 4]} intensity={0.8} />
      <pointLight position={[0, 0.5, 2]} intensity={1.5} color="#00FFA3" />
      <pointLight position={[-1, 1, 1.5]} intensity={0.5} color="#9945FF" />

      <group ref={groupRef} position={[0, -0.3, 0]}>
        {/* Monitors */}
        {allMonitors.map((ctrl, i) => (
          <CRTMonitor
            key={`mon-${i}`}
            position={getMonitorPos(ctrl)}
            rotation={monRot(ctrl)}
            screenTexture={textures[i]}
            emissiveColor={colors[i]}
            materials={materials}
          />
        ))}

        {/* Speakers */}
        {allSpeakers.map((ctrl, i) => (
          <Speaker
            key={`spk-${i}`}
            position={debug ? monPos(ctrl) : [ctrl.posX, !entered ? ctrl.posY + DROP_HEIGHT + 2 : ctrl.posY, ctrl.posZ]}
            rotation={monRot(ctrl)}
            scale={ctrl.scale}
          />
        ))}
      </group>
    </>
  );
}
