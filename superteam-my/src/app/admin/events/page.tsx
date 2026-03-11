"use client";

import { RefreshCw } from "lucide-react";

export default function AdminEvents() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Events</h1>
          <p className="mt-1 font-mono text-xs text-text-secondary">
            // MANAGE EVENTS & LUMA SYNC
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-sol-purple/40 text-sol-purple font-mono text-xs uppercase tracking-[0.1em] hover:bg-sol-purple/10 transition-colors">
          <RefreshCw size={14} />
          Sync from Luma
        </button>
      </div>

      <div className="border border-border-dim bg-bg-panel p-12 text-center">
        <div className="font-mono text-4xl text-text-secondary/20 mb-4">📅</div>
        <h3 className="font-display text-lg font-bold text-text-primary mb-2">No Events Yet</h3>
        <p className="font-mono text-xs text-text-secondary max-w-md mx-auto">
          Events will appear here once the Luma API integration is configured.
          Add your LUMA_API_KEY to .env.local to enable syncing.
        </p>
      </div>
    </div>
  );
}
