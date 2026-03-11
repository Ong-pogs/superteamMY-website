"use client";

import { cn } from "@/lib/utils";

interface SectionLabelProps {
  number: string;
  label: string;
  className?: string;
}

export default function SectionLabel({ number, label, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-3 font-mono text-xs tracking-[0.1em] uppercase text-text-secondary", className)}>
      <span className="text-sol-green">//</span>
      <span className="text-sol-green">{number}.</span>
      <span>{label}</span>
      <div className="h-px flex-1 bg-border-dim" />
    </div>
  );
}
