"use client";

import { useState, useEffect, useRef } from "react";

interface CinematicRevealProps {
  onComplete: () => void;
}

// Scramble text — characters resolve left to right
function useScrambleText(target: string, active: boolean, duration = 1200) {
  const [text, setText] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

  useEffect(() => {
    if (!active) { setText(""); return; }
    const len = target.length;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      let result = "";
      for (let i = 0; i < len; i++) {
        if (target[i] === " ") { result += " "; continue; }
        const charProgress = (progress - i / len / 1.5) * 2.5;
        if (charProgress >= 1) {
          result += target[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setText(result);
      if (progress >= 1) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, target, duration]);

  return text;
}

export default function CinematicReveal({ onComplete }: CinematicRevealProps) {
  const [phase, setPhase] = useState<
    "slit" | "expand" | "textReveal" | "fadeOut" | "done"
  >("slit");
  const [expandProgress, setExpandProgress] = useState(0);
  const rafRef = useRef<number>(0);

  // The CRT screen is roughly centered when zoomed in.
  // Starting rect: ~40% width, ~50% height, centered
  const startW = 40;
  const startH = 50;

  // Phase 1: Vertical slit opens → expand
  useEffect(() => {
    if (phase !== "slit") return;
    const timer = setTimeout(() => setPhase("expand"), 500);
    return () => clearTimeout(timer);
  }, [phase]);

  // Phase 2: Expand from CRT screen rect to fullscreen
  useEffect(() => {
    if (phase !== "expand") return;
    const start = Date.now();
    const duration = 900;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - p, 3);
      setExpandProgress(eased);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPhase("textReveal");
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  // Phase 3: Text scramble → fade out
  useEffect(() => {
    if (phase !== "textReveal") return;
    const timer = setTimeout(() => setPhase("fadeOut"), 1400);
    return () => clearTimeout(timer);
  }, [phase]);

  // Phase 4: Fade out → done
  useEffect(() => {
    if (phase !== "fadeOut") return;
    const timer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 700);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  const scrambledTitle = useScrambleText(
    "SUPERTEAM MALAYSIA",
    phase === "textReveal" || phase === "fadeOut" || phase === "done",
    1000,
  );
  const scrambledSub = useScrambleText(
    "BUILDING ON SOLANA",
    phase === "textReveal" || phase === "fadeOut" || phase === "done",
    1200,
  );

  if (phase === "done") return null;

  // Interpolate from starting CRT rect to full viewport
  const w = startW + (100 - startW) * expandProgress;
  const h = startH + (100 - startH) * expandProgress;
  const x = (100 - w) / 2;
  const y = (100 - h) / 2;

  const showWindow = phase !== "slit";
  const showText = phase === "textReveal" || phase === "fadeOut";

  // Scanline opacity fades out as window expands
  const scanlineOpacity = Math.max(0, 1 - expandProgress * 1.5);

  return (
    <div className="fixed inset-0 z-[100]" style={{ background: "#050508" }}>
      {/* ── Slit: vertical crack from CRT screen center ── */}
      {phase === "slit" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            style={{
              width: 2,
              height: 0,
              background: "rgba(0,255,163,0.3)",
              boxShadow: "0 0 15px rgba(0,255,163,0.2)",
              animation: "slitOpen 0.4s ease-out forwards",
            }}
          />
        </div>
      )}

      {/* ── Expanding window from CRT rect to fullscreen ── */}
      {showWindow && (
        <div
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            width: `${w}%`,
            height: `${h}%`,
            overflow: "hidden",
            borderRadius: expandProgress < 0.9 ? `${(1 - expandProgress) * 12}px` : 0,
          }}
        >
          {/* Dark CRT-style background → transitions to site bg */}
          <div
            className="absolute inset-0"
            style={{
              background: expandProgress < 0.5
                ? "radial-gradient(ellipse at center, #0a1a0a 0%, #040a04 60%, #020402 100%)"
                : `linear-gradient(135deg, #0A0A0F 0%, #111118 50%, #0A0A0F 100%)`,
              transition: "background 0.5s",
            }}
          />

          {/* CRT scanlines (fade as window grows) */}
          {scanlineOpacity > 0 && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
                opacity: scanlineOpacity,
              }}
            />
          )}

          {/* CRT vignette (fades out) */}
          {scanlineOpacity > 0 && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: "inset 0 0 100px 40px rgba(0,0,0,0.5)",
                opacity: scanlineOpacity,
              }}
            />
          )}

          {/* Green glow in center during early expand */}
          {expandProgress < 0.6 && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(0,255,163,0.06) 0%, transparent 60%)",
                opacity: 1 - expandProgress * 2,
              }}
            />
          )}

          {/* Text content — scrambles in once expanded */}
          {showText && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              style={{
                opacity: phase === "fadeOut" ? 0 : 1,
                transition: "opacity 0.5s",
              }}
            >
              <h1
                className="font-display font-black text-[clamp(2rem,5vw,4.5rem)] leading-[0.95] tracking-tight text-text-primary text-center"
                style={{ textShadow: "0 0 30px rgba(0,255,163,0.15)" }}
              >
                {scrambledTitle}
              </h1>
              <p className="font-mono text-[0.65rem] text-sol-green/60 tracking-[0.3em] uppercase">
                {scrambledSub}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Fade out overlay ── */}
      {phase === "fadeOut" && (
        <div
          className="absolute inset-0"
          style={{
            background: "#0A0A0F",
            animation: "fadeIn 0.6s ease-in forwards",
          }}
        />
      )}

      <style jsx>{`
        @keyframes slitOpen {
          from { height: 0; opacity: 0; }
          to { height: 50%; opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
