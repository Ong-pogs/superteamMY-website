"use client";

import { useState, useRef, useEffect } from "react";

import Navbar from "@/components/layout/Navbar";
import LeftRail from "@/components/layout/LeftRail";
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

  // Safety: clear any leftover inline clip-path after transition
  useEffect(() => {
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
            background: "#0A0A0F",
          }}
        >
          <Navbar />
          <LeftRail />

          <main>
            <HeroSection animate={revealing || entered} />
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
