"use client";

import React from "react";

interface AtmosphereProps {
  /** Light sections get an ivory mesh, dark sections an ink/brass mesh. */
  tone?: "light" | "dark";
  /** Show the faint logistics grid. */
  grid?: boolean;
  /** Show the route-line SVG. */
  routes?: boolean;
  className?: string;
}

/**
 * Purely decorative, pointer-events-none background layer. Blurred gradient
 * blobs drift with `transform` only, over a static fine grain + a faint grid /
 * route-line pattern. One layer per section, no canvas, no scroll listeners.
 */
export default function Atmosphere({
  tone = "dark",
  grid = true,
  routes = false,
  className = "",
}: AtmosphereProps) {
  const isLight = tone === "light";

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Drifting gradient mesh */}
      <div
        className={`mesh-blob animate-mesh-drift -left-[18%] -top-[35%] h-[62%] w-[70%] ${
          isLight ? "bg-[rgb(196_154_86/0.16)]" : "bg-[rgb(196_154_86/0.10)]"
        }`}
      />
      <div
        className={`mesh-blob animate-mesh-drift -bottom-[45%] -right-[15%] h-[72%] w-[62%] [animation-delay:-9s] ${
          isLight ? "bg-[rgb(120_87_40/0.09)]" : "bg-[rgb(56_88_124/0.13)]"
        }`}
      />

      {/* Faint grid */}
      {grid && <div className={`absolute inset-0 ${isLight ? "route-grid-light" : "route-grid"}`} />}

      {/* Route lines: a logistics motif */}
      {routes && (
        <div
          className="absolute inset-x-0 bottom-0 h-[52%] opacity-[0.13] [background-size:cover] [background-position:center_bottom] [background-repeat:no-repeat]"
          style={{ backgroundImage: "url('/images/route-lines.svg')" }}
        />
      )}

      {/* Fine film grain */}
      <div className="grain-layer absolute inset-0" />
    </div>
  );
}
