"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { List, SignOut, X, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { useAuth } from "@/lib/auth";
import { VestMark } from "@/components/ui/VestMark";
import { FocusReticle } from "@/components/ui/FocusReticle";

/** The whole nav: four pages, then Join Us as the button. Nothing else. */
const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/events", label: "Events" },
];

/** True for the page itself and, for /events, its detail pages. */
function isCurrent(pathname: string, href: string) {
  // Every path begins with "/", so the landing page has to match exactly —
  // the prefix test below would otherwise mark Home current site-wide.
  if (href === "/") return pathname === "/";
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
      if (!accountRef.current?.contains(e.target as Node))
        setAccountOpen(false);
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
    <header className="fixed inset-x-0 top-4 z-50 md:top-5">
      {/* 1380 of the design's 1440, i.e. a 30px margin either side — the pill
          is nearly full-bleed rather than a centred capsule. */}
      <div className="mx-auto w-full max-w-[1380px] px-4 md:px-[30px]">
        {/* The design holds the links and the Join Us button in one 36px
            row, so the pill's own gap has to be that same 36px — the
            button is the last item in the row, not a separate cluster. */}
        <div className="nav-pill flex items-center justify-between gap-4 px-3 py-2 md:gap-9 md:px-4">
          <Link
            href="/"
            aria-label="VEST at UCLA — home"
            className="nav-logo shrink-0 rounded-full text-blue"
          >
            {/* The mark's own artboard carries the design's 20%/13% inset, so
                a plain 36px box reproduces the drawn geometry. */}
            <VestMark className="h-8 w-8 md:h-9 md:w-9" />
          </Link>

          <nav
            aria-label="Primary"
            className="reticle-row ml-auto hidden md:flex md:items-center md:gap-9"
          >
            <FocusReticle />

            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                className="nav-link text-body"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Account slot. Rendered only for a signed-in member, so the
                public nav is exactly the five elements the design draws.
                No reserved width while Firebase resolves: holding 36px open
                would put a permanent gap in the design for the signed-out
                majority to spare signed-in members one shift on hard load. */}
            {!loading && user && (
              <div ref={accountRef} className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setAccountOpen((open) => !open)}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  aria-label="Account menu"
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-blue-50 bg-blue text-xs font-semibold uppercase text-white transition-[background-color,transform] duration-[var(--dur-fast)] ease-out-quart hover:bg-blue-80 active:scale-[0.94]"
                >
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </button>

                <div
                  role="menu"
                  data-open={accountOpen}
                  inert={!accountOpen}
                  className="nav-account-menu absolute right-0 top-full z-10 mt-3 w-64 rounded-card border-2 border-black-10 bg-white p-2 shadow-[0_16px_40px_-20px] shadow-black-30"
                >
                  <div className="border-b-2 border-black-10 px-3 pb-3 pt-2">
                    <p className="truncate text-sm font-semibold text-black">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="truncate text-xs text-black-80">
                      {user.email}
                    </p>
                    {isAdmin && <span className="chip mt-2 text-blue">Admin</span>}
                  </div>
                  <div className="pt-2">
                    {userSlug && (
                      <MenuLink href={`/members/edit/${userSlug}`}>
                        Edit profile
                      </MenuLink>
                    )}
                    <MenuLink href="/members">Member directory</MenuLink>
                    {isAdmin && (
                      <MenuLink href="/members/admin">Manage users</MenuLink>
                    )}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-btn px-3 py-2 text-left text-sm text-black-80 transition-colors duration-[var(--dur-fast)] hover:bg-haze hover:text-black"
                    >
                      <SignOut size={16} />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            )}

            <Link
              href="/events"
              aria-current={isCurrent(pathname, "/join") ? "page" : undefined}
              className="btn btn-primary px-2.5 py-1.5 text-sm leading-[1.4] md:px-3 md:py-1 md:text-base"
            >
              {/* The full sentence does not survive a 375px pill next to the
                  mark and the menu button, and truncating it mid-phrase reads
                  as a bug — so the verb is what goes, not the destination. */}
              <span className="hidden md:inline">Apply or RSVP for</span>
              LA Tech Week <ArrowRight size={16} className="shrink-0" />
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-black transition-colors duration-[var(--dur-fast)] hover:bg-black-10 md:hidden"
            >
              {/* Both glyphs stay mounted and cross-fade through opposing
                  quarter turns, so the control reads as turning rather than
                  as two icons swapping places. */}
              <span
                className="nav-icon"
                data-state={menuOpen ? "hidden" : "shown"}
                aria-hidden="true"
              >
                <List size={20} />
              </span>
              <span
                className="nav-icon"
                data-state={menuOpen ? "shown" : "hidden"}
                style={{ "--nav-icon-turn": "-90deg" } as React.CSSProperties}
                aria-hidden="true"
              >
                <X size={20} />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile sheet — drops out of the pill, origin top */}
        <div
          id="mobile-menu"
          data-open={menuOpen}
          inert={!menuOpen}
          className="nav-sheet mt-2 rounded-card border-2 border-haze-50 bg-white/95 p-2 shadow-[0_16px_40px_-20px] shadow-black-30 backdrop-blur-md md:hidden"
        >
          <nav aria-label="Primary (mobile)" className="flex flex-col">
            {NAV_ITEMS.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                // 30ms apart: enough to cascade, short enough that the
                // last item is still inside the sheet's own 220ms.
                style={{ "--stagger": `${i * 30}ms` } as React.CSSProperties}
                className="nav-sheet-item rounded-btn px-3 py-2.5 text-base"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Rendered only once auth has resolved — an empty divider while
              Firebase initialises reads as a broken menu. */}
          {!loading && user && (
            <div className="mt-2 border-t-2 border-black-10 pt-2">
              {/* Counted on from the nav list rather than written out, so
                  adding a page cannot land two rows on the same beat. */}
              {userSlug && (
                <SheetLink
                  href={`/members/edit/${userSlug}`}
                  index={NAV_ITEMS.length}
                >
                  Edit profile
                </SheetLink>
              )}
              <SheetLink href="/members" index={NAV_ITEMS.length + 1}>
                Member directory
              </SheetLink>
              {isAdmin && (
                <SheetLink href="/members/admin" index={NAV_ITEMS.length + 2}>
                  Manage users
                </SheetLink>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                style={
                  {
                    "--stagger": `${(NAV_ITEMS.length + 3) * 30}ms`,
                  } as React.CSSProperties
                }
                className="nav-sheet-item block w-full cursor-pointer rounded-btn px-3 py-2.5 text-left text-base"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function SheetLink({
  href,
  index,
  children,
}: {
  href: string;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{ "--stagger": `${index * 30}ms` } as React.CSSProperties}
      className="nav-sheet-item block rounded-btn px-3 py-2.5 text-base"
    >
      {children}
    </Link>
  );
}

function MenuLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="block rounded-btn px-3 py-2 text-sm text-black-80 transition-colors duration-[var(--dur-fast)] hover:bg-haze hover:text-black"
    >
      {children}
    </Link>
  );
}
