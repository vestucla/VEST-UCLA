import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

async function verifyUserAndGetEmail(token: string): Promise<{ email: string; isAdmin: boolean } | null> {
  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(token);
    const email = decoded.email;
    if (!email) return null;

    const db = getAdminDb();
    const snap = await db.collection("members").where("email", "==", email).get();
    if (snap.empty) return null;
    
    const role = snap.docs[0].data()?.role;
    return { email, isAdmin: role === "admin" };
  } catch {
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

    const body = await req.json();
    console.log("[update] Payload received for:", body.targetEmail);
    const { targetEmail, ...profileData } = body;

    if (!targetEmail) {
      return NextResponse.json({ error: "Missing targetEmail" }, { status: 400 });
    }

    // Check permissions: user can edit own profile, admin can edit anyone
    const canEdit = userInfo.isAdmin || userInfo.email === targetEmail;
    if (!canEdit) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Find the member document by email
    console.log("[update] Finding member document...");
    const db = getAdminDb();
    const memberSnap = await db.collection("members").where("email", "==", targetEmail).get();
    if (memberSnap.empty) {
      console.log("[update] Member not found");
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const docId = memberSnap.docs[0].id;
    console.log("[update] Found member doc:", docId);
    
    // Filter allowed fields
    const allowedFields = [
      "firstName", "lastName", "bio", "interests", "currentlyWorkingOn",
      "major", "classYear", "city", "linkedin", "twitter", "github", "website",
      "experiences", "vestTitle", "phone", "imageSrc", "joinedYear"
    ];
    
    // Admin-only fields
    const adminOnlyFields = ["role", "status"];
    
    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in profileData) {
        updateData[field] = profileData[field];
      }
    }
    
    // Only admins can update role/status
    if (userInfo.isAdmin) {
      for (const field of adminOnlyFields) {
        if (field in profileData) {
          updateData[field] = profileData[field];
        }
      }
    }

    console.log("[update] Updating Firestore document...");
    await db.collection("members").doc(docId).update(updateData);
    console.log("[update] Success!");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[update] Error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
