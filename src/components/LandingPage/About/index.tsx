"use client";
import React from "react";
import Image from "next/image";
import {
  AboutWrapper,
  AboutTitle,
  TopRow,
  AboutImage,
  AboutText,
  WelcomeTitle,
  StatsRow,
  StatBox,
  StatNumber,
  StatLabel,
  ImagesGrid,
  GridImage,
  Inner,
  BlurCircle,
  ContentContainer,
  AboutParagraph,
  BackgroundGlow,
  TextContainer,
  AboutDescription
} from "./styles";


const About = () => (
  <AboutWrapper>
    <BackgroundGlow />
    <Inner>
      <ContentContainer>
        <AboutTitle>
          About <span className="italic">VEST</span>
        </AboutTitle>
        <TextContainer>
          <WelcomeTitle>Welcome to VEST at UCLA.</WelcomeTitle>
          <AboutDescription>
            <p>
              VEST at UCLA is a club that accelerates builders that want 
              to start or join the next Unicorn company. We're hands on and 
              love to do things rather than just plan things.
            </p>
            <p>
              In our first quarter we hosted the founder of Zillow, a Thiel 
              Fellow, and the founder of Manus, got a private tour of the 
              new a16z office, got a Windsurf sponsorship, got dinner with 
              the Head of Dorm at Pear VC, and worked with companies backed 
              by YC and Neo.
            </p>
            <p>
              Some of our members raised over 2M+ in venture funding and 
              scaled projects to tens of thousands of users. We also have 
              engineers that were early at Cursor, Mercor, Etched, Browserbase, 
              Interaction, Polymarket, Vercel, Mercury, and more!
            </p>
          </AboutDescription>
        </TextContainer>
      {/* Commented out stats row for now because of the lack of data + looks too much like Bruin AI*/}
      {/* <StatsRow>
        <StatBox>
          <StatNumber>XX</StatNumber>
          <StatLabel>Company collaborations</StatLabel>
        </StatBox>
        <StatBox>
          <StatNumber>XX</StatNumber>
          <StatLabel>Events</StatLabel>
        </StatBox>
        <StatBox>
          <StatNumber>XX</StatNumber>
          <StatLabel>Products launched</StatLabel>
        </StatBox>
        <StatBox>
          <StatNumber>$XX</StatNumber>
          <StatLabel>Total valuations</StatLabel>
        </StatBox>
      </StatsRow> */}
      
      <ImagesGrid>
        <GridImage>
          <Image 
            src="/images/About/AptGroupPic.jpeg" 
            alt="VEST members at an apartment gathering" 
            fill 
            style={{ 
              objectFit: 'cover',
              borderRadius: '16px'
            }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </GridImage>
        <GridImage>
          <Image 
            src="/images/About/GM2.jpg" 
            alt="VEST general meeting" 
            fill 
            style={{ 
              objectFit: 'cover',
              borderRadius: '16px'
            }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </GridImage>
    
        <GridImage>
          <Image 
            src="/images/About/DrinkRobot.jpg" 
            alt="VEST members with drink robot" 
            fill 
            style={{ 
              objectFit: 'cover',
              borderRadius: '16px'
            }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </GridImage>
        <GridImage>
          <Image 
            src="/images/About/BowenXueTalk.jpg" 
            alt="Bowen Xue talking at VEST" 
            fill 
            style={{ 
              objectFit: 'cover',
              borderRadius: '16px'
            }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </GridImage>
      </ImagesGrid>
      </ContentContainer>
    </Inner>
    <BlurCircle />
  </AboutWrapper>
);

export default About;
