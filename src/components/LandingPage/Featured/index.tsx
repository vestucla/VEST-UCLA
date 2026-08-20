'use client';
import Image from 'next/image';
import { animate, motion, useMotionValue } from 'framer-motion';
import { Wrapper, Inner, LogoTrack, Title } from './styles';
import { useEffect, useState } from 'react';
import useMeasure from 'react-use-measure';
import { useIsMobile } from '../../../../libs/useIsMobile';

const Featured = () => {
  const isMobile = useIsMobile();
  const FAST_DURATION = isMobile ? 15 : 25;
  const SLOW_DURATION = isMobile ? 45 : 75;
  const [duration, setDuration] = useState(FAST_DURATION);
  const [ref, bounds] = useMeasure();
  const xTranslation = useMotionValue(0);
  const [mustFinish, setMustFinish] = useState(false);
  const [rerender, setRerender] = useState(false);

  // Update duration when mobile state changes
  useEffect(() => {
    if (!mustFinish) {
      setDuration(FAST_DURATION);
    }
  }, [isMobile, mustFinish, FAST_DURATION]);

  useEffect(() => {
    if (!bounds.width) return;

    let controls;
    const finalPosition = -bounds.width / 2;

    if (mustFinish) {
      controls = animate(xTranslation, [xTranslation.get(), finalPosition], {
        ease: "linear",
        duration: duration * (1 - xTranslation.get() / finalPosition),
        onComplete: () => {
          setMustFinish(false);
          setRerender(!rerender);
        },
      });
    } else {
      controls = animate(xTranslation, [0, finalPosition], {
        ease: "linear",
        duration: duration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
      });
    }

    return () => controls?.stop();
  }, [rerender, xTranslation, duration, bounds.width, mustFinish]);

  return (
    <Wrapper>
      <Inner>
        <Title>Trusted by Leading VCs, Startups, and Companies</Title>
        <LogoTrack>
          <motion.div
            style={{ x: xTranslation }}
            ref={ref}
            className="logo-slider"
            onHoverStart={() => {
              setMustFinish(true);
              setDuration(SLOW_DURATION);
            }}
            onHoverEnd={() => {
              setMustFinish(true);
              setDuration(FAST_DURATION);
            }}
          >
            {[1, 2].map((_, idx) => (
              <Image 
                key={idx}
                src="/images/Logo-Banner-white.png"
                alt="Companies we're trusted by"
                width={1800}
                height={100}
                className="logo-banner"
                priority
              />
            ))}
          </motion.div>
        </LogoTrack>
      </Inner>
    </Wrapper>
  );
};

export default Featured;
