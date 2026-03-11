"use client";

import { Search } from "lucide-react";

interface MemberSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MemberSearch({ value, onChange }: MemberSearchProps) {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 border border-border-dim bg-bg-panel/50 px-4 py-3 focus-within:border-border-active transition-colors">
        <span className="font-mono text-xs text-sol-green/60">&gt;</span>
        <span className="font-mono text-xs text-text-secondary">search_operator:</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type to search..."
          className="flex-1 bg-transparent font-mono text-sm text-text-primary placeholder:text-text-secondary/30 outline-none"
        />
        <Search size={14} className="text-text-secondary" />
      </div>
    </div>
  );
}
