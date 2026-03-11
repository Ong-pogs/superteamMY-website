"use client";

import { Users, Calendar, Building2, TrendingUp } from "lucide-react";

const stats = [
  { label: "Members", value: "9", icon: Users, change: "+2 this month" },
  { label: "Events", value: "0", icon: Calendar, change: "Coming soon" },
  { label: "Partners", value: "8", icon: Building2, change: "+1 this month" },
  { label: "Page Views", value: "—", icon: TrendingUp, change: "Analytics pending" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="mt-1 font-mono text-xs text-text-secondary">
          // OVERVIEW — LAST UPDATED {new Date().toISOString().split("T")[0]}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-border-dim bg-bg-panel p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-text-secondary">
                {stat.label}
              </span>
              <stat.icon size={16} className="text-sol-green/60" />
            </div>
            <div className="font-display text-3xl font-bold text-text-primary">
              {stat.value}
            </div>
            <div className="font-mono text-[0.6rem] text-text-secondary">
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="border border-border-dim bg-bg-panel p-6">
        <h2 className="font-display text-lg font-bold text-text-primary mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="/admin/members"
            className="flex items-center gap-3 px-4 py-3 border border-border-dim hover:border-border-active transition-colors"
          >
            <Users size={16} className="text-sol-green" />
            <span className="text-sm text-text-primary">Manage Members</span>
          </a>
          <a
            href="/admin/partners"
            className="flex items-center gap-3 px-4 py-3 border border-border-dim hover:border-border-active transition-colors"
          >
            <Building2 size={16} className="text-sol-purple" />
            <span className="text-sm text-text-primary">Manage Partners</span>
          </a>
          <a
            href="/admin/content"
            className="flex items-center gap-3 px-4 py-3 border border-border-dim hover:border-border-active transition-colors"
          >
            <span className="text-sm text-text-primary">Edit Site Content</span>
          </a>
        </div>
      </div>
    </div>
  );
}
