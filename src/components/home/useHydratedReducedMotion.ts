"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** Keep SSR and the first client render identical before applying OS preferences. */
export function useHydratedReducedMotion() {
  const prefersReducedMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);
  return hydrated && Boolean(prefersReducedMotion);
}
