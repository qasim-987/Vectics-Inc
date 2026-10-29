import React from "react";

interface StatusBadgeProps {
  status: "Live" | "In development";
  tone?: "dark" | "light";
  className?: string;
}

/** A compact, text-only product status label without a decorative dot. */
export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  return <span className={`status-badge ${className}`}>{status}</span>;
}
