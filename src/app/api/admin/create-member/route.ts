import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { sendWelcomeEmail } from "@/lib/email";

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

    // Check if member with this email already exists
    const db = getAdminDb();
    const existing = await db.collection("members").where("email", "==", email).get();
    if (!existing.empty) {
      return NextResponse.json(
        { error: "A member with this email already exists" },
        { status: 400 }
      );
    }

    // Create member profile (no Firebase Auth user - they'll sign in with Google)
    const docRef = await db.collection("members").add({
      email,
      firstName,
      lastName,
      role,
      status,
      mustChangePassword: false,
      profileCompleted: false,
      createdAt: new Date().toISOString(),
    });

    // Send welcome email
    try {
      await sendWelcomeEmail({ to: email, firstName, lastName });
      console.log(`[create-member] Welcome email sent to ${email}`);
    } catch (emailErr) {
      console.error("[create-member] Failed to send welcome email:", emailErr);
      // Don't fail the request if email fails - account is still created
    }

    return NextResponse.json({
      id: docRef.id,
      email,
      message: "Member profile created and welcome email sent.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
