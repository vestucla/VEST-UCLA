"use client";

import PortalShell from "@/components/Members/PortalShell";
import MemberDirectory from "@/components/Members/MemberDirectory";
import { MemberStatus } from "@/data/members";

export default function AlumniPage() {
  return (
    <main>
      <PortalShell
        title={
          <>
            Member <span className="italic">Portfolio</span>
          </>
        }
        subtitle="Where our members go after VEST. Hiring, partnering, or want to reconnect? Reach out — alumni love hearing from the next class."
      >
        <MemberDirectory
          status={MemberStatus.Alumni}
          emptyHint="No alumni profiles yet. Once members graduate, they’ll show up here."
        />
      </PortalShell>
    </main>
  );
}
