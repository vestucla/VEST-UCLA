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
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "./firebase";

export type MemberRole = "admin" | "member";
export type MemberStatus = "active" | "alumni";

export interface MemberDoc {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: MemberRole;
  status?: MemberStatus;
  mustChangePassword?: boolean;
  profileCompleted?: boolean;
  // Profile fields filled in by the member during onboarding.
  bio?: string;
  interests?: string[];
  experiences?: ExperienceItem[];
  currentlyWorkingOn?: string;
  major?: string;
  classYear?: string;
  city?: string;
  imageSrc?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface AuthUser {
  email: string;
  uid: string;
  firstName?: string;
  lastName?: string;
  role?: MemberRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isMember: boolean;
  isAdmin: boolean;
  needsPasswordReset: boolean;
  profileCompleted: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ needsPasswordReset: boolean; profileCompleted: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const MEMBER_DOMAINS = ["@vestucla.com", "@g.ucla.edu", "@ucla.edu"];

async function loadMemberDoc(uid: string): Promise<MemberDoc | null> {
  try {
    const db = getFirebaseDb();
    const snap = await getDoc(doc(db, "members", uid));
    if (!snap.exists()) return null;
    return { uid, ...snap.data() } as MemberDoc;
  } catch {
    return null;
  }
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
      const doc = await loadMemberDoc(firebaseUser.uid);
      setMemberDoc(doc);
      setUser({
        email: firebaseUser.email ?? doc?.email ?? "",
        uid: firebaseUser.uid,
        firstName: doc?.firstName,
        lastName: doc?.lastName,
        role: doc?.role,
      });
      setLoading(false);
    });
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const auth = getFirebaseAuth();
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const doc = await loadMemberDoc(cred.user.uid);
      const nextUser = {
        email: cred.user.email ?? doc?.email ?? email,
        uid: cred.user.uid,
        firstName: doc?.firstName,
        lastName: doc?.lastName,
        role: doc?.role,
      };
      setUser(nextUser);
      setMemberDoc(doc);
      const needsPasswordReset = doc?.mustChangePassword ?? false;
      const profileCompleted = doc?.profileCompleted ?? false;
      return { needsPasswordReset, profileCompleted };
    },
    [setUser, setMemberDoc]
  );

  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
    setUser(null);
    setMemberDoc(null);
  }, []);

  const isMember = useMemo(() => {
    if (!user) return false;
    if (memberDoc?.role === "member" || memberDoc?.role === "admin") return true;
    return MEMBER_DOMAINS.some((d) => user.email.endsWith(d));
  }, [user, memberDoc]);

  const isAdmin = useMemo(
    () => memberDoc?.role === "admin",
    [memberDoc]
  );

  const needsPasswordReset = useMemo(
    () => memberDoc?.mustChangePassword ?? false,
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
      needsPasswordReset,
      profileCompleted,
      signIn,
      signOut,
    }),
    [
      user,
      loading,
      isMember,
      isAdmin,
      needsPasswordReset,
      profileCompleted,
      signIn,
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
