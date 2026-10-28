"use client";

import React from "react";
import { productsData } from "@/data/vectis";
import { productMedia } from "@/data/home";
import Atmosphere from "./Atmosphere";
import { Reveal } from "./Reveal";
import ProductCard from "./ProductCard";

/** Light products section on a clean, cool-gray surface. */
export default function ProductsSection() {
  return (
    <section
      id="products"
      className="relative isolate overflow-hidden bg-canvas py-24 text-char sm:py-32"
    >
      <Atmosphere tone="light" grid />

      <div className="relative z-10 mx-auto max-w-shell px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 border-b border-char/[0.14] pb-14 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <span className="eyebrow eyebrow-light">// Products</span>
            <h2 className="mt-5 max-w-3xl font-serif text-[clamp(2.3rem,5.1vw,4.6rem)] leading-[1.04] tracking-[-0.03em] text-char">
              A focused portfolio of{" "}
              <span className="italic text-brass-deep">software products.</span>
            </h2>
            <p className="mt-4 font-serif text-xl italic text-char-soft sm:text-2xl">
              What we&apos;re building.
            </p>
          </Reveal>

          <Reveal delay={0.14} className="lg:col-span-4 lg:pl-8">
            <p className="text-base leading-relaxed text-char-soft">
              Software crafted for physical commerce and operational truth. One flagship desktop
              system live in daily operations, and two companion products in active development.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-char-faint">
              Each one built around a specific problem. Each one built to last.
            </p>
            <span className="section-index mt-6 block">03 / 06 — Products</span>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {productsData.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              media={productMedia[product.slug]}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
