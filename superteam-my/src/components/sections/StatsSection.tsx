"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import SectionLabel from "@/components/ui/SectionLabel";
import Counter from "@/components/ui/Counter";
import TopographyBG from "@/components/effects/TopographyBG";
import Crosshair from "@/components/effects/Crosshair";

const stats = [
  {
    label: "Community Members",
    end: 500,
    suffix: "+",
    barWidth: "92%",
    color: "sol-green",
  },
  {
    label: "Events Hosted",
    end: 25,
    suffix: "",
    barWidth: "45%",
    color: "sol-purple",
  },
  {
    label: "Projects Supported",
    end: 80,
    suffix: "",
    barWidth: "65%",
    color: "sol-blue",
  },
  {
    label: "Bounties Completed",
    end: 150,
    suffix: "",
    barWidth: "78%",
    color: "gold-accent",
  },
  {
    label: "Community Reach",
    end: 10,
    suffix: "K+",
    barWidth: "88%",
    color: "sol-green",
  },
];

const barColorMap: Record<string, string> = {
  "sol-green": "bg-sol-green",
  "sol-purple": "bg-sol-purple",
  "sol-blue": "bg-sol-blue",
  "gold-accent": "bg-gold-accent",
};

const textColorMap: Record<string, string> = {
  "sol-green": "text-sol-green",
  "sol-purple": "text-sol-purple",
  "sol-blue": "text-sol-blue",
  "gold-accent": "text-gold-accent",
};

// Orbital data point labels
const orbitalPoints = [
  { label: "DeFi", angle: 0 },
  { label: "NFT", angle: 60 },
  { label: "DePIN", angle: 120 },
  { label: "Gaming", angle: 180 },
  { label: "DAO", angle: 240 },
  { label: "Infra", angle: 300 },
];

function StatCard({
  stat,
  index,
}: {
  stat: (typeof stats)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative border border-border-dim bg-bg-panel/60 p-5 group hover:border-border-active transition-colors duration-300"
    >
      <Crosshair position="top-left" />

      {/* Label */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[0.65rem] tracking-[0.12em] text-text-secondary uppercase">
          {stat.label}
        </span>
        <span className="font-mono text-[0.55rem] text-text-secondary/40">
          [{String(index + 1).padStart(2, "0")}]
        </span>
      </div>

      {/* Counter */}
      <Counter
        end={stat.end}
        suffix={stat.suffix}
        className={cn(
          "font-display font-black text-3xl tracking-tight",
          textColorMap[stat.color]
        )}
      />

      {/* Progress bar */}
      <div className="mt-4 h-1 w-full bg-bg-elevated rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: stat.barWidth }}
          transition={{ duration: 1.2, delay: 0.3 + index * 0.1, ease: "easeOut" }}
          viewport={{ once: true }}
          className={cn("h-full rounded-full", barColorMap[stat.color])}
        />
      </div>
    </motion.div>
  );
}

function CircularDisplay() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative flex items-center justify-center aspect-square max-w-[400px] mx-auto"
    >
      {/* Outer rotating dashed ring */}
      <div
        className="absolute inset-0 rounded-full border-2 border-dashed border-sol-green/20 animate-[spin_30s_linear_infinite]"
      />

      {/* Second ring */}
      <div
        className="absolute inset-6 rounded-full border border-dashed border-sol-purple/15 animate-[spin_45s_linear_infinite_reverse]"
      />

      {/* Inner static ring */}
      <div className="absolute inset-12 rounded-full border border-border-dim" />

      {/* Center glow */}
      <div className="absolute inset-16 rounded-full bg-gradient-to-br from-sol-green/5 to-sol-purple/5" />

      {/* Center content */}
      <div className="relative z-10 text-center">
        <div className="font-mono text-[0.55rem] tracking-[0.2em] text-text-secondary/50 uppercase mb-1">
          // Hub Status
        </div>
        <div className="font-display font-black text-xl tracking-tight text-text-primary">
          SUPERTEAM
        </div>
        <div className="font-display font-black text-2xl tracking-tight text-sol-green text-glow">
          MY
        </div>
        <div className="mt-2 flex items-center justify-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-sol-green pulse-glow" />
          <span className="font-mono text-[0.5rem] tracking-[0.15em] text-sol-green/70 uppercase">
            Online
          </span>
        </div>
      </div>

      {/* Orbital data points */}
      {orbitalPoints.map((point, i) => {
        const radius = 170;
        const angleRad = (point.angle * Math.PI) / 180;
        const x = Math.cos(angleRad) * radius;
        const y = Math.sin(angleRad) * radius;

        return (
          <motion.div
            key={point.label}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
            viewport={{ once: true }}
            className="absolute"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-sol-green/40 border border-sol-green/60" />
              <span className="font-mono text-[0.5rem] tracking-[0.1em] text-text-secondary/60 uppercase whitespace-nowrap">
                {point.label}
              </span>
            </div>
          </motion.div>
        );
      })}

    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section
      id="stats"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <TopographyBG />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <SectionLabel number="03" label="Network Metrics" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: stat cards */}
          <div className="space-y-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <h2 className="font-display font-black text-3xl md:text-4xl tracking-tight leading-tight mb-2">
                <span className="text-text-primary">Endfield </span>
                <span className="text-sol-purple text-glow-purple">Hub</span>
              </h2>
              <p className="font-mono text-xs text-text-secondary/60 tracking-wide">
                Real-time community metrics // Last updated: {new Date().toISOString().split("T")[0]}
              </p>
            </motion.div>

            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}

            {/* Footer terminal line */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
              className="pt-2 font-mono text-[0.55rem] text-text-secondary/30 tracking-[0.1em]"
            >
              {">"} all metrics sourced from on-chain + community data
            </motion.div>
          </div>

          {/* Right: circular display */}
          <div className="hidden lg:block">
            <CircularDisplay />
          </div>
        </div>
      </div>
    </section>
  );
}
