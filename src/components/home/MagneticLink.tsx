"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";

interface MagneticLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Peak pixel offset at the edge of the button. */
  strength?: number;
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * A CTA with a restrained magnetic pull toward the pointer. The transform is
 * written directly to the DOM node (no React re-render on every mouse move),
 * and is disabled for reduced-motion / touch users. The `.btn` CSS classes
 * supply the fill-slide and shine sweep.
 */
export default function MagneticLink({
  href,
  children,
  className = "btn btn-primary",
  strength = 9,
  ariaLabel,
  onClick,
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const [canHover, setCanHover] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduce || !canHover || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    ref.current.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
  };

  const common = {
    ref,
    className,
    "aria-label": ariaLabel,
    onMouseEnter: () => {
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) setCanHover(true);
    },
    onMouseMove: handleMove,
    onMouseLeave: () => {
      setCanHover(false);
      reset();
    },
    onBlur: reset,
    style: { willChange: "transform" as const },
  };

  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} {...common} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} {...common} target="_blank" rel="noopener noreferrer" onClick={onClick}>
      {children}
    </a>
  );
}
