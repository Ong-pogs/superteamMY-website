"use client";

import { cn } from "@/lib/utils";
import BinaryStream from "@/components/effects/BinaryStream";

const statusItems = [
  { id: "01", label: "NETWORK", value: "SOLANA MAINNET", status: "online" },
  { id: "02", label: "REGION", value: "MALAYSIA // MY", status: "online" },
  { id: "03", label: "MEMBERS", value: "500+ ACTIVE", status: "online" },
  { id: "04", label: "BOUNTIES", value: "150 COMPLETED", status: "online" },
  { id: "05", label: "EVENTS", value: "25 HOSTED", status: "online" },
  { id: "06", label: "STATUS", value: "OPERATIONAL", status: "online" },
];

interface SystemStatusProps {
  className?: string;
}

export default function SystemStatus({ className }: SystemStatusProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-text-secondary">
        // SYSTEM STATUS
      </div>

      <div className="space-y-2">
        {statusItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 font-mono text-[0.7rem]"
          >
            <span className="text-sol-green/40">{item.id}</span>
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                item.status === "online" ? "bg-sol-green pulse-glow" : "bg-red-500"
              )}
            />
            <span className="text-text-secondary w-20">{item.label}</span>
            <span className="text-text-primary">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-border-dim">
        <BinaryStream lines={4} />
      </div>
    </div>
  );
}
