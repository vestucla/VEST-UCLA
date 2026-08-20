import React, { useState } from "react";
import styled from "styled-components";
import { useIsMobile } from "../../libs/useIsMobile";

const images = [
  "/images/JoinUs/PokerNight.jpg",
  "/images/JoinUs/MatchaGroupPic.jpg",
  "/images/JoinUs/a16zOfficeVisit.jpg",
  "/images/JoinUs/a16zOutside.jpg",
  "/images/JoinUs/TacoNight.jpg",
  "/images/JoinUs/Pickleball.jpg",
];

const CarouselWrapper = styled.div<{ $isMobile: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px auto;
  position: relative;
  min-height: ${({ $isMobile }) => $isMobile ? '300px' : '400px'};
  overflow: visible;
  max-width: ${({ $isMobile }) => $isMobile ? 'calc(100vw - 32px)' : '800px'};
  z-index: 3;
  padding: ${({ $isMobile }) => $isMobile ? '0 16px' : '0'};
  @media (max-width: 768px) {
    margin: 0 auto;
  }
`;

interface CarouselImageProps {
  $position: "left" | "center" | "right";
  $isAnimating: boolean;
  $isMobile: boolean;
}

const CarouselImage = styled.img<CarouselImageProps>`
  border-radius: 16px;
  background: #e7eaf1;
  color: #222;
  object-fit: cover;
  box-shadow: 0 6px 32px 0 rgba(0,0,0,0.10);
  position: absolute;
  left: 50%;
  top: 50%;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  transform: translate(
    ${({ $position, $isMobile }) => {
      if ($isMobile) {
        if ($position === "left") return "-120%";
        if ($position === "center") return "-50%";
        if ($position === "right") return "20%";
      } else {
        if ($position === "left") return "-140%";
        if ($position === "center") return "-50%";
        if ($position === "right") return "40%";
      }
      return "0";
    }},
    -50%
  ) scale(
    ${({ $position }) => {
      if ($position === "center") return "1.1";
      return "0.8";
    }}
  );
  
  width: ${({ $position, $isMobile }) => {
    if ($isMobile) {
      return $position === "center" ? "280px" : "200px";
    }
    return $position === "center" ? "480px" : "370px";
  }};
  height: ${({ $position, $isMobile }) => {
    if ($isMobile) {
      return $position === "center" ? "200px" : "150px";
    }
    return $position === "center" ? "350px" : "270px";
  }};
  opacity: ${({ $position }) => $position === "center" ? 1 : 0.7};
  filter: ${({ $position }) => 
    $position === "center" 
      ? "none" 
      : "brightness(0.9) contrast(0.95)"};
  z-index: ${({ $position }) => ($position === "center" ? 2 : 1)};
  cursor: ${({ $position }) => ($position !== "center" ? "pointer" : "default")};
  
  &:hover {
    ${({ $position, $isAnimating }) => 
      $position !== "center" && !$isAnimating && `
        opacity: 0.85;
        filter: brightness(0.95) contrast(1);
      `
    }
  }
  
  &:active {
    ${({ $position, $isAnimating }) => 
      $position !== "center" && !$isAnimating && `
        transform: translate(
          ${$position === "left" ? "-122%" : "18%"}, 
          -50%
        ) scale(0.78);
      `
    }
  }
`;

const ImageCarousel: React.FC = () => {
  const [activeIndices, setActiveIndices] = useState({
    left: 2,
    center: 0,
    right: 1
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const isMobile = useIsMobile();

  const rotateRight = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    setActiveIndices(prev => ({
      left: prev.center,
      center: prev.right,
      right: (prev.right + 1) % images.length
    }));
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 400); // Match this with CSS transition duration
  };
  
  const rotateLeft = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    setActiveIndices(prev => ({
      left: (prev.left - 1 + images.length) % images.length,
      center: prev.left,
      right: prev.center
    }));
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 400); // Match this with CSS transition duration
  };

  return (
    <CarouselWrapper $isMobile={isMobile}>
      <CarouselImage
        src={images[activeIndices.left]}
        alt="carousel-left"
        $position="left"
        onClick={rotateLeft}
        $isAnimating={isAnimating}
        $isMobile={isMobile}
      />
      <CarouselImage
        src={images[activeIndices.center]}
        alt="carousel-center"
        $position="center"
        $isAnimating={isAnimating}
        $isMobile={isMobile}
      />
      <CarouselImage
        src={images[activeIndices.right]}
        alt="carousel-right"
        $position="right"
        onClick={rotateRight}
        $isAnimating={isAnimating}
        $isMobile={isMobile}
      />
    </CarouselWrapper>
  );
};

export default ImageCarousel;