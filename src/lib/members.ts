// Data access layer for the member portal (read helpers for UI).
// Mutations go through MembersOrm / MembersAdminOrm.

import type { Member, MemberStatus } from "@/data/members";
import { MembersOrm, toMember } from "@/lib/orm/members";

export type { Member, MemberStatus } from "@/data/members";

const MEMBERS_CACHE_TTL_MS = 30_000;

let membersCache: { fetchedAt: number; members: Promise<Member[]> } | null =
  null;

/** Drop the cached directory so the next read hits Firestore again. */
export function invalidateMembersCache(): void {
  membersCache = null;
}

export async function getAllMembers(): Promise<Member[]> {
  if (membersCache && Date.now() - membersCache.fetchedAt < MEMBERS_CACHE_TTL_MS) {
    return membersCache.members;
  }

  const members = MembersOrm.findAll().then((docs) => docs.map(toMember));
  membersCache = { fetchedAt: Date.now(), members };
  members.catch(() => {
    membersCache = null;
  });
  return members;
}

export async function getMembersByStatus(
  status: MemberStatus
): Promise<Member[]> {
  const members = await getAllMembers();
  return members.filter((m) => m.status === status);
}

export async function getMember(idOrSlug: string): Promise<Member | null> {
  const byUuid = await MembersOrm.findByUuid(idOrSlug);
  if (byUuid) return toMember(byUuid);

  const allMembers = await getAllMembers();
  return (
    allMembers.find((m) => m.id.toLowerCase() === idOrSlug.toLowerCase()) ??
    null
  );
}

export interface MemberSearchOptions {
  query?: string;
  companies?: string[];
  interests?: string[];
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
