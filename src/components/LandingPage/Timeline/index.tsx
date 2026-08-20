"use client";
import Image from "next/image";
import { Wrapper, Inner, Header, TimelineContainer, BackgroundGlow } from "./styles";
import MaskText from "@/components/Common/MaskText";
import { useIsMobile } from "../../../../libs/useIsMobile";
import {
  desktopHeaderPhrase,
  desktopParagraphPhrase,
  mobileHeaderPhrase,
  mobileParagraphPhrase,
} from "./constants";

const Timeline = () => {
  const isMobile = useIsMobile();

  return (
    <Wrapper>
      <BackgroundGlow />
      <Inner>
        <Header>
          {isMobile ? (
            <>
              <MaskText phrases={mobileHeaderPhrase} tag="h1" />
              <MaskText phrases={mobileParagraphPhrase} tag="p" />
            </>
          ) : (
            <>
              <MaskText phrases={desktopHeaderPhrase} tag="h1" />
              <MaskText phrases={desktopParagraphPhrase} tag="p" />
            </>
          )}
        </Header>
        <TimelineContainer>
          <Image
            src="https://utfs.io/f/rc1bTfWqlGiYXGTYmWsUCe89MQBvKqOZjtW13m04cyrdlhNY"
            alt="VEST Timeline"
            width={1200}
            height={600}
            style={{ 
              width: '100%',
              height: 'auto',
              maxHeight: '1600px',
              objectFit: 'contain'
            }}
            priority
          />
        </TimelineContainer>
      </Inner>
    </Wrapper>
  );
};

export default Timeline;
