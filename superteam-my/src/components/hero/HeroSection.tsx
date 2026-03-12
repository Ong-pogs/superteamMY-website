"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LanguageSwap from "./LanguageSwap";
import SystemStatus from "./SystemStatus";

interface HeroSectionProps {
  animate?: boolean;
}

// Animation phases (no loading screen):
// 0 — Waiting (nothing visible)
// 1 — Color blocks expand into final layout
// 2 — Typography slides up, sidebar content fades in

export default function HeroSection({ animate = true }: HeroSectionProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 900),
    ];
    return () => timers.forEach(clearTimeout);
  }, [animate]);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section id="hero" className="relative h-auto lg:h-screen overflow-hidden bg-bg-terminal">
      {/* ── Main Hero Layout ── */}
      <div className="relative h-full flex flex-col lg:flex-row">
        {/* Left: Sol-green accent panel */}
        <motion.div
          className="relative flex-1 min-h-[60vh] lg:min-h-0 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #9945FF 0%, #14F195 100%)" }}
          initial={{ clipPath: "inset(0 100% 100% 0)" }}
          animate={phase >= 1 ? { clipPath: "inset(0 0% 0% 0)" } : {}}
          transition={{ duration: 0.8, ease }}
        >
          {/* Subtle noise texture */}
          <div className="noise-overlay absolute inset-0 opacity-[0.03]" />

          <div className="relative h-full flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 py-24 lg:py-0">
            {/* SUPER// — masked slide-up */}
            <div className="overflow-hidden">
              <motion.h1
                className="font-display font-black leading-[0.85] text-[#0A0A0F]"
                style={{ fontSize: "clamp(3.5rem, 13vw, 13rem)" }}
                initial={{ y: "110%" }}
                animate={phase >= 2 ? { y: "0%" } : {}}
                transition={{ duration: 0.8, ease }}
              >
                SUPER<span className="opacity-30">//</span>
              </motion.h1>
            </div>

            {/* TEAM — masked slide-up (staggered) */}
            <div className="overflow-hidden">
              <motion.h1
                className="font-display font-black leading-[0.85] text-[#0A0A0F]"
                style={{ fontSize: "clamp(3.5rem, 13vw, 13rem)" }}
                initial={{ y: "110%" }}
                animate={phase >= 2 ? { y: "0%" } : {}}
                transition={{ duration: 0.8, delay: 0.1, ease }}
              >
                TEAM
              </motion.h1>
            </div>

            {/* Subtitle — positioned right of big text on desktop */}
            <motion.div
              className="mt-6 max-w-[300px] lg:absolute lg:right-[6%] xl:right-[8%] lg:top-[30%] lg:mt-0 lg:max-w-[240px] xl:max-w-[260px]"
              initial={{ opacity: 0, y: 20 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <p className="font-display text-sm xl:text-base text-[#0A0A0F]/50 leading-relaxed">
                The Home for Solana Builders in Malaysia. Every Developer, Every Designer, Every Founder.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Right sidebar */}
        <div className="flex flex-col lg:w-[24%] lg:min-w-[280px] xl:min-w-[320px]">
          {/* Top: Description panel */}
          <motion.div
            className="flex-1 bg-bg-elevated flex items-center p-6 lg:p-8"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={phase >= 1 ? { clipPath: "inset(0 0 0 0)" } : {}}
            transition={{ duration: 0.7, delay: 0.12, ease }}
          >
            <motion.div
              className="space-y-6 w-full"
              initial={{ opacity: 0 }}
              animate={phase >= 2 ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="font-display text-base xl:text-lg text-text-primary leading-relaxed">
                Connecting developers, designers, and founders to power the Solana ecosystem in Southeast Asia.
              </p>

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-border-dim" />
                <LanguageSwap className="font-display font-black text-xl xl:text-2xl" />
                <div className="h-px flex-1 bg-border-dim" />
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom: System Status panel */}
          <motion.div
            className="bg-bg-terminal p-6 lg:p-8 border-t border-border-dim"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={phase >= 1 ? { clipPath: "inset(0 0 0 0)" } : {}}
            transition={{ duration: 0.7, delay: 0.22, ease }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={phase >= 2 ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="font-display font-bold text-lg xl:text-xl text-text-primary mb-5">
                System Status
              </h3>
              <SystemStatus />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={phase >= 2 ? { opacity: 1 } : {}}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[0.5rem] text-text-secondary/50 tracking-[0.2em]">
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-5 w-px bg-sol-green/30"
        />
      </motion.div>
    </section>
  );
}
