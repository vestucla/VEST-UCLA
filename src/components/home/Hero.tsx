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

/** Peak offset in px for each layer, at the far edge of the hero. */
const SKY_POINTER = 14;
const PLANE_POINTER = 40;
/** The plane banks into the direction the cursor pulls it. */
const PLANE_TILT_DEG = 5;

/**
 * Hero: a 1-bit dithered sky with a paper plane climbing out of the cloud deck.
 *
 * Two independent parallax inputs are summed per layer:
 *
 *  - Scroll, mapped over the hero's own exit from the viewport.
 *  - Pointer, mapped from the hero's centre out to its edges.
 *
 * Both drive transform only — the page scroll itself is never touched, so
 * there is no scroll jacking, and the whole effect drops out under
 * `prefers-reduced-motion`. The plane moves ~3x the sky, which is what sells
 * the depth: matching speeds would just look like the whole image sliding.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const skyScrollY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const planeScrollY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const planeScrollX = useTransform(scrollYProgress, [0, 1], [0, 48]);

  // Pointer position as -1..1 from the hero's centre.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  // Binding a transform straight to the cursor reads as mechanical, because
  // real mass does not teleport. A low-stiffness, heavily damped spring gives
  // the layers weight and lets them coast after the cursor stops — no bounce,
  // which on a decorative background would read as a glitch.
  const spring = { stiffness: 55, damping: 20, mass: 0.9 };
  const smoothX = useSpring(pointerX, spring);
  const smoothY = useSpring(pointerY, spring);

  // The sky drifts *against* the cursor and the plane *with* it, which widens
  // the apparent gap between them for the same amount of travel.
  const skyX = useTransform(smoothX, (v) => v * -SKY_POINTER);
  const skyY = useTransform(
    () => skyScrollY.get() + smoothY.get() * -SKY_POINTER * 0.7,
  );
  const planeX = useTransform(
    () => planeScrollX.get() + smoothX.get() * PLANE_POINTER,
  );
  const planeY = useTransform(
    () => planeScrollY.get() + smoothY.get() * PLANE_POINTER * 0.7,
  );
  const planeRotate = useTransform(smoothX, (v) => v * PLANE_TILT_DEG);

  useEffect(() => {
    // Touch pointers have no hover position to track, and a `pointermove`
    // there would snap the layers to wherever the finger last landed.
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;

    // Tracked on the window, not the section: the hero stays partly on screen
    // for a while, and the parallax should keep responding while it does.
    const onPointerMove = (event: PointerEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect || !rect.width || !rect.height) return;
      pointerX.set(
        Math.max(
          -1,
          Math.min(
            1,
            (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2),
          ),
        ),
      );
      pointerY.set(
        Math.max(
          -1,
          Math.min(
            1,
            (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2),
          ),
        ),
      );
    };

    // Cursor left the window — settle back to rest instead of holding the
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
      className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-blue pt-28 md:h-[840px] md:pt-32"
    >
      {/* Sky. Inset beyond the section on both axes so neither the scroll nor
          the pointer shift can ever expose an edge. */}
      <motion.div
        style={reduceMotion ? undefined : { x: skyX, y: skyY }}
        className="absolute -inset-x-8 -top-16 -bottom-16 -z-10 will-change-transform"
      >
        <Image
          src="/images/hero-sky.png"
          alt=""
          fill
          priority
          // A 2-colour ordered-dither PNG: re-encoding it as lossy WebP would
          // smear the pattern and land *bigger* than the 10 KB original.
          unoptimized
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </motion.div>

      <motion.div
        style={
          reduceMotion
            ? undefined
            : { x: planeX, y: planeY, rotate: planeRotate }
        }
        className="pointer-events-none absolute right-[-4%] top-[14%] -z-10 w-[46vw] max-w-[360px] will-change-transform md:right-[6%] md:top-[18%]"
      >
        <Image
          src="/images/paper-plane.svg"
          alt=""
          width={320}
          height={180}
          priority
          className="h-auto w-full drop-shadow-[0_8px_24px_rgba(16,16,61,0.25)]"
        />
      </motion.div>

      <div className="container-content relative w-full pb-16 md:pb-0">
        <h1
          id="hero-heading"
          className="max-w-[8.5em] font-display text-display-lg text-white [text-shadow:0_2px_24px_rgba(16,16,61,0.25)]"
        >
          Scaling builder culture at UCLA.
        </h1>
      </div>
    </section>
  );
}
