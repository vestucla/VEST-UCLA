import { getApps, initializeApp, cert, App, type ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

interface ServiceAccountConfig {
  project_id: string;
  client_email: string;
  private_key: string;
}

function getServiceAccount(): ServiceAccountConfig {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is missing. Add the complete Firebase service-account JSON to Vercel."
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON. Paste the complete service-account JSON as one Vercel variable."
    );
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is missing project_id, client_email, or private_key."
    );
  }

  const serviceAccount = parsed as Record<string, unknown>;
  if (
    typeof serviceAccount.project_id !== "string" ||
    typeof serviceAccount.client_email !== "string" ||
    typeof serviceAccount.private_key !== "string"
  ) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is missing project_id, client_email, or private_key."
    );
  }

  const publicProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (publicProjectId && serviceAccount.project_id !== publicProjectId) {
    throw new Error(
      "Firebase client and service-account project IDs do not match."
    );
  }

  return {
    project_id: serviceAccount.project_id,
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key.replace(/\\n/g, "\n"),
  };
}

let app: App | null = null;

function getAdminApp(): App {
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0];
    return app;
  }

  const serviceAccount = getServiceAccount();
  app = initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    } satisfies ServiceAccount),
  });
  return app;
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}
