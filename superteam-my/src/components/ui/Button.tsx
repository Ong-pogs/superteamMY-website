"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center font-mono text-xs uppercase tracking-[0.1em] transition-all duration-300",
        // Size
        size === "sm" && "px-4 py-2 text-[0.65rem]",
        size === "md" && "px-6 py-3",
        size === "lg" && "px-8 py-4 text-sm",
        // Variants
        variant === "primary" &&
          "bg-sol-green text-bg-terminal hover:bg-sol-green/90 hover:shadow-[0_0_20px_rgba(0,255,163,0.3)]",
        variant === "outline" &&
          "border border-sol-green/40 text-sol-green hover:bg-sol-green/10 hover:border-sol-green/70",
        variant === "ghost" &&
          "text-text-secondary hover:text-text-primary hover:bg-bg-elevated",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
