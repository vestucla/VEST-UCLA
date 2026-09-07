"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/ui/PageHeader";
import { FadeIn } from "@/components/ui/FadeIn";

interface Props {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}

const BASE_TABS = [
  { href: "/members", label: "Members" },
  { href: "/members/alumni", label: "Alumni" },
  { href: "/members/accolades", label: "Accolades" },
];

const ADMIN_TAB = { href: "/members/admin", label: "Manage" };

export default function PortalShell({ title, subtitle, children }: Props) {
  const pathname = usePathname();
  const { user, isAdmin, signOut } = useAuth();
  
  const tabs = isAdmin ? [...BASE_TABS, ADMIN_TAB] : BASE_TABS;

  return (
    <div className="bg-white min-h-screen">
      <PageHeader
        title={title as string}
        description={subtitle}
      />

      <section className="section bg-white pt-8">
        <div className="container-content">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black-10 pb-4 mb-8">
              <nav className="flex flex-wrap gap-2">
                {tabs.map((t) => {
                  const active = pathname === t.href;
                  return (
                    <Link
                      key={t.href}
                      href={t.href}
                      className={`chip transition-colors ${
                        active 
                          ? "bg-blue text-white" 
                          : "bg-haze text-black-80 hover:bg-black-10 hover:text-black"
                      }`}
                    >
                      {t.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex items-center gap-4 text-sm">
                {user ? (
                  <>
                    <span className="text-black-80">{user.email}</span>
                    <button onClick={() => signOut()} className="text-blue hover:text-blue-80 font-medium">
                      Sign out
                    </button>
                  </>
                ) : pathname !== "/members/login" ? (
                  <Link href="/members/login" className="text-blue hover:text-blue-80 font-medium">
                    Member login
                  </Link>
                ) : null}
              </div>
            </div>
            
            <div className="w-full">
              {children}
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
