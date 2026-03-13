"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
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

const GRAVITY = -14;
const BOUNCE = 0.25;
const ROT_DAMPING = 0.88;
const ROT_SPRING = 12;
const ROT_MAX = 0.12;
const SETTLE_THRESHOLD = 0.003;
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
      y: targetYs[i] + DROP_HEIGHT + pseudoRand * 0.5,
      vy: 0,
      targetY: targetYs[i],
      rotVelX: (pseudoRand - 0.5) * 0.12,
      rotVelZ: ((Math.sin(i * 127.3) * 10000) % 1 - 0.5) * 0.1,
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

  // Spring force pulls rotation back to 0
  body.rotVelX += -ROT_SPRING * body.rotOffsetX * dt;
  body.rotVelZ += -ROT_SPRING * body.rotOffsetZ * dt;
  body.rotVelX *= ROT_DAMPING;
  body.rotVelZ *= ROT_DAMPING;
  body.rotOffsetX += body.rotVelX * dt;
  body.rotOffsetZ += body.rotVelZ * dt;

  // Hard clamp so monitors never tilt more than ~7 degrees
  body.rotOffsetX = Math.max(-ROT_MAX, Math.min(ROT_MAX, body.rotOffsetX));
  body.rotOffsetZ = Math.max(-ROT_MAX, Math.min(ROT_MAX, body.rotOffsetZ));
}

// ─── Camera Rig ─────────────────────────────────────────

function CameraRig() {
  const { camera } = useThree();

  useFrame(() => {
    const perspCam = camera as THREE.PerspectiveCamera;
    perspCam.position.set(1.8, 1.0, 3.8);
    perspCam.lookAt(-0.3, 0.1, -0.5);
  });

  return null;
}

// ─── Room Corner (floor + back wall + side wall) ────────
// Walls meet at a corner. Objects sit in the corner.

function Room() {
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.52, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#0a0a12" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.7, -1.0]}>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color="#08080e" roughness={0.98} metalness={0.02} />
      </mesh>

      {/* Side wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-2.5, 1.7, 0]}>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial color="#0a0a10" roughness={0.96} metalness={0.02} />
      </mesh>
    </>
  );
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

  // ── Physics bodies ──
  const bodiesRef = useRef<PhysicsBody[] | null>(null);
  const allSettledRef = useRef(false);

  useEffect(() => {
    if (entered) {
      const monTargetYs = DEFAULT_MONITORS.map((m) => m.pos[1]);
      const spkTargetYs = DEFAULT_SPEAKERS.map((s) => s.pos[1]);
      bodiesRef.current = [
        ...createBodies(8, monTargetYs, 0, 0.12),
        ...createBodies(2, spkTargetYs, 0.15, 0.2),
      ];
      allSettledRef.current = false;
      startTimeRef.current = null;
    }
  }, [entered]);

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

    // ── Physics step ──
    if (entered && bodiesRef.current && !allSettledRef.current) {
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
              const m = DEFAULT_MONITORS[i];
              child.position.x = m.pos[0];
              child.position.z = m.pos[2];
              child.rotation.x = m.rot[0] + body.rotOffsetX;
              child.rotation.y = m.rot[1];
              child.rotation.z = m.rot[2] + body.rotOffsetZ;
            } else {
              const s = DEFAULT_SPEAKERS[i - 8];
              child.position.x = s.pos[0];
              child.position.z = s.pos[2];
              child.rotation.x = s.rot[0] + body.rotOffsetX;
              child.rotation.y = s.rot[1];
              child.rotation.z = s.rot[2] + body.rotOffsetZ;
            }
          } else {
            const targetY = i < 8 ? DEFAULT_MONITORS[i].pos[1] : DEFAULT_SPEAKERS[i - 8].pos[1];
            child.position.y = targetY + DROP_HEIGHT + 2;
          }
        }
      }

      if (allDone) {
        allSettledRef.current = true;
        for (let i = 0; i < children.length; i++) {
          if (i < 8) {
            const m = DEFAULT_MONITORS[i];
            children[i].position.set(...m.pos);
            children[i].rotation.set(...m.rot);
          } else if (i - 8 < DEFAULT_SPEAKERS.length) {
            const s = DEFAULT_SPEAKERS[i - 8];
            children[i].position.set(...s.pos);
            children[i].rotation.set(...s.rot);
          }
        }
      }
    }
  });

  return (
    <>
      <CameraRig />
      <Room />

      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 3, 4]} intensity={0.8} />
      <pointLight position={[0, 0.5, 2]} intensity={1.5} color="#00FFA3" />
      <pointLight position={[-1, 1, 1.5]} intensity={0.5} color="#9945FF" />

      <group ref={groupRef} position={[0, -0.3, 0]}>
        {/* Monitors */}
        {DEFAULT_MONITORS.map((m, i) => (
          <CRTMonitor
            key={`mon-${i}`}
            position={!entered ? [m.pos[0], m.pos[1] + DROP_HEIGHT + 2, m.pos[2]] : m.pos}
            rotation={m.rot}
            screenTexture={textures[i]}
            emissiveColor={colors[i]}
            materials={materials}
          />
        ))}

        {/* Speakers */}
        {DEFAULT_SPEAKERS.map((s, i) => (
          <Speaker
            key={`spk-${i}`}
            position={!entered ? [s.pos[0], s.pos[1] + DROP_HEIGHT + 2, s.pos[2]] : s.pos}
            rotation={s.rot}
            scale={s.scale}
          />
        ))}
      </group>
    </>
  );
}
