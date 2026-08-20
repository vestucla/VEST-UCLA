"use client";
import { styled } from "styled-components";

export const Wrapper = styled.section`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding-top: 60px;
  
  @media (max-width: 768px) {
    min-height: auto;
    padding: 100px 0 20px;
  }
`;

export const BackgroundGlow = styled.div`
  position: absolute;
  top: 0;
  left: -200px;
  width: 1600px;
  height: 800px;
  background: radial-gradient(ellipse at center, rgba(31, 0, 255, 0.15) 0%, rgba(0, 116, 225, 0.08) 40%, transparent 70%);
  pointer-events: none;
  z-index: 0;
`;

export const Inner = styled.div`
  width: 90%;
  max-width: 1236px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  max-width: 700px;
  
  @media (max-width: 768px) {
    align-items: center;
    max-width: 100%;
    gap: 20px;
  }
`;

export const HeroBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: 44px;
  border: 2px solid #1f00ff;
  background: linear-gradient(90deg, rgba(0, 76, 255, 0.3) 0%, rgba(39, 0, 147, 0.3) 100%);
  
  span {
    color: #efefef;
    font-size: var(--text-base);
    font-weight: 400;
  }
  
  svg {
    color:rgb(0, 140, 255);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    border-radius: 32px;
    gap: 8px;
    
    span {
      font-size: var(--text-sm);
    }
  }
`;

export const HeroTitle = styled.h1`
  font-family: var(--header-font-regular);
  font-size: var(--header-size-hero);
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
    font-size: var(--header-size-hero-mobile);
  }
`;

export const HeroDescription = styled.p`
  font-size: var(--text-xxl);
  font-weight: 400;
  line-height: 1.5;
  color: #efefef;
  
  @media (max-width: 768px) {
    font-size: var(--text-lg);
  }
`;

export const HeroButton = styled.button`
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

export const HeroImageContainer = styled.div`
  flex-shrink: 0;
  width: 500px;
  transform: rotate(4deg);
  
  @media (max-width: 768px) {
    width: 280px;
    transform: rotate(0deg);
  }
`;

// Legacy exports for backwards compatibility
export const ContentContainer = styled.div``;
export const HeroTextContainer = styled.div``;
export const BlurCircle = styled.div``;
