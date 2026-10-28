import React from "react";

interface SectionLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

/** Small monospace editorial label. Pass the section name without the slashes. */
export default function SectionLabel({ children, className = "", ...props }: SectionLabelProps) {
  return (
    <span className={`eyebrow ${className}`.trim()} {...props}>
      {String(children).startsWith("//") ? children : `// ${children}`}
    </span>
  );
}
