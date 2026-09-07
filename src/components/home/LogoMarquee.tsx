"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { Logo } from "@/data/logos";

/** Constant travel speed, so adding a logo lengthens the loop instead of speeding it up. */
const PX_PER_SECOND = 42;

/**
 * An infinite, seamlessly looping row of logos.
 *
 * The track holds two identical copies and slides exactly -50% of its own
 * width, which lands copy B precisely where copy A started. For that to be
 * seamless the copies must be the same width *including* their trailing gap,
 * so the spacing is a `margin-inline-end` on every cell rather than a flex
 * `gap` — a flex gap is omitted after the last child of each copy and the loop
 * would jump by half a gap on every pass.
 *
 * Duration is derived from the measured width rather than hard-coded: the row
 * reflows with the logo set and the viewport, and a fixed duration would make
 * a wide row scroll fast and a narrow one crawl.
 */
export function LogoMarquee({
  logos,
  height = 28,
  gap = 64,
  className,
  label = "Logos",
}: {
  logos: Logo[];
  /** Rendered logo height in px. */
  height?: number;
  /** Space between logos in px. */
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

    // Both copies are in the track, so one loop travels half of it.
    const measure = () => setDuration(track.scrollWidth / 2 / PX_PER_SECOND);

    measure();
    // Logos are lazy <img>s, so the width is not final on first paint. A
    // transform animation never changes scrollWidth, so this cannot feed back.
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [logos, height, gap, reduceMotion]);

  const cells = logos.map((logo, i) => (
    <li
      key={`${logo.name}-${i}`}
      className="flex shrink-0 items-center justify-center"
      style={{ height: height * 2, marginInlineEnd: gap }}
    >
      {/* Plain <img>: these are already 2-colour PNGs a few KB each, and
          routing 54 of them through the image optimiser would cost more
          requests than it saves bytes. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt={logo.name}
        width={logo.width}
        height={logo.height}
        // Eager, not lazy: these cells arrive by transform, and lazy loading
        // is evaluated against the scroll viewport — logos parked in the
        // horizontal overflow would stay unloaded and slide in as blank gaps.
        // They are 2-colour PNGs a few KB each and both copies share a URL,
        // so this is 27 small requests, deprioritised behind the hero.
        loading="eager"
        fetchPriority="low"
        decoding="async"
        className="w-auto max-w-none object-contain"
        style={{ height: height * (logo.scale ?? 1) }}
      />
    </li>
  ));

  // Reduced motion: no autoplay. The row becomes a plain horizontal scroller
  // so every logo is still reachable, just under the reader's own control.
  if (reduceMotion) {
    return (
      <div className={`overflow-x-auto ${className ?? ""}`}>
        <ul aria-label={label} className="flex w-max items-center">
          {cells}
        </ul>
      </div>
    );
  }

  return (
    // Full-bleed inside its parent by design: the edge mask has to land on
    // the parent's own edges, so this must not be inset by padding.
    <div
      className={`marquee group relative overflow-hidden ${className ?? ""}`}
    >
      <div
        ref={trackRef}
        className="marquee-track flex w-max"
        style={{
          // `linear` only: any easing on constant motion reads as a stutter
          // every time the loop wraps.
          animationDuration: duration ? `${duration}s` : undefined,
          animationPlayState: duration ? "running" : "paused",
        }}
      >
        <ul aria-label={label} className="flex items-center">
          {cells}
        </ul>
        {/* The visual tail of the loop — announcing it again would read the
            whole list twice. */}
        <ul aria-hidden="true" className="flex items-center">
          {cells}
        </ul>
      </div>
    </div>
  );
}
