"use client";

import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/useActiveSection";

const sectionNames: Record<string, string> = {
  hero: "HOME",
  mission: "MISSION",
  stats: "STATS",
  members: "MEMBERS",
  partners: "PARTNERS",
  "wall-of-love": "FEED",
  faq: "FAQ",
  join: "JOIN",
};

export default function LeftRail() {
  const { activeSection, sections } = useActiveSection();

  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3 pl-4">
      {sections.map((id, i) => {
        const isActive = activeSection === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            className="group flex items-center gap-2"
            title={sectionNames[id]}
          >
            {/* Dot */}
            <div
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                isActive
                  ? "bg-sol-green shadow-[0_0_8px_rgba(0,255,163,0.5)] scale-125"
                  : "bg-border-dim group-hover:bg-text-secondary"
              )}
            />
            {/* Label — visible only when active */}
            <span
              className={cn(
                "font-mono text-[0.55rem] uppercase tracking-[0.15em] transition-all duration-300",
                isActive
                  ? "opacity-100 text-sol-green translate-x-0"
                  : "opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0 text-text-secondary"
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </a>
        );
      })}
    </div>
  );
}
