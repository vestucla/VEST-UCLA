"use client";
import { styled } from "styled-components";

export const Wrapper = styled.footer`
  width: 100%;
  padding: 80px 0 40px;
  position: relative;
  border-top: 1px solid rgba(239, 239, 239, 0.1);
  
  @media (max-width: 768px) {
    padding: 60px 0 32px;
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

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 60px;
  
  @media (max-width: 768px) {
    gap: 40px;
  }
`;

export const LogoSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  gap: 12px;
  
  a {
    display: block;
    transition: opacity 0.2s ease;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const LogoTitle = styled.h1`
  font-family: var(--header-font-regular);
  font-size: var(--header-size-subsection);
  font-weight: 400;
  background: var(--header-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  
  .italic {
    font-family: var(--header-font-italic);
    font-style: italic;
    font-weight: 400;
  }
  
  @media (max-width: 768px) {
    font-size: var(--header-size-subsection-mobile);
  }
`;

export const NavSection = styled.div`
  display: flex;
  gap: 80px;
  
  @media (max-width: 768px) {
    gap: 48px;
  }
`;

export const NavColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const NavTitle = styled.h4`
  font-size: var(--text-base);
  font-weight: 600;
  color: rgba(239, 239, 239, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  a {
    font-size: var(--text-base);
    font-weight: 400;
    color: rgba(239, 239, 239, 0.5);
    text-decoration: none;
      
    &.active {
      color: #efefef;
    }
    
    &:hover,
    &.active:hover {
      color: #efefef;
    }
    
    @media (max-width: 768px) {
      font-size: var(--text-sm);
    }
  }
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

export const SocialSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 24px;
  
  @media (max-width: 768px) {
    align-items: flex-end;
    gap: 20px;
  }
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: 20px;
  
  a {
    color: #efefef;
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      color: rgb(0, 140, 255);
    }
    
    svg {
      width: 32px;
      height: 32px;
      
      @media (max-width: 768px) {
        width: 24px;
        height: 24px;
      }
    }
  }

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

export const NewsletterButton = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 30px;
  border-radius: 24px;
  background: linear-gradient(180deg, #0074e1 0%, #1f00ff 100%);
  box-shadow: 0px 0px 30px 0px #7843ff, inset 0px 0px 8px 0px #efefef;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  span {
    color: #efefef;
    font-size: var(--text-xl);
    font-weight: 400;
  }
  
  svg {
    color: #efefef;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 0px 40px 0px #7843ff, inset 0px 0px 8px 0px #efefef;
  }
  
  @media (max-width: 768px) {
    padding: 12px 20px;
    border-radius: 16px;
    
    span {
      font-size: var(--text-base);
    }
  }
`;

export const BottomSection = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 32px;
  border-top: 1px solid rgba(239, 239, 239, 0.1);
`;

export const Copyright = styled.p`
  font-size: var(--text-sm);
  font-weight: 400;
  color: rgba(239, 239, 239, 0.5);
`;

// Legacy exports
export const Wrapper2 = styled.footer``;
export const Inner2 = styled.div``;
export const ItemContainer = styled.div``;
export const LeftDiv = styled.div``;
export const CenterDiv = styled.div``;
export const RightDiv = styled.div``;
export const Column = styled.div``;
export const ColumnTitle = styled.div``;
export const ColumnItem = styled.div``;
