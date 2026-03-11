"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Locked positions ────────────────────────────────────

const PC_POS: [number, number, number] = [-1.9, 0, -0.85];
const PC_ROT_Y = 1.75;
const WALL_BACK_Z = -2.85;
const WALL_LEFT_X = -3.75;
const FLOOR_Y = -0.05;
const CAM_START: [number, number, number] = [2.35, 1.54, 5.99];
const CAM_LOOK: [number, number, number] = [-0.5, 0.3, -0.4];

// ─── PBR Materials ───────────────────────────────────────

function useMaterials() {
  return useMemo(() => {
    const beigePlastic = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#C8B88A"),
      roughness: 0.75,
      metalness: 0.02,
    });

    const darkBeige = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#A89868"),
      roughness: 0.8,
      metalness: 0.02,
    });

    const offWhite = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#D8D0B8"),
      roughness: 0.7,
      metalness: 0.03,
    });

    const darkPlastic = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#2A2A2A"),
      roughness: 0.6,
      metalness: 0.05,
    });

    const keyCap = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#B8A878"),
      roughness: 0.65,
      metalness: 0.03,
    });

    const brushedMetal = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#888888"),
      roughness: 0.35,
      metalness: 0.85,
    });

    const floppySlot = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1a1a1a"),
      roughness: 0.5,
      metalness: 0.1,
    });

    const rubber = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1a1a1a"),
      roughness: 0.95,
      metalness: 0.0,
    });

    // Concrete walls — rough, matte
    const wall = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#3a3a40"),
      roughness: 0.92,
      metalness: 0.02,
    });

    // Concrete floor — slightly polished
    const floor = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#2a2a30"),
      roughness: 0.7,
      metalness: 0.08,
    });

    return { beigePlastic, darkBeige, offWhite, darkPlastic, keyCap, brushedMetal, floppySlot, rubber, wall, floor };
  }, []);
}

// ─── Horizontal System Unit ──────────────────────────────

function SystemUnit({ materials }: { materials: ReturnType<typeof useMaterials> }) {
  return (
    <group position={[0, 0.06, 0]}>
      <mesh material={materials.beigePlastic}>
        <boxGeometry args={[0.6, 0.12, 0.45]} />
      </mesh>

      <mesh position={[0, 0, 0.226]} material={materials.offWhite}>
        <boxGeometry args={[0.58, 0.1, 0.005]} />
      </mesh>

      <mesh position={[0.12, 0.01, 0.228]} material={materials.floppySlot}>
        <boxGeometry args={[0.12, 0.015, 0.006]} />
      </mesh>

      <mesh position={[0.12, -0.02, 0.228]} material={materials.floppySlot}>
        <boxGeometry args={[0.12, 0.015, 0.006]} />
      </mesh>

      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-0.18, -0.03 + i * 0.01, 0.228]} material={materials.darkBeige}>
          <boxGeometry args={[0.12, 0.003, 0.006]} />
        </mesh>
      ))}

      <mesh position={[0.25, 0.01, 0.23]}>
        <boxGeometry args={[0.006, 0.006, 0.004]} />
        <meshStandardMaterial color="#00ff44" emissive="#00ff44" emissiveIntensity={2} />
      </mesh>

      <mesh position={[0.25, -0.02, 0.228]} material={materials.darkPlastic}>
        <boxGeometry args={[0.02, 0.02, 0.008]} />
      </mesh>

      <mesh position={[-0.22, 0.03, 0.228]} material={materials.brushedMetal}>
        <boxGeometry args={[0.06, 0.015, 0.004]} />
      </mesh>

      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[-0.302, -0.02 + i * 0.015, 0.05]} material={materials.darkBeige}>
          <boxGeometry args={[0.005, 0.005, 0.2]} />
        </mesh>
      ))}

      {([[-0.25, -0.065, 0.18], [0.25, -0.065, 0.18], [-0.25, -0.065, -0.18], [0.25, -0.065, -0.18]] as const).map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1], pos[2]]} material={materials.rubber}>
          <cylinderGeometry args={[0.012, 0.012, 0.008, 8]} />
        </mesh>
      ))}
    </group>
  );
}

// ─── CRT Monitor ─────────────────────────────────────────

function Monitor({ materials, hovered }: { materials: ReturnType<typeof useMaterials>; hovered: boolean }) {
  const screenRef = useRef<THREE.Mesh>(null!);
  const screenGlowRef = useRef<THREE.PointLight>(null!);

  useFrame((state, delta) => {
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      const target = hovered ? 0.8 : 0.35;
      const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, target + pulse, delta * 4);
    }
    if (screenGlowRef.current) {
      const base = hovered ? 3 : 1.5;
      const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.3;
      screenGlowRef.current.intensity = THREE.MathUtils.lerp(
        screenGlowRef.current.intensity,
        base + pulse,
        delta * 3
      );
    }
  });

  return (
    <group position={[0, 0.38, -0.02]}>
      <mesh material={materials.beigePlastic} position={[0, 0, 0]}>
        <boxGeometry args={[0.52, 0.44, 0.4]} />
      </mesh>

      <mesh material={materials.beigePlastic} position={[0, 0.02, -0.18]}>
        <boxGeometry args={[0.44, 0.36, 0.1]} />
      </mesh>

      <mesh material={materials.darkBeige} position={[0, 0.225, 0.02]}>
        <boxGeometry args={[0.53, 0.01, 0.42]} />
      </mesh>

      <mesh position={[0, 0.03, 0.201]} material={materials.darkPlastic}>
        <boxGeometry args={[0.46, 0.36, 0.008]} />
      </mesh>

      <mesh ref={screenRef} position={[0, 0.03, 0.206]}>
        <boxGeometry args={[0.36, 0.28, 0.005]} />
        <meshStandardMaterial
          color="#0a1a0a"
          roughness={0.1}
          metalness={0.3}
          emissive="#00ff88"
          emissiveIntensity={0.35}
        />
      </mesh>

      <mesh position={[0, 0.06, 0.21]}>
        <planeGeometry args={[0.35, 0.27]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.02} roughness={0.0} metalness={1.0} />
      </mesh>

      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[0, -0.08 + i * 0.03, 0.212]}>
          <planeGeometry args={[0.35, 0.002]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.12} depthWrite={false} />
        </mesh>
      ))}

      <mesh position={[0, -0.17, 0.2]} material={materials.offWhite}>
        <boxGeometry args={[0.46, 0.06, 0.008]} />
      </mesh>

      <mesh position={[-0.12, -0.17, 0.206]} material={materials.brushedMetal}>
        <boxGeometry args={[0.08, 0.015, 0.004]} />
      </mesh>

      <mesh position={[0.14, -0.17, 0.208]} rotation={[Math.PI / 2, 0, 0]} material={materials.darkPlastic}>
        <cylinderGeometry args={[0.008, 0.008, 0.012, 10]} />
      </mesh>
      <mesh position={[0.17, -0.17, 0.208]} rotation={[Math.PI / 2, 0, 0]} material={materials.darkPlastic}>
        <cylinderGeometry args={[0.008, 0.008, 0.012, 10]} />
      </mesh>

      <mesh position={[0.2, -0.17, 0.208]}>
        <boxGeometry args={[0.006, 0.006, 0.004]} />
        <meshStandardMaterial color="#00ff44" emissive="#00ff44" emissiveIntensity={3} />
      </mesh>

      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`l${i}`} position={[-0.262, -0.08 + i * 0.025, -0.02]} material={materials.darkBeige}>
          <boxGeometry args={[0.005, 0.008, 0.25]} />
        </mesh>
      ))}

      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`r${i}`} position={[0.262, -0.08 + i * 0.025, -0.02]} material={materials.darkBeige}>
          <boxGeometry args={[0.005, 0.008, 0.25]} />
        </mesh>
      ))}

      <mesh position={[0, -0.23, 0.02]} material={materials.beigePlastic}>
        <boxGeometry args={[0.25, 0.03, 0.2]} />
      </mesh>
      <mesh position={[0, -0.25, 0.02]} material={materials.darkBeige}>
        <boxGeometry args={[0.3, 0.015, 0.22]} />
      </mesh>

      {/* Screen glow — only light from the CRT itself */}
      <pointLight
        ref={screenGlowRef}
        position={[0, 0.03, 0.5]}
        color="#80ffb0"
        intensity={1.5}
        distance={3}
        decay={2}
      />
    </group>
  );
}

// ─── Keyboard ────────────────────────────────────────────

function Keyboard({ materials }: { materials: ReturnType<typeof useMaterials> }) {
  const keys = useMemo(() => {
    const result: { x: number; z: number; w: number; h: number }[] = [];
    for (let row = 0; row < 5; row++) {
      const numKeys = row === 0 ? 14 : row === 4 ? 8 : 13;
      const startX = row === 4 ? -0.1 : -0.22;
      const keyW = row === 4 ? 0.035 : 0.028;
      for (let col = 0; col < numKeys; col++) {
        const w = (row === 4 && col === 3) ? 0.12 : keyW;
        result.push({
          x: startX + col * (keyW + 0.004) + (row === 4 && col > 3 ? 0.09 : 0),
          z: -0.04 + row * 0.025,
          w,
          h: 0.02,
        });
      }
    }
    return result;
  }, []);

  return (
    <group position={[0, -0.04, 0.42]}>
      <mesh material={materials.beigePlastic}>
        <boxGeometry args={[0.55, 0.02, 0.16]} />
      </mesh>

      <mesh material={materials.beigePlastic} position={[0, 0.006, -0.06]}>
        <boxGeometry args={[0.53, 0.012, 0.04]} />
      </mesh>

      {keys.map((key, i) => (
        <mesh key={i} position={[key.x, 0.015, key.z]} material={materials.keyCap}>
          <boxGeometry args={[key.w, 0.008, key.h]} />
        </mesh>
      ))}

      <mesh position={[0, -0.005, -0.1]} rotation={[Math.PI / 2, 0, 0]} material={materials.rubber}>
        <cylinderGeometry args={[0.005, 0.005, 0.06, 6]} />
      </mesh>
    </group>
  );
}

// ─── Fluorescent tube lamp with flicker ──────────────────

function FluorescentLamp() {
  const lightRef = useRef<THREE.PointLight>(null!);
  const tubeRef = useRef<THREE.Mesh>(null!);
  const flickerState = useRef({ nextFlicker: 0, isOff: false });

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Flicker logic — random brief dips
    if (t > flickerState.current.nextFlicker) {
      if (!flickerState.current.isOff && Math.random() < 0.15) {
        // Start a flicker off
        flickerState.current.isOff = true;
        flickerState.current.nextFlicker = t + 0.03 + Math.random() * 0.08;
      } else {
        flickerState.current.isOff = false;
        flickerState.current.nextFlicker = t + 0.5 + Math.random() * 3;
      }
    }

    const flicker = flickerState.current.isOff ? 0.1 : 1.0;
    // Subtle hum variation
    const hum = 1.0 + Math.sin(t * 120) * 0.015; // 60Hz hum

    if (lightRef.current) {
      lightRef.current.intensity = 6 * flicker * hum;
    }
    if (tubeRef.current) {
      const mat = tubeRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 4 * flicker * hum;
    }
  });

  // Lamp position — above and slightly in front of PC
  const lampX = PC_POS[0] + 0.5;
  const lampY = 2.8;
  const lampZ = PC_POS[2] + 0.3;

  return (
    <group position={[lampX, lampY, lampZ]}>
      {/* Metal fixture housing */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.08, 0.04, 2.0]} />
        <meshStandardMaterial color="#444444" roughness={0.6} metalness={0.7} />
      </mesh>

      {/* Mounting bracket to ceiling */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.04, 0.06, 0.12]} />
        <meshStandardMaterial color="#555555" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Reflector plate (above tube) — bounces light down */}
      <mesh position={[0, 0.035, 0]}>
        <boxGeometry args={[0.12, 0.005, 1.9]} />
        <meshStandardMaterial color="#eeeeee" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* The fluorescent tube — much longer */}
      <mesh ref={tubeRef} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, 1.8, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#f0ecff"
          emissiveIntensity={4}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* End caps */}
      <mesh position={[0, 0, 0.9]}>
        <boxGeometry args={[0.04, 0.04, 0.02]} />
        <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0, -0.9]}>
        <boxGeometry args={[0.04, 0.04, 0.02]} />
        <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Main light — strong cool white */}
      <pointLight
        ref={lightRef}
        position={[0, -0.1, 0]}
        color="#e8e0ff"
        intensity={6}
        distance={12}
        decay={1.5}
      />

      {/* Secondary fill lights at tube ends for even spread */}
      <pointLight
        position={[0, -0.1, 0.7]}
        color="#e8e0ff"
        intensity={3}
        distance={10}
        decay={1.5}
      />
      <pointLight
        position={[0, -0.1, -0.7]}
        color="#e8e0ff"
        intensity={3}
        distance={10}
        decay={1.5}
      />
    </group>
  );
}

// ─── Room: concrete floor + corner walls ─────────────────

function Room({ materials }: { materials: ReturnType<typeof useMaterials> }) {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, 0]}>
        <planeGeometry args={[12, 12]} />
        <primitive object={materials.floor} attach="material" />
      </mesh>

      {/* Floor expansion joints — concrete slab lines */}
      {[-3, -1, 1, 3].map((x) => (
        <mesh key={`fx${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, FLOOR_Y + 0.001, 0]}>
          <planeGeometry args={[0.01, 12]} />
          <meshBasicMaterial color="#1a1a1e" />
        </mesh>
      ))}
      {[-3, -1, 1, 3].map((z) => (
        <mesh key={`fz${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y + 0.001, z]}>
          <planeGeometry args={[12, 0.01]} />
          <meshBasicMaterial color="#1a1a1e" />
        </mesh>
      ))}

      {/* Back wall */}
      <mesh position={[0, 2.5, WALL_BACK_Z]}>
        <planeGeometry args={[12, 6]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>

      {/* Left wall */}
      <mesh position={[WALL_LEFT_X, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[12, 6]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>

      {/* Corner edge */}
      <mesh position={[WALL_LEFT_X + 0.01, 2.5, WALL_BACK_Z + 0.01]}>
        <boxGeometry args={[0.02, 6, 0.02]} />
        <meshStandardMaterial color="#1a1a20" roughness={0.9} metalness={0} />
      </mesh>

      {/* Base molding along back wall */}
      <mesh position={[0, FLOOR_Y + 0.04, WALL_BACK_Z + 0.02]}>
        <boxGeometry args={[12, 0.08, 0.03]} />
        <meshStandardMaterial color="#2a2a30" roughness={0.9} metalness={0.02} />
      </mesh>

      {/* Base molding along left wall */}
      <mesh position={[WALL_LEFT_X + 0.02, FLOOR_Y + 0.04, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[12, 0.08, 0.03]} />
        <meshStandardMaterial color="#2a2a30" roughness={0.9} metalness={0.02} />
      </mesh>
    </group>
  );
}

// ─── Click detection ─────────────────────────────────────

function ClickZone({
  onClick,
  onHover,
}: {
  onClick: () => void;
  onHover: (h: boolean) => void;
}) {
  return (
    <mesh
      position={[0, 0.3, 0.2]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { onHover(false); document.body.style.cursor = "default"; }}
    >
      <boxGeometry args={[1.5, 1.2, 1.2]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

// ─── Dust motes ──────────────────────────────────────────

function DustParticles() {
  const ref = useRef<THREE.Points>(null!);
  const count = 60;

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = Float32Array.from({ length: count * 3 }, (_, i) => {
      const axis = i % 3;
      if (axis === 0) return PC_POS[0] + (Math.random() - 0.5) * 4;
      if (axis === 1) return Math.random() * 2.5;
      return PC_POS[2] + (Math.random() - 0.5) * 4;
    });
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.008;
    const pos = geo.getAttribute("position");
    for (let i = 0; i < count; i++) {
      pos.setY(i, pos.getY(i) + Math.sin(state.clock.elapsedTime * 0.4 + i * 0.5) * 0.0002);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.01} color="#aaaaaa" transparent opacity={0.15} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// ─── Camera zoom ─────────────────────────────────────────

function CameraController({
  zooming,
  onZoomComplete,
}: {
  zooming: boolean;
  onZoomComplete: () => void;
}) {
  const { camera } = useThree();
  const progress = useRef(0);
  const called = useRef(false);
  const startPos = useRef(new THREE.Vector3());
  const captured = useRef(false);

  const endPos = useMemo(() => new THREE.Vector3(PC_POS[0] + 0.3, PC_POS[1] + 0.45, PC_POS[2] + 0.7), []);
  const endLook = useMemo(() => new THREE.Vector3(PC_POS[0], PC_POS[1] + 0.4, PC_POS[2]), []);

  useFrame((_, delta) => {
    if (!zooming) return;

    if (!captured.current) {
      startPos.current.copy(camera.position);
      captured.current = true;
    }

    progress.current = Math.min(progress.current + delta * 0.5, 1);
    const t = 1 - Math.pow(1 - progress.current, 3);

    camera.position.lerpVectors(startPos.current, endPos, t);

    const startLook = new THREE.Vector3(CAM_LOOK[0], CAM_LOOK[1], CAM_LOOK[2]);
    const look = new THREE.Vector3().lerpVectors(startLook, endLook, t);
    camera.lookAt(look);

    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = THREE.MathUtils.lerp(50, 30, t);
    cam.updateProjectionMatrix();

    if (progress.current >= 1 && !called.current) {
      called.current = true;
      onZoomComplete();
    }
  });

  return null;
}

// ─── Idle camera sway ────────────────────────────────────

function CameraIdle({ active }: { active: boolean }) {
  const { camera } = useThree();

  useFrame((state) => {
    if (!active) return;
    const t = state.clock.elapsedTime;
    camera.position.x = CAM_START[0] + Math.sin(t * 0.1) * 0.06;
    camera.position.y = CAM_START[1] + Math.sin(t * 0.15) * 0.03;
    camera.position.z = CAM_START[2] + Math.cos(t * 0.08) * 0.04;
    camera.lookAt(CAM_LOOK[0], CAM_LOOK[1], CAM_LOOK[2]);
  });

  return null;
}

// ─── Main export ─────────────────────────────────────────

interface Room3DProps {
  onEnter: () => void;
}

export default function Room3D({ onEnter }: Room3DProps) {
  const [zooming, setZooming] = useState(false);
  const [whiteFlash, setWhiteFlash] = useState(false);
  const [hovered, setHovered] = useState(false);
  const materials = useMaterials();

  const handleEnter = useCallback(() => {
    if (zooming) return;
    setZooming(true);
    document.body.style.cursor = "default";
  }, [zooming]);

  const handleZoomComplete = useCallback(() => {
    setWhiteFlash(true);
    setTimeout(onEnter, 500);
  }, [onEnter]);

  return (
    <div className="fixed inset-0 z-[100]">
      <Canvas
        camera={{ position: CAM_START, fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.4,
        }}
        style={{ background: "#0a0a0e" }}
        onCreated={({ camera }) => {
          camera.lookAt(CAM_LOOK[0], CAM_LOOK[1], CAM_LOOK[2]);
        }}
      >
        {/* Ambient fill so nothing is pitch black */}
        <ambientLight intensity={0.15} />

        {/* Fog — pushed back so the room is well-lit */}
        <fog attach="fog" args={["#0a0a0e", 8, 18]} />

        {/* Fluorescent tube lamp */}
        <FluorescentLamp />

        {/* PC setup */}
        <group position={PC_POS} rotation={[0, PC_ROT_Y, 0]}>
          <Monitor materials={materials} hovered={hovered} />
          <SystemUnit materials={materials} />
          <Keyboard materials={materials} />
          <ClickZone onClick={handleEnter} onHover={setHovered} />
        </group>

        {/* Room */}
        <Room materials={materials} />

        {/* Dust */}
        <DustParticles />

        {/* Camera */}
        <CameraIdle active={!zooming} />
        <CameraController zooming={zooming} onZoomComplete={handleZoomComplete} />
      </Canvas>

      {/* Flash on transition */}
      {whiteFlash && (
        <div
          className="absolute inset-0 z-50 bg-sol-green/20"
          style={{ animation: "fadeOut 0.6s ease-out forwards" }}
        />
      )}

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.06]"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.3) 3px, rgba(0,0,0,0.3) 4px)",
        }}
      />

      {/* Bottom hint text */}
      {!zooming && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center space-y-3">
          <div className="transition-all duration-500" style={{ opacity: hovered ? 1 : 0.5 }}>
            <p className="font-mono text-xs text-sol-green tracking-[0.2em] uppercase">
              {hovered ? "[ Click to Initialize ]" : "// Terminal.MY"}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-text-secondary/10" />
            <p className="font-mono text-[0.55rem] text-text-secondary/30 tracking-[0.15em]">
              SUPERTEAM MALAYSIA v1.0
            </p>
            <div className="h-px w-12 bg-text-secondary/10" />
          </div>
        </div>
      )}
    </div>
  );
}
