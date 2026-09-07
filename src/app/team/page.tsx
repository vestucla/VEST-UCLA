import { PageHeader } from "@/components/ui/PageHeader";
import MemberDirectory from "@/components/Members/MemberDirectory";
import { MemberStatus } from "@/lib/members";

export default function Team() {
  return (
    <>
      <PageHeader
        title="Our Team"
        description="Meet the builders, engineers, and designers that make up our community."
      />
      <section className="section bg-white min-h-[60vh]">
        <div className="container-content">
          <MemberDirectory status={MemberStatus.Active} />
        </div>
      </section>
    </>
  );
}
