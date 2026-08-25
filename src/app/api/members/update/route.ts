import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { MembersAdminOrm } from "@/lib/orm/members.admin";
import {
  MemberRole,
  VestTitle,
  JoinedQuarter,
  MemberStatus,
  normalizeEmail,
} from "@/data/members";

export const runtime = "nodejs";

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
  } catch (err) {
    console.error("[update] Firebase verification failed:", err);
    return null;
  }
}

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

    const body: unknown = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }
    const payload = body as Record<string, unknown>;
    console.log("[update] Payload received for:", payload.targetEmail);
    const { targetEmail, ...profileData } = payload;

    if (!targetEmail || typeof targetEmail !== "string") {
      return NextResponse.json({ error: "Missing targetEmail" }, { status: 400 });
    }

    const canEdit =
      userInfo.isAdmin ||
      normalizeEmail(userInfo.email) === normalizeEmail(targetEmail);
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
      if (field in profileData) {
        updateData[field] = profileData[field];
      }
    }

    const stringFields = [
      "firstName",
      "lastName",
      "bio",
      "currentlyWorkingOn",
      "major",
      "classYear",
      "city",
      "linkedin",
      "twitter",
      "github",
      "website",
      "phone",
      "joinedYear",
    ] as const;
    for (const field of stringFields) {
      if (field in updateData && updateData[field] !== undefined &&
          typeof updateData[field] !== "string") {
        return NextResponse.json(
          { error: `${field} must be a string` },
          { status: 400 }
        );
      }
    }

    if (
      "interests" in updateData &&
      (!Array.isArray(updateData.interests) ||
        !updateData.interests.every((item) => typeof item === "string"))
    ) {
      return NextResponse.json(
        { error: "interests must be an array of strings" },
        { status: 400 }
      );
    }

    if ("experiences" in updateData) {
      const experiences = updateData.experiences;
      const validExperiences =
        Array.isArray(experiences) &&
        experiences.every((experience) => {
          if (
            !experience ||
            typeof experience !== "object" ||
            Array.isArray(experience)
          ) {
            return false;
          }
          const item = experience as Record<string, unknown>;
          return (
            typeof item.company === "string" &&
            typeof item.role === "string" &&
            (item.startDate === undefined || typeof item.startDate === "string") &&
            (item.endDate === undefined || typeof item.endDate === "string") &&
            (item.description === undefined ||
              typeof item.description === "string")
          );
        });
      if (!validExperiences) {
        return NextResponse.json(
          { error: "experiences contains an invalid entry" },
          { status: 400 }
        );
      }
    }

    if (
      "profileCompleted" in updateData &&
      typeof updateData.profileCompleted !== "boolean"
    ) {
      return NextResponse.json(
        { error: "profileCompleted must be a boolean" },
        { status: 400 }
      );
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

    if ("imageSrc" in updateData && typeof updateData.imageSrc !== "string") {
      return NextResponse.json(
        { error: "imageSrc must be a URL string (upload the image first)" },
        { status: 400 }
      );
    }

    if (typeof updateData.imageSrc === "string" && updateData.imageSrc.length > 0) {
      const src = updateData.imageSrc;
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
