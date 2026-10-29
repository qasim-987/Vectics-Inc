import React from "react";

interface SectionLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

/** Shared understated section label. */
export default function SectionLabel({ children, className = "", ...props }: SectionLabelProps) {
  return (
    <span className={`eyebrow ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
