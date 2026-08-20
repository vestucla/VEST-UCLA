"use client";
import { styled } from "styled-components";

export const Wrapper = styled.section`
  width: 100%;
  padding-top: 160px;
  padding-bottom: 100px;

  @media (max-width: 768px) {
    padding-top: 120px;
    padding-bottom: 60px;
  }
`;

export const Inner = styled.div`
  width: 90%;
  max-width: 1236px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
  max-width: 800px;
  margin-bottom: 60px;

  h1 {
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
  }

  p {
    color: rgba(239, 239, 239, 0.8);
    font-size: var(--text-xxl);
    font-weight: 400;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    margin-bottom: 40px;
    gap: 16px;

    h1 {
      font-size: var(--header-size-page-mobile);
    }

    p {
      font-size: var(--text-lg);
    }
  }
`;

export const TimelineContainer = styled.div`
  position: relative;
  width: 100%;
  height: 40rem;
  margin: 0 auto;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(90deg, rgba(30, 70, 200, 0.2) 0%, rgba(50, 30, 110, 0.2) 100%);
  box-shadow: inset 0px 0px 30px 0px rgba(239, 239, 239, 0.15);

  img {
    object-fit: contain;
  }

  @media (max-width: 768px) {
    height: 25rem;
    border-radius: 16px;
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
