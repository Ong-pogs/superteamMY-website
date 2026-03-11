"use client";

import SectionLabel from "@/components/ui/SectionLabel";
import CRTFrame from "@/components/layout/CRTFrame";

export default function EventsSection() {
  return (
    <section id="events" className="relative py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <SectionLabel number="09" label="EVENTS" className="mb-12" />

        <CRTFrame title="// EVENTS MODULE — COMING SOON" color="purple">
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="font-mono text-6xl text-sol-purple/20 mb-6">
              {"{ }"}
            </div>
            <h3 className="font-display text-xl font-bold text-text-primary mb-3">
              Events Module Loading...
            </h3>
            <p className="font-mono text-sm text-text-secondary max-w-md">
              // This module is under development. Upcoming Superteam Malaysia
              events, hackathons, and meetups will appear here.
            </p>
            <div className="mt-8 font-mono text-[0.6rem] text-sol-purple/40 tracking-[0.15em]">
              LUMA INTEGRATION PENDING — ETA: SOON™
            </div>
          </div>
        </CRTFrame>
      </div>
    </section>
  );
}
