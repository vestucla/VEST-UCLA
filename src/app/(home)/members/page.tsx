"use client";

import PortalShell from "@/components/Members/PortalShell";
import MemberDirectory from "@/components/Members/MemberDirectory";

export default function MembersPage() {
  return (
    <main>
      <PortalShell
        title={
          <>
            Member <span className="italic">Portfolio</span>
          </>
        }
        subtitle="Browse the current VEST class. Search by name, company, or interest — and click into anyone for their full background. VCs, founders, and recruiters welcome."
      >
        <MemberDirectory status="active" />
      </PortalShell>
    </main>
  );
}
