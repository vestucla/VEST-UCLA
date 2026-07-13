"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { toast } from "sonner";
import PortalShell from "@/components/Members/PortalShell";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { user, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { needsPasswordReset, profileCompleted } = await signIn(
        email,
        password
      );
      toast.success("Signed in.");
      if (needsPasswordReset) {
        router.push("/members/reset-password");
      } else if (!profileCompleted) {
        router.push("/members/onboarding");
      } else {
        router.push("/members");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed.");
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
        subtitle="Sign in with your VEST email to view contact info (email + phone) on every member profile."
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
          <Card as="form" onSubmit={onSubmit}>
            <Field>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@vestucla.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Hint>
                v1 stub: any password works. Real auth (Supabase magic link) is on the
                roadmap — see <code>src/lib/auth.tsx</code>.
              </Hint>
            </Field>
            <PrimaryButton type="submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </PrimaryButton>
          </Card>
        )}
      </PortalShell>
    </main>
  );
}

const Card = styled.div`
  max-width: 480px;
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

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(239, 239, 239, 0.6);
`;

const Input = styled.input`
  height: 44px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(239, 239, 239, 0.15);
  background: rgba(239, 239, 239, 0.06);
  color: #efefef;
  font-size: var(--text-base);
  outline: none;
  transition: border-color 200ms ease, background 200ms ease;

  &::placeholder {
    color: rgba(239, 239, 239, 0.4);
  }
  &:focus {
    border-color: rgba(173, 206, 255, 0.6);
    background: rgba(239, 239, 239, 0.1);
  }
`;

const Hint = styled.span`
  font-size: var(--text-xs);
  color: rgba(239, 239, 239, 0.5);
  code {
    font-family: var(--font-geist-mono), ui-monospace, monospace;
    background: rgba(239, 239, 239, 0.08);
    padding: 1px 6px;
    border-radius: 4px;
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
  transition: background 200ms ease, transform 200ms ease;

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
