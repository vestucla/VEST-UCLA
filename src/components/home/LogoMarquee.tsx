"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { Logo } from "@/data/logos";

/** Constant travel speed, so adding a logo lengthens the loop instead of speeding it up. */
const PX_PER_SECOND = 42;

/**
 * The "Trusted by" row as an infinite, seamlessly looping marquee.
 *
 * In the design this row is wider than the artboard and bleeds off both edges,
 * which is the tell that it is meant to move. The track holds two identical
 * copies and slides exactly -50% of its own width, so copy B lands precisely
 * where copy A began: the wrap is invisible and costs no JS per frame.
 *
 * For that to hold, the copies must be equal width *including* their trailing
 * gap — so the spacing is a `margin-inline-end` on every cell rather than a
 * flex `gap`. A flex gap is dropped after each copy's last child, which would
 * leave the loop half a gap short and visibly hitch once per pass.
 */
export function LogoMarquee({
  logos,
  height = 60,
  gap = 84,
  className,
  label = "Logos",
}: {
  logos: Logo[];
  /** Optical height of a 60px-tall design logo, in px. */
  height?: number;
  gap?: number;
  className?: string;
  label?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduceMotion) return;

    // Both copies live in the track, so one loop travels half of it.
    const measure = () => setDuration(track.scrollWidth / 2 / PX_PER_SECOND);

    measure();
    // A transform animation never changes scrollWidth, so this cannot feed
    // back on itself; it just catches the row settling and the viewport
    // changing width.
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [logos, height, gap, reduceMotion]);

  const cells = logos.map((logo, i) => (
    <li
      key={`${logo.name}-${i}`}
      className="flex shrink-0 items-center justify-center"
      // Scaled rather than a fixed px gap, so the row tightens on a phone by
      // the same factor the marks shrink by and the rhythm is preserved.
      style={{ marginInlineEnd: "calc(var(--marquee-gap) * var(--marquee-scale))" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt={logo.name}
        width={logo.width}
        height={logo.height}
        // Eager: these cells arrive by transform, and lazy loading is
        // evaluated against the scroll viewport, so a logo parked in the
        // horizontal overflow would never load and would slide in blank.
        // Eight SVGs at ~9KB, deprioritised behind the hero.
        loading="eager"
        fetchPriority="low"
        decoding="async"
        className="w-auto max-w-none object-contain"
        // Scaled off the design's own height for this mark, so Pareto stays
        // optically smaller than the rest exactly as drawn.
        style={{
          height: `calc(${logo.height / 60} * var(--marquee-h) * var(--marquee-scale))`,
        }}
      />
    </li>
  ));

  // `--marquee-scale` is the one responsive knob, set in the stylesheet: a
  // 60px logo row is a fifth of a phone's viewport height for decoration.
  const vars = {
    "--marquee-h": `${height}px`,
    "--marquee-gap": `${gap}px`,
  } as React.CSSProperties;

  // Reduced motion: no autoplay. The row becomes a plain horizontal scroller,
  // so every logo is still reachable — just under the reader's own control.
  if (reduceMotion) {
    return (
      <div
        style={vars}
        className={`marquee-root overflow-x-auto ${className ?? ""}`}
      >
        <ul aria-label={label} className="flex w-max items-center">
          {cells}
        </ul>
      </div>
    );
  }

  return (
    // Full-bleed by design: the edge mask has to land on the viewport edges,
    // so this must not be inset by the page gutter.
    <div
      style={vars}
      className={`marquee marquee-root group relative overflow-hidden ${className ?? ""}`}
    >
      <div
        ref={trackRef}
        className="marquee-track flex w-max"
        style={{
          animationDuration: duration ? `${duration}s` : undefined,
          animationPlayState: duration ? "running" : "paused",
        }}
      >
        <ul aria-label={label} className="flex items-center">
          {cells}
        </ul>
        {/* The visual tail of the loop. Announcing it would read the list twice. */}
        <ul aria-hidden="true" className="flex items-center">
          {cells}
        </ul>
      </div>
    </div>
  );
}
