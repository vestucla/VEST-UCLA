"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import PortalShell from "@/components/Members/PortalShell";
import MemberProfile from "@/components/Members/MemberProfile";
import { getMember, type Member } from "@/lib/members";

interface Params {
  params: { slug: string };
}

export default function MemberProfilePage({ params }: Params) {
  const [member, setMember] = useState<Member | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    getMember(params.slug).then((m) => {
      if (!cancelled) setMember(m);
    });
    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  if (member === undefined) {
    return (
      <main>
        <PortalShell title="Loading…">
          <div style={{ color: "rgba(239,239,239,0.6)" }}>Fetching profile…</div>
        </PortalShell>
      </main>
    );
  }

  if (member === null) {
    notFound();
  }

  return (
    <main>
      <PortalShell
        title={
          <>
            {member.firstName} <span className="italic">{member.lastName}</span>
          </>
        }
        subtitle={
          <Link
            href={member.status === "alumni" ? "/members/alumni" : "/members"}
            style={{ color: "rgba(173, 206, 255, 0.9)", textDecoration: "none" }}
          >
            ← Back to {member.status === "alumni" ? "alumni" : "directory"}
          </Link>
        }
      >
        <MemberProfile member={member} />
      </PortalShell>
    </main>
  );
}
