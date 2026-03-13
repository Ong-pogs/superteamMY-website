"use client";

import { useState, useRef, useEffect } from "react";

import Navbar from "@/components/layout/Navbar";
// import LeftRail from "@/components/layout/LeftRail";
import Footer from "@/components/layout/Footer";
import EntryTransition from "@/components/entry/EntryTransition";
import HeroSection from "@/components/hero/HeroSection";
import MissionSection from "@/components/sections/MissionSection";
import StatsSection from "@/components/sections/StatsSection";
import MembersSpotlight from "@/components/sections/MembersSpotlight";
import PartnersSection from "@/components/sections/PartnersSection";
import WallOfLove from "@/components/sections/WallOfLove";
import FAQSection from "@/components/sections/FAQSection";
import JoinCTA from "@/components/sections/JoinCTA";
import EventsSection from "@/components/sections/EventsSection";

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const siteRef = useRef<HTMLDivElement>(null);

  // Hide scrollbar during 3D room, restore after enter
  useEffect(() => {
    if (!entered) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    // Safety: clear any leftover inline clip-path after transition
    if (entered && siteRef.current) {
      siteRef.current.style.clipPath = '';
    }
  }, [entered]);

  return (
    <>
      {!entered && (
        <EntryTransition
          onComplete={() => setEntered(true)}
          onReveal={() => setRevealing(true)}
          siteRef={siteRef}
        />
      )}

      <div
        ref={siteRef}
        style={{
          overflowX: "clip",
          ...(entered ? {} : {
            position: "relative" as const,
            zIndex: 200,
            pointerEvents: "none" as const,
            willChange: "clip-path",
          }),
        }}
      >
        <div
          style={{
            opacity: (revealing || entered) ? 1 : 0,
            background: entered ? "#0A0A0F" : "#000000",
            transition: "background 0.6s ease",
          }}
        >
          {/* CRT overlay — scanlines + phosphor tint during wipe/expand, removed after enter */}
          {revealing && !entered && (
            <div
              className="fixed inset-0 pointer-events-none"
              style={{ zIndex: 9999 }}
            >
              {/* Scanlines */}
              <div
                className="absolute inset-0"
                style={{
                  background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
                }}
              />
              {/* No phosphor tint — pure black to blend with 3D CRT */}
              {/* Vignette — strong, matching CRT tube look */}
              <div
                className="absolute inset-0"
                style={{
                  boxShadow: "inset 0 0 200px 80px rgba(0,0,0,0.4)",
                }}
              />
              {/* Subtle flicker */}
              <div className="absolute inset-0 crt-flicker" style={{ opacity: 0.05, background: "rgba(0,255,136,0.03)" }} />
            </div>
          )}

          <Navbar />

          <main>
            <HeroSection revealing={revealing} entered={entered} />
            <MissionSection />
            <StatsSection />
            <MembersSpotlight />
            <PartnersSection />
            <WallOfLove />
            <FAQSection />
            <JoinCTA />
            <EventsSection />
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
