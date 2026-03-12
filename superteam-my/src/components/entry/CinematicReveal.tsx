"use client";

import { useEffect, useRef } from "react";

interface CinematicRevealProps {
  onComplete: () => void;
  onReveal: () => void;
  siteRef: React.RefObject<HTMLDivElement | null>;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface CrtBounds {
  insetTop: number;
  insetRight: number;
  insetBottom: number;
  insetLeft: number;
}

// Padding in viewport % to shrink inward from measured edges
const PADDING = 1.5;

function getCrtBounds(): CrtBounds {
  const el = document.getElementById("crt-screen-content");
  if (!el) {
    return { insetTop: 15, insetRight: 22, insetBottom: 22, insetLeft: 22 };
  }
  const rect = el.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return {
    insetTop: (rect.top / vh) * 100 + PADDING,
    insetRight: ((vw - rect.right) / vw) * 100 + PADDING,
    insetBottom: ((vh - rect.bottom) / vh) * 100 + PADDING,
    insetLeft: (rect.left / vw) * 100 + PADDING,
  };
}

export default function CinematicReveal({ onComplete, onReveal, siteRef }: CinematicRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slitRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  // Store callbacks in refs so they don't cause re-runs
  const onRevealRef = useRef(onReveal);
  const onCompleteRef = useRef(onComplete);
  onRevealRef.current = onReveal;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const siteEl = siteRef.current;
    if (!siteEl) return;

    let cancelled = false;

    const bounds = getCrtBounds();

    siteEl.style.position = "fixed";
    siteEl.style.inset = "0";
    siteEl.style.zIndex = "200";
    siteEl.style.clipPath = `inset(${bounds.insetTop}% ${100 - bounds.insetLeft}% ${bounds.insetBottom}% ${bounds.insetLeft}%)`;

    onRevealRef.current();

    const crtTop = bounds.insetTop;
    const crtH = 100 - bounds.insetTop - bounds.insetBottom;
    const crtLeft = bounds.insetLeft;
    const crtRight = 100 - bounds.insetRight;

    // ── Wipe phase ──
    let wipeStart = 0;
    const wipeDuration = 800;

    const wipe = (now: number) => {
      if (cancelled) return;
      if (!wipeStart) wipeStart = now;
      const elapsed = now - wipeStart;
      const p = Math.min(elapsed / wipeDuration, 1);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

      const rightInset = lerp(100 - bounds.insetLeft, bounds.insetRight, eased);
      siteEl.style.clipPath = `inset(${bounds.insetTop}% ${rightInset}% ${bounds.insetBottom}% ${bounds.insetLeft}%)`;

      const slitX = 100 - rightInset;
      if (slitRef.current) {
        const visible = slitX > crtLeft + 0.5 && slitX < crtRight - 0.5;
        slitRef.current.style.display = visible ? "block" : "none";
        slitRef.current.style.left = `${slitX}%`;
        slitRef.current.style.top = `${crtTop}%`;
        slitRef.current.style.height = `${crtH}%`;
      }
      if (glowRef.current) {
        const visible = slitX > crtLeft + 2 && slitX < crtRight - 0.5;
        glowRef.current.style.display = visible ? "block" : "none";
        glowRef.current.style.left = `${Math.max(crtLeft, slitX - 5)}%`;
        glowRef.current.style.top = `${crtTop}%`;
        glowRef.current.style.height = `${crtH}%`;
      }

      if (p < 1) {
        requestAnimationFrame(wipe);
      } else {
        if (slitRef.current) slitRef.current.style.display = "none";
        if (glowRef.current) glowRef.current.style.display = "none";
        requestAnimationFrame(expand);
      }
    };

    // ── Expand phase ──
    let expandStart = 0;
    const expandDuration = 600;

    const expand = (now: number) => {
      if (cancelled) return;
      if (!expandStart) expandStart = now;
      const elapsed = now - expandStart;
      const p = Math.min(elapsed / expandDuration, 1);
      const eased = 1 - Math.pow(1 - p, 3);

      const t = lerp(bounds.insetTop, 0, eased);
      const r = lerp(bounds.insetRight, 0, eased);
      const b = lerp(bounds.insetBottom, 0, eased);
      const l = lerp(bounds.insetLeft, 0, eased);

      siteEl.style.clipPath = `inset(${t}% ${r}% ${b}% ${l}%)`;

      if (p < 1) {
        requestAnimationFrame(expand);
      } else {
        siteEl.style.position = "";
        siteEl.style.inset = "";
        siteEl.style.zIndex = "";
        siteEl.style.clipPath = "";
        if (containerRef.current) containerRef.current.style.display = "none";
        onCompleteRef.current();
      }
    };

    requestAnimationFrame(wipe);

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[250] pointer-events-none">

      {/* ── DEBUG: Phase indicator ── */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "4px 16px",
          background: "rgba(0,0,0,0.9)",
          color: "#ff0",
          fontSize: 14,
          fontFamily: "monospace",
          fontWeight: "bold",
          borderRadius: 4,
          zIndex: 99999,
          border: "2px solid #ff0",
        }}
      >
        CINEMATIC REVEAL
      </div>

      {/* ═══ GREEN WIPE LINE — positioned via ref, no React state ═══ */}
      <div
        ref={slitRef}
        style={{
          position: "absolute",
          display: "none",
          width: 2,
          background: "rgba(0,255,163,0.7)",
          boxShadow: "0 0 20px 6px rgba(0,255,163,0.35), 0 0 60px 12px rgba(0,255,163,0.15)",
          transform: "translateX(-50%)",
        }}
      >
        <div style={{ position: "absolute", top: 4, left: 8, padding: "2px 8px", background: "rgba(0,0,0,0.85)", color: "#00ff00", fontSize: 11, fontFamily: "monospace", fontWeight: "bold", borderRadius: 3, border: "1px solid #00ff00", whiteSpace: "nowrap" }}>
          SLIT LINE
        </div>
      </div>

      {/* ═══ GREEN GLOW TRAIL — positioned via ref, no React state ═══ */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          display: "none",
          width: "5%",
          background: "linear-gradient(to right, transparent, rgba(0,255,163,0.06))",
        }}
      >
        <div style={{ position: "absolute", top: 30, left: 8, padding: "2px 8px", background: "rgba(0,0,0,0.85)", color: "#00ff88", fontSize: 11, fontFamily: "monospace", fontWeight: "bold", borderRadius: 3, border: "1px solid #00ff88", whiteSpace: "nowrap" }}>
          GLOW TRAIL
        </div>
      </div>
    </div>
  );
}
