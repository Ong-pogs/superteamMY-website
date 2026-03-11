"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Mission", href: "#mission" },
  { label: "Members", href: "#members" },
  { label: "Partners", href: "#partners" },
  { label: "FAQ", href: "#faq" },
  { label: "Directory", href: "/members" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-bg-terminal/90 backdrop-blur-md border-b border-border-dim"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-sm bg-sol-green flex items-center justify-center">
            <span className="font-pixel text-[0.5rem] text-bg-terminal font-bold">ST</span>
          </div>
          <span className="font-mono text-xs tracking-[0.15em] text-text-primary">
            TERMINAL<span className="text-sol-green">/</span><span className="text-sol-green">/</span>MY
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-text-secondary hover:text-sol-green transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://t.me/superteammy"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-4 py-2 bg-sol-green text-bg-terminal font-mono text-[0.65rem] uppercase tracking-[0.1em] hover:bg-sol-green/90 transition-colors"
          >
            Join
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-bg-terminal/95 backdrop-blur-md border-b border-border-dim">
          <div className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-mono text-xs uppercase tracking-[0.1em] text-text-secondary hover:text-sol-green transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://t.me/superteammy"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-sol-green text-bg-terminal font-mono text-xs uppercase tracking-[0.1em] text-center"
            >
              Join Community
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
