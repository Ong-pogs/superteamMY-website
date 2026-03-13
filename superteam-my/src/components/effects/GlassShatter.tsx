"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── Shape Builders ───────────────────────────────────────────────

function makeChevronLeft(strokeW: number): THREE.Shape {
  // < shape — two thick line segments forming left-pointing chevron
  const hw = strokeW / 2;
  const shape = new THREE.Shape();
  // Outer edge
  shape.moveTo(0.15, 0.4);
  shape.lineTo(-0.25, 0);
  shape.lineTo(0.15, -0.4);
  // Inner edge (offset inward by stroke width)
  shape.lineTo(0.15 - hw, -0.4 + hw * 0.6);
  shape.lineTo(-0.25 + strokeW, 0);
  shape.lineTo(0.15 - hw, 0.4 - hw * 0.6);
  shape.closePath();
  return shape;
}

function makeSlash(strokeW: number): THREE.Shape {
  // / shape — tilted rectangle
  const hw = strokeW / 2;
  const shape = new THREE.Shape();
  shape.moveTo(hw, -0.4);
  shape.lineTo(hw + strokeW * 0.3, -0.4);
  shape.lineTo(-hw, 0.4);
  shape.lineTo(-hw - strokeW * 0.3, 0.4);
  shape.closePath();
  return shape;
}

function makeChevronRight(strokeW: number): THREE.Shape {
  // > shape — mirror of <
  const hw = strokeW / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-0.15, 0.4);
  shape.lineTo(0.25, 0);
  shape.lineTo(-0.15, -0.4);
  shape.lineTo(-0.15 + hw, -0.4 + hw * 0.6);
  shape.lineTo(0.25 - strokeW, 0);
  shape.lineTo(-0.15 + hw, 0.4 - hw * 0.6);
  shape.closePath();
  return shape;
}

// ─── Shard type ───────────────────────────────────────────────────

interface Shard {
  geometry: THREE.BufferGeometry;
  center: THREE.Vector3;
  scatteredPos: THREE.Vector3;
  rotSpeed: { x: number; y: number; z: number };
}

// ─── Generate shards from </> shape ──────────────────────────────

function generateShards(strokeWidth = 0.1, extrudeDepth = 0.15): Shard[] {
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: extrudeDepth,
    bevelEnabled: false,
  };

  const chars: { shape: THREE.Shape; offsetX: number }[] = [
    { shape: makeChevronLeft(strokeWidth), offsetX: -0.5 },
    { shape: makeSlash(strokeWidth), offsetX: 0 },
    { shape: makeChevronRight(strokeWidth), offsetX: 0.5 },
  ];

  const shards: Shard[] = [];

  for (const { shape, offsetX } of chars) {
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.translate(offsetX, 0, -extrudeDepth / 2); // center depth
    geom.computeVertexNormals();

    const pos = geom.getAttribute("position");
    const normals = geom.getAttribute("normal");
    const count = pos.count;

    // Extract each triangle face as a shard
    for (let i = 0; i < count; i += 3) {
      if (i + 2 >= count) break;

      const v0 = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
      const v1 = new THREE.Vector3(pos.getX(i + 1), pos.getY(i + 1), pos.getZ(i + 1));
      const v2 = new THREE.Vector3(pos.getX(i + 2), pos.getY(i + 2), pos.getZ(i + 2));

      const center = new THREE.Vector3()
        .add(v0)
        .add(v1)
        .add(v2)
        .divideScalar(3);

      // Face normal from first triangle normal (approximate)
      const faceNormal = new THREE.Vector3(
        normals.getX(i),
        normals.getY(i),
        normals.getZ(i)
      ).normalize();

      // Scatter: push along face normal + random jitter
      const scatterDist = 0.6 + Math.random() * 0.8;
      const jitter = new THREE.Vector3(
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.4
      );
      const scatteredPos = center
        .clone()
        .add(faceNormal.multiplyScalar(scatterDist))
        .add(jitter);

      // Build local geometry (vertices relative to center)
      const localPositions = new Float32Array([
        v0.x - center.x, v0.y - center.y, v0.z - center.z,
        v1.x - center.x, v1.y - center.y, v1.z - center.z,
        v2.x - center.x, v2.y - center.y, v2.z - center.z,
      ]);

      const shardGeom = new THREE.BufferGeometry();
      shardGeom.setAttribute("position", new THREE.BufferAttribute(localPositions, 3));
      shardGeom.computeVertexNormals();

      shards.push({
        geometry: shardGeom,
        center,
        scatteredPos,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.04,
          y: (Math.random() - 0.5) * 0.04,
          z: (Math.random() - 0.5) * 0.04,
        },
      });
    }

    geom.dispose();
  }

  return shards;
}

// ─── Sparkle Particles ───────────────────────────────────────────

function SparkleParticles({ hovered, shards }: { hovered: boolean; shards: Shard[] }) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const count = 60;

  const { positions, basePositions, targets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Base: near center
      basePositions[i * 3] = (Math.random() - 0.5) * 0.2;
      basePositions[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      basePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

      // Target: random shard center + outward drift
      const shard = shards[Math.floor(Math.random() * shards.length)];
      targets[i * 3] = shard.scatteredPos.x + (Math.random() - 0.5) * 0.3;
      targets[i * 3 + 1] = shard.scatteredPos.y + Math.random() * 0.2;
      targets[i * 3 + 2] = shard.scatteredPos.z + (Math.random() - 0.5) * 0.3;

      // Start at base
      positions[i * 3] = basePositions[i * 3];
      positions[i * 3 + 1] = basePositions[i * 3 + 1];
      positions[i * 3 + 2] = basePositions[i * 3 + 2];
    }

    return { positions, basePositions, targets };
  }, [shards]);

  useFrame(() => {
    if (!pointsRef.current || !matRef.current) return;
    const posAttr = pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const lerpFactor = 0.04;
    const targetOpacity = hovered ? 0.8 : 0;

    for (let i = 0; i < count; i++) {
      const ti = i * 3;
      const tx = hovered ? targets[ti] : basePositions[ti];
      const ty = hovered ? targets[ti + 1] : basePositions[ti + 1];
      const tz = hovered ? targets[ti + 2] : basePositions[ti + 2];

      arr[ti] += (tx - arr[ti]) * lerpFactor;
      arr[ti + 1] += (ty - arr[ti + 1]) * lerpFactor;
      arr[ti + 2] += (tz - arr[ti + 2]) * lerpFactor;
    }
    posAttr.needsUpdate = true;
    matRef.current.opacity += (targetOpacity - matRef.current.opacity) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.03}
        color="#00FFA3"
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── GlassObject — Main R3F Scene ────────────────────────────────

const GREEN = new THREE.Color("#00FFA3");
const BLACK = new THREE.Color("#000000");
const WHITE = new THREE.Color("#ffffff");
const PURPLE = new THREE.Color("#c4b5fd");


function GlassObject() {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  const shards = useMemo(() => generateShards(0.1, 0.15), []);

  // Shared material — created imperatively so it's available on first render
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        transmission: 0.92,
        roughness: 0.05,
        thickness: 0.5,
        ior: 1.5,
        side: THREE.DoubleSide,
        color: new THREE.Color("#ffffff"),
        transparent: true,
        envMapIntensity: 0.5,
        emissive: new THREE.Color("#000000"),
        emissiveIntensity: 0,
      }),
    []
  );

  const setMeshRef = useCallback(
    (index: number) => (el: THREE.Mesh | null) => {
      meshRefs.current[index] = el;
    },
    []
  );

  const handlePointerOver = useCallback(() => setHovered(true), []);
  const handlePointerOut = useCallback(() => setHovered(false), []);

  useFrame(() => {
    if (!groupRef.current) return;

    const lerpFactor = 0.08;

    for (let i = 0; i < shards.length; i++) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;

      const shard = shards[i];
      const target = hovered ? shard.scatteredPos : shard.center;
      mesh.position.lerp(target, lerpFactor);

      if (hovered) {
        mesh.rotation.x += shard.rotSpeed.x;
        mesh.rotation.z += shard.rotSpeed.z;
      } else {
        mesh.rotation.x += (0 - mesh.rotation.x) * 0.06;
        mesh.rotation.y += (0 - mesh.rotation.y) * 0.06;
        mesh.rotation.z += (0 - mesh.rotation.z) * 0.06;
      }
    }

    // Material effects
    const targetEmissive = hovered ? GREEN : BLACK;
    const targetEmissiveIntensity = hovered ? 0.4 : 0;
    const targetColor = hovered ? PURPLE : WHITE;

    material.emissive.lerp(targetEmissive, 0.05);
    material.emissiveIntensity +=
      (targetEmissiveIntensity - material.emissiveIntensity) * 0.05;
    material.color.lerp(targetColor, 0.04);

    // Idle rotation when assembled
    if (!hovered) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Shard meshes */}
      {shards.map((shard, i) => (
        <mesh
          key={i}
          ref={setMeshRef(i)}
          geometry={shard.geometry}
          material={material}
          position={[shard.center.x, shard.center.y, shard.center.z]}
        />
      ))}

      {/* Invisible hover hitbox */}
      <mesh
        visible={false}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[1.6, 1.0, 0.4]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Sparkle particles */}
      <SparkleParticles hovered={hovered} shards={shards} />
    </group>
  );
}

// ─── Exported Component ──────────────────────────────────────────

export default function GlassShatter() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 5]} intensity={1.2} />
        <pointLight position={[2, 1, 3]} intensity={0.5} color="#00FFA3" />
        <pointLight position={[-2, -1, 2]} intensity={0.5} color="#9945FF" />
        <GlassObject />
      </Canvas>
    </div>
  );
}
