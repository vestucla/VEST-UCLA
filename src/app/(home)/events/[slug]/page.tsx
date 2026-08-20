"use client";

import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { events } from '@/data/events';
import {
  EventDetailWrapper,
  Inner,
  ContentContainer,
  BackgroundGlow,
  BlurCircle,
  EventHeader,
  EventDate,
  TextContainer,
  EventSubtitle,
  EventDescription,
  ImageContainer,
  BackLink,
  NavigationContainer
} from './styles';

// Define types
type EventPageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function EventPage({ params, searchParams }: EventPageProps) {
  // Find the event that matches the slug
  const event = events.find(e => e.slug === params.slug);
  
  // If event not found, return 404
  if (!event) {
    notFound();
  }
  
  return (
    <EventDetailWrapper>
      <BackgroundGlow />
      <Inner>
        <ContentContainer>
          {/* Back Navigation */}
          <Link href="/events" passHref legacyBehavior>
            <BackLink>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Events
            </BackLink>
          </Link>
          
          {/* Event Title */}
          <EventHeader>{event.title}</EventHeader>

          {/* Event Date */}
          <EventDate>{event.date}</EventDate>
          
          {/* Event Details */}
          <TextContainer>
            <EventSubtitle>{event.subtitle}</EventSubtitle>
            <EventDescription>{event.description}</EventDescription>
          </TextContainer>
          
          {/* Event Image */}
          <ImageContainer>
            <Image 
              src={event.imageSrc} 
              alt={event.title} 
              fill 
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 900px"
              priority
            />
          </ImageContainer>
          
        </ContentContainer>
      </Inner>
      <BlurCircle />
    </EventDetailWrapper>
  );
}
