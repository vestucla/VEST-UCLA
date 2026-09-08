"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Four corner brackets that snap to whichever link in the surrounding row is
 * hovered or keyboard-focused.
 *
 * Drop it in as the first child of the row — it measures against its own
 * parent and listens on it, so the links themselves stay untouched and can
 * keep being server-rendered. The parent needs `.reticle-row`, which supplies
 * the `position: relative` the brackets are absolutely placed against.
 *
 * One reticle serves the whole row rather than one box per link: moving
 * between links is then a single object crossing the gap, which the eye can
 * track. The motion and the corner geometry live in `.focus-reticle`
 * (globals.css); `--reticle-color` retints it for a dark row.
 */
export function FocusReticle({ targets = "a" }: { targets?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);
  const wasOn = useRef(false);
  const pathname = usePathname();

  // Hover and keyboard focus can both be live at once, so neither drives the
  // brackets directly: each records its own candidate and the reticle
  // resolves them. The pointer wins as the more recent intent, with focus
  // underneath it — so leaving the row hands the brackets back to the focused
  // link rather than stripping it of its only focus indicator.
  const hovered = useRef<HTMLElement | null>(null);
  const focused = useRef<HTMLElement | null>(null);

  const sync = useCallback(() => {
    const reticle = ref.current;
    const row = reticle?.parentElement;
    const target = hovered.current ?? focused.current;
    if (!reticle || !row || !target) {
      setOn(false);
      return;
    }
    const rowBox = row.getBoundingClientRect();
    const box = target.getBoundingClientRect();
    reticle.style.setProperty("--x", `${box.left - rowBox.left}px`);
    reticle.style.setProperty("--y", `${box.top - rowBox.top}px`);
    reticle.style.setProperty("--w", `${box.width}px`);
    reticle.style.setProperty("--h", `${box.height}px`);
    setOn(true);
  }, []);

  const clear = useCallback(() => {
    hovered.current = null;
    focused.current = null;
    setOn(false);
  }, []);

  // Delegated from the row, not bound per link: the links stay plain markup,
  // and a row whose contents change never needs rebinding.
  useEffect(() => {
    const row = ref.current?.parentElement;
    if (!row) return;

    const pick = (e: Event) =>
      (e.target as Element | null)?.closest?.(targets) as HTMLElement | null;

    const onPointerOver = (e: PointerEvent) => {
      // Touch has no hover to release the reticle on, so it would stick to
      // the last-tapped link; a mouse is the only pointer that gets brackets.
      if (e.pointerType !== "mouse") return;
      const target = pick(e);
      if (!target) return;
      hovered.current = target;
      sync();
    };

    const onPointerLeave = () => {
      hovered.current = null;
      sync();
    };

    const onFocusIn = (e: FocusEvent) => {
      const target = pick(e);
      if (!target) return;
      focused.current = target;
      sync();
    };

    const onFocusOut = (e: FocusEvent) => {
      focused.current = null;
      // Tabbing along the row is one continuous move. Resolving on the way
      // out would put the reticle through an off state, and off -> on skips
      // the slide by design — the brackets would jump to the next link
      // instead of travelling there. The incoming focusin handles it.
      if (row.contains(e.relatedTarget as Node)) return;
      sync();
    };

    row.addEventListener("pointerover", onPointerOver);
    row.addEventListener("pointerleave", onPointerLeave);
    row.addEventListener("focusin", onFocusIn);
    row.addEventListener("focusout", onFocusOut);
    return () => {
      row.removeEventListener("pointerover", onPointerOver);
      row.removeEventListener("pointerleave", onPointerLeave);
      row.removeEventListener("focusin", onFocusIn);
      row.removeEventListener("focusout", onFocusOut);
    };
  }, [targets, sync]);

  // A resize relays out the row under a pointer that never moved, leaving the
  // brackets measured against the old layout. Drop them; the next pointer
  // move re-measures.
  useEffect(() => {
    if (!on) return;
    window.addEventListener("resize", clear);
    return () => window.removeEventListener("resize", clear);
  }, [on, clear]);

  // A route change repaints the row under a pointer that never moved; stale
  // brackets would be left pointing at the link you just left.
  useEffect(() => {
    clear();
  }, [pathname, clear]);

  // Off -> on has no previous position worth animating from, so commit the
  // move with transitions suppressed for that one frame: the brackets close
  // in on the link they are over, rather than flying across the row to it.
  useLayoutEffect(() => {
    const reticle = ref.current;
    if (reticle && on && !wasOn.current) {
      reticle.style.transition = "none";
      void reticle.offsetWidth;
      reticle.style.transition = "";
    }
    wasOn.current = on;
  }, [on]);

  return (
    // Decoration only — each link's own colour and aria-current carry the
    // state for anyone who cannot see the brackets.
    <span ref={ref} aria-hidden="true" data-on={on} className="focus-reticle">
      <span className="focus-reticle-corner" data-corner="tl" />
      <span className="focus-reticle-corner" data-corner="tr" />
      <span className="focus-reticle-corner" data-corner="bl" />
      <span className="focus-reticle-corner" data-corner="br" />
    </span>
  );
}
