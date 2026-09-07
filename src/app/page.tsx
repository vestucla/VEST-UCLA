import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Hero from "@/components/home/Hero";
import { LogoWall } from "@/components/home/LogoWall";
import { LogoMarquee } from "@/components/home/LogoMarquee";
import { EventCard } from "@/components/events/EventCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { companyLogos, partnerLogos } from "@/data/logos";
import { eventsByDate } from "@/data/events";

export const metadata: Metadata = {
  title: "VEST at UCLA — Scaling builder culture at UCLA",
  description:
    "VEST is UCLA's startup and builder community. We run speaker sessions, office visits and workshops, and our members go on to build at the best companies in tech.",
};

export default function Home() {
  const recentEvents = eventsByDate.slice(0, 3);

  return (
    <>
      <Hero />

      {/* Trusted by */}
      <section
        aria-label="Partners"
        className="border-b-2 border-black-10 bg-white py-10 md:py-12"
      >
        <div className="container-content flex flex-col items-center gap-8 lg:flex-row lg:gap-14">
          <p className="eyebrow shrink-0">Trusted by</p>
          <LogoWall
            logos={partnerLogos}
            height={28}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 sm:gap-x-12 lg:justify-between"
          />
        </div>
      </section>

      {/* Cultivating UCLA's startup ecosystem */}
      <section className="section bg-haze">
        <div className="container-content flex flex-col gap-12">
          <FadeIn className="section-header">
            <h2 className="font-display text-display-sm text-blue">
              Cultivating UCLA’s{" "}
              <span className="highlight">startup ecosystem</span>
            </h2>
            <p className="text-black-80">
              VEST brings together the most driven builders on campus —
              engineers, designers and founders — and gives them the people, the
              rooms and the momentum to ship something real before they
              graduate.
            </p>
          </FadeIn>

          <FadeIn delay={80}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-card border-2 border-black-30 md:aspect-[16/9]">
              <Image
                src="/images/Group-2.webp"
                alt="VEST members together at a general meeting"
                fill
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Working at the best companies in tech */}
      <section className="section bg-white">
        <div className="container-content flex flex-col gap-12">
          <FadeIn className="section-header">
            <h2 className="font-display text-display-sm text-blue">
              Working at the best companies in tech
            </h2>
            <p className="text-black-80">
              Our members intern and work full-time across big tech, defense,
              finance and the fastest growing startups in the country.
            </p>
          </FadeIn>

          <FadeIn delay={80}>
            {/* No inline padding on the card: the marquee runs edge to edge
                so its fade lands on the card's own border. */}
            <div className="card bg-haze py-8 md:py-10">
              <LogoMarquee
                logos={companyLogos}
                label="Companies VEST members have worked at"
                height={28}
                gap={64}
              />
              <p className="mt-6 px-6 text-right italic text-black-80 md:px-10">
                …and more!
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Recent events */}
      <section className="section bg-white pt-0">
        <div className="container-content flex flex-col gap-12">
          <FadeIn>
            <h2 className="text-center font-display text-display-sm text-blue">
              Recent events
            </h2>
          </FadeIn>

          <ul className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
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
