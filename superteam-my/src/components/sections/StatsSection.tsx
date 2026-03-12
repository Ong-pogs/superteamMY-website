"use client";

import { useState, useMemo, Suspense, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import SectionLabel from "@/components/ui/SectionLabel";
import Counter from "@/components/ui/Counter";
import Crosshair from "@/components/effects/Crosshair";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// ─── Data ────────────────────────────────────────────────

type StatColor = "green" | "purple" | "blue" | "gold";

const colors: Record<StatColor, { text: string; bg: string; border: string; glow: string; rgb: string }> = {
  green:  { text: "text-sol-green",   bg: "bg-sol-green",   border: "border-sol-green/30",   glow: "shadow-[0_0_20px_rgba(0,255,163,0.15)]",  rgb: "0,255,163" },
  purple: { text: "text-sol-purple",  bg: "bg-sol-purple",  border: "border-sol-purple/30",  glow: "shadow-[0_0_20px_rgba(153,69,255,0.15)]", rgb: "153,69,255" },
  blue:   { text: "text-sol-blue",    bg: "bg-sol-blue",    border: "border-sol-blue/30",    glow: "shadow-[0_0_20px_rgba(20,241,149,0.15)]",  rgb: "20,241,149" },
  gold:   { text: "text-gold-accent", bg: "bg-gold-accent", border: "border-gold-accent/30", glow: "shadow-[0_0_20px_rgba(255,184,0,0.15)]",   rgb: "255,184,0" },
};

interface PrimaryStat {
  label: string;
  value: number;
  suffix: string;
  tag: string;
  color: StatColor;
  top: number;
  left: number;
}

interface SatelliteNode {
  id: string;
  label: string;
  parent: string;
  value: string;
  top: number;
  left: number;
}

const stats: PrimaryStat[] = [
  { label: "Community Members", value: 500, suffix: "+", tag: "MMBR", color: "green",  top: 15, left: 18 },
  { label: "Events Hosted",    value: 25,  suffix: "",  tag: "EVNT", color: "purple", top: 12, left: 55 },
  { label: "Projects Built",   value: 80,  suffix: "",  tag: "PROJ", color: "blue",   top: 42, left: 35 },
  { label: "Bounties Completed", value: 150, suffix: "", tag: "BNTY", color: "gold",  top: 38, left: 72 },
  { label: "Community Reach",  value: 10,  suffix: "K+", tag: "RECH", color: "green", top: 65, left: 50 },
];

const satellites: SatelliteNode[] = [
  // MMBR
  { id: "DEV",   label: "Developers",  parent: "MMBR", value: "180", top: 8,  left: 10 },
  { id: "DSGN",  label: "Designers",   parent: "MMBR", value: "85",  top: 25, left: 8 },
  { id: "CMMGR", label: "Comm Mgrs",   parent: "MMBR", value: "60",  top: 22, left: 28 },
  // EVNT
  { id: "HACK",  label: "Hackathons",  parent: "EVNT", value: "8",   top: 5,  left: 45 },
  { id: "WKSHP", label: "Workshops",   parent: "EVNT", value: "12",  top: 5,  left: 65 },
  // PROJ
  { id: "DEFI",  label: "DeFi",        parent: "PROJ", value: "25",  top: 35, left: 22 },
  { id: "NFT",   label: "NFT/Gaming",  parent: "PROJ", value: "30",  top: 50, left: 23 },
  // BNTY
  { id: "COMP",  label: "Completed",   parent: "BNTY", value: "120", top: 30, left: 82 },
  { id: "ACTV",  label: "Active",      parent: "BNTY", value: "30",  top: 48, left: 85 },
  // RECH
  { id: "TWTR",  label: "Twitter",     parent: "RECH", value: "5K",  top: 72, left: 38 },
  { id: "DSCRD", label: "Discord",     parent: "RECH", value: "3K",  top: 72, left: 62 },
];

// Primary-to-primary connections
const primaryConnections: [string, string][] = [
  ["MMBR", "PROJ"], ["EVNT", "PROJ"], ["PROJ", "BNTY"], ["PROJ", "RECH"], ["BNTY", "RECH"],
];

// Parent-to-satellite connections
const satelliteConnections: [string, string][] = [
  ["MMBR", "DEV"], ["MMBR", "DSGN"], ["MMBR", "CMMGR"],
  ["EVNT", "HACK"], ["EVNT", "WKSHP"],
  ["PROJ", "DEFI"], ["PROJ", "NFT"],
  ["BNTY", "COMP"], ["BNTY", "ACTV"],
  ["RECH", "TWTR"], ["RECH", "DSCRD"],
];

const milestones = [
  { label: "Founded 2023", done: true },
  { label: "100 Members",  done: true },
  { label: "First Hackathon", done: true },
  { label: "25+ Events",   done: true },
  { label: "500+ Community", done: false },
];

// ─── Helper: find node center by tag/id ──────────────────

function nodeCenter(tag: string): { x: number; y: number } {
  const p = stats.find((s) => s.tag === tag);
  if (p) return { x: p.left, y: p.top };
  const s = satellites.find((n) => n.id === tag);
  if (s) return { x: s.left, y: s.top };
  return { x: 50, y: 50 };
}

// ─── TabBar ──────────────────────────────────────────────

function TabBar({ mode, onSwitch }: { mode: "overview" | "matrix"; onSwitch: (m: "overview" | "matrix") => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="flex items-center gap-1 mb-8 font-mono text-[0.65rem] tracking-[0.1em]"
    >
      <button
        onClick={() => onSwitch("overview")}
        className={cn(
          "px-3 py-1.5 border transition-colors duration-200 cursor-pointer",
          mode === "overview"
            ? "border-sol-green/40 text-sol-green bg-sol-green/5"
            : "border-border-dim text-text-secondary/50 hover:text-text-secondary hover:border-border-dim/80",
        )}
      >
        [{mode === "overview" ? "■" : "□"} OVERVIEW]
      </button>
      <button
        onClick={() => onSwitch("matrix")}
        className={cn(
          "px-3 py-1.5 border transition-colors duration-200 cursor-pointer",
          mode === "matrix"
            ? "border-sol-green/40 text-sol-green bg-sol-green/5"
            : "border-border-dim text-text-secondary/50 hover:text-text-secondary hover:border-border-dim/80",
        )}
      >
        [{mode === "matrix" ? "■" : "□"} MATRIX]
      </button>
      <span className="ml-4 text-text-secondary/30">// 03. Impact Matrix</span>
    </motion.div>
  );
}

// ─── StatsPanel (overview left side) ─────────────────────

function StatsPanel({ onSwitchToMatrix }: { onSwitchToMatrix: () => void }) {
  return (
    <div className="flex flex-col justify-center px-4 md:px-8 lg:px-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <SectionLabel number="03" label="Impact Matrix" />
        <h2 className="mt-4 font-display font-black text-3xl md:text-4xl tracking-tight">
          <span className="text-text-primary">Network </span>
          <span className="text-sol-green text-glow">Metrics</span>
        </h2>
        <p className="mt-2 font-mono text-[0.65rem] text-text-secondary/50 tracking-[0.1em]">
          // REAL-TIME COMMUNITY DATA — LAST SYNC: {new Date().toISOString().split("T")[0]}
        </p>
      </motion.div>

      {/* Stat rows */}
      <div className="space-y-3">
        {stats.map((stat, i) => {
          const c = colors[stat.color];
          return (
            <motion.div
              key={stat.tag}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-30px" }}
              className="flex items-center gap-3 group"
            >
              {/* Color dot */}
              <div className={cn("h-2 w-2 rounded-full shrink-0", c.bg)} />
              {/* Tag */}
              <span className={cn("font-mono text-[0.65rem] font-medium tracking-[0.2em] w-12 shrink-0", c.text)}>
                {stat.tag}
              </span>
              {/* Dashed rule */}
              <div className="flex-1 border-t border-dashed border-border-dim" />
              {/* Counter value */}
              <Counter
                end={stat.value}
                suffix={stat.suffix}
                className={cn("font-display font-black text-2xl tracking-tight", c.text)}
              />
            </motion.div>
          );
        })}
      </div>

      {/* CTA button */}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        viewport={{ once: true }}
        onClick={onSwitchToMatrix}
        className="mt-8 font-mono text-[0.65rem] text-sol-green/50 tracking-[0.1em] text-left cursor-pointer
                   hover:text-sol-green transition-colors duration-200 group"
      >
        {">"} <span className="group-hover:text-sol-green">execute matrix_scan_</span>
        <span className="cursor-blink ml-1">_</span>
      </motion.button>
    </div>
  );
}

// ─── 3D Logo Model ───────────────────────────────────────

const LOGO_GLB_PATH = "/models/solana_logo.glb";

function LogoModel() {
  const { scene } = useGLTF(LOGO_GLB_PATH);
  const ref = useRef<THREE.Group>(null);

  // Auto-rotate
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.4;
  });

  return (
    <group ref={ref}>
      <primitive object={scene} scale={1.5} />
    </group>
  );
}

function LogoFallback({ compact }: { compact?: boolean }) {
  return (
    <div className="relative flex flex-col items-center justify-center h-full">
      <div className={cn(
        "absolute rounded-full border border-dashed border-sol-green/15",
        compact ? "w-32 h-32 md:w-40 md:h-40" : "w-48 h-48 md:w-64 md:h-64",
      )} />
      <div className={cn(
        "relative border-2 border-dashed border-sol-green/25 rounded-xl flex items-center justify-center",
        compact ? "w-24 h-24 md:w-32 md:h-32" : "w-36 h-36 md:w-48 md:h-48",
      )}>
        <svg
          className={cn("spin-slow", compact ? "w-14 h-14 md:w-20 md:h-20" : "w-20 h-20 md:w-28 md:h-28")}
          viewBox="0 0 100 100"
          fill="none"
        >
          <path d="M50 5 L90 30 L50 55 L10 30 Z" stroke="rgba(0,255,163,0.4)" strokeWidth="1.5" fill="none" />
          <path d="M50 25 L90 50 L50 75 L10 50 Z" stroke="rgba(0,255,163,0.25)" strokeWidth="1" fill="none" />
          <path d="M50 45 L90 70 L50 95 L10 70 Z" stroke="rgba(0,255,163,0.15)" strokeWidth="1" fill="none" />
        </svg>
      </div>
      <div className={cn(
        "mt-6 font-mono text-text-secondary/40 tracking-[0.15em] text-center",
        compact ? "text-[0.45rem]" : "text-[0.55rem]",
      )}>
        // 3D_ASSET :: LOADING
      </div>
    </div>
  );
}

// Check once whether the GLB file exists
let _glbStatus: "unknown" | "found" | "missing" = "unknown";
let _glbPromise: Promise<void> | null = null;

function useLogoGLBAvailable() {
  const [available, setAvailable] = useState(_glbStatus === "found");

  useEffect(() => {
    if (_glbStatus === "found") { setAvailable(true); return; }
    if (_glbStatus === "missing") { setAvailable(false); return; }

    if (!_glbPromise) {
      _glbPromise = fetch(LOGO_GLB_PATH, { method: "HEAD" })
        .then((res) => { _glbStatus = res.ok ? "found" : "missing"; })
        .catch(() => { _glbStatus = "missing"; });
    }
    _glbPromise.then(() => setAvailable(_glbStatus === "found"));
  }, []);

  return available;
}

function Logo3DViewer({ compact }: { compact?: boolean }) {
  const glbAvailable = useLogoGLBAvailable();
  const size = compact ? "h-48 md:h-56" : "h-64 md:h-80";

  // If GLB doesn't exist, show SVG fallback
  if (!glbAvailable) return <LogoFallback compact={compact} />;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={cn("relative w-full flex flex-col items-center justify-center", size)}
    >
      {/* Dashed ring decoration */}
      <div className={cn(
        "absolute rounded-full border border-dashed border-sol-green/15 pointer-events-none",
        compact ? "w-40 h-40 md:w-48 md:h-48" : "w-56 h-56 md:w-72 md:h-72",
      )} />

      {/* R3F Canvas */}
      <div className={cn("relative", compact ? "w-40 h-40 md:w-48 md:h-48" : "w-56 h-56 md:w-64 md:h-64")}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[2, 2, 3]} intensity={1} color="#00FFA3" />
          <pointLight position={[-2, -1, 2]} intensity={0.4} color="#9945FF" />
          <Suspense fallback={null}>
            <LogoModel />
          </Suspense>
        </Canvas>
      </div>

      {/* Label */}
      <div className={cn(
        "mt-4 font-mono text-text-secondary/40 tracking-[0.15em] text-center",
        compact ? "text-[0.45rem]" : "text-[0.55rem]",
      )}>
        // SUPERTEAM_MY :: ACTIVE
      </div>
    </motion.div>
  );
}

// ─── StatNode (primary & satellite) ──────────────────────

function StatNode({
  tag,
  label,
  value,
  suffix,
  color,
  isPrimary,
  index,
  hoveredParent,
  onHover,
  parentTag,
}: {
  tag: string;
  label: string;
  value: number | string;
  suffix?: string;
  color: StatColor;
  isPrimary: boolean;
  index: number;
  hoveredParent: string | null;
  onHover: (tag: string | null) => void;
  parentTag?: string;
}) {
  const c = colors[color];

  // Dim logic: if something is hovered, dim nodes that aren't the hovered parent or its children
  const isActive =
    hoveredParent === null ||
    (isPrimary && hoveredParent === tag) ||
    (!isPrimary && hoveredParent === parentTag);

  const size = isPrimary ? "w-[72px] h-[72px] md:w-[80px] md:h-[80px]" : "w-[40px] h-[40px] md:w-[45px] md:h-[45px]";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: isPrimary ? 1 : 0.5, scale: 1 }}
      transition={{ duration: isPrimary ? 0.5 : 0.3, delay: isPrimary ? index * 0.15 : 0.5 + index * 0.08 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.1 }}
      onMouseEnter={() => isPrimary && onHover(tag)}
      onMouseLeave={() => isPrimary && onHover(null)}
      className={cn(
        "absolute rounded-full flex flex-col items-center justify-center cursor-default transition-opacity duration-200 z-10",
        size,
        isPrimary && "node-pulse",
        isActive ? "opacity-100" : "opacity-20",
      )}
      style={{
        border: `${isPrimary ? 2 : 1}px solid rgba(${c.rgb}, ${isPrimary ? 0.5 : 0.3})`,
        background: `radial-gradient(circle, rgba(${c.rgb}, 0.08) 0%, rgba(${c.rgb}, 0.02) 100%)`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <span
        className={cn(
          "font-mono font-medium tracking-[0.1em] leading-none",
          c.text,
          isPrimary ? "text-[0.55rem] md:text-[0.6rem]" : "text-[0.4rem] md:text-[0.45rem]",
        )}
      >
        {tag}
      </span>
      {isPrimary ? (
        <span className={cn("font-display font-black text-[0.7rem] md:text-xs leading-none mt-0.5", c.text)}>
          {typeof value === "number" ? <Counter end={value} suffix={suffix} className="" /> : `${value}${suffix || ""}`}
        </span>
      ) : (
        <span className="font-mono text-[0.4rem] text-text-secondary/60 leading-none mt-0.5">
          {value}
        </span>
      )}
    </motion.div>
  );
}

// ─── ConnectionLines SVG ─────────────────────────────────

function ConnectionLines({ hoveredParent }: { hoveredParent: string | null }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
      {/* Primary-to-primary: thicker dashed lines */}
      {primaryConnections.map(([from, to]) => {
        const a = nodeCenter(from);
        const b = nodeCenter(to);
        const active =
          hoveredParent === null || hoveredParent === from || hoveredParent === to;
        return (
          <motion.line
            key={`${from}-${to}`}
            x1={`${a.x}%`}
            y1={`${a.y}%`}
            x2={`${b.x}%`}
            y2={`${b.y}%`}
            stroke="rgba(0,255,163,0.2)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: active ? 1 : 0.15 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            viewport={{ once: true }}
          />
        );
      })}
      {/* Parent-to-satellite: thin solid lines */}
      {satelliteConnections.map(([from, to]) => {
        const a = nodeCenter(from);
        const b = nodeCenter(to);
        const parentStat = stats.find((s) => s.tag === from);
        const rgb = parentStat ? colors[parentStat.color].rgb : "0,255,163";
        const active = hoveredParent === null || hoveredParent === from;
        return (
          <motion.line
            key={`${from}-${to}`}
            x1={`${a.x}%`}
            y1={`${a.y}%`}
            x2={`${b.x}%`}
            y2={`${b.y}%`}
            stroke={`rgba(${rgb},0.15)`}
            strokeWidth="0.75"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: active ? 1 : 0.1 }}
            transition={{ duration: 1.2, delay: 0.7 }}
            viewport={{ once: true }}
          />
        );
      })}
    </svg>
  );
}

// ─── Grid Surface (floor background) ─────────────────────

function FloorGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main grid */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,163,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,163,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Fine sub-grid */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,163,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,163,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "15px 15px",
        }}
      />
      {/* Center radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,255,163,0.04) 0%, transparent 70%)",
        }}
      />
      {/* Fade edges */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, rgba(10,10,15,0.8) 0%, transparent 15%, transparent 85%, rgba(10,10,15,0.8) 100%),
            linear-gradient(90deg, rgba(10,10,15,0.6) 0%, transparent 10%, transparent 90%, rgba(10,10,15,0.6) 100%)
          `,
        }}
      />
      {/* Coordinate markers */}
      <div className="absolute top-2 left-2 font-mono text-[0.45rem] text-sol-green/15 tracking-[0.1em]">
        X:0.00 Y:0.00
      </div>
      <div className="absolute top-2 right-2 font-mono text-[0.45rem] text-sol-green/15 tracking-[0.1em]">
        X:1.00 Y:0.00
      </div>
      <div className="absolute bottom-2 left-2 font-mono text-[0.45rem] text-sol-green/15 tracking-[0.1em]">
        X:0.00 Y:1.00
      </div>
      <div className="absolute bottom-2 right-2 font-mono text-[0.45rem] text-sol-green/15 tracking-[0.1em]">
        X:1.00 Y:1.00
      </div>
    </div>
  );
}

// ─── ProgressionTrack (static — all milestones shown) ────

function ProgressionTrack() {
  return (
    <div className="absolute bottom-4 left-4 right-4 z-20">
      <div className="relative flex items-center justify-between">
        {/* Background line */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-border-dim" />
        {/* Static fill line — fills up to last "done" milestone */}
        <div
          className="absolute left-0 top-1/2 h-px bg-sol-green/40"
          style={{ width: `${((milestones.filter((m) => m.done).length - 1) / (milestones.length - 1)) * 100}%` }}
        />
        {/* Milestone dots */}
        {milestones.map((m) => (
          <div key={m.label} className="relative z-10 flex flex-col items-center">
            <div
              className={cn(
                "w-2.5 h-2.5 rounded-full border",
                m.done
                  ? "bg-sol-green/80 border-sol-green/60"
                  : "bg-transparent border-border-dim",
              )}
            />
            <span className="mt-1.5 font-mono text-[0.4rem] text-text-secondary/40 tracking-[0.05em] whitespace-nowrap">
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NodeGrid (tilted floor with all nodes) ──────────────

function NodeGrid() {
  const [hoveredParent, setHoveredParent] = useState<string | null>(null);

  // Build satellite color lookup from parent
  const satelliteColorMap = useMemo(() => {
    const map: Record<string, StatColor> = {};
    for (const sat of satellites) {
      const parent = stats.find((s) => s.tag === sat.parent);
      if (parent) map[sat.id] = parent.color;
    }
    return map;
  }, []);

  return (
    <div className="relative w-full h-full">
      <FloorGrid />
      <Crosshair position="top-left" />
      <Crosshair position="top-right" />
      <Crosshair position="bottom-left" />
      <Crosshair position="bottom-right" />

      {/* Connection lines */}
      <ConnectionLines hoveredParent={hoveredParent} />

      {/* Primary stat nodes */}
      {stats.map((stat, i) => (
        <div
          key={stat.tag}
          className="absolute"
          style={{ top: `${stat.top}%`, left: `${stat.left}%` }}
        >
          <StatNode
            tag={stat.tag}
            label={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            color={stat.color}
            isPrimary
            index={i}
            hoveredParent={hoveredParent}
            onHover={setHoveredParent}
          />
        </div>
      ))}

      {/* Satellite nodes */}
      {satellites.map((sat, i) => (
        <div
          key={sat.id}
          className="absolute"
          style={{ top: `${sat.top}%`, left: `${sat.left}%` }}
        >
          <StatNode
            tag={sat.id}
            label={sat.label}
            value={sat.value}
            color={satelliteColorMap[sat.id] || "green"}
            isPrimary={false}
            index={i}
            hoveredParent={hoveredParent}
            onHover={setHoveredParent}
            parentTag={sat.parent}
          />
        </div>
      ))}

      {/* Progression track */}
      <ProgressionTrack />
    </div>
  );
}

// ─── OverviewView ────────────────────────────────────────

function OverviewView({ onSwitchToMatrix }: { onSwitchToMatrix: () => void }) {
  return (
    <motion.div
      key="overview"
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.4, ease: "easeInOut" as const }}
      className="flex flex-col md:flex-row gap-8 md:gap-12 min-h-[500px]"
    >
      {/* Left: StatsPanel */}
      <div className="flex-1 md:w-1/2">
        <StatsPanel onSwitchToMatrix={onSwitchToMatrix} />
      </div>
      {/* Right: 3D Logo */}
      <div className="flex-1 md:w-1/2 flex items-center justify-center">
        <Logo3DViewer />
      </div>
    </motion.div>
  );
}

// ─── MatrixView ──────────────────────────────────────────

function MatrixView() {
  return (
    <motion.div
      key="matrix"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.45, ease: "easeInOut" as const }}
      className="flex flex-col md:flex-row gap-8 min-h-[500px]"
    >
      {/* Left: compact 3D Logo */}
      <div className="hidden md:flex md:w-[30%] items-center justify-center">
        <Logo3DViewer compact />
      </div>
      {/* Right: NodeGrid with perspective tilt */}
      <div className="flex-1 md:w-[70%]">
        <div style={{ perspective: "1000px", width: "100%", height: "100%" }}>
          <div
            className="relative w-full h-full min-h-[500px]"
            style={{
              transform: "rotateX(30deg) scale(0.92)",
              transformOrigin: "center bottom",
              transformStyle: "preserve-3d",
            }}
          >
            <NodeGrid />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Mobile Fallback ─────────────────────────────────────

function MobileStats() {
  return (
    <section id="stats" className="relative py-20 px-4 overflow-hidden">
      <div className="mx-auto max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <SectionLabel number="03" label="Impact Matrix" />
          <h2 className="mt-4 font-display font-black text-2xl tracking-tight">
            <span className="text-text-primary">Network </span>
            <span className="text-sol-green text-glow">Metrics</span>
          </h2>
        </motion.div>

        {/* 2-column compact cards */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => {
            const c = colors[stat.color];
            return (
              <motion.div
                key={stat.tag}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true, margin: "-20px" }}
                className={cn(
                  "relative border bg-bg-panel/80 backdrop-blur-sm p-4",
                  c.border,
                  i === stats.length - 1 && stats.length % 2 !== 0 && "col-span-2",
                )}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <div className={cn("h-1.5 w-1.5 rounded-full", c.bg)} />
                  <span className={cn("font-mono text-[0.55rem] font-medium tracking-[0.2em]", c.text)}>
                    {stat.tag}
                  </span>
                </div>
                <Counter
                  end={stat.value}
                  suffix={stat.suffix}
                  className={cn("font-display font-black text-2xl tracking-tight", c.text)}
                />
                <div className="mt-1 font-mono text-[0.5rem] text-text-secondary/50 uppercase tracking-[0.05em]">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Simple summary */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-6 font-mono text-[0.5rem] text-text-secondary/30 tracking-[0.1em] text-center"
        >
          {">"} all metrics sourced from on-chain + community data // updated every epoch
        </motion.div>
      </div>
    </section>
  );
}

// ─── Main Section ────────────────────────────────────────

export default function StatsSection() {
  const [mode, setMode] = useState<"overview" | "matrix">("overview");
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) return <MobileStats />;

  return (
    <section id="stats" className="relative py-24 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <TabBar mode={mode} onSwitch={setMode} />
        <AnimatePresence mode="wait">
          {mode === "overview" ? (
            <OverviewView key="overview" onSwitchToMatrix={() => setMode("matrix")} />
          ) : (
            <MatrixView key="matrix" />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

