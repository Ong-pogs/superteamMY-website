"use client";

import { cn } from "@/lib/utils";

interface SkillTagProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function SkillTag({ label, active, onClick, className }: SkillTagProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] border transition-all duration-200",
        active
          ? "border-sol-green/50 bg-sol-green/10 text-sol-green"
          : "border-border-dim bg-transparent text-text-secondary hover:border-border-active hover:text-text-primary",
        className
      )}
    >
      {label}
    </button>
  );
}
