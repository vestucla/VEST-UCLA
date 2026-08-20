"use client";
import { Cpu, Stack, Graph } from "@phosphor-icons/react";
import {
  Wrapper,
  Inner,
  HeaderSection,
  HeaderTitle,
  HeaderDescription,
  CardsContainer,
  Card,
  CardIcon,
  CardTitle,
  CardDescription,
} from "./styles";

const features = [
  {
    icon: Cpu,
    title: "High-impact work",
    description: "VEST brings together the most talented group of builders who want to exceed the status quo.",
  },
  {
    icon: Stack,
    title: "Startup projects",
    description: "Gain hands-on experience working with early-stage startups on engineering, design, and marketing.",
  },
  {
    icon: Graph,
    title: "Tight-knit network",
    description: "Join a community of entrepreneurial students and build relationships with VCs and founders.",
  },
];

const Building = () => {
  return (
    <Wrapper>
      <Inner>
        <HeaderSection>
          <HeaderTitle>
            Building Future<span className="italic"> Founders</span>
          </HeaderTitle>
          <HeaderDescription>
            We connect ambitious UCLA students with venture capital firms and startups, providing hands-on experience and real-world learning.
          </HeaderDescription>
        </HeaderSection>
        
        <CardsContainer>
          {features.map((feature, index) => (
            <Card key={index}>
              <CardIcon>
                <feature.icon size={48} weight="duotone" />
              </CardIcon>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </Card>
          ))}
        </CardsContainer>
      </Inner>
    </Wrapper>
  );
};

export default Building;
