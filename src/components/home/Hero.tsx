"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/**
 * Peak pointer offset per layer, in px, reached at the edge of the hero.
 * The jet travels ~3.5x the sky — matching them would read as the whole
 * photograph sliding rather than as depth.
 */
const SKY_POINTER = 12;
const JET_POINTER = 42;
/** Scroll travel over the hero's exit from the viewport. */
const SKY_SCROLL = -40;
const JET_SCROLL = -130;

/**
 * Hero: a 1-bit dithered sky with a jet climbing out of the cloud deck.
 *
 * The design ships the sky and the jet as two separate full-bleed layers,
 * which is what makes the parallax possible at all — the jet can move against
 * its own background instead of with it. Each layer sums two inputs:
 *
 *   - scroll, mapped over the hero's exit from the viewport
 *   - pointer, mapped from the hero's centre out to its edges
 *
 * Both drive transform only, so the page scroll is never touched and the whole
 * effect can drop out under `prefers-reduced-motion`.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const skyScrollY = useTransform(scrollYProgress, [0, 1], [0, SKY_SCROLL]);
  const jetScrollY = useTransform(scrollYProgress, [0, 1], [0, JET_SCROLL]);
  const jetScrollX = useTransform(scrollYProgress, [0, 1], [0, 44]);

  // Pointer position as -1..1 from the hero's centre.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  // Driving a transform straight off the cursor reads mechanical, because real
  // mass does not teleport. A soft, heavily damped spring gives both layers
  // weight and lets them coast after the cursor stops. No bounce: on a
  // background photograph an overshoot reads as a glitch, not as life.
  const springConfig = { stiffness: 55, damping: 20, mass: 0.9 };
  const smoothX = useSpring(pointerX, springConfig);
  const smoothY = useSpring(pointerY, springConfig);

  // The sky drifts against the cursor and the jet with it, which widens the
  // apparent gap between the planes for the same amount of travel.
  const skyX = useTransform(smoothX, (v) => v * -SKY_POINTER);
  const skyY = useTransform(
    () => skyScrollY.get() + smoothY.get() * -SKY_POINTER * 0.6,
  );
  const jetX = useTransform(
    () => jetScrollX.get() + smoothX.get() * JET_POINTER,
  );
  const jetY = useTransform(
    () => jetScrollY.get() + smoothY.get() * JET_POINTER * 0.6,
  );

  useEffect(() => {
    // A touch pointer has no hover position to track — a `pointermove` there
    // would snap both layers to wherever the finger last landed.
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

    // Tracked on the window rather than the section: the hero stays partly on
    // screen for a while and should keep responding while it does.
    const onPointerMove = (event: PointerEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect?.width || !rect.height) return;
      const nx =
        (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const ny =
        (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      pointerX.set(Math.max(-1, Math.min(1, nx)));
      pointerY.set(Math.max(-1, Math.min(1, ny)));
    };

    // Cursor left the window — settle back to rest rather than holding the
    // last offset until it returns.
    const onPointerLeave = () => {
      pointerX.set(0);
      pointerY.set(0);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [pointerX, pointerY, reduceMotion]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-heading"
      // 840px at the design width, and never shorter than a phone viewport.
      className="relative isolate overflow-hidden bg-hero-sky max-md:min-h-[560px] md:h-[840px]"
    >
      {/* Both layers are inset past the section on both axes so no amount of
          parallax can drag an edge into view. */}
      <motion.div
        aria-hidden="true"
        style={reduceMotion ? undefined : { x: skyX, y: skyY }}
        className="absolute -inset-x-8 -top-14 -bottom-14 -z-20 will-change-transform"
      >
        <Image
          src="/images/hero-sky.png"
          alt=""
          fill
          priority
          // An ordered-dither PNG quantised to 128 colours. Re-encoding as
          // lossy WebP smears the dither pattern and lands larger.
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        style={reduceMotion ? undefined : { x: jetX, y: jetY }}
        className="pointer-events-none absolute -inset-x-8 -top-14 -bottom-14 -z-10 will-change-transform"
      >
        <Image
          src="/images/hero-plane.png"
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* The headline sits far left, flush with the nav pill's inner edge
          rather than the 120px body gutter the rest of the page uses. */}
      <div className="relative h-full pl-6 pr-6 md:pl-[50px]">
        <h1
          id="hero-heading"
          className="font-display text-display-lg absolute bottom-24 max-w-[10em] text-white [text-shadow:0_2px_24px_rgba(16,16,61,0.28)] md:bottom-auto md:top-[46%] md:max-w-[470px]"
        >
          VEST is building the future in Los Angeles.
        </h1>
      </div>
    </section>
  );
}
