import React from "react";
import Image, { type ImageProps } from "next/image";

const NEUTRAL_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxNiAxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTAiIGZpbGw9IiNlYWU0ZGMiLz48L3N2Zz4=";

type SiteImageProps = Omit<ImageProps, "placeholder" | "blurDataURL"> & {
  aspectClassName?: string;
  blurDataURL?: string;
  wrapperClassName?: string;
};

/** next/image wrapper for fixed-ratio editorial media with a local blur placeholder. */
export default function SiteImage({
  aspectClassName = "aspect-[4/3]",
  blurDataURL = NEUTRAL_BLUR,
  wrapperClassName = "",
  className = "",
  alt,
  ...imageProps
}: SiteImageProps) {
  return (
    <div className={`relative overflow-hidden ${aspectClassName} ${wrapperClassName}`.trim()}>
      <Image
        {...imageProps}
        alt={alt}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className={`object-cover ${className}`.trim()}
      />
    </div>
  );
}
