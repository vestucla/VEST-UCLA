import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { MembersAdminOrm } from "@/lib/orm/members.admin";
import { MemberRole, MemberStatus, VestTitle, JoinedQuarter } from "@/data/members";

async function verifyAdmin(token: string): Promise<boolean> {
  const auth = getAdminAuth();
  const decoded = await auth.verifyIdToken(token);
  const email = decoded.email;
  if (!email) return false;

  const member = await MembersAdminOrm.findByEmail(email);
  return member?.role === MemberRole.Admin;
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const isAdmin = await verifyAdmin(token);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      email,
      firstName,
      lastName,
      role = MemberRole.Member,
      status = MemberStatus.Active,
      vestTitle,
      joinedYear,
      joinedQuarter,
    } = body;

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existing = await MembersAdminOrm.findByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "A member with this email already exists" },
        { status: 400 }
      );
    }

    const member = await MembersAdminOrm.create({
      email,
      firstName,
      lastName,
      role,
      status,
      vestTitle: vestTitle as VestTitle | undefined,
      joinedYear,
      joinedQuarter: joinedQuarter as JoinedQuarter | undefined,
    });

    return NextResponse.json({
      uuid: member.uuid,
      email,
      message: "Member profile created.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
