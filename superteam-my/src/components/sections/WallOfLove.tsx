"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import SectionLabel from "@/components/ui/SectionLabel";
import CRTFrame from "@/components/layout/CRTFrame";

const MOCK_TWEETS = [
  {
    author: "@defi_builder_MY",
    text: "Just shipped my first Solana program thanks to Superteam Malaysia's bounty! The community here is incredible 🔥",
    date: "2026-02-15",
  },
  {
    author: "@web3_sarah",
    text: "Attended the Superteam MY meetup in KL last night. Met so many talented builders. This is the future of Malaysia's tech scene.",
    date: "2026-02-10",
  },
  {
    author: "@rust_dev_hafiz",
    text: "The quality of bounties on Superteam Earn from the MY chapter is top-notch. Already completed 3 this month!",
    date: "2026-01-28",
  },
  {
    author: "@crypto_priya",
    text: "From zero Web3 knowledge to building on Solana in 3 months. Superteam Malaysia made it possible. 🇲🇾",
    date: "2026-01-20",
  },
  {
    author: "@solana_wei",
    text: "The design workshops by Superteam MY are next level. Learning so much about Web3 UX design.",
    date: "2026-01-15",
  },
  {
    author: "@builder_amir",
    text: "Malaysia's Solana ecosystem is growing fast. Proud to be part of this movement with @SuperteamMY",
    date: "2026-01-10",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

export default function WallOfLove() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="wall-of-love" className="relative py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <SectionLabel number="06" label="WALL OF LOVE" className="mb-12" />

        <CRTFrame
          title="// COMMUNITY FEED — CHANNEL 06"
          color="green"
        >
          <div ref={ref} className="p-6 md:p-8">
            {/* Phosphor green tint overlay */}
            <div className="pointer-events-none absolute inset-0 bg-sol-green/[0.02]" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MOCK_TWEETS.map((tweet, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className={cn(
                    "relative rounded border-l-2 border-sol-green/60 bg-bg-terminal/80 p-5",
                    "transition-colors hover:bg-bg-elevated/60"
                  )}
                >
                  {/* Author handle */}
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-sol-green">
                      {tweet.author}
                    </span>
                    <span className="font-mono text-[0.6rem] text-text-secondary">
                      {tweet.date}
                    </span>
                  </div>

                  {/* Tweet text */}
                  <p className="text-sm leading-relaxed text-text-primary">
                    {tweet.text}
                  </p>

                  {/* Terminal prompt decoration */}
                  <div className="mt-3 font-mono text-[0.55rem] text-sol-green/30 tracking-wider">
                    &gt; MSG_RECEIVED // ACK
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CRTFrame>
      </div>
    </section>
  );
}
