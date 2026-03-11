"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "green" | "purple" | "gold" | "dim";
  className?: string;
}

export default function Badge({ children, variant = "green", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.1em]",
        variant === "green" && "bg-sol-green/10 text-sol-green border border-sol-green/20",
        variant === "purple" && "bg-sol-purple/10 text-sol-purple border border-sol-purple/20",
        variant === "gold" && "bg-gold-accent/10 text-gold-accent border border-gold-accent/20",
        variant === "dim" && "bg-bg-elevated text-text-secondary border border-border-dim",
        className
      )}
    >
      {children}
    </span>
  );
}
