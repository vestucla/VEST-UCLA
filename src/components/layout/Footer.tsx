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

const NAVIGATE = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/members", label: "Members" },
  { href: "/leaderboard", label: "Leaderboard" },
];

const CONNECT = [
  { href: "/join", label: "Join Us", external: false },
  { href: siteConfig.links.discord, label: "Discord", external: true },
  { href: siteConfig.links.email, label: "Email us", external: true },
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
      <div className="container-content pb-10 pt-24 md:pb-12 md:pt-40">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16">
          {/* Lockup + wordmark statement */}
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-3 transition-opacity duration-200 hover:opacity-80"
            >
              <VestMark className="h-9 w-9 text-white" />
              <span className="text-lg font-semibold tracking-tight">{siteConfig.name}</span>
            </Link>

            <p className="font-display text-display max-w-[10em] text-white">
              Let’s take flight.
            </p>

            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <a
                href={siteConfig.links.newsletter}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-inverse"
              >
                Newsletter
                <ArrowUpRight size={16} weight="bold" />
              </a>

              <ul className="flex items-center gap-1">
                {SOCIALS.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-white/15"
                    >
                      <Icon size={22} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-12 md:gap-20">
            <FooterColumn title="Navigate">
              {NAVIGATE.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn title="Connect">
              {CONNECT.map((link) =>
                link.external ? (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="footer-link"
                    >
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                )
              )}
            </FooterColumn>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-white/20 pt-6 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VEST at UCLA. All rights reserved.</p>
          <p>Built by VEST members in Westwood.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow text-white/70">{title}</h2>
      <ul className="mt-4 flex flex-col gap-3">{children}</ul>
    </div>
  );
}
