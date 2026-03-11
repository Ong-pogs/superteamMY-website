"use client";

import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MemberGrid from "@/components/members/MemberGrid";
import MemberSearch from "@/components/members/MemberSearch";
import MemberFilters from "@/components/members/MemberFilters";
import SectionLabel from "@/components/ui/SectionLabel";
import GridOverlay from "@/components/effects/GridOverlay";
import type { Member } from "@/types/member";

// Mock data — will be replaced with Supabase fetch
const MOCK_ALL_MEMBERS: Member[] = [
  { id: "1", name: "Amir Razak", role: "Lead Developer", company: "Solana Labs", bio: "Full-stack Solana developer.", avatar_url: null, twitter_url: "https://x.com/example", skills: ["Rust", "TypeScript", "DeFi"], badges: ["Core Team", "OG"], achievements: [], is_featured: true, is_core_team: true, display_order: 1, created_at: "", updated_at: "" },
  { id: "2", name: "Wei Lin Chen", role: "Design Lead", company: "Tensor", bio: "Crafting beautiful Web3 experiences.", avatar_url: null, twitter_url: "https://x.com/example", skills: ["Design", "Figma", "Brand"], badges: ["Core Team"], achievements: [], is_featured: true, is_core_team: true, display_order: 2, created_at: "", updated_at: "" },
  { id: "3", name: "Priya Krishnan", role: "Community Lead", company: "Superteam", bio: "Growing the Solana community.", avatar_url: null, twitter_url: "https://x.com/example", skills: ["Community", "Events", "Growth"], badges: ["Core Team"], achievements: [], is_featured: true, is_core_team: true, display_order: 3, created_at: "", updated_at: "" },
  { id: "4", name: "Hafiz Ibrahim", role: "Smart Contract Dev", company: "Jupiter", bio: "Building on Solana.", avatar_url: null, twitter_url: "https://x.com/example", skills: ["Rust", "Anchor", "Security"], badges: ["Builder"], achievements: [], is_featured: true, is_core_team: false, display_order: 4, created_at: "", updated_at: "" },
  { id: "5", name: "Sarah Tan", role: "Content & Growth", company: "Marinade", bio: "Content strategist.", avatar_url: null, twitter_url: "https://x.com/example", skills: ["Content", "Marketing", "DeFi"], badges: ["Growth"], achievements: [], is_featured: true, is_core_team: false, display_order: 5, created_at: "", updated_at: "" },
  { id: "6", name: "Raj Patel", role: "Frontend Developer", company: "Helius", bio: "React & Next.js specialist.", avatar_url: null, twitter_url: "https://x.com/example", skills: ["Frontend", "React", "TypeScript"], badges: ["Builder"], achievements: [], is_featured: false, is_core_team: false, display_order: 6, created_at: "", updated_at: "" },
  { id: "7", name: "Mei Ling Wong", role: "Product Manager", company: "Phantom", bio: "Building Web3 products.", avatar_url: null, twitter_url: null, skills: ["Product", "Strategy", "Growth"], badges: [], achievements: [], is_featured: false, is_core_team: false, display_order: 7, created_at: "", updated_at: "" },
  { id: "8", name: "Ahmad Zulkifli", role: "Rust Developer", company: "Jito", bio: "Solana core contributor.", avatar_url: null, twitter_url: "https://x.com/example", skills: ["Rust", "Systems", "DeFi"], badges: ["OG"], achievements: [], is_featured: false, is_core_team: false, display_order: 8, created_at: "", updated_at: "" },
  { id: "9", name: "Nurul Aisyah", role: "Designer", company: "Squads", bio: "UI/UX for Web3.", avatar_url: null, twitter_url: null, skills: ["Design", "Figma", "Frontend"], badges: [], achievements: [], is_featured: false, is_core_team: false, display_order: 9, created_at: "", updated_at: "" },
];

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    let result = MOCK_ALL_MEMBERS;

    if (filter !== "All") {
      if (filter === "Core Team") {
        result = result.filter((m) => m.is_core_team);
      } else {
        result = result.filter((m) =>
          m.skills.some((s) => s.toLowerCase().includes(filter.toLowerCase()))
        );
      }
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.role?.toLowerCase().includes(q) ||
          m.company?.toLowerCase().includes(q) ||
          m.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    return result;
  }, [search, filter]);

  return (
    <div className="min-h-screen bg-bg-terminal">
      <Navbar />

      <main className="relative pt-28 pb-20 px-6">
        <GridOverlay />

        <div className="relative z-10 mx-auto max-w-7xl space-y-8">
          <div>
            <SectionLabel number="DIR" label="MEMBER_DIRECTORY" className="mb-4" />
            <h1 className="font-display text-4xl font-black text-text-primary tracking-tight">
              Our Builders
            </h1>
            <p className="mt-2 text-text-secondary max-w-lg">
              The talented individuals powering Solana&apos;s growth in Malaysia.
            </p>
          </div>

          <MemberSearch value={search} onChange={setSearch} />
          <MemberFilters active={filter} onChange={setFilter} />

          <div className="font-mono text-[0.6rem] text-text-secondary tracking-[0.1em]">
            // SHOWING {filtered.length} OF {MOCK_ALL_MEMBERS.length} MEMBERS
          </div>

          <AnimatePresence mode="wait">
            <MemberGrid members={filtered} />
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
