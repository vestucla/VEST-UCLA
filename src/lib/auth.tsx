"use client";

// Stub auth provider for v1. Persists a "logged in" flag in localStorage so
// contact info is gated. Replace with Supabase auth (magic link / Google) in
// v2 — keep the `useAuth()` shape so consuming components don't change.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AuthUser {
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isMember: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "vest.portal.user";

// Demo gate: any email ending in one of these domains is treated as a member.
// For v1 this is just a UX placeholder; real gating happens once we move to
// Supabase + an authoritative members table.
const MEMBER_DOMAINS = ["@vestucla.com", "@g.ucla.edu", "@ucla.edu"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore parse errors
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, _password: string) => {
    // v1 stub: accept anything that looks like an email. No real password
    // checking — make sure to replace this before exposing contact info to
    // the public internet.
    if (!email.includes("@")) throw new Error("Enter a valid email.");
    const next = { email: email.trim().toLowerCase() };
    setUser(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const isMember = useMemo(
    () => !!user && MEMBER_DOMAINS.some((d) => user.email.endsWith(d)),
    [user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, isMember, signIn, signOut }),
    [user, loading, isMember, signIn, signOut]
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
