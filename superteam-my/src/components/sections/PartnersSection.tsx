"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import SectionLabel from "@/components/ui/SectionLabel";
import CRTFrame from "@/components/layout/CRTFrame";
import ScanlineOverlay from "@/components/effects/ScanlineOverlay";
import MonitorPyramid from "@/components/3d/MonitorPyramid";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// ─── Data ────────────────────────────────────────────────

interface Partner {
  id: string;
  name: string;
  category: string;
}

const MOCK_PARTNERS: Partner[] = [
  { id: "1", name: "Solana Foundation", category: "ecosystem" },
  { id: "2", name: "Jupiter", category: "defi" },
  { id: "3", name: "Tensor", category: "nft" },
  { id: "4", name: "Marinade", category: "defi" },
  { id: "5", name: "Helius", category: "infra" },
  { id: "6", name: "Phantom", category: "wallet" },
  { id: "7", name: "Jito", category: "defi" },
  { id: "8", name: "Squads", category: "infra" },
];

const CRT_COLORS: Array<"green" | "purple" | "blue" | "gold"> = [
  "green",
  "purple",
  "blue",
  "gold",
];

const GLOW_STYLES: Record<string, { text: string; glow: string; hoverGlow: string }> = {
  green: {
    text: "text-sol-green",
    glow: "drop-shadow-[0_0_8px_rgba(0,255,163,0.3)]",
    hoverGlow: "group-hover:drop-shadow-[0_0_20px_rgba(0,255,163,0.6)]",
  },
  purple: {
    text: "text-sol-purple",
    glow: "drop-shadow-[0_0_8px_rgba(153,69,255,0.3)]",
    hoverGlow: "group-hover:drop-shadow-[0_0_20px_rgba(153,69,255,0.6)]",
  },
  blue: {
    text: "text-sol-blue",
    glow: "drop-shadow-[0_0_8px_rgba(20,241,149,0.3)]",
    hoverGlow: "group-hover:drop-shadow-[0_0_20px_rgba(20,241,149,0.6)]",
  },
  gold: {
    text: "text-gold-accent",
    glow: "drop-shadow-[0_0_8px_rgba(255,184,0,0.3)]",
    hoverGlow: "group-hover:drop-shadow-[0_0_20px_rgba(255,184,0,0.6)]",
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  ecosystem: "Ecosystem",
  defi: "DeFi",
  nft: "NFT",
  infra: "Infrastructure",
  wallet: "Wallet",
};

// ─── Mobile Fallback (2D CRTFrame grid) ──────────────────

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function MobilePartners() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ staggerChildren: 0.1 }}
      className="grid grid-cols-2 gap-4"
    >
      {MOCK_PARTNERS.map((partner, index) => {
        const color = CRT_COLORS[index % CRT_COLORS.length];
        const glowStyle = GLOW_STYLES[color];

        return (
          <motion.div key={partner.id} variants={itemVariants}>
            <CRTFrame
              title={`CH-${String(index + 1).padStart(2, "0")}`}
              color={color}
              showDots={true}
            >
              <div className="relative flex flex-col items-center justify-center py-8 px-3 min-h-[120px] bg-bg-terminal/50">
                <div
                  className={cn(
                    "font-display text-sm font-black text-center tracking-tight",
                    glowStyle.text,
                    glowStyle.glow
                  )}
                >
                  {partner.name}
                </div>
                <div className="mt-2 font-mono text-[0.45rem] text-text-secondary/40 tracking-[0.15em] uppercase">
                  [{CATEGORY_LABELS[partner.category] || partner.category}]
                </div>
              </div>
            </CRTFrame>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ─── 3D Canvas Loading Fallback ──────────────────────────

function CanvasLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="font-mono text-[0.65rem] text-sol-green/40 tracking-[0.15em] animate-pulse">
        // LOADING_3D_MONITORS...
      </div>
    </div>
  );
}

// ─── Desktop 3D View ─────────────────────────────────────

function DesktopPartners() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-50px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" as const }}
      viewport={{ once: true, margin: "-80px" }}
      className="relative w-full mx-auto"
      style={{ aspectRatio: "16 / 9", maxHeight: "520px" }}
    >
      {/* R3F Canvas */}
      <Canvas
        camera={{ position: [0, 0.5, 3.5], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.NoToneMapping }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <MonitorPyramid visible={inView} />
        </Suspense>
      </Canvas>

      {/* Scanline overlay on top of Canvas */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <ScanlineOverlay />
      </div>

      {/* Loading fallback (hidden once in view) */}
      {!inView && <CanvasLoader />}
    </motion.div>
  );
}

// ─── Main Section ────────────────────────────────────────

export default function PartnersSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <section id="partners" className="relative py-24 px-6">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Section header */}
        <SectionLabel number="04" label="Network" />

        <div className="space-y-2">
          <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-text-primary">
            PARTNERS & ALLIES
          </h2>
          <p className="font-mono text-xs text-text-secondary tracking-[0.1em] uppercase">
            // Trusted protocols powering the Superteam MY network
          </p>
        </div>

        {/* 3D on desktop, 2D grid on mobile */}
        {isMobile ? <MobilePartners /> : <DesktopPartners />}

        {/* Bottom status bar */}
        <div className="flex items-center justify-between pt-4 border-t border-border-dim">
          <div className="font-mono text-[0.55rem] text-text-secondary/40 tracking-[0.15em] uppercase">
            {MOCK_PARTNERS.length} active connections // All channels operational
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-sol-green pulse-glow" />
            <span className="font-mono text-[0.55rem] text-sol-green/60 tracking-[0.15em] uppercase">
              Network Healthy
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
