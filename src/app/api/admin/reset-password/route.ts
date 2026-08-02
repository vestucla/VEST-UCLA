import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { MembersAdminOrm } from "@/lib/orm/members.admin";
import { MemberRole } from "@/data/members";

function generateTempPassword() {
  return (
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2, 6)
  );
}

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
    const { uuid, email } = body;

    const member = uuid
      ? await MembersAdminOrm.findByUuid(uuid)
      : email
        ? await MembersAdminOrm.findByEmail(email)
        : null;

    if (!member) {
      return NextResponse.json(
        { error: "Missing uuid/email or member not found" },
        { status: 400 }
      );
    }

    // Password reset only applies when a Firebase Auth user exists with this email.
    // Member docs use Firestore uuid (not auth uid).
    const auth = getAdminAuth();
    let authUser;
    try {
      authUser = await auth.getUserByEmail(member.email);
    } catch {
      return NextResponse.json(
        {
          error:
            "No Firebase Auth account for this member yet (Google sign-in only).",
        },
        { status: 400 }
      );
    }

    const tempPassword = generateTempPassword();
    await auth.updateUser(authUser.uid, { password: tempPassword });
    await MembersAdminOrm.update(member.uuid, { mustChangePassword: true });

    return NextResponse.json({ tempPassword, uuid: member.uuid });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
