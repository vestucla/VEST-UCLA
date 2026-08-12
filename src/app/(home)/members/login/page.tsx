"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { toast } from "sonner";
import PortalShell from "@/components/Members/PortalShell";
import { useAuth } from "@/lib/auth";

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
    <main>
      <PortalShell
        title={
          <>
            Member <span className="italic">Login</span>
          </>
        }
        subtitle="Sign in with the Google account associated with your member profile."
      >
        {user ? (
          <Card>
            <h3>Signed in as {user.email}</h3>
            <p>You can now see member contact details across the portal.</p>
            <Row>
              <PrimaryButton type="button" onClick={() => router.push("/members")}>
                Browse members
              </PrimaryButton>
              <GhostButton type="button" onClick={() => signOut()}>
                Sign out
              </GhostButton>
            </Row>
          </Card>
        ) : (
          <Card>

            <GoogleButton type="button" disabled={submitting} onClick={handleGoogleSignIn}>
              <GoogleIcon />
              {submitting ? "Signing in…" : "Sign in with Google"}
            </GoogleButton>

            <Hint>Only emails already listed in the members collection can sign in.</Hint>
          </Card>
        )}
      </PortalShell>
    </main>
  );
}

const Card = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 32px;
  border-radius: 24px;
  background: linear-gradient(
    90deg,
    rgba(30, 70, 200, 0.18) 0%,
    rgba(50, 30, 110, 0.18) 100%
  );
  box-shadow: inset 0 0 30px 0 rgba(239, 239, 239, 0.12);
  display: flex;
  flex-direction: column;
  gap: 18px;
  color: #efefef;

  h3 {
    font-size: var(--text-xl);
  }
  p {
    color: rgba(239, 239, 239, 0.75);
    font-size: var(--text-sm);
  }
`;


const Row = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  height: 44px;
  padding: 0 20px;
  border-radius: 999px;
  border: 1px solid rgba(173, 206, 255, 0.5);
  background: rgba(173, 206, 255, 0.18);
  color: #fff;
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background 200ms ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover:not(:disabled) {
      background: rgba(173, 206, 255, 0.28);
    }
  }
`;

const GhostButton = styled.button`
  height: 44px;
  padding: 0 20px;
  border-radius: 999px;
  border: 1px solid rgba(239, 239, 239, 0.2);
  background: transparent;
  color: #efefef;
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background 200ms ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: rgba(239, 239, 239, 0.08);
    }
  }
`;


const GoogleButton = styled.button`
  height: 44px;
  padding: 0 20px;
  border-radius: 999px;
  border: 1px solid rgba(239, 239, 239, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: var(--text-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background 200ms ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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

const Hint = styled.p`
  font-size: var(--text-xs);
  color: rgba(239, 239, 239, 0.5);
  text-align: center;
`;
