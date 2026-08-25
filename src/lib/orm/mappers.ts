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

function parseString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function parseStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function parseExperiences(value: unknown): Experience[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const experience = item as Record<string, unknown>;
    if (
      typeof experience.company !== "string" ||
      typeof experience.role !== "string"
    ) {
      return [];
    }
    return [{
      company: experience.company,
      role: experience.role,
      startDate: parseString(experience.startDate),
      endDate: parseString(experience.endDate),
      description: parseString(experience.description),
    }];
  });
}

export function toMemberDoc(
  uuid: string,
  data: Record<string, unknown>
): MemberDoc {
  return {
    uuid,
    email: parseString(data.email) ?? "",
    firstName: parseString(data.firstName),
    lastName: parseString(data.lastName),
    role: data.role ? parseRole(data.role) : undefined,
    status: data.status ? parseStatus(data.status) : undefined,
    profileCompleted:
      typeof data.profileCompleted === "boolean"
        ? data.profileCompleted
        : undefined,
    createdAt: parseString(data.createdAt),
    vestTitle: parseVestTitle(data.vestTitle),
    classYear: parseString(data.classYear),
    joinedYear: parseString(data.joinedYear),
    joinedQuarter: parseJoinedQuarter(data.joinedQuarter),
    imageSrc: typeof data.imageSrc === "string" ? data.imageSrc : undefined,
    bio: parseString(data.bio),
    interests: parseStringArray(data.interests),
    experiences: parseExperiences(data.experiences),
    currentlyWorkingOn: parseString(data.currentlyWorkingOn),
    major: parseString(data.major),
    city: parseString(data.city),
    linkedin: parseString(data.linkedin),
    twitter: parseString(data.twitter),
    github: parseString(data.github),
    website: parseString(data.website),
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
