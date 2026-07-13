import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

async function verifyAdmin(token: string): Promise<boolean> {
  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(token);
    const email = decoded.email;
    if (!email) return false;

    const db = getAdminDb();
    const snap = await db.collection("members").where("email", "==", email).get();
    if (snap.empty) return false;
    return snap.docs[0].data()?.role === "admin";
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
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const db = getAdminDb();
    const memberSnap = await db.collection("members").where("email", "==", email).get();
    
    if (memberSnap.empty) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const docId = memberSnap.docs[0].id;
    await db.collection("members").doc(docId).delete();

    return NextResponse.json({ success: true, message: "Member deleted" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
