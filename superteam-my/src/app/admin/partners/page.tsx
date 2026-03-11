"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";

const MOCK_PARTNERS = [
  { id: "1", name: "Solana Foundation", category: "ecosystem", is_active: true },
  { id: "2", name: "Jupiter", category: "defi", is_active: true },
  { id: "3", name: "Tensor", category: "nft", is_active: true },
  { id: "4", name: "Marinade", category: "defi", is_active: true },
  { id: "5", name: "Helius", category: "infra", is_active: true },
  { id: "6", name: "Phantom", category: "wallet", is_active: true },
  { id: "7", name: "Jito", category: "defi", is_active: true },
  { id: "8", name: "Squads", category: "infra", is_active: true },
];

export default function AdminPartners() {
  const [partners] = useState(MOCK_PARTNERS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Partners</h1>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            // MANAGE ECOSYSTEM PARTNERS
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-sol-green text-bg-terminal font-mono text-xs uppercase tracking-[0.1em] hover:bg-sol-green/90 transition-colors">
          <Plus size={14} />
          Add Partner
        </button>
      </div>

      <div className="border border-border-dim bg-bg-panel overflow-hidden">
        <div className="divide-y divide-border-dim/50">
          {partners.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 px-4 py-3 hover:bg-bg-elevated/30 transition-colors"
            >
              <GripVertical size={14} className="text-text-secondary/30 cursor-grab" />
              <div className="flex-1">
                <span className="text-sm font-medium text-text-primary">{p.name}</span>
              </div>
              <span className="px-2 py-0.5 font-mono text-[0.55rem] uppercase bg-bg-elevated text-text-secondary border border-border-dim">
                {p.category}
              </span>
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-text-secondary hover:text-sol-green transition-colors">
                  <Pencil size={14} />
                </button>
                <button className="p-1.5 text-text-secondary hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
