"use client";

import { cn } from "@/lib/utils";

interface CrosshairProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}

export default function Crosshair({ position, className }: CrosshairProps) {
  return (
    <span
      className={cn(
        "absolute font-mono text-sol-green/30 text-xs select-none pointer-events-none",
        position === "top-left" && "top-2 left-2",
        position === "top-right" && "top-2 right-2",
        position === "bottom-left" && "bottom-2 left-2",
        position === "bottom-right" && "bottom-2 right-2",
        className
      )}
    >
      +
    </span>
  );
}
