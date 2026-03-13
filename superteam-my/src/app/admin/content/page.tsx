"use client";

import { useState } from "react";
import { Save } from "lucide-react";

const SECTIONS = ["hero", "stats", "faq"] as const;

const DEFAULT_CONTENT: Record<string, string> = {
  hero: JSON.stringify(
    {
      headline: "SUPERTEAM MALAYSIA",
      subheadline: "The home for Solana builders in Malaysia",
      cta_primary: "Join Community",
      cta_secondary: "Explore Opportunities",
    },
    null,
    2
  ),
  stats: JSON.stringify(
    { members: 500, events: 25, projects: 80, bounties: 150, reach: "10K+" },
    null,
    2
  ),
  faq: JSON.stringify(
    [
      {
        q: "What is Superteam Malaysia?",
        a: "Superteam Malaysia is the local chapter of the global Superteam network.",
      },
    ],
    null,
    2
  ),
};

export default function AdminContent() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [content, setContent] = useState(DEFAULT_CONTENT);

  const handleSave = () => {
    try {
      JSON.parse(content[activeSection]);
      alert("Content saved! (mock — Supabase integration pending)");
    } catch {
      alert("Invalid JSON. Please fix syntax errors.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">Site Content</h1>
        <p className="mt-1 font-mono text-xs text-text-secondary">
          // EDIT LANDING PAGE CONTENT (JSON)
        </p>
      </div>

      <div className="flex gap-2">
        {SECTIONS.map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] border transition-colors ${
              activeSection === section
                ? "border-sol-green/50 bg-sol-green/10 text-sol-green"
                : "border-border-dim text-text-secondary hover:border-border-active"
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      <div className="border border-border-dim bg-bg-panel">
        <div className="flex items-center justify-between border-b border-border-dim px-4 py-2">
          <span className="font-mono text-[0.6rem] text-text-secondary uppercase tracking-[0.1em]">
            // {activeSection}.json
          </span>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-1.5 bg-sol-green text-bg-terminal font-mono text-[0.6rem] uppercase tracking-[0.1em] hover:bg-sol-green/90 transition-colors"
          >
            <Save size={12} />
            Save
          </button>
        </div>
        <textarea
          value={content[activeSection]}
          onChange={(e) =>
            setContent({ ...content, [activeSection]: e.target.value })
          }
          className="w-full h-96 bg-bg-terminal p-4 font-mono text-sm text-text-primary outline-none resize-none"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
