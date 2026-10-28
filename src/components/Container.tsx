import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

/** Shared responsive content width used by editorial sections and page shells. */
export default function Container({ as: Component = "div", className = "", ...props }: ContainerProps) {
  return (
    <Component
      className={`mx-auto w-full max-w-shell px-5 sm:px-8 lg:px-12 ${className}`.trim()}
      {...props}
    />
  );
}
