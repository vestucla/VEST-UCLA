import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { MemberDoc } from "@/data/members";
import { toMemberDoc } from "@/lib/orm/mappers";

const COLLECTION = "members";

export const MembersOrm = {
  async findByUuid(uuid: string): Promise<MemberDoc | null> {
    const snap = await getDoc(doc(getFirebaseDb(), COLLECTION, uuid));
    if (!snap.exists()) return null;
    return toMemberDoc(snap.id, snap.data() as Record<string, unknown>);
  },

  async findByEmail(email: string): Promise<MemberDoc | null> {
    const q = query(
      collection(getFirebaseDb(), COLLECTION),
      where("email", "==", email)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return toMemberDoc(d.id, d.data() as Record<string, unknown>);
  },

  async findAll(): Promise<MemberDoc[]> {
    const snap = await getDocs(collection(getFirebaseDb(), COLLECTION));
    return snap.docs.map((d) =>
      toMemberDoc(d.id, d.data() as Record<string, unknown>)
    );
  },

  async findContactByUuid(uuid: string): Promise<{ phone?: string } | null> {
    try {
      const snap = await getDoc(doc(getFirebaseDb(), "memberContacts", uuid));
      if (!snap.exists()) return null;
      return snap.data() as { phone?: string };
    } catch {
      return null;
    }
  },

  async update(uuid: string, data: Partial<Omit<MemberDoc, "uuid">>): Promise<void> {
    await updateDoc(doc(getFirebaseDb(), COLLECTION, uuid), data as DocumentData);
  },
};

export { toMemberDoc, toMember } from "@/lib/orm/mappers";
