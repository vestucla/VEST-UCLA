"use client";
import { styled } from "styled-components";
import { motion } from "framer-motion";

export const Wrapper = styled.div`
  width: 100%;
  padding: 160px 0 100px;

  @media (max-width: 768px) {
    padding: 120px 0 60px;
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

export const HeaderText = styled.h1`
  font-family: var(--header-font-regular);
  font-size: var(--header-size-page);
  font-weight: 400;
  line-height: 1;
  max-width: 800px;
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

export const Accordion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const AccordionItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 16px;
  background: linear-gradient(90deg, rgba(30, 70, 200, 0.15) 0%, rgba(50, 30, 110, 0.15) 100%);
  box-shadow: inset 0px 0px 20px 0px rgba(239, 239, 239, 0.07);
  overflow: hidden;
  transition: background 0.3s ease;
  
  &:hover {
    background: linear-gradient(90deg, rgba(30, 70, 200, 0.2) 0%, rgba(50, 30, 110, 0.2) 100%);
  }
`;

export const Question = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: var(--text-xl);
  font-weight: 500;
  color: #efefef;
  gap: 16px;

  svg {
    color: rgb(0, 140, 255);
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: var(--text-base);
  }
`;

export const Answer = styled(motion.div)`
  color: rgba(239, 239, 239, 0.7);
  font-size: var(--text-lg);
  font-weight: 400;
  line-height: 1.5;
  padding-top: 16px;
  
  @media (max-width: 768px) {
    font-size: var(--text-base);
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
