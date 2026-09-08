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
  tabs?: Array<{
    href: string;
    label: string;
  }>;
}

const BASE_TABS = [
  { href: "/members", label: "Members" },
  { href: "/members/alumni", label: "Alumni" },
];

const ADMIN_TAB = { href: "/members/admin", label: "Manage" };

function isActiveTab(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function PortalShell({ title, subtitle, children, tabs }: Props) {
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  
  const baseTabs = tabs ?? BASE_TABS;
  const visibleTabs = isAdmin ? [...baseTabs, ADMIN_TAB] : baseTabs;

  return (
    <div className="bg-white min-h-screen">
      <PageHeader
        title={title as string}
        description={subtitle}
      />

      <section className="section bg-white pt-8">
        <div className="container-content">
          <FadeIn>
            <div className="border-b-2 border-black-10 pb-4 mb-8">
              <nav className="flex flex-wrap gap-2">
                {visibleTabs.map((t) => {
                  const active = isActiveTab(pathname, t.href);
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
