"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import LanguageSwap from "./LanguageSwap";
import SystemStatus from "./SystemStatus";
import GlassShatter from "@/components/effects/GlassShatter";
import MalaysiaMap from "./MalaysiaMap";

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
      setTimeout(() => setPhase(2), 1300),
    ];
    return () => timers.forEach(clearTimeout);
  }, [animate]);


  const ease = [0.16, 1, 0.3, 1] as const;

  // Parallax for community photo
  const imgRef = useRef(null);
  const { scrollYProgress: imgScroll } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(imgScroll, [0, 1], ["-15%", "15%"]);

  return (
    <section id="hero" className="relative overflow-x-clip" style={{ background: "#D0D0D8" }}>
      {/* Grey cover — sits on top of everything, drops away to reveal white bg */}
      <div className="fixed inset-0 overflow-hidden z-50 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{ background: "#B0B0B8" }}
          initial={{ y: "0%" }}
          animate={phase >= 1 ? { y: "100%" } : {}}
          transition={{ duration: 1.0, delay: 0, ease }}
        />
      </div>

      <div className="relative flex flex-col lg:flex-row">

        {/* ── Left column (scrollable) ── */}
        <div className="flex-1 flex flex-col">
          {/* Panel A — fills viewport height */}
          <div className="overflow-hidden min-h-[60vh] lg:min-h-[92vh]">
          <motion.div
            className="relative min-h-[60vh] lg:min-h-[92vh] overflow-hidden"
            style={{ background: "#00FFA3" }}
            initial={{ y: "-100%" }}
            animate={phase >= 1 ? { y: "0%" } : {}}
            transition={{ duration: 1.1, delay: 0, ease }}
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

            {/* Text container — centered-low, like Shift5 */}
            <div className="relative h-full flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 pt-24 lg:pt-[20vh]">
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

                {/* Malaysia map outline — Peninsular + East Malaysia */}
                <MalaysiaMap className="absolute right-4 lg:right-8 bottom-4 lg:bottom-8 w-[250px] lg:w-[500px] xl:w-[650px] opacity-[0.12]" />
              </div>
            </div>
          </motion.div>
          </div>

          {/* Community photo — desktop only, parallax */}
          <div ref={imgRef} className="hidden lg:block relative overflow-hidden">
            <motion.img
              src="/images/hero-bottom.jpg"
              alt="Superteam Malaysia community event"
              className="w-full h-auto scale-[1.3]"
              style={{ y: imgY }}
            />
          </div>

          {/* 3 pillar boxes — Shift5 style */}
          <div className="hidden lg:grid grid-cols-3">
            <div className="border-r border-border-dim p-12 lg:p-16 py-16 lg:py-24" style={{ background: "#D0D0D8" }}>
              <h4 className="font-display font-bold text-[#0A0A0F] text-2xl xl:text-3xl leading-tight mb-10">
                Build on Solana with Grants, Bounties & Support
              </h4>
              <p className="font-mono text-[#0A0A0F]/50 text-xs uppercase leading-relaxed">
                Builder support & mentorship program with direct access to grants, funding opportunities, and paid bounties for developers and creators.
              </p>
            </div>
            <div className="border-r border-border-dim p-12 lg:p-16 py-16 lg:py-24" style={{ background: "#D0D0D8" }}>
              <h4 className="font-display font-bold text-[#0A0A0F] text-2xl xl:text-3xl leading-tight mb-10">
                Learn Through Workshops & Hands-On Education
              </h4>
              <p className="font-mono text-[#0A0A0F]/50 text-xs uppercase leading-relaxed">
                Structured education pathways, intensive workshops, and one-on-one mentorship to accelerate your Solana development skills.
              </p>
            </div>
            <div className="p-12 lg:p-16 py-16 lg:py-24" style={{ background: "#D0D0D8" }}>
              <h4 className="font-display font-bold text-[#0A0A0F] text-2xl xl:text-3xl leading-tight mb-10">
                Connect at Events & Hackathons Across Malaysia
              </h4>
              <p className="font-mono text-[#0A0A0F]/50 text-xs uppercase leading-relaxed">
                Regular community events, hackathons, and ecosystem meetups connecting you to founders, investors, and builders across Southeast Asia.
              </p>
            </div>
          </div>

        </div>

        {/* ── Right sidebar (sticky) ── */}
        <div className="
          lg:w-[24%] lg:min-w-[280px] xl:min-w-[320px]
          flex flex-col
        ">
          {/* Panel C — static, blends with white overlay */}
          <div
            className="flex items-end p-6 lg:p-8 lg:pb-10 lg:h-[50vh]"
            style={{ background: "#D0D0D8" }}
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
          </div>

          {/* Sticky wrapper for D + G — sticks once Panel C scrolls away */}
          <div className="lg:sticky lg:top-0">
            {/* Panel D */}
            <div className="overflow-hidden lg:h-[50vh]">
            <motion.div
              className="bg-bg-terminal p-6 lg:p-8 border-t border-border-dim h-full"
              initial={{ y: "-100%" }}
              animate={phase >= 1 ? { y: "0%" } : {}}
              transition={{ duration: 1.0, delay: 0, ease }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={phase >= 2 ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {/* DEBUG LABEL */}
                <span className="px-2 py-0.5 bg-green-600 text-white font-mono text-[10px] rounded">
                  D — Community Status Panel
                </span>
                <h3 className="font-display font-bold text-lg xl:text-xl text-text-primary mb-5 mt-2">
                  Community Status
                </h3>
                <SystemStatus />
              </motion.div>
            </motion.div>
            </div>

            {/* Panel G */}
            <div className="overflow-hidden lg:h-[50vh]">
            <motion.a
              href="#mission"
              className="group relative p-6 lg:p-8 flex flex-col justify-between cursor-pointer overflow-hidden h-full"
              style={{ background: "#00FFA3" }}
              initial={{ y: "-100%" }}
              animate={phase >= 1 ? { y: "0%" } : {}}
              transition={{ duration: 1.0, delay: 0, ease }}
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
          </div>
          {/* Spacer — fills sidebar alongside 3 boxes with terminal bg so Panel G doesn't poke out */}
          <div className="hidden lg:block flex-1 bg-bg-terminal" />
        </div>

      </div>
    </section>
  );
}
