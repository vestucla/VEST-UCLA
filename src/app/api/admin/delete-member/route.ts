import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { MembersAdminOrm } from "@/lib/orm/members.admin";
import { MemberRole } from "@/data/members";

async function verifyAdmin(token: string): Promise<boolean> {
  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(token);
    const email = decoded.email;
    if (!email) return false;

    const member = await MembersAdminOrm.findByEmail(email);
    return member?.role === MemberRole.Admin;
  } catch {
    return false;
  }
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
    const { email, uuid } = body;

    let member = null;
    if (uuid) {
      member = await MembersAdminOrm.findByUuid(uuid);
    } else if (email) {
      member = await MembersAdminOrm.findByEmail(email);
    } else {
      return NextResponse.json(
        { error: "Missing email or uuid" },
        { status: 400 }
      );
    }

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    await MembersAdminOrm.delete(member.uuid);

    return NextResponse.json({ success: true, message: "Member deleted" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
