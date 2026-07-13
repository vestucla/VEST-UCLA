"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { collection, getDocs } from "firebase/firestore";
import PortalShell from "@/components/Members/PortalShell";
import { useAuth } from "@/lib/auth";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";

interface MemberListItem {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
}

export default function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<{
    email: string;
    tempPassword: string;
  } | null>(null);

  // Password reset state
  const [members, setMembers] = useState<MemberListItem[]>([]);
  const [selectedUid, setSelectedUid] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetResult, setResetResult] = useState<{
    email: string;
    tempPassword: string;
  } | null>(null);

  // Load members list for password reset dropdown
  useEffect(() => {
    if (!isAdmin) return;
    const db = getFirebaseDb();
    getDocs(collection(db, "members"))
      .then((snap) => {
        const list: MemberListItem[] = [];
        snap.forEach((doc) => {
          const d = doc.data();
          list.push({
            uid: doc.id,
            email: d.email ?? "",
            firstName: d.firstName ?? "",
            lastName: d.lastName ?? "",
          });
        });
        list.sort((a, b) => a.lastName.localeCompare(b.lastName));
        setMembers(list);
      })
      .catch(() => toast.error("Failed to load members"));
  }, [isAdmin]);

  if (loading) {
    return (
      <PortalShell title="Admin">
        <p className="text-neutral-400">Loading…</p>
      </PortalShell>
    );
  }

  if (!isAdmin) {
    return (
      <PortalShell title="Admin">
        <p className="text-neutral-400">This page is for admins only.</p>
      </PortalShell>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setCreated(null);
    try {
      const auth = getFirebaseAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Not signed in");
      const token = await currentUser.getIdToken();

      const res = await fetch("/api/admin/create-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, firstName, lastName, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create member");

      setCreated({ email: data.email, tempPassword: data.tempPassword });
      toast.success("Member created");
      setEmail("");
      setFirstName("");
      setLastName("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create member");
    } finally {
      setSubmitting(false);
    }
  };

  const onResetPassword = async () => {
    if (!selectedUid) return;
    setResetting(true);
    setResetResult(null);
    try {
      const auth = getFirebaseAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Not signed in");
      const token = await currentUser.getIdToken();

      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid: selectedUid }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      const member = members.find((m) => m.uid === selectedUid);
      setResetResult({
        email: member?.email ?? selectedUid,
        tempPassword: data.tempPassword,
      });
      toast.success("Password reset");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setResetting(false);
    }
  };

  return (
    <main>
      <PortalShell
        title={<>Admin <span className="italic">Dashboard</span></>}
        subtitle="Create a new member account and share the temporary password with them."
      >
        <form
          onSubmit={onSubmit}
          className="mx-auto flex max-w-lg flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-wider text-neutral-400">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@ucla.edu"
              className="h-11 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-white/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-wider text-neutral-400">
                First name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
                className="h-11 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-white/30"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-wider text-neutral-400">
                Last name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="h-11 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-white/30"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-wider text-neutral-400">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "member")}
              className="h-11 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-white/30"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 h-11 rounded-full bg-white/10 px-6 text-sm font-medium text-white transition hover:bg-white/20 disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create member account"}
          </button>

          {created && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              <p>Account created for {created.email}</p>
              <p className="mt-1">
                Temporary password:{" "}
                <code className="rounded bg-black/20 px-1 py-0.5 font-mono">
                  {created.tempPassword}
                </code>
              </p>
              <p className="mt-1 text-xs text-emerald-300/80">
                Share this password with the member. They will be forced to
                reset it on first login.
              </p>
            </div>
          )}
        </form>

        {/* Password Reset Section */}
        <div className="mx-auto mt-12 max-w-lg border-t border-white/10 pt-8">
          <h2 className="mb-4 text-lg font-medium text-white">Reset Member Password</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-wider text-neutral-400">
                Select member
              </label>
              <select
                value={selectedUid}
                onChange={(e) => setSelectedUid(e.target.value)}
                className="h-11 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-white/30"
              >
                <option value="">Choose a member...</option>
                {members.map((m) => (
                  <option key={m.uid} value={m.uid}>
                    {m.lastName}, {m.firstName} ({m.email})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={onResetPassword}
              disabled={!selectedUid || resetting}
              className="h-11 rounded-full bg-amber-600/20 px-6 text-sm font-medium text-amber-200 transition hover:bg-amber-600/30 disabled:opacity-50"
            >
              {resetting ? "Resetting…" : "Reset password"}
            </button>

            {resetResult && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                <p>Password reset for {resetResult.email}</p>
                <p className="mt-1">
                  New temporary password:{" "}
                  <code className="rounded bg-black/20 px-1 py-0.5 font-mono">
                    {resetResult.tempPassword}
                  </code>
                </p>
                <p className="mt-1 text-xs text-amber-300/80">
                  Share this password with the member. They will be forced to
                  reset it on next login.
                </p>
              </div>
            )}
          </div>
        </div>
      </PortalShell>
    </main>
  );
}
