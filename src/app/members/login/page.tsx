"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PortalShell from "@/components/Members/PortalShell";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    try {
      const { profileCompleted } = await signInWithGoogle();
      toast.success("Signed in with Google.");
      if (!profileCompleted) {
        router.push("/members/onboarding");
      } else {
        router.push("/members");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PortalShell
      title={<>Member <span className="italic font-sans font-normal text-blue">Login</span></>}
      subtitle="Sign in with the Google account associated with your member profile."
    >
      {user ? (
        <Card className="max-w-[480px] mx-auto p-8 flex flex-col gap-6">
          <h3 className="font-sans font-bold text-xl text-black">Signed in as {user.email}</h3>
          <p className="text-black-80">You can now see member contact details across the portal.</p>
          <div className="flex flex-wrap gap-4 mt-2">
            <button type="button" onClick={() => router.push("/members")} className="btn btn-primary">
              Browse members
            </button>
            <button type="button" onClick={() => signOut()} className="btn btn-ghost">
              Sign out
            </button>
          </div>
        </Card>
      ) : (
        <Card className="max-w-[480px] mx-auto p-8 flex flex-col gap-6">
          <button
            type="button"
            disabled={submitting}
            onClick={handleGoogleSignIn}
            className="btn btn-inverse w-full flex items-center justify-center gap-3 py-4"
          >
            <GoogleIcon />
            {submitting ? "Signing in…" : "Sign in with Google"}
          </button>
          <p className="text-xs text-black-50 text-center">
            Only emails already listed in the members collection can sign in.
          </p>
        </Card>
      )}
    </PortalShell>
  );
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);
