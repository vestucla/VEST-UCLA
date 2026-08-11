"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { useAuth } from "@/lib/auth";

interface Props {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}

const BASE_TABS = [
  { href: "/members", label: "Members" },
  { href: "/members/alumni", label: "Alumni" },
];

const ADMIN_TAB = { href: "/members/admin", label: "Manage" };

export default function PortalShell({ title, subtitle, children }: Props) {
  const pathname = usePathname();
  const { user, isAdmin, signOut } = useAuth();
  
  const tabs = isAdmin ? [...BASE_TABS, ADMIN_TAB] : BASE_TABS;

  return (
    <Wrapper>
      <BackgroundGlow />
      <Inner>
        <PageHeader>{title}</PageHeader>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}

        <TabsRow>
          <Tabs>
            {tabs.map((t) => {
              const active = pathname === t.href;
              return (
                <TabLink key={t.href} href={t.href} $active={active}>
                  {t.label}
                </TabLink>
              );
            })}
          </Tabs>
          <AuthSlot>
            {user ? (
              <>
                <UserBadge>{user.email}</UserBadge>
                <TextButton type="button" onClick={() => signOut()}>
                  Sign out
                </TextButton>
              </>
            ) : (
              <TabLink href="/members/login" $active={pathname === "/members/login"}>
                Member login
              </TabLink>
            )}
          </AuthSlot>
        </TabsRow>

        <Content>{children}</Content>
      </Inner>
      <BlurCircle />
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
  min-height: 100vh;
  position: relative;
  z-index: 1;
  padding-top: 120px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding-top: 80px;
  }
`;

const Inner = styled.div`
  width: 90%;
  max-width: 1236px;
  margin: 0 auto;
  padding: 60px 0;

  @media (max-width: 768px) {
    padding: 40px 0;
  }
`;

const BackgroundGlow = styled.div`
  position: absolute;
  top: 0;
  left: -200px;
  width: 1600px;
  height: 800px;
  background: radial-gradient(
    ellipse at center,
    rgba(31, 0, 255, 0.15) 0%,
    rgba(0, 116, 225, 0.08) 40%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
`;

const BlurCircle = styled.div`
  position: fixed;
  top: -400px;
  left: -200px;
  width: 800px;
  height: 800px;
  background: radial-gradient(
    circle,
    rgba(31, 0, 255, 0.3) 0%,
    rgba(120, 67, 255, 0.1) 50%,
    transparent 70%
  );
  border-radius: 50%;
  filter: blur(100px);
  z-index: -1;
  pointer-events: none;
`;

const PageHeader = styled.h1`
  font-family: var(--header-font-regular);
  font-size: var(--header-size-page);
  font-weight: 400;
  line-height: 1;
  background: var(--header-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  .italic {
    font-family: var(--header-font-italic);
    font-style: italic;
  }

  @media (max-width: 768px) {
    font-size: var(--header-size-page-mobile);
  }
`;

const Subtitle = styled.p`
  margin-top: 16px;
  max-width: 720px;
  color: rgba(239, 239, 239, 0.8);
  font-size: var(--text-base);
  line-height: 1.5;
`;

const TabsRow = styled.div`
  margin-top: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(239, 239, 239, 0.1);
  padding-bottom: 12px;
`;

const Tabs = styled.nav`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const AuthSlot = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TabLink = styled(Link)<{ $active: boolean }>`
  font-size: var(--text-sm);
  padding: 8px 14px;
  border-radius: 999px;
  text-decoration: none;
  color: ${({ $active }) => ($active ? "#fff" : "rgba(239, 239, 239, 0.7)")};
  background: ${({ $active }) => ($active ? "rgba(173, 206, 255, 0.18)" : "transparent")};
  border: 1px solid
    ${({ $active }) => ($active ? "rgba(173, 206, 255, 0.5)" : "transparent")};
  transition: background 200ms ease, color 200ms ease, border-color 200ms ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: #fff;
      background: rgba(239, 239, 239, 0.06);
    }
  }
`;

const UserBadge = styled.span`
  font-size: var(--text-xs);
  color: rgba(239, 239, 239, 0.7);
`;

const TextButton = styled.button`
  background: none;
  border: none;
  color: rgba(173, 206, 255, 0.85);
  font-size: var(--text-sm);
  cursor: pointer;
  padding: 0;
`;

const Content = styled.div`
  margin-top: 32px;
`;
