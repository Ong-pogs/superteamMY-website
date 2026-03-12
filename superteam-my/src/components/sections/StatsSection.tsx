"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import SectionLabel from "@/components/ui/SectionLabel";
import Counter from "@/components/ui/Counter";
import Crosshair from "@/components/effects/Crosshair";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// ─── Data ────────────────────────────────────────────────

const stats = [
  { label: "Community Members", value: 500, suffix: "+", tag: "MMBR", color: "green" as const },
  { label: "Events Hosted", value: 25, suffix: "", tag: "EVNT", color: "purple" as const },
  { label: "Projects Built", value: 80, suffix: "", tag: "PROJ", color: "blue" as const },
  { label: "Bounties Completed", value: 150, suffix: "", tag: "BNTY", color: "gold" as const },
  { label: "Community Reach", value: 10, suffix: "K+", tag: "RECH", color: "green" as const },
];

type StatColor = (typeof stats)[number]["color"];

const colors: Record<StatColor, { text: string; bg: string; border: string; glow: string }> = {
  green:  { text: "text-sol-green",   bg: "bg-sol-green",   border: "border-sol-green/30",   glow: "hover:shadow-[0_0_20px_rgba(0,255,163,0.12)]" },
  purple: { text: "text-sol-purple",  bg: "bg-sol-purple",  border: "border-sol-purple/30",  glow: "hover:shadow-[0_0_20px_rgba(153,69,255,0.12)]" },
  blue:   { text: "text-sol-blue",    bg: "bg-sol-blue",    border: "border-sol-blue/30",    glow: "hover:shadow-[0_0_20px_rgba(20,241,149,0.12)]" },
  gold:   { text: "text-gold-accent", bg: "bg-gold-accent", border: "border-gold-accent/30", glow: "hover:shadow-[0_0_20px_rgba(255,184,0,0.12)]" },
};

// ─── Stat Card ───────────────────────────────────────────

function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const c = colors[stat.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        "relative border bg-bg-panel/80 backdrop-blur-sm p-5 md:p-6",
        "transition-all duration-300 hover:border-border-active",
        c.border, c.glow,
      )}
    >
      <Crosshair position="top-left" />
      <Crosshair position="bottom-right" />

      {/* Tag + index */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn("h-1.5 w-1.5 rounded-full", c.bg)} />
          <span className={cn("font-mono text-[0.6rem] font-medium tracking-[0.2em]", c.text)}>
            {stat.tag}
          </span>
        </div>
        <span className="font-mono text-[0.5rem] text-text-secondary/30">
          [{String(index + 1).padStart(2, "0")}]
        </span>
      </div>

      {/* Big counter */}
      <Counter
        end={stat.value}
        suffix={stat.suffix}
        className={cn("font-display font-black text-4xl md:text-5xl tracking-tight", c.text)}
      />

      {/* Label */}
      <div className="mt-3 font-mono text-[0.65rem] tracking-[0.08em] text-text-secondary uppercase">
        {stat.label}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1.2, delay: 0.3 + index * 0.15, ease: "easeOut" as const }}
          viewport={{ once: true }}
          className={cn("h-full", c.bg)}
          style={{ opacity: 0.6 }}
        />
      </div>
    </motion.div>
  );
}

// ─── Grid Surface Background ─────────────────────────────

function GridSurface() {
  return (
    <div className="absolute inset-0 -m-6 overflow-hidden pointer-events-none">
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

      {/* Fade edges so grid doesn't have hard cuts */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, rgba(10,10,15,1) 0%, transparent 15%, transparent 85%, rgba(10,10,15,1) 100%),
            linear-gradient(90deg, rgba(10,10,15,1) 0%, transparent 10%, transparent 90%, rgba(10,10,15,1) 100%)
          `,
        }}
      />
    </div>
  );
}

// ─── Decorative coordinate markers ───────────────────────

function CoordMarkers() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Top-left coordinate */}
      <div className="absolute top-0 left-0 font-mono text-[0.45rem] text-sol-green/15 tracking-[0.1em]">
        X:0.00 Y:0.00
      </div>
      {/* Top-right */}
      <div className="absolute top-0 right-0 font-mono text-[0.45rem] text-sol-green/15 tracking-[0.1em]">
        X:1.00 Y:0.00
      </div>
      {/* Bottom-left */}
      <div className="absolute bottom-0 left-0 font-mono text-[0.45rem] text-sol-green/15 tracking-[0.1em]">
        X:0.00 Y:1.00
      </div>
      {/* Bottom-right */}
      <div className="absolute bottom-0 right-0 font-mono text-[0.45rem] text-sol-green/15 tracking-[0.1em]">
        X:1.00 Y:1.00
      </div>

      {/* Dashed horizontal center line */}
      <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-sol-green/8" />
      {/* Dashed vertical center line */}
      <div className="absolute top-0 bottom-0 left-1/2 border-l border-dashed border-sol-green/8" />
    </div>
  );
}

// ─── Main Section ────────────────────────────────────────

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Tilt: flat → 40deg as you scroll through
  const rotateX = useTransform(scrollYProgress, [0.15, 0.6], [0, 40]);
  // Slight scale-down to enhance depth
  const scale = useTransform(scrollYProgress, [0.15, 0.6], [1, 0.92]);
  // Fade the surface slightly as it tilts away
  const surfaceOpacity = useTransform(scrollYProgress, [0.15, 0.7], [1, 0.7]);

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="relative py-24 md:py-36 overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section header — stays flat, outside perspective */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-14"
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

        {/* Perspective container */}
        <div style={{ perspective: isMobile ? "none" : "1200px" }}>
          {/* Tilting surface */}
          <motion.div
            style={{
              rotateX: isMobile ? 0 : rotateX,
              scale: isMobile ? 1 : scale,
              opacity: isMobile ? 1 : surfaceOpacity,
              transformOrigin: "center bottom",
              transformStyle: "preserve-3d" as const,
            }}
          >
            {/* Surface decorations */}
            <div className="relative p-6">
              <GridSurface />
              <CoordMarkers />

              {/* Row 1: 3 stat cards */}
              <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {stats.slice(0, 3).map((stat, i) => (
                  <StatCard key={stat.tag} stat={stat} index={i} />
                ))}
              </div>

              {/* Row 2: 2 stat cards, centered */}
              <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mt-4 md:mt-5 mx-auto max-w-[calc(66.666%+0.625rem)] lg:max-w-[calc(66.666%+0.625rem)]">
                {stats.slice(3).map((stat, i) => (
                  <StatCard key={stat.tag} stat={stat} index={i + 3} />
                ))}
              </div>

              {/* Terminal footer */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                viewport={{ once: true }}
                className="mt-8 font-mono text-[0.55rem] text-text-secondary/25 tracking-[0.1em] text-center"
              >
                {">"} all metrics sourced from on-chain + community data // updated every epoch
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
