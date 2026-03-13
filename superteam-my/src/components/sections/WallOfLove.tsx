"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Heart, Repeat2 } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionLabel from "@/components/ui/SectionLabel";

const MOCK_TWEETS = [
  {
    name: "DeFi Builder",
    handle: "@defi_builder_MY",
    text: "Just shipped my first Solana program thanks to Superteam Malaysia's bounty! The community here is incredible",
    date: "Feb 15",
    likes: 47,
    retweets: 12,
  },
  {
    name: "Sarah W",
    handle: "@web3_sarah",
    text: "Attended the Superteam MY meetup in KL last night. Met so many talented builders. This is the future of Malaysia's tech scene.",
    date: "Feb 10",
    likes: 83,
    retweets: 21,
  },
  {
    name: "Hafiz R",
    handle: "@rust_dev_hafiz",
    text: "The quality of bounties on Superteam Earn from the MY chapter is top-notch. Already completed 3 this month!",
    date: "Jan 28",
    likes: 35,
    retweets: 8,
  },
  {
    name: "Priya K",
    handle: "@crypto_priya",
    text: "From zero Web3 knowledge to building on Solana in 3 months. Superteam Malaysia made it possible.",
    date: "Jan 20",
    likes: 124,
    retweets: 34,
  },
  {
    name: "Wei Lin",
    handle: "@solana_wei",
    text: "The design workshops by Superteam MY are next level. Learning so much about Web3 UX design.",
    date: "Jan 15",
    likes: 56,
    retweets: 14,
  },
  {
    name: "Amir Z",
    handle: "@builder_amir",
    text: "Malaysia's Solana ecosystem is growing fast. Proud to be part of this movement with @SuperteamMY",
    date: "Jan 10",
    likes: 91,
    retweets: 27,
  },
];

const AVATAR_COLORS = [
  "bg-sol-green/20 text-sol-green",
  "bg-sol-purple/20 text-sol-purple",
  "bg-sol-blue/20 text-sol-blue",
  "bg-gold-accent/20 text-gold-accent",
  "bg-sol-green/20 text-sol-green",
  "bg-sol-purple/20 text-sol-purple",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

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
        <SectionLabel number="06" label="WALL OF LOVE" className="mb-4" />

        <div className="space-y-2 mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-text-primary">
            COMMUNITY VOICES
          </h2>
          <p className="font-mono text-xs text-text-secondary tracking-[0.1em]">
            What builders are saying about Superteam Malaysia
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_TWEETS.map((tweet, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className={cn(
                "relative border border-border-dim bg-bg-panel/60 p-5 transition-colors hover:bg-bg-elevated/60"
              )}
            >
              {/* Author row */}
              <div className="mb-3 flex items-center gap-3">
                <div
                  className={cn(
                    "h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-full font-mono text-xs font-bold",
                    AVATAR_COLORS[i]
                  )}
                >
                  {getInitials(tweet.name)}
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-sm font-medium text-text-primary truncate">
                    {tweet.name}
                  </div>
                  <div className="font-mono text-xs text-text-secondary truncate">
                    {tweet.handle}
                  </div>
                </div>
                <span className="ml-auto text-[0.65rem] font-mono text-text-secondary/60 flex-shrink-0">
                  {tweet.date}
                </span>
              </div>

              {/* Tweet text */}
              <p className="text-sm leading-relaxed text-text-primary mb-4">
                {tweet.text}
              </p>

              {/* Engagement */}
              <div className="flex items-center gap-5 text-text-secondary/50">
                <span className="flex items-center gap-1.5 font-mono text-xs">
                  <Heart className="h-3.5 w-3.5" />
                  {tweet.likes}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-xs">
                  <Repeat2 className="h-3.5 w-3.5" />
                  {tweet.retweets}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
