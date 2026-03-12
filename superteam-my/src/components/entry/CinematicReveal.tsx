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

interface CrtRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

function getCrtRect(): CrtRect {
  const el = document.getElementById("crt-screen-content");
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (!el) {
    return { top: vh * 0.15, right: vw * 0.78, bottom: vh * 0.78, left: vw * 0.22 };
  }
  const rect = el.getBoundingClientRect();
  // Shrink inward slightly so the reveal stays inside the glass
  const pad = Math.min(vw, vh) * 0.015;
  return {
    top: rect.top + pad,
    right: rect.right - pad,
    bottom: rect.bottom - pad,
    left: rect.left + pad,
  };
}

function polyClip(l: number, t: number, r: number, b: number) {
  return `polygon(${l}px ${t}px, ${r}px ${t}px, ${r}px ${b}px, ${l}px ${b}px)`;
}

export default function CinematicReveal({ onComplete, onReveal, siteRef }: CinematicRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slitRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const onRevealRef = useRef(onReveal);
  const onCompleteRef = useRef(onComplete);
  onRevealRef.current = onReveal;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const siteEl = siteRef.current;
    if (!siteEl) return;

    let cancelled = false;
    const crt = getCrtRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const crtH = crt.bottom - crt.top;

    // Start fully clipped (zero-width polygon at left edge of CRT)
    siteEl.style.clipPath = polyClip(crt.left, crt.top, crt.left, crt.bottom);

    onRevealRef.current();

    // ── Wipe: right edge sweeps from crt.left → crt.right ──
    let wipeStart = 0;
    const wipeDuration = 800;

    const wipe = (now: number) => {
      if (cancelled) return;
      if (!wipeStart) wipeStart = now;
      const p = Math.min((now - wipeStart) / wipeDuration, 1);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

      const r = lerp(crt.left, crt.right, eased);
      siteEl.style.clipPath = polyClip(crt.left, crt.top, r, crt.bottom);

      // Slit line
      if (slitRef.current) {
        const show = r > crt.left + 2 && r < crt.right - 2;
        slitRef.current.style.display = show ? "block" : "none";
        slitRef.current.style.left = `${r}px`;
        slitRef.current.style.top = `${crt.top}px`;
        slitRef.current.style.height = `${crtH}px`;
      }
      // Glow trail
      if (glowRef.current) {
        const gw = vw * 0.04;
        const show = r > crt.left + gw && r < crt.right - 2;
        glowRef.current.style.display = show ? "block" : "none";
        glowRef.current.style.left = `${r - gw}px`;
        glowRef.current.style.top = `${crt.top}px`;
        glowRef.current.style.height = `${crtH}px`;
        glowRef.current.style.width = `${gw}px`;
      }

      if (p < 1) {
        requestAnimationFrame(wipe);
      } else {
        if (slitRef.current) slitRef.current.style.display = "none";
        if (glowRef.current) glowRef.current.style.display = "none";
        requestAnimationFrame(expand);
      }
    };

    // ── Expand: CRT rect → full viewport ──
    let expandStart = 0;
    const expandDuration = 600;

    const expand = (now: number) => {
      if (cancelled) return;
      if (!expandStart) expandStart = now;
      const p = Math.min((now - expandStart) / expandDuration, 1);
      const eased = 1 - Math.pow(1 - p, 3);

      const l = lerp(crt.left, 0, eased);
      const t = lerp(crt.top, 0, eased);
      const r = lerp(crt.right, vw, eased);
      const b = lerp(crt.bottom, vh, eased);

      siteEl.style.clipPath = polyClip(l, t, r, b);

      if (p < 1) {
        requestAnimationFrame(expand);
      } else {
        // Full viewport reached — remove clip-path
        siteEl.style.clipPath = "";
        if (containerRef.current) containerRef.current.style.display = "none";
        onCompleteRef.current();
      }
    };

    // Wait one frame for the onReveal re-render to paint, then start
    requestAnimationFrame(() => {
      if (!cancelled) requestAnimationFrame(wipe);
    });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[250] pointer-events-none">
      {/* Green wipe line */}
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
      />
      {/* Green glow trail */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          display: "none",
          background: "linear-gradient(to right, transparent, rgba(0,255,163,0.06))",
        }}
      />
    </div>
  );
}
