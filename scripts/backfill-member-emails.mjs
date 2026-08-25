/**
 * One-time backfill: rewrite `members.email` to its normalized (trimmed,
 * lowercased) form so lookups match the email Google returns at sign-in.
 *
 * Usage:
 *   FIREBASE_SERVICE_ACCOUNT_KEY='<service account JSON>' node scripts/backfill-member-emails.mjs [--apply]
 *
 * Without --apply it only reports what would change.
 */
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const apply = process.argv.includes("--apply");

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!raw) {
  console.error("FIREBASE_SERVICE_ACCOUNT_KEY is missing.");
  process.exit(1);
}

const serviceAccount = JSON.parse(raw);
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();
const snap = await db.collection("members").get();

const byNormalized = new Map();
for (const doc of snap.docs) {
  const email = doc.data().email;
  if (typeof email !== "string") continue;
  const normalized = email.trim().toLowerCase();
  const group = byNormalized.get(normalized) ?? [];
  group.push({ id: doc.id, email });
  byNormalized.set(normalized, group);
}

let changed = 0;
let conflicts = 0;

for (const [normalized, docs] of byNormalized) {
  if (docs.length > 1) {
    conflicts += 1;
    console.warn(
      `conflict: ${docs.length} documents share ${normalized} (${docs
        .map((d) => `${d.id}=${d.email}`)
        .join(", ")}) — resolve manually, skipping`
    );
    continue;
  }

  const [doc] = docs;
  if (doc.email === normalized) continue;

  changed += 1;
  console.log(`${doc.id}: "${doc.email}" -> "${normalized}"`);
  if (apply) {
    await db.collection("members").doc(doc.id).update({ email: normalized });
  }
}

console.log(
  `${apply ? "updated" : "would update"} ${changed} document(s); ${conflicts} conflict(s) skipped`
);
