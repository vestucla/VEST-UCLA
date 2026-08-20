"use client";

import React from "react";
import { ArrowRight } from "@phosphor-icons/react";
import {
  JoinUsWrapper,
  JoinUsTitle,
  Subheading,
  JoinUsText,
  WhatWeDoTitle,
  QuarterlySection,
  QuarterlyIcon,
  QuarterlyTitle,
  QuarterlyText,
  QuarterlyDesc,
  QuarterlyVerticalLine,
  BlurCircle,
  Inner,
  BackgroundGlow,
  TextContainer,
  ApplicationButton,
  ApplicationsClosed,
} from "./styles";
import ImageCarousel from "../../imagecarousel";

const JoinUsComponent = () => {
  return (
    <JoinUsWrapper>
      <BackgroundGlow />
      <Inner>
        <JoinUsTitle>
          Join <span className="italic">Us</span>
        </JoinUsTitle>
        <TextContainer>
          <Subheading>Join UCLA's Premier Startup Organization.</Subheading>
          <JoinUsText>
            <p>Ready to build, learn, and grow alongside UCLA's startup community? At VEST, we're looking for curious, driven students who are excited to explore entrepreneurship—whether you're a first-time founder, a product thinker, or just startup-curious.</p>
            {/* UNCOMMENT WHEN APPLICATIONS ARE OPEN */}
            {/* <ApplicationButton 
              href="https://forms.gle/vqeGLvEAC2ny6mZq7" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <span>Apply for Winter 2026</span>
              <ArrowRight size={20} weight="bold" />
            </ApplicationButton> */}
            
          </JoinUsText>
        </TextContainer>
        <ApplicationsClosed>Applications are currently closed.</ApplicationsClosed>
        <ApplicationsClosed>Please check back in Fall 2026 for the next application cycle.</ApplicationsClosed>
        
        
        {/* <WhatWeDoTitle>What We Do</WhatWeDoTitle> */}
        <ImageCarousel />
      </Inner>
      <BlurCircle />
    </JoinUsWrapper>
  );
};

export default JoinUsComponent;
