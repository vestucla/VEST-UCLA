import type { Metadata } from "next";
import { eventsByDate } from "@/data/events";
import { EventCarousel } from "@/components/events/EventCarousel";
import { TechWeekSection } from "@/components/events/TechWeekSection";
import { PageHeader } from "@/components/ui/PageHeader";
import { FadeIn } from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Speaker sessions, founder chats, office visits and community socials — catch up on what VEST has been doing.",
};

export default function Events() {
  return (
    <>
      <PageHeader
        title="Events"
        description="Join us for speaker sessions, founder chats, workshops and community socials. Catch up on what we've been doing below."
      />

      <TechWeekSection />

      {/* Past events */}
      <section
        aria-labelledby="past-events-heading"
        className="section bg-haze"
      >
        <div className="container-content flex flex-col gap-12">
          <FadeIn>
            <h2
              id="past-events-heading"
              className="font-display text-display-sm text-blue"
            >
              Past events
            </h2>
          </FadeIn>
          <FadeIn delay={80}>
            <EventCarousel events={eventsByDate} label="Past events" />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
