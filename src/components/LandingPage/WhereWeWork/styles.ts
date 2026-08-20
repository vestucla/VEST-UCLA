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
  gap: 36px;
  
  @media (max-width: 768px) {
    gap: 24px;
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

export const ImageCard = styled.div`
  padding: 20px 24px;
  border-radius: 36px;
  background: linear-gradient(90deg, rgba(30, 70, 200, 0.2) 0%, rgba(50, 30, 110, 0.2) 100%);
  box-shadow: inset 0px 0px 30px 0px rgba(239, 239, 239, 0.15);
  
  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 24px;
  }
`;

// Legacy exports
export const Subtitle = styled.p``;
export const ImageContainer = styled.div``;
