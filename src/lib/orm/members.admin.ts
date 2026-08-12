import { getAdminDb } from "@/lib/firebase-admin";
import {
  MemberDoc,
  MemberRole,
  MemberStatus,
  type Experience,
  VestTitle,
  JoinedQuarter,
} from "@/data/members";
import { toMemberDoc } from "@/lib/orm/mappers";

const COLLECTION = "members";

export type CreateMemberInput = {
  email: string;
  firstName: string;
  lastName: string;
  role?: MemberRole;
  status?: MemberStatus;
  vestTitle?: VestTitle;
  joinedYear?: string;
  joinedQuarter?: JoinedQuarter;
};

export type UpdateMemberInput = Partial<
  Omit<MemberDoc, "uuid" | "email" | "createdAt">
> & {
  experiences?: Experience[];
  interests?: string[];
};

export const MembersAdminOrm = {
  async findByUuid(uuid: string): Promise<MemberDoc | null> {
    const snap = await getAdminDb().collection(COLLECTION).doc(uuid).get();
    if (!snap.exists) return null;
    return toMemberDoc(snap.id, (snap.data() ?? {}) as Record<string, unknown>);
  },

  async findByEmail(email: string): Promise<MemberDoc | null> {
    const snap = await getAdminDb()
      .collection(COLLECTION)
      .where("email", "==", email)
      .get();
    if (snap.empty) return null;
    const d = snap.docs[0];
    return toMemberDoc(d.id, d.data() as Record<string, unknown>);
  },

  async findAll(): Promise<MemberDoc[]> {
    const snap = await getAdminDb().collection(COLLECTION).get();
    return snap.docs.map((d) =>
      toMemberDoc(d.id, d.data() as Record<string, unknown>)
    );
  },

  async create(input: CreateMemberInput): Promise<MemberDoc> {
    const payload = {
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role ?? MemberRole.Member,
      status: input.status ?? MemberStatus.Active,
      vestTitle: input.vestTitle ?? null,
      joinedYear: input.joinedYear ?? null,
      joinedQuarter: input.joinedQuarter ?? null,
      profileCompleted: false,
      createdAt: new Date().toISOString(),
    };

    const ref = await getAdminDb().collection(COLLECTION).add(payload);
    return toMemberDoc(ref.id, payload as Record<string, unknown>);
  },

  async update(uuid: string, data: UpdateMemberInput): Promise<void> {
    const { phone, ...rest } = data as UpdateMemberInput & { phone?: string };
    const db = getAdminDb();

    if (Object.keys(rest).length > 0) {
      await db.collection(COLLECTION).doc(uuid).update(rest);
    }
    if (phone !== undefined) {
      await db.collection("memberContacts").doc(uuid).set({ phone }, { merge: true });
    }
  },

  async delete(uuid: string): Promise<void> {
    await getAdminDb().collection(COLLECTION).doc(uuid).delete();
  },
};
