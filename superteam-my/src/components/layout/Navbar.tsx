"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Mission", href: "#mission" },
  { label: "Members", href: "#members" },
  { label: "Partners", href: "#partners" },
  { label: "FAQ", href: "#faq" },
  { label: "Directory", href: "/members" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-[80] transition-all duration-300 pointer-events-none",
          open
            ? "bg-transparent"
            : scrolled
              ? "bg-bg-terminal/90 backdrop-blur-md border-b border-border-dim"
              : "bg-transparent"
        )}
      >
        <div className="flex items-center justify-between px-6 md:px-10 lg:px-14 py-4">
          {/* Logo — just the ST icon */}
          <a href="/" className="flex items-center gap-2 pointer-events-auto">
            <div className="h-7 w-7 rounded-sm bg-sol-green flex items-center justify-center">
              <span className="font-pixel text-[0.5rem] text-bg-terminal font-bold">ST</span>
            </div>
          </a>

          {/* Menu toggle — far right */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2.5 group cursor-pointer pointer-events-auto"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <div className="relative w-6 h-[14px]">
              {/* Top bar */}
              <span
                className="absolute left-0 w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  top: 0,
                  height: open ? 3 : 1.5,
                  borderRadius: open ? 1 : 0.5,
                  transform: `skewX(${open ? 15 : 0}deg)`,
                  background: open
                    ? "linear-gradient(90deg, #9945FF, #14F195)"
                    : "#E8E8ED",
                  transitionDelay: open ? "0ms" : "60ms",
                }}
              />
              {/* Middle bar */}
              <span
                className="absolute left-0 w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  top: "50%",
                  height: open ? 3 : 1.5,
                  borderRadius: open ? 1 : 0.5,
                  transform: `translateY(-50%) skewX(${open ? -15 : 0}deg)`,
                  background: open
                    ? "linear-gradient(90deg, #9945FF, #14F195)"
                    : "#E8E8ED",
                  transitionDelay: open ? "40ms" : "30ms",
                }}
              />
              {/* Bottom bar */}
              <span
                className="absolute left-0 w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  top: "100%",
                  height: open ? 3 : 1.5,
                  borderRadius: open ? 1 : 0.5,
                  transform: `translateY(-100%) skewX(${open ? -15 : 0}deg)`,
                  background: open
                    ? "linear-gradient(90deg, #9945FF, #14F195)"
                    : "#E8E8ED",
                  transitionDelay: open ? "80ms" : "0ms",
                }}
              />
            </div>
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-text-secondary group-hover:text-text-primary transition-colors">
              Menu
            </span>
          </button>
        </div>
      </nav>

      {/* ── Fullscreen Menu Overlay ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Grey tint backdrop */}
            <motion.div
              key="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-black/40"
              onClick={() => setOpen(false)}
            />

            {/* Menu panel — drops from top-right */}
            <motion.div
              key="menu-panel"
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              exit={{ clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 z-[70] w-full sm:w-[min(560px,80vw)] h-auto max-h-[85vh] bg-[#D0D0D8] overflow-auto"
            >
              {/* Close button */}
              <div className="flex justify-end px-6 md:px-10 lg:px-14 pt-5">
                <button
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 group cursor-pointer"
                  aria-label="Close menu"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#0A0A0F]/60 group-hover:text-[#0A0A0F] transition-colors">
                    <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-[#0A0A0F]/50 group-hover:text-[#0A0A0F] transition-colors">
                    Close
                  </span>
                </button>
              </div>

              {/* Nav links — large bold typography */}
              <div className="px-8 md:px-14 lg:px-20 pt-10 pb-16 space-y-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.15 + 0.06 * i,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block font-display font-black text-[clamp(2rem,5vw,3.5rem)] leading-[1.15] text-[#0A0A0F] hover:text-[#0A0A0F]/60 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </motion.div>
                ))}

                {/* Join CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.15 + 0.06 * navLinks.length,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="pt-6"
                >
                  <a
                    href="https://t.me/superteammy"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="inline-block px-6 py-3 bg-[#0A0A0F] text-sol-green font-mono text-[0.7rem] uppercase tracking-[0.15em] hover:bg-[#0A0A0F]/80 transition-colors"
                  >
                    Join Community
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
