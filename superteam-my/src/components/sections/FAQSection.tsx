"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import SectionLabel from "@/components/ui/SectionLabel";
import Accordion from "@/components/ui/Accordion";

const CATEGORIES = [
  "Getting Started",
  "Opportunities",
  "Collaboration",
  "Developers",
] as const;

type Category = (typeof CATEGORIES)[number];

const FAQ_DATA = [
  {
    q: "What is Superteam Malaysia?",
    a: "Superteam Malaysia is the local chapter of the global Superteam network, dedicated to empowering builders, creators, founders, and talent in the Solana ecosystem across Malaysia.",
    category: "Getting Started" as Category,
  },
  {
    q: "How do I join?",
    a: "Join our Telegram community, follow us on Twitter/X @SuperteamMY, and start participating in bounties on Superteam Earn.",
    category: "Getting Started" as Category,
  },
  {
    q: "Do I need to be a developer?",
    a: "Not at all. We welcome designers, content creators, growth marketers, business developers, and anyone passionate about Web3.",
    category: "Getting Started" as Category,
  },
  {
    q: "What opportunities are available?",
    a: "Bounties, grants, hackathons, job referrals, mentorship, and direct connections to top Solana projects.",
    category: "Opportunities" as Category,
  },
  {
    q: "How do bounties work?",
    a: "Browse available bounties on Superteam Earn, submit your work before the deadline, and earn crypto rewards for quality contributions.",
    category: "Opportunities" as Category,
  },
  {
    q: "How can projects collaborate?",
    a: "Sponsor bounties, host events, post on Superteam Earn, or reach out via Telegram for partnerships.",
    category: "Collaboration" as Category,
  },
  {
    q: "Can I host an event with Superteam?",
    a: "Absolutely! We're always looking for event partners and speakers. Reach out through our Telegram group.",
    category: "Collaboration" as Category,
  },
  {
    q: "What programming languages do I need?",
    a: "Solana programs are written in Rust, but you can interact with the blockchain using TypeScript, Python, and more.",
    category: "Developers" as Category,
  },
  {
    q: "Where can I learn Solana development?",
    a: "Start with Solana's official docs, Buildspace, and our community workshops. We regularly host beginner-friendly sessions.",
    category: "Developers" as Category,
  },
];

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("Getting Started");

  const filteredItems = FAQ_DATA.filter(
    (item) => item.category === activeCategory
  ).map((item) => ({
    question: item.q,
    answer: item.a,
  }));

  return (
    <section id="faq" className="relative py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <SectionLabel number="07" label="FAQ" className="mb-12" />

        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
          {/* Left sidebar — Category navigation */}
          <nav className="shrink-0 md:w-56">
            <div className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-text-secondary mb-4">
              // SELECT CATEGORY
            </div>
            <ul className="space-y-1">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "group flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left font-mono text-xs uppercase tracking-wider transition-all duration-200",
                      activeCategory === cat
                        ? "border-sol-green bg-sol-green/5 text-sol-green"
                        : "border-border-dim text-text-secondary hover:border-sol-green/40 hover:text-text-primary hover:bg-bg-elevated/30"
                    )}
                  >
                    <span
                      className={cn(
                        "text-[0.55rem]",
                        activeCategory === cat
                          ? "text-sol-green"
                          : "text-text-secondary"
                      )}
                    >
                      {activeCategory === cat ? "▶" : "○"}
                    </span>
                    {cat}
                  </button>
                </li>
              ))}
            </ul>

            {/* Category count indicator */}
            <div className="mt-6 border-t border-border-dim pt-4 font-mono text-[0.55rem] text-text-secondary tracking-wider">
              <span className="text-sol-green">{filteredItems.length}</span>{" "}
              ENTRIES FOUND
            </div>
          </nav>

          {/* Right side — Accordion */}
          <div className="min-w-0 flex-1">
            <Accordion items={filteredItems} />
          </div>
        </div>
      </div>
    </section>
  );
}
