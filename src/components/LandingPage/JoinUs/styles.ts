"use client";
import styled from "styled-components";

export const JoinUsWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  padding-top: 120px;
  
  @media (max-width: 768px) {
    padding-top: 60px;
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

export const JoinUsTitle = styled.h1`
  font-family: var(--header-font-regular);
  font-size: var(--header-size-page);
  font-weight: 400;
  line-height: 1;
  text-align: center;
  margin-bottom: 60px;
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
    margin-bottom: 40px;
  }
`;

export const WhatWeDoTitle = styled.h2`
  font-family: var(--header-font-regular);
  font-size: var(--header-size-section);
  font-weight: 400;
  line-height: 1;
  margin-bottom: 40px;
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
    font-size: var(--header-size-section-mobile);
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

export const Subheading = styled.h2`
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
    width: 100%;
    margin-bottom: 0;
  }
`;

export const JoinUsText = styled.div`
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

export const PictureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin: 60px 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin: 40px 0 0;
  }
`;

export const PictureCard = styled.div`
  background: linear-gradient(90deg, rgba(30, 70, 200, 0.2) 0%, rgba(50, 30, 110, 0.2) 100%);
  box-shadow: inset 0px 0px 30px 0px rgba(239, 239, 239, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  aspect-ratio: 4/3;
  overflow: hidden;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

export const QuarterlySection = styled.div`
  display: flex;
  align-items: center;
  margin: 60px 0;
  padding: 40px;
  gap: 48px;
  background: linear-gradient(90deg, rgba(30, 70, 200, 0.2) 0%, rgba(50, 30, 110, 0.2) 100%);
  box-shadow: inset 0px 0px 30px 0px rgba(239, 239, 239, 0.15);
  border-radius: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 24px;
    padding: 32px 24px;
    margin: 40px 0;
  }
`;

export const QuarterlyVerticalLine = styled.div`
  width: 2px;
  height: 100px;
  background: linear-gradient(180deg, rgb(0, 140, 255) 0%, #2b75ff 100%);

  @media (max-width: 768px) {
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, rgb(0, 140, 255) 0%, #2b75ff 100%);
  }
`;

export const QuarterlyIcon = styled.div`
  font-size: var(--header-size-section);
  color: #efefef;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const QuarterlyText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

export const QuarterlyTitle = styled.h3`
  color: #efefef;
  font-size: var(--text-xxl);
  font-weight: 600;
  line-height: 1.5;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    text-align: center;
    font-size: var(--text-xl);
  }
`;

export const QuarterlyDesc = styled.p`
  color: #efefef;
  font-size: var(--text-lg);
  line-height: 1.5;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: var(--text-base);
  }
`;

export const ApplicationsClosed = styled.p`
  color: #efefef;
  font-size: var(--text-xl);
  line-height: 1.5;
  text-align: center;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: var(--text-lg);
  }
`;
export const ApplicationButton = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 30px;
  border-radius: 24px;
  background: linear-gradient(180deg, #0074e1 0%, #1f00ff 100%);
  box-shadow: 0px 0px 30px 0px #7843ff, inset 0px 0px 8px 0px #efefef;
  text-decoration: none;
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
  cursor: pointer;
  width: fit-content;
  
  span {
    color: #efefef;
    font-size: var(--text-xl);
    font-weight: 400;
  }
  
  svg {
    color: #efefef;
  }
  
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0px 0px 40px 0px #7843ff, inset 0px 0px 8px 0px #efefef;
    }
  }
  
  @media (max-width: 768px) {
    padding: 12px 20px;
    border-radius: 16px;
    
    span {
      font-size: var(--text-base);
    }
  }
`;
