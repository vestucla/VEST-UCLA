"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Event from "@/components/ui/Event";
import { events } from "@/data/events";
import {
  Wrapper,
  Inner,
  ContentContainer,
  EventsHeader,
  EventsGrid,
  BackgroundGlow,
  EventsText,
  EventsTitle,
  BlurCircle,
  TextContainer,
  TechWeekSection,
  TechWeekContent,
  TechWeekDescription,
  TechWeekFooter,
  TechWeekLogo,
  TechWeekApplyLink,
  TechWeekButtonRow,
} from "./styles";

const Events = () => {
  return (
    <Wrapper>
      <BackgroundGlow />
      <Inner>
        <ContentContainer>
          <EventsHeader>
            Our <span className="italic">Events</span>
          </EventsHeader>
          <TextContainer>
            <EventsTitle>Bringing founders, ideas, and members together.</EventsTitle>
            <EventsText>
              <p>At VEST, our events are designed to fuel inspiration, spark connection, and deepen your understanding of the startup world. From founder talks and VC panels to startup office visits, VEST gives members direct access to the people and places shaping tech.</p>
              <p>Our events are where insight meets connection, and big ideas begin.</p>
            </EventsText>
          </TextContainer>
          <TechWeekSection>
            <TechWeekContent>
              <EventsTitle>LA Tech Week Product Demo Application</EventsTitle>
              <TechWeekDescription>
                <p>
                  VEST is hosting for LA Tech Week and we&apos;re looking for 5 founders to
                  demo their products during our event. Interested in hiring great student
                  talent and showcasing your company to 100+ people? Now&apos;s your chance!
                </p>
              </TechWeekDescription>
            </TechWeekContent>
            <TechWeekFooter>
              <TechWeekLogo>
                <Image
                  src="/images/techweek-la-black.svg"
                  alt="LA Tech Week"
                  width={1400}
                  height={515}
                />
              </TechWeekLogo>
              <TechWeekButtonRow>
                <TechWeekApplyLink
                  href="https://forms.gle/Tmy8LE2M2KPLp5tX6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Apply Here</span>
                  <ChevronRight size={18} />
                </TechWeekApplyLink>
              </TechWeekButtonRow>
            </TechWeekFooter>
          </TechWeekSection>
          <EventsGrid>
            {events.map((event) => (
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
        </ContentContainer>
      </Inner>
      <BlurCircle />
    </Wrapper>
  );
};

export default Events;
