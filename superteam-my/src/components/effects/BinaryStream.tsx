"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface BinaryStreamProps {
  lines?: number;
  className?: string;
}

function generateBinaryLine(): string {
  return Array.from({ length: 8 }, () => Math.round(Math.random()).toString())
    .join("") +
    " " +
    Array.from({ length: 8 }, () => Math.round(Math.random()).toString()).join("");
}

export default function BinaryStream({ lines = 6, className }: BinaryStreamProps) {
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    setData(Array.from({ length: lines }, () => generateBinaryLine()));

    const interval = setInterval(() => {
      setData(Array.from({ length: lines }, () => generateBinaryLine()));
    }, 2000);

    return () => clearInterval(interval);
  }, [lines]);

  return (
    <div className={cn("font-mono text-[0.65rem] text-sol-green/30 leading-relaxed overflow-hidden", className)}>
      {data.map((line, i) => (
        <div key={i} className="whitespace-nowrap">
          {line}
        </div>
      ))}
    </div>
  );
}
