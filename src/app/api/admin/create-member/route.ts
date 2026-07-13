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
  const db = getAdminDb();
  const doc = await db.collection("members").doc(decoded.uid).get();
  if (!doc.exists) return false;
  return doc.data()?.role === "admin";
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
      role = "member",
      status = "active",
    } = body;

    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tempPassword = generateTempPassword();
    const auth = getAdminAuth();
    const user = await auth.createUser({
      email,
      password: tempPassword,
    });

    const db = getAdminDb();
    await db.collection("members").doc(user.uid).set({
      uid: user.uid,
      email,
      firstName,
      lastName,
      role,
      status,
      mustChangePassword: true,
      profileCompleted: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      uid: user.uid,
      email,
      tempPassword,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
