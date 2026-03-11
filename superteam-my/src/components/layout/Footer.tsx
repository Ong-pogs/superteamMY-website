"use client";

import { ExternalLink } from "lucide-react";

const communityLinks = [
  { label: "Telegram", href: "https://t.me/superteammy" },
  { label: "Discord", href: "#" },
  { label: "Twitter / X", href: "https://x.com/SuperteamMY" },
];

const resourceLinks = [
  { label: "Superteam Earn", href: "https://earn.superteam.fun" },
  { label: "Solana Docs", href: "https://solana.com/docs" },
  { label: "Bounties", href: "https://earn.superteam.fun/bounties" },
];

const connectLinks = [
  { label: "Superteam Global", href: "https://superteam.fun" },
  { label: "GitHub", href: "#" },
  { label: "Contact Us", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-dim bg-bg-terminal">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-sm bg-sol-green flex items-center justify-center">
                <span className="font-pixel text-[0.5rem] text-bg-terminal font-bold">ST</span>
              </div>
              <span className="font-mono text-xs tracking-[0.15em] text-text-primary">
                TERMINAL<span className="text-sol-green">//</span>MY
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              The home for Solana builders in Malaysia. Building the future of decentralized technology.
            </p>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-text-secondary mb-4">
              Community
            </h4>
            <ul className="space-y-2">
              {communityLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-text-secondary hover:text-sol-green transition-colors"
                  >
                    {link.label}
                    <ExternalLink size={10} className="opacity-40" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-text-secondary mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-text-secondary hover:text-sol-green transition-colors"
                  >
                    {link.label}
                    <ExternalLink size={10} className="opacity-40" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-text-secondary mb-4">
              Connect
            </h4>
            <ul className="space-y-2">
              {connectLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-text-secondary hover:text-sol-green transition-colors"
                  >
                    {link.label}
                    <ExternalLink size={10} className="opacity-40" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-border-dim flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[0.6rem] text-text-secondary tracking-[0.1em]">
            // SESSION ENDED — TERMINAL.MY v1.0 — © 2026
          </p>
          <p className="font-mono text-[0.6rem] text-text-secondary/50 tracking-[0.1em]">
            POWERED BY SOLANA
          </p>
        </div>
      </div>
    </footer>
  );
}
