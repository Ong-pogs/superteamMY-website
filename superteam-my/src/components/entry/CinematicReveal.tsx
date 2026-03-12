"use client";

import { useState, useEffect, useRef } from "react";

interface CinematicRevealProps {
  onComplete: () => void;
}

export default function CinematicReveal({ onComplete }: CinematicRevealProps) {
  const [phase, setPhase] = useState<"slit" | "expand" | "done">("slit");
  const [expandProgress, setExpandProgress] = useState(0);
  const rafRef = useRef<number>(0);

  // ── Phase: Vertical slit opens → expand ──
  useEffect(() => {
    if (phase !== "slit") return;
    const timer = setTimeout(() => setPhase("expand"), 500);
    return () => clearTimeout(timer);
  }, [phase]);

  // ── Phase: Expand from center to fullscreen → done ──
  useEffect(() => {
    if (phase !== "expand") return;
    const start = Date.now();
    const duration = 1000;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setExpandProgress(eased);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPhase("done");
        onComplete();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, onComplete]);

  if (phase === "done") return null;

  const showSlit = phase === "slit";
  const showExpand = phase === "expand";

  const startW = 4;
  const startH = 40;
  const w = showExpand ? startW + (100 - startW) * expandProgress : startW;
  const h = showExpand ? startH + (100 - startH) * expandProgress : startH;
  const x = (100 - w) / 2;
  const y = (100 - h) / 2;

  const scanlineOpacity = Math.max(0, 1 - expandProgress * 1.8);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">

      {/* ═══ LAYER 1: VERTICAL SLIT ═══ */}
      {showSlit && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            style={{
              width: 2,
              height: 0,
              background: "rgba(0,255,163,0.5)",
              boxShadow: "0 0 20px rgba(0,255,163,0.3), 0 0 60px rgba(0,255,163,0.1)",
              animation: "cinematic-slit-open 0.4s ease-out forwards",
            }}
          />
        </div>
      )}

      {/* ═══ LAYER 2: EXPANDING WINDOW ═══ */}
      {showExpand && (
        <div
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            width: `${w}%`,
            height: `${h}%`,
            overflow: "hidden",
            borderRadius: expandProgress < 0.95 ? `${(1 - expandProgress) * 8}px` : 0,
          }}
        >
          {/* LAYER 2A: BG GRADIENT */}
          <div
            className="absolute inset-0"
            style={{
              background: expandProgress < 0.3
                ? "radial-gradient(ellipse at center, #0a1a0a 0%, #040a04 60%, #020402 100%)"
                : `linear-gradient(135deg, #0A0A0F 0%, #111118 50%, #0A0A0F 100%)`,
              transition: "background 0.5s",
            }}
          />

          {/* LAYER 2B: CRT SCANLINES (fading) */}
          {scanlineOpacity > 0 && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
                opacity: scanlineOpacity,
              }}
            />
          )}

          {/* LAYER 2C: CRT VIGNETTE (fading) */}
          {scanlineOpacity > 0 && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: "inset 0 0 100px 40px rgba(0,0,0,0.5)",
                opacity: scanlineOpacity,
              }}
            />
          )}

          {/* LAYER 2D: GREEN CENTER GLOW */}
          {expandProgress < 0.5 && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(0,255,163,0.08) 0%, transparent 60%)",
                opacity: 1 - expandProgress * 2.5,
              }}
            />
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes cinematic-slit-open {
          from { height: 0; opacity: 0; }
          to { height: 55%; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
