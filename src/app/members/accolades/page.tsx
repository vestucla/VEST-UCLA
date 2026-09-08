"use client";

import Link from "next/link";
import PortalShell from "@/components/Members/PortalShell";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/FadeIn";
import { CardArrow } from "@/components/ui/CardArrow";

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
              <Card className="card-interactive h-full p-6 bg-haze flex flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-bold text-xl text-black">{l.label}</h3>
                  <CardArrow className="mt-0.5" />
                </div>
                <p className="text-sm text-black-80 leading-relaxed">{l.description}</p>
              </Card>
            </Link>
          </FadeIn>
        ))}
      </div>
    </PortalShell>
  );
}
