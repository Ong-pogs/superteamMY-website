"use client";

import { useEffect, useState, useRef, ReactNode } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

/**
 * Authentic CRT monitor wrapper + overlay.
 *
 * Wraps page content and applies:
 *   1. Physical barrel distortion (border-radius + scale + overflow clip → black corners)
 *   2. Brief degauss wobble (magnetic interference shake)
 *   3. 14-layer overlay: scanlines, RGB phosphor sub-pixels, interlace, vignette,
 *      chromatic aberration, phosphor bloom, flicker, static noise, etc.
 *
 * Everything dissolves to a clean view over ~4.5s.
 */

interface CRTTransitionProps {
  active: boolean;
  children: ReactNode;
}

export default function CRTTransition({ active, children }: CRTTransitionProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [clipping, setClipping] = useState(false);
  const wrapControls = useAnimation();
  const noiseRef = useRef<HTMLCanvasElement>(null);

  // ── Noise canvas (TV static burst) ──
  useEffect(() => {
    if (!showOverlay) return;
    const canvas = noiseRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 280;
    canvas.height = 160;

    let frame = 0;
    let raf: number;
    const draw = () => {
      const img = ctx.createImageData(canvas.width, canvas.height);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 80;
        d[i] = v * 0.3;
        d[i + 1] = v;
        d[i + 2] = v * 0.3;
        d[i + 3] = 200;
      }
      ctx.putImageData(img, 0, 0);
      frame++;
      if (frame < 35) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [showOverlay]);

  // ── Warp animation sequence ──
  useEffect(() => {
    if (!active) return;

    setClipping(true);
    setShowOverlay(true);

    // Start with full barrel warp
    wrapControls.set({
      borderRadius: "22px",
      scale: 1.08,
    });

    // Gradually unwarp to flat screen
    const unwarp = setTimeout(() => {
      wrapControls.start({
        borderRadius: "0px",
        scale: 1,
        transition: { duration: 3.8, ease: [0.25, 0.1, 0.25, 1] },
      });
    }, 700);

    // Remove overlay
    const hideOverlay = setTimeout(() => setShowOverlay(false), 4500);

    // Remove overflow clipping after warp finishes
    const unclip = setTimeout(() => setClipping(false), 4800);

    return () => {
      clearTimeout(unwarp);
      clearTimeout(hideOverlay);
      clearTimeout(unclip);
    };
  }, [active, wrapControls]);

  return (
    <>
      {/* ═══ Content wrapper — applies physical barrel warp ═══ */}
      <motion.div
        animate={wrapControls}
        style={{
          overflow: clipping ? "hidden" : "visible",
          transformOrigin: "center center",
          willChange: clipping ? "transform, border-radius" : "auto",
        }}
      >
        {children}
      </motion.div>

      {/* ═══ Overlay effects ═══ */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="crt-overlays"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" as const }}
            className="pointer-events-none fixed inset-0 z-[100]"
          >
            {/* ── 1. RGB sub-pixel phosphor columns ──
                Real CRTs have vertical R-G-B phosphor triads */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0.55 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 3.4, ease: "easeOut" as const }}
              style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  rgba(255,0,0,0.07) 0px, rgba(255,0,0,0.07) 1px,
                  rgba(0,255,0,0.07) 1px, rgba(0,255,0,0.07) 2px,
                  rgba(0,100,255,0.07) 2px, rgba(0,100,255,0.07) 3px
                )`,
                backgroundSize: "3px 100%",
              }}
            />

            {/* ── 2. Thick primary scanlines ──
                Signature CRT horizontal dark bands */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 3.8, ease: "easeOut" as const }}
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent 0px, transparent 1px,
                  rgba(0,0,0,0.45) 1px, rgba(0,0,0,0.45) 2px,
                  transparent 2px, transparent 3px
                )`,
                backgroundSize: "100% 3px",
              }}
            />

            {/* ── 3. Fine secondary scanlines ──
                Sub-pixel frequency between main lines */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0.45 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 3.0, ease: "easeOut" as const }}
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent 0px, transparent 0.5px,
                  rgba(0,0,0,0.2) 0.5px, rgba(0,0,0,0.2) 1px
                )`,
                backgroundSize: "100% 1px",
              }}
            />

            {/* ── 4. Interlace shimmer ──
                Alternating field lines jitter like interlaced scanning */}
            <motion.div
              className="absolute inset-0 crt-interlace"
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 2.8, ease: "easeOut" as const }}
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  rgba(0,255,163,0.05) 0px, rgba(0,255,163,0.05) 2px,
                  transparent 2px, transparent 4px
                )`,
                backgroundSize: "100% 4px",
              }}
            />

            {/* ── 5. Green phosphor tint ──
                CRT monitors cast everything in a warm green */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0.45 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 3.2, ease: "easeIn" as const }}
              style={{
                background: "rgba(0,255,163,0.08)",
                mixBlendMode: "screen",
              }}
            />

            {/* ── 6. Phosphor bloom ──
                Center of screen glows brighter — phosphor bleed */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0.55 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 3.0, ease: "easeOut" as const }}
              style={{
                background: `radial-gradient(
                  ellipse 65% 55% at 50% 50%,
                  rgba(0,255,163,0.14) 0%,
                  rgba(0,255,163,0.05) 40%,
                  transparent 70%
                )`,
                mixBlendMode: "screen",
              }}
            />

            {/* ── 7. HEAVY barrel vignette — SOLID BLACK CORNERS ──
                The defining CRT look: completely dark at edges/corners,
                bright only in the center oval. Multiple layers for depth. */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 4.0, ease: "easeOut" as const }}
              style={{
                background: `radial-gradient(
                  ellipse 70% 65% at 50% 50%,
                  transparent 40%,
                  rgba(0,0,0,0.35) 55%,
                  rgba(0,0,0,0.7) 68%,
                  rgba(0,0,0,0.92) 80%,
                  rgba(0,0,0,1) 90%
                )`,
              }}
            />

            {/* ── 8. Corner blackout reinforcement ──
                Extra layer to make corners fully opaque black */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 3.6, ease: "easeOut" as const }}
              style={{
                background: `
                  radial-gradient(ellipse 60% 55% at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%),
                  linear-gradient(135deg, rgba(0,0,0,0.9) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.9) 100%),
                  linear-gradient(225deg, rgba(0,0,0,0.9) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.9) 100%)
                `,
              }}
            />

            {/* ── 9. Screen edge curvature shadows ──
                Deep inset shadow with border-radius to sell the curve */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0.85 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 3.5, ease: "easeOut" as const }}
              style={{
                borderRadius: "10% / 8%",
                boxShadow: `
                  inset 0 0 150px 80px rgba(0,0,0,0.75),
                  inset 0 0 350px 120px rgba(0,0,0,0.4),
                  inset 0 0 30px 15px rgba(0,0,0,0.95)
                `,
              }}
            />

            {/* ── 10. Screen bezel edge glow ──
                Faint green ring at the "glass edge" of the CRT tube */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: "easeOut" as const }}
              style={{
                borderRadius: "8% / 6%",
                boxShadow: `
                  inset 0 0 40px 3px rgba(0,255,163,0.12),
                  inset 0 0 80px 6px rgba(0,255,163,0.06)
                `,
              }}
            />

            {/* ── 11. CRT flicker ──
                Rapid refresh-rate brightness wobble */}
            <motion.div
              className="absolute inset-0 crt-entry-flicker"
              initial={{ opacity: 0.25 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 2.8, ease: "easeOut" as const }}
              style={{ background: "rgba(0,255,163,0.05)" }}
            />

            {/* ── 12. Static noise burst (canvas) ──
                Brief TV static when the screen first "turns on" */}
            <motion.canvas
              ref={noiseRef}
              className="absolute inset-0 w-full h-full"
              style={{ imageRendering: "pixelated" }}
              initial={{ opacity: 0.55 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" as const }}
            />

            {/* ── 13. Chromatic aberration fringe ──
                Color separation at screen edges */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: "easeOut" as const }}
              style={{
                background: `
                  linear-gradient(90deg,  rgba(255,0,50,0.07) 0%, transparent 4%, transparent 96%, rgba(0,80,255,0.07) 100%),
                  linear-gradient(180deg, rgba(255,0,50,0.04) 0%, transparent 4%, transparent 96%, rgba(0,80,255,0.04) 100%)
                `,
              }}
            />

            {/* ── 14. Phosphor persistence / ghosting ──
                Faint bright afterimage — CRT phosphors persist briefly */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1.8, delay: 0.2, ease: "easeOut" as const }}
              style={{
                background: `radial-gradient(
                  ellipse 50% 40% at 50% 45%,
                  rgba(0,255,163,0.1) 0%, transparent 100%
                )`,
                filter: "blur(25px)",
              }}
            />

            {/* ── 15. Top/bottom/side phosphor edge glow ── */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 2.8, ease: "easeOut" as const }}
              style={{
                background: `
                  linear-gradient(180deg,
                    rgba(0,255,163,0.07) 0%, transparent 8%,
                    transparent 92%, rgba(0,255,163,0.07) 100%
                  ),
                  linear-gradient(90deg,
                    rgba(0,255,163,0.05) 0%, transparent 6%,
                    transparent 94%, rgba(0,255,163,0.05) 100%
                  )
                `,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
