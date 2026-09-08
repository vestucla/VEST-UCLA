import Image from "next/image";
import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import { LogoMarquee } from "@/components/home/LogoMarquee";
import { CompanyGrid } from "@/components/home/CompanyGrid";
import { EventCard } from "@/components/events/EventCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { Highlight } from "@/components/ui/Highlight";
import { ArrowLink } from "@/components/ui/ArrowLink";
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
        className="flex flex-col gap-4 bg-white pb-10 pt-9 md:gap-6 md:pb-25 md:pt-20"
      >
        <p className="text-black-80 px-6 text-center text-sm md:text-base">
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
        <div className="container-content flex flex-col gap-7 md:gap-12">
          <FadeIn className="section-header">
            <div className="section-lede flex flex-col items-start gap-4">
              <h2 className="font-display text-display-sm text-blue">
                Cultivating UCLA’s startup ecosystem.
              </h2>
              <ArrowLink href="/about" className="section-lede-cta">
                Learn more about VEST
              </ArrowLink>
            </div>
            <div className="text-black-80 flex flex-col gap-4">
              <p>
                VEST connects ambitious UCLA students with venture capital firms
                and startups, providing hands-on experience and real-world
                learning.
              </p>
              <p>
                We accelerate builders that want to start or join the next
                Unicorn company.{" "}
                <Highlight>
                  We’re hands on and love to do things rather than just plan
                  things.
                </Highlight>
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={80} className="reveal-media">
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
        <div className="container-content flex flex-col gap-7 md:gap-12">
          <FadeIn className="section-header">
            <div className="section-lede flex flex-col items-start gap-4">
              <h2 className="font-display text-display-sm text-blue">
                Working at the best companies in tech.
              </h2>
              <ArrowLink href="/team" className="section-lede-cta">
                Meet the team
              </ArrowLink>
            </div>
            <div className="text-black-80 flex flex-col gap-4">
              <p>
                <Highlight>
                  VEST connects our members with leading companies across the
                  tech industry.
                </Highlight>
              </p>
              <p>
                Our alumni have gone on to launch their own successful startups,
                join unicorns as early employees, and land roles through
                connections made within the club.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={80} className="reveal-media-soft flex flex-col gap-3">
            {/* A 2px ring rather than a border: the design's card has no
                border box, and a ring does not take part in layout. */}
            <div className="bg-haze shadow-black-10 rounded-card px-3 py-4 shadow-[0_0_0_2px] md:px-5 md:py-6">
              <CompanyGrid />
            </div>
            <p className="text-black px-2 text-right">…and more!</p>
          </FadeIn>
        </div>
      </section>

      {/* Recent events */}
      <section className="section-block bg-haze">
        <div className="container-content flex flex-col gap-7 md:gap-12">
          <FadeIn>
            <h2 className="font-display text-display-sm text-blue text-center">
              Recent events
            </h2>
          </FadeIn>

          <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {recentEvents.map((event, i) => (
              <li key={event.id}>
                <FadeIn delay={i * 80} className="reveal-media h-full">
                  <EventCard event={event} />
                </FadeIn>
              </li>
            ))}
          </ul>

          <FadeIn className="flex justify-center">
            <ArrowLink href="/events">View all events</ArrowLink>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
