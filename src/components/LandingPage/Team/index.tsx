"use client";

import Image from "next/image";
import Board from "@/components/ui/Board";
import Builder from "@/components/ui/Builder";
import {
  Wrapper,
  Inner,
  ContentContainer,
  TeamHeader,
  GroupPhotoContainer,
  TeamDescription,
  SectionTitle,
  BoardSection,
  ClassSection,
  MembersGrid,
  BlurCircle,
  BoardCard,
  BackgroundGlow,
  TextContainer,
  TeamTitle
} from "./styles";

// Board members data
const boardMembers = [
  { id: 1, firstName: "Kiersten", lastName: "Roth", role: "President", imageSrc: "/images/Headshots/Kiersten-Roth.jpg" },
  { id: 2, firstName: "Shloak", lastName: "Rathod", role: "External Vice President", imageSrc: "/images/Headshots/Shloak-Rathod.jpg" },
  { id: 3, firstName: "Vijay", lastName: "Karthikeyan", role: "Internal Vice President", imageSrc: "/images/Headshots/Vijay-Karthikeyan.png" },
  { id: 4, firstName: "Kevin", lastName: "Taylor", role: "Head of Membership", imageSrc: "/images/Headshots/Kevin-Taylor.png" },
  { id: 5, firstName: "Raman", lastName: "Arora", role: "Head of Membership", imageSrc: "/images/Headshots/Raman-Arora.png" },
  { id: 6, firstName: "Angelina", lastName: "Wu", role: "Head of Media", imageSrc: "/images/Headshots/Angelina-Wu.PNG" },
  { id: 7, firstName: "Ashley", lastName: "Varghese", role: "Director of Outreach", imageSrc: "/images/Headshots/Ashley-Varghese.png" },
  { id: 8, firstName: "Samuel", lastName: "Zhang", role: "Video Intern", imageSrc: "/images/Headshots/Samuel-Zhang.png" },
  { id: 9, firstName: "Tyler", lastName: "Xiao", role: "Director of Finance", imageSrc: "/images/Headshots/Tyler-Xiao.png" },
  { id: 10, firstName: "Mahesh", lastName: "Karthikeyan", role: "Finance Intern", imageSrc: "/images/Headshots/Mahesh-Karthikeyan.png" }
];

// Sample class members data
const classMembers = [
  { id: 1, firstName: "First", lastName: "Last", imageSrc: "" },
  { id: 2, firstName: "First", lastName: "Last", imageSrc: "" },
  { id: 3, firstName: "First", lastName: "Last", imageSrc: "" },
  { id: 4, firstName: "First", lastName: "Last", imageSrc: "" },
  { id: 5, firstName: "First", lastName: "Last", imageSrc: "" },
  { id: 6, firstName: "First", lastName: "Last", imageSrc: "" },
  { id: 7, firstName: "First", lastName: "Last", imageSrc: "" },
  { id: 8, firstName: "First", lastName: "Last", imageSrc: "" }
];

const Team = () => {
  return (
    <Wrapper>
      <BackgroundGlow />
      <Inner>
        <ContentContainer>
          <TeamHeader>
            Meet the <span className="italic">Team</span>
          </TeamHeader>

          <TextContainer>
            <TeamTitle>
              Talent that drives impact.
            </TeamTitle>
            <TeamDescription>
            <p>
              VEST brings together 40 of UCLA's most talented students, carefully
              selected through a competitive process where fewer than 1 in 10
              applicants are accepted into our club.
            </p>
            <p>
              Our members have worked at industry leaders such as Google, Snap,
              Paramount, Amazon, Jane Street, Cursor, Etched, Northrop, Deloitte,
              Mercor, Anduril, Stripe, CAT, and Leidos.
            </p>
            </TeamDescription>
          </TextContainer>
       
          <GroupPhotoContainer>
            {/* Placeholder for group photo */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              <Image 
                src="/images/Group-2.jpg" 
                alt="VEST Board" 
                width={1200}
                height={800}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '12px'
                }}
                priority
              />
            </div>
          </GroupPhotoContainer>

          
          
          <BoardSection>
            <SectionTitle className="text-left">Meet Our Board</SectionTitle>
            <MembersGrid>
              {boardMembers.map((member) => (
                <BoardCard key={member.id}>
                  <Board
                    firstName={member.firstName}
                    lastName={member.lastName}
                    role={member.role}
                    imageSrc={member.imageSrc}
                  />
                </BoardCard>
              ))}
            </MembersGrid>
          </BoardSection>
          
          {/* <ClassSection>
            <SectionTitle className="text-left">2024-2025 Class</SectionTitle>
            <MembersGrid>
              {classMembers.map((member) => (
                <BoardCard key={member.id}>
                  <Builder
                    firstName={member.firstName}
                    lastName={member.lastName}
                    imageSrc={member.imageSrc}
                  />
                </BoardCard>
              ))}
            </MembersGrid>
          </ClassSection> */}
        </ContentContainer>
      </Inner>
      <BlurCircle />
    </Wrapper>
  );
};

export default Team;
