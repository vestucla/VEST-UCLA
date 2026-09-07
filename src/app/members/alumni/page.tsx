"use client";

import PortalShell from "@/components/Members/PortalShell";
import MemberDirectory from "@/components/Members/MemberDirectory";
import { MemberStatus } from "@/data/members";

export default function AlumniPage() {
  return (
    <PortalShell
      title={
        <>
          Alumni <span className="italic font-sans font-normal text-blue">Portfolio</span>
        </>
      }
      subtitle="Where our members go after VEST. Hiring, partnering, or want to reconnect? Reach out — alumni love hearing from the next class."
    >
      <MemberDirectory
        status={MemberStatus.Alumni}
        emptyHint="No alumni profiles yet. Once members graduate, they’ll show up here."
      />
    </PortalShell>
  );
}
