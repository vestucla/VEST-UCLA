"use client";

import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import type { Member } from "@/lib/members";
import { useAuth } from "@/lib/auth";

interface Props {
  member: Member;
}

export default function MemberProfile({ member }: Props) {
  const { isMember } = useAuth();

  return (
    <Layout>
      <Sidebar>
        <Avatar>
          {member.imageSrc ? (
            <Image
              src={member.imageSrc}
              alt={`${member.firstName} ${member.lastName}`}
              fill
              style={{ objectFit: "cover" }}
              sizes="320px"
              priority
            />
          ) : (
            <AvatarPlaceholder>
              {member.firstName[0]}
              {member.lastName[0]}
            </AvatarPlaceholder>
          )}
        </Avatar>

        <Name>
          {member.firstName} {member.lastName}
        </Name>
        <Role>{member.vestTitle}</Role>
        {member.classYear && <Meta>Class of {member.classYear}</Meta>}
        {member.joinedYear && <Meta>Joined VEST {member.joinedYear}</Meta>}

        <SocialList>
          {member.linkedin && (
            <SocialLink href={member.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </SocialLink>
          )}
          {member.twitter && (
            <SocialLink
              href={
                member.twitter.startsWith("http")
                  ? member.twitter
                  : `https://x.com/${member.twitter}`
              }
              target="_blank"
              rel="noreferrer"
            >
              X / Twitter
            </SocialLink>
          )}
          {member.github && (
            <SocialLink href={member.github} target="_blank" rel="noreferrer">
              GitHub
            </SocialLink>
          )}
          {member.website && (
            <SocialLink href={member.website} target="_blank" rel="noreferrer">
              Website
            </SocialLink>
          )}
        </SocialList>

        <ContactBlock>
          <ContactHeader>Contact</ContactHeader>
          {member.contact && (member.contact.email || member.contact.phone) ? (
            isMember ? (
              <ContactList>
                {member.contact.email && (
                  <li>
                    <a href={`mailto:${member.contact.email}`}>{member.contact.email}</a>
                  </li>
                )}
                {member.contact.phone && (
                  <li>
                    <a href={`tel:${member.contact.phone}`}>{member.contact.phone}</a>
                  </li>
                )}
              </ContactList>
            ) : (
              <ContactGated>
                <p>Email and phone are visible to logged-in VEST members.</p>
                <Link href="/members/login">Sign in →</Link>
              </ContactGated>
            )
          ) : (
            <Meta>No contact info on file.</Meta>
          )}
        </ContactBlock>
      </Sidebar>

      <MainCol>
        <OneLiner>{member.oneLiner}</OneLiner>
        {member.bio && <Bio>{member.bio}</Bio>}

        {member.interests.length > 0 && (
          <Section>
            <SectionTitle>Interests</SectionTitle>
            <TagRow>
              {member.interests.map((i) => (
                <Tag key={i}>{i}</Tag>
              ))}
            </TagRow>
          </Section>
        )}

        {member.experiences.length > 0 && (
          <Section>
            <SectionTitle>Experience</SectionTitle>
            <ExperienceList>
              {member.experiences.map((e, idx) => (
                <ExperienceItem key={`${e.company}-${idx}`}>
                  <ExperienceHead>
                    <CompanyName>{e.company}</CompanyName>
                    <DateRange>
                      {e.startDate ?? ""}
                      {e.startDate || e.endDate ? " — " : ""}
                      {e.endDate ?? (e.startDate ? "Present" : "")}
                    </DateRange>
                  </ExperienceHead>
                  <ExperienceRole>{e.role}</ExperienceRole>
                  {e.description && <ExperienceDesc>{e.description}</ExperienceDesc>}
                </ExperienceItem>
              ))}
            </ExperienceList>
          </Section>
        )}
      </MainCol>
    </Layout>
  );
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 48px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Avatar = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(
    90deg,
    rgba(30, 70, 200, 0.2) 0%,
    rgba(50, 30, 110, 0.2) 100%
  );
  box-shadow: inset 0 0 30px 0 rgba(239, 239, 239, 0.15);
`;

const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(239, 239, 239, 0.6);
  font-family: var(--header-font-regular);
  font-size: 4rem;
`;

const Name = styled.h2`
  font-family: var(--header-font-regular);
  font-size: var(--header-size-subsection);
  font-weight: 400;
  background: var(--header-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-top: 12px;
`;

const Role = styled.p`
  font-size: var(--text-base);
  color: rgba(239, 239, 239, 0.85);
`;

const Meta = styled.p`
  font-size: var(--text-sm);
  color: rgba(239, 239, 239, 0.6);
`;

const SocialList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const SocialLink = styled.a`
  font-size: var(--text-sm);
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(239, 239, 239, 0.15);
  color: #efefef;
  background: rgba(239, 239, 239, 0.05);
  text-decoration: none;
  transition: background 200ms ease, border-color 200ms ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: rgba(173, 206, 255, 0.15);
      border-color: rgba(173, 206, 255, 0.4);
    }
  }
`;

const ContactBlock = styled.div`
  margin-top: 16px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(239, 239, 239, 0.04);
  border: 1px solid rgba(239, 239, 239, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ContactHeader = styled.h4`
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(239, 239, 239, 0.55);
`;

const ContactList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;

  a {
    color: #efefef;
    font-size: var(--text-sm);
    text-decoration: none;
  }
  a:hover {
    color: rgba(173, 206, 255, 0.95);
  }
`;

const ContactGated = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: var(--text-sm);
  color: rgba(239, 239, 239, 0.7);

  a {
    color: rgba(173, 206, 255, 0.95);
    text-decoration: none;
  }
`;

const MainCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const OneLiner = styled.p`
  font-size: var(--text-xl);
  line-height: 1.4;
  color: #efefef;
`;

const Bio = styled.p`
  font-size: var(--text-base);
  line-height: 1.6;
  color: rgba(239, 239, 239, 0.85);
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-family: var(--header-font-regular);
  font-size: var(--header-size-subsection-mobile);
  font-weight: 400;
  background: var(--header-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  font-size: var(--text-xs);
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(239, 239, 239, 0.08);
  border: 1px solid rgba(239, 239, 239, 0.15);
  color: rgba(239, 239, 239, 0.85);
`;

const ExperienceList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ExperienceItem = styled.li`
  padding: 18px 20px;
  border-radius: 16px;
  background: rgba(239, 239, 239, 0.04);
  border: 1px solid rgba(239, 239, 239, 0.1);
`;

const ExperienceHead = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: baseline;
  flex-wrap: wrap;
`;

const CompanyName = styled.span`
  font-size: var(--text-base);
  font-weight: 600;
  color: #efefef;
`;

const DateRange = styled.span`
  font-size: var(--text-xs);
  color: rgba(239, 239, 239, 0.55);
`;

const ExperienceRole = styled.p`
  font-size: var(--text-sm);
  color: rgba(239, 239, 239, 0.8);
  margin-top: 4px;
`;

const ExperienceDesc = styled.p`
  font-size: var(--text-sm);
  color: rgba(239, 239, 239, 0.7);
  margin-top: 8px;
  line-height: 1.5;
`;
