"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A mint marker-pen mark that strokes itself on when the phrase scrolls into
 * view. It carries its own observer rather than taking a FadeIn prop: this is
 * a <span> inside a paragraph, so it should fire on the phrase's own position
 * and land just after the block it sits in has faded up.
 */
export function Highlight({
  children,
  delay = 160,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.8, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={`highlight highlight-sweep${isVisible ? " is-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </span>
  );
}
