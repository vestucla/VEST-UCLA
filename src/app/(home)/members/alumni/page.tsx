"use client";

import PortalShell from "@/components/Members/PortalShell";
import MemberDirectory from "@/components/Members/MemberDirectory";

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
          status="alumni"
          emptyHint="No alumni profiles yet. Once members graduate, they’ll show up here."
        />
      </PortalShell>
    </main>
  );
}
