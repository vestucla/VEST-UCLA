"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import type { Event } from "@/data/events";
import { EventCard } from "./EventCard";

const AUTOPLAY_MS = 6000;

/**
 * Scroll-snap carousel of event cards that advances itself and wraps.
 *
 * The track is a native horizontal scroller, so swipe, trackpad and keyboard
 * scrolling all work without JS; the buttons and autoplay just call
 * `scrollTo`. Autoplay pauses while the reader is hovering, focused inside,
 * dragging, or has scrolled the carousel out of view, and is off entirely
 * under reduced motion — the cards stay reachable as a plain scroller.
 */
export function EventCarousel({
  events,
  label = "Events",
}: {
  events: Event[];
  label?: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [dragging, setDragging] = useState(false);

  /** Distance between the starts of adjacent cards. */
  const stepOf = (track: HTMLUListElement) => {
    const [first, second] = track.children;
    if (!(first instanceof HTMLElement)) return 0;
    if (second instanceof HTMLElement) return second.offsetLeft - first.offsetLeft;
    return first.offsetWidth;
  };

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = stepOf(track);
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    setPageCount(step > 0 ? Math.round(maxScroll / step) + 1 : 1);
    setIndex(step > 0 ? Math.round(track.scrollLeft / step) : 0);
  }, []);

  const scrollToIndex = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const count = Math.max(1, pageCount);
      const target = ((i % count) + count) % count;
      const step = stepOf(track);
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      track.scrollTo({
        left: Math.min(target * step, maxScroll),
        behavior: reduceMotion ? "auto" : "smooth",
      });
      setIndex(target);
    },
    [pageCount, reduceMotion]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(track);
    const visibility = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    visibility.observe(track);
    return () => {
      resize.disconnect();
      visibility.disconnect();
    };
  }, [measure, events]);

  // Keep the dots honest when the reader scrolls the track themselves.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const step = stepOf(track);
        if (step > 0) setIndex(Math.round(track.scrollLeft / step));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const canScroll = pageCount > 1;
  const autoplay = canScroll && !reduceMotion && !paused && inView && !dragging;

  useEffect(() => {
    if (!autoplay) return;
    const tick = () => {
      if (document.visibilityState === "hidden") return;
      scrollToIndex(index + 1);
    };
    const timer = window.setInterval(tick, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [autoplay, index, scrollToIndex]);

  return (
    <div
      className="flex flex-col gap-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <section
        aria-roledescription="carousel"
        aria-label={label}
        className="relative"
      >
        <ul
          ref={trackRef}
          aria-live={autoplay ? "off" : "polite"}
          onPointerDown={() => setDragging(true)}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          onTouchEnd={() => setDragging(false)}
          className="carousel-track -mx-6 -my-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-6 px-6 py-4 md:-mx-10 md:gap-8 md:scroll-px-10 md:px-10"
        >
          {events.map((event, i) => (
            <li
              key={event.id}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${events.length}`}
              className="w-full shrink-0 snap-start md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]"
            >
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      </section>

      {canScroll && (
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => scrollToIndex(index - 1)}
            aria-label="Previous events"
            className="btn btn-inverse border-black-10 h-11 w-11 p-0 text-black"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          <ol aria-label="Choose a slide" className="flex items-center gap-2">
            {Array.from({ length: pageCount }, (_, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  className={`block h-2.5 rounded-full transition-[width,background-color] duration-(--dur-base) ease-out-quart ${
                    i === index ? "bg-blue w-7" : "bg-black-30 hover:bg-black-80 w-2.5"
                  }`}
                />
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => scrollToIndex(index + 1)}
            aria-label="Next events"
            className="btn btn-inverse border-black-10 h-11 w-11 p-0 text-black"
          >
            <CaretRight size={20} weight="bold" />
          </button>
        </div>
      )}
    </div>
  );
}
