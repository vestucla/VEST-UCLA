"use client";

import dynamic from "next/dynamic";

const JoinUs = dynamic(() => import("@/components/LandingPage/JoinUs"), {
  ssr: false,
});
// const TimelineComponent = dynamic(() => import("@/components/timeline"), { ssr: false });

export default function JoinUsPage() {
  return (
    <main>
      <JoinUs />
    </main>
  );
}
