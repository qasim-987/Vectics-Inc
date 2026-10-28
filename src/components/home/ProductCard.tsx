"use client";

import React from "react";
import SiteImage from "@/components/SiteImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProductItem } from "@/data/vectis";
import type { MediaImage } from "@/data/home";
import StatusBadge from "./StatusBadge";
import { Reveal, RevealImage } from "./Reveal";

interface ProductCardProps {
  product: ProductItem;
  media: MediaImage;
  index: number;
}

/** Consistent product card with a contained image, neutral surface and quiet status label. */
export default function ProductCard({ product, media, index }: ProductCardProps) {
  return (
    <Reveal delay={Math.min(index * 0.06, 0.18)} className="h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface shadow-soft">
        <RevealImage className="relative aspect-[4/3] overflow-hidden bg-bg">
          <SiteImage
            src={media.src}
            alt={media.alt}
            fill
            sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
            quality={80}
            blurDataURL={media.blurDataURL}
            aspectClassName="aspect-[4/3]"
            className="object-cover"
          />
        </RevealImage>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-sm text-text-muted">Field note · 0{index + 1}</span>
            <StatusBadge status={product.statusBadge} />
          </div>
          <h3 className="mt-4 text-text">{product.name}</h3>
          <p className="mt-2 text-sm font-medium text-accent">{product.headline}</p>
          <p className="mt-4 text-sm leading-6 text-text-muted">{product.shortDesc}</p>
          <Link
            href={`/${product.slug}`}
            className="mt-6 inline-flex min-h-12 items-center gap-2 text-sm font-medium text-text hover:text-accent focus-visible:text-accent"
          >
            <span>Explore {product.name}</span><ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </article>
    </Reveal>
  );
}
