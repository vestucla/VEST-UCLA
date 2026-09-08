import PortalShell from "@/components/Members/PortalShell";
import MemberDirectory from "@/components/Members/MemberDirectory";
import { MemberStatus } from "@/lib/members";

export default function Team() {
  return (
    <PortalShell
      title="Our Team"
      subtitle="Meet the builders, engineers, and designers that make up our community."
      tabs={[
        { href: "/team", label: "Members" },
        { href: "/members/alumni", label: "Alumni" },
      ]}
    >
      <section className="section bg-white min-h-[60vh]">
        <div className="container-content">
          <MemberDirectory status={MemberStatus.Active} />
        </div>
      </section>
    </PortalShell>
  );
}
