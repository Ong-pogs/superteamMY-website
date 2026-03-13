"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionLabel from "@/components/ui/SectionLabel";

const MOCK_EVENTS = [
  {
    date: "Apr 12, 2026",
    title: "Solana Builder Night KL",
    location: "WeWork Equatorial Plaza, KL",
    description:
      "An evening of demos, networking, and pizza with Solana builders in Kuala Lumpur.",
    href: "#",
    accent: "border-sol-green",
  },
  {
    date: "Apr 26, 2026",
    title: "Web3 Workshop: DeFi on Solana",
    location: "WORQ Glo Damansara",
    description:
      "Hands-on workshop covering token swaps, liquidity pools, and building DeFi frontends.",
    href: "#",
    accent: "border-sol-purple",
  },
  {
    date: "May 17-18, 2026",
    title: "Superteam MY Hackathon 2026",
    location: "APW Bangsar, KL",
    description:
      "48-hour hackathon with $10k in prizes. Teams of 2-5. Open to all skill levels.",
    href: "#",
    accent: "border-gold-accent",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

export default function EventsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="events" className="relative py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <SectionLabel number="09" label="EVENTS" className="mb-4" />

        <div className="space-y-2 mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-text-primary">
            UPCOMING EVENTS
          </h2>
          <p className="font-mono text-xs text-text-secondary tracking-[0.1em]">
            Meetups, workshops, and hackathons across Malaysia
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MOCK_EVENTS.map((event, i) => (
            <motion.a
              key={event.title}
              href={event.href}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className={cn(
                "group relative block border-l-2 bg-bg-panel/60 p-6 transition-colors duration-200 hover:bg-bg-elevated/60",
                event.accent
              )}
            >
              {/* Date */}
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-3.5 w-3.5 text-text-secondary" />
                <span className="font-mono text-xs text-text-secondary">
                  {event.date}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-lg font-bold text-text-primary mb-2 group-hover:text-sol-green transition-colors">
                {event.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {event.description}
              </p>

              {/* Location */}
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-3.5 w-3.5 text-text-secondary/60" />
                <span className="font-mono text-xs text-text-secondary/80">
                  {event.location}
                </span>
              </div>

              {/* Register link */}
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-sol-green group-hover:gap-2.5 transition-all">
                Register
                <ArrowRight className="h-3 w-3" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
