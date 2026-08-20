"use client";

import {
  Wrapper,
  Inner,
  Header,
  Title,
  ViewAllLink,
  EventsGrid,
} from "./styles";
import { events } from "@/data/events";
import Event from "@/components/ui/Event";
import { ArrowRight } from "@phosphor-icons/react";

const Recent = () => {
  // Take only the first 3 events for the landing page
  const displayEvents = events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  return (
    <Wrapper>
      <Inner>
        <Header>
          <Title>
            Recent <span className="italic">Events</span>
          </Title>
          <ViewAllLink href="/events">
            <span>View All</span>
            <ArrowRight size={20} weight="bold" />
          </ViewAllLink>
        </Header>

        <EventsGrid>
          {displayEvents.map((event) => (
            <Event
              key={event.id}
              id={event.id}
              title={event.title}
              date={event.date}
              subtitle={event.subtitle}
              description={event.description}
              imageSrc={event.imageSrc}
            />
          ))}
        </EventsGrid>
      </Inner>
    </Wrapper>
  );
};

export default Recent;
