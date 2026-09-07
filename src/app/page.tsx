import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Hero from "@/components/home/Hero";
import { LogoMarquee } from "@/components/home/LogoMarquee";
import { CompanyGrid } from "@/components/home/CompanyGrid";
import { EventCard } from "@/components/events/EventCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { partnerLogos } from "@/data/logos";
import { eventsByDate } from "@/data/events";

export const metadata: Metadata = {
  title: "VEST at UCLA — Building the future in Los Angeles",
  description:
    "VEST is UCLA's startup and builder community. We run speaker sessions, office visits and workshops, and our members go on to build at the best companies in tech.",
};

export default function Home() {
  const recentEvents = eventsByDate.slice(0, 3);

  return (
    <>
      <Hero />

      {/* Trusted by — an infinite marquee, matching the design's row that
          deliberately runs off both edges of the artboard. */}
      <section
        aria-label="Partners"
        className="flex flex-col gap-6 bg-white pb-25 pt-20"
      >
        <p className="text-black-80 px-6 text-center">
          Trusted by Leading VCs, Startups, and Companies
        </p>
        <LogoMarquee
          logos={partnerLogos}
          label="VEST partners"
          height={60}
          gap={84}
        />
      </section>

      {/* Cultivating UCLA's startup ecosystem */}
      <section className="section-block bg-haze">
        <div className="container-content flex flex-col gap-12">
          <FadeIn className="section-header">
            <h2 className="font-display text-display-sm text-blue">
              Cultivating UCLA’s startup ecosystem.
            </h2>
            <div className="text-black-80 flex flex-col gap-4">
              <p>
                VEST connects ambitious UCLA students with venture capital firms
                and startups, providing hands-on experience and real-world
                learning.
              </p>
              <p>
                We accelerate builders that want to start or join the next
                Unicorn company. We’re hands on and love to do things rather
                than just plan things.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={80}>
            <div className="border-black-30 relative aspect-[16/10] overflow-hidden rounded-card border-2 md:aspect-[1200/634]">
              <Image
                src="/images/home-group.webp"
                alt="VEST members on the steps of Royce Hall"
                fill
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="object-cover object-[center_43%]"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Working at the best companies in tech */}
      <section className="section-block bg-white">
        <div className="container-content flex flex-col gap-12">
          <FadeIn className="section-header">
            <h2 className="font-display text-display-sm text-blue">
              Working at the best companies in tech.
            </h2>
            <div className="text-black-80 flex flex-col gap-4">
              <p>
                VEST connects our members with leading companies across the tech
                industry.
              </p>
              <p>
                Our alumni have gone on to launch their own successful startups,
                join unicorns as early employees, and land roles through
                connections made within the club.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={80} className="flex flex-col gap-3">
            {/* A 2px ring rather than a border: the design's card has no
                border box, and a ring does not take part in layout. */}
            <div className="bg-haze shadow-black-10 rounded-card px-5 py-6 shadow-[0_0_0_2px]">
              <CompanyGrid />
            </div>
            <p className="text-black px-2 text-right">…and more!</p>
          </FadeIn>
        </div>
      </section>

      {/* Recent events */}
      <section className="section-block bg-haze">
        <div className="container-content flex flex-col gap-12">
          <FadeIn>
            <h2 className="font-display text-display-sm text-blue text-center">
              Recent events
            </h2>
          </FadeIn>

          <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {recentEvents.map((event, i) => (
              <li key={event.id}>
                <FadeIn delay={i * 80} className="h-full">
                  <EventCard event={event} />
                </FadeIn>
              </li>
            ))}
          </ul>

          <FadeIn className="flex justify-center">
            <Link href="/events" className="btn btn-primary">
              View all events
              <ArrowUpRight size={16} weight="bold" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
