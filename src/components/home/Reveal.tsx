"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger in seconds. */
  delay?: number;
  distance?: number;
  duration?: number;
  amount?: number;
  style?: React.CSSProperties;
}

/**
 * Scroll-triggered fade-up. Only transform + opacity are animated so the
 * compositor can run it at 60fps. Reduced-motion users get static content.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 26,
  duration = 0.85,
  amount = 0.18,
  style,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={{ willChange: "transform, opacity", ...style }}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

interface RevealImageProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Editorial mask reveal for photography.
 *
 * IMPORTANT: the clipped element itself must NOT be the IntersectionObserver
 * target — `clip-path: inset(0 0 100% 0)` gives it zero visible area, so the
 * observer would never fire and the image would stay hidden forever. We
 * observe an unclipped wrapper and drive the inner mask from that state.
 */
export function RevealImage({ children, className, delay = 0 }: RevealImageProps) {
  const reduce = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (reduce) {
      setInView(true);
      return;
    }
    const el = wrapperRef.current;
    if (!el) return;
    // Anchor links / restored scroll positions can land past the image; reveal
    // those immediately instead of leaving them masked forever.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.98) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduce]);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={wrapperRef} className={className}>
      <motion.div
        className="relative h-full w-full"
        initial={false}
        animate={
          inView
            ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }
            : { clipPath: "inset(0% 0% 100% 0%)", scale: 1.07 }
        }
        transition={{ duration: 1.1, delay, ease: EASE }}
        style={{ willChange: "clip-path, transform" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
