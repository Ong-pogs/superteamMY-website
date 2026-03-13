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
  // Shrink inward generously so the reveal stays well inside the CRT glass
  const padX = rect.width * 0.08;
  const padY = rect.height * 0.08;
  return {
    top: rect.top + padY,
    right: rect.right - padX,
    bottom: rect.bottom - padY,
    left: rect.left + padX,
  };
}

function polyClip(l: number, t: number, r: number, b: number) {
  return `polygon(${l}px ${t}px, ${r}px ${t}px, ${r}px ${b}px, ${l}px ${b}px)`;
}

// ── Glitch bar helpers ──────────────────────────────────

const GLITCH_BAR_COUNT = 6;

interface GlitchBar {
  el: HTMLDivElement;
  nextTrigger: number;
  active: boolean;
}

function createGlitchBars(container: HTMLDivElement): GlitchBar[] {
  const bars: GlitchBar[] = [];
  for (let i = 0; i < GLITCH_BAR_COUNT; i++) {
    const el = document.createElement("div");
    el.style.cssText =
      "position:absolute;left:0;right:0;height:0;pointer-events:none;opacity:0;will-change:transform,opacity;";
    container.appendChild(el);
    bars.push({ el, nextTrigger: Math.random() * 300, active: false });
  }
  return bars;
}

function tickGlitchBars(
  bars: GlitchBar[],
  elapsed: number,
  crt: CrtRect,
  wipeProgress: number,
) {
  const crtH = crt.bottom - crt.top;
  const crtW = crt.right - crt.left;
  const intensity = Math.sin(wipeProgress * Math.PI); // strongest at mid-wipe

  for (const bar of bars) {
    if (elapsed < bar.nextTrigger) continue;

    if (!bar.active) {
      // Activate: random horizontal strip inside CRT area
      bar.active = true;
      const h = 2 + Math.random() * 6;
      const y = crt.top + Math.random() * crtH;
      const offsetX = (Math.random() - 0.5) * crtW * 0.15 * intensity;
      const isGreen = Math.random() > 0.5;

      bar.el.style.top = `${y}px`;
      bar.el.style.height = `${h}px`;
      bar.el.style.left = `${crt.left}px`;
      bar.el.style.width = `${crtW}px`;
      bar.el.style.transform = `translateX(${offsetX}px)`;
      bar.el.style.opacity = `${0.15 + Math.random() * 0.35}`;
      bar.el.style.background = isGreen
        ? `rgba(0,255,163,${0.08 + Math.random() * 0.12})`
        : `rgba(255,255,255,${0.04 + Math.random() * 0.08})`;
      bar.el.style.mixBlendMode = "screen";
      bar.nextTrigger = elapsed + 30 + Math.random() * 60; // visible for 30-90ms
    } else {
      // Deactivate
      bar.active = false;
      bar.el.style.opacity = "0";
      bar.nextTrigger = elapsed + 80 + Math.random() * 250; // pause before next glitch
    }
  }
}

function cleanupGlitchBars(bars: GlitchBar[]) {
  for (const bar of bars) {
    bar.el.remove();
  }
}

// ─────────────────────────────────────────────────────────

export default function CinematicReveal({ onComplete, onReveal, siteRef }: CinematicRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const slitRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const onRevealRef = useRef(onReveal);
  const onCompleteRef = useRef(onComplete);
  onRevealRef.current = onReveal;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const siteEl = siteRef.current;
    const containerEl = containerRef.current;
    if (!siteEl || !containerEl) return;

    let cancelled = false;
    const crt = getCrtRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const crtH = crt.bottom - crt.top;

    // Create glitch bars
    const glitchBars = createGlitchBars(containerEl);

    // Start fully clipped (zero-width polygon at left edge of CRT)
    siteEl.style.clipPath = polyClip(crt.left, crt.top, crt.left, crt.bottom);

    onRevealRef.current();

    // ── Wipe: right edge sweeps from crt.left → crt.right ──
    let wipeStart = 0;
    const wipeDuration = 1400;

    const wipe = (now: number) => {
      if (cancelled) return;
      if (!wipeStart) wipeStart = now;
      const elapsed = now - wipeStart;
      const p = Math.min(elapsed / wipeDuration, 1);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

      const r = lerp(crt.left, crt.right, eased);

      // Small horizontal jitter — CRT signal noise
      const jitter = p > 0.1 && p < 0.9
        ? (Math.random() - 0.5) * 1.5
        : 0;
      siteEl.style.clipPath = polyClip(crt.left + jitter, crt.top, r, crt.bottom);

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

      // Tick glitch bars
      tickGlitchBars(glitchBars, elapsed, crt, p);

      if (p < 1) {
        requestAnimationFrame(wipe);
      } else {
        if (slitRef.current) slitRef.current.style.display = "none";
        if (glowRef.current) glowRef.current.style.display = "none";
        cleanupGlitchBars(glitchBars);
        // Brief green flash before expand — CRT "lock" signal
        requestAnimationFrame(flash);
      }
    };

    // ── Flash: brief CRT signal flash between wipe and expand ──
    let flashStart = 0;
    const flashDuration = 150;

    const flash = (now: number) => {
      if (cancelled) return;
      if (!flashStart) flashStart = now;
      const p = Math.min((now - flashStart) / flashDuration, 1);

      if (flashRef.current) {
        // Sharp in, smooth out
        const opacity = p < 0.3
          ? p / 0.3
          : 1 - ((p - 0.3) / 0.7);
        flashRef.current.style.opacity = `${opacity * 0.25}`;
        flashRef.current.style.display = "block";
      }

      if (p < 1) {
        requestAnimationFrame(flash);
      } else {
        if (flashRef.current) flashRef.current.style.display = "none";
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
        if (containerEl) containerEl.style.display = "none";
        onCompleteRef.current();
      }
    };

    // Wait one frame for the onReveal re-render to paint, then start
    requestAnimationFrame(() => {
      if (!cancelled) requestAnimationFrame(wipe);
    });

    return () => { cancelled = true; cleanupGlitchBars(glitchBars); };
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
      {/* CRT signal flash — green burst between wipe and expand */}
      <div
        ref={flashRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "none",
          opacity: 0,
          background: "radial-gradient(ellipse at center, rgba(0,255,163,0.4) 0%, rgba(0,255,136,0.1) 50%, transparent 80%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
