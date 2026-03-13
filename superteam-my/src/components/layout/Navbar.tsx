"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Mission", href: "#mission" },
  { label: "Members", href: "#members" },
  { label: "Partners", href: "#partners" },
  { label: "FAQ", href: "#faq" },
  { label: "Directory", href: "/members" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [open]);

  return (
    <>
      {/* Floating menu button — top right */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 right-6 md:right-10 lg:right-14 z-[80] flex items-center gap-2.5 group cursor-pointer"
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

            {/* Menu panel — centered, floating, rounded */}
            <motion.div
              key="menu-panel"
              initial={{ opacity: 0, y: -30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed z-[70] w-[min(520px,90vw)] bg-[#D0D0D8] rounded-2xl overflow-auto max-h-[80vh] top-16 right-6 md:right-10 lg:right-14 shadow-2xl"
            >
              {/* Nav links — large bold typography */}
              <div className="px-8 md:px-12 pt-10 pb-12 space-y-2">
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
