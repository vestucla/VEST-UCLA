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

export type MemberRole = "admin" | "member";

export interface Member {
  id: string;            // Firestore doc id (Firebase uid) and URL slug
  uid: string;           // Firebase auth uid
  firstName: string;
  lastName: string;
  email: string;
  status: MemberStatus;
  role: MemberRole;

  // VEST-specific (set by admin)
  vestTitle?: string;    // e.g. "President", "Builder", "Director of Recruitment"
  classYear?: string;    // e.g. "2026"
  joinedYear?: string;   // year they joined VEST

  // Profile content (filled by member during onboarding)
  imageSrc?: string;     // Cloudinary HTTPS URL
  bio?: string;          // longer paragraph for the profile page
  interests: string[];   // topical tags used by the search filters
  currentlyWorkingOn?: string;
  major?: string;
  city?: string;

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
  phone?: string;
}

// This file now only defines the shared Member/Experience types.
// The actual member data lives in Firebase Firestore and is managed through
// the admin dashboard at /members/admin.
