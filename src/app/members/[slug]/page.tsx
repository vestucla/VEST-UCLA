"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import PortalShell from "@/components/Members/PortalShell";
import MemberProfile from "@/components/Members/MemberProfile";
import { getMember, type Member } from "@/lib/members";

interface Params {
  params: Promise<{ slug: string }>;
}

export default function MemberProfilePage({ params }: Params) {
  const { slug } = use(params);
  const [member, setMember] = useState<Member | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    getMember(slug).then((m) => {
      if (!cancelled) setMember(m);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

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
      >
        <div className="mb-6 md:mb-8">
          <Link
            href={member.status === "alumni" ? "/members/alumni" : "/team"}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue transition-colors hover:text-blue-80"
          >
            <ArrowLeft size={16} weight="bold" />
            Back to {member.status === "alumni" ? "alumni" : "directory"}
          </Link>
        </div>
        <MemberProfile member={member} />
      </PortalShell>
    </main>
  );
}
