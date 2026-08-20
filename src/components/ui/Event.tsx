import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';

export interface EventProps {
  imageSrc?: string;
  title: string;
  date: string;
  subtitle?: string;
  description?: string;
  id?: number;
}

const EventCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: linear-gradient(90deg, rgba(30, 70, 200, 0.2) 0%, rgba(50, 30, 110, 0.2) 100%);
  box-shadow: inset 0px 0px 30px 0px rgba(239, 239, 239, 0.15);
  overflow: hidden;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const EventImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
`;

const EventContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  flex: 1;
  gap: 16px;
`;

const EventTitle = styled.h3`
  font-size: var(--text-xxl);
  font-weight: 600;
  line-height: 1.2;
  color: #efefef;
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: var(--text-lg);
  }
`;

const EventDescription = styled.p`
  font-size: var(--text-base);
  font-weight: 400;
  line-height: 1.5;
  color: rgba(239, 239, 239, 0.7);
  
  @media (max-width: 768px) {
    font-size: var(--text-sm);
  }
`;

const EventDate = styled.span`
  font-size: var(--text-sm);
  font-weight: 400;
  color: rgba(239, 239, 239, 0.5);
`;

const Event: React.FC<EventProps> = ({ imageSrc, title, date, subtitle, description, id }) => {
  // Create a URL-friendly event slug from the title
  const slug = title?.toLowerCase().replace(/\s+/g, '-') || 'event';
  
  // Truncate description to 70 characters with ellipses
  const truncatedDescription = description 
    ? description.length > 70 
      ? description.substring(0, 70) + '...'
      : description
    : "";
  
  return (
    <Link 
      href={`/events/${slug}`}
      style={{ textDecoration: 'none' }}
    >
      <EventCardWrapper>
        <EventImageWrapper>
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'rgba(239, 239, 239, 0.1)' }} />
          )}
        </EventImageWrapper>
        
        <EventContent>
          <div>
            <EventTitle>{title}</EventTitle>
            <EventDescription>
              {truncatedDescription}
            </EventDescription>
          </div>
          <EventDate>{date}</EventDate>
        </EventContent>
      </EventCardWrapper>
    </Link>
  );
};

export default Event;
