"use client";
import { styled } from "styled-components";

export const Wrapper = styled.section`
  width: 100%;
  padding: 80px 0;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 60px 0;
  }
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
  
  @media (max-width: 768px) {
    gap: 40px;
  }
`;

export const Title = styled.h2`
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
  text-align: center;
  
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

export const LogoTrack = styled.div`
  width: 100%;
  overflow: hidden;
  
  .logo-slider {
    display: flex;
    gap: 0;
    align-items: center;
  }
  
  .logo-banner {
    height: 84px;
    width: auto;
    object-fit: contain;
    flex-shrink: 0;
    
    @media (max-width: 768px) {
      height: 48px;
    }
  }
`;

// Legacy export
export const ImageContainer = styled.div``;
