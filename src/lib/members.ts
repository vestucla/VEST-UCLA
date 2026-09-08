// Data access layer for the member portal (read helpers for UI).
// Mutations go through MembersOrm / MembersAdminOrm.

import { MemberStatus, VestTitle, type Member } from "@/data/members";
import { MembersOrm, toMember } from "@/lib/orm/members";

export { MemberStatus };
export type { Member };

export async function getAllMembers(): Promise<Member[]> {
  const docs = await MembersOrm.findAll();
  return docs.map(toMember);
}

export async function getMembersByStatus(
  status: MemberStatus
): Promise<Member[]> {
  const members = await getAllMembers();
  return members.filter((m) => m.status === status);
}

export async function getMember(idOrSlug: string): Promise<Member | null> {
  const byUuid = await MembersOrm.findByUuid(idOrSlug);
  if (byUuid) {
    const contact = await MembersOrm.findContactByUuid(byUuid.uuid);
    return toMember({ ...byUuid, phone: contact?.phone });
  }

  const allMembers = await getAllMembers();
  const match = allMembers.find(
    (m) => m.id.toLowerCase() === idOrSlug.toLowerCase()
  );
  if (!match) return null;
  const contact = await MembersOrm.findContactByUuid(match.uuid);
  return { ...match, phone: contact?.phone };
}

export interface MemberSearchOptions {
  query?: string;
  companies?: string[];
  interests?: string[];
  status?: MemberStatus;
}

const VEST_TITLE_ORDER: VestTitle[] = [
  VestTitle.President,
  VestTitle.VicePresident,
  VestTitle.HeadOfFinance,
  VestTitle.HeadOfDesignAndMedia,
  VestTitle.HeadOfMeetings,
  VestTitle.HeadOfEngagement,
  VestTitle.HeadOfRecruitment,
  VestTitle.DirectorOfRecruitment,
  VestTitle.Builder,
];

const vestTitleRank = new Map(
  VEST_TITLE_ORDER.map((title, index) => [title, index])
);

function compareMembersForDirectory(a: Member, b: Member): number {
  const aRank = vestTitleRank.get(a.vestTitle ?? VestTitle.Builder) ?? Number.MAX_SAFE_INTEGER;
  const bRank = vestTitleRank.get(b.vestTitle ?? VestTitle.Builder) ?? Number.MAX_SAFE_INTEGER;

  if (aRank !== bRank) return aRank - bRank;

  const lastNameCompare = a.lastName.localeCompare(b.lastName);
  if (lastNameCompare !== 0) return lastNameCompare;

  return a.firstName.localeCompare(b.firstName);
}

export async function searchMembers(
  opts: MemberSearchOptions = {}
): Promise<Member[]> {
  const q = opts.query?.trim().toLowerCase();
  const companySet = opts.companies?.length ? new Set(opts.companies) : null;
  const interestSet = opts.interests?.length ? new Set(opts.interests) : null;

  const members = await getAllMembers();
  return members
    .filter((m) => {
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
    })
    .sort(compareMembersForDirectory);
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
