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
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
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
  vestTitle?: string;
  phone?: string;
  joinedYear?: string;
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
  signInWithGoogle: () => Promise<{ needsPasswordReset: boolean; profileCompleted: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const MEMBER_DOMAINS = ["@vestucla.com", "@g.ucla.edu", "@ucla.edu"];

const ALLOWED_DOMAINS = ["g.ucla.edu", "ucla.edu"];

async function loadMemberDocByEmail(email: string): Promise<MemberDoc | null> {
  try {
    const db = getFirebaseDb();
    const q = query(collection(db, "members"), where("email", "==", email));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { uid: doc.id, ...doc.data() } as MemberDoc;
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
      const email = firebaseUser.email ?? "";
      const memberDoc = await loadMemberDocByEmail(email);
      setMemberDoc(memberDoc);
      setUser({
        email,
        uid: firebaseUser.uid,
        firstName: memberDoc?.firstName,
        lastName: memberDoc?.lastName,
        role: memberDoc?.role,
      });
      setLoading(false);
    });
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      // Check if member profile exists before allowing sign-in
      const existingMember = await loadMemberDocByEmail(email);
      if (!existingMember) {
        throw new Error("No member profile found. Contact an admin to create your account.");
      }

      const auth = getFirebaseAuth();
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const memberDoc = await loadMemberDocByEmail(cred.user.email ?? email);
      const nextUser = {
        email: cred.user.email ?? memberDoc?.email ?? email,
        uid: cred.user.uid,
        firstName: memberDoc?.firstName,
        lastName: memberDoc?.lastName,
        role: memberDoc?.role,
      };
      setUser(nextUser);
      setMemberDoc(memberDoc);
      const needsPasswordReset = memberDoc?.mustChangePassword ?? false;
      const profileCompleted = memberDoc?.profileCompleted ?? false;
      return { needsPasswordReset, profileCompleted };
    },
    [setUser, setMemberDoc]
  );

  const signInWithGoogle = useCallback(async () => {
    const auth = getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    // Restrict to UCLA domains
    provider.setCustomParameters({ hd: "*" }); // Allow popup, we'll validate after

    const result = await signInWithPopup(auth, provider);
    const email = result.user.email;

    if (!email) {
      await firebaseSignOut(auth);
      throw new Error("Could not get email from Google account.");
    }

    // Check UCLA domain
    const domain = email.split("@")[1];
    if (!ALLOWED_DOMAINS.includes(domain)) {
      await firebaseSignOut(auth);
      throw new Error("You must use a UCLA email (@g.ucla.edu or @ucla.edu).");
    }

    // Check if member profile exists
    const memberDoc = await loadMemberDocByEmail(email);
    if (!memberDoc) {
      await firebaseSignOut(auth);
      throw new Error("No member profile found. Contact an admin to create your account.");
    }

    const nextUser = {
      email,
      uid: result.user.uid,
      firstName: memberDoc.firstName,
      lastName: memberDoc.lastName,
      role: memberDoc.role,
    };
    setUser(nextUser);
    setMemberDoc(memberDoc);
    const needsPasswordReset = memberDoc.mustChangePassword ?? false;
    const profileCompleted = memberDoc.profileCompleted ?? false;
    return { needsPasswordReset, profileCompleted };
  }, [setUser, setMemberDoc]);

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
      signInWithGoogle,
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
