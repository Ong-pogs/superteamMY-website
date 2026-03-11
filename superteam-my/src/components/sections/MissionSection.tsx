"use client";

import { motion } from "framer-motion";
import { Code2, BookOpen, Network, Palette, TrendingUp, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionLabel from "@/components/ui/SectionLabel";
import Crosshair from "@/components/effects/Crosshair";
import GridOverlay from "@/components/effects/GridOverlay";

const missionNodes = [
  {
    mod: "MOD.01",
    title: "Build",
    description: "Empower developers with tools, grants, and bounties on Solana",
    icon: Code2,
    color: "sol-green",
  },
  {
    mod: "MOD.02",
    title: "Learn",
    description: "Workshops, hackathons, and educational resources for all skill levels",
    icon: BookOpen,
    color: "sol-purple",
  },
  {
    mod: "MOD.03",
    title: "Connect",
    description: "Bridge builders with projects, VCs, and the global Solana ecosystem",
    icon: Network,
    color: "sol-blue",
  },
  {
    mod: "MOD.04",
    title: "Create",
    description: "Support designers, creators, and content producers in Web3",
    icon: Palette,
    color: "gold-accent",
  },
  {
    mod: "MOD.05",
    title: "Grow",
    description: "Accelerate startups and talent through mentorship and resources",
    icon: TrendingUp,
    color: "sol-green",
  },
  {
    mod: "MOD.06",
    title: "Ship",
    description: "Turn ideas into products with community support and funding",
    icon: Rocket,
    color: "sol-purple",
  },
];

// Skill-tree positions for the 6 nodes (grid row/col placements)
const nodePositions = [
  { row: 0, col: 0 },
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 },
  { row: 2, col: 0 },
  { row: 2, col: 1 },
];

// Connection lines between nodes: [fromIndex, toIndex]
const connections: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [3, 5],
  [4, 5],
];

function getNodeCenter(index: number) {
  const pos = nodePositions[index];
  // Each node card is roughly 240px wide, 160px tall, with gaps
  const x = pos.col * 280 + 120;
  const y = pos.row * 200 + 80;
  return { x, y };
}

function ConnectionLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 560 600"
      preserveAspectRatio="xMidYMid meet"
    >
      {connections.map(([from, to], i) => {
        const start = getNodeCenter(from);
        const end = getNodeCenter(to);
        return (
          <line
            key={i}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="rgba(0, 255, 163, 0.15)"
            strokeWidth="1"
            strokeDasharray="6 4"
          />
        );
      })}
      {/* Node junction dots */}
      {nodePositions.map((_, i) => {
        const center = getNodeCenter(i);
        return (
          <circle
            key={i}
            cx={center.x}
            cy={center.y}
            r="3"
            fill="rgba(0, 255, 163, 0.3)"
          />
        );
      })}
    </svg>
  );
}

function MissionNode({
  node,
  index,
}: {
  node: (typeof missionNodes)[0];
  index: number;
}) {
  const Icon = node.icon;
  const colorMap: Record<string, string> = {
    "sol-green": "text-sol-green border-sol-green/20 hover:border-sol-green/50",
    "sol-purple": "text-sol-purple border-sol-purple/20 hover:border-sol-purple/50",
    "sol-blue": "text-sol-blue border-sol-blue/20 hover:border-sol-blue/50",
    "gold-accent": "text-gold-accent border-gold-accent/20 hover:border-gold-accent/50",
  };
  const glowMap: Record<string, string> = {
    "sol-green": "hover:shadow-[0_0_20px_rgba(0,255,163,0.15)]",
    "sol-purple": "hover:shadow-[0_0_20px_rgba(153,69,255,0.15)]",
    "sol-blue": "hover:shadow-[0_0_20px_rgba(20,241,149,0.15)]",
    "gold-accent": "hover:shadow-[0_0_20px_rgba(255,184,0,0.15)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        "group relative border bg-bg-panel/80 p-5 transition-all duration-300",
        "hover:-translate-y-1",
        colorMap[node.color],
        glowMap[node.color]
      )}
    >
      <Crosshair position="top-right" />

      {/* Icon + mod label */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center border bg-bg-elevated/50",
            colorMap[node.color]?.split(" ").slice(0, 1).join(" ")
          )}
        >
          <Icon className={cn("h-4 w-4", `text-${node.color}`)} />
        </div>
        <span className="font-mono text-[0.6rem] tracking-[0.15em] text-text-secondary uppercase">
          {node.mod}
        </span>
      </div>

      {/* Title */}
      <h3
        className={cn(
          "font-display font-bold text-lg mb-1.5 transition-colors",
          `text-${node.color}`
        )}
      >
        {node.title}
      </h3>

      {/* Description */}
      <p className="font-mono text-xs text-text-secondary leading-relaxed">
        {node.description}
      </p>

      {/* Bottom accent line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 h-px w-0 transition-all duration-500 group-hover:w-full",
          `bg-${node.color}`
        )}
      />
    </motion.div>
  );
}

export default function MissionSection() {
  return (
    <section
      id="mission"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <GridOverlay />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <SectionLabel number="02" label="Mission Protocol" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left side: description text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 lg:sticky lg:top-32"
          >
            <h2 className="font-display font-black text-4xl md:text-5xl tracking-tight leading-tight">
              <span className="text-text-primary">The </span>
              <span className="text-sol-green text-glow">Mission</span>
              <br />
              <span className="text-text-primary">Protocol</span>
            </h2>

            <p className="text-text-secondary leading-relaxed max-w-md">
              Superteam Malaysia operates as a decentralized talent network,
              activating six core modules to accelerate the Solana ecosystem
              across Southeast Asia.
            </p>

            <p className="text-text-secondary leading-relaxed max-w-md">
              Each module represents a pillar of our community — from building
              on-chain infrastructure to shipping consumer products that bring
              Web3 to millions.
            </p>

            <div className="flex items-center gap-3 pt-4">
              <div className="h-1.5 w-1.5 rounded-full bg-sol-green pulse-glow" />
              <span className="font-mono text-[0.6rem] tracking-[0.15em] text-text-secondary uppercase">
                All modules operational
              </span>
            </div>

            {/* Decorative terminal block */}
            <div className="border border-border-dim bg-bg-terminal/50 p-4 font-mono text-[0.65rem] text-text-secondary/60 space-y-1 max-w-sm">
              <div>
                <span className="text-sol-green">$</span> superteam --region MY
                --status
              </div>
              <div className="text-sol-green/60">
                {">"} 6 modules loaded
              </div>
              <div className="text-sol-green/60">
                {">"} community: active
              </div>
              <div className="text-sol-green/60">
                {">"} network: solana-mainnet
              </div>
              <div>
                <span className="text-sol-green">$</span>
                <span className="cursor-blink ml-1">▊</span>
              </div>
            </div>
          </motion.div>

          {/* Right side: skill-tree layout */}
          <div className="relative">
            {/* SVG connection lines (hidden on mobile) */}
            <div className="hidden md:block">
              <ConnectionLines />
            </div>

            {/* Nodes grid */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {missionNodes.map((node, i) => (
                <MissionNode key={node.mod} node={node} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
