"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Send, Twitter } from "lucide-react";
import GridOverlay from "@/components/effects/GridOverlay";
import Crosshair from "@/components/effects/Crosshair";

/* -- data ------------------------------------------------ */

const WORDS = [
  { text: "BERINOVASI", lang: "MALAY" },
  { text: "\u521B\u65B0", lang: "\u4E2D\u6587" },
  { text: "\u0BAA\u0BC1\u0BA4\u0BC1\u0BAE\u0BC8", lang: "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD" },
  { text: "INNOVATE", lang: "ENGLISH" },
];

const SOCIAL_LINKS = [
  { icon: Send, label: "Telegram", href: "#" },
  { icon: Twitter, label: "Twitter / X", href: "#" },
];

const SLIDE_EASE = [0.16, 1, 0.3, 1] as const;

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\u2588\u2593\u2592\u2591\u2590\u258C\u2584\u2580\u25A0\u25C6\u25CF#$@&";

/* -- useGlitchText hook ---------------------------------- */

function useGlitchText(text: string, duration = 250) {
  const [display, setDisplay] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const rafRef = useRef<number>(0);
  const prevTextRef = useRef(text);

  const scramble = useCallback(
    (targetText: string) => {
      const target = targetText.split("");
      const len = target.length;
      const start = performance.now();
      setIsGlitching(true);

      function tick() {
        const elapsed = performance.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const resolved = Math.floor(progress * len);

        const result = target
          .map((char, i) => {
            if (i < resolved) return char;
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("");

        setDisplay(result);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplay(targetText);
          setIsGlitching(false);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [duration]
  );

  useEffect(() => {
    if (text === prevTextRef.current) {
      setDisplay(text);
      return;
    }
    prevTextRef.current = text;
    scramble(text);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, scramble]);

  return { display, isGlitching };
}

/* -- main component -------------------------------------- */

export default function JoinCTA() {
  const [wordIndex, setWordIndex] = useState(0);
  const [entranceDone, setEntranceDone] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const current = WORDS[wordIndex];
  const { display, isGlitching } = useGlitchText(current.text, 250);

  useEffect(() => {
    if (!isInView) return;
    const t = setTimeout(() => setEntranceDone(true), 1200);
    return () => clearTimeout(t);
  }, [isInView]);

  useEffect(() => {
    if (!entranceDone) return;
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [entranceDone]);

  return (
    <section
      id="join"
      ref={sectionRef}
      className="relative overflow-hidden bg-bg-terminal py-24 px-6 lg:py-32"
    >
      {/* -- background layers ----------------------------- */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sol-purple/10 via-transparent to-sol-green/8" />
      <GridOverlay className="opacity-[0.02]" />

      {/* -- content --------------------------------------- */}
      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8 items-start">
          {/* LEFT -- cycling word */}
          <div className="relative lg:col-span-7">
            <Crosshair position="top-left" />
            <Crosshair position="bottom-right" />

            {/* glitch word */}
            <motion.div
              animate={
                isGlitching
                  ? {
                      x: [0, -3, 5, -2, 4, 0],
                      skewX: [0, -1, 1.5, -0.5, 0],
                    }
                  : { x: 0, skewX: 0 }
              }
              transition={{ duration: 0.2, ease: "easeOut" as const }}
              className="relative text-[clamp(2.5rem,6vw,5rem)] leading-[0.95]"
            >
              {/* Main text */}
              <div className="font-display font-black text-glow text-text-primary whitespace-nowrap">
                {display}
              </div>

              {/* Chromatic aberration -- red offset */}
              <motion.div
                aria-hidden
                animate={{ opacity: isGlitching ? 0.4 : 0 }}
                transition={{ duration: 0.03 }}
                className="pointer-events-none absolute inset-0 font-display font-black text-red-500 whitespace-nowrap mix-blend-screen translate-x-[3px] translate-y-[-2px]"
              >
                {display}
              </motion.div>

              {/* Chromatic aberration -- cyan offset */}
              <motion.div
                aria-hidden
                animate={{ opacity: isGlitching ? 0.4 : 0 }}
                transition={{ duration: 0.03 }}
                className="pointer-events-none absolute inset-0 font-display font-black text-cyan-400 whitespace-nowrap mix-blend-screen -translate-x-[3px] translate-y-[2px]"
              >
                {display}
              </motion.div>

              {/* Horizontal glitch slices */}
              {isGlitching && (
                <>
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 font-display font-black text-text-primary whitespace-nowrap overflow-hidden"
                    style={{ clipPath: "inset(15% 0 65% 0)" }}
                    animate={{ x: [0, 8, -10, 5, 0] }}
                    transition={{ duration: 0.15, ease: "linear" as const }}
                  >
                    {display}
                  </motion.div>
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 font-display font-black text-text-primary whitespace-nowrap overflow-hidden"
                    style={{ clipPath: "inset(55% 0 20% 0)" }}
                    animate={{ x: [0, -8, 12, -6, 0] }}
                    transition={{ duration: 0.15, ease: "linear" as const }}
                  >
                    {display}
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* accent underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : undefined}
              transition={{ duration: 0.6, delay: 0.35, ease: SLIDE_EASE }}
              className="mt-4 h-[2px] origin-left bg-gradient-to-r from-sol-green via-sol-green/60 to-transparent"
            />
          </div>

          {/* RIGHT -- join panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" as const }}
            className="lg:col-span-5"
          >
            <div className="border border-border-dim bg-bg-panel/60 p-6 space-y-5">
              <h3 className="font-display text-xl font-bold text-text-primary">
                Join Us
              </h3>

              <p className="font-mono text-sm leading-relaxed text-text-secondary">
                Join the Superteam Malaysia community — builders, creators,
                and operators pushing Solana forward in Southeast Asia.
              </p>

              <div className="h-px bg-border-dim" />

              {/* social links */}
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : undefined}
                    transition={{
                      duration: 0.4,
                      delay: 0.7 + i * 0.1,
                      ease: "easeOut" as const,
                    }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 border border-border-dim",
                      "font-mono text-xs uppercase tracking-wider text-text-secondary",
                      "transition-colors duration-200",
                      "hover:text-sol-green hover:border-sol-green/40 hover:bg-sol-green/5"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
