"use client";

import Link from "next/link";
import PortalShell from "@/components/Members/PortalShell";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/FadeIn";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

const ACCOLADE_LINKS: { href: string; label: string; description: string }[] = [
  {
    href: "/about",
    label: "About VEST",
    description: "Mission, values, and how we’re scaling builder culture at UCLA.",
  },
  {
    href: "/team",
    label: "Team",
    description: "Meet the current board and class behind VEST.",
  },
  {
    href: "/events",
    label: "Events",
    description: "Speaker series, demo nights, and recruiting events.",
  },
  {
    href: "/join#timeline",
    label: "Timeline",
    description: "VEST history and milestones since founding.",
  },
];

export default function AccoladesPage() {
  return (
    <PortalShell
      title={<>VEST <span className="italic font-sans font-normal text-blue">Accolades</span></>}
      subtitle="Awards, milestones, and recognition. Most live on the main VEST site — jump straight to them below."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-16">
        {ACCOLADE_LINKS.map((l, i) => (
          <FadeIn key={l.href} delay={i * 100}>
            <Link href={l.href} className="block group h-full">
              <Card className="h-full p-6 bg-haze flex flex-col gap-2 relative transition-all duration-200 group-hover:-translate-y-1 group-hover:border-black-30 group-hover:shadow-md">
                <h3 className="font-bold text-xl text-black pr-8">{l.label}</h3>
                <p className="text-sm text-black-80 leading-relaxed">{l.description}</p>
                <div className="absolute top-6 right-6 text-black-30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue">
                  <ArrowRight size={20} weight="bold" />
                </div>
              </Card>
            </Link>
          </FadeIn>
        ))}
      </div>
    </PortalShell>
  );
}
