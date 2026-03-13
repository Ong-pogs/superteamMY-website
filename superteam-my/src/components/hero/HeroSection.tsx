"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LanguageSwap from "./LanguageSwap";
import SystemStatus from "./SystemStatus";
import GlassShatter from "@/components/effects/GlassShatter";

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
    <section id="hero" className="relative overflow-x-clip bg-bg-terminal">
      <div className="flex flex-col lg:flex-row">

        {/* ── Left column (scrollable) ── */}
        <div className="flex-1 flex flex-col">
          {/* Panel A — fills viewport height */}
          <motion.div
            className="relative min-h-[60vh] lg:min-h-[92vh] overflow-hidden"
            style={{ background: "#00FFA3" }}
            initial={{ clipPath: "inset(0 100% 100% 0)" }}
            animate={phase >= 1 ? { clipPath: "inset(0 0% 0% 0)" } : {}}
            transition={{ duration: 0.8, ease }}
          >
            {/* Subtle noise texture */}
            <div className="noise-overlay absolute inset-0 opacity-[0.03]" />

            {/* DEBUG LABEL */}
            <div className="absolute top-2 left-2 z-50 px-2 py-0.5 bg-red-500 text-white font-mono text-[10px] rounded">
              A — Main Gradient Panel
            </div>

            {/* 3D Glass </> shatter effect — desktop only */}
            <div className="absolute right-8 top-8 w-[280px] h-[280px] z-10 hidden lg:block pointer-events-auto">
              <GlassShatter />
            </div>

            {/* Text container — positioned lower, like Shift5 */}
            <div className="relative h-full flex flex-col justify-end px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 pb-8 lg:pb-[5%] pt-24 lg:pt-0">
              {/* Text + subtitle wrapper for relative positioning */}
              <div className="relative">
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

                {/* Subtitle B — positioned to the right of "SUPER//", aligned with its top */}
                <motion.div
                  className="mt-4 max-w-[300px] lg:absolute lg:left-[52%] xl:left-[48%] lg:top-[0.2em] lg:mt-0 lg:max-w-[240px] xl:max-w-[280px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.35 }}
                >
                  {/* DEBUG LABEL */}
                  <span className="px-2 py-0.5 bg-orange-500 text-white font-mono text-[10px] rounded">
                    B — Subtitle
                  </span>
                  <p className="font-display text-sm xl:text-base text-[#0A0A0F]/50 leading-relaxed mt-1">
                    The Home for Solana Builders in Malaysia. Every Developer, Every Designer, Every Founder.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Community photo — desktop only */}
          <div className="hidden lg:block relative h-[50vh] overflow-hidden">
            <img
              src="/images/hero-bottom.jpg"
              alt="Superteam Malaysia community event"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>

          {/* 3 placeholder squares — desktop only */}
          <div className="hidden lg:grid grid-cols-3">
            <div className="aspect-square bg-sol-green/10 border border-border-dim flex items-center justify-center">
              <span className="font-mono text-text-secondary text-xs">01</span>
            </div>
            <div className="aspect-square bg-sol-purple/10 border border-border-dim flex items-center justify-center">
              <span className="font-mono text-text-secondary text-xs">02</span>
            </div>
            <div className="aspect-square bg-gold-accent/10 border border-border-dim flex items-center justify-center">
              <span className="font-mono text-text-secondary text-xs">03</span>
            </div>
          </div>

        </div>

        {/* ── Right sidebar (sticky) ── */}
        <div className="
          lg:w-[24%] lg:min-w-[280px] xl:min-w-[320px]
          flex flex-col
        ">
          {/* Panel C */}
          <motion.div
            className="flex items-end p-6 lg:p-8 lg:pb-10 lg:h-[50vh]"
            style={{ background: "#D0D0D8" }}
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
              {/* DEBUG LABEL */}
              <span className="px-2 py-0.5 bg-blue-500 text-white font-mono text-[10px] rounded">
                C — Description Panel
              </span>
              <p className="font-display text-base xl:text-lg text-[#0A0A0F]/80 leading-relaxed">
                Connecting developers, designers, and founders to power the Solana ecosystem in Southeast Asia.
              </p>

              <div className="flex flex-col gap-2">
                {/* DEBUG LABEL */}
                <span className="px-2 py-0.5 bg-purple-500 text-white font-mono text-[10px] rounded w-fit">
                  E — Language Swap
                </span>
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-[#0A0A0F]/15" />
                  <LanguageSwap className="font-display font-black text-xl xl:text-2xl !text-[#0A0A0F]" />
                  <div className="h-px flex-1 bg-[#0A0A0F]/15" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Sticky wrapper for D + G — sticks once Panel C scrolls away */}
          <div className="lg:sticky lg:top-0">
            {/* Panel D */}
            <motion.div
              className="bg-bg-terminal p-6 lg:p-8 border-t border-border-dim lg:h-[50vh]"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={phase >= 1 ? { clipPath: "inset(0 0 0 0)" } : {}}
              transition={{ duration: 0.7, delay: 0.22, ease }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={phase >= 2 ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {/* DEBUG LABEL */}
                <span className="px-2 py-0.5 bg-green-600 text-white font-mono text-[10px] rounded">
                  D — System Status Panel
                </span>
                <h3 className="font-display font-bold text-lg xl:text-xl text-text-primary mb-5 mt-2">
                  System Status
                </h3>
                <SystemStatus />
              </motion.div>
            </motion.div>

            {/* Panel G */}
            <motion.a
              href="#mission"
              className="group relative p-6 lg:p-8 flex flex-col justify-between cursor-pointer overflow-hidden lg:h-[50vh]"
              style={{ background: "#00FFA3" }}
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              animate={phase >= 1 ? { clipPath: "inset(0 0 0% 0)" } : {}}
              transition={{ duration: 0.6, delay: 0.35, ease }}
            >
              {/* DEBUG LABEL */}
              <span className="px-2 py-0.5 bg-yellow-500 text-black font-mono text-[10px] rounded w-fit">
                G — Bottom Row
              </span>

              {/* Arrow icon — top right */}
              <div className="flex justify-end">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  className="text-[#0A0A0F] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                >
                  <path
                    d="M14 34L34 14M34 14H18M34 14V30"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="square"
                  />
                </svg>
              </div>

              {/* Text — bottom */}
              <p className="font-display text-lg xl:text-xl text-[#0A0A0F]/80 leading-snug">
                Explore the community.
              </p>
            </motion.a>
          </div>
          {/* Spacer — fills sidebar alongside 3 boxes with terminal bg so Panel G doesn't poke out */}
          <div className="hidden lg:block flex-1 bg-bg-terminal" />
        </div>

      </div>
    </section>
  );
}
