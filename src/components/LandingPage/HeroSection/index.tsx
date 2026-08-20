"use client";
import Image from "next/image";
import Link from "next/link";
import { Rocket, ArrowRight } from "@phosphor-icons/react";
import {
  Wrapper,
  Inner,
  HeroContent,
  HeroBadge,
  HeroTitle,
  HeroDescription,
  HeroButton,
  HeroImageContainer,
  BackgroundGlow,
} from "./styles";

const HeroSection = () => {
  return (
    <Wrapper>
      <BackgroundGlow />
      <Inner>
        <HeroContent>
          <HeroBadge>
            <Rocket size={16}/>
            <span>UCLA&apos;s Builder/Startup Community</span>
          </HeroBadge>
          
          <HeroTitle>
            Build the<span className="italic"> Future.</span>
          </HeroTitle>
          
          <HeroDescription>
            Cultivating a startup ecosystem at UCLA.
            <br />
            A community of builders.
          </HeroDescription>
          
          <Link href="/about" passHref>
            <HeroButton>
              <span>What We Do</span>
              <ArrowRight size={20} weight="bold" />
            </HeroButton>
          </Link>
        </HeroContent>
        
        <HeroImageContainer>
          <Image
            src="/images/VEST-Glass-Trans.png"
            alt="VEST 3D Glass Logo"
            width={600}
            height={665}
            priority
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </HeroImageContainer>
      </Inner>
    </Wrapper>
  );
};

export default HeroSection;
