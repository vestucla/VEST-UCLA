"use client";
import { styled } from "styled-components";

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
  gap: 60px;
  
  @media (max-width: 768px) {
    gap: 40px;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
  }
`;

export const HeaderTitle = styled.h2`
  font-family: var(--header-font-regular);
  font-size: var(--header-size-page);
  font-weight: 400;
  line-height: 1;
  max-width: 594px;
  flex-shrink: 0;
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
    max-width: 100%;
  }
`;

export const HeaderDescription = styled.p`
  font-size: var(--text-xxl);
  font-weight: 400;
  line-height: 1.5;
  color: #efefef;
  max-width: 594px;
  
  @media (max-width: 768px) {
    max-width: 100%;
    font-size: var(--text-lg);
  }
`;

export const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 28px 30px;
  border-radius: 24px;
  background: linear-gradient(90deg, rgba(30, 70, 200, 0.2) 0%, rgba(50, 30, 110, 0.2) 100%);
  box-shadow: inset 0px 0px 30px 0px rgba(239, 239, 239, 0.15);
  position: relative;

  @media (max-width: 768px) {
    padding: 20px;
    gap: 16px;
  }
`;

export const CardIcon = styled.div`
  color: rgb(0, 140, 255);
`;

export const CardTitle = styled.h3`
  font-size: var(--text-xxl);
  font-weight: 600;
  line-height: 1.5;
  color: #efefef;
  
  @media (max-width: 768px) {
    font-size: var(--text-base);
  }
`;

export const CardDescription = styled.p`
  font-size: var(--text-base);
  font-weight: 400;
  line-height: 1.5;
  color: rgba(239, 239, 239, 0.7);
  
  @media (max-width: 768px) {
    font-size: var(--text-sm);
  }
`;

// Legacy exports for backwards compatibility
export const Header = styled.div``;
export const HeaderContainer = styled.div``;
export const Edges = styled.div``;
export const Edge = styled.div``;
export const Title = styled.div``;
export const BriefNote = styled.div``;
export const BannerCtn = styled.div``;
