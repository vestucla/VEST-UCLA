"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import PortalShell from "@/components/Members/PortalShell";
import { useAuth } from "@/lib/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { MembersOrm } from "@/lib/orm/members";
import {
  MemberRole,
  MemberStatus,
  memberSlug,
  type MemberDoc,
} from "@/data/members";

function csvCell(value: string) {
  return `"${value.replaceAll(`"`, `""`)}"`;
}

export default function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<MemberRole>(MemberRole.Member);
  const [status, setStatus] = useState<MemberStatus>(MemberStatus.Active);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<{ email: string } | null>(null);

  const [members, setMembers] = useState<MemberDoc[]>([]);
  const [phones, setPhones] = useState<Record<string, string>>({});
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);

  const loadMembers = async () => {
    const list = await MembersOrm.findAll();
    list.sort((a, b) => (a.lastName ?? "").localeCompare(b.lastName ?? ""));
    setMembers(list);

    const contactEntries = await Promise.all(
      list.map(async (m) => {
        const c = await MembersOrm.findContactByUuid(m.uuid);
        return [m.uuid, c?.phone ?? ""] as const;
      })
    );
    setPhones(Object.fromEntries(contactEntries));
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
    if (
      !confirm(
        `Are you sure you want to delete ${memberEmail}? This cannot be undone.`
      )
    ) {
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

  const onExportCsv = () => {
    const header = ["Name", "Year", "Email", "Phone Number", "Major"];
    const rows = members.map((m) => [
      `${m.firstName ?? ""} ${m.lastName ?? ""}`.trim(),
      m.classYear ?? "",
      m.email ?? "",
      phones[m.uuid] ?? "",
      m.major ?? "",
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((value) => csvCell(value)).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `members-${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main>
      <PortalShell
        title={
          <>
            Manage <span className="italic">Users</span>
          </>
        }
        subtitle="Create, edit, and manage member profiles."
      >
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
                    onChange={(e) => setRole(e.target.value as MemberRole)}
                    className="h-10 rounded-lg border border-white/15 bg-white/5 px-2 text-sm text-white outline-none focus:border-white/30"
                  >
                    <option value={MemberRole.Member}>Member</option>
                    <option value={MemberRole.Admin}>Admin</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-wider text-neutral-400">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as MemberStatus)}
                    className="h-10 rounded-lg border border-white/15 bg-white/5 px-2 text-sm text-white outline-none focus:border-white/30"
                  >
                    <option value={MemberStatus.Active}>Active</option>
                    <option value={MemberStatus.Alumni}>Alumni</option>
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

          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-medium text-white">
                All Members ({members.length})
              </h2>
              <button
                type="button"
                onClick={onExportCsv}
                disabled={members.length === 0}
                className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="min-w-[900px] w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Year
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Major
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr
                      key={m.uuid}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="px-4 py-3 text-sm text-white">
                        {m.firstName} {m.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-300">
                        {m.classYear ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-300">
                        {m.major ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                            m.status === MemberStatus.Active
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-purple-500/20 text-purple-300"
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-300">
                        {m.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-300">
                        {phones[m.uuid] || "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/members/edit/${memberSlug(
                              m.firstName ?? "",
                              m.lastName ?? ""
                            )}`}
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
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-sm text-neutral-400"
                      >
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
