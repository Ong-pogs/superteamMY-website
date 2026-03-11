"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LanguageSwap from "./LanguageSwap";
import SystemStatus from "./SystemStatus";
import Button from "@/components/ui/Button";
import GridOverlay from "@/components/effects/GridOverlay";

const bootLines = [
  "// INITIALIZING TERMINAL.MY...",
  "// CONNECTING TO SOLANA MAINNET...",
  "// LOADING MEMBER DATABASE...",
  '// STATUS: ONLINE — "Malaysia Boleh"',
];

export default function HeroSection() {
  const [bootComplete, setBootComplete] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    bootLines.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleLines(i + 1), 300 + i * 400)
      );
    });

    timers.push(setTimeout(() => setBootComplete(true), 300 + bootLines.length * 400 + 300));

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: "var(--gradient-hero)" }}
      />
      <GridOverlay />

      {/* Noise overlay */}
      <div className="noise-overlay absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 w-full">
        {/* Boot sequence */}
        {!bootComplete && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-bg-terminal">
            <div className="space-y-2 font-mono text-sm">
              {bootLines.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={
                    i === bootLines.length - 1
                      ? "text-sol-green text-glow"
                      : "text-text-secondary"
                  }
                >
                  {line}
                  {i === visibleLines - 1 && (
                    <span className="cursor-blink ml-1">▊</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Main hero content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: bootComplete ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center"
        >
          {/* Left — 60% */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-2">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={bootComplete ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-sol-green/60"
              >
                // SUPERTEAM MALAYSIA — TERMINAL // MY
              </motion.div>

              <motion.h1
                initial={{ y: 40, opacity: 0 }}
                animate={bootComplete ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="font-display font-black tracking-tight leading-[0.9]"
                style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)" }}
              >
                <span className="bg-gradient-to-r from-sol-purple via-text-primary to-sol-green bg-clip-text text-transparent">
                  SUPER
                </span>
                <br />
                <span className="bg-gradient-to-r from-sol-green via-text-primary to-sol-purple bg-clip-text text-transparent">
                  TEAM
                </span>
              </motion.h1>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={bootComplete ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="flex items-center gap-4"
              >
                <div className="h-px w-12 bg-sol-green/40" />
                <LanguageSwap className="font-display font-black text-4xl md:text-5xl lg:text-6xl" />
              </motion.div>
            </div>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={bootComplete ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg text-text-secondary max-w-lg leading-relaxed"
            >
              The home for Solana builders in Malaysia. Connecting developers,
              designers, and founders to shape the future of Web3.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={bootComplete ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Button variant="primary" size="lg">
                Join Community
              </Button>
              <Button variant="outline" size="lg">
                Explore Opportunities
              </Button>
            </motion.div>
          </div>

          {/* Right — 40% */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={bootComplete ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="lg:col-span-2"
          >
            <div className="border border-border-dim bg-bg-panel/50 p-6 space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-border-dim">
                <div className="h-1.5 w-1.5 rounded-full bg-sol-green pulse-glow" />
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-text-secondary">
                  OPERATIONAL — ALL SYSTEMS NOMINAL
                </span>
              </div>

              <SystemStatus />

              <div className="pt-4 border-t border-border-dim">
                <div className="font-mono text-[0.55rem] text-text-secondary/40 tracking-[0.1em]">
                  LAST SYNC: {new Date().toISOString().split("T")[0]} // SOLANA EPOCH 784
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={bootComplete ? { opacity: 1 } : {}}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[0.55rem] text-text-secondary tracking-[0.2em]">
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-6 w-px bg-sol-green/40"
        />
      </motion.div>
    </section>
  );
}
