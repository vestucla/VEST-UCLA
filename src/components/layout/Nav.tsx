"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { List, SignOut, X } from "@phosphor-icons/react/dist/ssr";
import { useAuth } from "@/lib/auth";
import { VestMark } from "@/components/ui/VestMark";

const NAV_ITEMS = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/members", label: "Members" },
  { href: "/leaderboard", label: "Leaderboard" },
];

/** True for the page itself and, for /events, its detail pages. */
function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Nav() {
  const pathname = usePathname();
  const { user, isAdmin, signOut, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const userSlug =
    user?.firstName && user?.lastName
      ? `${user.firstName.toLowerCase()}-${user.lastName.toLowerCase()}`
      : null;

  // Both overlays close on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  // Lock the page behind the mobile sheet.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  // Escape closes whichever overlay is open.
  useEffect(() => {
    if (!menuOpen && !accountOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      setAccountOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, accountOpen]);

  // Pointer-down outside the account menu dismisses it.
  useEffect(() => {
    if (!accountOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!accountRef.current?.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [accountOpen]);

  const handleSignOut = useCallback(async () => {
    setAccountOpen(false);
    setMenuOpen(false);
    await signOut();
  }, [signOut]);

  return (
    <header className="fixed inset-x-0 top-4 z-50 md:top-6">
      <div className="container-content">
        {/* The floating pill */}
        <div className="flex items-center justify-between gap-4 rounded-full border-2 border-haze-50 bg-white/90 py-2 pl-3 pr-2 shadow-[0_8px_32px_-16px] shadow-black-30 backdrop-blur-[4px] md:mx-auto md:w-fit md:gap-9 md:pl-4">
          <Link
            href="/"
            aria-label="VEST at UCLA — home"
            className="shrink-0 rounded-full p-1 text-blue transition-opacity duration-200 hover:opacity-70"
          >
            <VestMark className="h-7 w-7 md:h-8 md:w-8" />
          </Link>

          <nav aria-label="Primary" className="hidden md:flex md:items-center md:gap-9">
            {NAV_ITEMS.map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={`text-sm transition-colors duration-200 ${
                    current
                      ? "font-semibold text-black"
                      : "font-medium text-black-80 hover:text-black"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Auth slot — reserves width while loading so the pill never jumps. */}
            <div ref={accountRef} className="relative hidden md:block">
              {loading ? (
                <div className="h-9 w-9" aria-hidden="true" />
              ) : user ? (
                <>
                  <button
                    type="button"
                    onClick={() => setAccountOpen((open) => !open)}
                    aria-expanded={accountOpen}
                    aria-haspopup="menu"
                    aria-label="Account menu"
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-blue-50 bg-blue text-xs font-semibold uppercase text-white transition-colors duration-200 hover:bg-blue-80"
                  >
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </button>

                  <div
                    role="menu"
                    inert={!accountOpen}
                    className={`absolute right-0 top-full z-10 mt-3 w-64 origin-top-right rounded-card border-2 border-black-10 bg-white p-2 shadow-[0_16px_40px_-20px] shadow-black-30 transition-[opacity,transform,visibility] duration-[var(--dur-fast)] ease-out-quart ${
                      accountOpen
                        ? "visible scale-100 opacity-100"
                        : "invisible scale-[0.96] opacity-0"
                    }`}
                  >
                    <div className="border-b-2 border-black-10 px-3 pb-3 pt-2">
                      <p className="truncate text-sm font-semibold text-black">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="truncate text-xs text-black-80">{user.email}</p>
                      {isAdmin && <span className="chip mt-2 text-blue">Admin</span>}
                    </div>
                    <div className="pt-2">
                      {userSlug && (
                        <MenuLink href={`/members/edit/${userSlug}`}>Edit profile</MenuLink>
                      )}
                      <MenuLink href="/members">Member directory</MenuLink>
                      {isAdmin && <MenuLink href="/members/admin">Manage users</MenuLink>}
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2 rounded-btn px-3 py-2 text-left text-sm text-black-80 transition-colors duration-200 hover:bg-haze hover:text-black"
                      >
                        <SignOut size={16} />
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <Link href="/members/login" className="btn btn-ghost px-3 text-sm">
                  Sign in
                </Link>
              )}
            </div>

            <Link href="/join" className="btn btn-primary px-4 text-sm">
              Join Us
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 items-center justify-center rounded-full text-black transition-colors duration-200 hover:bg-black-10 md:hidden"
            >
              {menuOpen ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile sheet — drops out of the pill, origin top */}
        <div
          id="mobile-menu"
          inert={!menuOpen}
          className={`mt-2 origin-top rounded-card border-2 border-haze-50 bg-white/95 p-2 shadow-[0_16px_40px_-20px] shadow-black-30 backdrop-blur-md transition-[opacity,transform,visibility] duration-[var(--dur-base)] ease-out-quart md:hidden ${
            menuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
          }`}
        >
          <nav aria-label="Primary (mobile)" className="flex flex-col">
            {NAV_ITEMS.map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={`rounded-btn px-3 py-2.5 text-base transition-colors duration-200 ${
                    current
                      ? "bg-haze font-semibold text-black"
                      : "font-medium text-black-80 hover:text-black"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Rendered only once auth has resolved — an empty divider while
              Firebase initialises reads as a broken menu. */}
          {!loading && (
          <div className="mt-2 border-t-2 border-black-10 pt-2">
            {!user && (
              <Link
                href="/members/login"
                className="block rounded-btn px-3 py-2.5 text-base font-medium text-black-80 transition-colors duration-200 hover:text-black"
              >
                Sign in
              </Link>
            )}
            {user && (
              <>
                {userSlug && (
                  <Link
                    href={`/members/edit/${userSlug}`}
                    className="block rounded-btn px-3 py-2.5 text-base font-medium text-black-80 transition-colors duration-200 hover:text-black"
                  >
                    Edit profile
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/members/admin"
                    className="block rounded-btn px-3 py-2.5 text-base font-medium text-black-80 transition-colors duration-200 hover:text-black"
                  >
                    Manage users
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="block w-full rounded-btn px-3 py-2.5 text-left text-base font-medium text-black-80 transition-colors duration-200 hover:text-black"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="block rounded-btn px-3 py-2 text-sm text-black-80 transition-colors duration-200 hover:bg-haze hover:text-black"
    >
      {children}
    </Link>
  );
}
