import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "text";
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  external?: boolean;
  ariaLabel?: string;
};

/** Shared CTA link: internal links use Next navigation; external links are safe by default. */
export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
  external = false,
  ariaLabel,
}: ButtonProps) {
  const classes = `${variant === "primary" ? "btn btn-primary" : "group inline-flex items-center gap-2 font-medium text-current transition-colors hover:text-brass-deep"} ${className}`.trim();
  const content = (
    <>
      <span>{children}</span>
      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} onClick={onClick} aria-label={ariaLabel}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick} aria-label={ariaLabel}>
      {content}
    </Link>
  );
}
