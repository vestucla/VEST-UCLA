import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { MembersAdminOrm } from "@/lib/orm/members.admin";
import {
  MemberRole,
  VestTitle,
  JoinedQuarter,
  MemberStatus,
} from "@/data/members";

async function verifyUserAndGetEmail(
  token: string
): Promise<{ email: string; isAdmin: boolean } | null> {
  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(token);
    const email = decoded.email;
    if (!email) return null;

    const member = await MembersAdminOrm.findByEmail(email);
    if (!member) return null;

    return { email, isAdmin: member.role === MemberRole.Admin };
  } catch {
    return null;
  }
}

const MAX_SHORT_TEXT = 200;
const MAX_LONG_TEXT = 2000;
const MAX_URL = 500;
const MAX_LIST_ITEMS = 50;

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function text(max: number) {
  return (value: unknown) =>
    typeof value === "string" && value.length <= max
      ? null
      : `must be a string of at most ${max} characters`;
}

function url(value: unknown) {
  if (typeof value !== "string") return "must be a string";
  if (value.length === 0) return null;
  if (value.length > MAX_URL) return `must be at most ${MAX_URL} characters`;
  return isHttpUrl(value) ? null : "must be an http(s) URL";
}

function stringList(value: unknown) {
  if (!Array.isArray(value)) return "must be an array";
  if (value.length > MAX_LIST_ITEMS)
    return `must contain at most ${MAX_LIST_ITEMS} items`;
  const ok = value.every(
    (item) => typeof item === "string" && item.length <= MAX_SHORT_TEXT
  );
  return ok ? null : "must contain short strings only";
}

function experienceList(value: unknown) {
  if (!Array.isArray(value)) return "must be an array";
  if (value.length > MAX_LIST_ITEMS)
    return `must contain at most ${MAX_LIST_ITEMS} items`;

  const shortKeys = ["company", "role", "startDate", "endDate"] as const;
  return value.every((item) => {
    if (typeof item !== "object" || item === null || Array.isArray(item))
      return false;
    const entry = item as Record<string, unknown>;
    const keys = Object.keys(entry);
    if (keys.some((k) => ![...shortKeys, "description"].includes(k)))
      return false;
    if (
      shortKeys.some(
        (k) =>
          k in entry &&
          (typeof entry[k] !== "string" ||
            (entry[k] as string).length > MAX_SHORT_TEXT)
      )
    )
      return false;
    return (
      !("description" in entry) ||
      (typeof entry.description === "string" &&
        entry.description.length <= MAX_LONG_TEXT)
    );
  })
    ? null
    : "must contain valid experience entries";
}

const validators: Record<string, (value: unknown) => string | null> = {
  firstName: text(MAX_SHORT_TEXT),
  lastName: text(MAX_SHORT_TEXT),
  bio: text(MAX_LONG_TEXT),
  interests: stringList,
  currentlyWorkingOn: text(MAX_SHORT_TEXT),
  major: text(MAX_SHORT_TEXT),
  classYear: text(MAX_SHORT_TEXT),
  city: text(MAX_SHORT_TEXT),
  linkedin: url,
  twitter: text(MAX_SHORT_TEXT),
  github: url,
  website: url,
  experiences: experienceList,
  vestTitle: text(MAX_SHORT_TEXT),
  phone: text(MAX_SHORT_TEXT),
  imageSrc: text(MAX_URL),
  joinedYear: text(MAX_SHORT_TEXT),
  joinedQuarter: text(MAX_SHORT_TEXT),
  profileCompleted: (value: unknown) =>
    typeof value === "boolean" ? null : "must be a boolean",
};

export async function POST(req: NextRequest) {
  console.log("[update] Starting profile update...");
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.log("[update] Missing token");
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    console.log("[update] Verifying user...");
    const userInfo = await verifyUserAndGetEmail(token);
    if (!userInfo) {
      console.log("[update] Unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("[update] User verified:", userInfo.email);

    const body = await req.json();
    console.log("[update] Payload received for:", body.targetEmail);
    const { targetEmail, ...profileData } = body;

    if (!targetEmail) {
      return NextResponse.json({ error: "Missing targetEmail" }, { status: 400 });
    }

    const canEdit = userInfo.isAdmin || userInfo.email === targetEmail;
    if (!canEdit) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.log("[update] Finding member document...");
    const member = await MembersAdminOrm.findByEmail(targetEmail);
    if (!member) {
      console.log("[update] Member not found");
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const allowedFields = [
      "firstName",
      "lastName",
      "bio",
      "interests",
      "currentlyWorkingOn",
      "major",
      "classYear",
      "city",
      "linkedin",
      "twitter",
      "github",
      "website",
      "experiences",
      "vestTitle",
      "phone",
      "imageSrc",
      "joinedYear",
      "joinedQuarter",
      "profileCompleted",
    ] as const;

    const adminOnlyFields = ["role", "status"] as const;

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (!(field in profileData)) continue;
      const problem = validators[field](profileData[field]);
      if (problem) {
        return NextResponse.json(
          { error: `Invalid ${field}: it ${problem}` },
          { status: 400 }
        );
      }
      updateData[field] = profileData[field];
    }

    if (typeof updateData.vestTitle === "string" && updateData.vestTitle.length > 0) {
      if (!(Object.values(VestTitle) as string[]).includes(updateData.vestTitle)) {
        return NextResponse.json(
          { error: "Invalid vestTitle" },
          { status: 400 }
        );
      }
    }

    if (
      typeof updateData.joinedQuarter === "string" &&
      updateData.joinedQuarter.length > 0
    ) {
      if (
        !(Object.values(JoinedQuarter) as string[]).includes(
          updateData.joinedQuarter
        )
      ) {
        return NextResponse.json(
          { error: "Invalid joinedQuarter" },
          { status: 400 }
        );
      }
    }

    if (typeof updateData.imageSrc === "string" && updateData.imageSrc.length > 0) {
      const src = updateData.imageSrc as string;
      if (!src.startsWith("https://") && !src.startsWith("http://")) {
        return NextResponse.json(
          {
            error:
              "imageSrc must be a public HTTPS URL (upload via /api/upload/image)",
          },
          { status: 400 }
        );
      }
    }

    if (userInfo.isAdmin) {
      for (const field of adminOnlyFields) {
        if (field in profileData) {
          updateData[field] = profileData[field];
        }
      }
      if (
        typeof updateData.role === "string" &&
        !(Object.values(MemberRole) as string[]).includes(updateData.role)
      ) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      if (
        typeof updateData.status === "string" &&
        !(Object.values(MemberStatus) as string[]).includes(updateData.status)
      ) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
    }

    console.log("[update] Updating Firestore document...");
    await MembersAdminOrm.update(member.uuid, updateData);
    console.log("[update] Success!");

    return NextResponse.json({ success: true, uuid: member.uuid });
  } catch (err) {
    console.error("[update] Error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
