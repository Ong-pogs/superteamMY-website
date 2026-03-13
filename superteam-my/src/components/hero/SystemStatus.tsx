"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const communityStats = [
  { label: "MEMBERS", value: 1247, suffix: "" },
  { label: "EVENTS HOSTED", value: 86, suffix: "" },
  { label: "PROJECTS BUILT", value: 142, suffix: "" },
  { label: "BOUNTIES COMPLETED", value: 318, suffix: "" },
  { label: "COMMUNITY REACH", value: 52, suffix: "K+" },
];

interface SystemStatusProps {
  className?: string;
}

function AnimatedCounter({
  end,
  suffix = "",
  duration = 1800,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    }

    requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function SystemStatus({ className }: SystemStatusProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {communityStats.map((stat) => (
        <div key={stat.label} className="flex items-center justify-between">
          <span className="font-pixel text-[0.55rem] xl:text-[0.6rem] text-text-secondary uppercase tracking-[0.12em]">
            {stat.label}
          </span>
          <span className="font-mono text-sm xl:text-base text-sol-green font-medium tabular-nums">
            <AnimatedCounter end={stat.value} suffix={stat.suffix} />
          </span>
        </div>
      ))}

      {/* Subtle divider + live pulse */}
      <div className="pt-3 border-t border-border-dim flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-sol-green animate-pulse" />
        <span className="font-pixel text-[0.5rem] text-text-secondary/50 uppercase tracking-[0.15em]">
          Live community data
        </span>
      </div>
    </div>
  );
}
