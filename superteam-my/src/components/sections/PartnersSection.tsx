"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import SectionLabel from "@/components/ui/SectionLabel";
import CRTFrame from "@/components/layout/CRTFrame";
import ScanlineOverlay from "@/components/effects/ScanlineOverlay";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

const MOCK_PARTNERS: Partner[] = [
  { id: "1", name: "Solana Foundation", logo_url: "", website_url: "#", category: "ecosystem", display_order: 1, is_active: true, created_at: "" },
  { id: "2", name: "Jupiter", logo_url: "", website_url: "#", category: "defi", display_order: 2, is_active: true, created_at: "" },
  { id: "3", name: "Tensor", logo_url: "", website_url: "#", category: "nft", display_order: 3, is_active: true, created_at: "" },
  { id: "4", name: "Marinade", logo_url: "", website_url: "#", category: "defi", display_order: 4, is_active: true, created_at: "" },
  { id: "5", name: "Helius", logo_url: "", website_url: "#", category: "infra", display_order: 5, is_active: true, created_at: "" },
  { id: "6", name: "Phantom", logo_url: "", website_url: "#", category: "wallet", display_order: 6, is_active: true, created_at: "" },
  { id: "7", name: "Jito", logo_url: "", website_url: "#", category: "defi", display_order: 7, is_active: true, created_at: "" },
  { id: "8", name: "Squads", logo_url: "", website_url: "#", category: "infra", display_order: 8, is_active: true, created_at: "" },
];

const CRT_COLORS: Array<"green" | "purple" | "blue" | "gold"> = [
  "green",
  "purple",
  "blue",
  "gold",
];

const GLOW_STYLES: Record<string, { text: string; glow: string; hoverGlow: string }> = {
  green: {
    text: "text-sol-green",
    glow: "drop-shadow-[0_0_8px_rgba(0,255,163,0.3)]",
    hoverGlow: "group-hover:drop-shadow-[0_0_20px_rgba(0,255,163,0.6)]",
  },
  purple: {
    text: "text-sol-purple",
    glow: "drop-shadow-[0_0_8px_rgba(153,69,255,0.3)]",
    hoverGlow: "group-hover:drop-shadow-[0_0_20px_rgba(153,69,255,0.6)]",
  },
  blue: {
    text: "text-sol-blue",
    glow: "drop-shadow-[0_0_8px_rgba(20,241,149,0.3)]",
    hoverGlow: "group-hover:drop-shadow-[0_0_20px_rgba(20,241,149,0.6)]",
  },
  gold: {
    text: "text-gold-accent",
    glow: "drop-shadow-[0_0_8px_rgba(255,184,0,0.3)]",
    hoverGlow: "group-hover:drop-shadow-[0_0_20px_rgba(255,184,0,0.6)]",
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  ecosystem: "Ecosystem",
  defi: "DeFi",
  nft: "NFT",
  infra: "Infrastructure",
  wallet: "Wallet",
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function PartnersSection() {
  return (
    <section id="partners" className="relative py-24 px-6">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Section header */}
        <SectionLabel number="04" label="Network" />

        <div className="space-y-2">
          <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight text-text-primary">
            PARTNERS & ALLIES
          </h2>
          <p className="font-mono text-xs text-text-secondary tracking-[0.1em] uppercase">
            // Trusted protocols powering the Superteam MY network
          </p>
        </div>

        {/* CRT Monitor Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {MOCK_PARTNERS.map((partner, index) => {
            const color = CRT_COLORS[index % CRT_COLORS.length];
            const glowStyle = GLOW_STYLES[color];

            return (
              <motion.div key={partner.id} variants={itemVariants}>
                <a
                  href={partner.website_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <CRTFrame
                    title={`CH-${String(index + 1).padStart(2, "0")}`}
                    color={color}
                    showDots={true}
                    className={cn(
                      "transition-all duration-300",
                      "group-hover:shadow-[0_0_30px_rgba(0,255,163,0.15)]",
                      color === "purple" && "group-hover:shadow-[0_0_30px_rgba(153,69,255,0.15)]",
                      color === "blue" && "group-hover:shadow-[0_0_30px_rgba(20,241,149,0.15)]",
                      color === "gold" && "group-hover:shadow-[0_0_30px_rgba(255,184,0,0.15)]"
                    )}
                  >
                    <div className="relative flex flex-col items-center justify-center py-10 px-4 min-h-[160px] bg-bg-terminal/50 transition-colors duration-300 group-hover:bg-bg-terminal/80">
                      {/* Partner name as large stylized text */}
                      <div
                        className={cn(
                          "font-display text-lg md:text-xl font-black text-center tracking-tight transition-all duration-300",
                          glowStyle.text,
                          glowStyle.glow,
                          glowStyle.hoverGlow
                        )}
                      >
                        {partner.name}
                      </div>

                      {/* Category tag */}
                      <div className="mt-3 font-mono text-[0.5rem] text-text-secondary/40 tracking-[0.15em] uppercase transition-colors duration-300 group-hover:text-text-secondary/60">
                        [{CATEGORY_LABELS[partner.category] || partner.category}]
                      </div>

                      {/* Hover brightness overlay */}
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-300 pointer-events-none" />
                    </div>
                  </CRTFrame>
                </a>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom status bar */}
        <div className="flex items-center justify-between pt-4 border-t border-border-dim">
          <div className="font-mono text-[0.55rem] text-text-secondary/40 tracking-[0.15em] uppercase">
            {MOCK_PARTNERS.length} active connections // All channels operational
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-sol-green pulse-glow" />
            <span className="font-mono text-[0.55rem] text-sol-green/60 tracking-[0.15em] uppercase">
              Network Healthy
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
