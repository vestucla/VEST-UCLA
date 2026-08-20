"use client";
import styled from "styled-components";

export const EventDetailWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  padding-top: 40px;
  @media (max-width: 768px) {
    padding-top: 20px;
    min-height: auto;
  }
`;

export const Inner = styled.div`
  width: 90%;
  max-width: 1236px;
  margin: 0 auto;
  padding: 60px 0;
  
  @media (max-width: 768px) {
    padding: 40px 0;
  }
`;

export const ContentContainer = styled.div`
  width: 100%;
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

export const BlurCircle = styled.div`
  position: fixed;
  top: -400px;
  left: -200px;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(31, 0, 255, 0.3) 0%, rgba(120, 67, 255, 0.1) 50%, transparent 70%);
  border-radius: 50%;
  filter: blur(100px);
  z-index: -1;
  pointer-events: none;
`;

export const EventHeader = styled.h1`
  font-family: var(--header-font-regular);
  font-size: var(--header-size-page);
  font-weight: 400;
  line-height: 1;
  margin: 0 auto 4px;
  text-align: center;
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
    margin-top: 20px;
  }
`;

export const EventDate = styled.div`
  font-size: var(--text-sm);
  font-weight: 500;
  color: rgba(239, 239, 239, 0.5);
  margin-bottom: 40px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-align: center;
  
  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

export const TextContainer = styled.div`
  margin: 0 auto 60px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 32px;
  text-align: left;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
  }
`;

export const EventSubtitle = styled.h2`
  font-family: var(--header-font-regular);
  font-size: var(--header-size-subsection);
  font-weight: 400;
  background: var(--header-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  width: 500px;
  line-height: 1;
  
  .italic {
    font-family: var(--header-font-italic);
    font-style: italic;
    font-weight: 400;
  }
  
  @media (max-width: 768px) {
    font-size: var(--header-size-subsection-mobile);
    margin-bottom: 0;
    width: 100%;
  }
`;

export const EventDescription = styled.p`
  margin: 6px 0 60px;
  text-align: left;
  width: 100%;
  max-width: 750px;

  display: flex;
  flex-direction: column;
  gap: 16px;
  
  p {
    color: #efefef;
    font-size: var(--text-base);
    font-weight: 400;
    line-height: 1.5;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 40px;
    
    p {
      font-size: var(--text-sm);
    }
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto 60px;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(90deg, rgba(30, 70, 200, 0.2) 0%, rgba(50, 30, 110, 0.2) 100%);
  box-shadow: inset 0px 0px 30px 0px rgba(239, 239, 239, 0.15);
  position: relative;
  aspect-ratio: 16 / 10;
  
  @media (max-width: 768px) {
    margin-bottom: 40px;
    border-radius: 16px;
  }
`;

export const BackLink = styled.a`
  display: inline-flex;
  position: relative;
  left: 0;
  top: 0;
  align-items: center;
  margin-top: 40px;
  gap: 8px;
  font-size: var(--text-base);
  font-weight: 500;
  color: rgba(239, 239, 239, 0.7);
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 80px;
  }
  
  &:hover {
    color: #4299e1;
  }
  
  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.2s ease;
  }
  
  &:hover svg {
    transform: translateX(-4px);
  }
  
  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

export const NavigationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

