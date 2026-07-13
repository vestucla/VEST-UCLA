import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

function generateTempPassword() {
  return (
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2, 6)
  );
}

async function verifyAdmin(token: string): Promise<boolean> {
  const auth = getAdminAuth();
  const decoded = await auth.verifyIdToken(token);
  const email = decoded.email;
  if (!email) return false;

  const db = getAdminDb();
  const snap = await db.collection("members").where("email", "==", email).get();
  if (snap.empty) return false;
  return snap.docs[0].data()?.role === "admin";
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
    const { uid } = body;

    if (!uid) {
      return NextResponse.json(
        { error: "Missing uid" },
        { status: 400 }
      );
    }

    const tempPassword = generateTempPassword();
    const auth = getAdminAuth();
    await auth.updateUser(uid, { password: tempPassword });

    const db = getAdminDb();
    await db.collection("members").doc(uid).update({
      mustChangePassword: true,
    });

    return NextResponse.json({ tempPassword });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
