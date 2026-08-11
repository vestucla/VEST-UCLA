import {
  Member,
  MemberDoc,
  MemberRole,
  MemberStatus,
  VestTitle,
  JoinedQuarter,
  memberSlug,
  type Experience,
} from "@/data/members";

export function computeCompanies(experiences: Experience[]): string[] {
  return Array.from(
    new Set(experiences.map((e) => e.company).filter((c): c is string => Boolean(c)))
  );
}

function parseVestTitle(value: unknown): VestTitle | undefined {
  if (typeof value !== "string") return undefined;
  return (Object.values(VestTitle) as string[]).includes(value)
    ? (value as VestTitle)
    : undefined;
}

function parseJoinedQuarter(value: unknown): JoinedQuarter | undefined {
  if (typeof value !== "string") return undefined;
  return (Object.values(JoinedQuarter) as string[]).includes(value)
    ? (value as JoinedQuarter)
    : undefined;
}

function parseRole(value: unknown): MemberRole {
  return value === MemberRole.Admin ? MemberRole.Admin : MemberRole.Member;
}

function parseStatus(value: unknown): MemberStatus {
  return value === MemberStatus.Alumni ? MemberStatus.Alumni : MemberStatus.Active;
}

/** Map a Firestore snapshot into MemberDoc (uuid = document id). */
export function toMemberDoc(
  uuid: string,
  data: Record<string, unknown>
): MemberDoc {
  return {
    uuid,
    email: (data.email as string) ?? "",
    firstName: data.firstName as string | undefined,
    lastName: data.lastName as string | undefined,
    role: data.role ? parseRole(data.role) : undefined,
    status: data.status ? parseStatus(data.status) : undefined,
    mustChangePassword: data.mustChangePassword as boolean | undefined,
    profileCompleted: data.profileCompleted as boolean | undefined,
    createdAt: data.createdAt as string | undefined,
    vestTitle: parseVestTitle(data.vestTitle),
    classYear: data.classYear as string | undefined,
    joinedYear: data.joinedYear as string | undefined,
    joinedQuarter: parseJoinedQuarter(data.joinedQuarter),
    imageSrc: data.imageSrc as string | undefined,
    bio: data.bio as string | undefined,
    interests: (data.interests as string[]) ?? [],
    experiences: (data.experiences as Experience[]) ?? [],
    currentlyWorkingOn: data.currentlyWorkingOn as string | undefined,
    major: data.major as string | undefined,
    city: data.city as string | undefined,
    linkedin: data.linkedin as string | undefined,
    twitter: data.twitter as string | undefined,
    github: data.github as string | undefined,
    website: data.website as string | undefined,
    phone: data.phone as string | undefined,
  };
}

export function toMember(doc: MemberDoc): Member {
  const experiences = (doc.experiences ?? []).map((e) => ({
    company: e.company ?? "",
    role: e.role ?? "",
    startDate: e.startDate,
    endDate: e.endDate,
    description: e.description,
  }));

  const firstName = doc.firstName ?? "";
  const lastName = doc.lastName ?? "";

  return {
    uuid: doc.uuid,
    id: memberSlug(firstName, lastName),
    firstName,
    lastName,
    email: doc.email,
    status: doc.status ?? MemberStatus.Active,
    role: doc.role ?? MemberRole.Member,
    vestTitle: doc.vestTitle,
    classYear: doc.classYear,
    joinedYear: doc.joinedYear,
    joinedQuarter: doc.joinedQuarter,
    imageSrc: doc.imageSrc,
    bio: doc.bio,
    interests: doc.interests ?? [],
    currentlyWorkingOn: doc.currentlyWorkingOn,
    major: doc.major,
    city: doc.city,
    experiences,
    companies: computeCompanies(experiences),
    linkedin: doc.linkedin,
    twitter: doc.twitter,
    github: doc.github,
    website: doc.website,
    phone: doc.phone,
  };
}
