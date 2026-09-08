import Link from "next/link";
import {
  EnvelopeSimple,
  InstagramLogo,
  LinkedinLogo,
  XLogo,
} from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/data/site";
import { VestMark } from "@/components/ui/VestMark";
import { FocusReticle } from "@/components/ui/FocusReticle";

/**
 * The design lists Join Us here rather than in the Connect column.
 *
 * Sign in is the last entry because the footer is now the only place a
 * signed-out visitor can reach the members portal from: the nav renders its
 * account slot only once Firebase resolves a user, and every other link to
 * /members/login lives inside the portal itself.
 */
const NAVIGATE = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/join", label: "Join Us" },
  { href: "/members/login", label: "Sign in" },
];

const SOCIALS = [
  { href: siteConfig.links.linkedin, label: "LinkedIn", Icon: LinkedinLogo },
  { href: siteConfig.links.instagram, label: "Instagram", Icon: InstagramLogo },
  { href: siteConfig.links.x, label: "X", Icon: XLogo },
  { href: siteConfig.links.email, label: "Email", Icon: EnvelopeSimple },
];

export default function Footer() {
  return (
    <footer className="footer-sky relative text-white">
      {/* 720px and 105px of top padding at the design width. The lower half is
          cloud, so all content is held in the upper block — and since the
          plate now covers on a phone too, the 720px floor has to hold there
          as well: below it the cloud line climbs into the last links, and
          white type over a lit cloud has nothing to hold against. */}
      <div className="container-content min-h-[720px] pb-12 pt-14 md:pb-14 md:pt-[105px]">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16">
          {/* Wordmark lockup: mark, then VEST stacked over "at UCLA".
              `self-start` so it hangs from the same top edge as the column
              beside it instead of centring against a taller neighbour. */}
          <Link
            href="/"
            className="flex w-fit items-center gap-4 transition-opacity duration-200 hover:opacity-80 md:gap-[23px] md:self-start"
          >
            <VestMark className="h-14 w-14 text-white md:h-[100px] md:w-[100px]" />
            <span className="flex flex-col items-center leading-none">
              <span className="font-display text-display-xl text-white">
                VEST
              </span>
              <span className="text-[1.25rem] text-white md:text-[2rem]">
                at UCLA
              </span>
            </span>
          </Link>

          <div className="flex flex-col gap-6 md:gap-9">
            <p className="font-display text-display text-white">
              Let’s take flight.
            </p>

            <div className="grid grid-cols-2 gap-6 md:gap-9">
              <FooterColumn title="Navigate" reticle>
                {NAVIGATE.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </FooterColumn>

              {/* Connect is icon links, not a link list. */}
              <div>
                <h2 className="footer-heading">Connect</h2>
                <ul className="mt-3 flex flex-wrap items-center gap-3 md:mt-4 md:gap-[15px]">
                  {SOCIALS.map(({ href, label, Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target={
                          href.startsWith("mailto:") ? undefined : "_blank"
                        }
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex h-6 w-6 items-center justify-center rounded-[4px] border border-white/60 text-white transition-colors duration-200 hover:border-white hover:bg-white/15"
                      >
                        <Icon size={14} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sits under the columns rather than pinned to the footer's
                bottom edge: down there it would land on the cloud art, where
                white text has nothing to hold against. The shadow covers the
                narrow layouts where the clouds still creep up behind it. */}
            <p className="text-sm text-white/70 [text-shadow:0_1px_10px_rgba(16,16,61,0.55)]">
              © {new Date().getFullYear()} VEST at UCLA. Built by VEST members
              in Westwood.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * `reticle` opts a column into the corner brackets. The reticle is a sibling
 * of the <ul> rather than a child of it, because a list may only contain list
 * items — so the row it measures and listens on is the wrapper, which sits on
 * exactly the list's own box.
 */
function FooterColumn({
  title,
  reticle = false,
  children,
}: {
  title: string;
  reticle?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="footer-heading">{title}</h2>
      <div className={reticle ? "reticle-row mt-3 md:mt-4" : "mt-3 md:mt-4"}>
        {reticle && <FocusReticle />}
        <ul className="flex flex-col gap-3 md:gap-4">{children}</ul>
      </div>
    </div>
  );
}
