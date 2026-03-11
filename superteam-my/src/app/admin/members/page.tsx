"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

const MOCK_MEMBERS = [
  { id: "1", name: "Amir Razak", role: "Lead Developer", company: "Solana Labs", is_core_team: true, is_featured: true },
  { id: "2", name: "Wei Lin Chen", role: "Design Lead", company: "Tensor", is_core_team: true, is_featured: true },
  { id: "3", name: "Priya Krishnan", role: "Community Lead", company: "Superteam", is_core_team: true, is_featured: true },
  { id: "4", name: "Hafiz Ibrahim", role: "Smart Contract Dev", company: "Jupiter", is_core_team: false, is_featured: true },
  { id: "5", name: "Sarah Tan", role: "Content & Growth", company: "Marinade", is_core_team: false, is_featured: true },
];

export default function AdminMembers() {
  const [members] = useState(MOCK_MEMBERS);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Members</h1>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            // MANAGE TEAM MEMBERS
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-sol-green text-bg-terminal font-mono text-xs uppercase tracking-[0.1em] hover:bg-sol-green/90 transition-colors">
          <Plus size={14} />
          Add Member
        </button>
      </div>

      <div className="border border-border-dim bg-bg-panel overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-dim">
              <th className="px-4 py-3 text-left font-mono text-[0.6rem] uppercase tracking-[0.1em] text-text-secondary">Name</th>
              <th className="px-4 py-3 text-left font-mono text-[0.6rem] uppercase tracking-[0.1em] text-text-secondary">Role</th>
              <th className="px-4 py-3 text-left font-mono text-[0.6rem] uppercase tracking-[0.1em] text-text-secondary">Company</th>
              <th className="px-4 py-3 text-left font-mono text-[0.6rem] uppercase tracking-[0.1em] text-text-secondary">Status</th>
              <th className="px-4 py-3 text-right font-mono text-[0.6rem] uppercase tracking-[0.1em] text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-border-dim/50 hover:bg-bg-elevated/30 transition-colors">
                <td className="px-4 py-3 text-sm text-text-primary font-medium">{m.name}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{m.role}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{m.company}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {m.is_core_team && (
                      <span className="px-2 py-0.5 font-mono text-[0.55rem] bg-gold-accent/10 text-gold-accent border border-gold-accent/20">
                        CORE
                      </span>
                    )}
                    {m.is_featured && (
                      <span className="px-2 py-0.5 font-mono text-[0.55rem] bg-sol-green/10 text-sol-green border border-sol-green/20">
                        FEATURED
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-text-secondary hover:text-sol-green transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button className="p-1.5 text-text-secondary hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
