"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import PortalShell from "@/components/Members/PortalShell";
import { useAuth } from "@/lib/auth";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";

interface MemberListItem {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}

export default function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [status, setStatus] = useState<"active" | "alumni">("active");
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<{ email: string } | null>(null);

  const [members, setMembers] = useState<MemberListItem[]>([]);
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);

  const loadMembers = async () => {
    const db = getFirebaseDb();
    const snap = await getDocs(collection(db, "members"));
    const list: MemberListItem[] = [];
    snap.forEach((doc) => {
      const d = doc.data();
      list.push({
        uid: doc.id,
        email: d.email ?? "",
        firstName: d.firstName ?? "",
        lastName: d.lastName ?? "",
        role: d.role ?? "member",
        status: d.status ?? "active",
      });
    });
    list.sort((a, b) => a.lastName.localeCompare(b.lastName));
    setMembers(list);
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadMembers().catch(() => toast.error("Failed to load members"));
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
        body: JSON.stringify({ email, firstName, lastName, role, status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create member");

      setCreated({ email: data.email });
      toast.success("Member created");
      setEmail("");
      setFirstName("");
      setLastName("");
      await loadMembers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create member");
    } finally {
      setSubmitting(false);
    }
  };

  const onDeleteMember = async (memberEmail: string) => {
    if (!confirm(`Are you sure you want to delete ${memberEmail}? This cannot be undone.`)) {
      return;
    }
    setDeletingEmail(memberEmail);
    try {
      const auth = getFirebaseAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Not signed in");
      const token = await currentUser.getIdToken();

      const res = await fetch("/api/admin/delete-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: memberEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete member");

      toast.success("Member deleted");
      await loadMembers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete member");
    } finally {
      setDeletingEmail(null);
    }
  };

  const getMemberSlug = (m: MemberListItem) => 
    `${m.firstName.toLowerCase()}-${m.lastName.toLowerCase()}`;

  return (
    <main>
      <PortalShell
        title={<>Manage <span className="italic">Users</span></>}
        subtitle="Create, edit, and manage member profiles."
      >
        {/* Create Member Form */}
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-lg font-medium text-white">Create New Member</h2>
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  className="h-10 rounded-lg border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-white/30"
                />
              </div>
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
                  className="h-10 rounded-lg border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-white/30"
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
                  className="h-10 rounded-lg border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-white/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-wider text-neutral-400">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as "admin" | "member")}
                    className="h-10 rounded-lg border border-white/15 bg-white/5 px-2 text-sm text-white outline-none focus:border-white/30"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-wider text-neutral-400">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "active" | "alumni")}
                    className="h-10 rounded-lg border border-white/15 bg-white/5 px-2 text-sm text-white outline-none focus:border-white/30"
                  >
                    <option value="active">Active</option>
                    <option value="alumni">Alumni</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="h-10 rounded-full bg-emerald-600/30 px-6 text-sm font-medium text-emerald-200 transition hover:bg-emerald-600/40 disabled:opacity-50"
              >
                {submitting ? "Creating…" : "Create Member"}
              </button>
              {created && (
                <span className="text-sm text-emerald-300">
                  ✓ Created {created.email}
                </span>
              )}
            </div>
          </form>

          {/* Member List */}
          <div className="mt-10">
            <h2 className="mb-4 text-lg font-medium text-white">
              All Members ({members.length})
            </h2>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.uid} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3 text-sm text-white">
                        {m.firstName} {m.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-300">
                        {m.email}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          m.role === "admin" 
                            ? "bg-amber-500/20 text-amber-300" 
                            : "bg-blue-500/20 text-blue-300"
                        }`}>
                          {m.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          m.status === "active" 
                            ? "bg-emerald-500/20 text-emerald-300" 
                            : "bg-purple-500/20 text-purple-300"
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/members/edit/${getMemberSlug(m)}`}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-blue-300 transition hover:bg-blue-500/20"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => onDeleteMember(m.email)}
                            disabled={deletingEmail === m.email}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                          >
                            {deletingEmail === m.email ? "…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {members.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-neutral-400">
                        No members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </PortalShell>
    </main>
  );
}
