"use client";

import {
  HeroSection,
  Featured,
  Building,
  WhereWeWork,
  Recent,
} from "@/components/LandingPage";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Featured />
      <Building />
      <WhereWeWork />
      <Recent />
    </>
  );
}
