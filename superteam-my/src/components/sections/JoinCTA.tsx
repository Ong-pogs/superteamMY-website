"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Send, Twitter } from "lucide-react";
import Button from "@/components/ui/Button";
import CRTFrame from "@/components/layout/CRTFrame";
import GridOverlay from "@/components/effects/GridOverlay";
import Crosshair from "@/components/effects/Crosshair";
import BinaryStream from "@/components/effects/BinaryStream";

/* ── data ───────────────────────────────────────────────── */

const WORDS = [
  { text: "BANGKIT", lang: "MALAY" },
  { text: "崛起", lang: "中文" },
  { text: "எழு", lang: "தமிழ்" },
  { text: "RISE", lang: "ENGLISH" },
];

const SOCIAL_LINKS = [
  { icon: Send, code: "TG", label: "Telegram", href: "#" },
  { icon: Twitter, code: "X", label: "Twitter/X", href: "#" },
];

const SLIDE_EASE = [0.16, 1, 0.3, 1] as const;

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░▐▌▄▀■◆●#$@&";

/* ── useGlitchText hook ──────────────────────────────────── */

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

/* ── main component ──────────────────────────────────────── */

export default function JoinCTA() {
  const [email, setEmail] = useState("");
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
      {/* ── background layers ──────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sol-purple/10 via-transparent to-sol-green/8" />
      <GridOverlay className="opacity-[0.02]" />

      {/* ── content ────────────────────────────────────── */}
      <div className="relative mx-auto max-w-7xl">
        {/* meta + brand */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0 }}
          className="mb-1 font-mono text-xs tracking-[0.3em] text-text-secondary/60"
        >
          EPISOD_01 / MMXXVI
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 font-mono text-sm tracking-[0.3em] text-text-secondary lg:mb-14"
        >
          SUPERTEAM // MY
        </motion.div>

        {/* ── split layout ─────────────────────────────── */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8 items-start">
          {/* LEFT — cycling word */}
          <div className="relative lg:col-span-7">
            <Crosshair position="top-left" />
            <Crosshair position="bottom-right" />

            {/* language label */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.lang}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" as const }}
                className="mb-2 font-mono text-xs tracking-[0.2em] text-sol-green"
              >
                [{current.lang}]
              </motion.div>
            </AnimatePresence>

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
              className="relative text-[clamp(3rem,8vw,7rem)] leading-[0.95]"
            >
              {/* Main text */}
              <div className="font-display font-black text-glow text-text-primary whitespace-nowrap">
                {display}
              </div>

              {/* Chromatic aberration — red offset */}
              <motion.div
                aria-hidden
                animate={{ opacity: isGlitching ? 0.4 : 0 }}
                transition={{ duration: 0.03 }}
                className="pointer-events-none absolute inset-0 font-display font-black text-red-500 whitespace-nowrap mix-blend-screen translate-x-[3px] translate-y-[-2px]"
              >
                {display}
              </motion.div>

              {/* Chromatic aberration — cyan offset */}
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

          {/* RIGHT — CRT panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" as const }}
            className="lg:col-span-5"
          >
            <CRTFrame color="green" title="COMM_CHANNEL // JOIN">
              <div className="space-y-5 p-5">
                <p className="font-mono text-sm leading-relaxed text-text-secondary">
                  Join the Superteam Malaysia community — builders, creators,
                  and operators pushing Solana forward in Southeast Asia.
                </p>

                <div className="h-px bg-border-dim" />

                {/* social links */}
                <div className="space-y-1">
                  {SOCIAL_LINKS.map((link, i) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -16 }}
                      animate={isInView ? { opacity: 1, x: 0 } : undefined}
                      transition={{
                        duration: 0.4,
                        delay: 0.7 + i * 0.1,
                        ease: "easeOut" as const,
                      }}
                      className={cn(
                        "group flex items-center justify-between py-2 px-2 -mx-2",
                        "font-mono text-xs uppercase tracking-wider text-text-secondary",
                        "transition-colors duration-200",
                        "hover:text-sol-green hover:bg-sol-green/5"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-text-secondary/50 group-hover:text-sol-green/70 transition-colors">
                          [{link.code}]
                        </span>
                        <link.icon className="h-3.5 w-3.5" />
                        <span>{link.label}</span>
                      </span>
                      <span className="text-text-secondary/30 group-hover:text-sol-green transition-colors">
                        →
                      </span>
                    </motion.a>
                  ))}
                </div>

                <div className="h-px bg-border-dim" />

                {/* terminal email input */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : undefined}
                  transition={{
                    duration: 0.5,
                    delay: 1.0,
                    ease: "easeOut" as const,
                  }}
                  className="space-y-3"
                >
                  <div className="font-mono text-xs text-sol-green/70">
                    &gt; enter_email:
                  </div>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@superteam.my"
                    className={cn(
                      "w-full border border-border-dim bg-bg-terminal/60 px-3 py-2.5",
                      "font-mono text-xs text-text-primary placeholder:text-text-secondary/40",
                      "outline-none transition-colors duration-200",
                      "focus:border-sol-green/40"
                    )}
                  />

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full rounded-none"
                  >
                    [ SUBSCRIBE ]
                  </Button>

                  <div className="font-mono text-[0.55rem] text-text-secondary/40 tracking-wider">
                    // NO SPAM. SIGNAL ONLY. UNSUBSCRIBE ANYTIME.
                  </div>
                </motion.div>

                <BinaryStream lines={3} interval={150} />
              </div>
            </CRTFrame>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
