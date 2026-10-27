import React from "react";

interface StatusBadgeProps {
  status: "Live" | "In development";
  tone?: "dark" | "light";
  className?: string;
}

/**
 * Live = soft green with a slow pulsing ring.
 * In development = quiet outlined pill, deliberately understated.
 */
export default function StatusBadge({ status, tone = "dark", className = "" }: StatusBadgeProps) {
  const live = status === "Live";
  const scheme =
    tone === "light"
      ? live
        ? "status-live-light"
        : "status-dev-light"
      : live
        ? "status-live"
        : "status-dev";

  return (
    <span className={`status-badge ${scheme} ${className}`}>
      <span className="relative flex h-1.5 w-1.5 items-center justify-center">
        {live && (
          <span
            className="animate-pulse-ring absolute inline-flex h-1.5 w-1.5 rounded-full bg-current"
            aria-hidden="true"
          />
        )}
        <span
          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
            live ? "bg-current" : "border border-current bg-transparent"
          }`}
          aria-hidden="true"
        />
      </span>
      {status}
    </span>
  );
}
