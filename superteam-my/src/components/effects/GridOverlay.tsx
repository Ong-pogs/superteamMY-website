"use client";

import { cn } from "@/lib/utils";

interface GridOverlayProps {
  className?: string;
}

export default function GridOverlay({ className }: GridOverlayProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 z-0 opacity-[0.03]", className)}
      style={{
        backgroundImage:
          "radial-gradient(circle, #00FFA3 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }}
    />
  );
}
