"use client";

import { cn } from "@/lib/utils";
import BinaryStream from "@/components/effects/BinaryStream";

const statusItems = [
  { id: "01", label: "SOLANA MAINNET" },
  { id: "02", label: "VALIDATOR NODES" },
  { id: "03", label: "MEMBER DATABASE" },
  { id: "04", label: "BOUNTY ENGINE" },
  { id: "05", label: "EVENT SYSTEM" },
  { id: "06", label: "TREASURY VAULT" },
  { id: "07", label: "RPC ENDPOINT" },
  { id: "08", label: "DEVNET BRIDGE" },
  { id: "09", label: "GOVERNANCE DAO" },
  { id: "10", label: "COMMS RELAY" },
];

interface SystemStatusProps {
  className?: string;
}

export default function SystemStatus({ className }: SystemStatusProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-1.5">
        {statusItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between font-pixel text-[0.55rem] xl:text-[0.6rem]"
          >
            <div className="flex items-center gap-2">
              <span className="text-text-secondary/40">{item.id}.</span>
              <span className="text-text-secondary uppercase tracking-[0.12em]">
                {item.label}
              </span>
            </div>
            <div className="h-1.5 w-1.5 rounded-full bg-sol-green" />
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-border-dim">
        <BinaryStream lines={6} className="text-[0.55rem] leading-snug" />
      </div>
    </div>
  );
}
