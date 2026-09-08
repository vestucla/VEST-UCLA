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
 * Hard bounds on the jet's excursion, in px, applied after scroll and pointer
 * are summed. The sum already peaks just inside these, so they never stall the
 * motion — they exist so that tuning the constants above can't push the layer
 * somewhere the composition was never checked at.
 */
const JET_RISE_MAX = 156;
const JET_DRIFT_MAX = 88;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

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

  // The cue has done its job the moment the page moves, so it fades out over
  // the first sliver of the hero's exit rather than riding along at full
  // strength and having to be scrolled past twice.
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

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
  const jetX = useTransform(() =>
    clamp(
      jetScrollX.get() + smoothX.get() * JET_POINTER,
      -JET_DRIFT_MAX,
      JET_DRIFT_MAX,
    ),
  );
  const jetY = useTransform(() =>
    clamp(
      jetScrollY.get() + smoothY.get() * JET_POINTER * 0.6,
      -JET_RISE_MAX,
      JET_RISE_MAX,
    ),
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
      // 800px on desktop, and never shorter than a phone viewport.
      className="relative isolate overflow-hidden bg-hero-sky max-md:min-h-[560px] md:h-[800px]"
    >
      {/* The sky is inset 56px past the section on every side, which its 47px
          of peak travel clears outright, so no amount of parallax can drag an
          edge into view. */}
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

      {/* Given an explicit size at the PNG's own 12:7 ratio rather than being
          stretched to a full-bleed box, so the jet holds one size and one
          height up the frame at every viewport width instead of ballooning on
          wide monitors the way an `object-cover` layer does. Placed left of
          centre so the trail crosses the frame; the empty right third of the
          PNG hangs off past the hero and costs nothing. */}
      <motion.div
        aria-hidden="true"
        style={reduceMotion ? undefined : { x: jetX, y: jetY }}
        className="pointer-events-none absolute bottom-7 -left-[340px] -z-10 h-[560px] w-[960px] will-change-transform md:bottom-0 md:left-0 md:h-[800px] md:w-[1371px]"
      >
        <Image
          src="/images/hero-plane.png"
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-fill"
        />
      </motion.div>

      {/* The headline sits far left, flush with the nav pill's inner edge
          rather than the 120px body gutter the rest of the page uses. */}
      <div className="absolute inset-0 pl-6 pr-6 md:pl-[50px]">
        <h1
          id="hero-heading"
          className="font-display text-display-lg absolute bottom-24 max-w-[10em] text-white [text-shadow:0_2px_24px_rgba(16,16,61,0.28)] md:bottom-auto md:top-[46%] md:max-w-[470px]"
        >
          VEST is building the future in Los Angeles.
        </h1>
      </div>

      {/* Scroll cue. Decorative rather than a control: it points at the page
          below, which a keyboard or screen-reader user reaches by moving on
          through the document anyway, so announcing it would only add a stop
          that leads nowhere new. */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: cueOpacity }}
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-9"
      >
        <motion.svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          // A drop of just under the chevron's own height, eased so it hangs a
          // beat at the bottom of the fall — a linear bob reads as a metronome.
          animate={reduceMotion ? undefined : { y: [0, 9, 0] }}
          transition={{
            duration: 1.9,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.35,
          }}
          className="text-white drop-shadow-[0_2px_10px_rgba(16,16,61,0.45)]"
        >
          <path
            d="m5 9 7 7 7-7"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>
    </section>
  );
}
