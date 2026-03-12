"use client";

import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScanlineOverlay from "@/components/effects/ScanlineOverlay";
import CinematicReveal from "./CinematicReveal";

const Room3D = lazy(() => import("./Room3D"));

interface EntryTransitionProps {
  onComplete: () => void;
  onReveal: () => void;
  siteRef: React.RefObject<HTMLDivElement | null>;
}

function MobileFallback({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-terminal"
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <ScanlineOverlay />

      <div className="relative z-20 flex flex-col items-center gap-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="h-24 w-24 rounded-lg bg-gradient-to-br from-sol-purple to-sol-green flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="h-14 w-14 text-white" fill="currentColor">
              <path d="M8 28.5L14 22.5H32L26 28.5H8Z" />
              <path d="M8 11.5L14 17.5H32L26 11.5H8Z" />
              <path d="M8 20L14 14H32L26 20H8Z" opacity="0.7" />
            </svg>
          </div>
          <div className="absolute -inset-4 rounded-xl bg-gradient-to-br from-sol-purple/20 to-sol-green/20 blur-xl -z-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center space-y-2"
        >
          <h2 className="font-display font-black text-2xl text-text-primary tracking-tight">
            TERMINAL<span className="text-sol-green">//</span>MY
          </h2>
          <p className="font-mono text-[0.65rem] text-text-secondary tracking-[0.15em]">
            SUPERTEAM MALAYSIA v1.0
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onEnter}
          className="mt-4 px-8 py-3 border border-sol-green/50 font-mono text-xs uppercase tracking-[0.15em] text-sol-green hover:bg-sol-green/10 hover:border-sol-green transition-all duration-300 cursor-pointer"
        >
          <span className="cursor-blink mr-2">▶</span>
          INITIALIZE TERMINAL
        </motion.button>
      </div>
    </motion.div>
  );
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050508]">
      <div className="text-center space-y-4">
        <div className="h-8 w-8 border-2 border-sol-green/30 border-t-sol-green rounded-full animate-spin mx-auto" />
        <p className="font-mono text-[0.6rem] text-text-secondary tracking-[0.2em] uppercase">
          Loading 3D Environment...
        </p>
      </div>
    </div>
  );
}

export default function EntryTransition({ onComplete, onReveal, siteRef }: EntryTransitionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
  }, []);

  const handleEnter = useCallback(() => {
    setExiting(true);
    // Don't call onComplete here — CinematicReveal will call it when done
  }, []);

  if (isMobile) {
    return (
      <AnimatePresence>
        <MobileFallback onEnter={handleEnter} />
      </AnimatePresence>
    );
  }

  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <Room3D onEnter={handleEnter} />
      </Suspense>
      {exiting && <CinematicReveal onComplete={onComplete} onReveal={onReveal} siteRef={siteRef} />}
    </>
  );
}
