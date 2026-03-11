"use client";

import { cn } from "@/lib/utils";

interface ScanlineOverlayProps {
  className?: string;
  withVignette?: boolean;
}

export default function ScanlineOverlay({ className, withVignette = true }: ScanlineOverlayProps) {
  return (
    <>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10",
          className
        )}
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
        }}
      />
      {withVignette && (
        <div
          className="pointer-events-none absolute inset-0 z-11"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
          }}
        />
      )}
    </>
  );
}
