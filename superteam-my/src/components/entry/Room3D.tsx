"use client";

import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Leva, useControls, folder } from "leva";
import * as THREE from "three";

// ─── Types ────────────────────────────────────────────────

type Phase = "idle" | "zooming" | "atScreen" | "entering";

interface SceneConfig {
  pcPos: [number, number, number];
  pcRotY: number;
  monitorTilt: number;
  wallBackZ: number;
  wallLeftX: number;
  floorY: number;
  camStart: [number, number, number];
  camLook: [number, number, number];
  spotOffset: [number, number, number];
  spotIntensity: number;
  spotAngle: number;
}

// ─── Screen math helpers ─────────────────────────────────

function getScreenWorldPos(pcPos: [number, number, number], pcRotY: number) {
  // Screen in PC-local space: [0, 0.41, 0.186]
  const lx = 0, ly = 0.41, lz = 0.186;
  const c = Math.cos(pcRotY), s = Math.sin(pcRotY);
  return new THREE.Vector3(
    pcPos[0] + lx * c + lz * s,
    pcPos[1] + ly,
    pcPos[2] - lx * s + lz * c,
  );
}

function getScreenForward(pcRotY: number) {
  return new THREE.Vector3(Math.sin(pcRotY), 0, Math.cos(pcRotY));
}

// ─── PBR Materials ───────────────────────────────────────

function useMaterials() {
  return useMemo(() => {
    const beigePlastic = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#C8B88A"), roughness: 0.75, metalness: 0.02,
    });
    const darkBeige = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#A89868"), roughness: 0.8, metalness: 0.02,
    });
    const offWhite = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#D8D0B8"), roughness: 0.7, metalness: 0.03,
    });
    const darkPlastic = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#2A2A2A"), roughness: 0.6, metalness: 0.05,
    });
    const keyCap = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#B8A878"), roughness: 0.65, metalness: 0.03,
    });
    const brushedMetal = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#888888"), roughness: 0.35, metalness: 0.85,
    });
    const floppySlot = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1a1a1a"), roughness: 0.5, metalness: 0.1,
    });
    const rubber = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1a1a1a"), roughness: 0.95, metalness: 0.0,
    });
    const wall = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#3a3a40"), roughness: 0.92, metalness: 0.02,
    });
    const floor = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#2a2a30"), roughness: 0.7, metalness: 0.08,
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

// ─── CRT Monitor (with tilt) ────────────────────────────

function Monitor({
  materials,
  hovered,
  tilt,
  phase,
  onInstall,
}: {
  materials: ReturnType<typeof useMaterials>;
  hovered: boolean;
  tilt: number;
  phase: Phase;
  onInstall: () => void;
}) {
  const screenRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      const target = hovered ? 0.6 : 0.25;
      const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, target + pulse, delta * 4);
    }
  });

  return (
    <group position={[0, 0.38, -0.02]} rotation={[tilt, 0, 0]}>
      {/* Main body */}
      <mesh material={materials.beigePlastic}>
        <boxGeometry args={[0.52, 0.44, 0.4]} />
      </mesh>
      {/* Rear bump */}
      <mesh material={materials.beigePlastic} position={[0, 0.02, -0.18]}>
        <boxGeometry args={[0.44, 0.36, 0.1]} />
      </mesh>
      {/* Top ridge */}
      <mesh material={materials.darkBeige} position={[0, 0.225, 0.02]}>
        <boxGeometry args={[0.53, 0.01, 0.42]} />
      </mesh>
      {/* Screen bezel */}
      <mesh position={[0, 0.03, 0.201]} material={materials.darkPlastic}>
        <boxGeometry args={[0.46, 0.36, 0.008]} />
      </mesh>
      {/* Screen */}
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
      {/* Glass reflection */}
      <mesh position={[0, 0.06, 0.21]}>
        <planeGeometry args={[0.35, 0.27]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.02} roughness={0.0} metalness={1.0} />
      </mesh>
      {/* Scanlines */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[0, -0.08 + i * 0.03, 0.212]}>
          <planeGeometry args={[0.35, 0.002]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.12} depthWrite={false} />
        </mesh>
      ))}
      {/* Bottom panel */}
      <mesh position={[0, -0.17, 0.2]} material={materials.offWhite}>
        <boxGeometry args={[0.46, 0.06, 0.008]} />
      </mesh>
      {/* Nameplate */}
      <mesh position={[-0.12, -0.17, 0.206]} material={materials.brushedMetal}>
        <boxGeometry args={[0.08, 0.015, 0.004]} />
      </mesh>
      {/* Knobs */}
      <mesh position={[0.14, -0.17, 0.208]} rotation={[Math.PI / 2, 0, 0]} material={materials.darkPlastic}>
        <cylinderGeometry args={[0.008, 0.008, 0.012, 10]} />
      </mesh>
      <mesh position={[0.17, -0.17, 0.208]} rotation={[Math.PI / 2, 0, 0]} material={materials.darkPlastic}>
        <cylinderGeometry args={[0.008, 0.008, 0.012, 10]} />
      </mesh>
      {/* Power LED */}
      <mesh position={[0.2, -0.17, 0.208]}>
        <boxGeometry args={[0.006, 0.006, 0.004]} />
        <meshStandardMaterial color="#00ff44" emissive="#00ff44" emissiveIntensity={3} />
      </mesh>
      {/* Left vents */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`l${i}`} position={[-0.262, -0.08 + i * 0.025, -0.02]} material={materials.darkBeige}>
          <boxGeometry args={[0.005, 0.008, 0.25]} />
        </mesh>
      ))}
      {/* Right vents */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`r${i}`} position={[0.262, -0.08 + i * 0.025, -0.02]} material={materials.darkBeige}>
          <boxGeometry args={[0.005, 0.008, 0.25]} />
        </mesh>
      ))}
      {/* Stand neck */}
      <mesh position={[0, -0.23, 0.02]} material={materials.beigePlastic}>
        <boxGeometry args={[0.25, 0.03, 0.2]} />
      </mesh>
      {/* Stand base */}
      <mesh position={[0, -0.25, 0.02]} material={materials.darkBeige}>
        <boxGeometry args={[0.3, 0.015, 0.22]} />
      </mesh>
      {/* Interactive screen — always visible in 3D space */}
      <group position={[0, 0.03, 0.209]}>
        <Html
          transform
          scale={0.025}
          style={{ pointerEvents: phase === "atScreen" ? "auto" : "none" }}
        >
          <ScreenTerminal phase={phase} onInstall={onInstall} />
        </Html>
      </group>

      {/* ── God rays from CRT ── */}
      <ScreenGodRays />

      {/* Accent light — illuminates nearby surfaces */}
      <pointLight
        position={[0, 0.03, 0.5]}
        color="#90ffb0"
        intensity={2}
        distance={4}
        decay={2}
      />
    </group>
  );
}

// ─── God rays (custom shader) ────────────────────────────

// Volumetric god rays — single cone mesh from screen outward

const godRayShader = {
  vertex: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
      vViewDir = normalize(-mvPos.xyz);
      gl_Position = projectionMatrix * mvPos;
    }
  `,
  fragment: `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float amp = 0.5;
      for (int i = 0; i < 5; i++) {
        v += noise(p) * amp;
        p *= 2.0;
        amp *= 0.5;
      }
      return v;
    }

    void main() {
      // vUv.y = 0 at screen (narrow end), 1 at far end (wide end)
      float depth = vUv.y;

      // Fade intensity with distance from screen — bright near, dim far
      float depthFade = pow(1.0 - depth, 1.8);

      // Fresnel edge fade — faces edge-on to camera become invisible
      float fresnel = abs(dot(vNormal, vViewDir));
      fresnel = pow(fresnel, 0.6);

      // Dust / fog noise — scrolls slowly
      vec2 noiseUV = vec2(vUv.x * 4.0 + uTime * 0.01, depth * 3.0 - uTime * 0.02);
      float dust = fbm(noiseUV);

      // Wispy streaks — radial rays from screen
      float rays = fbm(vec2(vUv.x * 12.0, uTime * 0.015));
      rays = smoothstep(0.25, 0.55, rays);

      // Combine
      float alpha = depthFade * fresnel * (0.25 + dust * 0.5) * (0.5 + rays * 0.5);
      alpha *= 0.18;

      // Fade at the tip (near screen) and open end smoothly
      alpha *= smoothstep(0.0, 0.05, depth) * smoothstep(1.0, 0.85, depth);

      gl_FragColor = vec4(uColor, alpha);
    }
  `,
};

function ScreenGodRays() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#80ffb0") },
  }), []);

  // Cylinder along Y, rotated [PI/2, 0, 0] so it extends along +Z (outward from screen).
  // Screen face is at local Z≈0.21. Narrow end at screen, wide end projects outward.
  return (
    <mesh position={[0, 0.03, 1.71]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[1.0, 0.12, 3.0, 32, 1, true]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={godRayShader.vertex}
        fragmentShader={godRayShader.fragment}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
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

// ─── Flickering spotlight ────────────────────────────────

function FlickeringSpotlight({ cfg }: { cfg: SceneConfig }) {
  const spotRef = useRef<THREE.SpotLight>(null!);
  const bulbRef = useRef<THREE.Mesh>(null!);
  const flickerState = useRef({ nextFlicker: 0, isOff: false, dimLevel: 1.0 });

  const targetPos = useMemo(
    () => new THREE.Vector3(cfg.pcPos[0], cfg.pcPos[1] + 0.25, cfg.pcPos[2]),
    [cfg.pcPos],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (t > flickerState.current.nextFlicker) {
      if (!flickerState.current.isOff && Math.random() < 0.2) {
        flickerState.current.isOff = true;
        flickerState.current.dimLevel = Math.random() * 0.3;
        flickerState.current.nextFlicker = t + 0.02 + Math.random() * 0.06;
      } else if (flickerState.current.isOff && Math.random() < 0.4) {
        flickerState.current.dimLevel = Math.random() * 0.15;
        flickerState.current.nextFlicker = t + 0.02 + Math.random() * 0.04;
      } else {
        flickerState.current.isOff = false;
        flickerState.current.dimLevel = 1.0;
        flickerState.current.nextFlicker = t + 0.8 + Math.random() * 4;
      }
    }

    const flicker = flickerState.current.isOff ? flickerState.current.dimLevel : 1.0;
    const hum = 1.0 + Math.sin(t * 120) * 0.02;
    const intensity = cfg.spotIntensity * flicker * hum;

    if (spotRef.current) {
      spotRef.current.intensity = intensity;
      spotRef.current.target.position.copy(targetPos);
      spotRef.current.target.updateMatrixWorld();
    }
    if (bulbRef.current) {
      const mat = bulbRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 3 * flicker * hum;
    }
  });

  const lampPos: [number, number, number] = [
    cfg.pcPos[0] + cfg.spotOffset[0],
    cfg.spotOffset[1],
    cfg.pcPos[2] + cfg.spotOffset[2],
  ];

  return (
    <group position={lampPos}>
      {/* Ceiling mount */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.7} metalness={0.6} />
      </mesh>
      {/* Rod */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.2, 6]} />
        <meshStandardMaterial color="#444444" roughness={0.5} metalness={0.7} />
      </mesh>
      {/* Cone shade */}
      <mesh position={[0, -0.1, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.12, 0.15, 12, 1, true]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Bulb */}
      <mesh ref={bulbRef} position={[0, -0.08, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#fff8e0" emissive="#ffe0a0" emissiveIntensity={3} transparent opacity={0.9} />
      </mesh>
      {/* Spot light */}
      <spotLight
        ref={spotRef}
        position={[0, -0.05, 0]}
        color="#ffe8c0"
        intensity={cfg.spotIntensity}
        distance={8}
        angle={cfg.spotAngle}
        penumbra={0.7}
        decay={1.8}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
    </group>
  );
}

// ─── Room ────────────────────────────────────────────────

function Room({
  materials,
  cfg,
}: {
  materials: ReturnType<typeof useMaterials>;
  cfg: SceneConfig;
}) {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, cfg.floorY, 0]}>
        <planeGeometry args={[12, 12]} />
        <primitive object={materials.floor} attach="material" />
      </mesh>
      {/* Floor joints */}
      {[-3, -1, 1, 3].map((x) => (
        <mesh key={`fx${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, cfg.floorY + 0.001, 0]}>
          <planeGeometry args={[0.01, 12]} />
          <meshBasicMaterial color="#1a1a1e" />
        </mesh>
      ))}
      {[-3, -1, 1, 3].map((z) => (
        <mesh key={`fz${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, cfg.floorY + 0.001, z]}>
          <planeGeometry args={[12, 0.01]} />
          <meshBasicMaterial color="#1a1a1e" />
        </mesh>
      ))}
      {/* Back wall */}
      <mesh position={[0, 2.5, cfg.wallBackZ]}>
        <planeGeometry args={[12, 6]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>
      {/* Left wall */}
      <mesh position={[cfg.wallLeftX, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[12, 6]} />
        <primitive object={materials.wall} attach="material" />
      </mesh>
      {/* Corner edge */}
      <mesh position={[cfg.wallLeftX + 0.01, 2.5, cfg.wallBackZ + 0.01]}>
        <boxGeometry args={[0.02, 6, 0.02]} />
        <meshStandardMaterial color="#1a1a20" roughness={0.9} metalness={0} />
      </mesh>
      {/* Base molding — back */}
      <mesh position={[0, cfg.floorY + 0.04, cfg.wallBackZ + 0.02]}>
        <boxGeometry args={[12, 0.08, 0.03]} />
        <meshStandardMaterial color="#2a2a30" roughness={0.9} metalness={0.02} />
      </mesh>
      {/* Base molding — left */}
      <mesh position={[cfg.wallLeftX + 0.02, cfg.floorY + 0.04, 0]} rotation={[0, Math.PI / 2, 0]}>
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
      visible={false}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { onHover(false); document.body.style.cursor = "default"; }}
    >
      <boxGeometry args={[1.5, 1.2, 1.2]} />
      <meshBasicMaterial />
    </mesh>
  );
}

// ─── Dust motes (lots) ──────────────────────────────────

function DustParticles({ pcPos }: { pcPos: [number, number, number] }) {
  const ref = useRef<THREE.Points>(null!);
  const count = 800;

  const { geo, sizes, speeds } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const s = new Float32Array(count);
    const sp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = pcPos[0] + (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = Math.random() * 5;
      positions[i * 3 + 2] = pcPos[2] + (Math.random() - 0.5) * 12;
      s[i] = 0.004 + Math.random() * 0.018;
      sp[i] = 0.15 + Math.random() * 0.5;
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("size", new THREE.BufferAttribute(s, 1));
    return { geo: g, sizes: s, speeds: sp };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.005;
    const pos = geo.getAttribute("position");
    for (let i = 0; i < count; i++) {
      const t = state.clock.elapsedTime;
      pos.setX(i, pos.getX(i) + Math.sin(t * 0.15 + i * 1.3) * 0.0002);
      pos.setY(i, pos.getY(i) + Math.sin(t * speeds[i] + i * 0.5) * 0.0004);
      pos.setZ(i, pos.getZ(i) + Math.cos(t * 0.12 + i * 0.8) * 0.00018);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.018} color="#ccccbb" transparent opacity={0.25} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// ─── Ambient smoke / haze ────────────────────────────────

const smokeVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const smokeFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += noise(p) * amp;
      p *= 2.1;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;

    // Slow drifting smoke
    float smoke1 = fbm(uv * 2.0 + vec2(uTime * 0.02, uTime * 0.015));
    float smoke2 = fbm(uv * 3.5 + vec2(-uTime * 0.03, uTime * 0.01));
    float smoke = smoke1 * 0.6 + smoke2 * 0.4;

    // Fade at edges
    float edgeFade = smoothstep(0.0, 0.3, uv.x) * smoothstep(1.0, 0.7, uv.x)
                   * smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.7, uv.y);

    // Wispy threshold — only show denser patches
    smoke = smoothstep(0.35, 0.65, smoke);

    float alpha = smoke * edgeFade * 0.04;

    gl_FragColor = vec4(0.6, 0.7, 0.65, alpha);
  }
`;

function AmbientSmoke({ pcPos }: { pcPos: [number, number, number] }) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  return (
    <group>
      {/* Floor-level fog */}
      <mesh position={[pcPos[0], 0.15, pcPos[2] + 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={smokeVertexShader}
          fragmentShader={smokeFragmentShader}
          uniforms={uniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Mid-height haze */}
      <mesh position={[pcPos[0] + 0.3, 1.0, pcPos[2] + 0.5]} rotation={[0.2, 0.3, 0]}>
        <planeGeometry args={[6, 5]} />
        <shaderMaterial
          vertexShader={smokeVertexShader}
          fragmentShader={smokeFragmentShader}
          uniforms={uniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* High haze */}
      <mesh position={[pcPos[0] - 0.5, 2.0, pcPos[2] + 2]} rotation={[0.4, -0.2, 0.1]}>
        <planeGeometry args={[8, 6]} />
        <shaderMaterial
          vertexShader={smokeVertexShader}
          fragmentShader={smokeFragmentShader}
          uniforms={uniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ─── Camera: zoom to face the screen ─────────────────────

function CameraController({
  phase,
  cfg,
  onZoomComplete,
}: {
  phase: Phase;
  cfg: SceneConfig;
  onZoomComplete: () => void;
}) {
  const { camera } = useThree();
  const progress = useRef(0);
  const called = useRef(false);
  const startPos = useRef(new THREE.Vector3());
  const startLookRef = useRef(new THREE.Vector3());
  const captured = useRef(false);

  // Compute end position: 0.45 units in front of the screen, facing it
  const { endPos, endLook } = useMemo(() => {
    const screenCenter = getScreenWorldPos(cfg.pcPos, cfg.pcRotY);
    const forward = getScreenForward(cfg.pcRotY);
    const camEnd = screenCenter.clone().add(forward.clone().multiplyScalar(0.85));
    // Match screen height
    camEnd.y = screenCenter.y;
    return { endPos: camEnd, endLook: screenCenter };
  }, [cfg.pcPos, cfg.pcRotY]);

  useFrame((_, delta) => {
    if (phase !== "zooming") return;

    if (!captured.current) {
      startPos.current.copy(camera.position);
      // Capture current look target
      startLookRef.current.set(cfg.camLook[0], cfg.camLook[1], cfg.camLook[2]);
      captured.current = true;
    }

    progress.current = Math.min(progress.current + delta * 0.45, 1);
    const t = 1 - Math.pow(1 - progress.current, 3); // ease-out cubic

    camera.position.lerpVectors(startPos.current, endPos, t);

    const look = new THREE.Vector3().lerpVectors(startLookRef.current, endLook, t);
    camera.lookAt(look);

    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = THREE.MathUtils.lerp(50, 38, t);
    cam.updateProjectionMatrix();

    if (progress.current >= 1 && !called.current) {
      called.current = true;
      onZoomComplete();
    }
  });

  return null;
}

// ─── Camera idle sway ────────────────────────────────────

function CameraIdle({ active, cfg }: { active: boolean; cfg: SceneConfig }) {
  const { camera } = useThree();

  useFrame((state) => {
    if (!active) return;
    const t = state.clock.elapsedTime;
    camera.position.x = cfg.camStart[0] + Math.sin(t * 0.1) * 0.06;
    camera.position.y = cfg.camStart[1] + Math.sin(t * 0.15) * 0.03;
    camera.position.z = cfg.camStart[2] + Math.cos(t * 0.08) * 0.04;
    camera.lookAt(cfg.camLook[0], cfg.camLook[1], cfg.camLook[2]);
  });

  return null;
}

// ─── Screen terminal (rendered IN 3D via Html) ──────────

function ScreenTerminal({ phase, onInstall }: { phase: Phase; onInstall: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [showButton, setShowButton] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installLines, setInstallLines] = useState<string[]>([]);
  const [bootStarted, setBootStarted] = useState(false);

  const bootLines = useMemo(() => [
    "SUPERTEAM_MY TERMINAL v1.0",
    "Copyright (c) 2026 Superteam Malaysia",
    "",
    "Checking system integrity......... OK",
    "Loading Solana runtime............ OK",
    "Connecting to devnet.............. OK",
    "Validator status.................. ACTIVE",
    "",
    "> Ready.",
  ], []);

  // Start boot sequence when zoomed in
  useEffect(() => {
    if (phase === "atScreen" && !bootStarted) {
      setBootStarted(true);
    }
  }, [phase, bootStarted]);

  useEffect(() => {
    if (!bootStarted) return;
    let idx = 0;
    const timer = setInterval(() => {
      if (idx >= bootLines.length) {
        clearInterval(timer);
        setShowButton(true);
        return;
      }
      setLines((prev) => [...prev, bootLines[idx]!]);
      idx++;
    }, 180);
    return () => clearInterval(timer);
  }, [bootStarted, bootLines]);

  const handleInstall = useCallback(() => {
    if (installing) return;
    setInstalling(true);
    setShowButton(false);

    const deps = [
      "> npm install superteam-my",
      "",
      "resolving packages...",
      "added 247 packages in 3.2s",
      "",
      "  + @solana/web3.js@1.98.0",
      "  + @superteam/core@2.1.0",
      "  + terminal-ui@1.0.0",
      "",
      "> Initializing terminal...",
    ];

    let idx = 0;
    const timer = setInterval(() => {
      if (idx >= deps.length) {
        clearInterval(timer);
        setTimeout(onInstall, 500);
        return;
      }
      setInstallLines((prev) => [...prev, deps[idx]!]);
      idx++;
    }, 130);
  }, [installing, onInstall]);

  const lineClass = (l: string) => {
    if (l === "") return "h-[10px]";
    if (l.startsWith(">")) return "font-bold";
    if (l.includes("OK") || l.includes("ACTIVE")) return "opacity-80";
    if (l.startsWith("  +")) return "opacity-90";
    return "opacity-50";
  };

  return (
    // Black mask + barrel distortion container
    <div
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        width: 760,
        height: 600,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
      }}
    >
    {/* SVG filter for real barrel distortion */}
    <svg style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        <filter id="crt-barrel">
          {/* Barrel distortion via displacement map + spherize effect */}
          <feImage
            href={"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3CradialGradient id='g'%3E%3Cstop offset='0%25' stop-color='%23808080'/%3E%3Cstop offset='100%25' stop-color='%23404040'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='200' height='200'/%3E%3C/svg%3E"}
            result="map"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="35" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>

    <div
      style={{
        width: 720,
        height: 560,
        background: "radial-gradient(ellipse at center, #0a1a0a 0%, #040a04 60%, #020402 100%)",
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        fontSize: 13,
        lineHeight: 1.7,
        color: "#00ff88",
        padding: "32px 38px",
        position: "relative",
        overflow: "hidden",
        borderRadius: "14px",
        display: "flex",
        flexDirection: "column" as const,
        userSelect: "none" as const,
        // Apply barrel distortion filter
        filter: "url(#crt-barrel)",
      }}
    >
      {/* CRT scanlines */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" as const,
        background: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)",
        borderRadius: 14,
      }} />

      {/* Fine sub-scanlines */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" as const, opacity: 0.3,
        background: "repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,0,0,0.12) 1px, rgba(0,0,0,0.12) 2px)",
        borderRadius: 14,
      }} />

      {/* CRT vignette */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 11, pointerEvents: "none" as const,
        boxShadow:
          "inset 0 0 150px 60px rgba(0,0,0,0.55), inset 0 0 50px 15px rgba(0,0,0,0.35)",
        borderRadius: 14,
      }} />

      {/* Glass glare — top-left */}
      <div style={{
        position: "absolute", top: "4%", left: "8%",
        width: "55%", height: "20%",
        background: "linear-gradient(155deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 30%, transparent 60%)",
        borderRadius: "50%", filter: "blur(10px)",
        pointerEvents: "none" as const, zIndex: 12,
      }} />

      {/* RGB sub-pixel columns */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" as const, opacity: 0.03,
        background: "repeating-linear-gradient(90deg, rgba(255,0,0,0.5) 0px, rgba(0,255,0,0.5) 1px, rgba(0,100,255,0.5) 2px, transparent 3px)",
        borderRadius: 14,
      }} />

      {/* ── Content ── */}
      <div style={{ position: "relative", zIndex: 5, flex: 1, display: "flex", flexDirection: "column" as const }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          marginBottom: 14, paddingBottom: 10,
          borderBottom: "1px solid rgba(0,255,163,0.12)",
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#00ffa3",
            boxShadow: "0 0 6px rgba(0,255,163,0.6)",
            animation: "pulse-glow 2s ease-in-out infinite",
          }} />
          <span style={{ fontSize: 10, color: "rgba(0,255,163,0.45)", letterSpacing: "0.25em", textTransform: "uppercase" as const }}>
            Terminal // MY
          </span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 9, color: "rgba(0,255,163,0.18)", letterSpacing: "0.1em" }}>
            v1.0.0
          </span>
        </div>

        {/* Screen content */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {/* Idle state — before boot */}
          {!bootStarted && (
            <div style={{ height: "100%", display: "flex", flexDirection: "column" as const, justifyContent: "center", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 16, letterSpacing: "0.2em", fontWeight: "bold" }}>SUPERTEAM // MY</div>
              <div style={{ fontSize: 10, opacity: 0.4, letterSpacing: "0.15em" }}>SOLANA TERMINAL v1.0</div>
              <div style={{ marginTop: 16, fontSize: 11, opacity: 0.3, animation: "cursor-blink 1.2s step-end infinite" }}>
                Click to initialize...
              </div>
            </div>
          )}

          {/* Boot lines */}
          {lines.map((line, i) => {
            const l = line ?? "";
            return <div key={i} className={lineClass(l)}>{l}</div>;
          })}

          {/* Install output */}
          {installLines.length > 0 && (
            <div style={{ marginTop: 10 }}>
              {installLines.map((line, i) => {
                const l = line ?? "";
                return <div key={i} className={lineClass(l)}>{l}</div>;
              })}
            </div>
          )}

          {/* Cursor */}
          {!showButton && !installing && lines.length < bootLines.length && (
            <span style={{ animation: "cursor-blink 1s step-end infinite" }}>_</span>
          )}
          {installing && installLines.length < 10 && (
            <span style={{ animation: "cursor-blink 1s step-end infinite" }}>_</span>
          )}
        </div>

        {/* npm install button */}
        {showButton && (
          <div style={{ paddingTop: 14 }}>
            <button
              onClick={handleInstall}
              style={{
                width: "100%",
                padding: "12px 20px",
                border: "1px solid rgba(0,255,163,0.35)",
                background: "rgba(0,255,163,0.03)",
                color: "#00ff88",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0,255,163,0.08)";
                e.currentTarget.style.borderColor = "rgba(0,255,163,0.6)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,163,0.12), inset 0 0 20px rgba(0,255,163,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0,255,163,0.03)";
                e.currentTarget.style.borderColor = "rgba(0,255,163,0.35)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {">"} npm install
            </button>
            <p style={{
              textAlign: "center" as const, fontSize: 8,
              color: "rgba(0,255,163,0.15)", marginTop: 6, letterSpacing: "0.25em",
            }}>
              PRESS TO INITIALIZE SUPERTEAM TERMINAL
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────

interface Room3DProps {
  onEnter: () => void;
}

export default function Room3D({ onEnter }: Room3DProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [hovered, setHovered] = useState(false);
  const materials = useMaterials();

  // ── Leva dev controls ──────────────────────────────────
  const pc = useControls("PC", {
    x: { value: -1.9, min: -6, max: 2, step: 0.05 },
    y: { value: 0, min: -2, max: 2, step: 0.05 },
    z: { value: -0.85, min: -6, max: 2, step: 0.05 },
    rotY: { value: 1.75, min: 0, max: Math.PI * 2, step: 0.01 },
    monitorTilt: { value: -0.12, min: -0.5, max: 0.3, step: 0.01 },
  });

  const walls = useControls("Walls", {
    backZ: { value: -2.85, min: -8, max: 0, step: 0.05 },
    leftX: { value: -3.75, min: -8, max: 0, step: 0.05 },
    floorY: { value: -0.05, min: -2, max: 1, step: 0.01 },
  });

  const spot = useControls("Spotlight", {
    offsetX: { value: 0.2, min: -3, max: 3, step: 0.05 },
    offsetY: { value: 3.2, min: 1, max: 6, step: 0.05 },
    offsetZ: { value: 0.5, min: -3, max: 3, step: 0.05 },
    intensity: { value: 40, min: 0, max: 120, step: 1 },
    angle: { value: 0.9, min: 0.1, max: 1.5, step: 0.01 },
  });

  const cam = useControls("Camera", {
    startX: { value: 2.35, min: -5, max: 10, step: 0.05 },
    startY: { value: 1.54, min: 0, max: 5, step: 0.05 },
    startZ: { value: 5.99, min: -5, max: 15, step: 0.05 },
    lookX: { value: -0.5, min: -5, max: 5, step: 0.05 },
    lookY: { value: 0.3, min: -2, max: 3, step: 0.05 },
    lookZ: { value: -0.4, min: -5, max: 5, step: 0.05 },
  });

  const cfg: SceneConfig = useMemo(() => ({
    pcPos: [pc.x, pc.y, pc.z],
    pcRotY: pc.rotY,
    monitorTilt: pc.monitorTilt,
    wallBackZ: walls.backZ,
    wallLeftX: walls.leftX,
    floorY: walls.floorY,
    camStart: [cam.startX, cam.startY, cam.startZ],
    camLook: [cam.lookX, cam.lookY, cam.lookZ],
    spotOffset: [spot.offsetX, spot.offsetY, spot.offsetZ],
    spotIntensity: spot.intensity,
    spotAngle: spot.angle,
  }), [pc, walls, spot, cam]);

  // ── Handlers ───────────────────────────────────────────

  const handleClickPC = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("zooming");
    document.body.style.cursor = "default";
  }, [phase]);

  const handleZoomComplete = useCallback(() => {
    setPhase("atScreen");
  }, []);

  const handleInstall = useCallback(() => {
    setPhase("entering");
    setTimeout(onEnter, 600);
  }, [onEnter]);

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Leva dev panel */}
      <Leva collapsed={false} />

      <Canvas
        camera={{ position: cfg.camStart, fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.4,
        }}
        style={{ background: "#0a0a0e" }}
        onCreated={({ camera }) => {
          camera.lookAt(cfg.camLook[0], cfg.camLook[1], cfg.camLook[2]);
        }}
      >
        <ambientLight intensity={0.15} />
        <fog attach="fog" args={["#0a0a0e", 8, 18]} />


        {/* PC setup */}
        <group position={cfg.pcPos} rotation={[0, cfg.pcRotY, 0]}>
          <Monitor materials={materials} hovered={hovered} tilt={cfg.monitorTilt} phase={phase} onInstall={handleInstall} />
          <SystemUnit materials={materials} />
          <Keyboard materials={materials} />
          {phase === "idle" && (
            <ClickZone onClick={handleClickPC} onHover={setHovered} />
          )}
        </group>

        <Room materials={materials} cfg={cfg} />
        <DustParticles pcPos={cfg.pcPos} />
        <AmbientSmoke pcPos={cfg.pcPos} />

        <CameraIdle active={phase === "idle"} cfg={cfg} />
        <CameraController phase={phase} cfg={cfg} onZoomComplete={handleZoomComplete} />
      </Canvas>

      {/* Green flash on enter */}
      {phase === "entering" && (
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
      {phase === "idle" && (
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
