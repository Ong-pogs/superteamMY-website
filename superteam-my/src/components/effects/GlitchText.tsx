"use client";

import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
}

export default function GlitchText({ text, className, as: Tag = "span" }: GlitchTextProps) {
  return (
    <Tag className={cn("relative inline-block", className)}>
      <span className="relative z-10">{text}</span>
      <span
        aria-hidden
        className="absolute inset-0 z-0 text-sol-purple opacity-70"
        style={{ animation: "glitch-1 3s infinite linear alternate-reverse" }}
      >
        {text}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 z-0 text-sol-green opacity-70"
        style={{ animation: "glitch-2 3s infinite linear alternate-reverse" }}
      >
        {text}
      </span>
    </Tag>
  );
}
