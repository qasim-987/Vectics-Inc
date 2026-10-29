"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  staggerIndex?: number;
}

export default function Reveal({ children, className = "", staggerIndex = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const staggerValue = getComputedStyle(document.documentElement).getPropertyValue("--motion-stagger").trim();
    const staggerMs = Number.parseFloat(staggerValue) || 0;
    element.style.setProperty("--reveal-delay", `${Math.max(0, staggerIndex) * staggerMs}ms`);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.unobserve(entry.target);
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [staggerIndex]);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
