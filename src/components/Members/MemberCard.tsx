"use client";

import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import type { Member } from "@/lib/members";

interface Props {
  member: Member;
  href?: string;
}

export default function MemberCard({ member, href }: Props) {
  const target = href ?? `/members/${member.id}`;
  const topCompanies = (member.companies ?? []).slice(0, 3);

  return (
    <CardLink href={target}>
      <ImageWrap>
        {member.imageSrc ? (
          <Image
            src={member.imageSrc}
            alt={`${member.firstName} ${member.lastName}`}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <Placeholder>
            {member.firstName[0]}
            {member.lastName[0]}
          </Placeholder>
        )}
      </ImageWrap>

      <Body>
        <Name>
          {member.firstName} {member.lastName}
        </Name>
        <Role>{member.vestTitle}</Role>

        {topCompanies.length > 0 && (
          <Tags>
            {topCompanies.map((c) => (
              <Tag key={c}>{c}</Tag>
            ))}
          </Tags>
        )}
      </Body>
    </CardLink>
  );
}

const CardLink = styled(Link)`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 24px;
  background: linear-gradient(
    90deg,
    rgba(30, 70, 200, 0.2) 0%,
    rgba(50, 30, 110, 0.2) 100%
  );
  box-shadow: inset 0 0 30px 0 rgba(239, 239, 239, 0.15);
  overflow: hidden;
  padding: 20px;
  text-decoration: none;
  color: inherit;
  transition: transform 200ms ease, box-shadow 200ms ease;
  will-change: transform;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: inset 0 0 30px 0 rgba(239, 239, 239, 0.25),
        0 8px 24px rgba(31, 0, 255, 0.18);
    }
  }
`;

const ImageWrap = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 16px;
  background: rgba(239, 239, 239, 0.1);
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(239, 239, 239, 0.6);
  font-family: var(--header-font-regular);
  font-size: 2rem;
  letter-spacing: 0.05em;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 18px;
`;

const Name = styled.h3`
  font-size: var(--text-xl);
  font-weight: 600;
  line-height: 1.3;
  color: #efefef;
  @media (max-width: 768px) {
    font-size: var(--text-base);
  }
`;

const Role = styled.p`
  font-size: var(--text-sm);
  color: rgba(239, 239, 239, 0.7);
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
`;

const Tag = styled.span`
  font-size: var(--text-xs);
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(239, 239, 239, 0.08);
  color: rgba(239, 239, 239, 0.85);
  border: 1px solid rgba(239, 239, 239, 0.15);
`;
