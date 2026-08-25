import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckResult = { ok: boolean; error?: string };

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export async function GET() {
  const env = {
    FIREBASE_SERVICE_ACCOUNT_KEY: Boolean(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: Boolean(
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    ),
    CLOUDINARY_CLOUD_NAME: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
    CLOUDINARY_API_KEY: Boolean(process.env.CLOUDINARY_API_KEY),
    CLOUDINARY_API_SECRET: Boolean(process.env.CLOUDINARY_API_SECRET),
  };

  let firebaseAdminImport: CheckResult;
  let firebaseAdminInit: CheckResult;
  try {
    const admin = await import("@/lib/firebase-admin");
    firebaseAdminImport = { ok: true };
    try {
      admin.getAdminAuth();
      firebaseAdminInit = { ok: true };
    } catch (err) {
      firebaseAdminInit = { ok: false, error: errorMessage(err) };
    }
  } catch (err) {
    firebaseAdminImport = { ok: false, error: errorMessage(err) };
    firebaseAdminInit = { ok: false, error: "import failed" };
  }

  let cloudinaryImport: CheckResult;
  let cloudinaryInit: CheckResult;
  try {
    const cloud = await import("@/lib/cloudinary");
    cloudinaryImport = { ok: true };
    try {
      cloud.getCloudinary();
      cloudinaryInit = { ok: true };
    } catch (err) {
      cloudinaryInit = { ok: false, error: errorMessage(err) };
    }
  } catch (err) {
    cloudinaryImport = { ok: false, error: errorMessage(err) };
    cloudinaryInit = { ok: false, error: "import failed" };
  }

  return NextResponse.json({
    ok:
      firebaseAdminImport.ok &&
      firebaseAdminInit.ok &&
      cloudinaryImport.ok &&
      cloudinaryInit.ok,
    node: process.version,
    env,
    firebaseAdminImport,
    firebaseAdminInit,
    cloudinaryImport,
    cloudinaryInit,
  });
}
