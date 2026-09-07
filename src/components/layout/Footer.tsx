import Link from "next/link";
import {
  ArrowUpRight,
  DiscordLogo,
  EnvelopeSimple,
  InstagramLogo,
  LinkedinLogo,
  XLogo,
} from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/data/site";
import { VestMark } from "@/components/ui/VestMark";

/** The design lists Join Us here rather than in the Connect column. */
const NAVIGATE = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/members", label: "Members" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/join", label: "Join Us" },
];

const SOCIALS = [
  { href: siteConfig.links.linkedin, label: "LinkedIn", Icon: LinkedinLogo },
  { href: siteConfig.links.instagram, label: "Instagram", Icon: InstagramLogo },
  { href: siteConfig.links.x, label: "X", Icon: XLogo },
  { href: siteConfig.links.discord, label: "Discord", Icon: DiscordLogo },
  { href: siteConfig.links.email, label: "Email", Icon: EnvelopeSimple },
];

export default function Footer() {
  return (
    <footer className="footer-sky relative text-white">
      {/* 720px and 105px of top padding at the design width. The lower half is
          cloud, so all content is held in the upper block. */}
      <div className="container-content pb-14 pt-24 md:min-h-[720px] md:pt-[105px]">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16">
          {/* Wordmark lockup: mark, then VEST stacked over "at UCLA".
              `self-start` so it hangs from the same top edge as the column
              beside it instead of centring against a taller neighbour. */}
          <Link
            href="/"
            className="flex w-fit items-center gap-[23px] transition-opacity duration-200 hover:opacity-80 md:self-start"
          >
            <VestMark className="h-16 w-16 text-white md:h-[100px] md:w-[100px]" />
            <span className="flex flex-col items-center leading-none">
              <span className="font-display text-display-xl text-white">
                VEST
              </span>
              <span className="text-[1.5rem] text-white md:text-[2rem]">
                at UCLA
              </span>
            </span>
          </Link>

          <div className="flex flex-col gap-9">
            <p className="font-display text-display text-white">
              Let’s take flight.
            </p>

            <div className="grid grid-cols-2 gap-9">
              <FooterColumn title="Navigate">
                {NAVIGATE.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </FooterColumn>

              {/* Connect is icons plus the newsletter pill, not a link list. */}
              <div>
                <h2 className="footer-heading">Connect</h2>
                <ul className="mt-4 flex flex-wrap items-center gap-[15px]">
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

                <a
                  href={siteConfig.links.newsletter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-inverse mt-6 px-3 py-1"
                >
                  Newsletter
                  <ArrowUpRight size={16} weight="bold" />
                </a>
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

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="footer-heading">{title}</h2>
      <ul className="mt-4 flex flex-col gap-4">{children}</ul>
    </div>
  );
}
