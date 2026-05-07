// Data access layer for member portal.
// v1: reads from a static TS module so we can ship UI fast.
// To migrate to Supabase later: keep these function signatures and replace
// the bodies with `supabase.from('members')...` calls.

import { MEMBERS, Member, MemberStatus } from "@/data/members";

export type { Member, MemberStatus, Experience } from "@/data/members";

const computeCompanies = (m: Member): Member => ({
  ...m,
  companies: m.companies ?? Array.from(new Set(m.experiences.map((e) => e.company))),
});

export async function getAllMembers(): Promise<Member[]> {
  return MEMBERS.map(computeCompanies);
}

export async function getMembersByStatus(status: MemberStatus): Promise<Member[]> {
  return MEMBERS.filter((m) => m.status === status).map(computeCompanies);
}

export async function getMember(id: string): Promise<Member | null> {
  const m = MEMBERS.find((x) => x.id === id);
  return m ? computeCompanies(m) : null;
}

export interface MemberSearchOptions {
  query?: string;          // free text
  companies?: string[];    // any-of
  interests?: string[];    // any-of
  status?: MemberStatus;
}

export async function searchMembers(opts: MemberSearchOptions = {}): Promise<Member[]> {
  const q = opts.query?.trim().toLowerCase();
  const companySet = opts.companies?.length ? new Set(opts.companies) : null;
  const interestSet = opts.interests?.length ? new Set(opts.interests) : null;

  return MEMBERS.map(computeCompanies).filter((m) => {
    if (opts.status && m.status !== opts.status) return false;

    if (q) {
      const haystack = [
        m.firstName,
        m.lastName,
        m.vestTitle,
        m.oneLiner,
        m.bio ?? "",
        ...m.interests,
        ...m.experiences.flatMap((e) => [e.company, e.role, e.description ?? ""]),
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

// Helpers for filter UI. v1 just derives from static data; with Supabase
// we'd do `select distinct` queries.
export async function getAllCompanies(): Promise<string[]> {
  const set = new Set<string>();
  for (const m of MEMBERS) for (const e of m.experiences) set.add(e.company);
  return Array.from(set).sort();
}

export async function getAllInterests(): Promise<string[]> {
  const set = new Set<string>();
  for (const m of MEMBERS) for (const i of m.interests) set.add(i);
  return Array.from(set).sort();
}
