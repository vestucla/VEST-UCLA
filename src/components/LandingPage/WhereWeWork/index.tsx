"use client";

import React from "react";
import Image from "next/image";
import {
  Wrapper,
  Inner,
  Title,
  ImageCard,
} from "./styles";

const WhereWeWork = () => {
  return (
    <Wrapper>
      <Inner>
        <Title>
          Where Our Members <span className="italic">Work</span>
        </Title>
        <ImageCard>
          <Image
            src="/images/VEST-Companies-White-091725.png"
            alt="Companies where VEST members work"
            width={2880}
            height={1652}
            priority={false}
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 1196px"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              borderRadius: "24px",
            }}
          />
        </ImageCard>
      </Inner>
    </Wrapper>
  );
};

export default WhereWeWork;
