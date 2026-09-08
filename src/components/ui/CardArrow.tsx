import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { clsx } from "clsx";

/**
 * Navigation cue for a card that is itself a link: hidden until the card is
 * hovered or keyboard-focused, then it fades in and travels right.
 *
 * The motion lives in `.card-arrow` (globals.css) rather than here, so every
 * card resolves at the same speed and reduced-motion / touch are handled in
 * one place. Decorative — the link's own text names the destination — so it
 * is hidden from assistive tech.
 */
export function CardArrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={clsx("card-arrow text-blue shrink-0", className)}
    >
      <ArrowRight size={20} weight="bold" />
    </span>
  );
}
