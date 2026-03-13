"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionLabel from "@/components/ui/SectionLabel";
import CRTFrame from "@/components/layout/CRTFrame";
import Badge from "@/components/ui/Badge";
import Crosshair from "@/components/effects/Crosshair";
import type { Member } from "@/types/member";

const MOCK_MEMBERS: Member[] = [
  { id: "1", name: "Amir Razak", role: "Lead Developer", company: "Solana Labs", bio: "Full-stack Solana developer building the future of DeFi in Southeast Asia.", avatar_url: null, twitter_url: "https://x.com/example", skills: ["Rust", "TypeScript", "DeFi"], badges: ["Core Team", "OG"], achievements: [], is_featured: true, is_core_team: true, display_order: 1, created_at: "", updated_at: "" },
  { id: "2", name: "Wei Lin Chen", role: "Design Lead", company: "Tensor", bio: "Crafting beautiful Web3 experiences. Previously at Grab and Shopee.", avatar_url: null, twitter_url: "https://x.com/example", skills: ["UI/UX", "Figma", "Brand"], badges: ["Core Team"], achievements: [], is_featured: true, is_core_team: true, display_order: 2, created_at: "", updated_at: "" },
  { id: "3", name: "Priya Krishnan", role: "Community Lead", company: "Superteam", bio: "Growing the Solana community in Malaysia through events and education.", avatar_url: null, twitter_url: "https://x.com/example", skills: ["Community", "Events", "Growth"], badges: ["Core Team", "Community Star"], achievements: [], is_featured: true, is_core_team: true, display_order: 3, created_at: "", updated_at: "" },
  { id: "4", name: "Hafiz Ibrahim", role: "Smart Contract Dev", company: "Jupiter", bio: "Building secure and efficient programs on Solana. Anchor framework contributor.", avatar_url: null, twitter_url: "https://x.com/example", skills: ["Rust", "Anchor", "Security"], badges: ["Builder"], achievements: [], is_featured: true, is_core_team: false, display_order: 4, created_at: "", updated_at: "" },
  { id: "5", name: "Sarah Tan", role: "Content & Growth", company: "Marinade", bio: "Content strategist helping Web3 projects tell their story. DeFi enthusiast.", avatar_url: null, twitter_url: "https://x.com/example", skills: ["Content", "Marketing", "DeFi"], badges: ["Growth"], achievements: [], is_featured: true, is_core_team: false, display_order: 5, created_at: "", updated_at: "" },
];

const SKILL_COLORS: Record<string, string> = {
  Rust: "text-sol-green bg-sol-green/10 border-sol-green/30",
  TypeScript: "text-sol-blue bg-sol-blue/10 border-sol-blue/30",
  DeFi: "text-gold-accent bg-gold-accent/10 border-gold-accent/30",
  "UI/UX": "text-sol-purple bg-sol-purple/10 border-sol-purple/30",
  Figma: "text-sol-purple bg-sol-purple/10 border-sol-purple/30",
  Brand: "text-gold-accent bg-gold-accent/10 border-gold-accent/30",
  Community: "text-sol-green bg-sol-green/10 border-sol-green/30",
  Events: "text-sol-blue bg-sol-blue/10 border-sol-blue/30",
  Growth: "text-gold-accent bg-gold-accent/10 border-gold-accent/30",
  Anchor: "text-sol-purple bg-sol-purple/10 border-sol-purple/30",
  Security: "text-sol-green bg-sol-green/10 border-sol-green/30",
  Content: "text-sol-blue bg-sol-blue/10 border-sol-blue/30",
  Marketing: "text-sol-purple bg-sol-purple/10 border-sol-purple/30",
};

const AVATAR_COLORS = [
  "bg-sol-green/20 text-sol-green border-sol-green/30",
  "bg-sol-purple/20 text-sol-purple border-sol-purple/30",
  "bg-sol-blue/20 text-sol-blue border-sol-blue/30",
  "bg-gold-accent/20 text-gold-accent border-gold-accent/30",
  "bg-sol-green/20 text-sol-green border-sol-green/30",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function MembersSpotlight() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeMember = MOCK_MEMBERS[activeIndex];

  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
    setIsPaused(true);
    // Resume auto-cycle after 8 seconds of inactivity
    const timer = setTimeout(() => setIsPaused(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-cycle every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % MOCK_MEMBERS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section id="members" className="relative py-24 px-6">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Section header */}
        <SectionLabel number="03" label="Members" />

        <div className="space-y-2">
          <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-text-primary">
            MEMBER SPOTLIGHT
          </h2>
          <p className="font-mono text-xs text-text-secondary tracking-[0.1em]">
            Meet the core team driving Superteam Malaysia
          </p>
        </div>

        {/* Main layout: portrait sidebar + detail panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Portrait card stack */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-2">
            {MOCK_MEMBERS.map((member, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={member.id}
                  onClick={() => handleSelect(index)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 border transition-all duration-300 text-left group",
                    isActive
                      ? "border-sol-green/40 bg-sol-green/5 shadow-[0_0_20px_rgba(0,255,163,0.08)]"
                      : "border-border-dim bg-bg-panel/40 hover:border-border-dim hover:bg-bg-elevated/50"
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "relative flex-shrink-0 h-12 w-12 flex items-center justify-center border font-mono text-sm font-bold transition-all duration-300",
                      isActive
                        ? AVATAR_COLORS[index]
                        : "bg-bg-elevated text-text-secondary border-border-dim"
                    )}
                  >
                    {getInitials(member.name)}
                    {/* Status dot */}
                    <span
                      className={cn(
                        "absolute -top-1 -right-1 h-2 w-2 rounded-full transition-colors duration-300",
                        isActive ? "bg-sol-green pulse-glow" : "bg-text-secondary/30"
                      )}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "font-mono text-xs font-bold truncate transition-colors duration-300",
                        isActive ? "text-sol-green" : "text-text-primary"
                      )}
                    >
                      {member.name}
                    </div>
                    <div className="font-mono text-[0.6rem] text-text-secondary truncate">
                      {member.role}
                    </div>
                  </div>

                </button>
              );
            })}

            {/* Progress indicators */}
            <div className="flex gap-1 pt-3">
              {MOCK_MEMBERS.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-0.5 flex-1 transition-all duration-300",
                    index === activeIndex
                      ? "bg-sol-green"
                      : index < activeIndex
                        ? "bg-sol-green/20"
                        : "bg-border-dim"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Right: Detail panel */}
          <div className="lg:col-span-8 xl:col-span-9 relative">
            <CRTFrame
              title={`// ${activeMember.name.toUpperCase()}`}
              color="green"
              className="min-h-[420px]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMember.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="p-6 md:p-8"
                >
                  {/* Flash overlay for transition */}
                  <motion.div
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-sol-green/10 pointer-events-none z-20"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Large avatar */}
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className={cn(
                          "h-32 w-32 md:h-40 md:w-40 flex items-center justify-center border-2 font-mono text-4xl md:text-5xl font-black",
                          AVATAR_COLORS[activeIndex]
                        )}
                      >
                        {getInitials(activeMember.name)}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="md:col-span-2 space-y-5">
                      {/* Name & role */}
                      <div>
                        <h3 className="font-display text-2xl md:text-3xl font-black text-text-primary tracking-tight">
                          {activeMember.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-sm text-sol-green">
                            {activeMember.role}
                          </span>
                          {activeMember.company && (
                            <>
                              <span className="text-text-secondary/30">//</span>
                              <span className="font-mono text-sm text-text-secondary">
                                {activeMember.company}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="space-y-2">
                        <div className="font-mono text-[0.55rem] text-text-secondary/50 tracking-[0.15em] uppercase">
                          Skills
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {activeMember.skills.map((skill) => (
                            <span
                              key={skill}
                              className={cn(
                                "px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] border",
                                SKILL_COLORS[skill] || "text-text-secondary bg-bg-elevated border-border-dim"
                              )}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="space-y-2">
                        <div className="font-mono text-[0.55rem] text-text-secondary/50 tracking-[0.15em] uppercase">
                          Roles
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {activeMember.badges.map((badge) => (
                            <Badge
                              key={badge}
                              variant={
                                badge === "Core Team"
                                  ? "green"
                                  : badge === "OG"
                                    ? "gold"
                                    : badge === "Community Star"
                                      ? "purple"
                                      : "dim"
                              }
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="space-y-2">
                        <p className="font-mono text-sm text-text-secondary leading-relaxed">
                          {activeMember.bio}
                        </p>
                      </div>

                      {/* Twitter link */}
                      {activeMember.twitter_url && (
                        <a
                          href={activeMember.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-mono text-xs text-sol-green/70 hover:text-sol-green transition-colors duration-200 group"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span className="group-hover:underline">@{activeMember.name.split(" ")[0].toLowerCase()}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </CRTFrame>

            {/* Extra crosshair ornaments at outer corners of detail panel */}
            <Crosshair position="top-left" className="text-sol-green/15 -top-1 -left-1" />
            <Crosshair position="top-right" className="text-sol-green/15 -top-1 -right-1" />
            <Crosshair position="bottom-left" className="text-sol-green/15 -bottom-1 -left-1" />
            <Crosshair position="bottom-right" className="text-sol-green/15 -bottom-1 -right-1" />
          </div>
        </div>
      </div>
    </section>
  );
}
