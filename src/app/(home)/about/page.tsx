"use client";

import dynamic from "next/dynamic";

const About = dynamic(() => import("@/components/LandingPage/About"), { ssr: false });

export default function AboutPage() {
  return (
    <main>
      <About />
    </main>
  );
}
