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
import { useState, useEffect, useRef } from "react";
import { links } from "./constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import styled from "styled-components";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAdmin, signOut, loading } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
  };

  const userSlug = user?.firstName && user?.lastName 
    ? `${user.firstName.toLowerCase()}-${user.lastName.toLowerCase()}`
    : null;

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
            {!loading && !user && (
              <Link href="/members/login" onClick={closeMenu}>
                Member Login
              </Link>
            )}
            {!loading && user && (
              <>
                {userSlug && (
                  <Link href={`/members/edit/${userSlug}`} onClick={closeMenu}>
                    Edit Profile
                  </Link>
                )}
                {isAdmin && (
                  <Link href="/members/admin" onClick={closeMenu}>
                    Manage Users
                  </Link>
                )}
                <Link href="#" onClick={(e) => { e.preventDefault(); closeMenu(); handleSignOut(); }}>
                  Sign Out
                </Link>
              </>
            )}
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
        </NavMenu>

        <ProfileArea ref={dropdownRef}>
          {!loading && !user && (
            <LoginButton href="/members/login">
              Sign In
            </LoginButton>
          )}
          {!loading && user && (
            <>
              <ProfileCircle onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </ProfileCircle>
              {dropdownOpen && (
                <Dropdown>
                  <DropdownHeader>
                    <strong>{user.firstName} {user.lastName}</strong>
                    <span>{user.email}</span>
                    {isAdmin && <AdminBadge>Admin</AdminBadge>}
                  </DropdownHeader>
                  <DropdownDivider />
                  {userSlug && (
                    <DropdownItem href={`/members/edit/${userSlug}`} onClick={() => setDropdownOpen(false)}>
                      Edit Profile
                    </DropdownItem>
                  )}
                  <DropdownItem href="/members" onClick={() => setDropdownOpen(false)}>
                    Member Directory
                  </DropdownItem>
                  {isAdmin && (
                    <DropdownItem href="/members/admin" onClick={() => setDropdownOpen(false)}>
                      Manage Users
                    </DropdownItem>
                  )}
                  <DropdownDivider />
                  <DropdownButton onClick={handleSignOut}>
                    Sign Out
                  </DropdownButton>
                </Dropdown>
              )}
            </>
          )}
        </ProfileArea>
      </Inner>
    </Wrapper>
  );
};

export default Header;

const ProfileArea = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 16px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const LoginButton = styled(Link)`
  padding: 10px 20px;
  border-radius: 999px;
  background: rgba(173, 206, 255, 0.15);
  border: 1px solid rgba(173, 206, 255, 0.3);
  color: #fff;
  font-size: var(--text-sm);
  text-decoration: none;
  transition: all 200ms ease;
  
  &:hover {
    background: rgba(173, 206, 255, 0.25);
    border-color: rgba(173, 206, 255, 0.5);
  }
`;

const ProfileCircle = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(31, 0, 255, 0.6) 0%, rgba(120, 67, 255, 0.6) 100%);
  border: 2px solid rgba(173, 206, 255, 0.5);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;
  
  &:hover {
    border-color: rgba(173, 206, 255, 0.8);
    transform: scale(1.05);
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background: rgba(15, 15, 20, 0.95);
  border: 1px solid rgba(173, 206, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(20px);
  overflow: hidden;
  z-index: 300;
`;

const DropdownHeader = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  strong {
    color: #fff;
    font-size: var(--text-sm);
  }
  
  span {
    color: rgba(239, 239, 239, 0.6);
    font-size: var(--text-xs);
  }
`;

const AdminBadge = styled.span`
  display: inline-block;
  margin-top: 6px;
  padding: 3px 8px;
  background: rgba(255, 180, 50, 0.2);
  border: 1px solid rgba(255, 180, 50, 0.4);
  border-radius: 999px;
  color: rgb(255, 200, 100) !important;
  font-size: 10px !important;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: fit-content;
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: rgba(239, 239, 239, 0.1);
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 12px 16px;
  color: rgba(239, 239, 239, 0.85);
  font-size: var(--text-sm);
  text-decoration: none;
  transition: background 150ms ease;
  
  &:hover {
    background: rgba(173, 206, 255, 0.1);
    color: #fff;
  }
`;

const DropdownButton = styled.button`
  display: block;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  color: rgba(255, 120, 120, 0.85);
  font-size: var(--text-sm);
  text-align: left;
  cursor: pointer;
  transition: background 150ms ease;
  
  &:hover {
    background: rgba(255, 100, 100, 0.1);
    color: rgb(255, 140, 140);
  }
`;
