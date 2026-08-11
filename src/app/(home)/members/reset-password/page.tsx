"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updatePassword } from "firebase/auth";
import PortalShell from "@/components/Members/PortalShell";
import { useAuth } from "@/lib/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { MembersOrm } from "@/lib/orm/members";

export default function ResetPasswordPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <PortalShell title="Reset password">
        <p className="text-neutral-400">Loading…</p>
      </PortalShell>
    );
  }

  if (!user) {
    return (
      <PortalShell title="Reset password">
        <p className="text-neutral-400">Please sign in first.</p>
      </PortalShell>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    try {
      const auth = getFirebaseAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Not signed in");

      await updatePassword(currentUser, password);
      if (!user.uuid) throw new Error("Missing member profile");
      await MembersOrm.update(user.uuid, { mustChangePassword: false });

      toast.success("Password updated");
      router.push("/members/onboarding");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <PortalShell
        title={<>Reset <span className="italic">Password</span></>}
        subtitle="Choose a new password for your VEST account."
      >
        <form
          onSubmit={onSubmit}
          className="mx-auto flex max-w-md flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-wider text-neutral-400">
              New password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-white/30"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-wider text-neutral-400">
              Confirm password
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className="h-11 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white outline-none focus:border-white/30"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 h-11 rounded-full bg-white/10 px-6 text-sm font-medium text-white transition hover:bg-white/20 disabled:opacity-50"
          >
            {submitting ? "Updating…" : "Update password"}
          </button>
        </form>
      </PortalShell>
    </main>
  );
}
