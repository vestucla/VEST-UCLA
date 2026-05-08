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
    classYear: "2028",
    joinedYear: "2023",
    oneLiner: "Builder + operator passionate about scaling early-stage companies.",
    imageSrc: "/images/Headshots/Kiersten-Roth.jpg",
    interests: ["Venture Capital", "Operations", "Consumer"],
    experiences: [
      { company: "Greenopia", role: "Software Engineer", startDate: "2025-09" },
    ],
    linkedin: "https://www.linkedin.com/in/kierstenroth",
    contact: { email: "kiersten@vestucla.com" },
  },
  {
    id: "shloak-rathod",
    firstName: "Shloak",
    lastName: "Rathod",
    status: "active",
    vestTitle: "External Vice President",
    classYear: "2027",
    joinedYear: "2023",
    oneLiner: "Fun fact: I can understand 7 languages.",
    imageSrc: "/images/Headshots/Shloak-Rathod.jpg",
    interests: ["AI", "Infra", "Venture Capital"],
    experiences: [
      { company: "VEST at UCLA", role: "External Vice President", startDate: "2024-09" },
    ],
    linkedin: "https://www.linkedin.com/in/shloakrathod",
    contact: { email: "shloak@vestucla.com" },
  },
  {
    id: "tyler-xiao",
    firstName: "Tyler",
    lastName: "Xiao",
    status: "active",
    vestTitle: "Director of Finance",
    classYear: "2028",
    oneLiner: "Fun fact: I ran a half marathon in 1:26:58.",
    interests: ["Finance", "Quant", "Markets"],
    experiences: [
      { company: "VEST at UCLA", role: "Director of Finance", startDate: "2024-09" },
    ],
  },
  {
    id: "angelina-wu",
    firstName: "Angelina",
    lastName: "Wu",
    status: "active",
    vestTitle: "Head of Design & Media",
    classYear: "2028",
    oneLiner: "Designer, builder, doer!",
    imageSrc: "/images/Headshots/Angelina-Wu.PNG",
    interests: ["Design", "Frontend", "Brand"],
    experiences: [
      { company: "Sephora", role: "Product Design Intern", startDate: "2026-06" },
    ],
    linkedin: "https://www.linkedin.com/in/angelinawu",
  },
  {
    id: "kevin-taylor",
    firstName: "Kevin",
    lastName: "Taylor",
    status: "active",
    vestTitle: "Head of Membership",
    classYear: "2028",
    oneLiner: "Fun fact: I drink 400+ mg of caffeine daily.",
    interests: ["Operations", "Community"],
    experiences: [
      { company: "VEST at UCLA", role: "Head of Membership", startDate: "2025-09" },
    ],
  },
  {
    id: "vijay-karthikeyan",
    firstName: "Vijay",
    lastName: "Karthikeyan",
    status: "active",
    vestTitle: "Internal Vice President",
    classYear: "2028",
    oneLiner: "Fun fact: My favorite animal is pandas.",
    interests: ["Community", "Growth"],
    experiences: [
      { company: "VEST at UCLA", role: "Internal Vice President", startDate: "2024-09" },
    ],
  },
  {
    id: "raman-arora",
    firstName: "Raman",
    lastName: "Arora",
    status: "active",
    vestTitle: "Head of Membership",
    classYear: "2029",
    oneLiner: "Fun fact: I'm a huge vinyl collector and love to play the guitar.",
    interests: ["Community", "Music"],
    experiences: [
      { company: "VEST at UCLA", role: "Head of Membership", startDate: "2024-09" },
    ],
  },
  {
    id: "danny-chmaytelli",
    firstName: "Danny",
    lastName: "Chmaytelli",
    status: "active",
    vestTitle: "Member",
    classYear: "2027",
    oneLiner: "",
    imageSrc: "/images/Headshots/Danny-Chmaytelli.jpeg",
    interests: [],
    experiences: [],
  },
  // ---- 2026–2027 board (continued) ----
  {
    id: "ashley-varghese",
    firstName: "Ashley",
    lastName: "Varghese",
    status: "active",
    vestTitle: "Director of Outreach",
    classYear: "2028",
    oneLiner: "Fun fact: I used to work at McDonald's.",
    interests: ["Community", "Outreach"],
    experiences: [
      { company: "VEST at UCLA", role: "Director of Outreach", startDate: "2025-09" },
    ],
  },
  {
    id: "mahesh-karthikeyan",
    firstName: "Mahesh",
    lastName: "Karthikeyan",
    status: "active",
    vestTitle: "Finance Intern",
    classYear: "2029",
    oneLiner: "Fun fact: I like chess, League, and Geoguessr.",
    interests: ["Finance", "Markets"],
    experiences: [
      { company: "Greenopia", role: "Software Engineer", startDate: "2025-09" },
    ],
  },
  {
    id: "samuel-zhang",
    firstName: "Samuel",
    lastName: "Zhang",
    status: "active",
    vestTitle: "Media Intern",
    classYear: "2027",
    oneLiner: "Fun fact: I can eat six Costco hot dogs in two minutes.",
    interests: ["Design", "Media"],
    experiences: [
      { company: "VEST at UCLA", role: "Media Intern", startDate: "2025-09" },
    ],
  },
  // ---- Roster (deduped, alphabetical by first name) ----
  // Minimal stubs — fill in title/year/bio/linkedin as members self-serve.
  ...stubs([
    ["aditya-rao", "Aditya", "Rao"],
    ["akash-balakumar", "Akash", "Balakumar"],
    ["andrew-zheng", "Andrew", "Zheng"],
    ["anish-kumar", "Anish", "Kumar"],
    ["anshul", "Anshul", ""],
    ["anson-ting", "Anson", "Ting"],
    ["arvin", "Arvin", ""],
    ["ashutosh-sundresh", "Ashutosh", "Sundresh"],
    ["charlotte-chiang", "Charlotte", "Chiang"],
    ["colin-zhao", "Colin", "Zhao"],
    ["conor-parman", "Conor", "Parman"],
    ["daniel-wu", "Daniel", "Wu"],
    ["daniel-zhou", "Daniel", "Zhou"],
    ["devang-sharma", "Devang", "Sharma"],
    ["ehban", "Ehban", ""],
    ["eric-zhou", "Eric", "Zhou"],
    ["euan-lim", "Euan", "Lim"],
    ["evan-rose", "Evan", "Rose"],
    ["evelyn-do", "Evelyn", "Do"],
    ["ganesh-koka", "Ganesh", "Koka"],
    ["george-zhou", "George", "Zhou"],
    ["harris-song", "Harris", "Song"],
    ["jake-padilla", "Jake", "Padilla"],
    ["jonathan-ouyang", "Jonathan", "Ouyang"],
    ["justin-l", "Justin", "L"],
    ["justin-lin", "Justin", "Lin"],
    ["justin-osbey", "Justin", "Osbey"],
    ["katrina-yang", "Katrina", "Yang"],
    ["kyle-jeong", "Kyle", "Jeong"],
    ["kyle-kan", "Kyle", "Kan"],
    ["kyle-soriano", "Kyle", "Soriano"],
    ["mergen-enkhbat", "Mergen", "Enkhbat"],
    ["michael-lan", "Michael", "Lan"],
    ["michelle-duong", "Michelle", "Duong"],
    ["michelle-jayaraj", "Michelle", "Jayaraj"],
    ["neha-adapala", "Neha", "Adapala"],
    ["neo-phuchane", "Neo", "Phuchane"],
    ["rishabh-dedhia", "Rishabh", "Dedhia"],
    ["ritesh-kasamsetty", "Ritesh", "Kasamsetty"],
    ["saanvi-bhargava", "Saanvi", "Bhargava"],
    ["sachin-raja", "Sachin", "Raja"],
    ["sarah-zhao", "Sarah", "Zhao"],
    ["seif-abdelaziz", "Seif", "Abdelaziz"],
    ["siddaarth-prasanna", "Siddaarth", "Prasanna"],
    ["simon-fan", "Simon", "Fan"],
    ["soha-baig", "Soha", "Baig"],
    ["sunny-gandhari", "Sunny", "Gandhari"],
    ["theo-luu", "Theo", "Luu"],
    ["yifan-zhou", "Yifan", "Zhou"],
  ]),
];

function stubs(rows: Array<[string, string, string]>): Member[] {
  return rows.map(([id, firstName, lastName]) => ({
    id,
    firstName,
    lastName,
    status: "active" as const,
    vestTitle: "Member",
    oneLiner: "",
    interests: [],
    experiences: [],
  }));
}
