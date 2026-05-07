// Static seed data for the VEST member portal.
// This is the v1 source of truth. Swap the lib/members.ts data layer to
// Supabase later — the Member shape mirrors what we want in the DB.

export type MemberStatus = "active" | "alumni";

export interface Experience {
  company: string;
  role: string;
  // ISO-like strings keep things simple for v1; Supabase migration can
  // promote these to date columns.
  startDate?: string; // "2024-06" or "Summer 2024"
  endDate?: string;   // undefined => current
  description?: string;
}

export interface Member {
  id: string;            // stable id, also the URL slug
  firstName: string;
  lastName: string;
  status: MemberStatus;

  // VEST-specific
  vestTitle: string;     // e.g. "President", "Builder", "Director of Recruitment"
  classYear?: string;    // e.g. "2026"
  joinedYear?: string;   // year they joined VEST

  // Profile content
  oneLiner: string;      // short bio / tagline
  imageSrc?: string;     // /images/Headshots/...
  bio?: string;          // longer paragraph for the profile page
  interests: string[];   // topical tags used by the search filters

  // Experiences (companies/roles) — used heavily for filtering
  experiences: Experience[];
  // Companies-derived helper. Computed in the data layer if not provided.
  companies?: string[];

  // Socials
  linkedin?: string;
  twitter?: string;      // X handle (without the @) or full url
  github?: string;
  website?: string;

  // Gated contact info — only visible to logged-in members.
  contact?: {
    email?: string;
    phone?: string;
  };
}

// ---------------------------------------------------------------------------
// Seed data. Replace / extend freely. Names + titles pulled from the existing
// Team/index.tsx so the portal stays in sync with the public site.
// ---------------------------------------------------------------------------
export const MEMBERS: Member[] = [
  {
    id: "kiersten-roth",
    firstName: "Kiersten",
    lastName: "Roth",
    status: "active",
    vestTitle: "President",
    classYear: "2026",
    joinedYear: "2023",
    oneLiner: "Builder + operator passionate about scaling early-stage companies.",
    imageSrc: "/images/Headshots/Kiersten-Roth.jpg",
    interests: ["Venture Capital", "Operations", "Consumer"],
    experiences: [
      { company: "VEST at UCLA", role: "President", startDate: "2024-09" },
    ],
    linkedin: "https://www.linkedin.com/in/kierstenroth",
    contact: { email: "kiersten@vestucla.com" },
  },
  {
    id: "shloak-rathod",
    firstName: "Shloak",
    lastName: "Rathod",
    status: "active",
    vestTitle: "Vice President",
    classYear: "2026",
    joinedYear: "2023",
    oneLiner: "Engineer-turned-investor focused on AI infra.",
    imageSrc: "/images/Headshots/Shloak-Rathod.jpg",
    interests: ["AI", "Infra", "Venture Capital"],
    experiences: [
      { company: "VEST at UCLA", role: "Vice President", startDate: "2024-09" },
    ],
    linkedin: "https://www.linkedin.com/in/shloakrathod",
    contact: { email: "shloak@vestucla.com" },
  },
  {
    id: "tyler-xiao",
    firstName: "Tyler",
    lastName: "Xiao",
    status: "active",
    vestTitle: "Head of Finance",
    classYear: "2026",
    oneLiner: "Quant-curious finance lead.",
    interests: ["Finance", "Quant", "Markets"],
    experiences: [
      { company: "VEST at UCLA", role: "Head of Finance", startDate: "2024-09" },
    ],
  },
  {
    id: "angelina-wu",
    firstName: "Angelina",
    lastName: "Wu",
    status: "active",
    vestTitle: "Head of Design & Media",
    classYear: "2027",
    oneLiner: "Designer building products at the intersection of taste and engineering.",
    imageSrc: "/images/Headshots/Angelina-Wu.PNG",
    interests: ["Design", "Frontend", "Brand"],
    experiences: [
      { company: "VEST at UCLA", role: "Head of Design & Media", startDate: "2024-09" },
    ],
    linkedin: "https://www.linkedin.com/in/angelinawu",
  },
  {
    id: "kevin-taylor",
    firstName: "Kevin",
    lastName: "Taylor",
    status: "active",
    vestTitle: "Head of Meetings",
    classYear: "2026",
    oneLiner: "Programs + ops nerd.",
    interests: ["Operations", "Programming"],
    experiences: [
      { company: "VEST at UCLA", role: "Head of Meetings", startDate: "2024-09" },
    ],
  },
  {
    id: "vijay-karthikeyan",
    firstName: "Vijay",
    lastName: "Karthikeyan",
    status: "active",
    vestTitle: "Head of Engagement",
    classYear: "2026",
    oneLiner: "Community-first builder.",
    interests: ["Community", "Growth"],
    experiences: [
      { company: "VEST at UCLA", role: "Head of Engagement", startDate: "2024-09" },
    ],
  },
  {
    id: "raman-arora",
    firstName: "Raman",
    lastName: "Arora",
    status: "active",
    vestTitle: "Head of Recruitment",
    classYear: "2026",
    oneLiner: "Talent-density evangelist.",
    interests: ["Recruiting", "People"],
    experiences: [
      { company: "VEST at UCLA", role: "Head of Recruitment", startDate: "2024-09" },
    ],
  },
  {
    id: "danny-chmaytelli",
    firstName: "Danny",
    lastName: "Chmaytelli",
    status: "active",
    vestTitle: "Director of Recruitment",
    classYear: "2027",
    oneLiner: "Helping VEST find the next class.",
    imageSrc: "/images/Headshots/Danny-Chmaytelli.jpeg",
    interests: ["Recruiting", "Strategy"],
    experiences: [
      { company: "VEST at UCLA", role: "Director of Recruitment", startDate: "2024-09" },
    ],
  },
  // ---- Example builder members (placeholders) ----
  {
    id: "example-builder-1",
    firstName: "Jane",
    lastName: "Doe",
    status: "active",
    vestTitle: "Builder",
    classYear: "2027",
    oneLiner: "Full-stack engineer shipping AI tools.",
    interests: ["AI", "Frontend", "Developer Tools"],
    experiences: [
      { company: "Cursor", role: "SWE Intern", startDate: "Summer 2025" },
      { company: "Snap", role: "SWE Intern", startDate: "Summer 2024" },
    ],
    linkedin: "https://www.linkedin.com/in/example",
    twitter: "example",
  },
  // ---- Example alumni (placeholders) ----
  {
    id: "example-alum-1",
    firstName: "Alex",
    lastName: "Alumni",
    status: "alumni",
    vestTitle: "Past President",
    classYear: "2024",
    joinedYear: "2021",
    oneLiner: "Now building at an early-stage AI startup.",
    interests: ["AI", "Founders", "Venture Capital"],
    experiences: [
      { company: "Stealth", role: "Founding Engineer", startDate: "2024-07" },
      { company: "Stripe", role: "SWE Intern", startDate: "Summer 2023" },
    ],
    linkedin: "https://www.linkedin.com/in/example-alum",
  },
];
