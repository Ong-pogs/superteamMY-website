"use client";

import { useState } from "react";
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
import CRTTransition from "@/components/effects/CRTTransition";

export default function Home() {
  const [entered, setEntered] = useState(false);

  return (
    <>
      {!entered && <EntryTransition onComplete={() => setEntered(true)} />}

      <CRTTransition active={entered}>
        <div className={entered ? "opacity-100" : "opacity-0"}>
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
      </CRTTransition>
    </>
  );
}
