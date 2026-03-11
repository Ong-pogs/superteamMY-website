"use client";

import { cn } from "@/lib/utils";
import ScanlineOverlay from "@/components/effects/ScanlineOverlay";
import Crosshair from "@/components/effects/Crosshair";

interface CRTFrameProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  color?: "green" | "purple" | "blue" | "gold";
  showDots?: boolean;
}

const colorMap = {
  green: {
    border: "border-sol-green/20",
    glow: "shadow-[0_0_15px_rgba(0,255,163,0.1)]",
    dot: "bg-sol-green",
    title: "text-sol-green/60",
  },
  purple: {
    border: "border-sol-purple/20",
    glow: "shadow-[0_0_15px_rgba(153,69,255,0.1)]",
    dot: "bg-sol-purple",
    title: "text-sol-purple/60",
  },
  blue: {
    border: "border-sol-blue/20",
    glow: "shadow-[0_0_15px_rgba(20,241,149,0.1)]",
    dot: "bg-sol-blue",
    title: "text-sol-blue/60",
  },
  gold: {
    border: "border-gold-accent/20",
    glow: "shadow-[0_0_15px_rgba(255,184,0,0.1)]",
    dot: "bg-gold-accent",
    title: "text-gold-accent/60",
  },
};

export default function CRTFrame({
  children,
  className,
  title,
  color = "green",
  showDots = true,
}: CRTFrameProps) {
  const c = colorMap[color];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border-2 bg-bg-panel/80",
        c.border,
        c.glow,
        className
      )}
    >
      {/* Top bar */}
      {(title || showDots) && (
        <div className="flex items-center gap-2 border-b border-border-dim px-3 py-2">
          {showDots && (
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500/60" />
              <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
              <div className="h-2 w-2 rounded-full bg-green-500/60" />
            </div>
          )}
          {title && (
            <span className={cn("ml-2 font-mono text-[0.6rem] uppercase tracking-[0.15em]", c.title)}>
              {title}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative">
        {children}
        <ScanlineOverlay />
      </div>

      {/* Corner crosshairs */}
      <Crosshair position="top-left" />
      <Crosshair position="top-right" />
      <Crosshair position="bottom-left" />
      <Crosshair position="bottom-right" />
    </div>
  );
}
