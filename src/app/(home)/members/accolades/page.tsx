"use client";

import Link from "next/link";
import styled from "styled-components";
import PortalShell from "@/components/Members/PortalShell";

// Per spec, accolades currently link back to the main VEST site sections.
// When we add dedicated portal-only accolades, replace the cards below.
const ACCOLADE_LINKS: { href: string; label: string; description: string }[] = [
  {
    href: "/about",
    label: "About VEST",
    description: "Mission, values, and how we’re scaling builder culture at UCLA.",
  },
  {
    href: "/team",
    label: "Team",
    description: "Meet the current board and class behind VEST.",
  },
  {
    href: "/events",
    label: "Events",
    description: "Speaker series, demo nights, and recruiting events.",
  },
  {
    href: "/timeline",
    label: "Timeline",
    description: "VEST history and milestones since founding.",
  },
];

export default function AccoladesPage() {
  return (
    <main>
      <PortalShell
        title={
          <>
            VEST <span className="italic">Accolades</span>
          </>
        }
        subtitle="Awards, milestones, and recognition. Most live on the main VEST site — jump straight to them below."
      >
        <Grid>
          {ACCOLADE_LINKS.map((l) => (
            <CardLink key={l.href} href={l.href}>
              <CardLabel>{l.label}</CardLabel>
              <CardDesc>{l.description}</CardDesc>
              <Arrow>→</Arrow>
            </CardLink>
          ))}
        </Grid>
      </PortalShell>
    </main>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CardLink = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
  border-radius: 20px;
  text-decoration: none;
  color: inherit;
  background: linear-gradient(
    90deg,
    rgba(30, 70, 200, 0.18) 0%,
    rgba(50, 30, 110, 0.18) 100%
  );
  box-shadow: inset 0 0 30px 0 rgba(239, 239, 239, 0.12);
  position: relative;
  transition: transform 200ms ease, box-shadow 200ms ease;
  will-change: transform;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: inset 0 0 30px 0 rgba(239, 239, 239, 0.22),
        0 8px 24px rgba(31, 0, 255, 0.18);
    }
  }
`;

const CardLabel = styled.span`
  font-size: var(--text-xl);
  color: #efefef;
  font-weight: 600;
`;

const CardDesc = styled.span`
  font-size: var(--text-sm);
  color: rgba(239, 239, 239, 0.7);
  line-height: 1.5;
`;

const Arrow = styled.span`
  position: absolute;
  top: 24px;
  right: 24px;
  color: rgba(173, 206, 255, 0.85);
  font-size: var(--text-lg);
`;
