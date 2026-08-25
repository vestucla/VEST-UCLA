// Shared member domain types for the VEST portal.
// Single source of truth for Firestore documents and UI.

export enum MemberStatus {
  Active = "active",
  Alumni = "alumni",
}

export enum MemberRole {
  Admin = "admin",
  Member = "member",
}

/** VEST-specific titles (set by admin). */
export enum VestTitle {
  President = "President",
  VicePresident = "Vice President",
  HeadOfFinance = "Head of Finance",
  HeadOfDesignAndMedia = "Head of Design & Media",
  HeadOfMeetings = "Head of Meetings",
  HeadOfEngagement = "Head of Engagement",
  HeadOfRecruitment = "Head of Recruitment",
  DirectorOfRecruitment = "Director of Recruitment",
  Builder = "Builder",
}

/** Academic quarter they joined VEST. */
export enum JoinedQuarter {
  Fall = "Fall",
  Winter = "Winter",
  Spring = "Spring",
}

export interface Experience {
  company: string;
  role: string;
  // ISO-like strings keep things simple; can promote to date columns later.
  startDate?: string; // "2024-06" or "Summer 2024"
  endDate?: string; // undefined => current
  description?: string;
}

/** Firestore `members` document shape (plus uuid = doc id). */
export interface MemberDoc {
  uuid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: MemberRole;
  status?: MemberStatus;
  profileCompleted?: boolean;
  createdAt?: string;

  // VEST-specific (set by admin)
  vestTitle?: VestTitle;
  classYear?: string;
  joinedYear?: string;
  joinedQuarter?: JoinedQuarter;

  // Profile content (filled by member)
  imageSrc?: string;
  bio?: string;
  interests?: string[];
  experiences?: Experience[];
  currentlyWorkingOn?: string;
  major?: string;
  city?: string;

  // Socials
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;

  // Gated contact — only visible to logged-in members
  phone?: string;
}

/** UI-facing member model (normalized from MemberDoc). */
export interface Member {
  uuid: string;
  id: string; // URL slug: firstName-lastName
  firstName: string;
  lastName: string;
  email: string;
  status: MemberStatus;
  role: MemberRole;

  vestTitle?: VestTitle;
  classYear?: string;
  joinedYear?: string;
  joinedQuarter?: JoinedQuarter;

  imageSrc?: string;
  bio?: string;
  interests: string[];
  currentlyWorkingOn?: string;
  major?: string;
  city?: string;

  experiences: Experience[];
  companies?: string[];

  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
  phone?: string;
}

export const VEST_TITLE_OPTIONS = Object.values(VestTitle);
export const JOINED_QUARTER_OPTIONS = Object.values(JoinedQuarter);
export const MEMBER_ROLE_OPTIONS = Object.values(MemberRole);
export const MEMBER_STATUS_OPTIONS = Object.values(MemberStatus);

export function memberSlug(firstName: string, lastName: string): string {
  return `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
}

/** Canonical form used for storing and looking up member emails. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export type ExperienceItem = Experience;
