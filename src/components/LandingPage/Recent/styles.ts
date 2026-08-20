"use client";
import { styled } from "styled-components";
import Link from "next/link";

export const Wrapper = styled.section`
  width: 100%;
  padding: 100px 0;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 40px 0;
  }
`;

export const Inner = styled.div`
  width: 90%;
  max-width: 1236px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 48px;
  
  @media (max-width: 768px) {
    gap: 32px;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Title = styled.h2`
  font-family: var(--header-font-regular);
  font-size: var(--header-size-page);
  font-weight: 400;
  line-height: 1;
  background: var(--header-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  .italic {
    font-family: var(--header-font-italic);
    font-style: italic;
    font-weight: 400;
  }
  
  @media (max-width: 768px) {
    font-size: var(--header-size-page-mobile);
  }
`;

export const ViewAllLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 30px;
  border-radius: 24px;
  background: linear-gradient(180deg, #0074e1 0%, #1f00ff 100%);
  box-shadow: 0px 0px 30px 0px #7843ff, inset 0px 0px 8px 0px #efefef;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  span {
    color: #efefef;
    font-size: var(--text-xl);
    font-weight: 400;
  }
  
  svg {
    color: #efefef;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 0px 40px 0px #7843ff, inset 0px 0px 8px 0px #efefef;
  }
  
  @media (max-width: 768px) {
    padding: 12px 20px;
    border-radius: 16px;
    
    span {
      font-size: var(--text-base);
    }
  }
`;

export const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const EventCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: linear-gradient(90deg, rgba(30, 70, 200, 0.2) 0%, rgba(50, 30, 110, 0.2) 100%);
  box-shadow: inset 0px 0px 30px 0px rgba(239, 239, 239, 0.15);
  overflow: hidden;
`;

export const EventImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
`;

export const EventContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  flex: 1;
  gap: 16px;
`;

export const EventTitle = styled.h3`
  font-size: var(--text-xxl);
  font-weight: 600;
  line-height: 1.5;
  color: #efefef;
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: var(--text-lg);
  }
`;

export const EventDescription = styled.p`
  font-size: var(--text-base);
  font-weight: 400;
  line-height: 1.5;
  color: rgba(239, 239, 239, 0.7);
  
  @media (max-width: 768px) {
    font-size: var(--text-sm);
  }
`;

export const EventDate = styled.span`
  font-size: var(--text-sm);
  font-weight: 400;
  color: rgba(239, 239, 239, 0.5);
`;

// Legacy exports
export const EventsContainer = styled.div``;
export const Subtitle = styled.p``;
