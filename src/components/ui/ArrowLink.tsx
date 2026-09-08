import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { clsx } from "clsx";

/**
 * Quiet text CTA: a blue underlined link with an arrow that travels right on
 * hover. Used where a section wants to point somewhere without a filled
 * button competing with the heading above it.
 *
 * The styling and motion live in `.link-cta` (globals.css) so every one of
 * these resolves identically and reduced-motion is handled in one place. The
 * arrow is decorative — the link text names the destination.
 */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={clsx("link-cta", className)}>
      {children}
      <span aria-hidden="true" className="link-cta-arrow shrink-0">
        <ArrowRight size={16} weight="bold" />
      </span>
    </Link>
  );
}
