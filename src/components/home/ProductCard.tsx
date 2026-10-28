"use client";

import React from "react";
import Image from "next/image";
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

/**
 * Product card: gradient border glow, lift, slow image zoom and an overlay
 * caption reveal. The "Explore" arrow slides in on hover/focus.
 */
export default function ProductCard({ product, media, index }: ProductCardProps) {
  return (
    <Reveal delay={index * 0.11} className="h-full">
      <article className="gradient-border group relative flex h-full flex-col overflow-hidden rounded-card border border-char/[0.12] bg-canvas-raised shadow-soft transition-[transform,box-shadow] duration-500 ease-expo hover:-translate-y-2 hover:shadow-lift focus-within:-translate-y-2 focus-within:shadow-lift">
        {/* --------------------------- Image --------------------------- */}
        <RevealImage className="relative aspect-[4/3] overflow-hidden bg-canvas-deep">
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
            quality={80}
            placeholder="blur"
            blurDataURL={media.blurDataURL}
            className="object-cover transition-transform duration-[900ms] ease-expo group-hover:scale-[1.08]"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-char/70 via-transparent to-transparent opacity-70"
            aria-hidden="true"
          />

          <div className="absolute left-4 top-4 z-10 sm:left-5 sm:top-5">
            {/* Badge sits over dark photography, so use the light-on-dark scheme. */}
            <StatusBadge status={product.statusBadge} tone="dark" />
          </div>

          {/* Caption reveal on hover — uses existing product copy only */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-4 p-5 opacity-0 transition-all duration-500 ease-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <span className="block font-mono text-[0.6rem] uppercase tracking-[0.2em] text-brass-light">
              Field note · 0{index + 1}
            </span>
            <p className="mt-1.5 max-w-[36ch] text-sm leading-relaxed text-paper/90">
              {product.headline}
            </p>
          </div>
        </RevealImage>

        {/* --------------------------- Body ---------------------------- */}
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-char-faint">
              Product 0{index + 1}
            </span>
            <span className="h-px w-10 bg-brass/50" aria-hidden="true" />
          </div>

          <h3 className="mt-5 font-serif text-[2rem] leading-tight tracking-[-0.02em] text-char sm:text-[2.3rem]">
            {product.name}
          </h3>
          <p className="mt-2 font-mono text-[0.66rem] uppercase leading-relaxed tracking-[0.1em] text-brass-deep">
            {product.headline}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-char-soft">{product.shortDesc}</p>

          <Link
            href={`/${product.slug}`}
            className="mt-auto inline-flex items-center gap-3 pt-8 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-char transition-colors hover:text-brass-deep"
          >
            <span className="link-underline">Explore {product.name}</span>
            <span className="relative flex h-6 w-6 items-center justify-center overflow-hidden">
              <ArrowRight className="h-4 w-4 -translate-x-3 opacity-0 transition-all duration-500 ease-expo group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100" />
            </span>
          </Link>
        </div>
      </article>
    </Reveal>
  );
}
