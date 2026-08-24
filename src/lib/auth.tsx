"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { getFirebaseAuth } from "./firebase";
import { MembersOrm } from "@/lib/orm/members";
import {
  MemberDoc,
  MemberRole,
  type ExperienceItem,
} from "@/data/members";

export type { MemberDoc, ExperienceItem };
export {
  MemberRole,
  MemberStatus,
  VestTitle,
  JoinedQuarter,
} from "@/data/members";

interface AuthUser {
  email: string;
  /** Firebase Auth uid (for auth APIs only). */
  authUid: string;
  /** Firestore members document id. */
  uuid: string;
  firstName?: string;
  lastName?: string;
  role?: MemberRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isMember: boolean;
  isAdmin: boolean;
  profileCompleted: boolean;
  signInWithGoogle: () => Promise<{ profileCompleted: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthUser(
  email: string,
  authUid: string,
  memberDoc: MemberDoc
): AuthUser {
  return {
    email,
    authUid,
    uuid: memberDoc.uuid,
    firstName: memberDoc.firstName,
    lastName: memberDoc.lastName,
    role: memberDoc.role,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [memberDoc, setMemberDoc] = useState<MemberDoc | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setMemberDoc(null);
        setLoading(false);
        return;
      }
      const email = firebaseUser.email ?? "";
      const doc = await MembersOrm.findByEmail(email);
      setMemberDoc(doc);
      if (doc) {
        setUser(toAuthUser(email, firebaseUser.uid, doc));
      } else {
        await firebaseSignOut(auth);
        setUser(null);
      }
      setLoading(false);
    });
  }, []);


  const signInWithGoogle = useCallback(async () => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ hd: "*" });

    const result = await signInWithPopup(auth, provider);
    const email = result.user.email;

    if (!email) {
      await firebaseSignOut(auth);
      throw new Error("Could not get email from Google account.");
    }

    const doc = await MembersOrm.findByEmail(email);
    if (!doc) {
      await firebaseSignOut(auth);
      throw new Error(
        "No account is associated with that email. Contact your admin."
      );
    }

    setUser(toAuthUser(email, result.user.uid, doc));
    setMemberDoc(doc);
    return {
      profileCompleted: doc.profileCompleted ?? false,
    };
  }, []);

  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
    setUser(null);
    setMemberDoc(null);
  }, []);

  const isMember = useMemo(() => {
    if (!user) return false;
    return (
      memberDoc?.role === MemberRole.Member || memberDoc?.role === MemberRole.Admin
    );
  }, [user, memberDoc]);

  const isAdmin = useMemo(
    () => memberDoc?.role === MemberRole.Admin,
    [memberDoc]
  );


  const profileCompleted = useMemo(
    () => memberDoc?.profileCompleted ?? false,
    [memberDoc]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isMember,
      isAdmin,
      profileCompleted,
      signInWithGoogle,
      signOut,
    }),
    [
      user,
      loading,
      isMember,
      isAdmin,
      profileCompleted,
      signInWithGoogle,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
