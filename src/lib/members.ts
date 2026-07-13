// Data access layer for the member portal.
// Reads from Firebase Firestore. The function signatures are kept stable so
// the UI components (MemberDirectory, MemberProfile) don't need to change.

import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getFirebaseDb } from "./firebase";
import type { Member, MemberStatus } from "@/data/members";

export type { Member, MemberStatus } from "@/data/members";

function computeCompanies(experiences: Member["experiences"]): string[] {
  return Array.from(
    new Set(
      experiences
        .map((e) => e.company)
        .filter((c): c is string => Boolean(c))
    )
  );
}

function docToMember(id: string, data: any): Member {
  const experiences = (data.experiences ?? []).map((e: any) => ({
    company: e.company ?? "",
    role: e.role ?? "",
    startDate: e.startDate,
    endDate: e.endDate,
    description: e.description,
  }));

  return {
    id,
    uid: data.uid ?? id,
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    email: data.email ?? "",
    status: data.status ?? "active",
    role: data.role ?? "member",
    vestTitle: data.vestTitle,
    classYear: data.classYear,
    joinedYear: data.joinedYear,
    imageSrc: data.imageSrc,
    bio: data.bio,
    interests: data.interests ?? [],
    currentlyWorkingOn: data.currentlyWorkingOn,
    major: data.major,
    city: data.city,
    experiences,
    companies: computeCompanies(experiences),
    linkedin: data.linkedin,
    twitter: data.twitter,
    github: data.github,
    website: data.website,
    phone: data.phone,
  };
}

export async function getAllMembers(): Promise<Member[]> {
  const db = getFirebaseDb();
  const snap = await getDocs(collection(db, "members"));
  return snap.docs.map((d) => docToMember(d.id, d.data()));
}

export async function getMembersByStatus(
  status: MemberStatus
): Promise<Member[]> {
  const members = await getAllMembers();
  return members.filter((m) => m.status === status);
}

export async function getMember(id: string): Promise<Member | null> {
  const db = getFirebaseDb();
  const snap = await getDoc(doc(db, "members", id));
  if (!snap.exists()) return null;
  return docToMember(snap.id, snap.data());
}

export interface MemberSearchOptions {
  query?: string;       // free text
  companies?: string[]; // any-of
  interests?: string[]; // any-of
  status?: MemberStatus;
}

export async function searchMembers(
  opts: MemberSearchOptions = {}
): Promise<Member[]> {
  const q = opts.query?.trim().toLowerCase();
  const companySet = opts.companies?.length ? new Set(opts.companies) : null;
  const interestSet = opts.interests?.length ? new Set(opts.interests) : null;

  const members = await getAllMembers();
  return members.filter((m) => {
    if (opts.status && m.status !== opts.status) return false;

    if (q) {
      const haystack = [
        m.firstName,
        m.lastName,
        m.vestTitle ?? "",
        m.bio ?? "",
        m.major ?? "",
        m.city ?? "",
        m.currentlyWorkingOn ?? "",
        ...m.interests,
        ...m.experiences.flatMap((e) => [
          e.company,
          e.role,
          e.description ?? "",
        ]),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (companySet) {
      const hit = m.experiences.some((e) => companySet.has(e.company));
      if (!hit) return false;
    }

    if (interestSet) {
      const hit = m.interests.some((i) => interestSet.has(i));
      if (!hit) return false;
    }

    return true;
  });
}

export async function getAllCompanies(): Promise<string[]> {
  const members = await getAllMembers();
  const set = new Set<string>();
  for (const m of members) for (const e of m.experiences) set.add(e.company);
  return Array.from(set).sort();
}

export async function getAllInterests(): Promise<string[]> {
  const members = await getAllMembers();
  const set = new Set<string>();
  for (const m of members) for (const i of m.interests) set.add(i);
  return Array.from(set).sort();
}
