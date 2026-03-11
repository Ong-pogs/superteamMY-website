"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Send, MessageCircle, Twitter } from "lucide-react";

const SOCIAL_LINKS = [
  { icon: Send, label: "Telegram", href: "#" },
  { icon: MessageCircle, label: "Discord", href: "#" },
  { icon: Twitter, label: "Twitter/X", href: "#" },
];

export default function JoinCTA() {
  const [email, setEmail] = useState("");

  return (
    <section
      id="join"
      className="relative overflow-hidden py-32 px-6"
    >
      {/* Background gradient wash */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sol-purple/20 via-bg-terminal to-sol-green/15" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-terminal via-transparent to-bg-terminal/80" />

      {/* Decorative grid lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #00FFA3 1px, transparent 1px), linear-gradient(to bottom, #00FFA3 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Meta text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 font-mono text-xs tracking-[0.3em] text-text-secondary"
        >
          EPISOD_01 / MMXXVI
        </motion.div>

        {/* MASSIVE gradient typography */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h2 className="font-display font-black leading-[0.85] tracking-tight">
            <span
              className={cn(
                "block text-[clamp(3.5rem,12vw,10rem)]",
                "bg-gradient-to-r from-sol-green via-sol-blue to-sol-purple bg-clip-text text-transparent"
              )}
            >
              SUPERTEAM
            </span>
            <span
              className={cn(
                "block text-[clamp(3.5rem,12vw,10rem)]",
                "bg-gradient-to-l from-sol-green via-gold-accent to-sol-purple bg-clip-text text-transparent"
              )}
            >
              MALAYSIA
            </span>
          </h2>
        </motion.div>

        {/* Language swap line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 mb-12 font-mono text-sm tracking-[0.25em] text-text-secondary/60"
        >
          MEMBINA &middot; &#x5EFA;&#x8BBE; &middot; &#xB95;&#xB9F;&#xBCD;&#xB9F;&#xBC1; &middot; BUILD
        </motion.div>

        {/* Social buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12 flex items-center justify-center gap-4"
        >
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group flex items-center gap-2 border border-border-dim px-5 py-3",
                "font-mono text-xs uppercase tracking-wider text-text-secondary",
                "transition-all duration-300",
                "hover:border-sol-green/60 hover:text-sol-green hover:bg-sol-green/5",
                "hover:shadow-[0_0_20px_rgba(0,255,163,0.1)]"
              )}
            >
              <link.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              {link.label}
            </a>
          ))}
        </motion.div>

        {/* Terminal-style email input */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mx-auto max-w-lg"
        >
          <div className="flex items-stretch border border-border-dim bg-bg-terminal/80">
            {/* Prompt */}
            <div className="flex items-center px-4 border-r border-border-dim">
              <span className="font-mono text-xs text-sol-green whitespace-nowrap">
                &gt; enter_email:
              </span>
            </div>

            {/* Input */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@superteam.my"
              className={cn(
                "flex-1 bg-transparent px-4 py-3",
                "font-mono text-xs text-text-primary placeholder:text-text-secondary/40",
                "outline-none focus:ring-0"
              )}
            />

            {/* Subscribe button */}
            <Button
              variant="primary"
              size="sm"
              className="rounded-none border-l border-border-dim"
            >
              [SUBSCRIBE]
            </Button>
          </div>

          <div className="mt-3 font-mono text-[0.55rem] text-text-secondary/50 tracking-wider">
            // NO SPAM. SIGNAL ONLY. UNSUBSCRIBE ANYTIME.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
