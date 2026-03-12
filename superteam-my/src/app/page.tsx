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

  // Safety cleanup: remove any inline styles CinematicReveal set on the wrapper
  useEffect(() => {
    if (entered && siteRef.current) {
      siteRef.current.style.position = '';
      siteRef.current.style.inset = '';
      siteRef.current.style.zIndex = '';
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

      <div ref={siteRef} style={{ overflow: "hidden" }}>
        <div
          style={{
            opacity: (revealing || entered) ? 1 : 0,
          }}
        >
          <Navbar />
          <LeftRail />

          <main>
            <HeroSection />
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
