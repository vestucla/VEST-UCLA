import type { Metadata } from "next";
import { eventsByDate } from "@/data/events";
import { EventCard } from "@/components/events/EventCard";
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
      <section className="section bg-white">
        <div className="container-content">
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {eventsByDate.map((event, i) => (
              <li key={event.id}>
                <FadeIn delay={i * 50} className="h-full">
                  <EventCard event={event} />
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
