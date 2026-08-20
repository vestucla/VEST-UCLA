"use client";

import Image from "next/image";
import {
  Wrapper,
  Inner,
  LogoContainer,
  CallToActions,
  NavMenu,
  NavLink,
  BurgerMenu,
  MobileOverlay,
  MobileMenu,
} from "./styles";
import { GetStartedButton } from "@/components/LandingPage";
import { useState, useEffect } from "react";
import { links } from "./constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <Wrapper>
      <Inner>
        <LogoContainer>
          <Link href="/" className="mobile-logo">
            <Image
              src="/images/VEST-logo-white.svg"
              width={48}
              height={48}
              alt="VEST logo"
              priority
            />
          </Link>
          <BurgerMenu onClick={() => setIsOpen(!isOpen)} className={isOpen ? "open" : ""}>
            <span />
            <span />
            <span />
          </BurgerMenu>
        </LogoContainer>

        <MobileOverlay className={isOpen ? "active" : ""} onClick={closeMenu} />
        <MobileMenu className={isOpen ? "active" : ""}>
          <nav>
            {links.map((link, i) => (
              <Link
                key={i}
                href={link.url}
                className={pathname === link.url ? "active" : ""}
                onClick={closeMenu}
              >
                {link.linkTo}
              </Link>
            ))}
            <Link href="/hire" onClick={closeMenu}>
              Hire Us
            </Link>
          </nav>
          <CallToActions>
            <a
              href="https://discord.gg/PTGgbFvm9t"
              target="_blank"
              rel="noopener noreferrer"
              className="discord-btn"
              onClick={closeMenu}
            >
              Join Discord
            </a>
            <GetStartedButton padding="0.75rem" />
          </CallToActions>
        </MobileMenu>

        <NavMenu className="desktop">
          {links.map((link, i) => (
            <NavLink
              key={i}
              href={link.url}
              className={pathname === link.url ? "active" : ""}
            >
              {link.linkTo}
            </NavLink>
          ))}
          <NavLink href="/hire" className={pathname === "/hire" ? "active" : ""}>
            Hire Us
          </NavLink>
        </NavMenu>
        <CallToActions className="desktop">
          <a
            href="https://discord.gg/PTGgbFvm9t"
            target="_blank"
            rel="noopener noreferrer"
            className="discord-btn"
          >
            Join Discord
          </a>
          <GetStartedButton padding="0.5rem 0.75rem" />
        </CallToActions>
      </Inner>
    </Wrapper>
  );
};

export default Header;
