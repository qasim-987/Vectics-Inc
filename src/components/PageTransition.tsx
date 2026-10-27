"use client";

import React from "react";
import { usePathname } from "next/navigation";

/**
 * Smooth page-load and route transitions. Implemented with a CSS keyframe
 * (not Framer Motion) so content is visible in the server-rendered HTML even
 * before hydration. Keying by pathname replays the fade on every navigation.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
