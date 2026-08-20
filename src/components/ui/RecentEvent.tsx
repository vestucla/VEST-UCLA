import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';

export interface EventProps {
  imageSrc?: string;
  title: string;
  date: string;
  description: string;
  slug: string;
}

const RecentEventWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  border-radius: 24px;
  background: linear-gradient(90deg, rgba(30, 70, 200, 0.2) 0%, rgba(50, 30, 110, 0.2) 100%);
  box-shadow: inset 0px 0px 30px 0px rgba(239, 239, 239, 0.15);
  overflow: hidden;
  padding: 20px;
  gap: 24px;
  margin-bottom: 20px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }
`;

const EventImageWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 16px;
  background: rgba(239, 239, 239, 0.1);
  
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 10;
  }
`;

const EventContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

const EventTitle = styled.h3`
  font-size: var(--text-xxl);
  font-weight: 600;
  line-height: 1.4;
  color: #efefef;
  
  @media (max-width: 768px) {
    font-size: var(--text-lg);
  }
`;

const EventDate = styled.span`
  font-size: var(--text-sm);
  font-weight: 400;
  color: rgba(239, 239, 239, 0.5);
  margin-top: 8px;
`;

const EventDescription = styled.p`
  font-size: var(--text-base);
  font-weight: 400;
  line-height: 1.5;
  color: rgba(239, 239, 239, 0.7);
  margin-top: 16px;
  
  @media (max-width: 768px) {
    font-size: var(--text-sm);
    margin-top: 12px;
  }
`;

const RecentEvent: React.FC<EventProps> = ({ imageSrc, title, date, description, slug }) => {
  return (
    <Link href={`/events/${slug}`} style={{ textDecoration: 'none' }}>
      <RecentEventWrapper>
        <EventImageWrapper>
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 200px"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'rgba(239, 239, 239, 0.1)' }} />
          )}
        </EventImageWrapper>
        <EventContent>
          <EventTitle>{title}</EventTitle>
          <EventDate>{date}</EventDate>
          <EventDescription>{description}</EventDescription>
        </EventContent>
      </RecentEventWrapper>
    </Link>
  );
};

export default RecentEvent;
