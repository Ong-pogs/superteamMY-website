"use client";

import { cn } from "@/lib/utils";

interface TopographyBGProps {
  className?: string;
}

export default function TopographyBG({ className }: TopographyBGProps) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="topo" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
          <path
            d="M 20 100 Q 60 40 100 100 Q 140 160 180 100"
            fill="none"
            stroke="#00FFA3"
            strokeWidth="0.5"
          />
          <path
            d="M 0 60 Q 40 20 80 60 Q 120 100 160 60 Q 200 20 200 60"
            fill="none"
            stroke="#00FFA3"
            strokeWidth="0.5"
          />
          <path
            d="M 10 140 Q 50 100 90 140 Q 130 180 170 140"
            fill="none"
            stroke="#9945FF"
            strokeWidth="0.3"
          />
          <path
            d="M 40 180 Q 80 140 120 180 Q 160 200 200 180"
            fill="none"
            stroke="#00FFA3"
            strokeWidth="0.3"
          />
          {/* Subtle batik-inspired geometric diamond */}
          <path
            d="M 100 80 L 110 100 L 100 120 L 90 100 Z"
            fill="none"
            stroke="#FFB800"
            strokeWidth="0.3"
            opacity="0.3"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#topo)" />
    </svg>
  );
}
