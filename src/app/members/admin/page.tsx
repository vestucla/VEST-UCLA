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
import { Input, Select } from "@/components/ui/Forms";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";

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
        <p className="text-black-80">Loading…</p>
      </PortalShell>
    );
  }

  if (!isAdmin) {
    return (
      <PortalShell title="Admin">
        <p className="text-black-80">This page is for admins only.</p>
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
    <PortalShell
      title={<>Manage <span className="italic font-sans font-normal text-blue">Users</span></>}
      subtitle="Create, edit, and manage member profiles."
    >
      <div className="mx-auto max-w-5xl flex flex-col gap-12 pb-16">
        <section>
          <h2 className="text-xl font-bold text-black mb-4">Create New Member</h2>
          <Card className="p-6 bg-haze">
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-black-80 font-medium">Email</label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="member@ucla.edu"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-black-80 font-medium">First name</label>
                  <Input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jane"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-black-80 font-medium">Last name</label>
                  <Input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-black-80 font-medium">Role</label>
                    <Select
                      value={role}
                      onChange={(e) => setRole(e.target.value as MemberRole)}
                    >
                      <option value={MemberRole.Member}>Member</option>
                      <option value={MemberRole.Admin}>Admin</option>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider text-black-80 font-medium">Status</label>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as MemberStatus)}
                    >
                      <option value={MemberStatus.Active}>Active</option>
                      <option value={MemberStatus.Alumni}>Alumni</option>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? "Creating…" : "Create Member"}
                </Button>
                {created && (
                  <span className="text-sm font-medium text-blue">
                    ✓ Created {created.email}
                  </span>
                )}
              </div>
            </form>
          </Card>
        </section>

        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-black">
              All Members ({members.length})
            </h2>
            <Button
              type="button"
              variant="inverse"
              onClick={onExportCsv}
              disabled={members.length === 0}
            >
              Export CSV
            </Button>
          </div>
          
          <Card className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left border-collapse">
              <thead>
                <tr className="bg-haze border-b-2 border-black-10">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-black-80">Name</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-black-80">Year</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-black-80">Major</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-black-80">Status</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-black-80">Email</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-black-80">Phone</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-black-80 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-black-80">
                      No members found.
                    </td>
                  </tr>
                ) : (
                  members.map((m) => (
                    <tr key={m.uuid} className="border-b border-black-10 hover:bg-haze/50 transition-colors last:border-0">
                      <td className="px-4 py-3 text-sm text-black font-medium">
                        {m.firstName} {m.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-black-80">{m.classYear ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-black-80">{m.major ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`chip py-1 px-2 text-[10px] uppercase font-bold tracking-wider ${
                            m.status === MemberStatus.Active
                              ? "bg-mint text-black"
                              : "bg-black-10 text-black-80"
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-black-80">{m.email}</td>
                      <td className="px-4 py-3 text-sm text-black-80 font-mono">{phones[m.uuid] || "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/members/edit/${memberSlug(m.firstName ?? "", m.lastName ?? "")}`}
                            className="text-sm font-medium text-blue hover:text-blue-80 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => onDeleteMember(m.email)}
                            disabled={deletingEmail === m.email}
                            className="text-sm font-medium text-black-80 hover:text-red-500 transition-colors disabled:opacity-50"
                          >
                            {deletingEmail === m.email ? "…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
        </section>
      </div>
    </PortalShell>
  );
}
